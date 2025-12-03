import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    // Get admin session (you'll need to adjust this based on your auth setup)
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get admin ID from session
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {
      adminId: admin.id
    };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    // Get notifications with related data
    const notifications = await prisma.formSubmissionNotification.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        formSubmission: {
          include: {
            form: {
              select: {
                id: true,
                title: true,
                formKey: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Enrich notifications with form assignment status
    const enrichedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        // Get form assignment status for this form submission
        const formAssignment = await prisma.formAssignment.findFirst({
          where: {
            clientId: notification.clientId,
            formId: notification.formSubmission.formId,
            formVersion: notification.formSubmission.formVersion,
          },
          select: {
            currentStatus: true,
          },
        });

        return {
          ...notification,
          formAssignmentStatus: formAssignment?.currentStatus || 'unknown',
        };
      })
    );

    // Get total count for pagination
    const totalCount = await prisma.formSubmissionNotification.count({
      where: whereClause
    });

    return NextResponse.json({
      notifications: enrichedNotifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error.message },
      { status: 500 }
    );
  }
}
