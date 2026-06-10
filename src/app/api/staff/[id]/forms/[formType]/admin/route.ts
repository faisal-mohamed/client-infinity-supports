import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, getStaffFormData, upsertStaffFormData, type StaffFormType } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const VALID_FORM_TYPES: StaffFormType[] = [
  'bullying_harassment_training', 'bullying_training', 'conflict_of_interest',
  'documentation_acknowledgement', 'employment_details', 'employment_welcome_ack',
  'ndis_code_of_conduct', 'ndis_workforce_capability', 'pre_employment_medical',
  'support_worker', 'vehicle_safety_inspection',
];

function normalizeFormType(slug: string): StaffFormType | null {
  const normalized = slug.replace(/-/g, '_') as StaffFormType;
  const aliases: Record<string, StaffFormType> = {
    'employee_details': 'employment_details',
    'employee_welcome': 'employment_welcome_ack',
    'employment_welcome': 'employment_welcome_ack',
  };
  const resolved = aliases[normalized] || normalized;
  return VALID_FORM_TYPES.includes(resolved) ? resolved : null;
}

// POST /api/staff/[id]/forms/[formType]/admin — Admin signs/approves a staff form
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
    const { adminSignature, data } = body;

    if (!adminSignature) {
      return NextResponse.json({ error: 'Admin signature is required' }, { status: 400 });
    }

    const existing = await getStaffFormData(id, formType);

    const result = await upsertStaffFormData(id, formType, {
      data: data || existing?.data,
      adminSignature,
      adminSignedAt: new Date().toISOString(),
      status: 'completed',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error admin signing staff form:', error);
    return NextResponse.json({ error: 'Failed to save admin signature' }, { status: 500 });
  }
}
