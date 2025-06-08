// // import { NextRequest, NextResponse } from "next/server";
// // import puppeteer from "puppeteer";
// // import { generateHTMLFromComponent } from "@/lib/renderPdf";

// // export const dynamic = "force-dynamic"; // Important for Edge-compatible SSR

// // export async function POST(req: NextRequest) {
// //   const { formData, uiSchema } = await req.json();

// //   try {
// //     const html = generateHTMLFromComponent(formData, uiSchema);

// //     const browser = await puppeteer.launch({
// //       headless: true,
// //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //     });

// //     const page = await browser.newPage();
// //     await page.setContent(html, { waitUntil: "networkidle0" });

// //     const pdfBuffer = await page.pdf({
// //       format: "A4",
// //       printBackground: true,
// //       margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
// //     });

// //     await browser.close();

// //     return new NextResponse(pdfBuffer, {
// //       status: 200,
// //       headers: {
// //         "Content-Type": "application/pdf",
// //         "Content-Disposition": "attachment; filename=form.pdf"
// //       }
// //     });
// //   } catch (err) {
// //     console.error("PDF generation failed:", err);
// //     return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
// //   }
// // }

// // src/app/api/generate-pdf/route.ts
// // app/api/generate-pdf/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer-core";
// import React from "react";

// import fs from "fs";
// export const dynamic = "force-dynamic";

// async function generateHTML(formData: any, uiSchema: any) {
//   const ReactDOMServer = await import('react-dom/server');
//   const { default: PrintableForm } = await import('@/components-server/PrintableForms/ClientIntakeForm');
  
//   const element = React.createElement(PrintableForm, { formData, uiSchema });
//   return "<!DOCTYPE html>" + ReactDOMServer.renderToString(element);
// }

// function getBrowserConfig() {
//   const isDev = process.env.NODE_ENV === 'development';
//   const isWindows = process.platform === 'win32';
//   const isMac = process.platform === 'darwin';
//   const isLinux = process.platform === 'linux';

//   let executablePath;

//   if (isDev) {
//     // Development - try common local installations
//     if (isWindows) {
//       executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
//     } else if (isMac) {
//       executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
//     } else if (isLinux) {
//       executablePath = '/usr/bin/google-chrome-stable';
//     }
//   } else {
//     // Production - use environment variable or container path
//     executablePath = process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
//   }

//   return {
//     headless: true,
//     executablePath,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-accelerated-2d-canvas',
//       '--no-first-run',
//       '--no-zygote',
//       '--disable-gpu'
//     ]
//   };
// }

// export async function GET(req: NextRequest) {
//   const formData = {
//   // Page 1
//   date: "17/05/2025",
//   ndisNumber: "",
//   givenName: "",
//   surname: "",
//   sex: [],
//   sexOther: "",
//   pronoun: "",
//   aboriginal: [],
//   preferredName: "",
//   dob: "",
//   street: "",
//   state: "",
//   postcode: "",
//   email: "",
//   homePhone: "",
//   mobile: "",
//   disability: "",

//   // Page 2
//   medicalCentre: "",
//   medicalPhone: "",
//   coordinatorName: "",
//   coordinatorEmail: "",
//   coordinatorCompany: "",
//   coordinatorContact: "",
//   otherSupports: "",

//   // Page 3
//   advocateName: "",
//   advocateRelation: "",
//   advocatePhone: "",
//   advocateMobile: "",
//   advocateEmail: "",
//   advocateAddress: "",
//   postalAddress: "",
//   otherInfo: "",
//   culturalBarriers: [],
//   interpreterNeeded: "",
//   spokenLanguage: "",
//   culturalValues: "",
//   culturalBehaviours: "",
//   literacy: "",
//   countryOfBirth: "",

//   // Page 4
//   primaryContactName: "",
//   primaryRelationship: "",
//   primaryHomePhone: "",
//   primaryMobile: "",
//   secondaryContactName: "",
//   secondaryRelationship: "",
//   secondaryHomePhone: "",
//   secondaryMobile: "",
//   livingArrangements: [],
//   otherLiving: "",
//   travelMethods: [],
//   otherTravel: ""
// };

