import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const staffId = parseInt(id, 10);

    if (!staffId) {
      return NextResponse.json({ error: 'Invalid staff id' }, { status: 400 });
    }

    const db: any = prisma as any;

    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check both StaffFormSubmission and dedicated table
    const submission = await db.staffFormSubmission.findFirst({
      where: {
        staffId: staffId,
        formKey: 'bullying_harassment_training'
      }
    });

    const bullyingHarassmentTraining = await db.staffBullyingHarassmentTraining.findUnique({
      where: { staffId }
    });

    // Return empty data if form doesn't exist yet (for viewing empty form)
    const formData = bullyingHarassmentTraining || submission || { data: {}, staffSignature: null, staffSignedAt: null };

    return NextResponse.json({
      ...formData,
      staff,
    });
  } catch (error: any) {
    console.error('Error fetching Bullying & Harassment Training form:', error);
    return NextResponse.json({ error: 'Failed to fetch Bullying & Harassment Training form' }, { status: 500 });
  }
}





