import { NextRequest, NextResponse } from "next/server";
import { getAdminReviewData } from "@/lib/adminReviewUtils";
import { getTenantContext } from "@/lib/tenant-context";

export async function GET(req: NextRequest) {
    try {
        const tenant = await getTenantContext();
        if (!tenant) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "pending_admin_review";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const data = await getAdminReviewData({
            status,
            search,
            page,
            pageSize,
            organizationId: tenant.organizationId
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching admin review actions:", error);
        return NextResponse.json(
            { error: "Failed to fetch pending actions", details: error.message },
            { status: 500 }
        );
    }
}
