// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getStaffPDFComponent } from "@/components-server/staff/staffPDFRegistry";
import fs from "fs";
import path from "path";

/**
 * Generate Staff PDF using @react-pdf/renderer
 * - No browser needed!
 * - Faster generation
 * - Dynamic pages automatically
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; formType: string }> }
) {
  try {
    const { id, formType } = await params;
    const staffId = parseInt(id);

    if (!staffId || !formType) {
      return new NextResponse("Missing staffId or formType", { status: 400 });
    }

    // Get staff info
    const staff = await (prisma as any).staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true }
    });

    if (!staff) {
      return new NextResponse("Staff not found", { status: 404 });
    }

    // Get form data based on form type
    let formData = null;
    switch (formType) {
      case 'employee-details':
        formData = await (prisma as any).staffEmploymentDetails.findUnique({
          where: { staffId }
        });
        break;
      case 'employment-welcome':
        formData = await (prisma as any).staffEmploymentWelcomeAck.findUnique({
          where: { staffId }
        });
        break;
      case 'employee-welcome':
        formData = await (prisma as any).staffEmploymentWelcomeAck.findUnique({
          where: { staffId }
        });
        break;
      case 'support-worker':
        formData = await (prisma as any).staffSupportWorker.findUnique({
          where: { staffId }
        });
        break;
      case 'pre-employment-medical':
        formData = await (prisma as any).staffPreEmploymentMedical.findUnique({
          where: { staffId }
        });
        break;
      case 'ndis-workforce-capability':
        formData = await (prisma as any).staffNdisWorkforceCapability.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-harassment':
        formData = await (prisma as any).staffBullyingHarassmentTraining.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-harassment-training':
        formData = await (prisma as any).staffBullyingHarassmentTraining.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-training':
        // Check generic submissions table first
        const bullyingSubmission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId,
              formKey: 'bullying_training'
            }
          }
        });
        if (bullyingSubmission) {
          formData = {
            data: bullyingSubmission.data || {},
            staffSignature: bullyingSubmission.staffSignature,
            staffSignedAt: bullyingSubmission.staffSignedAt,
            createdAt: bullyingSubmission.createdAt,
            updatedAt: bullyingSubmission.updatedAt,
          };
        } else {
          // Fallback to dedicated table
          try {
            formData = await (prisma as any).staffBullyingTraining.findUnique({
              where: { staffId }
            });
          } catch (e) {
            // Table might not exist
          }
        }
        break;
      case 'ndis-code-of-conduct':
        {
          const ndisSubmission = await prisma.staffFormSubmission.findUnique({
            where: {
              staffId_formKey: {
                staffId,
                formKey: 'ndis_code_of_conduct',
              },
            },
          });
          if (ndisSubmission) {
            formData = {
              data: ndisSubmission.data || {},
              staffSignature: ndisSubmission.staffSignature,
              staffSignedAt: ndisSubmission.staffSignedAt,
              createdAt: ndisSubmission.createdAt,
              updatedAt: ndisSubmission.updatedAt,
            };
          } else {
            formData = await (prisma as any).staffNdisCodeOfConduct.findUnique({
              where: { staffId },
            });
          }
        }
        break;
      default:
        return new NextResponse("Invalid form type", { status: 400 });
    }

    if (!formData) {
      return new NextResponse("Form data not found", { status: 404 });
    }

    // Extract data from formData (handle both direct data and nested data)
    let formDataObj = formData;
    if (formData?.data && typeof formData.data === 'object') {
      formDataObj = {
        ...formData.data,
        staffSignature: formData.staffSignature,
        staffSignedAt: formData.staffSignedAt,
        date: formData.staffSignedAt ? new Date(formData.staffSignedAt).toISOString().split('T')[0] : '',
      };
    }

    // Add staff info to form data
    const dataWithStaff = { ...formDataObj, staff };

    // Convert logo to base64 for React PDF
    const logoPath = path.resolve(process.cwd(), 'public/infinity_logo.png');
    let logoDataUrl = '';
    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (error) {
      console.warn('Logo not found, skipping:', error);
    }

    // Add logo and settings to data
    const dataWithLogo = { 
      data: dataWithStaff,
      settings: { logoDataUrl }
    };

    // Get React PDF component
    const StaffPDFComponent = getStaffPDFComponent(formType.replace(/-/g, '_'));
    
    // Create PDF element
    const pdfElement = React.createElement(StaffPDFComponent, { data: dataWithLogo });

    console.log('Generating PDF for staff:', staff.firstName, staff.surname);
    
    // Generate PDF buffer using React PDF (no browser!)
    // @ts-ignore - renderToBuffer returns a Node Buffer which is compatible at runtime
    const pdfBuffer: any = await renderToBuffer(pdfElement);
    const pdfUint8 = pdfBuffer instanceof Uint8Array ? pdfBuffer : new Uint8Array(pdfBuffer);
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(pdfUint8);
        controller.close();
      },
    });

    const filename = `${staff.firstName}_${staff.surname}_${formType}.pdf`;

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
    console.error("Error generating staff PDF:", error);
    console.error("Error stack:", error.stack);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
