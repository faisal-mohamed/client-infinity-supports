import { NextRequest, NextResponse } from "next/server";
import { sendEmail, getEmailConfig, testEmailConnection } from "@/lib/email";
import { generateMultiplePDFBuffers } from "@/lib/pdf-buffer";
import { generateMultipleStaffPDFBuffers } from "@/lib/pdf-buffer-staff";
import {
  generateBatchCompletionEmailSimple,
  generateTestEmailSimple
} from "@/lib/email-templates-simple";
import {
  generateClientConfirmationEmail,
  generateClientTestEmail
} from "@/lib/email-templates-client";
import {
  generateStaffConfirmationEmail,
  generateStaffTestEmail
} from "@/lib/email-templates-staff";

// Email notification types
type EmailNotificationType =
  | "batch_completed"
  | "test_email"
  | "client_confirmation"
  | "client_test"
  | "dual_notification"
  | "staff_batch_completed"
  | "staff_confirmation"
  | "staff_test";

interface EmailNotificationData {
  type: EmailNotificationType;
  clientId?: number;
  clientName?: string;
  clientEmail?: string;
  staffId?: number;
  staffName?: string;
  staffEmail?: string;
  batchId?: number;
  completedForms?: Array<{
    id: number;
    formId: number;
    title: string;
    formKey?: string; // Optional formKey for staff PDF generation
  }>;
  completedAt?: string;
  sendToAdmin?: boolean;
  sendToClient?: boolean;
}

// Staff email handler functions (defined before POST to avoid TypeScript errors)
async function handleStaffBatchCompletedEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'staff') {
  console.log(`📨📨 [STAFF DUAL EMAIL] Starting DUAL notification (Admin + Staff)`, {
    staffName: data.staffName,
    staffEmail: data.staffEmail,
    staffId: data.staffId,
    adminEmail: config.adminEmail,
    adminId,
    emailType,
    formsCount: data.completedForms?.length,
    batchId: data.batchId
  });

  const { staffName, staffEmail, completedForms } = data;

  console.log(`🔍 [STAFF DUAL EMAIL] Data validation:`, {
    hasStaffName: !!staffName,
    hasStaffEmail: !!staffEmail,
    hasCompletedForms: !!completedForms,
    formsCount: completedForms?.length || 0,
    staffName,
    staffEmail
  });

  if (!staffName || !staffEmail || !completedForms || completedForms.length === 0) {
    console.error(`❌ [STAFF DUAL EMAIL] Missing required data:`, {
      staffName: staffName ? '✅' : '❌ MISSING',
      staffEmail: staffEmail ? '✅' : '❌ MISSING',
      completedForms: completedForms?.length || 0
    });
    throw new Error("Missing required data for staff dual notification");
  }

  // Send email to ADMIN
  console.log(`📧 [STAFF DUAL EMAIL] Step 1: Sending email to ADMIN (${config.adminEmail})...`);
  console.log(`🔍 [STAFF DUAL EMAIL] Admin email config:`, {
    adminEmail: config.adminEmail,
    adminId,
    emailType,
    fromEmail: config.fromEmail
  });
  const adminResult = await handleStaffAdminEmail(data, config, adminId, emailType);
  console.log(`${adminResult.success ? '✅' : '❌'} [STAFF DUAL EMAIL] Admin email ${adminResult.success ? 'SUCCESS' : 'FAILED'}:`, {
    success: adminResult.success,
    messageId: adminResult.messageId,
    error: adminResult.error
  });

  // Send email to STAFF
  console.log(`📧 [STAFF DUAL EMAIL] Step 2: Sending email to STAFF (${staffEmail})...`);
  console.log(`🔍 [STAFF DUAL EMAIL] Staff email config:`, {
    staffEmail,
    adminId,
    emailType,
    fromEmail: config.fromEmail
  });
  const staffResult = await handleStaffConfirmationEmail(data, config, adminId, emailType);
  console.log(`${staffResult.success ? '✅' : '❌'} [STAFF DUAL EMAIL] Staff email ${staffResult.success ? 'SUCCESS' : 'FAILED'}:`, {
    success: staffResult.success,
    messageId: staffResult.messageId,
    error: staffResult.error
  });

  const bothSuccess = adminResult.success && staffResult.success;
  
  console.log(`📊 [STAFF DUAL EMAIL] DUAL notification complete:`, {
    overall: bothSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL/FAILED',
    admin: adminResult.success ? '✅ Sent' : '❌ Failed',
    staff: staffResult.success ? '✅ Sent' : '❌ Failed'
  });

  return {
    success: bothSuccess,
    messageId: bothSuccess ? `${adminResult.messageId}, ${staffResult.messageId}` : undefined,
    error: bothSuccess ? undefined : `Admin: ${adminResult.error || 'OK'}, Staff: ${staffResult.error || 'OK'}`,
    adminResult,
    staffResult
  };
}

