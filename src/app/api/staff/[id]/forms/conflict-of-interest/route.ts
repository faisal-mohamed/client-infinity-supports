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
    
    // Get staff data
    const staff = await db.staff.findUnique({
      where: { id: staffId },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Get the conflict_of_interest form submission
    const formSubmission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'conflict_of_interest'
        }
      }
    });

    return NextResponse.json({
      staff,
      data: formSubmission?.data || {},
      ...formSubmission,
    });
  } catch (error: any) {
    console.error('Error fetching conflict of interest form:', error);
    return NextResponse.json({ error: 'Failed to fetch form data' }, { status: 500 });
  }
}

