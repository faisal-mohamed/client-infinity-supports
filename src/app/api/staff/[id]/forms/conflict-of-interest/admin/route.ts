import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    
    const body = await req.json();
    const { reviewedBy, reviewerTitle, reviewDate, actionTaken, hrDecision, reviewerSignature, reviewerDate } = body;

    // Validate required fields
    if (!reviewedBy || !reviewerTitle || !reviewDate || !hrDecision || !reviewerSignature || !reviewerDate) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Please fill all required fields: Reviewed By, Title, Review Date, HR Decision, Reviewer Signature, and Reviewer Date' 
      }, { status: 400 });
    }

    const db: any = prisma as any;
    
    // Get the existing form submission
    const genericForm = await db.staffFormSubmission.findUnique({
      where: { 
        staffId_formKey: { 
          staffId, 
          formKey: 'conflict_of_interest' 
        } 
      }
    });

    if (!genericForm) {
      return NextResponse.json({ 
        error: 'Form not found',
        message: 'Staff must complete their section first' 
      }, { status: 404 });
    }

    // Check if staff has signed
    // For conflict_of_interest, signature is stored in data.employeeSignature
    const formData = genericForm.data || {};
    const hasEmployeeSignature = genericForm.staffSignature || formData.employeeSignature;
    
    if (!hasEmployeeSignature) {
      return NextResponse.json({ 
        error: 'Staff signature required',
        message: 'Staff member must sign the form before HR review' 
      }, { status: 400 });
    }

    // Update with HR data
    const updated = await db.staffFormSubmission.update({
      where: { 
        staffId_formKey: { 
          staffId, 
          formKey: 'conflict_of_interest' 
        } 
      },
      data: {
        data: {
          ...(genericForm.data || {}),
          reviewedBy,
          reviewerTitle,
          reviewDate,
          actionTaken,
          hrDecision,
          reviewerSignature,
          reviewerDate,
        },
        adminSignature: reviewerSignature, // Store reviewer signature as admin signature
        adminSignedAt: new Date(reviewerDate),
        isSubmitted: true, // Mark as submitted when HR completes
      },
    });

    // Update StaffFormAssignment status to "completed" since both staff and admin have signed
    const formKey = 'conflict_of_interest';
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
    }

    return NextResponse.json({
      success: true,
      message: 'HR section submitted successfully. Form status updated to completed.',
      data: updated,
    });

  } catch (error: any) {
    console.error('Error submitting HR section:', error);
    return NextResponse.json({ 
      error: 'Failed to submit HR section',
      message: error.message 
    }, { status: 500 });
  }
}

