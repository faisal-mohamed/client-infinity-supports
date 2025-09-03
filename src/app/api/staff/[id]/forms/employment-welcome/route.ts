import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const staffId = parseInt(params.id);
    
    const db: any = prisma as any;
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const employmentWelcome = await db.staffEmploymentWelcomeAck.findUnique({
      where: { staffId }
    });

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
