import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { deleteFile } from '@/lib/s3';

// DELETE /api/upload — Delete a file from S3
export async function DELETE(request: NextRequest) {
  const tenant = await getTenantContext();
  if (isTenantError(tenant)) return tenant;

  const { key } = await request.json();
  if (!key) return NextResponse.json({ error: 'key is required' }, { status: 400 });

  // Security: ensure the file belongs to this org
  const orgPrefix = `org/${tenant.organizationId || 'legacy'}/`;
  if (!key.startsWith(orgPrefix)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await deleteFile(key);
  return NextResponse.json({ success: true });
}
