import { NextRequest, NextResponse } from "next/server";
import { sendEmail, getEmailConfig, testEmailConnection } from "@/lib/email";
import { generateMultiplePDFBuffers } from "@/lib/pdf-buffer";
import {
  generateBatchCompletionEmailSimple,
  generateTestEmailSimple,
  generateStaffFormSubmittedEmail
} from "@/lib/email-templates-simple";
import {
  generateClientConfirmationEmail,
  generateClientTestEmail
} from "@/lib/email-templates-client";

type EmailNotificationType =
  | "batch_completed"
  | "test_email"
  | "client_confirmation"
  | "client_test"
  | "dual_notification"
  | "staff_form_submitted";

interface EmailNotificationData {
  type: EmailNotificationType;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  batchId?: string;
  completedForms?: Array<{
    id: string;
    formId: string;
    title: string;
  }>;
  completedAt?: string;
  sendToAdmin?: boolean;
  sendToClient?: boolean;
  staffName?: string;
  formTitle?: string;
  formId?: string;
  formSubmissionId?: string;
  submittedAt?: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ adminId: string }> }
) {
  const { adminId } = await params;

  if (!adminId) {
    return NextResponse.json(
      { error: "Invalid route parameter: adminId is required" },
      { status: 400 }
    );
  }

  try {
    const data: EmailNotificationData = await req.json();
    const { type } = data;

    console.log(`📧 Email notification request from adminId=${adminId}`, {
      type,
      clientName: data.clientName
    });

    if (!type) {
      return NextResponse.json(
        { error: "Email notification type is required" },
        { status: 400 }
      );
    }

    let emailConfig;
    try {
      emailConfig = await getEmailConfig(adminId);
    } catch (configError) {
      console.error("Email configuration error:", configError);
      return NextResponse.json(
        {
          error: "Email not configured",
          details: configError instanceof Error
            ? configError.message
            : "Unknown configuration error"
        },
        { status: 500 }
      );
    }

    let emailResult: any;

    switch (type) {
      case "batch_completed":
        emailResult = await handleBatchCompletedEmail(data, emailConfig, adminId);
        break;
      case "test_email":
        emailResult = await handleTestEmail(emailConfig, adminId);
        break;
      case "client_confirmation":
        emailResult = await handleClientConfirmationEmail(data, emailConfig, adminId);
        break;
      case "client_test":
        emailResult = await handleClientTestEmail(data, emailConfig, adminId);
        break;
      case "dual_notification":
        emailResult = await handleDualNotificationEmail(data, emailConfig, adminId);
        break;
      case "staff_form_submitted":
        emailResult = await handleStaffFormSubmittedEmail(data, emailConfig, adminId);
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
    console.error("Email notification endpoint error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ adminId: string }> }
) {
  const { adminId } = await params;

  if (!adminId) {
    return NextResponse.json(
      { error: "Invalid route parameter: adminId is required" },
      { status: 400 }
    );
  }

  try {
    const connectionTest = await testEmailConnection(adminId);

    if (connectionTest.success) {
      return NextResponse.json({
        success: true,
        message: connectionTest.message,
        status: "Email configuration is valid"
      });
    } else {
      return NextResponse.json(
        { error: "Email configuration test failed", details: connectionTest.message },
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

async function handleBatchCompletedEmail(data: EmailNotificationData, config: any, adminId: string) {
  const { clientName, batchId, completedForms, completedAt } = data;

  if (!clientName || !completedForms || completedForms.length === 0) {
    throw new Error("Client name and completed forms are required");
  }

  const emailHtml = await generateBatchCompletionEmailSimple({
    clientName,
    batchId: batchId || '0',
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });

  const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId);

  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: "application/pdf"
    }));

  const subject = `Forms Completed - ${clientName} (${completedForms.length} forms)`;

  const result = await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    attachments,
    adminId
  });

  return { ...result, attachments: attachments.length };
}

async function handleTestEmail(config: any, adminId: string) {
  const emailHtml = await generateTestEmailSimple();
  const subject = `Email System Test - ${config.appName}`;

  return await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    adminId
  });
}

async function handleClientConfirmationEmail(data: EmailNotificationData, config: any, adminId: string) {
  const { clientName, clientEmail, completedForms, completedAt } = data;

  if (!clientName || !clientEmail || !completedForms || completedForms.length === 0) {
    throw new Error("Client name, email, and completed forms are required");
  }

  const emailHtml = await generateClientConfirmationEmail({
    clientName,
    clientEmail,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });

  const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId);

  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: "application/pdf"
    }));

  const subject = `Form Completion Confirmation - ${completedForms.length} form(s) completed`;

  const result = await sendEmail({
    to: clientEmail,
    subject,
    html: emailHtml,
    attachments,
    adminId
  });

  return { ...result, attachments: attachments.length, recipient: "client" };
}

async function handleClientTestEmail(data: EmailNotificationData, config: any, adminId: string) {
  const emailHtml = await generateClientTestEmail(data.clientName || "Test Client");
  const subject = `Client Email Test - ${config.appName}`;

  return await sendEmail({
    to: data.clientEmail || config.adminEmail,
    subject,
    html: emailHtml,
    adminId
  });
}

async function handleDualNotificationEmail(data: EmailNotificationData, config: any, adminId: string) {
  const { clientName, clientEmail, completedForms } = data;

  if (!clientName || !clientEmail || !completedForms || completedForms.length === 0) {
    throw new Error("Missing required data for dual notification");
  }

  const adminResult = await handleBatchCompletedEmail(data, config, adminId);
  const clientResult = await handleClientConfirmationEmail(data, config, adminId);

  return {
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
}

async function handleStaffFormSubmittedEmail(data: EmailNotificationData, config: any, adminId: string) {
  const { clientName, staffName, formTitle, formId, formSubmissionId, submittedAt } = data;

  if (!clientName || !formTitle) {
    throw new Error("Client name and form title are required for staff submission notification");
  }

  const emailHtml = await generateStaffFormSubmittedEmail({
    clientName: clientName || 'Unknown Client',
    staffName: staffName || 'Support Worker',
    formTitle: formTitle || 'Unknown Form',
    formId: formId || '0',
    formSubmissionId: formSubmissionId || '0',
    submittedAt: submittedAt || new Date().toLocaleString()
  });

  const subject = `📋 Action Required: ${formTitle} - Staff Section Completed for ${clientName}`;

  return await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    adminId
  });
}
