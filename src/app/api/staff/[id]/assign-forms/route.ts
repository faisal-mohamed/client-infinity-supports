import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, upsertStaffFormData, type StaffFormType } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const VALID_FORM_TYPES: StaffFormType[] = [
  'bullying_harassment_training', 'bullying_training', 'conflict_of_interest',
  'documentation_acknowledgement', 'employment_details', 'employment_welcome_ack',
  'ndis_code_of_conduct', 'ndis_workforce_capability', 'pre_employment_medical',
  'support_worker', 'vehicle_safety_inspection',
];

// Aliases from registry keys to DynamoDB form types
const ALIASES: Record<string, StaffFormType> = {
  'employee_details': 'employment_details',
  'employee_welcome': 'employment_welcome_ack',
};

// POST /api/staff/[id]/assign-forms
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

    const body = await request.json();
    const { formTypes, formIds } = body;
    const rawIds = formTypes || formIds;

    if (!Array.isArray(rawIds) || rawIds.length === 0) {
      return NextResponse.json({ error: 'formIds or formTypes array is required' }, { status: 400 });
    }

    // Resolve each ID to a valid StaffFormType
    const formsToAssign: StaffFormType[] = [];
    for (const rawId of rawIds) {
      const key = String(rawId);
      const resolved = ALIASES[key] || key;
      if (VALID_FORM_TYPES.includes(resolved as StaffFormType)) {
        formsToAssign.push(resolved as StaffFormType);
      }
    }

    if (formsToAssign.length === 0) {
      return NextResponse.json({ error: 'No valid forms to assign' }, { status: 400 });
    }

    for (const formType of formsToAssign) {
      await upsertStaffFormData(id, formType, {
        data: {},
        status: 'not_started',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${formsToAssign.length} form(s) to staff`,
      assignedForms: formsToAssign.map((key) => ({ id: key, title: key.replace(/_/g, ' ') })),
    });
  } catch (error: any) {
    console.error('Error assigning forms:', error);
    return NextResponse.json({ error: 'Failed to assign forms' }, { status: 500 });
  }
}
