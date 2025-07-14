import { NextRequest, NextResponse } from "next/server";
import { sendEmail, getEmailConfig, testEmailConnection } from "@/lib/email";
import { generatePDFBuffer, generateMultiplePDFBuffers } from "@/lib/pdf-buffer";
import { 
  generateBatchCompletionEmailSimple, 
  generateTestEmailSimple,
  BatchCompletionEmailData 
} from "@/lib/email-templates-simple";
import { 
  generateClientConfirmationEmail, 
  generateClientTestEmail,
  ClientEmailData 
} from "@/lib/email-templates-client";

// Email notification types
type EmailNotificationType = 'batch_completed' | 'test_email' | 'client_confirmation' | 'client_test' | 'dual_notification';

interface EmailNotificationData {
  type: EmailNotificationType;
  clientId?: number;
  clientName?: string;
  clientEmail?: string;
  batchId?: number;
  completedForms?: Array<{
    id: number;
    formId: number;
    title: string;
  }>;
  completedAt?: string;
  // New field to control who gets the email
  sendToAdmin?: boolean;
  sendToClient?: boolean;
}

/**
 * POST /api/notifications/send-email
 * Send email notifications with professional templates and PDF attachments
 */
export async function POST(req: NextRequest) {
  try {
    const data: EmailNotificationData = await req.json();
    const { type } = data;

    console.log(`📧 Email notification request:`, { type, clientName: data.clientName });

    // Validate request data
    if (!type) {
      return NextResponse.json(
        { error: "Email notification type is required" },
        { status: 400 }
      );
    }

    // Get email configuration
    let emailConfig;
    try {
      emailConfig = await getEmailConfig();
    } catch (configError) {
      console.error('Email configuration error:', configError);
      return NextResponse.json(
        { 
          error: "Email not configured", 
          details: configError instanceof Error ? configError.message : "Unknown configuration error"
        },
        { status: 500 }
      );
    }

    // Handle different email types
    let emailResult;
    
    switch (type) {
      case 'batch_completed':
        emailResult = await handleBatchCompletedEmail(data, emailConfig);
        break;
        
      case 'test_email':
        emailResult = await handleTestEmail(emailConfig);
        break;
        
      case 'client_confirmation':
        emailResult = await handleClientConfirmationEmail(data, emailConfig);
        break;
        
      case 'client_test':
        emailResult = await handleClientTestEmail(data, emailConfig);
        break;
        
      case 'dual_notification':
        emailResult = await handleDualNotificationEmail(data, emailConfig);
        break;
        
      default:
        return NextResponse.json(
          { error: `Unknown email notification type: ${type}` },
          { status: 400 }
        );
    }

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: emailResult.messageId,
        type,
        attachments: emailResult.attachments || 0
      });
    } else {
      return NextResponse.json(
        { 
          error: "Failed to send email", 
          details: emailResult.error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email notification endpoint error:', error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Handle batch completion email with PDF attachments
 */
async function handleBatchCompletedEmail(
  data: EmailNotificationData, 
  config: any
) {
  const { clientName, batchId, completedForms, completedAt } = data;

  if (!clientName || !completedForms || completedForms.length === 0) {
    throw new Error("Client name and completed forms are required for batch completion email");
  }

  console.log(`📧 Generating batch completion email for ${clientName} (${completedForms.length} forms)`);

  // Generate beautiful email template (without Mailgen)
  const emailHtml = await generateBatchCompletionEmailSimple({
    clientName,
    batchId: batchId || 0,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });

  // Generate PDF attachments for all completed forms
  console.log(`📄 Generating ${completedForms.length} PDF attachments...`);
  const pdfResults = await generateMultiplePDFBuffers(completedForms);
  
  // Filter successful PDFs and create attachments
  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: 'application/pdf'
    }));

  const failedPDFs = pdfResults.filter(result => !result.success);
  
  // Detailed logging
  console.log(`📊 PDF Generation Results:`);
  console.log(`  - Total forms: ${completedForms.length}`);
  console.log(`  - Successful PDFs: ${attachments.length}`);
  console.log(`  - Failed PDFs: ${failedPDFs.length}`);
  console.log(`  - Total attachment size: ${attachments.reduce((sum, att) => sum + att.content.length, 0)} bytes`);
  
  if (failedPDFs.length > 0) {
    console.warn(`⚠️ Failed to generate ${failedPDFs.length} PDF(s):`, failedPDFs.map(f => `${f.filename}: ${f.error}`));
  }

  if (attachments.length === 0) {
    console.error(`❌ No PDF attachments generated! This means no PDFs will be attached to the email.`);
  } else {
    console.log(`📎 Attaching ${attachments.length} PDF files to email:`);
    attachments.forEach(att => {
      console.log(`  - ${att.filename} (${att.content.length} bytes)`);
    });
  }

  const subject = `Forms Completed - ${clientName} (${completedForms.length} forms)`;

  const result = await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    attachments
  });

  return {
    ...result,
    attachments: attachments.length
  };
}

