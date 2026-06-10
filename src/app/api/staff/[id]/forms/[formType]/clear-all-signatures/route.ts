import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, getStaffFormData, upsertStaffFormData, type StaffFormType } from '@/lib/db/staff';

const VALID_FORM_TYPES: StaffFormType[] = [
  'bullying_harassment_training', 'bullying_training', 'conflict_of_interest',
  'documentation_acknowledgement', 'employment_details', 'employment_welcome_ack',
  'ndis_code_of_conduct', 'ndis_workforce_capability', 'pre_employment_medical',
  'support_worker', 'vehicle_safety_inspection',
];

function normalizeFormType(slug: string): StaffFormType | null {
  const normalized = slug.replace(/-/g, '_') as StaffFormType;
  return VALID_FORM_TYPES.includes(normalized) ? normalized : null;
}

// POST /api/staff/[id]/forms/[formType]/clear-all-signatures
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const { id, formType: slug } = await params;
    const formType = normalizeFormType(slug);
    if (!formType) return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });

    const staff = await getStaffById(id);
    if (!staff) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

    const existing = await getStaffFormData(id, formType);
    if (!existing) return NextResponse.json({ success: true, message: 'No form data to clear' });

    await upsertStaffFormData(id, formType, {
      data: existing.data,
      staffSignature: undefined,
      staffSignedAt: undefined,
      adminSignature: undefined,
      adminSignedAt: undefined,
      status: 'in_progress',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error clearing all signatures:', error);
    return NextResponse.json({ error: 'Failed to clear signatures' }, { status: 500 });
  }
}
