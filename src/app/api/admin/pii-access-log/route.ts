import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createPIIAccessLog } from "@/lib/db/audit";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clientId, formId, assignmentId, action, timestamp } = body;

    if (!clientId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await createPIIAccessLog({
      adminId: session.user.id,
      clientId,
      formId: formId || null,
      assignmentId: assignmentId || null,
      action,
      accessedAt: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
      userAgent: req.headers.get("user-agent") || null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PII Access Log] Error:", error);
    return NextResponse.json(
      { error: "Failed to log PII access" },
      { status: 500 }
    );
  }
}
