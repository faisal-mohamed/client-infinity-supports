import { NextRequest, NextResponse } from 'next/server';
import { getStaffById } from '@/lib/db/staff';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const FORM_NAMES: Record<string, string> = {
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

// GET /api/staff/[id]/forms
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

    const res = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `STAFF#${id}`, ':sk': 'FORM_DATA#' },
    }));

    const forms = (res.Items || []).map((item: any) => {
      let status = 'pending';
      if (item.adminSignature) status = 'fully_completed';
      else if (item.staffSignature) status = 'awaiting_admin';
      else if (item.status === 'in_progress') status = 'in_progress';
      else if (item.status === 'submitted') status = 'completed';

      return {
        formType: item.formType?.replace(/_/g, '-'),
        formName: FORM_NAMES[item.formType] || item.formType?.replace(/_/g, ' '),
        status,
        completedAt: item.staffSignedAt || undefined,
        hasSignature: !!item.staffSignature,
        hasAdminSignature: !!item.adminSignature,
        hasViewPage: true,
        requiresAdmin: true,
      };
    });

    return NextResponse.json({ staff, forms });
  } catch (error: any) {
    console.error('Error fetching staff forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}
