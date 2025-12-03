import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);

    console.log('📥 [API] Fetching Vehicle Safety Inspection form for staff:', staffId);

    // Fetch staff data with submissions
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        submissions: {
          where: { formKey: 'vehicle_safety_inspection' }
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
    const submission = staff.submissions.find(s => s.formKey === 'vehicle_safety_inspection');
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    const responseData = {
      ...(submission.data as any),
      signature: submission.staffSignature,
      signatureDate: submission.staffSignedAt,
      isSubmitted: submission.isSubmitted,
      createdAt: submission.createdAt,
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone
      }
    };

    console.log('✅ [API] Vehicle Safety Inspection form data retrieved');

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('❌ [API] Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form data', details: error.message },
      { status: 500 }
    );
  }
}

