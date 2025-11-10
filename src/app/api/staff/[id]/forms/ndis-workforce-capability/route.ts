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

    const ndisWorkforceCapability = await db.staffNdisWorkforceCapability.findUnique({
      where: { staffId }
    });

    if (!ndisWorkforceCapability) {
      return NextResponse.json({ error: 'NDIS Workforce Capability form not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...ndisWorkforceCapability,
      staff
    });
  } catch (error: any) {
    console.error('Error fetching NDIS workforce capability form:', error);
    return NextResponse.json({ error: 'Failed to fetch NDIS workforce capability form' }, { status: 500 });
  }
}

