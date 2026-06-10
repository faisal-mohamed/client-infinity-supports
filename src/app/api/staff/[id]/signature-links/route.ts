import { NextRequest, NextResponse } from 'next/server';
import { getStaffById } from '@/lib/db/staff';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

// GET /api/staff/[id]/signature-links
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Get all form data to build signature forms list
    const formsRes = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `STAFF#${id}`, ':sk': 'FORM_DATA#' },
    }));

    const signatureForms = (formsRes.Items || []).map((item: any) => ({
      id: item.formType,
      formSubmission: {
        id: item.formType,
        formKey: item.formType,
        staffSignature: item.staffSignature || null,
        adminSignature: item.adminSignature || null,
        form: {
          title: item.formType?.replace(/_/g, ' '),
          formKey: item.formType,
        },
      },
    }));

    // Build batch object in the format the UI expects
    const signatureBatches = [];
    if (staff.linkToken) {
      signatureBatches.push({
        id: staff.linkToken,
        batchToken: staff.linkToken,
        expiresAt: staff.linkExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isCompleted: signatureForms.every((sf: any) => sf.formSubmission.staffSignature),
        createdAt: staff.createdAt,
        signatureForms,
        staff: { id: staff.id, firstName: staff.firstName, surname: staff.surname, email: staff.email },
      });
    }

    return NextResponse.json({
      signatureBatches,
      staff: { id: staff.id, firstName: staff.firstName, surname: staff.surname, email: staff.email },
    });
  } catch (error: any) {
    console.error('Error fetching signature links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}