async function handleStaffAdminEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'staff') {
  console.log(`📨 [STAFF ADMIN EMAIL] Starting staff admin notification`, {
    staffName: data.staffName,
    batchId: data.batchId,
    formsCount: data.completedForms?.length,
    adminEmail: config.adminEmail
  });

  const { staffName, batchId, completedForms, completedAt } = data;

  if (!staffName || !completedForms || completedForms.length === 0) {
    console.error(`❌ [STAFF ADMIN EMAIL] Missing required data:`, {
      staffName: staffName ? '✅' : '❌ MISSING',
      completedForms: completedForms?.length || 0
    });
    throw new Error("Staff name and completed forms are required");
  }

  console.log(`📝 [STAFF ADMIN EMAIL] Generating email HTML...`);
  const emailHtml = await generateBatchCompletionEmailSimple({
    clientName: staffName, // Reuse client template with staff name
    batchId: batchId || 0,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });
  console.log(`✅ [STAFF ADMIN EMAIL] Email HTML generated`);

  console.log(`📎 [STAFF ADMIN EMAIL] Generating ${completedForms.length} PDF(s) with adminId: ${adminId}...`);
  // Use staff-specific PDF generation function
  const pdfResults = await generateMultipleStaffPDFBuffers(completedForms, adminId);

  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: "application/pdf"
    }));

  console.log(`✅ [STAFF ADMIN EMAIL] PDFs generated:`, {
    requested: completedForms.length,
    successful: attachments.length,
    failed: pdfResults.filter(r => !r.success).length,
    totalSize: `${(attachments.reduce((sum, a) => sum + a.content.length, 0) / 1024).toFixed(2)} KB`
  });

  const subject = `Staff Forms Completed - ${staffName} (${completedForms.length} forms)`;

  console.log(`📧 [STAFF ADMIN EMAIL] Sending email to admin: ${config.adminEmail}`);
  const result = await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    attachments,
    adminId: adminId,
    emailType: emailType
  });

  if (result.success) {
    console.log(`✅ [STAFF ADMIN EMAIL] Successfully sent to admin!`, {
      to: config.adminEmail,
      messageId: result.messageId
    });
  } else {
    console.error(`❌ [STAFF ADMIN EMAIL] Failed to send to admin!`, {
      to: config.adminEmail,
      error: result.error
    });
  }

  return {
    ...result,
    attachments: attachments.length
  };
}

async function handleStaffConfirmationEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'staff') {
  console.log(`📨 [STAFF EMAIL] Starting staff confirmation`, {
    staffName: data.staffName,
    staffEmail: data.staffEmail,
    formsCount: data.completedForms?.length
  });

  const { staffName, staffEmail, completedForms, completedAt } = data;

  if (!staffName || !staffEmail || !completedForms || completedForms.length === 0) {
    console.error(`❌ [STAFF EMAIL] Missing required data:`, {
      staffName: staffName ? '✅' : '❌ MISSING',
      staffEmail: staffEmail ? '✅' : '❌ MISSING',
      completedForms: completedForms?.length || 0
    });
    throw new Error("Staff name, email, and completed forms are required");
  }

  console.log(`📝 [STAFF EMAIL] Generating email HTML...`);
  const emailHtml = await generateStaffConfirmationEmail({
    staffName,
    staffEmail,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });
  console.log(`✅ [STAFF EMAIL] Email HTML generated`);

  console.log(`📎 [STAFF EMAIL] Generating ${completedForms.length} PDF(s) with adminId: ${adminId}...`);
  // Use staff-specific PDF generation function
  const pdfResults = await generateMultipleStaffPDFBuffers(completedForms, adminId);

  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: "application/pdf"
    }));

  console.log(`✅ [STAFF EMAIL] PDFs generated:`, {
    requested: completedForms.length,
    successful: attachments.length,
    failed: pdfResults.filter(r => !r.success).length,
    totalSize: `${(attachments.reduce((sum, a) => sum + a.content.length, 0) / 1024).toFixed(2)} KB`
  });

  const subject = `Staff Form Completion Confirmation - ${completedForms.length} form(s) completed`;

  console.log(`📧 [STAFF EMAIL] Sending email to staff: ${staffEmail}`);
  const result = await sendEmail({
    to: staffEmail,
    subject,
    html: emailHtml,
    attachments,
    adminId: adminId,
    emailType: emailType
  });

  if (result.success) {
    console.log(`✅ [STAFF EMAIL] Successfully sent to staff!`, {
      to: staffEmail,
      messageId: result.messageId
    });
  } else {
    console.error(`❌ [STAFF EMAIL] Failed to send to staff!`, {
      to: staffEmail,
      error: result.error
    });
  }

  return {
    ...result,
    attachments: attachments.length,
    recipient: "staff"
  };
}

