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

    const supportWorker = await db.staffSupportWorker.findUnique({
      where: { staffId },
    });

    if (!supportWorker) {
      return NextResponse.json({ error: 'Support worker form not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...supportWorker,
      staff,
    });
  } catch (error: any) {
    console.error('Error fetching support worker form:', error);
    return NextResponse.json({ error: 'Failed to fetch support worker form' }, { status: 500 });
  }
}
