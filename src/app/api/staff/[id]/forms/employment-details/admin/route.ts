import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    
    const body = await req.json();
    const { employmentStatus, payRate, schadsLevel, adminSignature, adminSignedAt } = body;

    // Validate required fields
    if (!employmentStatus || !payRate || !schadsLevel || !adminSignature) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Please fill all required fields: Employment Status, Pay Rate, SCHADS Level, and Admin Signature' 
      }, { status: 400 });
    }

    const db: any = prisma as any;
    
    // Check if employment details exist
    const existing = await db.staffEmploymentDetails.findUnique({
      where: { staffId }
    });

    if (!existing) {
      return NextResponse.json({ 
        error: 'Employment details not found',
        message: 'Staff must complete their section first' 
      }, { status: 404 });
    }

    // Check if staff has signed
    if (!existing.staffSignature) {
      return NextResponse.json({ 
        error: 'Staff signature required',
        message: 'Staff member must sign the form before admin approval' 
      }, { status: 400 });
    }

    // Update with admin data
    const updated = await db.staffEmploymentDetails.update({
      where: { staffId },
      data: {
        data: {
          ...existing.data,
          employmentStatus,
          payRate,
          schadsLevel,
        },
        adminSignature,
        adminSignedAt: new Date(adminSignedAt),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin section submitted successfully',
      data: updated,
    });

  } catch (error: any) {
    console.error('Error submitting admin section:', error);
    return NextResponse.json({ 
      error: 'Failed to submit admin section',
      message: error.message 
    }, { status: 500 });
  }
}