async function handleStaffTestEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'staff') {
  const emailHtml = await generateStaffTestEmail(data.staffName || "Test Staff");
  const subject = `Staff Email Test - ${config.appName}`;

  return await sendEmail({
    to: data.staffEmail || config.adminEmail,
    subject,
    html: emailHtml,
    adminId: adminId,
    emailType: emailType
  });
}

// export async function POST(req: NextRequest, context: { params: { adminId: string } }) {
//   // Await the params before accessing properties
//   const params = await context.params;
//   const adminIdParam: any = params.adminId;
//   const adminId = parseInt(adminIdParam, 10);

//   if (isNaN(adminId)) {
//     return NextResponse.json(
//       { error: "Invalid route parameter: adminId must be a number" },
//       { status: 400 }
//     );
//   }

//   try {
//     const data: EmailNotificationData = await req.json();
//     const { type } = data;

//     console.log(`📧 Email notification request from adminId=${adminId}`, {
//       type,
//       clientName: data.clientName
//     });

//     if (!type) {
//       return NextResponse.json(
//         { error: "Email notification type is required" },
//         { status: 400 }
//       );
//     }

//     let emailConfig;
//     try {
//       emailConfig = await getEmailConfig(adminIdParam);
//     } catch (configError) {
//       console.error("Email configuration error:", configError);
//       return NextResponse.json(
//         {
//           error: "Email not configured",
//           details:
//             configError instanceof Error
//               ? configError.message
//               : "Unknown configuration error"
//         },
//         { status: 500 }
//       );
//     }

//     let emailResult: any;

//     switch (type) {
//       case "batch_completed":
//         emailResult = await handleBatchCompletedEmail(data, emailConfig, adminIdParam);
//         break;
//       case "test_email":
//         emailResult = await handleTestEmail(emailConfig, adminIdParam);
//         break;
//       case "client_confirmation":
//         emailResult = await handleClientConfirmationEmail(data, emailConfig, adminIdParam);
//         break;
//       case "client_test":
//         emailResult = await handleClientTestEmail(data, emailConfig, adminIdParam);
//         break;
//       case "dual_notification":
//         emailResult = await handleDualNotificationEmail(data, emailConfig, adminIdParam);
//         break;
//       default:
//         return NextResponse.json(
//           { error: `Unknown email notification type: ${type}` },
//           { status: 400 }
//         );
//     }

