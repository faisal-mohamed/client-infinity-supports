import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { clientId, formKey, baseVersion } = await req.json();

    if (!clientId || !formKey || baseVersion === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
      return NextResponse.json({ error: 'Master form not found' }, { status: 404 });
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
      return NextResponse.json({ error: 'Form already assigned to client' }, { status: 409 });
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

    return NextResponse.json({
      message: 'Form assigned to client successfully',
      data: assigned
    });

  } catch (err) {
    console.error('Form assignment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
