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
          },
        });
        return {
          assignmentId: assignment.id,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          formTitle: assignment.form.title,
          formKey: assignment.form.formKey,
        };
      })
    );

    // Filter out assignments that don't have admin-filled submissions
    // Special-case: allow emergency_drill even if not admin-filled
    const validSubmissions = formSubmissions.filter(sub => 
      sub.submissionId && (sub.filledByAdmin || sub.formKey === 'emergency_drill')
    );

    if (validSubmissions.length === 0) {
      return NextResponse.json(
        { error: "No admin-filled forms found for the selected assignments" },
        { status: 400 }
      );
    }

    // Generate unique token for signature batch
    const batchToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // Expires in 3 days

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

    // Create SignatureBatchForm entries for each valid submission
    const signatureBatchForms = await Promise.all(
      validSubmissions.map(async (submission) => {
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
