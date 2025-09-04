import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import React from "react";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getStaffPDFComponent } from "@/components-server/staff/staffPDFRegistry";


async function generateStaffHTML(formData: any, formType: string, staff: any) {
  const ReactDOMServer = await import("react-dom/server");
  const cssPath = path.resolve(process.cwd(), "public/tailwind-pdf.css");
  const css = fs.readFileSync(cssPath, "utf8");

  const StaffPDFComponent = getStaffPDFComponent(formType);
  const element = React.createElement(StaffPDFComponent, { data: formData });

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${css}
      @page { 
        size: A4; 
        margin: 15mm 10mm 15mm 10mm; 
      }
      body { 
        font-family: 'sans-serif', sans-serif; 
        margin: 0; 
        padding: 0; 
        font-size: 12px; 
        line-height: 1.4; 
      }
      .page { 
        page-break-before: always; 
        page-break-after: always; 
        page-break-inside: avoid; 
        width: 100%; 
        min-height: 100vh; 
        display: flex; 
        flex-direction: column; 
        background: white; 
        padding: 20px;
        box-sizing: border-box;
      }
      .page:first-child { 
        page-break-before: auto; 
      }
      .footer {
        margin-top: auto;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }
      img { 
        max-width: 100%; 
        height: auto; 
      }
      .signature-container img { 
        max-height: 40px; 
        max-width: 150px; 
      }
      h1, h2, h3, h4, h5, h6 { 
        page-break-after: avoid; 
      }
      * { 
        box-sizing: border-box; 
      }
      .shadow, .border-gray-300, .mx-auto, .mb-8 { 
        box-shadow: none !important; 
        margin: 0 !important; 
      }
    </style>
  </head>
  <body>
    <div class="form">${ReactDOMServer.renderToString(element)}</div>
  </body>
</html>`;
}

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

    const html = await generateStaffHTML(dataWithStaff, formType.replace('-', '_'), staff);

    if (process.env.NODE_ENV === "development") {
      fs.writeFileSync("staff-pdf-debug.html", html);
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer : any = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "10mm", right: "10mm" },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    await browser.close();

    const filename = `${staff.firstName}_${staff.surname}_${formType}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    console.error("Error generating staff PDF:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
