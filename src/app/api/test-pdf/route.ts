import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import EmergencyDrillPDF from "@/components-server/PrintableForms/emergency-drill/EmergencyDrillPDF";

export async function GET() {
  try {
    console.log("🧪 Testing PDF generation with sample data...");

    // Sample data for testing - matching actual form field names
    const sampleFormData = {
      drillDate: "2025-10-16",
      drillTime: "10:30 AM",
      clientName: "Test Client",
      supportWorkers: "John Smith, Jane Doe",
      supervisorNotified: "Yes",
      selectedDrillType: "Fire Drill",
      otherDrill: "",
      planFollowed: "Yes",
      safetyProtocols: "Yes",
      servicesContacted: "No",
      clientResponse: "Client responded well to the drill and followed instructions properly. They remained calm throughout the process and asked appropriate questions.",
      supportAction: "Support workers executed the emergency plan efficiently and maintained calm throughout. All protocols were followed correctly.",
      whatWentWell: "All participants remained calm and followed procedures correctly. The evacuation was completed within the expected timeframe.",
      challenges: "Minor confusion about exit routes, but quickly resolved. Some participants needed additional guidance.",
      unexpectedIssues: "None - everything went according to plan",
      procedureChanges: "Update exit route signage for better visibility. Consider adding more visual cues.",
      additionalTrainingRequired: "No",
      trainingDetails: "",
      planUpdateNeeded: "Yes",
      planUpdateDetails: "Add clearer exit route markers and update contact information.",
      debriefConducted: "Yes",
      supervisorComments: "Overall successful drill with good participation from all involved. Team performed excellently.",
      nextDrillDate: "2025-11-16",
      supportWorkerSignature: "",
      supportWorkerSignatureDate: "2025-10-16",
      supervisorSignature: "",
      supervisorSignatureDate: "2025-10-16"
    };

    const sampleCommonFields = {
      name: "Test Client",
      phone: "123-456-7890",
      email: "test@example.com"
    };

    const sampleSettings = {
      emergency_drill: "ED-001",
      review_date: "2025-10-16"
    };

    // Generate PDF
    console.time('⏱️ PDF Generation Test');
    const pdfDoc = React.createElement(EmergencyDrillPDF, {
      formData: sampleFormData,
      commonFieldsData: sampleCommonFields,
      settings: sampleSettings,
      logoDataUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY2MzYzIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5maW5pdHk8L3RleHQ+Cjwvc3ZnPgo="
    });

    const pdfBuffer = await renderToBuffer(pdfDoc);
    console.timeEnd('⏱️ PDF Generation Test');

    // Convert to base64 for browser display
    const base64PDF = pdfBuffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64PDF}`;

    // Return HTML page with embedded PDF viewer
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Test - Emergency Drill Form</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .pdf-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 80vh;
            border: none;
        }
        .controls {
            padding: 15px 20px;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
        }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        button:hover {
            background: #0056b3;
        }
        .status {
            color: #28a745;
            font-weight: bold;
        }
        .test-info {
            background: #e7f3ff;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 PDF Test - Emergency Drill Form</h1>
        <p class="status">✅ Generated with @react-pdf/renderer (Sample Data)</p>
        <div class="test-info">
            <strong>Test Data Used:</strong> Sample form data, common fields, and settings
        </div>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="pdf-container">
        <iframe src="${dataUrl}" type="application/pdf"></iframe>
        <div class="controls">
            <button onclick="window.open('${dataUrl}', '_blank')">Open in New Tab</button>
            <button onclick="downloadPDF()">Download PDF</button>
            <button onclick="location.reload()">Refresh Test</button>
        </div>
    </div>

    <script>
        function downloadPDF() {
            const link = document.createElement('a');
            link.href = '${dataUrl}';
            link.download = 'Emergency_Drill_Test.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });

  } catch (error: any) {
    console.error("Error generating test PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate test PDF", details: error.message },
      { status: 500 }
    );
  }
}
