import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { getDownloadUrl } from '@/lib/s3';
import { getSubmissionById } from '@/lib/db/forms';

/**
 * GET /api/documents/download?submissionId=xxx
 * GET /api/documents/download?s3Key=xxx (for archived versions)
 * Returns a presigned S3 URL for the signed PDF.
 */
export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const submissionId = req.nextUrl.searchParams.get('submissionId');
    const s3Key = req.nextUrl.searchParams.get('s3Key');

    if (!submissionId && !s3Key) {
      return NextResponse.json({ error: 'submissionId or s3Key is required' }, { status: 400 });
    }

    let pdfKey: string | undefined;
    let filename = 'document.pdf';

    if (s3Key) {
      // Direct S3 key (for archived versions)
      if (!s3Key.includes(tenant.organizationId) && !s3Key.includes('default')) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      pdfKey = s3Key;
      filename = s3Key.split('/').pop() || 'document.pdf';
    } else if (submissionId) {
      const submission = await getSubmissionById(submissionId);
      if (!submission) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      }
      if (submission.organizationId && submission.organizationId !== tenant.organizationId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      pdfKey = submission.signedPdfS3Key;
      filename = `${submission.formTitle || submission.formKey}-v${submission.versionNumber || 1}.pdf`;
    }

    if (!pdfKey) {
      return NextResponse.json({ error: 'No signed PDF available' }, { status: 404 });
    }

    const url = await getDownloadUrl(pdfKey, 300);
    return NextResponse.json({ url, filename });
  } catch (error: any) {
    console.error('[Documents Download] Error:', error.message);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
