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
      case 'ndis-workforce':
        formData = await (prisma as any).staffNdisWorkforceCapability.findUnique({
          where: { staffId }
        });
        break;
      case 'bullying-harassment':
        formData = await (prisma as any).staffBullyingHarassmentTraining.findUnique({
          where: { staffId }
        });
        break;
      default:
        return new NextResponse("Invalid form type", { status: 400 });
    }

    if (!formData) {
      return new NextResponse("Form data not found", { status: 404 });
    }

    // Add staff info to form data
    const dataWithStaff = { ...formData, staff };

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

    // Add logo to data
    const dataWithLogo = { ...dataWithStaff, logoDataUrl };

    // Get React PDF component
    const StaffPDFComponent = getStaffPDFComponent(formType.replace('-', '_'));
    
    // Create PDF element
    const pdfElement = React.createElement(StaffPDFComponent, { data: dataWithLogo });

    console.log('Generating PDF for staff:', staff.firstName, staff.surname);
    
    // Generate PDF buffer using React PDF (no browser!)
    const pdfBuffer = await renderToBuffer(pdfElement);

    const filename = `${staff.firstName}_${staff.surname}_${formType}.pdf`;

    console.log('PDF generated successfully:', filename);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    console.error("Error generating staff PDF:", error);
    console.error("Error stack:", error.stack);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
