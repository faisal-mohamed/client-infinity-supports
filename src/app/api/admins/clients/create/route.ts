import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, ndisNumber, phone } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
    }

    // Check for duplicate email if provided
    if (email) {
      const existingEmail = await prisma.client.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    // Check for duplicate NDIS number if provided
    if (ndisNumber) {
      const existingNdis = await prisma.client.findUnique({
        where: { ndisNumber }
      });

      if (existingNdis) {
        return NextResponse.json({ error: 'NDIS number already in use' }, { status: 409 });
      }
    }

    // Create the client
    const client = await prisma.client.create({
      data: {
        name,
        email,
        ndisNumber,
        phone
      }
    });

    // Log the activity
    await prisma.formActivityLog.create({
      data: {
        clientId: client.id,
        action: 'CLIENT_CREATED',
        performedById: req.headers.get('x-admin-id') ? parseInt(req.headers.get('x-admin-id') as string) : null,
        metadata: {
          createdAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: 'Client created successfully',
      data: client
    });
  } catch (err) {
    console.error('Error creating client:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
