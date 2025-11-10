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

    const bullyingHarassmentTraining = await db.staffBullyingHarassmentTraining.findUnique({
      where: { staffId }
    });

    if (!bullyingHarassmentTraining) {
      return NextResponse.json({ error: 'Bullying and Harassment Training form not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...bullyingHarassmentTraining,
      staff
    });
  } catch (error: any) {
    console.error('Error fetching bullying harassment training form:', error);
    return NextResponse.json({ error: 'Failed to fetch bullying harassment training form' }, { status: 500 });
  }
}

