import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import React from "react";
import fs from "fs";
import path from 'path';
import { prisma } from "@/lib/prisma";

export async function encodeImageToBase64(imagePath: string): Promise<string> {
  try {
    let imageBuffer: Buffer;
    let extension: string;

    if (imagePath.startsWith('http')) {
      // Remote image
      const response = await fetch(imagePath);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      imageBuffer = Buffer.from(await response.arrayBuffer());
      const urlParts = imagePath.split('.');
      extension = urlParts[urlParts.length - 1].split('?')[0]; // e.g. jpg, png
    } else {
      // Local image
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      imageBuffer = fs.readFileSync(fullPath);
      extension = path.extname(imagePath).substring(1); // e.g. jpg, png
    }

    return `data:image/${extension};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error encoding image ${imagePath}:`, error);
    return '';
  }
}

export async function generateHTML(formData: any, formSchemas: any) {
  const processedSchemas = JSON.parse(JSON.stringify(formSchemas)); // Deep clone

  // Process all images to base64
  if (processedSchemas.clientIntakeSchema?.logo?.src) {
    const src = processedSchemas.clientIntakeSchema.logo.src;
    processedSchemas.clientIntakeSchema.logo.src = await encodeImageToBase64(src);
    processedSchemas.gpMedicalSupportSchema.logo.src = await encodeImageToBase64(src);
    processedSchemas.allAboutMeSchema.logo.src = await encodeImageToBase64(src);
    processedSchemas.contactsLivingTravelSchema.logo.src = await encodeImageToBase64(src);
    processedSchemas.medicationInfoSchema.logo.src = await encodeImageToBase64(src);
    processedSchemas.safetyConsiderationSchema.logo.src = await encodeImageToBase64(src);
  }

  // Dynamically import react-dom/server to avoid Next.js App Router restrictions
  const ReactDOMServer = await import('react-dom/server');
  const { default: CombinedForms } = await import('@/components-server/PrintableForms/ClientIntakev2');

  // Read the CSS file for styling
  const cssPath = path.resolve(process.cwd(), 'public/tailwind-pdf.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Create the React element
  const element = React.createElement(CombinedForms, { formData, formSchemas: processedSchemas });

  // Generate the HTML
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          /* Add external CSS */
          ${css}

          /* Add page break styling for each form container */
          .form {
            page-break-before: always;
            margin-bottom: 20px;
          }

          /* Page settings */
          @page {
            size: A4;
            margin: 20mm;
          }

          /* Global font settings */
          body {
            font-family: 'Lexend', sans-serif;
            margin: 0;
            padding: 0;
          }

          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          th, td {
            padding: 8px;
            border: 1px solid #ccc;
            text-align: left;
            font-size: 12px;
          }

          th {
            background-color: #f0f0f0;
          }

          /* Footer Styling */
          .footer {
            text-align: center;
            font-size: 10px;
            color: #666;
            margin-top: 20px;
          }

          /* Yes/No checkbox styling */
          .yes-no-container {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .yes-no-container label {
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
          }

          .yes-no-container input[type="checkbox"] {
            margin-right: 5px;
          }
        </style>
      </head>
      <body>
        <div class="form">${ReactDOMServer.renderToString(element)}</div>
      </body>
    </html>`;
}

// export async function GET(req: NextRequest) {
//   try {
//     // Get query parameters
//     const url = new URL(req.url);
//     const formKey = url.searchParams.get('formKey') as string | undefined;
//     const formId = url.searchParams.get('formId');
//     const clientId = url.searchParams.get('clientId');

//     // Validate required parameters
//     if (!formKey && !formId) {
//       return new NextResponse('Missing required parameter: formKey or formId', { status: 400 });
//     }

//     // Get the form schema from the database
//     let form;
//     if (formId) {
//       // If formId is provided, get that specific form
//       form = await prisma.masterForm.findUnique({
//         where: { id: parseInt(formId) }
//       });
//     } else if (formKey) {
//       // Otherwise get the latest version of the form by formKey
//       form = await prisma.masterForm.findFirst({
//         where: { formKey: formKey },
//         orderBy: { version: 'desc' }
//       });
//     }

//     if (!form) {
//       return new NextResponse('Form not found', { status: 404 });
//     }

//     // Get form data if clientId is provided
//     let formData = {};
//     if (clientId) {
//       // Get form submission data for this client and form
//       const formSubmission = await prisma.formSubmission.findFirst({
//         where: {
//           clientId: parseInt(clientId),
//           formId: form.id
//         }
//       });

//       if (formSubmission) {
//         formData = formSubmission.data as any;
//       } else {
//         // Get common fields as fallback
//         const commonFields = await prisma.commonField.findUnique({
//           where: { clientId: parseInt(clientId) }
//         });

//         if (commonFields) {
//           // Map common fields to form data structure
//           formData = {
//             givenName: commonFields.name,
//             age: commonFields.age,
//             email: commonFields.email,
//             sex: commonFields.sex ? [commonFields.sex] : [],
//             addressNumberStreet: commonFields.street,
//             state: commonFields.state,
//             postcode: commonFields.postCode,
//             dateOfBirth: commonFields.dob,
//             ndisNumber: commonFields.ndis,
//             disabilityConditions: commonFields.disability,
//             // Add more mappings as needed
//           };
//         }
//       }
//     }

//     // If no client data or as a fallback, use sample data for preview
//     if (Object.keys(formData).length === 0) {
//       const formData = {
//   date: "2025-06-08",
//   ndisNumber: "123456789",
//   givenName: "John",
//   surname: "Doe",
//   sex: ["Male"],
//   sexOther: "",
//   pronoun: "He/Him",
//   aboriginalTorres: ["No"],
//   preferredName: "Johnny",
//   dateOfBirth: "1990-01-01",
//   addressNumberStreet: "123 Main St",
//   state: "WA",
//   postcode: "6000",
//   email: "john.doe@example.com",
//   homePhone: "08 1234 5678",
//   mobile: "0412 345 678",
//   disabilityConditions: "None",

//   medicalCentreName: "Health Clinic WA",
//   medicalPhone: "08 9876 5432",
//   supportCoordinatorName: "Jane Smith",
//   supportCoordinatorEmail: "jane.smith@example.com",
//   supportCoordinatorCompany: "Support Co.",
//   supportCoordinatorContact: "0411 222 333",
//   otherSupports: "Physiotherapy, Occupational Therapy",

//    allAboutMe: "I love reading and music.",
//   advocateName: "Jane Doe",
//   advocateRelationship: "Mother",
//   advocatePhone: "08 1234 5678",
//   advocateMobile: "0412 345 678",
//   advocateEmail: "jane.doe@example.com",
//   advocateAddress: "123 Main St, Perth",
//   advocatePostalAddress: "PO Box 123, Perth",
//   advocateOtherInfo: "N/A",
//   personalSituation: {
//     barriers: "No",
//     interpreter: "No",
//     language: "English",
//     culturalValues: "None",
//     culturalBehaviours: "None",
//     writtenCommunication: "No issues",
//     countryOfBirth: "Australia",
//   },

//   primaryContactName: "Michael Brown",
//   primaryContactRelationship: "Brother",
//   primaryContactHomePhone: "08 3333 4444",
//   primaryContactMobile: "0412 333 444",
//   secondaryContactName: "Emma Brown",
//   secondaryContactRelationship: "Sister",
//   secondaryContactHomePhone: "08 5555 6666",
//   secondaryContactMobile: "0412 555 666",
//   livingArrangements: ["Live with Parent/Family/Support Person", "Owns own home."],
//   livingArrangementsOther: "",
//   travelArrangements: ["Taxi", "Drive own car."],
//   travelArrangementsOther: "Occasionally carpool",

//   medicationChart: "Yes",
//   mealtimeManagement: "No",
//   bowelCare: "No",
//   menstrualIssues: "No",
//   epilepsy: "No",
//   asthmatic: "No",
//   allergies: "Yes",
//   anaphylactic: "No",
//   minorInjury: "No",
//   training: "No",
//   othermedical: "Yes",
//   trigger: "Yes",

//   absconding: "Yes",
//   historyOfFalls: "No",
//   behaviourConcern: "Yes",
//   positiveBehaviour: "No",
//   communicationAssistance: "No",
//   physicalAssistance: "No",
//   languageConcern: "No",
//   personalGoals: "Yes"  

// };
//     }

//     // Generate HTML
//     const html = await generateHTML(formData, form.schema);

//     // Optional: save for debugging
//     if (process.env.NODE_ENV === 'development') {
//       fs.writeFileSync("playwright-debug.html", html);
//     }

//     // Launch browser and generate PDF
//     const browser = await chromium.launch({
//       headless: true,
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: 'domcontentloaded' });

//     // Wait for fonts to load
//     await page.evaluateHandle('document.fonts.ready');

//     // Generate PDF
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" }
//     });

//     await browser.close();

//     // Generate filename
//     const filename = clientId
//       ? `${form.formKey}_client_${clientId}_${new Date().toISOString().split('T')[0]}.pdf`
//       : `${form.formKey}_preview_${new Date().toISOString().split('T')[0]}.pdf`;

//     // Return PDF
//     return new NextResponse(pdfBuffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${filename}"`,
//       },
//     });
//   } catch (error: any) {
//     console.error("Error generating PDF:", error);
//     return new NextResponse(`Error generating PDF: ${error.message}`, { status: 500 });
//   }
// }

export async function GET(req: NextRequest, context: { params: { formSubmissionId: string; formId: string } }) {

  try {
        const submissionId = parseInt(context.params.formSubmissionId);
    const formId = parseInt(context.params.formId);

    if (!submissionId || !formId) {
      return new NextResponse('Missing formSubmissionId or formId', { status: 400 });
    }

    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!formSubmission) {
      return new NextResponse('Form submission not found', { status: 404 });
    }

    const form = await prisma.masterForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return new NextResponse('Form schema not found', { status: 404 });
    }

    const formData = formSubmission.data as any;
    const html = await generateHTML(formData, form.schema);

    if (process.env.NODE_ENV === 'development') {
      fs.writeFileSync('playwright-debug.html', html);
    }

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluateHandle('document.fonts.ready');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' },
    });

    await browser.close();

    const filename = `form_${formId}_submission_${submissionId}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
