import AdminReviewPageClient from "./AdminReviewPageClient";
import { getAdminReviewData } from "@/lib/adminReviewUtils";

export const metadata = {
    title: "Admin Review | Infinity Support WA",
    description: "Review forms awaiting administrator signature",
};

export default async function AdminReviewPage() {
    // Pre-fetch initial data on the server for instant loading
    const initialData = await getAdminReviewData({
        status: "pending_admin_review",
        page: 1,
        pageSize: 10
    });

    return <AdminReviewPageClient initialData={initialData} />;
}
