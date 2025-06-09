

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright"; // ⬅️ Playwright import
import React from "react";
import fs from "fs";
import path from 'path'

import os from "os"



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

  // Make encodeImageToBase64 async
if (processedSchemas.clientIntakeSchema?.logo?.src) {
  const src = processedSchemas.clientIntakeSchema.logo.src;
  processedSchemas.clientIntakeSchema.logo.src = await encodeImageToBase64(src);
  processedSchemas.gpMedicalSupportSchema.logo.src = await encodeImageToBase64(src);
  processedSchemas.allAboutMeSchema.logo.src = await encodeImageToBase64(src);
  processedSchemas.contactsLivingTravelSchema.logo.src = await encodeImageToBase64(src);
  processedSchemas.medicationInfoSchema.logo.src = await encodeImageToBase64(src);
  processedSchemas.safetyConsiderationSchema.logo.src = await encodeImageToBase64(src);
}

  const ReactDOMServer = await import('react-dom/server');
  const { default: CombinedForms } = await import('@/components-server/PrintableForms/ClientIntakev2');

  const cssPath = path.resolve(process.cwd(), 'public/tailwind-pdf.css'); // Path to external CSS file
  const css = fs.readFileSync(cssPath, 'utf8'); // Read the external CSS file

  const element = React.createElement(CombinedForms, { formData, formSchemas: processedSchemas });



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
      src: "https://infinity-portal.s3.ap-southeast-1.amazonaws.com/infinity_logo.png",
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
    src: "https://infinity-portal.s3.ap-southeast-1.amazonaws.com/infinity_logo.png",
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
      src: "https://infinity-portal.s3.ap-southeast-1.amazonaws.com/infinity_logo.png",
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
    src: "https://infinity-portal.s3.ap-southeast-1.amazonaws.com/infinity_logo.png",
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
    src: "https://infinity-portal.s3.ap-southeast-1.amazonaws.com/infinity_logo.png",
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
});

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.evaluateHandle('document.fonts.ready');

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

