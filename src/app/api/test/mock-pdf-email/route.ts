import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

/**
 * Test email with mock PDF attachment to isolate attachment issues
 * POST /api/test/mock-pdf-email
 */
export async function POST(req: NextRequest) {
  try {
    console.log(`🧪 Testing email with mock PDF attachment...`);

    // Create a simple mock PDF buffer
    const mockPDFContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Hello World - Test PDF) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;

    const mockPDFBuffer = Buffer.from(mockPDFContent);
    
    console.log(`📄 Created mock PDF buffer: ${mockPDFBuffer.length} bytes`);

    // Create attachment
    const attachment = {
      filename: 'test-mock.pdf',
      content: mockPDFBuffer,
      contentType: 'application/pdf'
    };

    console.log(`📎 Attachment details:`, {
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.content.length,
      hasContent: attachment.content.length > 0
    });

    // Send email with mock attachment
    const emailResult = await sendEmail({
      to: 'stigmataclousecaws@gmail.com', // Your email
      subject: 'Test Email with Mock PDF Attachment',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Mock PDF Attachment Test</h2>
          <p>This email should have a mock PDF attached.</p>
          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Attachment Details:</h3>
            <ul>
              <li><strong>Filename:</strong> ${attachment.filename}</li>
              <li><strong>Size:</strong> ${attachment.content.length} bytes</li>
              <li><strong>Type:</strong> ${attachment.contentType}</li>
            </ul>
          </div>
          <p><strong>If you can see and download the PDF attachment, then the email attachment system is working correctly!</strong></p>
        </div>
      `,
      attachments: [attachment]
    });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Mock PDF email sent successfully!",
        details: {
          messageId: emailResult.messageId,
          attachmentSize: attachment.content.length,
          attachmentFilename: attachment.filename
        },
        instructions: "Check your email inbox for the test email with PDF attachment"
      });
    } else {
      return NextResponse.json(
        { 
          error: "Failed to send mock PDF email", 
          details: emailResult.error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Mock PDF email test failed:', error);
    return NextResponse.json(
      { 
        error: "Mock PDF test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
