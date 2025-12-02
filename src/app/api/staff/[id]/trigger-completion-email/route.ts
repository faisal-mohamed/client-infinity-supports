import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Manually trigger completion email for a staff member with all completed forms
 * Useful when forms were completed before email system was enabled
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    console.log(`📧 [MANUAL EMAIL TRIGGER] Checking batch completion for staffId: ${staffId}`);

    // Get staff info
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff not found" },
        { status: 404 }
      );
    }

    if (!staff.email) {
      return NextResponse.json(
        { error: "Staff does not have an email address" },
        { status: 400 }
      );
    }

    // Find ALL form assignments for this staff
    const allAssignments = await prisma.staffFormAssignment.findMany({
      where: { staffId },
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
        { error: "No forms assigned to this staff member" },
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

    // Get form submissions for ALL completed assignments
    // First, get the formKey from the assignment's form
    const completedFormSubmissions = await Promise.all(
      completedAssignments.map(async (assignment) => {
        // Get formKey from the form
        const form = await prisma.masterForm.findUnique({
          where: { id: assignment.formId },
          select: { formKey: true, title: true },
        });

        if (!form || !form.formKey) {
          return null;
        }

        const submission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId: assignment.staffId,
              formKey: form.formKey,
            },
          },
        });

        if (!submission) {
          return null;
        }

        return {
          id: submission.id,
          formId: assignment.formId,
          title: form.title,
        };
      })
    );

    // Filter out null submissions
    const completedFormsData = completedFormSubmissions
      .filter((submission): submission is NonNullable<typeof submission> => submission !== null);

    console.log(`📎 [MANUAL EMAIL TRIGGER] Found ${completedFormsData.length} completed submissions`);

    if (completedFormsData.length === 0) {
      return NextResponse.json({
        error: "No completed form submissions found",
      }, { status: 404 });
    }

    // Get adminId from the first assignment
    const adminId = allAssignments[0].assignedById;
    const batchId = allAssignments[0].batchId;
    const staffName = `${staff.firstName} ${staff.surname}`;

    console.log(`📧 [MANUAL EMAIL TRIGGER] Sending dual notification email...`, {
      staffName,
      staffEmail: staff.email,
      adminId,
      batchId,
      formsCount: completedFormsData.length
    });

    // Send dual notification email (admin + staff)
    const emailResponse = await fetch(
      `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "staff_batch_completed",
          adminId,
          staffId: staff.id,
          staffName,
          staffEmail: staff.email,
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
      message: `Emails sent to both admin and staff with ${completedFormsData.length} PDF attachments`,
      emailResult,
      completedForms: completedFormsData.length,
      recipients: {
        admin: emailResult.adminResult?.success || false,
        staff: emailResult.staffResult?.success || false,
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

