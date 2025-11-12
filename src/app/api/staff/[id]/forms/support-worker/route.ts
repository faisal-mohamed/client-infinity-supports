import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);

    console.log('📥 [API] Fetching Support Worker form for staff:', staffId);

    // Fetch staff data with submissions
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        submissions: {
          where: { formKey: 'support_worker' }
        }
      }
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Get form submission
    const submission = staff.submissions.find(s => s.formKey === 'support_worker');
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    const responseData = {
      ...submission.data,
      signature: submission.staffSignature,
      signatureDate: submission.staffSignedAt,
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone
      }
    };

    console.log('✅ [API] Support Worker form data retrieved');

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('❌ [API] Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form data', details: error.message },
      { status: 500 }
    );
  }
}
