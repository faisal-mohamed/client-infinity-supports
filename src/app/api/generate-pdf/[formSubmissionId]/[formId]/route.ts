


import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import React from "react";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getPDFComponent } from "@/components-server/PrintableForms/pdfRegistry";

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

        case "emergency_drill":
        images = {
          infinityLogo: await encodeImageToBase64("/infinity_logo.png"),
        }

        componentProps = {
          formData,
          images,
          commonFieldsData: commonFields || {},
          settings: settings || {}           // ✅ Also in fallback
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

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${css}
      @page { size: A4; margin: 15mm 10mm 15mm 10mm; }
      body { font-family: 'sans-serif', sans-serif; margin: 0; padding: 0; font-size: 12px; line-height: 1.4; }
      .a4-page { page-break-before: always; page-break-after: always; page-break-inside: avoid; width: 100%; min-height: 100vh; max-height: 100vh; display: flex; flex-direction: column; background: white; }
      .a4-page:first-child { page-break-before: auto; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px; }
      th, td { padding: 6px 8px; border: 1px solid #000; text-align: left; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; }
      th { background-color: #f0f0f0; font-weight: bold; }
      tr { page-break-inside: avoid; }
      .footer { text-align: center; font-size: 9px; color: #666; margin-top: auto; padding: 8px 0; border-top: 1px solid #ddd; }
      .header-logo { text-align: center; padding: 10px 0; }
      .page-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
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
    const html = await generateHTML(formData, form.formKey, commonFields, settings);

    if (process.env.NODE_ENV === "development") {
      fs.writeFileSync("playwright-debug.html", html);
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "10mm", right: "10mm" },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    await browser.close();

    const filename = attachmentName || `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_${form.formKey}.pdf`;

    if (returnBuffer) {
      // Return PDF buffer for email attachment (no download headers)
      console.log(`📄 Generated PDF buffer for email: ${filename}`);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "X-PDF-Filename": filename // Custom header to pass filename info
        }
      });
    } else {
      // Original download behavior
      console.log(`📄 Generated PDF for download: ${filename}`);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`
        }
      });
    }
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
