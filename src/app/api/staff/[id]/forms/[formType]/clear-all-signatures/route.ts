import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Clear ALL signatures (staff and admin/manager) from staff form submission
 * This is used when admin wants to edit a form that has been signed
 * Similar to how client forms clear all signatures when edited
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const { id, formType } = await params;
    const staffId = parseInt(id);
    const body = await req.json();
    const { assignmentId } = body;

    if (!staffId || isNaN(staffId)) {
      return NextResponse.json(
        { error: 'Invalid staff ID' },
        { status: 400 }
      );
    }

    // Map formType to formKey
    let formKey: string;
    switch (formType) {
      case 'employee-details':
      case 'employment-details':
        formKey = 'employee_details';
        break;
      case 'conflict-of-interest':
        formKey = 'conflict_of_interest';
        break;
      case 'bullying-training':
        formKey = 'bullying_training';
        break;
      case 'bullying-harassment-training':
        formKey = 'bullying_harassment_training';
        break;
      case 'ndis-workforce-capability':
        formKey = 'ndis_workforce_capability';
        break;
      case 'pre-employment-medical':
        formKey = 'pre_employment_medical';
        break;
      case 'support-worker':
        formKey = 'support_worker';
        break;
      case 'employee-welcome':
      case 'employment-welcome':
        formKey = 'employee_welcome';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid form type' },
          { status: 400 }
        );
    }

    const db: any = prisma as any;
    let clearedFromDedicatedTable = false;
    let clearedFromSubmissionTable = false;
    let statusUpdated = false;

    // Find the form submission
    const submission = await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey,
        },
      },
    });

    // Clear from dedicated table if it exists (for forms like bullying_training)
    if (formKey === 'bullying_training') {
      try {
        const dedicated = await db.staffBullyingTraining
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          const existingData = dedicated.data || {};
          await db.staffBullyingTraining.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              adminSignature: null,
              adminSignedAt: null,
              data: {
                ...existingData,
                // Clear ONLY signatures and signature dates - keep other admin data (managerName, etc.)
                staffSignature: null,
                managerSignature: null,
                managerSignedAt: null,
                // DO NOT clear managerName - keep admin-filled data
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffBullyingTraining dedicated table (signatures only)');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'bullying_harassment_training') {
      try {
        const dedicated = await db.staffBullyingHarassmentTraining
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          await db.staffBullyingHarassmentTraining.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              data: {
                ...(dedicated.data || {}),
                signature: null,
                staffSignature: null,
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffBullyingHarassmentTraining dedicated table');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'ndis_workforce_capability') {
      try {
        const dedicated = await db.staffNdisWorkforceCapability
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          await db.staffNdisWorkforceCapability.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              data: {
                ...(dedicated.data || {}),
                signature: null,
                staffSignature: null,
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffNdisWorkforceCapability dedicated table');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'pre_employment_medical') {
      try {
        const dedicated = await db.staffPreEmploymentMedical
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          await db.staffPreEmploymentMedical.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              data: {
                ...(dedicated.data || {}),
                signature: null,
                signatureDate: null,
                declarationSignature: null,
                declarationDate: null,
                staffSignature: null,
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffPreEmploymentMedical dedicated table');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'support_worker') {
      try {
        const dedicated = await db.staffSupportWorker
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          await db.staffSupportWorker.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              data: {
                ...(dedicated.data || {}),
                signature: null,
                signatureDate: null,
                staffSignature: null,
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffSupportWorker dedicated table');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'employee_welcome') {
      try {
        const dedicated = await db.staffEmploymentWelcomeAck
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          await db.staffEmploymentWelcomeAck.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              data: {
                ...(dedicated.data || {}),
                signature: null,
                staffSignature: null,
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffEmploymentWelcomeAck dedicated table');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'conflict_of_interest') {
      try {
        const dedicated = await db.staffConflictOfInterest
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          const existingData = dedicated.data || {};
          await db.staffConflictOfInterest.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              adminSignature: null,
              adminSignedAt: null,
              data: {
                ...existingData,
                // Clear ONLY signatures and signature dates - keep other admin data
                reviewerSignature: null,
                reviewerDate: null,
                staffSignature: null,
                // DO NOT clear reviewedBy, reviewerTitle, reviewerName - keep admin-filled data
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffConflictOfInterest dedicated table (signatures only)');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    } else if (formKey === 'employee_details') {
      try {
        const dedicated = await db.staffEmploymentDetails
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated) {
          const existingData = dedicated.data || {};
          await db.staffEmploymentDetails.update({
            where: { staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null,
              adminSignature: null,
              adminSignedAt: null,
              data: {
                ...existingData,
                // Clear ONLY signatures - keep admin-filled data (employmentStatus, payRate, schadsLevel, etc.)
                employeeSignature: null,
                employeeSignatureDate: null,
                // DO NOT clear employmentStatus, payRate, schadsLevel - keep admin-filled data
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear All Signatures] Cleared from StaffEmploymentDetails dedicated table (signatures only)');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear All Signatures] Error clearing from dedicated table:', dedicatedError);
      }
    }

    // Clear from generic submissions table
    if (submission) {
      const submissionData = submission.data;
      // Ensure we have an object to work with (Prisma JsonValue can be various types)
      let updatedData: Record<string, any> = {};
      if (submissionData && typeof submissionData === 'object' && !Array.isArray(submissionData)) {
        updatedData = Object.assign({}, submissionData as Record<string, any>);
      }
      
      // Remove ONLY signature-related fields (signatures and signature dates) - keep all other admin-filled data
      if (formKey === 'bullying_training') {
        // Clear ONLY signatures and signature dates - keep managerName and other admin data
        delete updatedData.staffSignature;
        delete updatedData.managerSignature;
        delete updatedData.managerSignedAt;
        // DO NOT delete managerName - keep admin-filled data
      } else if (formKey === 'conflict_of_interest') {
        // Clear ONLY signatures and signature dates - keep reviewedBy, reviewerTitle, etc.
        delete updatedData.reviewerSignature;
        delete updatedData.reviewerDate;
        delete updatedData.staffSignature;
        // DO NOT delete reviewedBy, reviewerTitle, reviewerName - keep admin-filled data
      } else if (formKey === 'employee_details' || formKey === 'employment_details') {
        // Clear ONLY signatures - keep employmentStatus, payRate, schadsLevel, etc.
        delete updatedData.employeeSignature;
        delete updatedData.employeeSignatureDate;
        // DO NOT delete employmentStatus, payRate, schadsLevel, schadsScore - keep admin-filled data
      } else {
        // Generic signature clearing for other forms - only signatures and dates
        delete updatedData.signature;
        delete updatedData.staffSignature;
        delete updatedData.signatureDate;
        delete updatedData.staffSignedAt;
        delete updatedData.declarationSignature;
        delete updatedData.declarationDate;
      }
      
      try {
        await prisma.staffFormSubmission.update({
          where: {
            staffId_formKey: {
              staffId,
              formKey,
            },
          },
          data: {
            staffSignature: null,
            staffSignedAt: null,
            adminSignature: null,
            adminSignedAt: null,
            data: updatedData,
            updatedAt: new Date(),
          },
        });
        clearedFromSubmissionTable = true;
        console.log('✅ [Clear All Signatures] Cleared from StaffFormSubmission:', {
          formKey,
          staffId,
          clearedStaffSignature: true,
          clearedAdminSignature: true,
        });
      } catch (updateError: any) {
        console.error('❌ [Clear All Signatures] Error updating StaffFormSubmission:', updateError);
        throw new Error(`Failed to update form submission: ${updateError.message || 'Unknown error'}`);
      }
    }

    // Update StaffFormAssignment status correctly based on remaining signatures
    try {
      let assignment;
      if (assignmentId) {
        assignment = await prisma.staffFormAssignment.findUnique({
          where: { id: parseInt(assignmentId) },
        });
      } else {
        assignment = await prisma.staffFormAssignment.findFirst({
          where: {
            staffId,
            form: {
              formKey,
            },
          },
        });
      }

      if (assignment) {
        // After clearing all signatures, status should be "in_progress"
        // Status will be automatically updated correctly when form is re-saved:
        // - If staff signs → "in_progress" (admin review required)
        // - If both staff and admin sign → "completed"
        // - If form doesn't require admin signature and staff signs → "completed"
        await prisma.staffFormAssignment.update({
          where: { id: assignment.id },
          data: {
            currentStatus: 'in_progress',
            isCompleted: false,
          },
        });
        statusUpdated = true;
        console.log('✅ [Clear All Signatures] Updated assignment status to in_progress (all signatures cleared)');
      }
    } catch (statusError: any) {
      console.error('⚠️ [Clear All Signatures] Error updating assignment status:', statusError);
      // Don't fail the whole operation if status update fails
    }

    // Return success with details
    return NextResponse.json({
      success: true,
      message: 'All signatures cleared successfully',
      details: {
        clearedFromDedicatedTable,
        clearedFromSubmissionTable,
        statusUpdated,
        formKey,
      },
    });
  } catch (error: any) {
    console.error('Error clearing all signatures:', error);
    return NextResponse.json(
      {
        error: 'Failed to clear all signatures',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

