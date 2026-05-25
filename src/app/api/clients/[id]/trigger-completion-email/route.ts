import { NextRequest, NextResponse } from "next/server";
import { getClientById, getClientAssignments, getSubmission } from "@/lib/db";
import { validateClientOwnership, isOwnershipError } from '@/lib/client-ownership';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ownership = await validateClientOwnership(id);
    if (isOwnershipError(ownership)) return ownership;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    console.log(`📧 [MANUAL EMAIL TRIGGER] Checking batch completion for clientId: ${id}`);

    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    if (!client.email) {
      return NextResponse.json(
        { error: "Client does not have an email address" },
        { status: 400 }
      );
    }

    const allAssignments = await getClientAssignments(id);

    if (allAssignments.length === 0) {
      return NextResponse.json(
        { error: "No forms assigned to this client" },
        { status: 404 }
      );
    }

    console.log(`📋 [MANUAL EMAIL TRIGGER] Found ${allAssignments.length} form assignments`);

    const completedAssignments = allAssignments.filter(
      (a) => a.currentStatus === "completed"
    );

    console.log(`📊 [MANUAL EMAIL TRIGGER] Status: ${completedAssignments.length}/${allAssignments.length} completed`);

    if (completedAssignments.length !== allAssignments.length) {
      return NextResponse.json({
        error: "Not all forms are completed",
        details: `Only ${completedAssignments.length} out of ${allAssignments.length} forms are completed`,
        completedCount: completedAssignments.length,
        totalCount: allAssignments.length,
      }, { status: 400 });
    }

    const completedFormSubmissions = await Promise.all(
      completedAssignments.map((assignment) =>
        getSubmission(assignment.clientId, assignment.formId, assignment.formVersion, assignment.instanceNumber)
      )
    );

    const completedFormsData = completedFormSubmissions
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .map((submission) => ({
        id: submission.id,
        formId: submission.formId,
        title: submission.formTitle,
      }));

    console.log(`📎 [MANUAL EMAIL TRIGGER] Found ${completedFormsData.length} completed submissions`);

    if (completedFormsData.length === 0) {
      return NextResponse.json({
        error: "No completed form submissions found",
      }, { status: 404 });
    }

    const adminId = allAssignments[0].assignedById;
    const batchId = allAssignments[0].batchId;

    console.log(`📧 [MANUAL EMAIL TRIGGER] Sending dual notification email...`, {
      clientName: client.name,
      clientEmail: client.email,
      adminId,
      batchId,
      formsCount: completedFormsData.length,
    });

    const emailResponse = await fetch(
      `${process.env.INTERNAL_API_URL || process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "dual_notification",
          adminId,
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          batchId,
          completedForms: completedFormsData,
          completedAt: new Date().toLocaleString(),
        }),
      }
    );

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json();
      console.error(`❌ [MANUAL EMAIL TRIGGER] Email send failed:`, emailError);
      return NextResponse.json({
        error: "Failed to send email",
        details: emailError.details || emailError.error,
      }, { status: 500 });
    }

    const emailResult = await emailResponse.json();
    console.log(`✅ [MANUAL EMAIL TRIGGER] Emails sent successfully!`, emailResult);

    return NextResponse.json({
      success: true,
      message: `Emails sent to both admin and client with ${completedFormsData.length} PDF attachments`,
      emailResult,
      completedForms: completedFormsData.length,
      recipients: {
        admin: emailResult.adminEmail?.success || false,
        client: emailResult.clientEmail?.success || false,
      },
    });
  } catch (error: any) {
    console.error("❌ [MANUAL EMAIL TRIGGER] Error:", error);
    return NextResponse.json(
      { error: "Failed to trigger completion email", details: error.message },
      { status: 500 }
    );
  }
}
