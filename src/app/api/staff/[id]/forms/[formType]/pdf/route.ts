import { NextRequest, NextResponse } from 'next/server';
import { getStaffById, getStaffFormData, type StaffFormType } from '@/lib/db/staff';
import { getTenantContext, isTenantError } from '@/lib/tenant-context';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { getStaffPDFComponent } from '@/components-server/staff/staffPDFRegistry';

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
    'fair_work_information': 'documentation_acknowledgement',
    'govt_tax': 'documentation_acknowledgement',
    'orientation': 'ndis_workforce_capability',
    'super_choice_form': 'documentation_acknowledgement',
  };
  const resolved = aliases[normalized] || normalized;
  return VALID_FORM_TYPES.includes(resolved) ? resolved : null;
}

// GET /api/staff/[id]/forms/[formType]/pdf — Generate actual PDF binary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (isTenantError(tenant)) return tenant;

    const { id, formType: slug } = await params;
    const formType = normalizeFormType(slug);
    if (!formType) return new NextResponse('Invalid form type', { status: 400 });

    const staff = await getStaffById(id);
    if (!staff) return new NextResponse('Staff not found', { status: 404 });

    const formData = await getStaffFormData(id, formType);

    // Get the PDF component from registry
    // Try multiple key formats
    const keysToTry = [slug, formType, slug.replace(/-/g, '_'), formType.replace(/_/g, '-')];
    let PDFComponent: React.ComponentType<any> | null = null;

    for (const key of keysToTry) {
      try {
        PDFComponent = getStaffPDFComponent(key);
        break;
      } catch {
        continue;
      }
    }

    if (!PDFComponent) {
      return new NextResponse('PDF component not found for this form type', { status: 404 });
    }

    // Prepare props for the PDF component
    const pdfProps = {
      data: formData?.data || {},
      staff: {
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone,
        ...staff.commonFields,
      },
      staffSignature: formData?.staffSignature || null,
      staffSignedAt: formData?.staffSignedAt || null,
      adminSignature: formData?.adminSignature || null,
      adminSignedAt: formData?.adminSignedAt || null,
      settings: {},
    };

    // Render to PDF buffer
    const element = React.createElement(PDFComponent, pdfProps);
    const buffer = await renderToBuffer(element as any);

    const filename = `${formType}_${staff.firstName}_${staff.surname}.pdf`.replace(/\s+/g, '_');

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'X-PDF-Filename': filename,
      },
    });
  } catch (error: any) {
    console.error('Error generating staff PDF:', error);
    return new NextResponse(`PDF generation failed: ${error.message}`, { status: 500 });
  }
}
