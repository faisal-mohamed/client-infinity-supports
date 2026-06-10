import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getStaffById, updateStaff } from '@/lib/db/staff';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const FORM_TITLES: Record<string, string> = {
  employment_details: 'Employee Details',
  employment_welcome_ack: 'Employment Welcome',
  ndis_code_of_conduct: 'NDIS Code of Conduct',
  ndis_workforce_capability: 'NDIS Workforce Capability',
  bullying_harassment_training: 'Bullying & Harassment Training',
  bullying_training: 'Bullying Training',
  conflict_of_interest: 'Conflict of Interest',
  documentation_acknowledgement: 'Documentation Acknowledgement',
  pre_employment_medical: 'Pre-Employment Medical',
  support_worker: 'Support Worker Details',
  vehicle_safety_inspection: 'Vehicle Safety Inspection',
};

// POST /api/staff/[id]/generate-signature-link
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id } = await params;
    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    // Generate new token with 3-day expiry (matching branch)
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    await updateStaff(id, { linkToken: token, linkExpiresAt: expiresAt });

    // Create token lookup record so getStaffByToken can find this staff
    await dynamodb.send(new PutCommand({
      TableName: TABLE,
      Item: { PK: `STAFF_TOKEN#${token}`, SK: "STAFF", entityType: "STAFF_TOKEN_LOOKUP", staffId: id },
    }));

    // Get forms to include in response
    const res = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `STAFF#${id}`, ':sk': 'FORM_DATA#' },
    }));

    const forms = (res.Items || []).map((item: any) => ({
      formTitle: FORM_TITLES[item.formType] || item.formType?.replace(/_/g, ' '),
      formKey: item.formType,
    }));

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const signatureUrl = `${baseUrl}/staff/signature/${token}`;

    return NextResponse.json({
      success: true,
      signatureUrl,
      token,
      formsCount: forms.length,
      forms,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Error generating signature link:', error);
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 });
  }
}
