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

    const ndisCodeOfConduct = await db.staffNdisCodeOfConduct.findUnique({
      where: { staffId }
    });

    if (!ndisCodeOfConduct) {
      return NextResponse.json({ error: 'NDIS code of conduct form not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...ndisCodeOfConduct,
      staff
    });
  } catch (error: any) {
    console.error('Error fetching NDIS code of conduct form:', error);
    return NextResponse.json({ error: 'Failed to fetch NDIS code of conduct form' }, { status: 500 });
  }
}

