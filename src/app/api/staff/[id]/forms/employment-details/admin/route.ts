import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAndTriggerStaffBatchEmail } from '@/lib/staff-batch-email';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    
    const body = await req.json();
    const { employmentStatus, payRate, schadsLevel, adminSignature, adminSignedAt } = body;

    // Validate required fields
    if (!employmentStatus || !payRate || !schadsLevel || !adminSignature) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Please fill all required fields: Employment Status, Pay Rate, SCHADS Level, and Admin Signature' 
      }, { status: 400 });
    }

    const db: any = prisma as any;
    
    // Try both approaches: dedicated table first, then fallback to generic table
    let existing = await db.staffEmploymentDetails.findUnique({
      where: { staffId }
    }).catch(() => null);

    if (existing) {
      // UPDATE DEDICATED TABLE APPROACH
      const updated = await db.staffEmploymentDetails.update({
        where: { staffId },
        data: {
          data: {
            ...(existing.data || {}),
            employmentStatus,
            payRate,
            schadsLevel,
          },
          adminSignature,
          adminSignedAt: new Date(adminSignedAt),
        },
      });

      // Update StaffFormAssignment status to "completed" since both staff and admin have signed
      const formKey = 'employee_details'; // Use snake_case for formKey
      const assignment = await prisma.staffFormAssignment.findFirst({
        where: {
          staffId: staffId,
          form: {
            formKey: formKey,
          },
        },
      });

      if (assignment) {
        await prisma.staffFormAssignment.update({
          where: { id: assignment.id },
          data: {
            currentStatus: 'completed',
            isCompleted: true,
          },
        });

        // Check if batch is completed and trigger email
        console.log(`🔍 [EMPLOYEE DETAILS ADMIN] Form completed, checking batch completion...`);
        await checkAndTriggerStaffBatchEmail(staffId, 'employee_details');
      }

      return NextResponse.json({
        success: true,
        message: 'Admin section submitted successfully',
        data: updated,
      });
    }

    // FALLBACK: Use generic StaffFormSubmission table (like client forms)
    const genericForm = await db.staffFormSubmission.findUnique({
      where: { 
        staffId_formKey: { 
          staffId, 
          formKey: 'employeeDetails' 
        } 
      }
    });

    if (!genericForm) {
      return NextResponse.json({ 
        error: 'Employment details not found',
        message: 'Staff must complete their section first' 
      }, { status: 404 });
    }

    // Check if staff has signed
    if (!genericForm.staffSignature) {
      return NextResponse.json({ 
        error: 'Staff signature required',
        message: 'Staff member must sign the form before admin approval' 
      }, { status: 400 });
    }

    // Update with admin data in generic table
    const updated = await db.staffFormSubmission.update({
      where: { 
        staffId_formKey: { 
          staffId, 
          formKey: 'employeeDetails' 
        } 
      },
      data: {
        data: {
          ...(genericForm.data || {}),
          employmentStatus,
          payRate,
          schadsLevel,
        },
        adminSignature,
        adminSignedAt: new Date(adminSignedAt),
      },
    });

    // Update StaffFormAssignment status to "completed" since both staff and admin have signed
    const formKey = 'employee_details'; // Use snake_case for formKey
    const assignment = await prisma.staffFormAssignment.findFirst({
      where: {
        staffId: staffId,
        form: {
          formKey: formKey,
        },
      },
    });

    if (assignment) {
      await prisma.staffFormAssignment.update({
        where: { id: assignment.id },
        data: {
          currentStatus: 'completed',
          isCompleted: true,
        },
      });

      // Check if batch is completed and trigger email
      console.log(`🔍 [EMPLOYEE DETAILS ADMIN] Form completed, checking batch completion...`);
      await checkAndTriggerStaffBatchEmail(staffId, 'employee_details');
    }

    return NextResponse.json({
      success: true,
      message: 'Admin section submitted successfully',
      data: updated,
    });

  } catch (error: any) {
    console.error('Error submitting admin section:', error);
    return NextResponse.json({ 
      error: 'Failed to submit admin section',
      message: error.message 
    }, { status: 500 });
  }
}

