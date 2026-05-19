import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'client'; // 'client' or 'staff'

    if (type === 'staff') {
      // Staff statistics
      const totalStaff = await prisma.staff.count({
        where: {
          status: { not: 'deleted' }
        }
      });

      const newStaffThisMonth = await prisma.staff.count({
        where: {
          createdAt: {
            gte: startOfMonth(new Date())
          },
          status: { not: 'deleted' }
        }
      });

      const completedForms = await prisma.staffFormAssignment.count({
        where: {
          currentStatus: 'completed'
        }
      });

      const notStarted = await prisma.staffFormAssignment.count({
        where: {
          currentStatus: 'not_started'
        }
      });

      const formsInProgress = await prisma.staffFormAssignment.count({
        where: {
          currentStatus: 'in_progress'
        }
      });

      const signatureRequests = await prisma.staffFormSubmission.count({
        where: {
          OR: [
            { staffSignature: null },
            { staffSignature: "" }
          ],
          MasterForm: {
            requiresSignature: true
          }
        }
      });

      const completedSignatures = await prisma.staffFormSubmission.count({
        where: {
          OR: [
            { staffSignature: { not: null } },
            { staffSignature: { not: "" } }
          ],
          MasterForm: {
            requiresSignature: true
          }
        }
      });

      return NextResponse.json({
        totalStaff,
        newStaffThisMonth,
        completedForms,
        notStarted,
        formsInProgress,
        signatureRequests,
        completedSignatures,
      });
    } else {
      // Client statistics (default)
      const totalClients = await prisma.client.count();

      const newClientsThisMonth = await prisma.client.count({
        where: {
          createdAt: {
            gte: startOfMonth(new Date())
          }
        }
      });

      const completedForms = await prisma.formAssignment.count({
        where: {
          currentStatus: 'completed'
        }
      });

      const notStarted = await prisma.formAssignment.count({
        where: {
          currentStatus: 'not_started'
        }
      });

      const formsInProgress = await prisma.formAssignment.count({
        where: {
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
    }
  } catch (error) {
    console.error("Dashboard stats fetch error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats.' },
      { status: 500 }
    );
  }
}
