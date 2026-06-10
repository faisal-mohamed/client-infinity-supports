import { NextRequest, NextResponse } from 'next/server';
import { getStaffByToken, getStaffFormData, upsertStaffFormData, updateStaff, type StaffFormType } from '@/lib/db/staff';

const VALID_FORM_TYPES: StaffFormType[] = [
  'bullying_harassment_training', 'bullying_training', 'conflict_of_interest',
  'documentation_acknowledgement', 'employment_details', 'employment_welcome_ack',
  'ndis_code_of_conduct', 'ndis_workforce_capability', 'pre_employment_medical',
  'support_worker', 'vehicle_safety_inspection',
];

function normalizeFormKey(key: string): StaffFormType | null {
  // Handle various naming conventions from the UI
  const mapping: Record<string, StaffFormType> = {
    'employeeDetails': 'employment_details',
    'employee_details': 'employment_details',
    'employee-details': 'employment_details',
    'employment-details': 'employment_details',
    'employeeWelcome': 'employment_welcome_ack',
    'employee_welcome': 'employment_welcome_ack',
    'employee-welcome': 'employment_welcome_ack',
    'employment-welcome': 'employment_welcome_ack',
    'ndisCodeOfConduct': 'ndis_code_of_conduct',
    'ndis-code-of-conduct': 'ndis_code_of_conduct',
    'ndisWorkforceCapability': 'ndis_workforce_capability',
    'ndis-workforce-capability': 'ndis_workforce_capability',
    'bullyingHarassmentTraining': 'bullying_harassment_training',
    'bullying-harassment-training': 'bullying_harassment_training',
    'bullyingTraining': 'bullying_training',
    'bullying-training': 'bullying_training',
    'conflictOfInterest': 'conflict_of_interest',
    'conflict-of-interest': 'conflict_of_interest',
    'documentationAcknowledgement': 'documentation_acknowledgement',
    'documentation-acknowledgement': 'documentation_acknowledgement',
    'preEmploymentMedical': 'pre_employment_medical',
    'pre-employment-medical': 'pre_employment_medical',
    'supportWorker': 'support_worker',
    'support-worker': 'support_worker',
    'vehicleSafetyInspection': 'vehicle_safety_inspection',
    'vehicle-safety-inspection': 'vehicle_safety_inspection',
  };

  const normalized = mapping[key] || key.replace(/-/g, '_') as StaffFormType;
  return VALID_FORM_TYPES.includes(normalized) ? normalized : null;
}

// GET /api/staff/signature/[token]/forms/[formKey] — Get form data for signing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; formKey: string }> }
) {
  try {
    const { token, formKey } = await params;
    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }

    const formType = normalizeFormKey(formKey);
    if (!formType) return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });

    const formData = await getStaffFormData(staff.id, formType);

    return NextResponse.json({
      staff: { id: staff.id, firstName: staff.firstName, surname: staff.surname, email: staff.email },
      formKey,
      formType,
      data: formData?.data || {},
      staffSignature: formData?.staffSignature || null,
      staffSignedAt: formData?.staffSignedAt || null,
      adminSignature: formData?.adminSignature || null,
      adminSignedAt: formData?.adminSignedAt || null,
      status: formData?.status || 'not_started',
      commonFields: staff.commonFields || {},
    });
  } catch (error: any) {
    console.error('Error fetching staff signature form:', error);
    return NextResponse.json({ error: 'Failed to load form' }, { status: 500 });
  }
}

// POST /api/staff/signature/[token]/forms/[formKey] — Save/submit form with signature
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; formKey: string }> }
) {
  try {
    const { token, formKey } = await params;
    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }

    const formType = normalizeFormKey(formKey);
    if (!formType) return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });

    const body = await request.json();
    const { data, signature, commonFields, clearSignature, submit, formKey: bodyFormKey } = body;

    const now = new Date().toISOString();

    // If clearSignature flag is set, clear the signature
    if (clearSignature) {
      await upsertStaffFormData(staff.id, formType, {
        data: data || {},
        staffSignature: null as any,
        staffSignedAt: null as any,
        status: 'in_progress',
      });

      return NextResponse.json({
        success: true,
        formType,
        status: 'signature_cleared',
        submission: {
          staffSignature: null,
          staffSignedAt: null,
          data: data || {},
        },
      });
    }

    // Check for signature in various locations (top-level or inside data)
    const effectiveSignature = signature || data?.signature || data?.staffSignature || data?.acknowledgementSignature || data?.employeeSignature;
    const isSubmitted = submit || !!effectiveSignature;

    // Save form data with signature
    await upsertStaffFormData(staff.id, formType, {
      data: data || {},
      staffSignature: effectiveSignature || undefined,
      staffSignedAt: effectiveSignature ? now : undefined,
      status: isSubmitted ? 'submitted' : 'in_progress',
    });

    // Update common fields if provided
    if (commonFields && Object.keys(commonFields).length > 0) {
      await updateStaff(staff.id, {
        commonFields: { ...staff.commonFields, ...commonFields },
      });
    }

    const updated = await getStaffFormData(staff.id, formType);
    return NextResponse.json({
      success: true,
      formType,
      status: isSubmitted ? 'submitted' : 'saved',
      submission: {
        staffSignature: updated?.staffSignature || null,
        data: updated?.data || {},
      },
    });
  } catch (error: any) {
    console.error('Error saving staff signature form:', error);
    return NextResponse.json({ error: 'Failed to save form' }, { status: 500 });
  }
}
