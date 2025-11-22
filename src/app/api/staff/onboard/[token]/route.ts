import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // First, try to find a staff by linkToken (old onboard system)
    let staff = await prisma.staff.findUnique({
      where: { linkToken: token },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
        phone: true,
        linkExpiresAt: true,
      },
    });

    // If found by linkToken, check expiration and return staff data with submissions
    if (staff) {
      // Check if token has expired
      if (staff.linkExpiresAt && staff.linkExpiresAt < new Date()) {
        return NextResponse.json(
          { error: "This link has expired" },
          { status: 410 } // Gone
        );
      }

      // Get all form submissions for this staff
      const submissions = await prisma.staffFormSubmission.findMany({
        where: { staffId: staff.id },
        select: {
          formKey: true,
          data: true,
          staffSignature: true,
          staffSignedAt: true,
          adminSignature: true,
          adminSignedAt: true,
        },
      });

      // Format submissions as a dictionary keyed by formKey
      const submissionsDict: Record<string, any> = {};
      submissions.forEach((sub) => {
        submissionsDict[sub.formKey || ''] = {
          ...sub.data,
          staffSignature: sub.staffSignature,
          staffSignedAt: sub.staffSignedAt,
          adminSignature: sub.adminSignature,
          adminSignedAt: sub.adminSignedAt,
        };
      });

      return NextResponse.json({
        staff,
        submissions: submissionsDict,
      });
    }

    // If not found by linkToken, try to find a StaffFormBatch (new batch system)
    // Try both signature-only and non-signature batches (for compatibility)
    let batch = await prisma.staffFormBatch.findFirst({
      where: {
        batchToken: token,
        // First try non-signature batches (onboard)
        OR: [
          { isSignatureOnly: false },
          { isSignatureOnly: null },
        ],
      },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    id: true,
                    formKey: true,
                    title: true,
                    version: true,
                    requiresSignature: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // If not found, try signature-only batches as fallback (for compatibility)
    if (!batch) {
      batch = await prisma.staffFormBatch.findFirst({
        where: {
          batchToken: token,
          isSignatureOnly: true,
        },
        include: {
          staff: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              email: true,
              phone: true,
            },
          },
          signatureForms: {
            include: {
              formSubmission: {
                include: {
                  form: {
                    select: {
                      id: true,
                      formKey: true,
                      title: true,
                      version: true,
                      requiresSignature: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    }

    if (!batch) {
      return NextResponse.json(
        { error: "Link not found or invalid" },
        { status: 404 }
      );
    }

    // Check if batch has expired
    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This link has expired" },
        { status: 410 } // Gone
      );
    }

    // Format submissions as a dictionary keyed by formKey (for backward compatibility)
    const submissionsDict: Record<string, any> = {};
    batch.signatureForms.forEach((sf: any) => {
      const formKey = sf.formSubmission.form.formKey;
      if (formKey) {
        submissionsDict[formKey] = {
          ...(sf.formSubmission.data || {}),
          staffSignature: sf.formSubmission.staffSignature,
          staffSignedAt: sf.formSubmission.staffSignedAt,
          adminSignature: sf.formSubmission.adminSignature,
          adminSignedAt: sf.formSubmission.adminSignedAt,
        };
      }
    });

    // Format staff name
    const staffName = `${batch.staff.firstName} ${batch.staff.surname}`;

    // Return data in format expected by onboard pages
    return NextResponse.json({
      id: batch.id,
      batchToken: batch.batchToken,
      expiresAt: batch.expiresAt.toISOString(),
      isCompleted: batch.isCompleted,
      completedAt: batch.completedAt?.toISOString(),
      staff: {
        ...batch.staff,
        name: staffName,
      },
      submissions: submissionsDict,
      signatureForms: batch.signatureForms, // Also include for compatibility
    });

  } catch (error: any) {
    console.error("Error fetching staff onboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboard data", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { formKey, data, submit } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    if (!formKey) {
      return NextResponse.json(
        { error: "Form key is required" },
        { status: 400 }
      );
    }

    // Find staff by linkToken or batch token
    let staff = await prisma.staff.findUnique({
      where: { linkToken: token },
    });

    let batch = null;
    if (!staff) {
      batch = await prisma.staffFormBatch.findFirst({
        where: {
          batchToken: token,
          OR: [
            { isSignatureOnly: false },
            { isSignatureOnly: null },
          ],
        },
        include: {
          staff: true,
        },
      });
      if (batch) {
        staff = batch.staff;
      }
    }

    if (!staff) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 404 }
      );
    }

    // Find or create form submission
    const form = await prisma.masterForm.findFirst({
      where: { formKey },
    });

    if (!form) {
      return NextResponse.json(
        { error: `Form with key "${formKey}" not found` },
        { status: 404 }
      );
    }

    // Find or create submission
    let submission = await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId: staff.id,
          formKey,
        },
      },
    });

    if (submission) {
      // Update existing submission
      submission = await prisma.staffFormSubmission.update({
        where: {
          staffId_formKey: {
            staffId: staff.id,
            formKey,
          },
        },
        data: {
          data: {
            ...(submission.data || {}),
            ...data,
          },
          isSubmitted: submit === true,
          submittedAt: submit === true ? new Date() : submission.submittedAt,
        },
      });
    } else {
      // Create new submission
      submission = await prisma.staffFormSubmission.create({
        data: {
          staffId: staff.id,
          formId: form.id,
          formVersion: form.version,
          formKey,
          data,
          isSubmitted: submit === true,
          submittedAt: submit === true ? new Date() : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: submit ? "Form submitted successfully" : "Form saved successfully",
      submission,
    });

  } catch (error: any) {
    console.error("Error saving staff form:", error);
    return NextResponse.json(
      { error: "Failed to save form", details: error.message },
      { status: 500 }
    );
  }
}

