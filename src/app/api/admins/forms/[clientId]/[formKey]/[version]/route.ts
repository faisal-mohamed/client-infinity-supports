import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Valid form statuses
const VALID_STATUSES = ['assigned', 'in-progress', 'submitted', 'approved', 'rejected'];

export async function PUT(
  req: NextRequest,
  {
    params
  }: {
    params: { clientId: string; formKey: string; version: string };
  }
) {
  try {
    const { status, data } = await req.json();
    const clientId = parseInt(params.clientId);
    const clientVersion = parseInt(params.version);
    const { formKey } = params;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      }, { status: 400 });
    }

    // Step 1: Check if client form assignment exists
    const existing = await prisma.clientForm.findFirst({
      where: {
        clientId,
        formKey,
        clientVersion
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Form assignment not found' }, { status: 404 });
    }

    if (!existing?.baseVersion) {
      return NextResponse.json({ error: 'Base version missing on assignment' }, { status: 500 });
    }

    // Step 2: Update status if provided
    const updatedAssignment = await prisma.clientForm.updateMany({
      where: {
        clientId,
        formKey,
        clientVersion
      },
      data: {
        status: status || existing.status,
        updatedAt: new Date()
      }
    });

    // Step 3: Update or create submission if data provided
    let updatedSubmission = null;
    if (data) {
      updatedSubmission = await prisma.formSubmission.upsert({
        where: {
          clientId_formKey_clientVersion: {
            clientId,
            formKey,
            clientVersion
          }
        },
        update: {
          data,
          updatedAt: new Date(),
          isSubmitted: status === 'submitted' ? true : undefined,
          submittedAt: status === 'submitted' ? new Date() : undefined
        },
        create: {
          clientId,
          formKey,
          clientVersion,
          baseVersion: existing.baseVersion,
          data,
          isSubmitted: status === 'submitted',
          submittedAt: status === 'submitted' ? new Date() : null
        }
      });
    }

    // Step 4: Log the activity
    await prisma.formActivityLog.create({
      data: {
        clientId,
        formKey,
        baseVersion: existing.baseVersion,
        clientVersion,
        action: status ? `FORM_STATUS_${status.toUpperCase()}` : 'FORM_DATA_UPDATED',
        performedById: req.headers.get('x-admin-id') ? parseInt(req.headers.get('x-admin-id') as string) : null,
        metadata: {
          updatedAt: new Date().toISOString(),
          hasDataChanges: !!data
        }
      }
    });

    return NextResponse.json({
      message: 'Client form updated successfully',
      assignment: updatedAssignment,
      submission: updatedSubmission
    });
  } catch (err) {
    console.error('Error updating client form:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