//     if (emailResult.success) {
//       return NextResponse.json({
//         success: true,
//         message: "Email sent successfully",
//         messageId: emailResult.messageId,
//         type,
//         attachments: emailResult.attachments || 0
//       });
//     } else {
//       return NextResponse.json(
//         {
//           error: "Failed to send email",
//           details: emailResult.error
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Email notification endpoint error:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error"
//       },
//       { status: 500 }
//     );
//   }
// }


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ adminId: string }> }
) {
  // Await params to extract adminId
  const { adminId: adminIdParam } : any = await params;
  const adminId = parseInt(adminIdParam, 10);

  if (isNaN(adminId)) {
    return NextResponse.json(
      { error: "Invalid route parameter: adminId must be a number" },
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

    // Determine email type based on notification type
    const emailType: 'client' | 'staff' = 
      (type === 'staff_batch_completed' || type === 'staff_confirmation' || type === 'staff_test') 
        ? 'staff' 
        : 'client';
    
    console.log(`🔍 [SEND EMAIL ROUTE] Email notification request:`, {
      type,
      emailType,
      adminId: adminIdParam,
      hasStaffData: !!(data.staffId || data.staffName || data.staffEmail),
      hasClientData: !!(data.clientId || data.clientName || data.clientEmail)
    });
    
    let emailConfig;
    try {
      console.log(`🔍 [SEND EMAIL ROUTE] Fetching email config for adminId: ${adminIdParam}, emailType: ${emailType}`);
      emailConfig = await getEmailConfig(adminIdParam, emailType);
      console.log(`✅ [SEND EMAIL ROUTE] Email config retrieved:`, {
        host: emailConfig.host,
        port: emailConfig.port,
        fromEmail: emailConfig.fromEmail,
        adminEmail: emailConfig.adminEmail,
        appName: emailConfig.appName,
        hasPassword: !!emailConfig.password
      });
    } catch (configError) {
      console.error("❌ [SEND EMAIL ROUTE] Email configuration error:", {
        error: configError,
        message: configError instanceof Error ? configError.message : 'Unknown error',
        adminId: adminIdParam,
        emailType
      });
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
        emailResult = await handleBatchCompletedEmail(data, emailConfig, adminIdParam, emailType);
        break;
      case "test_email":
        emailResult = await handleTestEmail(emailConfig, adminIdParam, emailType);
        break;
      case "client_confirmation":
        emailResult = await handleClientConfirmationEmail(data, emailConfig, adminIdParam, emailType);
        break;
      case "client_test":
        emailResult = await handleClientTestEmail(data, emailConfig, adminIdParam, emailType);
        break;
      case "dual_notification":
        emailResult = await handleDualNotificationEmail(data, emailConfig, adminIdParam, emailType);
        break;
      case "staff_batch_completed":
        emailResult = await handleStaffBatchCompletedEmail(data, emailConfig, adminIdParam, emailType);
        break;
      case "staff_confirmation":
        emailResult = await handleStaffConfirmationEmail(data, emailConfig, adminIdParam, emailType);
        break;
      case "staff_test":
        emailResult = await handleStaffTestEmail(data, emailConfig, adminIdParam, emailType);
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
  // Await params before accessing adminId
  const { adminId } = await params;
  const adminIdNumber = parseInt(adminId, 10);

  if (isNaN(adminIdNumber)) {
    return NextResponse.json(
      { error: "Invalid route parameter: adminId must be a number" },
      { status: 400 }
    );
  }

  try {
    const connectionTest = await testEmailConnection(adminIdNumber);

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




// The rest of the email handler functions remain unchanged...


// Email handler functions (same as before)
async function handleBatchCompletedEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'client') {
  console.log(`📨 [ADMIN EMAIL] Starting admin notification`, {
    clientName: data.clientName,
    batchId: data.batchId,
    formsCount: data.completedForms?.length,
    adminEmail: config.adminEmail
  });

  const { clientName, batchId, completedForms, completedAt } = data;

  if (!clientName || !completedForms || completedForms.length === 0) {
    console.error(`❌ [ADMIN EMAIL] Missing required data:`, {
      clientName: clientName ? '✅' : '❌ MISSING',
      completedForms: completedForms?.length || 0
    });
    throw new Error("Client name and completed forms are required");
  }

  console.log(`📝 [ADMIN EMAIL] Generating email HTML...`);
  const emailHtml = await generateBatchCompletionEmailSimple({
    clientName,
    batchId: batchId || 0,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });
  console.log(`✅ [ADMIN EMAIL] Email HTML generated`);

  console.log(`📎 [ADMIN EMAIL] Generating ${completedForms.length} PDF(s) with adminId: ${adminId}...`);
  const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId);

  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: "application/pdf"
    }));

  console.log(`✅ [ADMIN EMAIL] PDFs generated:`, {
    requested: completedForms.length,
    successful: attachments.length,
    failed: pdfResults.filter(r => !r.success).length,
    totalSize: `${(attachments.reduce((sum, a) => sum + a.content.length, 0) / 1024).toFixed(2)} KB`
  });

  const subject = `Forms Completed - ${clientName} (${completedForms.length} forms)`;

  console.log(`📧 [ADMIN EMAIL] Sending email to admin: ${config.adminEmail}`);
  const result = await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    attachments,
    adminId: adminId,
    emailType: emailType
  });

  if (result.success) {
    console.log(`✅ [ADMIN EMAIL] Successfully sent to admin!`, {
      to: config.adminEmail,
      messageId: result.messageId
    });
  } else {
    console.error(`❌ [ADMIN EMAIL] Failed to send to admin!`, {
      to: config.adminEmail,
      error: result.error
    });
  }

  return {
    ...result,
    attachments: attachments.length
  };
}

async function handleTestEmail(config: any, adminId: any, emailType: 'client' | 'staff' = 'client') {
  const emailHtml = await generateTestEmailSimple();
  const subject = `Email System Test - ${config.appName}`;

  return await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    adminId: adminId,
    emailType: emailType
  });
}

