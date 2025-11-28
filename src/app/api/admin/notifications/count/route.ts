import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    // Get admin session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get admin ID from session - only select fields that exist in database
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true }
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Get type parameter (client or staff)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'client'; // Default to client

    let unreadCount = 0;

    if (type === 'staff') {
      // Get unread staff notifications count
      unreadCount = await prisma.staffSubmissionNotification.count({
        where: {
          adminId: admin.id,
          isRead: false
        }
      });
    } else {
      // Get unread client notifications count (default)
      unreadCount = await prisma.formSubmissionNotification.count({
        where: {
          adminId: admin.id,
          isRead: false
        }
      });
    }

    return NextResponse.json({
      unreadCount
    });

  } catch (error: any) {
    console.error("Error fetching notification count:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification count", details: error.message },
      { status: 500 }
    );
  }
}
