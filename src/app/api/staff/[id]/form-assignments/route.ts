import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type for the assignment with included form data
type StaffAssignmentWithForm = {
  id: number;
  staffId: number;
  formId: number;
  formVersion: number;
  isCompleted: boolean;
  displayOrder: number | null;
  assignedAt: Date;
  assignedById: number | null;
  currentStatus: string;
  form: {
    id: number;
    formKey: string;
    title: string;
    version: number;
    requiresSignature: boolean | null;
  };
};

export async function GET(
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

    // Get staff info
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
        phone: true,
        commonFields: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            phone: true,
            address: true,
          }
        }
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff not found" },
        { status: 404 }
      );
    }

    // Get form assignments with related data
    const assignments = await prisma.staffFormAssignment.findMany({
      where: { staffId },
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
      orderBy: [
        { displayOrder: 'asc' },
        { assignedAt: 'asc' },
      ],
    });

    // For each assignment, check if StaffFormSubmission exists
    // Note: StaffFormSubmission uses formKey, not formId/formVersion as unique constraint
    const assignmentsWithSubmissionStatus = await Promise.all(
      assignments.map(async (assignment: any) => {
        // Try to find submission by formKey (matching the form's formKey)
        const formKey = assignment.form?.formKey;
        const submission = formKey ? await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId: staffId, // Use the staffId from the request, not from assignment
              formKey: formKey,
            },
          },
          select: {
            id: true,
            data: true,
            isSubmitted: true,
            submittedAt: true,
            filledByAdmin: true,
            adminFilledAt: true,
            staffSignature: true,
            staffSignedAt: true,
            adminSignature: true,
            adminSignedAt: true,
          },
        }) : null;

        // Sync assignment status if submission exists and status needs updating
        // This handles cases where the assignment wasn't updated during submission
        // For pre_employment_medical, always check if all 3 signatures are present
        const needsStatusCheck = submission && (
          submission.isSubmitted || 
          (formKey === 'pre_employment_medical' && assignment.currentStatus !== 'completed') ||
          (assignment.currentStatus !== 'completed' && assignment.form.requiresSignature)
        );
        
        if (needsStatusCheck) {
          let shouldSync = false;
          let newStatus = 'completed';
          
          // Vehicle Safety Inspection - doesn't require signature, just needs to be submitted
          if (formKey === 'vehicle_safety_inspection') {
            shouldSync = true;
          }
          // Forms requiring admin signature - need both staff and admin signatures
          else if (['employee_details', 'employment_details', 'conflict_of_interest', 'bullying_training'].includes(formKey)) {
            let hasStaffSig = !!submission.staffSignature;
            let hasAdminSig = !!submission.adminSignature;
            // Check form-specific admin signature fields
            const formData = submission.data as any || {};
            if (formKey === 'bullying_training' && !hasAdminSig) {
              hasAdminSig = !!formData.managerSignature;
            } else if (formKey === 'conflict_of_interest' && !hasAdminSig) {
              hasAdminSig = !!formData.reviewerSignature;
            }
            // Also check data fields for staff signature
            if (!hasStaffSig) {
              hasStaffSig = !!(formData.signature || formData.staffSignature);
            }
            
            if (hasStaffSig && hasAdminSig) {
              // Both signatures present - should be completed
              shouldSync = true;
              newStatus = 'completed';
            } else if (hasStaffSig && !hasAdminSig) {
              // Only staff signed - should be in_progress (admin review)
              shouldSync = true;
              newStatus = 'in_progress';
            }
          }
          // Forms with special signature handling
          else if (formKey === 'fair_work_information') {
            // Fairwork uses signature, staffSignature, or acknowledgementSignature
            const formData = submission.data as any || {};
            const hasSig = !!submission.staffSignature || 
                          !!formData.signature || 
                          !!formData.staffSignature || 
                          !!formData.acknowledgementSignature;
            if (hasSig) {
              shouldSync = true;
            }
          }
          else if (formKey === 'govt_tax') {
            // TFN uses payeeSignature or payerSignature
            const formData = submission.data as any || {};
            const hasSig = !!submission.staffSignature || 
                          !!formData.payeeSignature || 
                          !!formData.payerSignature || 
                          !!formData.staffSignature;
            if (hasSig) {
              shouldSync = true;
            }
          }
          else if (formKey === 'super_choice_form') {
            // Super Choice uses sectionBSignature, sectionCSignature, or sectionDSignature
            const formData = submission.data as any || {};
            const hasSig = !!submission.staffSignature || 
                          !!formData.sectionBSignature || 
                          !!formData.sectionCSignature || 
                          !!formData.sectionDSignature || 
                          !!formData.staffSignature;
            if (hasSig) {
              shouldSync = true;
            }
          }
          // Pre-Employment Medical requires 3 signatures
          else if (formKey === 'pre_employment_medical') {
            const formData = submission.data as any || {};
            // Check all 3 signatures are present
            const hasSignature1 = !!(submission.staffSignature || formData.signature);
            const hasSignature2 = !!formData.disclosureAdviceSignature;
            const hasSignature3 = !!formData.declarationSignature;
            
            if (hasSignature1 && hasSignature2 && hasSignature3) {
              // All 3 signatures present - mark as completed
              shouldSync = true;
              newStatus = 'completed';
            } else if (hasSignature1 || hasSignature2 || hasSignature3) {
              // At least one signature present - mark as in_progress
              shouldSync = true;
              newStatus = 'in_progress';
            }
          }
          // Forms requiring only staff signature - check if staff has signed
          else {
            const requiresSignature = assignment.form.requiresSignature ?? false;
            if (requiresSignature) {
              const formData = submission.data as any || {};
              const hasStaffSig = !!submission.staffSignature || 
                                 !!formData.signature || 
                                 !!formData.staffSignature;
              if (hasStaffSig) {
                shouldSync = true;
              }
            } else {
              // Form doesn't require signature - if submitted, it's completed
              shouldSync = true;
            }
          }
          
          if (shouldSync) {
            try {
              await prisma.staffFormAssignment.update({
                where: { id: assignment.id },
                data: {
                  currentStatus: newStatus,
                  isCompleted: newStatus === 'completed',
                },
              });
              console.log(`🔄 [Form Assignments API] Synced assignment ${assignment.id} status to ${newStatus} for ${formKey}`);
              // Update the assignment object for response
              assignment.currentStatus = newStatus;
              assignment.isCompleted = newStatus === 'completed';
            } catch (syncError) {
              console.error(`❌ [Form Assignments API] Failed to sync assignment status:`, syncError);
            }
          }
        }

        return {
          id: assignment.id,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
          assignedAt: assignment.assignedAt.toISOString(),
          displayOrder: assignment.displayOrder ?? 0,
          isCompleted: assignment.isCompleted,
          form: {
            id: assignment.form.id,
            formKey: assignment.form.formKey,
            title: assignment.form.title,
            version: assignment.form.version,
            requiresSignature: assignment.form.requiresSignature ?? false,
          },
          hasSubmission: !!submission,
          submissionId: submission?.id,
          filledByAdmin: submission?.filledByAdmin || false,
          adminFilledAt: submission?.adminFilledAt?.toISOString(),
          staffSignature: submission?.staffSignature,
          staffSignedAt: submission?.staffSignedAt?.toISOString(),
          adminSignature: submission?.adminSignature,
          adminSignedAt: submission?.adminSignedAt?.toISOString(),
          formData: submission?.data,
          currentStatus: assignment.currentStatus || 'not_started',
        };
      })
    );

    return NextResponse.json({
      staff,
      assignments: assignmentsWithSubmissionStatus,
    });

  } catch (error: any) {
    console.error("Error fetching staff form assignments:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch staff form assignments", details: errorMessage, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
}

