import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    const body = await req.json();
    const { formAssignmentIds } = body;

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    if (!formAssignmentIds || !Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
      return NextResponse.json(
        { error: "No form assignments selected" },
        { status: 400 }
      );
    }

    // Verify staff exists
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

    // Get form assignments and their corresponding form submissions
    const assignments = await prisma.staffFormAssignment.findMany({
      where: {
        id: { in: formAssignmentIds },
        staffId: staffId,
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
        { error: "Some form assignments not found or don't belong to this staff" },
        { status: 400 }
      );
    }

    // Get corresponding StaffFormSubmissions for these assignments
    // Note: StaffFormSubmission uses staffId_formKey unique constraint
    const submissions = await Promise.all(
      assignments.map(async (assignment) => {
        const formKey = assignment.form.formKey;
        if (!formKey) return null;

        return await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId: staffId,
              formKey: formKey,
            },
          },
          select: {
            id: true,
            data: true,
            filledByAdmin: true,
            adminFilledAt: true,
            staffSignature: true,
            staffSignedAt: true,
          },
        });
      })
    );

    // Process submissions - create missing ones if needed
    // For staff forms, we allow all forms to be included in the link regardless of status
    // (completed, in_progress, pending all should be accessible)
    const processedSubmissions = await Promise.all(
      assignments.map(async (assignment, index) => {
        const submission = submissions[index];
        const formKey = assignment.form.formKey;

        if (!formKey) {
          return null;
        }

        if (!submission) {
          // Create a new submission if it doesn't exist
          const newSubmission = await prisma.staffFormSubmission.create({
            data: {
              staffId: staffId,
              formId: assignment.formId,
              formVersion: assignment.formVersion,
              formKey: formKey,
              data: {}, // Empty data initially
              filledByAdmin: false, // Not filled by admin yet
              isSubmitted: false,
            },
          });
          return {
            assignmentId: assignment.id,
            formKey: formKey,
            formTitle: assignment.form.title,
            submissionId: newSubmission.id,
            filledByAdmin: false,
            hasData: false,
          };
        }

        // Check if submission has data
        const formData = submission.data as any;
        const hasData = formData && Object.keys(formData).length > 0;

        return {
          assignmentId: assignment.id,
          formKey: formKey,
          formTitle: assignment.form.title,
          submissionId: submission.id,
          filledByAdmin: submission.filledByAdmin || false,
          hasData: hasData,
        };
      })
    );

    // Filter out null submissions (shouldn't happen, but just in case)
    const validSubmissions = processedSubmissions.filter((sub): sub is NonNullable<typeof sub> => sub !== null);

    if (validSubmissions.length === 0) {
      return NextResponse.json(
        { error: "No valid forms found for the selected assignments." },
        { status: 400 }
      );
    }

    // Generate unique token for signature batch
    const batchToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // Expires in 3 days

    // Create StaffFormBatch for signature collection
    const signatureBatch = await prisma.staffFormBatch.create({
      data: {
        staffId: staffId,
        batchToken: batchToken,
        expiresAt: expiresAt,
        isSignatureOnly: true, // This is a signature-only batch
      },
    });

    // Link form submissions to the signature batch
    await prisma.staffSignatureBatchForm.createMany({
      data: validSubmissions.map((sub) => ({
        batchId: signatureBatch.id,
        formSubmissionId: sub.submissionId,
      })),
      skipDuplicates: true,
    });

    // Get the base URL for the signature link
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    
    // Generate signature link URL - using staff signature route
    // Note: We'll need to create a staff signature route that handles StaffFormBatch
    const signatureUrl = `${baseUrl}/staff/signature/${batchToken}`;

    return NextResponse.json({
      success: true,
      signatureUrl: signatureUrl,
      token: batchToken,
      formsCount: validSubmissions.length,
      forms: validSubmissions.map((sub) => ({
        formTitle: sub.formTitle,
        formKey: sub.formKey,
      })),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating staff signature link:", error);
    return NextResponse.json(
      { error: "Failed to generate staff signature link", details: error.message },
      { status: 500 }
    );
  }
}

