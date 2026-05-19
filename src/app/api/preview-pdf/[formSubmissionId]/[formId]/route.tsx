import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "fs";
import path from "path";
import { getSubmissionById } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";
import { getSettingsByAdmin } from "@/lib/db/settings";
import EmergencyDrillPDF from "@/components-server/PrintableForms/emergency-drill/EmergencyDrillPDF";

// Helper function to encode image to base64
async function encodeImageToBase64(imagePath: string): Promise<string> {
  try {
    const imageBuffer = fs.readFileSync(path.join(process.cwd(), 'public', imagePath));
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error encoding image:', error);
    return '/infinity_logo.png'; // fallback
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ formSubmissionId: string; formId: string }> }
) {
  try {
    const { formSubmissionId, formId } = await params;
    
    console.log(`🔍 Preview PDF for form submission ${formSubmissionId}, form ${formId}`);

    // Fetch form submission data
    const formSubmission = await getSubmissionById(formSubmissionId);

    if (!formSubmission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
    }

    const client = await getClientById(formSubmission.clientId);
    const commonFields = client?.commonFields || null;

    // Fetch settings for the current admin
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/authOptions");
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || null;

    const settings = adminId ? await getSettingsByAdmin(adminId) : await getSettingsByAdmin("GLOBAL");

    const settingsObj = settings.reduce((acc: any, setting: any) => {
      if (setting.value && setting.value.trim() !== '') {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {} as Record<string, string>);

    // Generate PDF using @react-pdf/renderer
    console.time('⏱️ @react-pdf/renderer PDF Preview Generation');
    const logoDataUrl = await encodeImageToBase64("/infinity_logo.png");
    
    const pdfDoc = (
      <EmergencyDrillPDF
        formData={formSubmission.data}
        commonFieldsData={commonFields}
        settings={settingsObj}
        logoDataUrl={logoDataUrl}
      />
    );

    const pdfBuffer = await renderToBuffer(pdfDoc);
    console.timeEnd('⏱️ @react-pdf/renderer PDF Preview Generation');

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
    <title>PDF Preview - Emergency Drill Form</title>
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
    </style>
</head>
<body>
    <div class="header">
        <h1>📄 PDF Preview - Emergency Drill Form</h1>
        <p class="status">✅ Generated with @react-pdf/renderer</p>
        <p><strong>Form:</strong> ${formSubmission.formTitle || 'Emergency Drill'}</p>
        <p><strong>Client:</strong> ${client?.name || 'Unknown'}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="pdf-container">
        <iframe src="${dataUrl}" type="application/pdf"></iframe>
        <div class="controls">
            <button onclick="window.open('${dataUrl}', '_blank')">Open in New Tab</button>
            <button onclick="downloadPDF()">Download PDF</button>
            <button onclick="location.reload()">Refresh Preview</button>
        </div>
    </div>

    <script>
        function downloadPDF() {
            const link = document.createElement('a');
            link.href = '${dataUrl}';
            link.download = 'Emergency_Drill_Preview.pdf';
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
    console.error("Error generating PDF preview:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF preview", details: error.message },
      { status: 500 }
    );
  }
}
