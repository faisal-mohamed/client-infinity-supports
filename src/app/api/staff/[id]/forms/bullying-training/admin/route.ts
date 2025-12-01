import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAndTriggerStaffBatchEmail } from '@/lib/staff-batch-email';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const staffId = parseInt(id, 10);
    if (!staffId) {
      return NextResponse.json({ error: 'Invalid staff id' }, { status: 400 });
    }

    const { managerName, managerSignature, managerSignedAt } = await req.json();

    if (!managerName?.trim() || !managerSignature) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Manager name and signature are required' },
        { status: 400 }
      );
    }

    const signatureDate = managerSignedAt ? new Date(managerSignedAt) : new Date();

    const db: any = prisma as any;

    // Try dedicated table first (backward compatibility)
    const dedicated = await db.staffBullyingTraining
      .findUnique({ where: { staffId } })
      .catch(() => null);

    if (dedicated) {
      const updated = await db.staffBullyingTraining.update({
        where: { staffId },
        data: {
          data: {
            ...(dedicated.data || {}),
            managerName: managerName.trim(),
            managerSignature,
            managerSignedAt: signatureDate.toISOString(),
          },
          adminSignature: managerSignature,
          adminSignedAt: signatureDate,
        },
      });

      // Update StaffFormAssignment status to "completed" since both staff and admin have signed
      const formKey = 'bullying_training';
      const assignment = await prisma.staffFormAssignment.findFirst({
        where: {
          staffId: staffId,
          form: {
            formKey: formKey,
          },
        },
      });

      if (assignment) {
        await prisma.staffFormAssignment.update({
          where: { id: assignment.id },
          data: {
            currentStatus: 'completed',
            isCompleted: true,
          },
        });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    // Fallback to generic submissions table
    const submission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'bullying_training',
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Form not found', message: 'Staff must submit their section before manager approval' },
        { status: 404 }
      );
    }

    if (!submission.staffSignature) {
      return NextResponse.json(
        { error: 'Staff signature required', message: 'Staff member must sign before manager acknowledgement' },
        { status: 400 }
      );
    }

    const updated = await db.staffFormSubmission.update({
      where: {
        staffId_formKey: {
          staffId,
          formKey: 'bullying_training',
        },
      },
      data: {
        data: {
          ...(submission.data || {}),
          managerName: managerName.trim(),
          managerSignature,
          managerSignedAt: signatureDate.toISOString(),
        },
        adminSignature: managerSignature,
        adminSignedAt: signatureDate,
      },
    });

    // Update StaffFormAssignment status to "completed" since both staff and admin have signed
    const formKey = 'bullying_training';
    const assignment = await prisma.staffFormAssignment.findFirst({
      where: {
        staffId: staffId,
        form: {
          formKey: formKey,
        },
      },
    });

    if (assignment) {
      await prisma.staffFormAssignment.update({
        where: { id: assignment.id },
        data: {
          currentStatus: 'completed',
          isCompleted: true,
        },
      });

      // Check if batch is completed and trigger email
      console.log(`🔍 [BULLYING TRAINING ADMIN] Form completed, checking batch completion...`);
      await checkAndTriggerStaffBatchEmail(staffId, 'bullying_training');
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error submitting manager acknowledgement:', error);
    return NextResponse.json(
      { error: 'Failed to save manager acknowledgement', message: error.message },
      { status: 500 }
    );
  }
}


