import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, getStaffFormData, type StaffFormType } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const STAFF_FORMS: { formType: StaffFormType; title: string }[] = [
  { formType: 'employment_details', title: 'Employee Details' },
  { formType: 'employment_welcome_ack', title: 'Employment Welcome' },
  { formType: 'ndis_code_of_conduct', title: 'NDIS Code of Conduct' },
  { formType: 'ndis_workforce_capability', title: 'NDIS Workforce Capability' },
  { formType: 'bullying_harassment_training', title: 'Bullying & Harassment Training' },
  { formType: 'bullying_training', title: 'Bullying Training' },
  { formType: 'conflict_of_interest', title: 'Conflict of Interest' },
  { formType: 'documentation_acknowledgement', title: 'Documentation Acknowledgement' },
  { formType: 'pre_employment_medical', title: 'Pre-Employment Medical' },
  { formType: 'support_worker', title: 'Support Worker Details' },
  { formType: 'vehicle_safety_inspection', title: 'Vehicle Safety Inspection' },
];

// GET /api/staff-form-assignments/[assignmentId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { assignmentId } = await params;
    const staffId = request.nextUrl.searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'staffId query param required' }, { status: 400 });
    }

    // assignmentId is index+1 from the STAFF_FORMS array (same as form-assignments route)
    const index = parseInt(assignmentId) - 1;

    if (!isNaN(index) && index >= 0 && index < STAFF_FORMS.length) {
      const form = STAFF_FORMS[index];
      const formData = await getStaffFormData(staffId, form.formType);

      return NextResponse.json({
        assignment: {
          id: assignmentId,
          staffId,
          formVersion: 1,
          form: {
            formKey: form.formType,
            title: form.title,
            version: 1,
            requiresSignature: true,
          },
          hasSubmission: !!formData,
          submissionId: form.formType,
          currentStatus: formData?.status || 'not_started',
        },
      });
    }

    // Fallback: try as kebab-case or snake_case formType
    const normalized = assignmentId.replace(/-/g, '_') as StaffFormType;
    const matchedForm = STAFF_FORMS.find(f => f.formType === normalized);
    if (matchedForm) {
      const formData = await getStaffFormData(staffId, matchedForm.formType);
      return NextResponse.json({
        assignment: {
          id: assignmentId,
          staffId,
          formVersion: 1,
          form: {
            formKey: matchedForm.formType,
            title: matchedForm.title,
            version: 1,
            requiresSignature: true,
          },
          hasSubmission: !!formData,
          submissionId: matchedForm.formType,
          currentStatus: formData?.status || 'not_started',
        },
      });
    }

    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching staff form assignment:', error);
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
  }
}

// DELETE /api/staff-form-assignments/[assignmentId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { assignmentId } = await params;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 });
  }
}
