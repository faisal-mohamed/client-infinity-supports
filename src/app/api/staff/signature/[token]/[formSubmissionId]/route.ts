import { NextRequest, NextResponse } from 'next/server';
import { getStaffByToken, getStaffFormData, upsertStaffFormData, type StaffFormType } from '@/lib/db/staff';
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

// GET /api/staff/signature/[token]/[formSubmissionId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }

    // formSubmissionId could be a formType or an index — try to find the form
    const formType = formSubmissionId.replace(/-/g, '_') as StaffFormType;
    const formData = await getStaffFormData(staff.id, formType);

    // Return in the EXACT shape the UI expects: { formSubmission: { form: {...}, data, staffSignature, ... } }
    return NextResponse.json({
      formSubmission: {
        id: formType,
        formKey: formType,
        data: formData?.data || {},
        staffSignature: formData?.staffSignature || null,
        staffSignedAt: formData?.staffSignedAt || null,
        adminSignature: formData?.adminSignature || null,
        adminSignedAt: formData?.adminSignedAt || null,
        form: {
          id: formType,
          formKey: formType,
          title: FORM_TITLES[formType] || formType?.replace(/_/g, ' '),
          version: 1,
          requiresSignature: true,
        },
      },
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        name: `${staff.firstName} ${staff.surname}`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching staff signature form:', error);
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}

// POST /api/staff/signature/[token]/[formSubmissionId] — Sign a specific form
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }

    const body = await request.json();
    const { signature, data } = body;
    const formType = (body.formType || formSubmissionId.replace(/-/g, '_')) as StaffFormType;

    if (!signature) {
      return NextResponse.json({ error: 'Signature is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const existing = await getStaffFormData(staff.id, formType);

    await upsertStaffFormData(staff.id, formType, {
      data: data || existing?.data || {},
      staffSignature: signature,
      staffSignedAt: now,
      status: 'submitted',
    });

    return NextResponse.json({ success: true, formType, status: 'submitted' });
  } catch (error: any) {
    console.error('Error signing staff form:', error);
    return NextResponse.json({ error: 'Failed to sign form' }, { status: 500 });
  }
}
