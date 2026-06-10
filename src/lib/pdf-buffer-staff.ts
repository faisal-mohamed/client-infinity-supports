// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// PDF buffer generation utilities for staff form email attachments
// Migrated from Prisma to DynamoDB

import { getStaffById, getStaffFormData, type StaffFormType } from '@/lib/db/staff';

interface StaffPDFBufferOptions {
  staffId: string;
  formKey: string;
  formId?: string;
  filename?: string;
}

interface StaffPDFBufferResult {
  success: boolean;
  buffer?: Buffer;
  filename?: string;
  error?: string;
}

const FORM_NAMES: Record<string, string> = {
  employment_details: 'Employee_Details',
  employment_welcome_ack: 'Employee_Welcome',
  ndis_code_of_conduct: 'NDIS_Code_of_Conduct',
  ndis_workforce_capability: 'NDIS_Workforce_Capability',
  bullying_harassment_training: 'Bullying_Harassment_Training',
  bullying_training: 'Bullying_Training',
  conflict_of_interest: 'Conflict_of_Interest',
  documentation_acknowledgement: 'Documentation_Acknowledgement',
  pre_employment_medical: 'Pre_Employment_Medical',
  support_worker: 'Support_Worker',
  vehicle_safety_inspection: 'Vehicle_Safety_Inspection',
};

/**
 * Generate PDF buffer for staff form
 * Uses internal API endpoints to render PDFs
 */
export async function generateStaffPDFBuffer({
  staffId,
  formKey,
  filename
}: StaffPDFBufferOptions): Promise<StaffPDFBufferResult> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Normalize formKey
    const normalizedKey = formKey.replace(/-/g, '_');
    const aliases: Record<string, string> = {
      'employee_details': 'employment_details',
      'employee_welcome': 'employment_welcome_ack',
    };
    const formType = (aliases[normalizedKey] || normalizedKey) as StaffFormType;

    // Get staff and form data from DynamoDB
    const staff = await getStaffById(staffId);
    if (!staff) {
      return { success: false, error: `Staff not found: ${staffId}` };
    }

    const formData = await getStaffFormData(staffId, formType);
    if (!formData) {
      return { success: false, error: `Form data not found for: ${formType}` };
    }

    // Special handling for super_choice_form and govt_tax (use Playwright endpoints)
    if (formType === 'documentation_acknowledgement' && (formKey === 'super_choice_form' || formKey === 'super-choice-form')) {
      const url = `${baseUrl}/api/generate-pdf/super-choice-form`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.data || {}),
      });

      if (!response.ok) {
        return { success: false, error: `PDF generation failed: ${response.status}` };
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      return {
        success: true,
        buffer,
        filename: filename || `Super_Choice_Form_${staff.firstName}_${staff.surname}.pdf`,
      };
    }

    if (formType === 'documentation_acknowledgement' && (formKey === 'govt_tax' || formKey === 'govt-tax')) {
      const url = `${baseUrl}/api/generate-pdf/tax-form`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.data || {}),
      });

      if (!response.ok) {
        return { success: false, error: `PDF generation failed: ${response.status}` };
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      return {
        success: true,
        buffer,
        filename: filename || `TFN_Declaration_${staff.firstName}_${staff.surname}.pdf`,
      };
    }

    // For standard forms — try the React PDF endpoint
    const formSlug = formType.replace(/_/g, '-');
    const url = `${baseUrl}/api/staff/${staffId}/forms/${formSlug}/pdf?key=${Date.now()}`;

    console.log(`📄 [STAFF PDF] Generating PDF from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      // PDF generation not available — return error (non-fatal)
      const formName = FORM_NAMES[formType] || formType;
      return {
        success: false,
        error: `PDF generation not yet available for ${formName}`,
      };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const formName = FORM_NAMES[formType] || formType;
    const pdfFilename = filename || `${formName}_${staff.firstName}_${staff.surname}.pdf`;

    return { success: true, buffer, filename: pdfFilename };
  } catch (error: any) {
    console.error('❌ [STAFF PDF] Error:', error);
    return { success: false, error: error.message || 'PDF generation failed' };
  }
}

/**
 * Generate multiple PDF buffers for batch email
 */
export async function generateMultipleStaffPDFBuffers(
  staffId: string,
  formKeys: string[]
): Promise<StaffPDFBufferResult[]> {
  const results: StaffPDFBufferResult[] = [];
  for (const formKey of formKeys) {
    const result = await generateStaffPDFBuffer({ staffId, formKey });
    results.push(result);
  }
  return results;
}