// const uiSchema = [
//   // Page 1
//   { type: "title", label: "Client Intake Form" },
//   { type: "field", label: "Date", key: "date" },
//   { type: "field", label: "NDIS Number", key: "ndisNumber" },
//   { type: "field", label: "Given Name", key: "givenName" },
//   { type: "field", label: "Surname", key: "surname" },
//   { type: "checkbox-group", label: "Sex", key: "sex", options: ["Male", "Female", "Prefer not to say"] },
//   { type: "field", label: "Other (Sex)", key: "sexOther" },
//   { type: "field", label: "Pronoun", key: "pronoun" },
//   { type: "checkbox-group", label: "Are you an Aboriginal or Torres Strait Island descent?", key: "aboriginal", options: ["Yes", "No"] },
//   { type: "field", label: "Preferred Name", key: "preferredName" },
//   { type: "field", label: "Date of Birth", key: "dob" },
//   { type: "field", label: "Street", key: "street" },
//   { type: "field", label: "State", key: "state" },
//   { type: "field", label: "Postcode", key: "postcode" },
//   { type: "field", label: "Email", key: "email" },
//   { type: "field", label: "Home Phone No", key: "homePhone" },
//   { type: "field", label: "Mobile No", key: "mobile" },
//   { type: "textarea", label: "Disability Details", key: "disability" },

//   // Page 2
//   { type: "title", label: "GP & Support Coordinator" },
//   { type: "field", label: "Medical Centre", key: "medicalCentre" },
//   { type: "field", label: "Medical Phone", key: "medicalPhone" },
//   { type: "field", label: "Support Coordinator Name", key: "coordinatorName" },
//   { type: "field", label: "Coordinator Email", key: "coordinatorEmail" },
//   { type: "field", label: "Coordinator Company", key: "coordinatorCompany" },
//   { type: "field", label: "Coordinator Contact No", key: "coordinatorContact" },
//   { type: "textarea", label: "Other Supports/Agencies Involved", key: "otherSupports" },

//   // Page 3
//   { type: "title", label: "Advocate / Representative Details" },
//   { type: "field", label: "Advocate Name", key: "advocateName" },
//   { type: "field", label: "Relationship with Participant", key: "advocateRelation" },
//   { type: "field", label: "Phone No", key: "advocatePhone" },
//   { type: "field", label: "Mobile No", key: "advocateMobile" },
//   { type: "field", label: "Email", key: "advocateEmail" },
//   { type: "field", label: "Address", key: "advocateAddress" },
//   { type: "field", label: "Postal Address", key: "postalAddress" },
//   { type: "textarea", label: "Other Information", key: "otherInfo" },
//   { type: "checkbox-group", label: "Any cultural/communication/intimacy issues?", key: "culturalBarriers", options: ["Yes", "No"] },
//   { type: "field", label: "Interpreter Needed?", key: "interpreterNeeded" },
//   { type: "field", label: "Spoken Language", key: "spokenLanguage" },
//   { type: "field", label: "Cultural Values/Beliefs", key: "culturalValues" },
//   { type: "field", label: "Cultural Behaviours", key: "culturalBehaviours" },
//   { type: "field", label: "Written Literacy", key: "literacy" },
//   { type: "field", label: "Country of Birth", key: "countryOfBirth" },

//   // Page 4
//   { type: "title", label: "Primary Contact" },
//   { type: "field", label: "Contact Name", key: "primaryContactName" },
//   { type: "field", label: "Relationship", key: "primaryRelationship" },
//   { type: "field", label: "Home Phone No", key: "primaryHomePhone" },
//   { type: "field", label: "Mobile No", key: "primaryMobile" },

//   { type: "title", label: "Secondary Contact" },
//   { type: "field", label: "Contact Name", key: "secondaryContactName" },
//   { type: "field", label: "Relationship", key: "secondaryRelationship" },
//   { type: "field", label: "Home Phone No", key: "secondaryHomePhone" },
//   { type: "field", label: "Mobile No", key: "secondaryMobile" },

//   { type: "title", label: "Living and Support Arrangements" },
//   { type: "checkbox-group", label: "What is your current living arrangement?", key: "livingArrangements", options: [
//     "Live with Parent/Family/Support Person",
//     "Live in private rental arrangement with others",
//     "Live in private rental arrangement alone",
//     "Owns own home.",
//     "Aged Care Facility",
//     "Mental Health Facility",
//     "Lives in public housing",
//     "Short Term Crisis/Respite",
//     "Staff Supported Group Home",
//     "Hostel/SRS Private Accommodation"
//   ] },
//   { type: "field", label: "Other Living Arrangement", key: "otherLiving" },

