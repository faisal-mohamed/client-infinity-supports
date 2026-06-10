import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, type StaffFormType } from '@/lib/db/staff';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodb, TABLE } from '@/lib/dynamodb';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';

const STAFF_FORMS: { formType: StaffFormType; formKey: string; title: string; requiresSignature: boolean }[] = [
  { formType: 'employment_details', formKey: 'employment-details', title: 'Employee Details', requiresSignature: true },
  { formType: 'employment_welcome_ack', formKey: 'employment-welcome', title: 'Employment Welcome', requiresSignature: true },
  { formType: 'ndis_code_of_conduct', formKey: 'ndis-code-of-conduct', title: 'NDIS Code of Conduct', requiresSignature: true },
  { formType: 'ndis_workforce_capability', formKey: 'ndis-workforce-capability', title: 'NDIS Workforce Capability', requiresSignature: true },
  { formType: 'bullying_harassment_training', formKey: 'bullying-harassment-training', title: 'Bullying & Harassment Training', requiresSignature: true },
  { formType: 'bullying_training', formKey: 'bullying-training', title: 'Bullying Training', requiresSignature: true },
  { formType: 'conflict_of_interest', formKey: 'conflict-of-interest', title: 'Conflict of Interest', requiresSignature: true },
  { formType: 'documentation_acknowledgement', formKey: 'documentation-acknowledgement', title: 'Documentation Acknowledgement', requiresSignature: true },
  { formType: 'pre_employment_medical', formKey: 'pre-employment-medical', title: 'Pre-Employment Medical', requiresSignature: true },
  { formType: 'support_worker', formKey: 'support-worker', title: 'Support Worker Details', requiresSignature: true },
  { formType: 'vehicle_safety_inspection', formKey: 'vehicle-safety-inspection', title: 'Vehicle Safety Inspection', requiresSignature: true },
];

// GET /api/staff/[id]/form-assignments
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

    // Get all form data for this staff
    const res = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `STAFF#${id}`, ':sk': 'FORM_DATA#' },
    }));

    const formDataMap = new Map<string, any>();
    (res.Items || []).forEach((item: any) => {
      formDataMap.set(item.formType, item);
    });

    // Build assignments in the EXACT shape the UI expects
    const assignments = STAFF_FORMS.map((form, index) => {
      const data = formDataMap.get(form.formType);
      const hasSubmission = !!data && data.status !== 'not_started';
      const formDataObj = data?.data || {};
      const hasStaffSig = !!(data?.staffSignature || formDataObj.signature || formDataObj.staffSignature || formDataObj.acknowledgementSignature);
      const hasAdminSig = !!(data?.adminSignature || formDataObj.managerSignature || formDataObj.reviewerSignature);
      
      // Forms requiring both admin and staff signatures
      const requiresBothSignatures = ['employment_details', 'conflict_of_interest', 'bullying_training'].includes(form.formType);
      
      let currentStatus = 'not_started';
      if (requiresBothSignatures) {
        if (hasStaffSig && hasAdminSig) currentStatus = 'completed';
        else if (hasStaffSig && !hasAdminSig) currentStatus = 'in_progress'; // admin review
        else if (data?.status === 'in_progress' || data?.status === 'submitted') currentStatus = 'in_progress';
      } else {
        if (hasStaffSig || data?.status === 'completed' || data?.adminSignature) currentStatus = 'completed';
        else if (data?.status === 'in_progress' || data?.status === 'submitted') currentStatus = 'in_progress';
      }

      return {
        id: index + 1,
        formId: index + 1,
        formVersion: 1,
        assignedAt: staff.createdAt,
        displayOrder: index,
        isCompleted: currentStatus === 'completed',
        form: {
          id: index + 1,
          formKey: form.formKey,
          title: form.title,
          version: 1,
          requiresSignature: form.requiresSignature,
        },
        hasSubmission,
        submissionId: hasSubmission ? form.formType : undefined,
        filledByAdmin: false,
        adminFilledAt: undefined,
        staffSignature: data?.staffSignature || formDataObj.signature || formDataObj.staffSignature || null,
        staffSignedAt: data?.staffSignedAt || undefined,
        adminSignature: data?.adminSignature || null,
        adminSignedAt: data?.adminSignedAt || undefined,
        formData: data?.data || null,
        currentStatus,
      };
    }).filter((a) => formDataMap.has(STAFF_FORMS[a.displayOrder].formType)); // Only show assigned forms

    return NextResponse.json({
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone || '',
        commonFields: staff.commonFields || null,
      },
      assignments,
    });
  } catch (error: any) {
    console.error('Error fetching staff form assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch form assignments' }, { status: 500 });
  }
}
