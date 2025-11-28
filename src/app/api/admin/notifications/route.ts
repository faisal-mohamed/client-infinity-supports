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
    const type = searchParams.get('type') || 'client'; // 'client' or 'staff'

    const skip = (page - 1) * limit;

    let notifications: any[] = [];
    let totalCount = 0;

    if (type === 'staff') {
      // Build where clause for staff notifications
      const whereClause: any = {
        adminId: admin.id
      };

      if (unreadOnly) {
        whereClause.isRead = false;
      }

      // Get staff notifications with related data
      notifications = await prisma.staffSubmissionNotification.findMany({
        where: whereClause,
        include: {
          staff: {
            select: {
              id: true,
              firstName: true,
              surname: true,
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

      // Get total count for pagination
      totalCount = await prisma.staffSubmissionNotification.count({
        where: whereClause
      });

      // Normalize staff notifications to match client notification structure
      notifications = notifications.map((notif: any) => ({
        id: notif.id,
        isRead: notif.isRead,
        createdAt: notif.createdAt,
        staff: {
          id: notif.staff.id,
          firstName: notif.staff.firstName,
          surname: notif.staff.surname,
          email: notif.staff.email
        },
        formSubmission: {
          id: notif.formSubmission.id,
          form: {
            id: notif.formSubmission.form?.id || 0,
            title: notif.formSubmission.form?.title || 'Unknown Form',
            formKey: notif.formSubmission.form?.formKey || notif.formSubmission.formKey || 'unknown'
          }
        }
      }));
    } else {
      // Build where clause for client notifications
      const whereClause: any = {
        adminId: admin.id
      };

      if (unreadOnly) {
        whereClause.isRead = false;
      }

      // Get client notifications with related data
      notifications = await prisma.formSubmissionNotification.findMany({
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

      // Get total count for pagination
      totalCount = await prisma.formSubmissionNotification.count({
        where: whereClause
      });
    }

    return NextResponse.json({
      notifications,
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
