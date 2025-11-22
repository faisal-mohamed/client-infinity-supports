import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { getStaffPDFComponent } from '@/components-server/staff/staffPDFRegistry';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);

    if (!staffId) {
      return new NextResponse('Missing staffId', { status: 400 });
    }

    // Get staff info
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true }
    });

    if (!staff) {
      return new NextResponse('Staff not found', { status: 404 });
    }

    // Try dedicated table first, then fallback to generic table (backward compatible)
    let formData = await (prisma as any).staffEmploymentDetails.findUnique({
      where: { staffId }
    }).catch(() => null);

    // Fallback to generic table if dedicated table doesn't exist or has no data
    if (!formData) {
      const submission = await prisma.staffFormSubmission.findUnique({
        where: { 
          staffId_formKey: { 
            staffId, 
            formKey: 'employee_details' 
          } 
        }
      });
      
      if (submission) {
        formData = {
          id: submission.id,
          staffId: submission.staffId,
          data: submission.data || {},
          staffSignature: submission.staffSignature,
          staffSignedAt: submission.staffSignedAt,
          adminSignature: submission.adminSignature,
          adminSignedAt: submission.adminSignedAt,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt
        };
      }
    }

    if (!formData) {
      return new NextResponse('Employee details not found', { status: 404 });
    }

    // Extract data from formData (handle both direct data and nested data)
    let formDataObj = formData;
    if (formData?.data && typeof formData.data === 'object') {
      const baseDate =
        formData.data.date ||
        formData.data.acknowledgedAt ||
        formData.data.staffSignedAt ||
        '';
      formDataObj = {
        ...formData.data,
        staffSignature: formData.staffSignature,
        staffSignedAt: formData.staffSignedAt,
        date: formData.staffSignedAt
          ? new Date(formData.staffSignedAt).toISOString().split('T')[0]
          : baseDate,
      };
    }

    // Add staff info to form data
    const dataWithStaff = { ...formDataObj, staff };

    // Convert logo to base64 for React PDF
    const logoPath = path.resolve(process.cwd(), 'public', 'infinity_logo.png');
    let logoDataUrl = '';
    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (error) {
      console.warn('Logo not found, skipping:', error);
    }

    // Get app settings for footer
    const rawSettings = await prisma.appSettings.findMany({
      where: { isActive: true },
      select: { key: true, value: true },
    });

    const settings: Record<string, any> = {};
    rawSettings.forEach((setting: any) => {
      if (setting.value && setting.value.trim() !== '') {
        settings[setting.key] = setting.value;
      }
    });

    // Add logo and settings to data
    const dataWithLogo = { 
      data: dataWithStaff,
      logoDataUrl,
      settings,
      staffSignature: formData.staffSignature,
      staffSignedAt: formData.staffSignedAt,
      adminSignature: formData.adminSignature,
      adminSignedAt: formData.adminSignedAt,
    };

    // Get React PDF component
    let StaffPDFComponent;
    try {
      StaffPDFComponent = getStaffPDFComponent('employee_details');
    } catch (error: any) {
      console.error('PDF component not found for employee_details', error);
      return new NextResponse(
        'PDF generation not yet available for employee details form. Please contact support.',
        { status: 501 }
      );
    }
    
    // Create PDF element
    const pdfElement = React.createElement(StaffPDFComponent, { data: dataWithLogo });

    console.log('Generating Employee Details PDF for staff:', staff.firstName, staff.surname);
    
    // Generate PDF buffer using React PDF
    const pdfBuffer: any = await renderToBuffer(pdfElement);
    const pdfUint8 = pdfBuffer instanceof Uint8Array ? pdfBuffer : new Uint8Array(pdfBuffer);
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(pdfUint8);
        controller.close();
      },
    });

    const filename = `${staff.firstName}_${staff.surname}_employee-details.pdf`;

    console.log('PDF generated successfully:', filename);

    // Check if request wants to download or view inline
    const searchParams = new URL(req.url).searchParams;
    const download = searchParams.get('download') === 'true';

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': download 
          ? `attachment; filename="${filename}"` 
          : `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating employee details PDF:', error);
    console.error('Error stack:', error.stack);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}

