import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id);
    const body = await req.json();
    const { formAssignmentIds } = body;

    if (isNaN(clientId)) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    if (!formAssignmentIds || !Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
      return NextResponse.json(
        { error: "No form assignments selected" },
        { status: 400 }
      );
    }

    // Verify client exists
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

    // Get form assignments and their corresponding form submissions
    const assignments = await prisma.formAssignment.findMany({
      where: {
        id: { in: formAssignmentIds },
        clientId: clientId,
      },
      include: {
        form: {
          select: {
            id: true,
            formKey: true,
            title: true,
            version: true,
          },
        },
      },
    });

    if (assignments.length !== formAssignmentIds.length) {
      return NextResponse.json(
        { error: "Some form assignments not found or don't belong to this client" },
        { status: 400 }
      );
    }

    // Get corresponding FormSubmissions for these assignments
    const formSubmissions = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await prisma.formSubmission.findUnique({
          where: {
            clientId_formId_formVersion: {
              clientId: assignment.clientId,
              formId: assignment.formId,
              formVersion: assignment.formVersion,
            },
          },
          select: {
            id: true,
            filledByAdmin: true,
            data: true, // Include data to check if form has content
          },
        });
        return {
          assignmentId: assignment.id,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          hasData: submission?.data && Object.keys(submission.data).length > 0,
          formTitle: assignment.form.title,
          formKey: assignment.form.formKey,
        };
      })
    );

    // Forms that can have signature links even without admin filling
    const formsAllowedWithoutAdminFill = [
      'emergency_drill',
      'participant_risk_assessment',
      'support_action_plan', // Support Action Plan can be signed by client
      'schedule_of_supports', // Schedule of Supports can be signed by client
      'conflict_of_interest',
    ];

    // Create FormSubmission if it doesn't exist for allowed forms
    const processedSubmissions = await Promise.all(
      formSubmissions.map(async (sub) => {
        if (!sub.submissionId && formsAllowedWithoutAdminFill.includes(sub.formKey)) {
          // Create FormSubmission for these forms
          const newSubmission = await prisma.formSubmission.create({
            data: {
              clientId: clientId,
              formId: assignments.find(a => a.id === sub.assignmentId)!.formId,
              formVersion: assignments.find(a => a.id === sub.assignmentId)!.formVersion,
              data: {}, // Empty data - will be filled by client
              filledByAdmin: false, // Not filled by admin yet
              isSubmitted: false,
            },
          });
          return {
            ...sub,
            submissionId: newSubmission.id,
            filledByAdmin: false,
            hasData: false,
          };
        }
        return sub;
      })
    );

    // Filter valid submissions:
    // 1. Must have a submission ID
    // 2. Either filled by admin OR form is in allowed list OR has data (meaning it was worked on)
    const validSubmissions = processedSubmissions.filter(sub =>
      sub.submissionId && (
        sub.filledByAdmin ||
        formsAllowedWithoutAdminFill.includes(sub.formKey) ||
        sub.hasData
      )
    );

    if (validSubmissions.length === 0) {
      const missingSubmissions = processedSubmissions.filter(sub => !sub.submissionId);
      const noDataSubmissions = processedSubmissions.filter(sub => sub.submissionId && !sub.filledByAdmin && !sub.hasData && !formsAllowedWithoutAdminFill.includes(sub.formKey));

      let errorMessage = "Cannot generate signature link: ";
      if (missingSubmissions.length > 0) {
        errorMessage += `Some forms don't have submissions yet. Please save the forms first.`;
      } else if (noDataSubmissions.length > 0) {
        errorMessage += `Some forms are empty. Please fill in the forms before generating a signature link.`;
      } else {
        errorMessage += "No valid forms found for the selected assignments.";
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Generate unique token for signature batch
    const batchToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    // Create FormBatch for signature collection
    const signatureBatch = await prisma.formBatch.create({
      data: {
        clientId: clientId,
        batchToken: batchToken,
        passcode: null, // No passcode for signature-only access
        expiresAt: expiresAt,
        isSignatureOnly: true, // This is crucial for the query in signature-links
      },
    });

    // Create SignatureBatchForm entries and update FormSubmission status
    const signatureBatchForms = await Promise.all(
      validSubmissions.map(async (submission) => {
        // Update FormSubmission to mark as sent to client for completion
        await prisma.formSubmission.update({
          where: { id: submission.submissionId! },
          data: {
            filledByAdmin: false, // Mark as sent to client (waiting for their input)
            // Keep admin data and timestamp - client will review and add to it
          },
        });

        return prisma.signatureBatchForm.create({
          data: {
            batchId: signatureBatch.id,
            formSubmissionId: submission.submissionId!,
          },
        });
      })
    );

    // Log the activity
    await prisma.formActivityLog.create({
      data: {
        clientId: clientId,
        logType: 'ADMIN',
        action: 'Signature Link Generated',
        metadata: {
          batchId: signatureBatch.id,
          batchToken: batchToken,
          formsCount: validSubmissions.length,
          forms: validSubmissions.map(sub => ({
            formTitle: sub.formTitle,
            formKey: sub.formKey,
          })),
        },
      },
    });

    // Get the correct base URL from the request
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3001';
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      success: true,
      token: batchToken,
      batchId: signatureBatch.id,
      expiresAt: expiresAt.toISOString(),
      clientName: client.name,
      formsCount: validSubmissions.length,
      forms: validSubmissions.map(sub => ({
        formTitle: sub.formTitle,
        formKey: sub.formKey,
      })),
      signatureUrl: `${baseUrl}/forms/signature/${batchToken}`,
    });

  } catch (error: any) {
    console.error("Error generating signature link:", error);
    return NextResponse.json(
      { error: "Failed to generate signature link", details: error.message },
      { status: 500 }
    );
  }
}
