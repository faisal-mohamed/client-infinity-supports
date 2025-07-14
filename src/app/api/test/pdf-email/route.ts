import { NextRequest, NextResponse } from "next/server";
import { generatePDFBuffer } from "@/lib/pdf-buffer";
import { sendEmail } from "@/lib/email";

/**
 * Test endpoint to verify PDF buffer generation and email attachment
 * POST /api/test/pdf-email
 */
export async function POST(req: NextRequest) {
  try {
    const { formSubmissionId, formId, testEmail } = await req.json();

    if (!formSubmissionId || !formId) {
      return NextResponse.json(
        { error: "formSubmissionId and formId are required" },
        { status: 400 }
      );
    }

    console.log(`🧪 Testing PDF buffer generation and email attachment`);
    console.log(`📄 Form Submission ID: ${formSubmissionId}, Form ID: ${formId}`);

    // Step 1: Generate PDF buffer
    const pdfResult = await generatePDFBuffer({
      formSubmissionId: parseInt(formSubmissionId),
      formId: parseInt(formId),
      filename: "Test_Form_Attachment.pdf"
    });

    if (!pdfResult.success) {
      return NextResponse.json(
        { 
          error: "PDF generation failed", 
          details: pdfResult.error 
        },
        { status: 500 }
      );
    }

    console.log(`✅ PDF buffer generated: ${pdfResult.filename} (${pdfResult.buffer?.length} bytes)`);

    // Step 2: Send test email with PDF attachment
    const emailResult = await sendEmail({
      to: testEmail || 'stigmataclousecaws@gmail.com', // Use provided email or default
      subject: 'Test Email with PDF Attachment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">PDF Attachment Test</h2>
          <p>This is a test email to verify PDF buffer generation and email attachment functionality.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Test Results:</h3>
            <ul>
              <li><strong>PDF Generated:</strong> ✅ ${pdfResult.filename}</li>
              <li><strong>File Size:</strong> ${pdfResult.buffer?.length} bytes</li>
              <li><strong>Form Submission ID:</strong> ${formSubmissionId}</li>
              <li><strong>Form ID:</strong> ${formId}</li>
            </ul>
          </div>
          
          <p>The PDF should be attached to this email. If you can see and open the attachment, the integration is working perfectly!</p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px;">
            <p style="margin: 0; color: #065f46;">
              <strong>✅ PDF Buffer Email Integration Test Successful!</strong>
            </p>
          </div>
        </div>
      `,
      attachments: pdfResult.buffer ? [{
        filename: pdfResult.filename!,
        content: pdfResult.buffer,
        contentType: 'application/pdf'
      }] : []
    });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Test email with PDF attachment sent successfully!",
        details: {
          pdfGenerated: true,
          pdfFilename: pdfResult.filename,
          pdfSize: pdfResult.buffer?.length,
          emailSent: true,
          messageId: emailResult.messageId,
          recipient: testEmail || 'stigmataclousecaws@gmail.com'
        }
      });
    } else {
      return NextResponse.json(
        { 
          error: "Email sending failed", 
          details: emailResult.error,
          pdfGenerated: true,
          pdfFilename: pdfResult.filename
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF email test error:', error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
