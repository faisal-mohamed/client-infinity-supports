import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formKey, version, title, schema } = body;

    if (!formKey || !version || !title || !schema) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the formKey+version already exists
    const existing = await prisma.masterForm.findUnique({
      where: {
        formKey_version: {
          formKey,
          version
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Form with this key and version already exists' }, { status: 409 });
    }

    const created = await prisma.masterForm.create({
      data: {
        formKey,
        version,
        title,
        schema
      }
    });

    return NextResponse.json({
      message: 'Form schema registered successfully',
      data: created
    });
  } catch (err) {
    console.error('Error registering form schema:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
