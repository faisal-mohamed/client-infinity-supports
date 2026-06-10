import { listClients } from "@/lib/db/client";
import { getClientAssignments } from "@/lib/db/forms";

export const ADMIN_REVIEW_FORMS = ['emergency_drill', 'conflict_of_interest'];

export async function getAdminReviewData({
    status = "pending_admin_review",
    search = "",
    page = 1,
    pageSize = 10,
    organizationId
}: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    organizationId?: string;
}) {
    // Get all active clients scoped to org
    const { clients: allClients } = await listClients({ search: search || undefined, page: 1, pageSize: 100000, organizationId });

    // For each client, check if they have assignments matching criteria
    const clientsWithPendingForms = await Promise.all(
        allClients.map(async (client) => {
            const assignments = await getClientAssignments(client.id);
            const pendingForms = assignments.filter(
                (a) => a.currentStatus === status && !a.archivedAt && ADMIN_REVIEW_FORMS.includes(a.formKey)
            );
            if (pendingForms.length === 0) return null;
            return {
                ...client,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
                pendingForms: pendingForms.map((a) => ({
                    id: a.id,
                    title: a.formTitle,
                    formKey: a.formKey,
                    currentStatus: a.currentStatus,
                })),
            };
        })
    );

    const filtered = clientsWithPendingForms.filter(Boolean) as any[];
    const totalCount = filtered.length;
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return {
        clients: paginated,
        pagination: {
            page,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            hasNextPage: page < Math.ceil(totalCount / pageSize),
            hasPreviousPage: page > 1,
        },
    };
}
