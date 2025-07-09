

// import { NextRequest, NextResponse } from "next/server";
// import { chromium } from "playwright";
// import React from "react";
// import fs from "fs";
// import path from 'path';
// import { prisma } from "@/lib/prisma";
// import { getPDFComponent } from "@/components-server/PrintableForms/pdfRegistry";

// // Move helper functions inside the route handler scope or to a separate utility file
// async function encodeImageToBase64(imagePath: string): Promise<string> {
//   try {
//     let imageBuffer: Buffer;
//     let extension: string;

//     if (imagePath.startsWith('http')) {
//       // Remote image
//       const response = await fetch(imagePath);
//       if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
//       imageBuffer = Buffer.from(await response.arrayBuffer());
//       const urlParts = imagePath.split('.');
//       extension = urlParts[urlParts.length - 1].split('?')[0]; // e.g. jpg, png
//     } else {
//       // Local image
//       const fullPath = path.join(process.cwd(), 'public', imagePath);
//       imageBuffer = fs.readFileSync(fullPath);
//       extension = path.extname(imagePath).substring(1); // e.g. jpg, png
//     }

//     return `data:image/${extension};base64,${imageBuffer.toString('base64')}`;
//   } catch (error) {
//     console.error(`Error encoding image ${imagePath}:`, error);
//     return '';
//   }
// }

// async function generateHTML(formData: any, formSchemas: any, formKey: string, formId: number) {
//   // Dynamically import react-dom/server to avoid Next.js App Router restrictions
//   const ReactDOMServer = await import('react-dom/server');
  
//   // DYNAMIC COMPONENT SELECTION AND SCHEMA HANDLING
//   let PDFComponent: any;
//   let processedSchemas = null;
  
//   try {
//     // Get PDF component by form key
//     PDFComponent = getPDFComponent(formKey);
//     console.log(`Using PDF component for form key: ${formKey}`);
    
//     // Handle schema processing based on form type
//     if (formKey === 'client_intake_form') {
//       // Client intake form uses database schema
//       processedSchemas = JSON.parse(JSON.stringify(formSchemas)); // Deep clone
      
//       // Process all images to base64 for client intake form
//       if (processedSchemas?.clientIntakeSchema?.logo?.src) {
//         const src = processedSchemas.clientIntakeSchema.logo.src;
//         processedSchemas.clientIntakeSchema.logo.src = await encodeImageToBase64(src);
//         processedSchemas.gpMedicalSupportSchema.logo.src = await encodeImageToBase64(src);
//         processedSchemas.allAboutMeSchema.logo.src = await encodeImageToBase64(src);
//         processedSchemas.contactsLivingTravelSchema.logo.src = await encodeImageToBase64(src);
//         processedSchemas.medicationInfoSchema.logo.src = await encodeImageToBase64(src);
//         processedSchemas.safetyConsiderationSchema.logo.src = await encodeImageToBase64(src);
//       }
//     } else if (formKey === 'home_visit_risk_assessment') {
//       // Home visit form has hardcoded schema in component
//       // Process images to base64 for PDF generation
//       const processedImages = {
//         infinityLogo: await encodeImageToBase64('/infinity_logo.png'),
//         riskMatrix: await encodeImageToBase64('/home_risk_assessment.png')
//       };
      
//       processedSchemas = null;
//       console.log('Home visit form: processed images for PDF generation');
//     } else {
//       // For other forms, try to use database schema if available
//       processedSchemas = formSchemas ? JSON.parse(JSON.stringify(formSchemas)) : null;
//       console.log(`Form ${formKey} using database schema:`, !!processedSchemas);
//     }
    
//   } catch (error) {
//     console.error(`Error getting PDF component for form key ${formKey}:`, error);
//     // Fallback to client intake component
//     PDFComponent = getPDFComponent('client_intake_form');
//     processedSchemas = formSchemas ? JSON.parse(JSON.stringify(formSchemas)) : null;
//   }

//   // Read the CSS file for styling
//   const cssPath = path.resolve(process.cwd(), 'public/tailwind-pdf.css');
//   const css = fs.readFileSync(cssPath, 'utf8');

//   // Create the React element with the dynamically selected component
//   // Pass different props based on form type
//   let componentProps: any;
//   if (formKey === 'home_visit_risk_assessment') {
//     // Home visit component needs formData and processed images for PDF
//     componentProps = { 
//       formData,
//       images: {
//         infinityLogo: await encodeImageToBase64('/infinity_logo.png'),
//         riskMatrix: await encodeImageToBase64('/home_risk_assessment.png')
//       }
//     };
//   } else {
//     // Client intake and other forms need both formData and formSchemas
//     componentProps = { formData, formSchemas: processedSchemas };
//   }
  
//   const element = React.createElement(PDFComponent, componentProps);

//   // Generate the HTML
//   return `<!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8" />
//         <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet">
//         <style>
//           /* Add external CSS */
//           ${css}

//           /* PDF-specific page settings */
//           @page {
//             size: A4;
//             margin: 15mm 10mm 15mm 10mm;
//           }

//           /* Global font settings */
//           body {
//             font-family: 'Lexend', sans-serif;
//             margin: 0;
//             padding: 0;
//             font-size: 12px;
//             line-height: 1.4;
//           }

//           /* PDF Page Break Control */
//           .a4-page {
//             page-break-before: always;
//             page-break-after: always;
//             page-break-inside: avoid;
//             width: 100%;
//             min-height: 100vh;
//             max-height: 100vh;
//             display: flex;
//             flex-direction: column;
//             box-sizing: border-box;
//             padding: 0;
//             margin: 0;
//             background: white;
//           }