async function handleClientConfirmationEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'client') {
  console.log(`📨 [CLIENT EMAIL] Starting client confirmation`, {
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    formsCount: data.completedForms?.length
  });

  const { clientName, clientEmail, completedForms, completedAt } = data;

  if (!clientName || !clientEmail || !completedForms || completedForms.length === 0) {
    console.error(`❌ [CLIENT EMAIL] Missing required data:`, {
      clientName: clientName ? '✅' : '❌ MISSING',
      clientEmail: clientEmail ? '✅' : '❌ MISSING',
      completedForms: completedForms?.length || 0
    });
    throw new Error("Client name, email, and completed forms are required");
  }

  console.log(`📝 [CLIENT EMAIL] Generating email HTML...`);
  const emailHtml = await generateClientConfirmationEmail({
    clientName,
    clientEmail,
    completedForms,
    completedAt: completedAt || new Date().toLocaleString()
  });
  console.log(`✅ [CLIENT EMAIL] Email HTML generated`);

  console.log(`📎 [CLIENT EMAIL] Generating ${completedForms.length} PDF(s) with adminId: ${adminId}...`);
  const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId);

  const attachments = pdfResults
    .filter(result => result.success && result.buffer)
    .map(result => ({
      filename: result.filename,
      content: result.buffer!,
      contentType: "application/pdf"
    }));

  console.log(`✅ [CLIENT EMAIL] PDFs generated:`, {
    requested: completedForms.length,
    successful: attachments.length,
    failed: pdfResults.filter(r => !r.success).length,
    totalSize: `${(attachments.reduce((sum, a) => sum + a.content.length, 0) / 1024).toFixed(2)} KB`
  });

  const subject = `Form Completion Confirmation - ${completedForms.length} form(s) completed`;

  console.log(`📧 [CLIENT EMAIL] Sending email to client: ${clientEmail}`);
  const result = await sendEmail({
    to: clientEmail,
    subject,
    html: emailHtml,
    attachments,
    adminId: adminId,
    emailType: emailType
  });

  if (result.success) {
    console.log(`✅ [CLIENT EMAIL] Successfully sent to client!`, {
      to: clientEmail,
      messageId: result.messageId
    });
  } else {
    console.error(`❌ [CLIENT EMAIL] Failed to send to client!`, {
      to: clientEmail,
      error: result.error
    });
  }

  return {
    ...result,
    attachments: attachments.length,
    recipient: "client"
  };
}

async function handleClientTestEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'client') {
  const emailHtml = await generateClientTestEmail(data.clientName || "Test Client");
  const subject = `Client Email Test - ${config.appName}`;

  return await sendEmail({
    to: data.clientEmail || config.adminEmail,
    subject,
    html: emailHtml,
    adminId: adminId,
    emailType: emailType
  });
}

async function handleDualNotificationEmail(data: EmailNotificationData, config: any, adminId: any, emailType: 'client' | 'staff' = 'client') {
  console.log(`📨📨 [DUAL EMAIL] Starting DUAL notification (Admin + Client)`, {
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    adminEmail: config.adminEmail,
    formsCount: data.completedForms?.length
  });

  const { clientName, clientEmail, completedForms } = data;

  if (!clientName || !clientEmail || !completedForms || completedForms.length === 0) {
    console.error(`❌ [DUAL EMAIL] Missing required data:`, {
      clientName: clientName ? '✅' : '❌ MISSING',
      clientEmail: clientEmail ? '✅' : '❌ MISSING',
      completedForms: completedForms?.length || 0
    });
    throw new Error("Missing required data for dual notification");
  }

  console.log(`📧 [DUAL EMAIL] Sending email to ADMIN (${config.adminEmail})...`);
  const adminResult = await handleBatchCompletedEmail(data, config, adminId, emailType);
  console.log(`${adminResult.success ? '✅' : '❌'} [DUAL EMAIL] Admin email ${adminResult.success ? 'SUCCESS' : 'FAILED'}`);

  console.log(`📧 [DUAL EMAIL] Sending email to CLIENT (${clientEmail})...`);
  const clientResult = await handleClientConfirmationEmail(data, config, adminId, emailType);
  console.log(`${clientResult.success ? '✅' : '❌'} [DUAL EMAIL] Client email ${clientResult.success ? 'SUCCESS' : 'FAILED'}`);

  const bothSuccess = adminResult.success && clientResult.success;
  
  console.log(`📊 [DUAL EMAIL] DUAL notification complete:`, {
    overall: bothSuccess ? '✅ SUCCESS' : '⚠️ PARTIAL/FAILED',
    admin: adminResult.success ? '✅ Sent' : '❌ Failed',
    client: clientResult.success ? '✅ Sent' : '❌ Failed',
    totalEmails: bothSuccess ? 2 : (adminResult.success || clientResult.success ? 1 : 0)
  });

  return {
    success: bothSuccess,
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

