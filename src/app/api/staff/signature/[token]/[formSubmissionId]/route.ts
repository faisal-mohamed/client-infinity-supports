import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch specific form for staff to fill/sign
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);

    if (!token || !formSubmissionIdInt) {
      return NextResponse.json(
        { error: "Token and form submission ID are required" },
        { status: 400 }
      );
    }

    // Find the staff signature batch
    const batch = await prisma.staffFormBatch.findUnique({
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
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Signature link not found or form not accessible" },
        { status: 404 }
      );
    }

    // Check if batch has expired
    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    // Check if form exists in this batch
    if (batch.signatureForms.length === 0) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    const signatureForm = batch.signatureForms.find(
      (sf: any) => sf.formSubmissionId === formSubmissionIdInt
    );

    if (!signatureForm) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    // Fetch commonFields separately (for staff)
    const commonFields = await prisma.staffCommonField.findUnique({
      where: { staffId: batch.staffId },
    });

    return NextResponse.json({
      formSubmission: signatureForm.formSubmission,
      staff: {
        ...batch.staff,
        commonFields: commonFields ? [commonFields] : [], // Wrap in array for backward compatibility
      },
      batchToken: batch.batchToken,
      isExpired: batch.expiresAt < new Date(),
    });

  } catch (error: any) {
    console.error("Error fetching staff form for signature:", error);
    return NextResponse.json(
      { error: "Failed to fetch form data", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save form data and signatures (staff filling form)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);
    const body = await req.json();
    const { formData, signature, signatureId, signedAt, signerName } = body;

    if (!token || !formSubmissionIdInt) {
      return NextResponse.json(
        { error: "Token and form submission ID are required" },
        { status: 400 }
      );
    }

    // Find the staff signature batch
    const batch = await prisma.staffFormBatch.findUnique({
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
          },
        },
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    formKey: true,
                    requiresSignature: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Signature link not found" },
        { status: 404 }
      );
    }

    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    const signatureForm = batch.signatureForms.find(
      (sf: any) => sf.formSubmissionId === formSubmissionIdInt
    );

    if (!signatureForm) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }

    const currentSubmission = await prisma.staffFormSubmission.findUnique({
      where: { id: formSubmissionIdInt },
      select: { 
        id: true,
        data: true, 
        staffId: true, 
        formId: true, 
        formVersion: true,
        formKey: true,
        staffSignature: true,
        staffSignedAt: true,
      },
    });

    if (!currentSubmission) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    // Update form data
    const updatedData = formData || currentSubmission.data;
    
    // Handle signature if provided
    let staffSignature = currentSubmission.staffSignature;
    let staffSignedAt = currentSubmission.staffSignedAt;

    if (signature && signatureId) {
      // Update signature in form data
      if (updatedData && typeof updatedData === 'object') {
        (updatedData as any)[signatureId] = signature;
        if (signedAt) {
          (updatedData as any)[`${signatureId}Date`] = signedAt;
        }
        if (signerName) {
          (updatedData as any)[`${signatureId}Name`] = signerName;
        }
      }

      // Update top-level staff signature fields
      staffSignature = signature;
      staffSignedAt = signedAt ? new Date(signedAt) : new Date();
    }

    // Update the submission
    const updatedSubmission = await prisma.staffFormSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        data: updatedData,
        staffSignature: staffSignature,
        staffSignedAt: staffSignedAt,
        updatedAt: new Date(),
      },
      include: {
        form: {
          select: {
            formKey: true,
          },
        },
      },
    });

    // Update StaffFormAssignment status if staff signed
    // For forms requiring admin signatures (like employee_details, conflict_of_interest, bullying_training), set to "in_progress" if admin hasn't signed yet
    if (staffSignature) {
      // Get formKey from the submission (it's stored in formKey field)
      const formKey = updatedSubmission.formKey || currentSubmission.formKey;
      const requiresAdminSignature = formKey === 'employee_details' || 
                                     formKey === 'employment_details' ||
                                     formKey === 'conflict_of_interest' ||
                                     formKey === 'bullying_training';
      
      if (formKey) {
        const assignment = await prisma.staffFormAssignment.findFirst({
          where: {
            staffId: currentSubmission.staffId,
            form: {
              formKey: formKey,
            },
          },
        });

        if (assignment) {
          // Check if admin has signed (from the updated submission)
          const adminHasSigned = !!updatedSubmission.adminSignature;
          
          // If form requires admin signature and admin hasn't signed, set to "in_progress"
          // Otherwise, if all signatures are complete, set to "completed"
          if (requiresAdminSignature && !adminHasSigned) {
            await prisma.staffFormAssignment.update({
              where: { id: assignment.id },
              data: {
                currentStatus: 'in_progress',
                isCompleted: false,
              },
            });
          } else if (!requiresAdminSignature || adminHasSigned) {
            // Form doesn't require admin signature, or both signatures are complete
            await prisma.staffFormAssignment.update({
              where: { id: assignment.id },
              data: {
                currentStatus: 'completed',
                isCompleted: true,
              },
            });
          }
        }
      }
    }

    // Check if all forms in batch are signed
    const allSignatureForms = await prisma.staffSignatureBatchForm.findMany({
      where: { batchId: batch.id },
      include: {
        formSubmission: {
          select: {
            id: true,
            staffSignature: true,
            form: {
              select: {
                requiresSignature: true,
              },
            },
          },
        },
      },
    });

    const formsRequiringSignature = allSignatureForms.filter(
      (sf: any) => sf.formSubmission.form.requiresSignature === true
    );

    const allSigned = formsRequiringSignature.every(
      (sf: any) => sf.formSubmission.staffSignature !== null && sf.formSubmission.staffSignature !== undefined
    );

    let isNowComplete = false;
    if (allSigned && formsRequiringSignature.length > 0) {
      isNowComplete = true;
    }

    if (isNowComplete && !batch.isCompleted) {
      await prisma.staffFormBatch.update({
        where: { id: batch.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      // Create activity log (if you have StaffActivityLog)
      try {
        await prisma.staffActivityLog.create({
          data: {
            staffId: batch.staffId,
            logType: 'ADMIN', // Required field (CLIENT or ADMIN)
            action: 'Signature Batch Completed',
            metadata: {
              batchId: batch.id,
              batchToken: batch.batchToken,
              totalForms: batch.signatureForms.length,
              completedAt: new Date().toISOString(),
            },
          },
        });
      } catch (logError) {
        console.error('Error creating activity log:', logError);
        // Don't fail the request if logging fails
      }

      // Create notifications for admins
      try {
        const allAdmins = await prisma.admin.findMany({ select: { id: true } });
        await Promise.all(
          allAdmins.map((admin: any) =>
            prisma.staffSubmissionNotification.create({
              data: {
                adminId: admin.id,
                staffId: batch.staffId,
                formSubmissionId: formSubmissionIdInt,
              },
            }).catch((err) => {
              console.error('Error creating notification:', err);
              return null;
            })
          )
        );
      } catch (notifError) {
        console.error('Error creating notifications:', notifError);
        // Don't fail the request if notifications fail
      }
    }

    return NextResponse.json({
      success: true,
      message: signature ? "Form signed successfully" : "Form saved successfully",
      submission: updatedSubmission,
      batchComplete: isNowComplete,
    });

  } catch (error: any) {
    console.error("Error saving staff form signature:", error);
    return NextResponse.json(
      { error: "Failed to save form", details: error.message },
      { status: 500 }
    );
  }
}

