import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const totalClients = await prisma.client.count({ where: { archivedAt: null } });

    const newClientsThisMonth = await prisma.client.count({
      where: {
        archivedAt: null,
        createdAt: {
          gte: startOfMonth(new Date())
        }
      }
    });

    const completedForms = await prisma.formAssignment.count({
  where: {
    archivedAt: null,
    currentStatus: 'completed'
  }
});


    const notStarted = await prisma.formAssignment.count({
      where: {
        archivedAt: null,
        currentStatus: 'not_started' // ✅ fixed from 'pending'
      }
    });

    const formsInProgress = await prisma.formAssignment.count({
      where: {
        archivedAt: null,
        currentStatus: 'in_progress'
      }
    });

    const signatureRequests = await prisma.formSubmission.count({
  where: {
    OR: [
      { clientSignature: null },
      { clientSignature: "" }
    ],
    form: {
      requiresSignature: true
    }
  }
});


const completedSignatures = await prisma.formSubmission.count({
  where: {
    OR: [
      { clientSignature: { not: null } },
      { clientSignature: { not: "" } }
    ],
    form: {
      requiresSignature: true
    }
  }
});



    return NextResponse.json({
      totalClients,
      newClientsThisMonth,
      completedForms,
      notStarted,
      formsInProgress,
      signatureRequests,
      completedSignatures,
    });
  } catch (error) {
    console.error("Dashboard stats fetch error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats.' },
      { status: 500 }
    );
  }
}
