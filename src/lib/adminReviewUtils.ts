import { prisma } from "@/lib/prisma";

export const ADMIN_REVIEW_FORMS = ['emergency_drill', 'conflict_of_interest'];

export async function getAdminReviewData({
    status = "pending_admin_review",
    search = "",
    page = 1,
    pageSize = 10
}: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}) {
    const skip = (page - 1) * pageSize;

    // Build the query to find clients with at least one form in the specified status
    const where: any = {
        FormAssignment: {
            some: {
                currentStatus: status,
                form: {
                    formKey: {
                        in: ADMIN_REVIEW_FORMS
                    }
                }
            },
        },
    };

    if (search) {
        const normalizedSearch = search.trim().toLowerCase();
        where.OR = [
            { name: { contains: normalizedSearch, mode: "insensitive" } },
            { email: { contains: normalizedSearch, mode: "insensitive" } },
            { phone: { contains: normalizedSearch, mode: "insensitive" } },
            {
                commonFields: {
                    OR: [
                        { name: { contains: normalizedSearch, mode: "insensitive" } },
                        { surname: { contains: normalizedSearch, mode: "insensitive" } },
                        { email: { contains: normalizedSearch, mode: "insensitive" } },
                        { phone: { contains: normalizedSearch, mode: "insensitive" } },
                        { ndis: { contains: normalizedSearch, mode: "insensitive" } },
                    ],
                },
            },
        ];
    }

    const [totalCount, clients] = await Promise.all([
        prisma.client.count({ where }),
        prisma.client.findMany({
            where,
            include: {
                commonFields: true,
                FormAssignment: {
                    where: {
                        currentStatus: status,
                        form: {
                            formKey: {
                                in: ADMIN_REVIEW_FORMS
                            }
                        }
                    },
                    include: {
                        form: {
                            select: {
                                id: true,
                                title: true,
                                formKey: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            skip,
            take: pageSize,
        }),
    ]);

    // Format the clients to match the expected structure
    const formattedClients = clients.map((client: any) => ({
        ...client,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
        pendingForms: client.FormAssignment.map((a: any) => ({
            id: a.id,
            title: a.form.title,
            formKey: a.form.formKey,
            currentStatus: a.currentStatus,
        })),
    }));

    return {
        clients: formattedClients,
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
