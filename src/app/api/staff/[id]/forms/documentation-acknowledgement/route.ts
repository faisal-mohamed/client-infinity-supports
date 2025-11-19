import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    
    const db: any = prisma as any;
    
    // Get staff data
    const staff = await db.staff.findUnique({
      where: { id: staffId },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Get the documentation_acknowledgement form submission
    const formSubmission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'documentation_acknowledgement'
        }
      }
    });

    // Merge signature data from top-level fields
    const submissionData = formSubmission?.data || {};
    const formData = {
      ...submissionData,
      // Merge signature from top-level staffSignature, fallback to data.signature
      signature: formSubmission?.staffSignature || submissionData?.signature || '',
      date: formSubmission?.staffSignedAt 
        ? new Date(formSubmission.staffSignedAt).toISOString().split('T')[0]
        : (submissionData?.date || ''),
    };

    return NextResponse.json({
      staff,
      data: formData,
      ...formSubmission,
    });
  } catch (error: any) {
    console.error('Error fetching documentation acknowledgement form:', error);
    return NextResponse.json({ error: 'Failed to fetch form data' }, { status: 500 });
  }
}

