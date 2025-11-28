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
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check generic submissions table first (current storage)
    const submission = await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'employee_welcome',
        },
      },
    });

    let employmentWelcome: any = null;
    if (submission) {
      employmentWelcome = {
        data: submission.data || {},
        staffSignature: submission.staffSignature,
        staffSignedAt: submission.staffSignedAt,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      };
    } else {
      // Fallback to dedicated table for backward compatibility
      try {
        employmentWelcome = await db.staffEmploymentWelcomeAck.findUnique({
          where: { staffId }
        });
      } catch (error) {
        // Table might not exist, ignore
        console.warn('Employment Welcome legacy table lookup failed:', error);
      }
    }

    if (!employmentWelcome) {
      return NextResponse.json({ error: 'Employment welcome form not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...employmentWelcome,
      staff
    });
  } catch (error: any) {
    console.error('Error fetching employment welcome:', error);
    return NextResponse.json({ error: 'Failed to fetch employment welcome' }, { status: 500 });
  }
}
