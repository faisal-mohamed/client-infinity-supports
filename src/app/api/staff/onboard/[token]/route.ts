import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  let token: string | undefined;
  try {
    const paramsData = await params;
    token = paramsData.token;

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
          ...(sub.data && typeof sub.data === 'object' ? sub.data : {}),
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
    // Try non-signature batches first (onboard)
    let batch = await prisma.staffFormBatch.findFirst({
      where: {
        batchToken: token,
        isSignatureOnly: false,
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
    // This allows onboard pages to work with signature links too
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
    if (batch.signatureForms && Array.isArray(batch.signatureForms)) {
      batch.signatureForms.forEach((sf: any) => {
        // Safely access formSubmission and form
        if (sf?.formSubmission?.form?.formKey) {
          const formKey = sf.formSubmission.form.formKey;
          submissionsDict[formKey] = {
            ...(sf.formSubmission.data || {}),
            staffSignature: sf.formSubmission.staffSignature,
            staffSignedAt: sf.formSubmission.staffSignedAt,
            adminSignature: sf.formSubmission.adminSignature,
            adminSignedAt: sf.formSubmission.adminSignedAt,
          };
        }
      });
    }

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
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      token: token,
    });
    return NextResponse.json(
      { 
        error: "Failed to fetch onboard data", 
        details: error.message || "An unexpected error occurred",
        message: error.message || "Unable to load form data. Please try again or contact support if the issue persists."
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  let token: string | undefined;
  let formKey: string | undefined;
  try {
    const paramsData = await params;
    token = paramsData.token;
    const body = await req.json();
    formKey = body.formKey;
    const { data, submit } = body;

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
      // Try non-signature batches first (onboard)
      batch = await prisma.staffFormBatch.findFirst({
        where: {
          batchToken: token,
          isSignatureOnly: false,
        },
        include: {
          staff: true,
        },
      });
      
      // If not found, try signature-only batches as fallback
      if (!batch) {
        batch = await prisma.staffFormBatch.findFirst({
          where: {
            batchToken: token,
            isSignatureOnly: true,
          },
          include: {
            staff: true,
          },
        });
      }
      
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

    // Extract signature from data and save to staffSignature column for completion tracking
    let staffSignature: string | null = null;
    let staffSignedAt: Date | null = null;
    
    // Helper function to convert DD/MM/YYYY string to Date object
    const parseDateString = (dateStr: string | null | undefined): Date | null => {
      if (!dateStr) return null;
      
      // If it's already a Date object, return it
      if (dateStr instanceof Date) return dateStr;
      
      // If it's a string, try to parse it
      if (typeof dateStr === 'string') {
        // Try DD/MM/YYYY format (used by tax form)
        const dmyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (dmyMatch) {
          const [, day, month, year] = dmyMatch;
          // Create date in YYYY-MM-DD format for Date constructor
          return new Date(`${year}-${month}-${day}`);
        }
        
        // Try ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
        const isoDate = new Date(dateStr);
        if (!isNaN(isoDate.getTime())) {
          return isoDate;
        }
      }
      
      return null;
    };
    
    if (submit) {
      // Extract signature based on form type
      if (formKey === 'fair_work_information') {
        // Fairwork uses signature (primary) or staffSignature (alias)
        staffSignature = data.signature || data.staffSignature || data.acknowledgementSignature || null;
        staffSignedAt = parseDateString(data.date || data.acknowledgedAt || data.staffSignedAt);
      } else if (formKey === 'govt_tax') {
        // TFN uses payeeSignature - date is in DD/MM/YYYY format
        staffSignature = data.payeeSignature || data.staffSignature || null;
        staffSignedAt = parseDateString(data.payeeSignatureAt || data.staffSignedAt);
      } else if (formKey === 'super_choice_form') {
        // Super Choice uses sectionBSignature, sectionCSignature, or sectionDSignature
        staffSignature = data.sectionBSignature || data.sectionCSignature || data.sectionDSignature || data.staffSignature || null;
        // Super Choice dates might be objects {day, month, year} or strings
        const dateValue = data.sectionBSignedAt || data.sectionCSignedAt || data.sectionDSignedAt || data.staffSignedAt;
        if (dateValue) {
          if (typeof dateValue === 'object' && dateValue.day && dateValue.month && dateValue.year) {
            // Convert {day, month, year} object to Date
            staffSignedAt = new Date(`${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(dateValue.day).padStart(2, '0')}`);
          } else {
            staffSignedAt = parseDateString(dateValue);
          }
        }
      } else {
        // Generic forms use signature or staffSignature
        staffSignature = data.signature || data.staffSignature || null;
        staffSignedAt = parseDateString(data.signatureDate || data.staffSignedAt || data.signedAt);
      }
      
      // If we found a signature but no date, set the date to now
      if (staffSignature && !staffSignedAt) {
        staffSignedAt = new Date();
      }
      
      console.log(`📋 [Onboard API] Extracted signature for ${formKey}:`, {
        hasSignature: !!staffSignature,
        signatureLength: staffSignature?.length || 0,
        signedAt: staffSignedAt instanceof Date ? staffSignedAt.toISOString() : staffSignedAt,
      });
    }

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
            ...(submission.data && typeof submission.data === 'object' ? submission.data : {}),
            ...(data && typeof data === 'object' ? data : {}),
          },
          isSubmitted: submit === true,
          submittedAt: submit === true ? new Date() : submission.submittedAt,
          // Save signature to column for completion tracking
          staffSignature: submit ? (staffSignature || submission.staffSignature) : submission.staffSignature,
          staffSignedAt: submit ? (staffSignedAt || submission.staffSignedAt) : submission.staffSignedAt,
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
          // Save signature to column for completion tracking
          staffSignature: submit ? staffSignature : null,
          staffSignedAt: submit ? staffSignedAt : null,
        },
      });
    }

    // Update StaffFormAssignment status if assignment exists
    // Find assignment - prioritize batch-based lookup if batch exists
    let assignment = null;
    
    if (batch) {
      // If we have a batch, find assignment through the batch
      assignment = await prisma.staffFormAssignment.findFirst({
        where: {
          staffId: staff.id,
          formId: form.id,
          formVersion: form.version,
          batchId: batch.id,
        },
      });
    }
    
    // If not found through batch, try findUnique with compound unique key
    if (!assignment) {
      try {
        assignment = await prisma.staffFormAssignment.findUnique({
          where: {
            staffId_formId_formVersion: {
              staffId: staff.id,
              formId: form.id,
              formVersion: form.version,
            },
          },
        });
      } catch (error) {
        // If findUnique fails, try findFirst as fallback
        console.warn('findUnique failed, trying findFirst:', error);
        assignment = await prisma.staffFormAssignment.findFirst({
          where: {
            staffId: staff.id,
            formId: form.id,
            formVersion: form.version,
          },
        });
      }
    }
    
    console.log(`🔍 [Onboard API] Looking for assignment:`, {
      staffId: staff.id,
      formId: form.id,
      formVersion: form.version,
      batchId: batch?.id,
      found: !!assignment,
      assignmentId: assignment?.id,
      currentStatus: assignment?.currentStatus,
    });

    if (assignment) {
      console.log(`📋 [Onboard API] Found assignment ${assignment.id}, current status: ${assignment.currentStatus}, submit: ${submit}`);
      
      if (submit) {
        // Form is being submitted - determine status based on signature requirements
        const requiresSignature = form.requiresSignature ?? false;
        
        // Check if staff has signed (check both column and data fields)
        // For govt_tax form, only check payeeSignature (Section A only)
        let hasStaffSignature = false;
        if (formKey === 'govt_tax') {
          hasStaffSignature = !!submission.staffSignature || 
            !!(data.payeeSignature) || 
            !!(data.staffSignature);
        } else {
          hasStaffSignature = !!submission.staffSignature || 
            !!(data.signature) || 
            !!(data.staffSignature) ||
            !!(data.acknowledgementSignature);
        }
        
        console.log(`📋 [Onboard API] Signature check:`, {
          requiresSignature,
          hasStaffSignature,
          submissionStaffSignature: !!submission.staffSignature,
          dataSignature: !!(data.signature),
          dataStaffSignature: !!(data.staffSignature),
          dataAcknowledgementSignature: !!(data.acknowledgementSignature),
        });
        
        // Check if form requires admin/manager signature
        const formsRequiringAdminSignature = [
          'bullying_training',
          'conflict_of_interest',
          'employee_details',
          'employment_details'
        ];
        const requiresAdminSignature = formsRequiringAdminSignature.includes(formKey);
        
        // Check if admin signature exists
        let hasAdminSignature = false;
        if (requiresAdminSignature) {
          hasAdminSignature = !!submission.adminSignature || 
            (formKey === 'bullying_training' && !!(data.managerSignature)) ||
            (formKey === 'conflict_of_interest' && !!(data.reviewerSignature)) ||
            (formKey === 'employee_details' && !!submission.adminSignature);
        }

        // Determine status:
        // 1. If form doesn't require signature → completed
        // 2. If form requires signature but NOT admin signature → completed when staff signs
        // 3. If form requires admin signature:
        //    - If only staff signed → in_progress (admin review required)
        //    - If both staff and admin signed → completed
        let newStatus = 'in_progress';
        let shouldMarkCompleted = false;
        
        if (!requiresSignature) {
          // Form doesn't require any signature
          newStatus = 'completed';
          shouldMarkCompleted = true;
        } else if (requiresAdminSignature) {
          // Form requires both staff and admin signatures
          if (hasStaffSignature && hasAdminSignature) {
            // Both signatures present → completed
            newStatus = 'completed';
            shouldMarkCompleted = true;
          } else if (hasStaffSignature) {
            // Only staff signed → in_progress (admin review required)
            newStatus = 'in_progress';
            shouldMarkCompleted = false;
          } else {
            // No signatures → in_progress
            newStatus = 'in_progress';
            shouldMarkCompleted = false;
          }
        } else if (hasStaffSignature) {
          // Form requires signature but not admin signature, and staff has signed
          newStatus = 'completed';
          shouldMarkCompleted = true;
        } else {
          // Form requires signature but staff hasn't signed
          newStatus = 'in_progress';
          shouldMarkCompleted = false;
        }

        console.log(`📋 [Onboard API] Status determination:`, {
          formKey,
          requiresSignature,
          requiresAdminSignature,
          hasStaffSignature,
          hasAdminSignature,
          newStatus,
          shouldMarkCompleted,
        });

        // Update assignment status
        try {
          await prisma.staffFormAssignment.update({
            where: { id: assignment.id },
            data: {
              currentStatus: newStatus,
              isCompleted: shouldMarkCompleted,
            },
          });
          console.log(`✅ [Onboard API] Updated StaffFormAssignment ${assignment.id} status to ${newStatus} for form: ${formKey} (staff signed: ${hasStaffSignature}, admin signed: ${hasAdminSignature})`);
        } catch (updateError: any) {
          console.error(`❌ [Onboard API] Failed to update assignment status:`, updateError);
          // Don't fail the whole request if status update fails
        }
      } else {
        // Form is being saved (draft) - mark as in_progress if not started
        if (assignment.currentStatus === 'not_started') {
          try {
            await prisma.staffFormAssignment.update({
              where: { id: assignment.id },
              data: {
                currentStatus: 'in_progress',
                isCompleted: false,
              },
            });
            console.log(`📝 [Onboard API] Updated StaffFormAssignment ${assignment.id} status to in_progress for form: ${formKey}`);
          } catch (updateError: any) {
            console.error(`❌ [Onboard API] Failed to update assignment status:`, updateError);
            // Don't fail the whole request if status update fails
          }
        }
      }
    } else {
      console.warn(`⚠️ [Onboard API] No StaffFormAssignment found for staffId: ${staff.id}, formId: ${form.id}, formVersion: ${form.version}, batchId: ${batch?.id}`);
    }

    return NextResponse.json({
      success: true,
      message: submit ? "Form submitted successfully" : "Form saved successfully",
      submission,
    });

  } catch (error: any) {
    console.error("Error saving staff form:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      token: token,
      formKey: formKey,
    });
    return NextResponse.json(
      { 
        error: "Failed to save form", 
        details: error.message || "An unexpected error occurred",
        message: error.message || "Unable to save the form. Please try again or contact support if the issue persists."
      },
      { status: 500 }
    );
  }
}

