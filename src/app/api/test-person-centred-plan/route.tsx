import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import PersonCentredPlanPDF from "@/components-server/PrintableForms/Person_Centred_Plan/PersonCentredPlanPDF";

export async function GET() {
  // Sample data for testing
  const sampleFormData = {
    name: "John Smith",
    address: "123 Main Street, Perth WA 6000",
    dob: "1990-05-15",
    guardian: "Jane Smith",
    guardianAddress: "456 Elm Street, Perth WA 6000",
    contactNumber: "0412345678",
    disability: "Autism Spectrum Disorder",
    ndisNumber: "NDIS-1234567890",
    myStory: "I am a passionate artist who loves community activities and connecting with others through creative expression.",
    strengths: "Creativity, patience, empathy, strong communication skills",
    challenges: "Sensory sensitivities, difficulty with change",
    allergies: "Peanuts, shellfish",
    respiratoryHistory: "No history of respiratory depression",
    precautions: "Avoid crowded spaces during peak hours",
    healthConditions: "Asthma, anxiety",
    companionCard: "Yes",
    ambulanceCover: "Yes",
    healthcarePrompt: "Yes",
    pbsSupportPlanIncluded: "No",
    restrictivePractices: "No",
    organizationName: "Infinity Supports WA",
    contactPersonOrg: "Sarah Johnson",
    contactNumberOrg: "0898765432",
    goals: JSON.stringify([
      {
        goal: "Improve independent living skills",
        rating: "Partly Achieved",
        actions: "Weekly cooking classes, budgeting workshops",
        byWhom: "Support Worker",
        byWhen: "2025-12-31",
        reviewDate: "2025-06-30"
      },
      {
        goal: "Increase social connections",
        rating: "New Goal",
        actions: "Join community art group, attend weekly meetups",
        byWhom: "Support Coordinator",
        byWhen: "2025-08-31",
        reviewDate: "2025-04-30"
      }
    ]),
    informalSupports: JSON.stringify([
      {
        support: "Family",
        role: "Emotional support and daily assistance",
        frequency: "Daily"
      },
      {
        support: "Friends",
        role: "Social activities and companionship",
        frequency: "Weekly"
      }
    ])
  };

  const sampleCommonFields = {
    name: "John Smith",
    street: "123 Main Street",
    dob: "1990-05-15",
    phone: "0412345678",
    disability: "Autism Spectrum Disorder",
    ndis: "NDIS-1234567890"
  };

  const sampleSettings = {
    person_centred_plan: "PCP-001",
    review_date: "2025-10-15"
  };

  const logoDataUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbmZpbml0eSBMb2dvPC90ZXh0Pgo8L3N2Zz4K";

  try {
    const pdfDoc = (<PersonCentredPlanPDF
      formData={sampleFormData}
      commonFieldsData={sampleCommonFields}
      settings={sampleSettings}
      logoDataUrl={logoDataUrl}
      />
    );

    const pdfBuffer = await renderToBuffer(pdfDoc);
    const base64PDF = pdfBuffer.toString("base64");

    return new NextResponse(
      `
      <html>
        <head>
          <title>Person Centred Plan PDF Test</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #374151; }
            iframe { border: 1px solid #ccc; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Person Centred Plan PDF Test</h1>
          <p>This is a test of the Person Centred Plan PDF generation using @react-pdf/renderer.</p>
          <iframe 
            src="data:application/pdf;base64,${base64PDF}" 
            width="100%" 
            height="800px"
          ></iframe>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Error generating Person Centred Plan PDF:", error);
    return new NextResponse(
      `
      <html>
        <body>
          <h1>Error</h1>
          <p>Failed to generate Person Centred Plan PDF:</p>
          <pre>${error}</pre>
        </body>
      </html>
    `,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
