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
        formKey: 'ndis_workforce_capability'
      }
    });

    const ndisWorkforceCapability = await db.staffNdisWorkforceCapability.findUnique({
      where: { staffId }
    });

    // Process form data similar to other form endpoints
    let formData: Record<string, any> = {};
    
    if (ndisWorkforceCapability) {
      // Use dedicated table data
      formData = {
        ...(ndisWorkforceCapability.data || {}),
        staffSignature: ndisWorkforceCapability.staffSignature,
        staffSignedAt: ndisWorkforceCapability.staffSignedAt,
      };
    } else if (submission) {
      // Use submission data
      formData = {
        ...(submission.data || {}),
        staffSignature: submission.staffSignature,
        staffSignedAt: submission.staffSignedAt,
      };
    }

    // Add staffName if missing
    if (!formData.fullName && !formData.staffName) {
      formData.fullName = `${staff.firstName || ''} ${staff.surname || ''}`.trim();
      formData.staffName = formData.fullName;
    }

    // Add signature fields in various formats
    if (formData.staffSignature) {
      if (!formData.signature) {
        formData.signature = formData.staffSignature;
      }
    }

    // Add date fields
    const dateValue =
      formData.date ||
      formData.staffSignedAt ||
      (formData.staffSignedAt
        ? new Date(formData.staffSignedAt).toISOString().split('T')[0]
        : '');

    if (dateValue) {
      formData.date = dateValue;
    }

    return NextResponse.json({
      staff,
      data: formData,
      submission: submission ? {
        id: submission.id,
        isSubmitted: submission.isSubmitted,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      } : null,
    });
  } catch (error: any) {
    console.error('Error fetching NDIS Workforce Capability form:', error);
    return NextResponse.json({ error: 'Failed to fetch NDIS Workforce Capability form' }, { status: 500 });
  }
}

