import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id, 10);

    if (!staffId) {
      return NextResponse.json({ error: 'Invalid staff id' }, { status: 400 });
    }

    const db: any = prisma as any;
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
      },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const submission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'fair_work_information',
        },
      },
    });

    if (!submission) {
      return NextResponse.json({
        staff,
        data: null,
        submission: null,
      });
    }

    const formData = { ...(submission.data || {}) };

    if (!formData.staffName) {
      formData.staffName = `${staff.firstName || ''} ${staff.surname || ''}`.trim();
    }

    if (!formData.signature && submission.staffSignature) {
      formData.signature = submission.staffSignature;
    }

    if (!formData.staffSignature && submission.staffSignature) {
      formData.staffSignature = submission.staffSignature;
    }

    const dateValue =
      formData.date ||
      formData.acknowledgedAt ||
      formData.staffSignedAt ||
      (submission.staffSignedAt
        ? new Date(submission.staffSignedAt).toISOString().split('T')[0]
        : '');

    if (dateValue) {
      formData.date = dateValue;
    }

    return NextResponse.json({
      staff,
      data: formData,
      submission: {
        id: submission.id,
        isSubmitted: submission.isSubmitted,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching fairwork submission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch fairwork submission' },
      { status: 500 }
    );
  }
}


