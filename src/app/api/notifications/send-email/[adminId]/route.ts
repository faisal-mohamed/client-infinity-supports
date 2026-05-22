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

// Email notification types
type EmailNotificationType =
  | "batch_completed"
  | "test_email"
  | "client_confirmation"
  | "client_test"
  | "dual_notification"
  | "staff_form_submitted";

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
  sendToAdmin?: boolean;
  sendToClient?: boolean;
  // Staff form submitted specific fields
  staffName?: string;
  formTitle?: string;
  formId?: number;
  formSubmissionId?: number;
  submittedAt?: string;
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

    let emailConfig;
    try {
      emailConfig = await getEmailConfig(adminIdParam);
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
        emailResult = await handleBatchCompletedEmail(data, emailConfig, adminIdParam, req.nextUrl.origin);
        break;
      case "test_email":
        emailResult = await handleTestEmail(emailConfig, adminIdParam);
        break;
      case "client_confirmation":
        emailResult = await handleClientConfirmationEmail(data, emailConfig, adminIdParam, req.nextUrl.origin);
        break;
      case "client_test":
        emailResult = await handleClientTestEmail(data, emailConfig, adminIdParam);
        break;
      case "dual_notification":
        emailResult = await handleDualNotificationEmail(data, emailConfig, adminIdParam, req.nextUrl.origin);
        break;
      case "staff_form_submitted":
        emailResult = await handleStaffFormSubmittedEmail(data, emailConfig, adminIdParam);
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
async function handleBatchCompletedEmail(data: EmailNotificationData, config: any, adminId: any, origin?: string) {
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
  const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId, origin);

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
    adminId: adminId
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

async function handleTestEmail(config: any, adminId: any) {
  const emailHtml = await generateTestEmailSimple();
  const subject = `Email System Test - ${config.appName}`;

  return await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    adminId: adminId
  });
}

async function handleClientConfirmationEmail(data: EmailNotificationData, config: any, adminId: any, origin?: string) {
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
  const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId, origin);

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
    adminId: adminId
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

async function handleClientTestEmail(data: EmailNotificationData, config: any, adminId: any) {
  const emailHtml = await generateClientTestEmail(data.clientName || "Test Client");
  const subject = `Client Email Test - ${config.appName}`;

  return await sendEmail({
    to: data.clientEmail || config.adminEmail,
    subject,
    html: emailHtml,
    adminId: adminId
  });
}

async function handleDualNotificationEmail(data: EmailNotificationData, config: any, adminId: any, origin?: string) {
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
  const adminResult = await handleBatchCompletedEmail(data, config, adminId, origin);
  console.log(`${adminResult.success ? '✅' : '❌'} [DUAL EMAIL] Admin email ${adminResult.success ? 'SUCCESS' : 'FAILED'}`);

  console.log(`📧 [DUAL EMAIL] Sending email to CLIENT (${clientEmail})...`);
  const clientResult = await handleClientConfirmationEmail(data, config, adminId, origin);
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

/**
 * Handle staff form submitted notification email to admin
 * This is triggered when staff completes their part of a shared form (like Emergency Drill)
 */
async function handleStaffFormSubmittedEmail(data: EmailNotificationData, config: any, adminId: any) {
  console.log(`📨 [STAFF SUBMITTED] Starting staff form submission notification`, {
    clientName: data.clientName,
    staffName: data.staffName,
    formTitle: data.formTitle,
    adminEmail: config.adminEmail
  });

  const { clientName, staffName, formTitle, formId, formSubmissionId, submittedAt } = data;

  if (!clientName || !formTitle) {
    console.error(`❌ [STAFF SUBMITTED] Missing required data:`, {
      clientName: clientName ? '✅' : '❌ MISSING',
      formTitle: formTitle ? '✅' : '❌ MISSING'
    });
    throw new Error("Client name and form title are required for staff submission notification");
  }

  console.log(`📝 [STAFF SUBMITTED] Generating email HTML...`);
  const emailHtml = await generateStaffFormSubmittedEmail({
    clientName: clientName || 'Unknown Client',
    staffName: staffName || 'Support Worker',
    formTitle: formTitle || 'Unknown Form',
    formId: formId || 0,
    formSubmissionId: formSubmissionId || 0,
    submittedAt: submittedAt || new Date().toLocaleString()
  });
  console.log(`✅ [STAFF SUBMITTED] Email HTML generated`);

  const subject = `📋 Action Required: ${formTitle} - Staff Section Completed for ${clientName}`;

  console.log(`📧 [STAFF SUBMITTED] Sending email to admin: ${config.adminEmail}`);
  const result = await sendEmail({
    to: config.adminEmail,
    subject,
    html: emailHtml,
    adminId: adminId
  });

  if (result.success) {
    console.log(`✅ [STAFF SUBMITTED] Successfully sent to admin!`, {
      to: config.adminEmail,
      messageId: result.messageId,
      formTitle,
      clientName
    });
  } else {
    console.error(`❌ [STAFF SUBMITTED] Failed to send to admin!`, {
      to: config.adminEmail,
      error: result.error
    });
  }

  return result;
}