//           /* First page shouldn't have page break before */
//           .a4-page:first-child {
//             page-break-before: auto;
//           }

//           /* Table styles optimized for PDF */
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-bottom: 10px;
//             font-size: 11px;
//           }

//           th, td {
//             padding: 6px 8px;
//             border: 1px solid #000;
//             text-align: left;
//             vertical-align: top;
//             word-wrap: break-word;
//             overflow-wrap: break-word;
//           }

//           th {
//             background-color: #f0f0f0;
//             font-weight: bold;
//           }

//           /* Prevent table rows from breaking across pages */
//           tr {
//             page-break-inside: avoid;
//           }

//           /* Footer Styling */
//           .footer {
//             text-align: center;
//             font-size: 9px;
//             color: #666;
//             margin-top: auto;
//             padding: 8px 0;
//             border-top: 1px solid #ddd;
//             flex-shrink: 0;
//           }

//           /* Header styling */
//           .header-logo {
//             text-align: center;
//             padding: 10px 0;
//             flex-shrink: 0;
//           }

//           /* Content area that can flex */
//           .page-content {
//             flex: 1;
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//           }

//           /* Yes/No checkbox styling */
//           .yes-no-container {
//             display: flex;
//             align-items: center;
//             gap: 15px;
//           }

//           .yes-no-container label {
//             display: inline-block;
//             margin-right: 8px;
//             font-size: 11px;
//           }

//           .yes-no-container input[type="checkbox"] {
//             margin-right: 4px;
//           }

//           /* Image sizing for PDF */
//           img {
//             max-width: 100%;
//             height: auto;
//           }

//           /* Signature styling */
//           .signature-container img {
//             max-height: 40px;
//             max-width: 150px;
//           }

//           /* Risk assessment blocks */
//           .risk-block {
//             margin-bottom: 8px;
//             padding: 8px;
//             border-left: 3px solid #ccc;
//           }

//           /* Prevent orphaned content */
//           h1, h2, h3, h4, h5, h6 {
//             page-break-after: avoid;
//           }

//           /* Ensure content doesn't overflow page */
//           * {
//             box-sizing: border-box;
//           }

//           /* Hide web-specific styling that might interfere */
//           .shadow-lg,
//           .border-gray-300,
//           .mx-auto,
//           .mb-8 {
//             box-shadow: none !important;
//             border: none !important;
//             margin: 0 !important;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="form">${ReactDOMServer.renderToString(element)}</div>
//       </body>
//     </html>`;
// }

// export async function GET(
//   req: NextRequest, 
//   { params }: { params: Promise<{ formSubmissionId: string; formId: string }> }
// ) {
//   try {
//     // Await the params since they're now a Promise in newer Next.js versions
//     const { formSubmissionId, formId } = await params;
    
//     const submissionId = parseInt(formSubmissionId);
//     const formIdInt = parseInt(formId);

//     if (!submissionId || !formIdInt) {
//       return new NextResponse('Missing formSubmissionId or formId', { status: 400 });
//     }

//     const formSubmission = await prisma.formSubmission.findUnique({
//       where: { id: submissionId },
//     });

//     if (!formSubmission) {
//       return new NextResponse('Form submission not found', { status: 404 });
//     }

//     const form = await prisma.masterForm.findUnique({
//       where: { id: formIdInt },
//     });

//     if (!form) {
//       return new NextResponse('Form schema not found', { status: 404 });
//     }

   
//     const formData = formSubmission.data as any;



//     // Pass both formKey and formId for dynamic component selection
//     const html = await generateHTML(formData, form.schema, form.formKey, formIdInt);

//     if (process.env.NODE_ENV === 'development') {
//       fs.writeFileSync('playwright-debug.html', html);
//     }

//     const browser = await chromium.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'domcontentloaded' });
//     await page.evaluateHandle('document.fonts.ready');

//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//       margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
//       preferCSSPageSize: true,
//       displayHeaderFooter: false,
//     });

//     await browser.close();

//     const filename = `${form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${submissionId}.pdf`;

//     return new NextResponse(pdfBuffer, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename="${filename}"`,
//       },
//     });
//   } catch (error: any) {
//     console.error('Error generating PDF:', error);
//     return new NextResponse(`Error: ${error.message}`, { status: 500 });
//   }
// }





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

async function generateHTML(formData: any,  formKey: string, commonFields: any) {
  const ReactDOMServer = await import("react-dom/server");
  const cssPath = path.resolve(process.cwd(), "public/tailwind-pdf.css");
  const css = fs.readFileSync(cssPath, "utf8");

  let PDFComponent = getPDFComponent(formKey);
  let processedSchemas = null;
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
          images: images || {}      // ✅ Client's common fields data
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
          commonFields: commonFields || {}        // ✅ Also pass common fields to home visit
        };
        break;

      default:
        componentProps = { 
          formData, 
          commonFields: commonFields || {}        // ✅ Pass to any other forms too
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
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      ${css}
      @page { size: A4; margin: 15mm 10mm 15mm 10mm; }
      body { font-family: 'Lexend', sans-serif; margin: 0; padding: 0; font-size: 12px; line-height: 1.4; }
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

    const formData = formSubmission.data as any;
    const html = await generateHTML(formData, form.formKey, commonFields);

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

    const filename = `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_${submissionId}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
