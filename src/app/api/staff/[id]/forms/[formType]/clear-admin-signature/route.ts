import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Clear admin signature from staff form submission
 * This is used when admin wants to edit the admin section after signing
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const { id, formType } = await params;
    const staffId = parseInt(id);

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
      default:
        return NextResponse.json(
          { error: 'Invalid form type' },
          { status: 400 }
        );
    }

    // Find the form submission
    const submission = await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey,
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    // Check if admin signature exists (check both submission and dedicated table for bullying_training)
    const db: any = prisma as any;
    let hasAdminSignature = !!submission.adminSignature;
    
    if (formKey === 'bullying_training') {
      // Also check dedicated table
      const dedicated = await db.staffBullyingTraining
        .findUnique({ where: { staffId } })
        .catch(() => null);
      
      if (dedicated && (dedicated.adminSignature || (dedicated.data && dedicated.data.managerSignature))) {
        hasAdminSignature = true;
      }
    }
    
    if (!hasAdminSignature) {
      return NextResponse.json(
        { error: 'No admin signature found to clear' },
        { status: 400 }
      );
    }

    // Track what was actually cleared
    let clearedFromDedicatedTable = false;
    let clearedFromSubmissionTable = false;
    let statusUpdated = false;
    
    // Clear admin signature and related fields
    // For Bullying Training, also clear from dedicated table and data field
    if (formKey === 'bullying_training') {
      // Try dedicated table first
      try {
        const dedicated = await db.staffBullyingTraining
          .findUnique({ where: { staffId } })
          .catch(() => null);
        
        if (dedicated && (dedicated.adminSignature || (dedicated.data && dedicated.data.managerSignature))) {
          // Clear from dedicated table
          await db.staffBullyingTraining.update({
            where: { staffId },
            data: {
              adminSignature: null,
              adminSignedAt: null,
              data: {
                ...(dedicated.data || {}),
                managerSignature: null,
                managerSignedAt: null,
              },
              updatedAt: new Date(),
            },
          });
          clearedFromDedicatedTable = true;
          console.log('✅ [Clear Admin Signature] Cleared from StaffBullyingTraining dedicated table');
        }
      } catch (dedicatedError: any) {
        console.error('⚠️ [Clear Admin Signature] Error clearing from dedicated table:', dedicatedError);
        // Continue with generic table clearing even if dedicated table fails
      }
    }
    
    // Clear from generic submissions table
    const submissionData = submission.data;
    // Ensure we have an object to work with (Prisma JsonValue can be various types)
    let updatedData: Record<string, any> = {};
    if (submissionData && typeof submissionData === 'object' && !Array.isArray(submissionData)) {
      updatedData = Object.assign({}, submissionData as Record<string, any>);
    }
    
    // Remove admin-related fields from data based on form type
    if (formKey === 'bullying_training') {
      delete updatedData.managerSignature;
      delete updatedData.managerSignedAt;
      // Keep managerName as it's not a signature field
    } else if (formKey === 'conflict_of_interest') {
      delete updatedData.reviewerSignature;
      delete updatedData.reviewerDate;
      // Keep other fields like reviewedBy, reviewerTitle, etc.
    } else if (formKey === 'employee_details' || formKey === 'employment_details') {
      // Keep employmentStatus, payRate, schadsLevel - only clear signature
      // No need to delete anything from data for employee details
    }
    
    try {
      const updated = await prisma.staffFormSubmission.update({
        where: {
          staffId_formKey: {
            staffId,
            formKey,
          },
        },
        data: {
          adminSignature: null,
          adminSignedAt: null,
          data: updatedData,
          updatedAt: new Date(),
        },
      });
      clearedFromSubmissionTable = true;
      console.log('✅ [Clear Admin Signature] Cleared from StaffFormSubmission:', {
        formKey,
        staffId,
        clearedAdminSignature: true,
        clearedAdminSignedAt: true,
      });
    } catch (updateError: any) {
      console.error('❌ [Clear Admin Signature] Error updating StaffFormSubmission:', updateError);
      throw new Error(`Failed to update form submission: ${updateError.message || 'Unknown error'}`);
    }

    // Update StaffFormAssignment status back to "in_progress"
    try {
      const assignment = await prisma.staffFormAssignment.findFirst({
        where: {
          staffId,
          form: {
            formKey,
          },
        },
      });

      if (assignment) {
        await prisma.staffFormAssignment.update({
          where: { id: assignment.id },
          data: {
            currentStatus: 'in_progress',
            isCompleted: false,
          },
        });
        statusUpdated = true;
        console.log('✅ [Clear Admin Signature] Updated assignment status to in_progress');
      }
    } catch (statusError: any) {
      console.error('⚠️ [Clear Admin Signature] Error updating assignment status:', statusError);
      // Don't fail the whole operation if status update fails
    }

    // Verify that signature was actually cleared
    if (!clearedFromSubmissionTable && !clearedFromDedicatedTable) {
      return NextResponse.json(
        {
          success: false,
          error: 'Signature not cleared',
          message: 'Failed to clear admin signature from database. Please try again.',
        },
        { status: 500 }
      );
    }

    // Return success with details
    return NextResponse.json({
      success: true,
      message: 'Admin signature cleared successfully',
      details: {
        clearedFromDedicatedTable,
        clearedFromSubmissionTable,
        statusUpdated,
        formKey,
      },
    });
  } catch (error: any) {
    console.error('Error clearing admin signature:', error);
    return NextResponse.json(
      {
        error: 'Failed to clear admin signature',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

