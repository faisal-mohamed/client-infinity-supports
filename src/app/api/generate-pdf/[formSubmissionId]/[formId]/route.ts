


import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getPDFComponent } from "@/components-server/PrintableForms/pdfRegistry";
import EmergencyDrillPDF from "@/components-server/PrintableForms/emergency-drill/EmergencyDrillPDF";
import PersonCentredPlanPDF from "@/components-server/PrintableForms/Person_Centred_Plan/PersonCentredPlanPDF";

async function encodeImageToBase64(imagePath: string): Promise<string> {
  try {
    let imageBuffer: Buffer;
    let extension: string;

    if (imagePath.startsWith("http")) {
      const response = await fetch(imagePath);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      imageBuffer = Buffer.from(await response.arrayBuffer());
      const urlParts = imagePath.split(".");
      extension = urlParts[urlParts.length - 1].split("?")[0];
    } else {
      const fullPath = path.join(process.cwd(), "public", imagePath);
      imageBuffer = fs.readFileSync(fullPath);
      extension = path.extname(imagePath).substring(1);
    }

    return `data:image/${extension};base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error(`Error encoding image ${imagePath}:`, error);
    return "";
  }
}

async function generateHTML(formData: any,  formKey: string, commonFields: any, settings : any) {
  const ReactDOMServer = await import("react-dom/server");
  const cssPath = path.resolve(process.cwd(), "public/tailwind-pdf.css");
  const css = fs.readFileSync(cssPath, "utf8");
  
  // Add emergency drill specific CSS
  let emergencyDrillCSS = '';
  if (formKey === 'emergency_drill') {
    const pdfPrintCSSPath = path.resolve(process.cwd(), "src/components-server/PrintableForms/pdf/pdf-print.css");
    emergencyDrillCSS = fs.readFileSync(pdfPrintCSSPath, "utf8");
  }

  let PDFComponent = getPDFComponent(formKey);
  let componentProps: any = {};
  let images = {};

  try {
    switch (formKey) {
      case "client_intake_form":
         images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
        };

        componentProps = { 
          formKey: 'client_intake_form',           // ✅ Required prop
          formData,                               // ✅ Form submission data
          commonFields: commonFields || {} , 
          images: images || {} ,     // ✅ Client's common fields data
          settings: settings || {}

        };
        break;

      case "home_visit_risk_assessment":
        images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
          riskMatrix: await encodeImageToBase64("/home_risk_assessment.png")
        };

        componentProps = { 
          formData, 
          images,
          commonFields: commonFields || {} ,
          settings: settings       
        };
        break;

      case "person_centred_plan":
        images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
          mainImage: await encodeImageToBase64("/person_centred_plan_cover_image.png")
        };

        componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}
        };
        break;
        case "sa_delivery_of_supports":
        images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
        };

        componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}
        };
        break;

        case "participant_risk_assessment":
        images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
          emergencyNo: await encodeImageToBase64("/participant_risk_assessment_emergency.png"),
          riskAssessmentMatrix: await encodeImageToBase64("/home_risk_assessment.png")
        };

        componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}
        };

        break;

        case "emergency_drill":
        const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
        images = {
          infinityLogo: logoDataUrl,
          infinityLogoDataUrl: logoDataUrl
        }

        componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {},
          logoDataUrl: logoDataUrl  // Pass directly to component
        }
        break;

        case "person_centred_plan":
        const logoDataUrlPCP = await encodeImageToBase64("/infinity_logo.png");
        images = {
          infinityLogo: logoDataUrlPCP,
          infinityLogoDataUrl: logoDataUrlPCP
        }

        componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {},
          logoDataUrl: logoDataUrlPCP  // Pass directly to component
        }
        break;

        case "individual_risk_assessment":
        images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
          riskMatrix: await encodeImageToBase64("/individual-risk-assessment.png")
        };
          componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}           // ✅ Also in fallback
        }

        break;

        case "welcome_form" : 
        images = {
          infinityLogo: await encodeImageToBase64('/infinity_logo.png'),
          p1_4: await encodeImageToBase64('/welcomeimg/p1-4.png'),
          p1_2: await encodeImageToBase64('/welcomeimg/p1-2.png'),
          p1_3: await encodeImageToBase64('/welcomeimg/p1-3.png'),
          p1_1: await encodeImageToBase64('/welcomeimg/p1-1.png'),
          p1_5: await encodeImageToBase64('/welcomeimg/p1-5.png'),
          p3_1: await encodeImageToBase64('/welcomeimg/p3-1.png'),
          p3_2: await encodeImageToBase64('/welcomeimg/p3-2.png'),
          p4_1: await encodeImageToBase64('/welcomeimg/p4-1.png'),

        }

          componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}           // ✅ Also in fallback
        }

        break;

        case "support_action_plan": 
        images =  {
          infinityLogo: await encodeImageToBase64('/infinity_logo.png'),

        }

             componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}           // ✅ Also in fallback
        }

        break;


        case "multi_disciplinary_meeting": 
        images  =  {
          infinityLogo: await encodeImageToBase64('/infinity_logo.png'),

        }

        componentProps = {
          formData,
          images,
          settings: settings || {},
          commonFieldsData: commonFields ||  {},
        }
        break;


      case "schedule_of_supports" : 
      images  =  {
          infinityLogo: await encodeImageToBase64('/infinity_logo.png'),

        }

      componentProps = {
        formData,
        images,
        settings: settings || {},
        commonFieldsData : commonFields || {}
      }

      break;

      case "sa_support_coordination": 
      images  =  {
          infinityLogo: await encodeImageToBase64('/infinity_logo.png'),

        }

      componentProps = {
        formData,
        images,
        settings: settings || {},
        commonFieldsData : commonFields || {}
      }

      break;
      

      default:
        componentProps = { 
          formData, 
          commonFieldsData: commonFields || {},
          settings: settings || {},
          images
        };
        break;


    }
  } catch (error) {
    console.error(`Error preparing form ${formKey}:`, error);
    PDFComponent = getPDFComponent("client_intake_form");
    componentProps = { 
      formData, 
      commonFields: commonFields || {}            // ✅ Also in fallback
    };
  }

  const element = React.createElement(PDFComponent, componentProps);

  // For emergency_drill, use dedicated print CSS; for others, use legacy styles
  const pageStyles = formKey === 'emergency_drill' ? '' : `
    @page { size: A4; margin: 15mm 10mm 15mm 10mm; }
    .a4-page { page-break-before: always; page-break-inside: avoid; width: 210mm; height: 297mm; display: flex; flex-direction: column; background: white; margin: 0 auto; }
    .a4-page:first-child { page-break-before: auto; }
    .a4-page:last-child { page-break-after: auto; }
    .a4-page > * { flex-shrink: 0; }
    .a4-page .flex-grow { flex-grow: 1; }
    .a4-page .mt-auto { margin-top: auto; }
    .footer { text-align: center; font-size: 9px; color: #666; margin-top: auto; padding: 8px 0; border-top: 1px solid #ddd; }
    .header-logo { text-align: center; padding: 10px 0; }
    .page-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  `;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${css}
      ${emergencyDrillCSS}
      ${pageStyles}
      body { font-family: 'sans-serif', sans-serif; margin: 0; padding: 0; font-size: 12px; line-height: 1.4; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px; }
      th, td { padding: 6px 8px; border: 1px solid #000; text-align: left; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; }
      th { background-color: #f0f0f0; font-weight: bold; }
      tr { page-break-inside: avoid; }
      .yes-no-container { display: flex; align-items: center; gap: 15px; }
      .yes-no-container label { margin-right: 8px; font-size: 11px; }
      .yes-no-container input[type="checkbox"] { margin-right: 4px; }
      img { max-width: 100%; height: auto; }
      .signature-container img { max-height: 40px; max-width: 150px; }
      .risk-block { margin-bottom: 8px; padding: 8px; border-left: 3px solid #ccc; }
      h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
      * { box-sizing: border-box; }
      .shadow-lg, .border-gray-300, .mx-auto, .mb-8 { box-shadow: none !important; border: none !important; margin: 0 !important; }
    </style>
  </head>
  <body>
    <div class="form">${ReactDOMServer.renderToString(element)}</div>
  </body>
</html>`;
}

// Generate PDF using @react-pdf/renderer (for emergency_drill and person_centred_plan)
async function generatePDFWithReactPDF(
  formData: any,
  commonFields: any,
  settings: any,
  logoDataUrl: string,
  formKey: string = 'emergency_drill'
): Promise<Buffer> {
  // Choose the appropriate PDF component based on formKey
  const PDFComponent = formKey === 'person_centred_plan' 
    ? PersonCentredPlanPDF 
    : EmergencyDrillPDF;
  
  const pdfDoc = React.createElement(PDFComponent, {
    formData,
    commonFieldsData: commonFields,
    settings,
    logoDataUrl
  }) as any;
  
  const pdfBuffer = await renderToBuffer(pdfDoc);
  return pdfBuffer;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formSubmissionId: string; formId: string }> }
) {
  try {
    const { formSubmissionId, formId } = await params;
    const submissionId = parseInt(formSubmissionId);
    const formIdInt = parseInt(formId);

    // Check if this is a buffer request for email attachment
    const { searchParams } = new URL(req.url);
    const returnBuffer = searchParams.get('buffer') === 'true';
    const attachmentName = searchParams.get('filename'); // Optional custom filename

    if (!submissionId || !formIdInt) {
      return new NextResponse("Missing formSubmissionId or formId", { status: 400 });
    }

    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: submissionId }
    });

    if (!formSubmission) {
      return new NextResponse("Form submission not found", { status: 404 });
    }

    const form = await prisma.masterForm.findUnique({
      where: { id: formIdInt }
    });

    if (!form) {
      return new NextResponse("Form schema not found", { status: 404 });
    }

    // ✅ GET CLIENT ID FROM FORM SUBMISSION
    const clientId = formSubmission.clientId;

    // ✅ FETCH COMMON FIELDS FOR THIS CLIENT
    const commonFields = await prisma.commonField.findUnique({
      where: { clientId: clientId }
    });

    if (!commonFields) {
      console.warn(`No common fields found for client ${clientId}`);
    }

    // ✅ Fetch Form specific settings
    const rawSettings = await prisma.appSettings.findMany({
      where: { isActive: true },
      select: { key: true, value: true },
    });

    const settings: Record<string, any> = {};
    rawSettings.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    const formData = formSubmission.data as any;
    let pdfBuffer: Buffer;

    // Use @react-pdf/renderer for emergency_drill and person_centred_plan, Playwright for others
    if (form.formKey === 'emergency_drill' || form.formKey === 'person_centred_plan') {
      console.time('⏱️ @react-pdf/renderer PDF Generation');
      const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
      pdfBuffer = await generatePDFWithReactPDF(formData, commonFields, settings, logoDataUrl, form.formKey);
      console.timeEnd('⏱️ @react-pdf/renderer PDF Generation');
    } else {
      // Original Playwright approach for other forms
      console.time('⏱️ HTML Generation');
      const html = await generateHTML(formData, form.formKey, commonFields, settings);
      console.timeEnd('⏱️ HTML Generation');

      if (process.env.NODE_ENV === "development") {
        fs.writeFileSync("playwright-debug.html", html);
      }

      console.time('⏱️ Browser Launch');
      const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      console.timeEnd('⏱️ Browser Launch');

      console.time('⏱️ Page Creation');
      const page = await browser.newPage({
        viewport: { width: 1280, height: 1800 }, // Standard viewport for A4
      });
      console.timeEnd('⏱️ Page Creation');

      console.time('⏱️ Set Content');
      await page.setContent(html, { waitUntil: "networkidle", timeout: 15000 });
      console.timeEnd('⏱️ Set Content');

      // Wait for fonts to load
      console.time('⏱️ Font Loading');
      await page.evaluateHandle('document.fonts.ready');
      console.timeEnd('⏱️ Font Loading');

      // Wait for all images to load (critical for header logos)
      console.time('⏱️ Image Loading');
      await page.evaluate(async () => {
        const imgs = Array.from(document.images);
        await Promise.all(
          imgs.map(img => img.complete ? null : new Promise(res => {
            img.onload = res; img.onerror = res;
          }))
        );
      });
      console.timeEnd('⏱️ Image Loading');

      console.time('⏱️ PDF Generation');
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        scale: 1,
        tagged: true // Enable PDF tagging for better accessibility
      });
      console.timeEnd('⏱️ PDF Generation');

      console.time('⏱️ Browser Close');
      await browser.close();
      console.timeEnd('⏱️ Browser Close');
    }

    // Generate proper filename with client name and .pdf extension
    const clientName = commonFields?.name || 'Unknown_Client';
    const sanitizedClientName = clientName.replace(/[^a-zA-Z0-9]/g, "_");
    const formTitle = form.title.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = attachmentName || `${formTitle}_${sanitizedClientName}.pdf`;

    if (returnBuffer) {
      // Return PDF buffer for email attachment (no download headers)
      console.log(`📄 Generated PDF buffer for email: ${filename}`);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "X-PDF-Filename": filename // Custom header to pass filename info
        }
      });
    } else {
      // Original download behavior
      console.log(`📄 Generated PDF for download: ${filename}`);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
