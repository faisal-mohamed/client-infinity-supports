import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { getOrgSignedDocuments } from '@/lib/db/forms';
import { getClientById } from '@/lib/db/client';

/**
 * GET /api/documents
 * Lists all signed/completed form submissions for the provider's organization.
 * Supports filtering by formKey, clientId, date range, and pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const formKey = searchParams.get('formKey') || '';
    const clientId = searchParams.get('clientId') || '';
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';

    let documents = await getOrgSignedDocuments(tenant.organizationId);

    // Filters
    if (formKey) documents = documents.filter(d => d.formKey === formKey);
    if (clientId) documents = documents.filter(d => d.clientId === clientId);
    if (dateFrom) documents = documents.filter(d => d.clientSignedAt && d.clientSignedAt >= dateFrom);
    if (dateTo) documents = documents.filter(d => d.clientSignedAt && d.clientSignedAt <= dateTo);
    if (search) {
      const s = search.toLowerCase();
      documents = documents.filter(d => d.formTitle?.toLowerCase().includes(s) || d.formKey?.toLowerCase().includes(s));
    }

    // Sort by signed date descending
    documents.sort((a, b) => (b.clientSignedAt || b.updatedAt).localeCompare(a.clientSignedAt || a.updatedAt));

    // Enrich with client names
    const clientCache: Record<string, string> = {};
    const paginated = documents.slice((page - 1) * pageSize, page * pageSize);

    const enriched = await Promise.all(paginated.map(async (doc) => {
      if (!clientCache[doc.clientId]) {
        const client = await getClientById(doc.clientId);
        clientCache[doc.clientId] = client?.name || `${client?.commonFields?.name || ''} ${client?.commonFields?.surname || ''}`.trim() || 'Unknown';
      }
      return {
        id: doc.id,
        clientId: doc.clientId,
        clientName: clientCache[doc.clientId],
        formKey: doc.formKey,
        formTitle: doc.formTitle,
        versionNumber: doc.versionNumber || 1,
        isLocked: doc.isLocked || false,
        signedAt: doc.clientSignedAt,
        hasS3Pdf: !!doc.signedPdfS3Key,
        signedPdfS3Key: doc.signedPdfS3Key || null,
        updatedAt: doc.updatedAt,
      };
    }));

    const totalCount = documents.length;
    return NextResponse.json({
      documents: enriched,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error: any) {
    console.error('[Documents API] Error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
