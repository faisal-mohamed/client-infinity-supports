import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  {
    params
  }: {
    params: { clientId: string; formKey: string; clientVersion: string };
  }
) {
  try {
    const { status, data } = await req.json();
    const clientId = parseInt(params.clientId);
    const clientVersion = parseInt(params.clientVersion);
    const { formKey } = params;

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
        status: status || 'assigned',
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
          updatedAt: new Date()
        },
       create: {
  clientId,
  formKey,
  clientVersion,
  baseVersion: existing.baseVersion, // ✅ This fixes the error
  data,
  isSubmitted: false
}

      });
    }

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
