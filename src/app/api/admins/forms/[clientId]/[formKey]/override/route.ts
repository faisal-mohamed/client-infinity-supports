import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { clientId: string; formKey: string } }
) {
  try {
    const clientId = parseInt(params.clientId);
    const { formKey } = params;
    const { schema, baseVersion } = await req.json();

    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    if (!schema) {
      return NextResponse.json({ error: 'Form schema is required' }, { status: 400 });
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Find the current client form assignment
    const currentAssignment = await prisma.clientForm.findFirst({
      where: {
        clientId,
        formKey,
        baseVersion: baseVersion ? parseInt(baseVersion) : undefined
      },
      orderBy: {
        clientVersion: 'desc'
      }
    });

    if (!currentAssignment) {
      return NextResponse.json({ 
        error: 'Form not assigned to client or base version not found' 
      }, { status: 404 });
    }

    // Calculate new client version
    const newClientVersion = currentAssignment.clientVersion + 1;

    // Create new client form assignment with incremented client version
    const newAssignment = await prisma.clientForm.create({
      data: {
        clientId,
        formKey,
        baseVersion: currentAssignment.baseVersion,
        clientVersion: newClientVersion,
        status: 'assigned'
      }
    });

    // Create a form submission with the custom schema
    const formSubmission = await prisma.formSubmission.create({
      data: {
        clientId,
        formKey,
        baseVersion: currentAssignment.baseVersion,
        clientVersion: newClientVersion,
        data: schema,
        isSubmitted: false
      }
    });

    // Log the activity
    await prisma.formActivityLog.create({
      data: {
        clientId,
        formKey,
        baseVersion: currentAssignment.baseVersion,
        clientVersion: newClientVersion,
        action: 'FORM_SCHEMA_OVERRIDE',
        performedById: req.headers.get('x-admin-id') ? parseInt(req.headers.get('x-admin-id') as string) : null,
        metadata: {
          previousClientVersion: currentAssignment.clientVersion,
          createdAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: 'Client-specific form version created successfully',
      data: {
        assignment: newAssignment,
        submission: formSubmission
      }
    });
  } catch (err) {
    console.error('Error creating client-specific form version:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
