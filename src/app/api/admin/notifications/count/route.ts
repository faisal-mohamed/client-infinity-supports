import { NextRequest, NextResponse } from "next/server";
import { getAdminByEmail } from "@/lib/db/admin";
import { getUnreadCount } from "@/lib/db/notifications";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await getAdminByEmail(session.user.email);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const unreadCount = await getUnreadCount(admin.id);

    return NextResponse.json({ unreadCount });

  } catch (error: any) {
    console.error("Error fetching notification count:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification count", details: error.message },
      { status: 500 }
    );
  }
}
