import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Check generic submissions table first (current approach)
    const submission = await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'bullying_training'
        }
      }
    });

    // Fallback to dedicated table for backward compatibility
    let bullyingTraining = null;
    if (submission) {
      bullyingTraining = {
        data: submission.data || {},
        staffSignature: submission.staffSignature,
        staffSignedAt: submission.staffSignedAt,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      };
    } else {
      try {
        const dedicated = await db.staffBullyingTraining.findUnique({
          where: { staffId }
        });
        if (dedicated) {
          bullyingTraining = dedicated;
        }
      } catch (e) {
        // Table might not exist, that's okay
      }
    }

    if (!bullyingTraining) {
      return NextResponse.json({ error: 'Bullying training form not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...bullyingTraining,
      staff
    });
  } catch (error: any) {
    console.error('Error fetching bullying training form:', error);
    return NextResponse.json({ error: 'Failed to fetch bullying training form' }, { status: 500 });
  }
}

