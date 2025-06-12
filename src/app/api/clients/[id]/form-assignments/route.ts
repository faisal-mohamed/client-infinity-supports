import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = parseInt(params.id);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    // Get all form assignments for the client
    const formAssignments = await prisma.formAssignment.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        form: {
          select: {
            id: true,
            title: true,
            version: true,
          },
        },
        batch: {
          select: {
            id: true,
            batchToken: true,
            expiresAt: true,
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    return NextResponse.json(formAssignments);
  } catch (error) {
    console.error('Error fetching client form assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client form assignments' },
      { status: 500 }
    );
  }
}
