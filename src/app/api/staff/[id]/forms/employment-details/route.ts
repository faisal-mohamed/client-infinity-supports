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

    // Try dedicated table first, then fallback to generic table (backward compatible)
    let employmentDetails = await db.staffEmploymentDetails.findUnique({
      where: { staffId }
    }).catch(() => null);

    // Fallback to generic table
    if (!employmentDetails) {
      const submission = await db.staffFormSubmission.findUnique({
        where: { 
          staffId_formKey: { 
            staffId, 
            formKey: 'employeeDetails' 
          } 
        }
      });
      
      if (!submission) {
        return NextResponse.json({ error: 'Employment details not found' }, { status: 404 });
      }

      // Transform generic submission to match expected format
      employmentDetails = {
        id: submission.id,
        staffId: submission.staffId,
        data: submission.data,
        staffSignature: submission.staffSignature,
        staffSignedAt: submission.staffSignedAt,
        adminSignature: submission.adminSignature,
        adminSignedAt: submission.adminSignedAt,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt
      };
    }

    return NextResponse.json({
      ...employmentDetails,
      staff
    });
  } catch (error: any) {
    console.error('Error fetching employment details:', error);
    return NextResponse.json({ error: 'Failed to fetch employment details' }, { status: 500 });
  }
}
