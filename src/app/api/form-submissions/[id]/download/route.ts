import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormComponent } from "@/app/forms/registry";
import { renderToString } from "react-dom/server";
import { createElement } from "react";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formSubmissionId = parseInt(id);

    if (!formSubmissionId) {
      return NextResponse.json(
        { error: "Valid form submission ID is required" },
        { status: 400 }
      );
    }

    // Get form submission data
    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: formSubmissionId },
      include: {
        form: {
          select: {
            formKey: true,
            title: true,
            schema: true,
          },
        },
        client: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!formSubmission) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    // For now, return a simple PDF generation response
    // In a full implementation, you would use puppeteer or similar to generate PDF
    const pdfContent = generateSimplePDF(formSubmission);
    
    return new NextResponse(new Uint8Array(pdfContent), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${formSubmission.form.title}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}

// Simple PDF generation placeholder
function generateSimplePDF(formSubmission: any): Buffer {
  // This is a placeholder - in a real implementation you would:
  // 1. Use puppeteer to render the form component to PDF
  // 2. Or use a PDF library like jsPDF with proper form rendering
  // 3. Include the signature if present
  
  const pdfContent = `
    Form: ${formSubmission.form.title}
    Client: ${formSubmission.client.name}
    Email: ${formSubmission.client.email}
    
    Form Data:
    ${JSON.stringify(formSubmission.data, null, 2)}
    
    ${formSubmission.clientSignature ? 'Status: Signed' : 'Status: Not Signed'}
    ${formSubmission.clientSignedAt ? `Signed At: ${formSubmission.clientSignedAt}` : ''}
  `;
  
  // Return as buffer (this is just a text placeholder)
  return Buffer.from(pdfContent, 'utf-8');
}
