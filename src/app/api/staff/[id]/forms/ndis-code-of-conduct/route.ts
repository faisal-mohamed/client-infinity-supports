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

    // Check generic submissions table first (current storage)
    const submission = await prisma.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'ndis_code_of_conduct',
        },
      },
    });

    let ndisCodeOfConduct: any = null;
    if (submission) {
      ndisCodeOfConduct = {
        data: submission.data || {},
        staffSignature: submission.staffSignature,
        staffSignedAt: submission.staffSignedAt,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      };
    } else {
      // Fallback to dedicated table for backward compatibility
      try {
        ndisCodeOfConduct = await db.staffNdisCodeOfConduct.findUnique({
          where: { staffId },
        });
      } catch (error) {
        // Table might not exist, ignore
        console.warn('NDIS Code of Conduct legacy table lookup failed:', error);
      }
    }

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

