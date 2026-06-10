import { NextRequest, NextResponse } from 'next/server';
import { getStaffByToken } from '@/lib/db/staff';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';

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

// GET /api/staff/signature/[token]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }

    // Get all form data
    const res = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `STAFF#${staff.id}`, ':sk': 'FORM_DATA#' },
    }));

    const signatureForms = (res.Items || []).map((item: any, index: number) => ({
      id: index + 1,
      formSubmission: {
        id: item.formType,
        formKey: item.formType,
        data: item.data || {},
        staffSignature: item.staffSignature || null,
        staffSignedAt: item.staffSignedAt || null,
        adminSignature: item.adminSignature || null,
        adminSignedAt: item.adminSignedAt || null,
        form: {
          id: index + 1,
          formKey: item.formType,
          title: FORM_TITLES[item.formType] || item.formType?.replace(/_/g, ' '),
          version: 1,
          requiresSignature: true,
        },
      },
    }));

    const formsRequiringSignature = signatureForms.filter((sf: any) => {
      const sub = sf.formSubmission;
      const data = sub.data || {};
      return !sub.staffSignature && !data.signature && !data.staffSignature && !data.acknowledgementSignature;
    });
    const formsNotRequiringSignature: any[] = [];
    const signedForms = signatureForms.filter((sf: any) => {
      const sub = sf.formSubmission;
      const data = sub.data || {};
      return !!(sub.staffSignature || data.signature || data.staffSignature || data.acknowledgementSignature);
    });

    return NextResponse.json({
      id: token,
      batchToken: token,
      expiresAt: staff.linkExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: formsRequiringSignature.length === 0,
      completedAt: null,
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        name: `${staff.firstName} ${staff.surname}`,
      },
      signatureForms,
      formsRequiringSignature,
      formsNotRequiringSignature,
      completionStatus: {
        totalForms: signatureForms.length,
        formsRequiringSignature: formsRequiringSignature.length,
        formsNotRequiringSignature: 0,
        signedForms: signedForms.length,
        filledFormsNotRequiringSignature: 0,
        totalCompletedForms: signedForms.length,
        isComplete: formsRequiringSignature.length === 0,
        totalSignaturesRequired: signatureForms.length,
        totalSignaturesCompleted: signedForms.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching signature portal:', error);
    return NextResponse.json({ error: 'Failed to load signature portal' }, { status: 500 });
  }
}
