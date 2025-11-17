import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Manually trigger completion email for a client with all completed forms
 * Useful when forms were completed before email system was enabled
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id);

    if (isNaN(clientId)) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    console.log(`📧 [MANUAL EMAIL TRIGGER] Checking batch completion for clientId: ${clientId}`);

    // Get client info
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, email: true },
    });

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

    // Find ALL form assignments for this client
    const allAssignments = await prisma.formAssignment.findMany({
      where: { clientId },
      include: {
        form: {
          select: {
            id: true,
            title: true,
            requiresSignature: true,
          },
        },
      },
    });

    if (allAssignments.length === 0) {
      return NextResponse.json(
        { error: "No forms assigned to this client" },
        { status: 404 }
      );
    }

    console.log(`📋 [MANUAL EMAIL TRIGGER] Found ${allAssignments.length} form assignments`);

    // Check if ALL are completed
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

    // Get form submissions for ALL completed assignments (not just submitted ones)
    // Match each completed assignment with its corresponding FormSubmission
    const completedFormSubmissions = await Promise.all(
      completedAssignments.map(async (assignment) => {
        const submission = await prisma.formSubmission.findUnique({
          where: {
            clientId_formId_formVersion: {
              clientId: assignment.clientId,
              formId: assignment.formId,
              formVersion: assignment.formVersion,
            },
          },
          include: {
            form: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        return submission;
      })
    );

    // Filter out null submissions and map to required format
    const completedFormsData = completedFormSubmissions
      .filter((submission): submission is NonNullable<typeof submission> => submission !== null)
      .map((submission) => ({
        id: submission.id,
        formId: submission.formId,
        title: submission.form.title,
      }));

    console.log(`📎 [MANUAL EMAIL TRIGGER] Found ${completedFormsData.length} completed submissions`);

    if (completedFormsData.length === 0) {
      return NextResponse.json({
        error: "No completed form submissions found",
      }, { status: 404 });
    }

    // Get adminId from the first assignment
    const adminId = allAssignments[0].assignedById;
    const batchId = allAssignments[0].batchId;

    console.log(`📧 [MANUAL EMAIL TRIGGER] Sending dual notification email...`, {
      clientName: client.name,
      clientEmail: client.email,
      adminId,
      batchId,
      formsCount: completedFormsData.length
    });

    // Send dual notification email
    const emailResponse = await fetch(
      `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
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
      }
    });

  } catch (error: any) {
    console.error("❌ [MANUAL EMAIL TRIGGER] Error:", error);
    return NextResponse.json(
      { error: "Failed to trigger completion email", details: error.message },
      { status: 500 }
    );
  }
}

