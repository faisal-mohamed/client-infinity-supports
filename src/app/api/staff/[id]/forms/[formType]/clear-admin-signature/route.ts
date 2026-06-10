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
  return VALID_FORM_TYPES.includes(aliases[normalized] || normalized) ? (aliases[normalized] || normalized) : null;
}

// POST /api/staff/[id]/forms/[formType]/clear-admin-signature
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

    const existing = await getStaffFormData(id, formType);
    if (!existing) return NextResponse.json({ error: 'Form data not found' }, { status: 404 });

    await upsertStaffFormData(id, formType, {
      data: existing.data,
      staffSignature: existing.staffSignature,
      staffSignedAt: existing.staffSignedAt,
      adminSignature: undefined,
      adminSignedAt: undefined,
      status: 'submitted', // Revert to submitted (needs admin re-sign)
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to clear admin signature' }, { status: 500 });
  }
}
