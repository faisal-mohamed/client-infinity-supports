import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, forms } = body;

    // Support both single form and multiple forms
    const formsToAssign = Array.isArray(forms) ? forms : [{ formKey: body.formKey, baseVersion: body.baseVersion }];

    if (!clientId || !formsToAssign.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const results = [];
    const errors = [];

    // Process each form assignment
    for (const form of formsToAssign) {
      const { formKey, baseVersion } = form;
      
      if (!formKey || baseVersion === undefined) {
        errors.push({ formKey, error: 'Missing formKey or baseVersion' });
        continue;
      }

      try {
        // 1. Verify MasterForm exists
        const masterForm = await prisma.masterForm.findUnique({
          where: {
            formKey_version: {
              formKey,
              version: baseVersion
            }
          }
        });

        if (!masterForm) {
          errors.push({ formKey, error: 'Master form not found' });
          continue;
        }

        // 2. Check if already assigned with same base + client version
        const existing = await prisma.clientForm.findFirst({
          where: {
            clientId,
            formKey,
            baseVersion,
            clientVersion: baseVersion // initial clientVersion same as base
          }
        });

        if (existing) {
          errors.push({ formKey, error: 'Form already assigned to client' });
          continue;
        }

        // 3. Create ClientForm assignment
        const assigned = await prisma.clientForm.create({
          data: {
            clientId,
            formKey,
            baseVersion,
            clientVersion: baseVersion, // initially same, can later be overridden
            status: 'assigned'
          }
        });

        // 4. Log the activity
        await prisma.formActivityLog.create({
          data: {
            clientId,
            formKey,
            baseVersion,
            clientVersion: baseVersion,
            action: 'FORM_ASSIGNED',
            performedById: req.headers.get('x-admin-id') ? parseInt(req.headers.get('x-admin-id') as string) : null,
            metadata: {
              formTitle: masterForm.title,
              assignedAt: new Date().toISOString()
            }
          }
        });

        results.push({
          formKey,
          baseVersion,
          clientVersion: baseVersion,
          status: 'assigned',
          success: true
        });
      } catch (err) {
        console.error(`Error assigning form ${formKey}:`, err);
        errors.push({ formKey, error: 'Processing error' });
      }
    }

    return NextResponse.json({
      message: results.length > 0 ? 'Forms assigned to client successfully' : 'No forms were assigned',
      data: {
        successful: results,
        failed: errors
      }
    }, { status: errors.length && !results.length ? 400 : 200 });

  } catch (err) {
    console.error('Form assignment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