/**
 * Handle test email with beautiful template
 */
async function handleTestEmail(config: any) {
  console.log(`📧 Generating test email with custom HTML template`);

  const emailHtml = await generateTestEmailSimple();
  const subject = `Email System Test - ${config.appName}`;

  return await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml
  });
}

/**
 * Handle client confirmation email
 */
async function handleClientConfirmationEmail(
  data: EmailNotificationData, 
  config: any
) {
  const { clientName, clientEmail, completedForms, completedAt } = data;

  if (!clientName || !clientEmail || !completedForms || completedForms.length === 0) {
    throw new Error("Client name, email, and completed forms are required for client confirmation email");
  }

  console.log(`📧 Generating client confirmation email for ${clientName} (${completedForms.length} forms)`);

  // Generate client confirmation email template
  const emailHtml = await generateClientConfirmationEmail({
    clientName,
    clientEmail,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });

  // Generate PDF attachments for client's records
  console.log(`📄 Generating ${completedForms.length} PDF attachments for client...`);
  const pdfResults = await generateMultiplePDFBuffers(completedForms);
  
  // Filter successful PDFs and create attachments
  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: 'application/pdf'
    }));

  const failedPDFs = pdfResults.filter(result => !result.success);
  if (failedPDFs.length > 0) {
    console.warn(`⚠️ Failed to generate ${failedPDFs.length} PDF(s) for client:`, failedPDFs.map(f => f.filename));
  }

  console.log(`📎 Attaching ${attachments.length} PDF files to client email`);

  const subject = `Form Completion Confirmation - ${completedForms.length} form(s) completed`;

  const result = await sendEmail({
    to: clientEmail,
    subject,
    html: emailHtml,
    attachments
  });

  return {
    ...result,
    attachments: attachments.length,
    recipient: 'client'
  };
}

/**
 * Handle client test email
 */
async function handleClientTestEmail(data: EmailNotificationData, config: any) {
  console.log(`📧 Generating client test email`);

  const emailHtml = await generateClientTestEmail(data.clientName || 'Test Client');
  const subject = `Client Email Test - ${config.appName}`;

  return await sendEmail({
    to: data.clientEmail || config.adminEmail, // Fallback to admin email for testing
    subject,
    html: emailHtml
  });
}

/**
 * Handle dual notification (both admin and client) - SIMPLIFIED
 */
async function handleDualNotificationEmail(
  data: EmailNotificationData, 
  config: any
) {
  const { clientName, clientEmail, completedForms } = data;

  console.log(`📧 DUAL NOTIFICATION START for ${clientName}`);
  console.log(`📧 Admin email: ${config.adminEmail}`);
  console.log(`📧 Client email: ${clientEmail}`);

  if (!clientName || !clientEmail || !completedForms || completedForms.length === 0) {
    console.error(`❌ Missing data for dual notification:`, { clientName, clientEmail, formsCount: completedForms?.length });
    throw new Error("Missing required data for dual notification");
  }

  try {
    // Step 1: Send admin email
    console.log(`📧 Step 1: Sending admin email...`);
    const adminResult = await handleBatchCompletedEmail(data, config);
    console.log(`📧 Admin result:`, adminResult.success ? 'SUCCESS' : 'FAILED');

    // Step 2: Send client email  
    console.log(`📧 Step 2: Sending client email...`);
    const clientResult = await handleClientConfirmationEmail(data, config);
    console.log(`📧 Client result:`, clientResult.success ? 'SUCCESS' : 'FAILED');

    const result = {
      success: adminResult.success && clientResult.success,
      adminEmail: {
        success: adminResult.success,
        messageId: adminResult.messageId,
        error: adminResult.error
      },
      clientEmail: {
        success: clientResult.success,
        messageId: clientResult.messageId,
        error: clientResult.error
      },
      totalEmails: 2
    };

    console.log(`📧 DUAL NOTIFICATION COMPLETE:`, {
      adminSuccess: adminResult.success,
      clientSuccess: clientResult.success,
      overallSuccess: result.success
    });

    return result;

  } catch (error) {
    console.error(`❌ DUAL NOTIFICATION FAILED:`, error);
    throw error;
  }
}

/**
 * GET /api/notifications/send-email
 * Test email configuration
 */
export async function GET() {
  try {
    const connectionTest = await testEmailConnection();
    
    if (connectionTest.success) {
      return NextResponse.json({
        success: true,
        message: connectionTest.message,
        status: "Email configuration is valid"
      });
    } else {
      return NextResponse.json(
        { 
          error: "Email configuration test failed", 
          details: connectionTest.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Failed to test email configuration", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
