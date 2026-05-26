import { NextRequest, NextResponse } from 'next/server';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { uploadFile, buildS3Key, getDownloadUrl, MAX_FILE_SIZE, ALLOWED_TYPES } from '@/lib/s3';

// POST /api/upload — Upload a file to S3
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = formData.get('folder') as string || 'clients';
  const entityId = formData.get('entityId') as string || '';
  const subfolder = formData.get('subfolder') as string || 'documents';

  // For registration uploads, allow without auth
  let orgId = 'public';
  if (folder !== 'registration') {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;
    orgId = tenant.organizationId || 'legacy';
  }

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `File type not allowed. Accepted: PDF, JPEG, PNG, DOCX` }, { status: 400 });
  }

  // Sanitize filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  const timestamp = Date.now();
  const filename = `${timestamp}_${safeName}`;

  const key = buildS3Key({
    organizationId: orgId,
    folder: folder as any,
    entityId: entityId || undefined,
    subfolder,
    filename,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await uploadFile({
    key,
    body: buffer,
    contentType: file.type,
    metadata: {
      'uploaded-by': orgId,
      'original-name': file.name,
    },
  });

  // Generate download URL
  const downloadUrl = await getDownloadUrl(key);

  return NextResponse.json({
    key: result.key,
    url: downloadUrl,
    filename: file.name,
    size: file.size,
    contentType: file.type,
  }, { status: 201 });
}