//   { type: "title", label: "Travel" },
//   { type: "checkbox-group", label: "How do you travel to your day service?", key: "travelMethods", options: [
//     "Taxi",
//     "Pick up/ drop off by Parent/Family/Support Person",
//     "Transport by a provider",
//     "Independently use Public Transport",
//     "Walk",
//     "Assisted Public Transport",
//     "Drive own car."
//   ] },
//   { type: "field", label: "Other Travel Method", key: "otherTravel" }
// ];

//   try {
//     const browserConfig = getBrowserConfig();
//     const browser = await puppeteer.launch(browserConfig);

//     const page = await browser.newPage();
//     const html = await generateHTML(formData, uiSchema);

//     fs.writeFileSync("puppeteer-debug.html", html);
//     await page.setContent(html, { waitUntil: "networkidle0" });



//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" }
//     });

//     await browser.close();

//     return new NextResponse(pdf, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": 'attachment; filename="form.pdf"',
//       }
//     });
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     return new NextResponse(`Error generating PDF: ${error.message}`, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright"; // ⬅️ Playwright import
import React from "react";
import fs from "fs";
import path from 'path'


export async function generateHTML(formData: any, formSchemas: any) {
  const ReactDOMServer = await import('react-dom/server');
  const { default: CombinedForms } = await import('@/components-server/PrintableForms/ClientIntakev2');

  const cssPath = path.resolve(process.cwd(), 'public/tailwind-pdf.css'); // Path to external CSS file
  const css = fs.readFileSync(cssPath, 'utf8'); // Read the external CSS file

  const element = React.createElement(CombinedForms, { formData, formSchemas });



  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <!-- Link to Google Fonts for Lexend font -->
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet">

        <style>
          /* Add external CSS */
          ${css}

          /* Add page break styling for each form container */
          .form {
            page-break-before: always; /* Forces each form to start on a new page */
            margin-bottom: 20px; /* Optional: adds spacing between forms */
          }

          

          /* Optional: Setting margins for the PDF page */
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

          /* Custom styles for the table and form layout */
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

          /* Adjust the layout of Yes/No checkboxes to avoid squeezing */
          .yes-no-container {
            display: flex;
            align-items: center;
            gap: 20px; /* Add space between Yes/No options */
          }

          .yes-no-container label {
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
          }

          /* Specific width for 'Yes' and 'No' options */
          .yes-no-container input[type="checkbox"] {
            margin-right: 5px; /* Add space between checkbox and label */
          }

        </style>
      </head>
      <body>
        <!-- Ensure that each form gets wrapped with the 'form' class -->
        <div class="form">${ReactDOMServer.renderToString(element)}</div>
      </body>
    </html>`;
}




export async function GET(req: NextRequest) {
const formSchemas = {
  clientIntakeSchema: {
    pageTitle: "Client Intake Form",
    logo: {
      src: "https://infinity-portal.s3.ap-southeast-1.amazonaws.com/infinity_logo.png",
      alt: "Infinity Supports WA logo with text below",
      width: 200,
      height: 60,
    },
    fields: [
      { type: "sectionHeader", label: "Participant Details", colSpan: 1 },
      { label: "Date:", key: "date", type: "text", colSpan: 2 },
      { label: "NDIS Number:", key: "ndisNumber", type: "text", colSpan: 2 },
      { label: "Given name(s):", key: "givenName", type: "text", width: "50%" },
      { label: "Surname:", key: "surname", type: "text", width: "25%" },
      {
        label: "Sex:",
        key: "sex",
        type: "checkboxGroup",
        width: "25%",
        options: ["Male", "Female", "Prefer not to say"],
        otherKey: "sexOther",
      },
      { label: "Pronoun:", key: "pronoun", type: "text", colSpan: 3 },
      {
        label: "Are you an Aboriginal or Torres Strait Island descent?",
        key: "aboriginalTorres",
        type: "checkboxGroup",
        colSpan: 1,
        options: ["Yes", "No"],
        width: "auto",
      },
      { label: "Preferred name:", key: "preferredName", type: "text", colSpan: 2 },
      { label: "Date of Birth:", key: "dateOfBirth", type: "text", width: "auto" },

      { type: "sectionHeader", label: "Residential Address Details", colSpan: 3 },
      { label: "Number / Street:", key: "addressNumberStreet", type: "text", colSpan: 3 },
      { label: "State:", key: "state", type: "text", width: "50%" },
      { label: "Postcode:", key: "postcode", type: "text", colSpan: 2, width: "50%" },

      { type: "sectionHeader", label: "Participant Contact Details", colSpan: 3 },
      { label: "Email address:", key: "email", type: "text", colSpan: 3 },
      { label: "Home Phone No:", key: "homePhone", type: "text", width: "50%" },
      { label: "Mobile No:", key: "mobile", type: "text", colSpan: 2, width: "50%" },

      { type: "sectionHeader", label: "Disability Conditions/Disability type(s)", colSpan: 3 },
      {
        label: "",
        key: "disabilityConditions",
        type: "textarea",
        colSpan: 3,
        height: 150,
      },
    ],
    footer: true,
  },

  gpMedicalSupportSchema: {
    pageTitle: "GP Medical Contact & Support Coordinator",
    logo: {
      src: "https://storage.googleapis.com/a1aa/image/60c7494d-1742-4d0b-7807-ebe4a74c7ae5.jpg",
      alt: "Infinity Supports WA logo with infinity symbol and text Achieving Goals and Beyond",
      width: 150,
      height: 60,
    },
    fields: [
      { type: "sectionHeader", label: "GP Medical Contact", colSpan: 2 },
      { label: "Medical Centre Name:", key: "medicalCentreName", type: "text", colSpan: 2 },
      { label: "Phone:", key: "medicalPhone", type: "text", colSpan: 2 },

      { type: "sectionHeader", label: "Support Coordinator", colSpan: 2, bgColor: "bg-gray-100" },
      { label: "Name:", key: "supportCoordinatorName", type: "text", width: "50%" },
      { label: "Email Address:", key: "supportCoordinatorEmail", type: "text", width: "50%" },
      { label: "Company:", key: "supportCoordinatorCompany", type: "text", width: "50%" },
      { label: "Contact number:", key: "supportCoordinatorContact", type: "text", width: "50%" },

      {
        type: "sectionHeader",
        label: "What other supports including mainstream health services you receive at present",
        colSpan: 2,
        bgColor: "bg-gray-300",
      },
      {
        label: "",
        key: "otherSupports",
        type: "textarea",
        colSpan: 2,
        height: 256,
      },
    ],
    footer: true,
  },

   allAboutMeSchema :  {
  logo: {
    src: "https://storage.googleapis.com/a1aa/image/dafeefca-969e-49a6-bb3f-e65ee9da3763.jpg",
    alt: "Infinity Supports WA logo with infinity symbol and text Achieving Goals and Beyond",
    width: 150,
    height: 60,
  },
  sections: {
    allAboutMe: {
      title: "All About Me",
    },
    advocateDetails: {
      title: "Advocate/representative details (if applicable)",
      fields: {
        name: "Name:",
        relationship: "Relationship with the participant:",
        phone: "Phone No:",
        mobile: "Mobile No:",
        email: "Email:",
        address: "Address Details:",
        postalAddress: "Postal Address Details:",
        otherInfo: "Other Information:",
      },
    },
    personalSituation: {
      title: "Personal Situation",
      fields: {
        barriers: {
          label:
            "Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?",
          options: ["Yes", "No"],
          followUp: "If yes, please indicate below:",
        },
        interpreter: {
          label: "Verbal communication or spoken language - Is an interpreter needed?",
          options: ["Yes", "No"],
        },
        language: { label: "Language" },
        culturalValues: { label: "Cultural values/ beliefs or assumptions" },
        culturalBehaviours: { label: "Cultural behaviours" },
        writtenCommunication: { label: "Written communication/literacy" },
        countryOfBirth: { label: "Country of birth" },
      },
    },
  },
},


  contactsLivingTravelSchema: {
    pageTitle: "Contacts, Living and Travel",
    logo: {
      src: "https://storage.googleapis.com/a1aa/image/584716cd-8f5f-4d0c-5fb6-9e8ec638f94b.jpg",
      alt: "Infinity Supports WA logo with pink infinity symbol and text below",
      width: 150,
      height: 70,
    },
    fields: [
      { type: "contactHeader", label: "Primary Contact" },
      {
        type: "contactRow",
        columns: [
          { label: "Contact Name:", key: "primaryContactName" },
          { label: "Relationship:", key: "primaryContactRelationship" },
        ],
      },
      {
        type: "contactRow",
        columns: [
          { label: "Home Phone No:", key: "primaryContactHomePhone" },
          { label: "Mobile No:", key: "primaryContactMobile" },
        ],
      },
      { type: "contactHeader", label: "Secondary Contact" },
      {
        type: "contactRow",
        columns: [
          { label: "Contact Name:", key: "secondaryContactName" },
          { label: "Relationship:", key: "secondaryContactRelationship" },
        ],
      },
      {
        type: "contactRow",
        columns: [
          { label: "Home Phone No:", key: "secondaryContactHomePhone" },
          { label: "Mobile No:", key: "secondaryContactMobile" },
        ],
      },
      {
        type: "boxSection",
        heading: "Living and support arrangements",
        question: "What is your current living arrangement? (Please tick the appropriate box)",
        key: "livingArrangements",
        options: [
          "Live with Parent/Family/Support Person",
          "Live in private rental arrangement with others",
          "Live in private rental arrangement alone",
          "Owns own home.",
          "Aged Care Facility",
          "Mental Health Facility",
          "Lives in public housing",
          "Short Term Crisis/Respite",
          "Staff Supported Group Home",
          "Hostel/SRS Private Accommodation",
          "Other",
        ],
        otherKey: "livingArrangementsOther",
      },
      {
        type: "boxSection",
        heading: "Travel",
        question: "How do you travel to work or to your day service? (Please tick the appropriate box)",
        key: "travelArrangements",
        options: [
          "Taxi",
          "Pick up/ drop off by Parent/Family/Support Person",
          "Transport by a provider",
          "Independently use Public Transport",
          "Walk",
          "Assisted Public Transport",
          "Drive own car.",
          "Other",
        ],
        otherKey: "travelArrangementsOther",
      },
    ],
    footer: true,
  },
 medicationInfoSchema : {
  logo: {
    src: "https://storage.googleapis.com/a1aa/image/9190d8d0-4133-41db-1cc6-1a07bdd4a03c.jpg",
    alt: "Infinity Supports WA logo with infinity symbol in red above text",
    width: 120,
    height: 50,
  },
  title: "Medication Information/Diagnosis/Health Concerns",
  fields: [
    {
      key: "medicationChart",
      label: "Does the Participant require a Medication Chart?",
      yesDetail:
        "(If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment)",
    },
    {
      key: "mealtimeManagement",
      label: "Does the Participant require Mealtime Management?",
      yesDetail: "If yes, refer to Mealtime Management Plan Form",
    },
    {
      key: "bowelCare",
      label: "Does the participant require Bowel Care Management?",
      yesDetail:
        "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.",
    },
    {
      key: "menstrualIssues",
      label:
        "Are there any issues with a menstrual cycle or is assistance needed with female hygiene",
      yesDetail: "If yes, please specify:",
    },
    {
      key: "epilepsy",
      label: "Does the Participant have Epilepsy?",
      yesDetail: "If yes, ensure Participant’s Doctor completes an Epilepsy Plan",
    },
    {
      key: "asthmatic",
      label: "Is the Participant an Asthmatic?",
      yesDetail: "If yes, ensure Participant’s Doctor completes an Asthma Plan",
    },
    {
      key: "allergies",
      label: "Does the Participant have any allergies?",
      yesDetail: "If yes, ensure to have an Allergy Plan from Participant’s Doctor",
    },
    {
      key: "anaphylactic",
      label: "Is the Participant anaphylactic?",
      yesDetail: "If yes, ensure to have an anaphylaxis Plan from the Participant’s Doctor",
    },
     {
      key: "minorInjury",
      label: "Do you give permission for our company’s staff to administer band-aids in cases of a minor injury?",
      //yesDetail: "If yes, ensure Participant’s Doctor completes an Asthma Plan",
    },
    {
      key: "training",
      label: "Does this participant require specific training",
      yesDetail: "If yes, ensure to provide information such as implementing a positive behaviour support plan.",
    },
    {
      key: "othermedical",
      label: "Are there any other medication conditions that will be relevant to the care provided to this Participant?",
      yesDetail: "If yes, Please specify",
    },
    {
      key: "trigger",
      label: "Is there any specific trigger for community activities?",
      yesDetail: "If yes, please specify and complete the Risk assessment for participants. ",
    },
  ],
},
safetyConsiderationSchema : {
  logo: {
    src: "https://storage.googleapis.com/a1aa/image/9190d8d0-4133-41db-1cc6-1a07bdd4a03c.jpg",
    alt: "Infinity Supports WA logo with infinity symbol in red above text",
    width: 120,
    height: 50,
  },
  title: "Safety Considerations",
  fields: [
    {
      key: "absconding",
      label: "Does the Participant show signs or a history of unexpectedly leaving (absconding)?",
      yesDetail:
        "If yes, please specify.",
    },
    {
      key: "historyOfFalls",
      label: "Is this participant prone to falls or have a history of falls? ",
      //: "If yes, refer to Mealtime Management Plan Form",
    },
    {
      key: "behaviourConcern",
      label: "Are there any behaviours of concern? E.g.:.kicking, biting",
      yesDetail:
        "If yes, please specify.",
    },
    {
      key: "positiveBehaviour",
      label:
        "Is there a current Positive Behaviour Support Plan in place",
      yesDetail: "If yes, refer to High Risk Participant Register.",
    },
    {
      key: "communicationAssistance",
      label: "If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan",
      yesDetail: "If yes, ensure Participant’s Doctor completes an Epilepsy Plan",
    },
    {
      key: "physicalAssistance",
      label: "Is there any physical assistance or physical assistance preference for this Participant?",
      yesDetail: "If yes, specify",
    },
    {
      key: "languageConcern",
      label: "Does the Participant have any expressive language concerns?",
      yesDetail: "If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication",
    },
    {
      key: "personalGoals",
      label: "Does this Participant have any personal preferences & personal goals?",
      yesDetail: "If yes, refer to form Support Plan",
    },
  ],
}



};

const formData = {
  date: "2025-06-08",
  ndisNumber: "123456789",
  givenName: "John",
  surname: "Doe",
  sex: ["Male"],
  sexOther: "",
  pronoun: "He/Him",
  aboriginalTorres: ["No"],
  preferredName: "Johnny",
  dateOfBirth: "1990-01-01",
  addressNumberStreet: "123 Main St",
  state: "WA",
  postcode: "6000",
  email: "john.doe@example.com",
  homePhone: "08 1234 5678",
  mobile: "0412 345 678",
  disabilityConditions: "None",

  medicalCentreName: "Health Clinic WA",
  medicalPhone: "08 9876 5432",
  supportCoordinatorName: "Jane Smith",
  supportCoordinatorEmail: "jane.smith@example.com",
  supportCoordinatorCompany: "Support Co.",
  supportCoordinatorContact: "0411 222 333",
  otherSupports: "Physiotherapy, Occupational Therapy",

   allAboutMe: "I love reading and music.",
  advocateName: "Jane Doe",
  advocateRelationship: "Mother",
  advocatePhone: "08 1234 5678",
  advocateMobile: "0412 345 678",
  advocateEmail: "jane.doe@example.com",
  advocateAddress: "123 Main St, Perth",
  advocatePostalAddress: "PO Box 123, Perth",
  advocateOtherInfo: "N/A",
  personalSituation: {
    barriers: "No",
    interpreter: "No",
    language: "English",
    culturalValues: "None",
    culturalBehaviours: "None",
    writtenCommunication: "No issues",
    countryOfBirth: "Australia",
  },

  primaryContactName: "Michael Brown",
  primaryContactRelationship: "Brother",
  primaryContactHomePhone: "08 3333 4444",
  primaryContactMobile: "0412 333 444",
  secondaryContactName: "Emma Brown",
  secondaryContactRelationship: "Sister",
  secondaryContactHomePhone: "08 5555 6666",
  secondaryContactMobile: "0412 555 666",
  livingArrangements: ["Live with Parent/Family/Support Person", "Owns own home."],
  livingArrangementsOther: "",
  travelArrangements: ["Taxi", "Drive own car."],
  travelArrangementsOther: "Occasionally carpool",

  medicationChart: "Yes",
  mealtimeManagement: "No",
  bowelCare: "No",
  menstrualIssues: "No",
  epilepsy: "No",
  asthmatic: "No",
  allergies: "Yes",
  anaphylactic: "No",
  minorInjury: "No",
  training: "No",
  othermedical: "Yes",
  trigger: "Yes",

  absconding: "Yes",
  historyOfFalls: "No",
  behaviourConcern: "Yes",
  positiveBehaviour: "No",
  communicationAssistance: "No",
  physicalAssistance: "No",
  languageConcern: "No",
  personalGoals: "Yes"





  

};

  try {
    const html = await generateHTML(formData, formSchemas);

    // Optional: save for debugging
    fs.writeFileSync("playwright-debug.html", html);

    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="form.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new NextResponse(`Error generating PDF: ${error.message}`, { status: 500 });
  }
}
