import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, getStaffFormData, upsertStaffFormData, type StaffFormType } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const VALID_FORM_TYPES: StaffFormType[] = [
  'bullying_harassment_training', 'bullying_training', 'conflict_of_interest',
  'documentation_acknowledgement', 'employment_details', 'employment_welcome_ack',
  'ndis_code_of_conduct', 'ndis_workforce_capability', 'pre_employment_medical',
  'support_worker', 'vehicle_safety_inspection',
];

// Normalize URL slug to DB form type (e.g., "employment-details" → "employment_details")
function normalizeFormType(slug: string): StaffFormType | null {
  const normalized = slug.replace(/-/g, '_') as StaffFormType;
  // Handle aliases
  const aliases: Record<string, StaffFormType> = {
    'employee_details': 'employment_details',
    'employee_welcome': 'employment_welcome_ack',
    'employment_welcome': 'employment_welcome_ack',
    'fair_work_information': 'documentation_acknowledgement',
    'govt_tax': 'documentation_acknowledgement',
    'orientation': 'ndis_workforce_capability',
    'super_choice_form': 'documentation_acknowledgement',
  };
  const resolved = aliases[normalized] || normalized;
  return VALID_FORM_TYPES.includes(resolved) ? resolved : null;
}

// GET /api/staff/[id]/forms/[formType]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id, formType: slug } = await params;
    const formType = normalizeFormType(slug);
    if (!formType) return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });

    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    const formData = await getStaffFormData(id, formType);

    return NextResponse.json({
      staff: { id: staff.id, firstName: staff.firstName, surname: staff.surname, email: staff.email },
      formType,
      data: formData?.data || null,
      staffSignature: formData?.staffSignature || null,
      staffSignedAt: formData?.staffSignedAt || null,
      adminSignature: formData?.adminSignature || null,
      adminSignedAt: formData?.adminSignedAt || null,
      status: formData?.status || 'not_started',
      createdAt: formData?.createdAt || null,
      updatedAt: formData?.updatedAt || null,
    });
  } catch (error: any) {
    console.error('Error fetching staff form:', error);
    return NextResponse.json({ error: 'Failed to fetch form data' }, { status: 500 });
  }
}

// POST /api/staff/[id]/forms/[formType] — Save/submit form data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id, formType: slug } = await params;
    const formType = normalizeFormType(slug);
    if (!formType) return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });

    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    const body = await request.json();
    const { data, staffSignature, adminSignature, status } = body;

    const result = await upsertStaffFormData(id, formType, {
      data,
      staffSignature: staffSignature || undefined,
      staffSignedAt: staffSignature ? new Date().toISOString() : undefined,
      adminSignature: adminSignature || undefined,
      adminSignedAt: adminSignature ? new Date().toISOString() : undefined,
      status: status || (staffSignature ? 'submitted' : 'in_progress'),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error saving staff form:', error);
    return NextResponse.json({ error: 'Failed to save form data' }, { status: 500 });
  }
}

// PUT /api/staff/[id]/forms/[formType] — Same as POST (for compatibility)
export { POST as PUT };
