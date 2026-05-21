import nodemailer from 'nodemailer';
import { getSettingFromDB, getMultipleSettingsFromDB } from './settings-server';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  fromEmail: string;
  adminEmail: string;
  appName: string;
}

// Cache for email configuration to avoid repeated database calls
let emailConfigCache: EmailConfig | null = null;
let configCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get email configuration from settings
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getEmailConfig(adminId : string | number): Promise<EmailConfig> {
  try {
  
    console.log(`🔧 [EMAIL CONFIG] Fetching email configuration for adminId: ${adminId}`);
    const emailSettings = await getMultipleSettingsFromDB([
      'smtp_host',
      'smtp_port', 
      'from_email',
      'smtp_password',
      'admin_email',
      'app_name'
    ], adminId);

    console.log(`📋 [EMAIL CONFIG] Settings retrieved:`, {
      smtp_host: emailSettings.smtp_host ? `✅ ${emailSettings.smtp_host}` : '❌ MISSING',
      smtp_port: emailSettings.smtp_port || 'Not set (will default to 587)',
      from_email: emailSettings.from_email ? `✅ ${emailSettings.from_email}` : '❌ MISSING',
      smtp_password: emailSettings.smtp_password ? '✅ Set (***hidden***)' : '❌ MISSING - Need App Password for Gmail',
      admin_email: emailSettings.admin_email ? `✅ ${emailSettings.admin_email}` : '❌ MISSING',
      app_name: emailSettings.app_name || 'Not set (will use default "Infinity Support Portal")'
    });

    const {
      smtp_host: host,
      smtp_port: port,
      from_email: fromEmail,
      smtp_password: password,
      admin_email: adminEmail,
      app_name: appName
    } = emailSettings;

    // Detailed validation with specific error messages
    if (!host) {
      console.error('❌ [EMAIL CONFIG] SMTP Host is MISSING!');
      throw new Error('SMTP Host (smtp_host) is not configured. Set to: smtp.gmail.com');
    }
    if (!fromEmail) {
      console.error('❌ [EMAIL CONFIG] From Email is MISSING!');
      throw new Error('From Email (from_email) is not configured. Set to your Gmail address');
    }
    if (!password) {
      console.error('❌ [EMAIL CONFIG] SMTP Password is MISSING!');
      throw new Error('SMTP Password (smtp_password) is not configured. For Gmail, you MUST use App Password (not regular password). See: https://myaccount.google.com/apppasswords');
    }
    if (!adminEmail) {
      console.error('❌ [EMAIL CONFIG] Admin Email is MISSING!');
      throw new Error('Admin Email (admin_email) is not configured. Set where admin notifications should go');
    }

    const config: EmailConfig = {
      host,
      port: parseInt(port || '587'),
      user: fromEmail,
      password,
      fromEmail,
      adminEmail,
      appName: appName || 'Infinity Support Portal'
    };

    console.log(`✅ [EMAIL CONFIG] Configuration validated successfully for adminId ${adminId}:`, {
      host: config.host,
      port: config.port,
      fromEmail: config.fromEmail,
      adminEmail: config.adminEmail,
      appName: config.appName,
      secure: config.port === 465 ? 'SSL' : 'STARTTLS'
    });

    return config;
  } catch (error) {
    console.error(`❌ [EMAIL CONFIG] FAILED for adminId ${adminId}:`, error);
    throw new Error(`Email configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


/**
 * Create and configure Nodemailer transporter
 */
export async function createEmailTransporter(adminId : string | number) {
  console.log(`🔌 [EMAIL TRANSPORTER] Creating transporter for adminId: ${adminId}`);
  
  const config = await getEmailConfig(adminId);

  console.log(`📡 [EMAIL TRANSPORTER] Creating transporter with:`, {
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    user: config.fromEmail,
    auth_method: config.port === 465 ? 'SSL' : 'STARTTLS'
  });

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.fromEmail,
      pass: config.password,
    },
    // Additional options for better compatibility
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });

  console.log(`✅ [EMAIL TRANSPORTER] Transporter created successfully for adminId: ${adminId}`);
  return transporter;
}

/**
 * Test email configuration
 */
export async function testEmailConnection(adminId : string | number): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = await createEmailTransporter(adminId);
    await transporter.verify();
    
    return {
      success: true,
      message: 'Email configuration is valid and connection successful'
    };
  } catch (error) {
    console.error('Email connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown email connection error'
    };
  }
}

/**
 * Send email with attachments (original function)
 */
export async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
  adminId
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
  adminId: any;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipientList = Array.isArray(to) ? to.join(', ') : to;
  
  try {
    console.log(`📧 [SEND EMAIL] Starting email send for adminId: ${adminId}`);
    console.log(`📧 [SEND EMAIL] Recipients: ${recipientList}`);
    console.log(`📧 [SEND EMAIL] Subject: ${subject}`);
    console.log(`📧 [SEND EMAIL] Attachments: ${attachments.length} file(s)`);
    
    const config = await getEmailConfig(adminId);
    console.log(`✅ [SEND EMAIL] Config loaded successfully`);
    
    const transporter = await createEmailTransporter(adminId);
    console.log(`✅ [SEND EMAIL] Transporter created successfully`);

    const mailOptions = {
      from: `"${config.appName}" <${config.fromEmail}>`,
      to: recipientList,
      subject,
      html,
      attachments
    };

    console.log(`📤 [SEND EMAIL] Sending email...`, {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      attachmentCount: attachments.length,
      attachmentSizes: attachments.map(a => `${a.filename}: ${(a.content.length / 1024).toFixed(2)} KB`)
    });

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ [SEND EMAIL] Email sent successfully!`, {
      to: recipientList,
      messageId: result.messageId,
      subject: subject
    });
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error(`❌ [SEND EMAIL] FAILED to send email!`, {
      to: recipientList,
      subject: subject,
      adminId: adminId,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as any)?.code,
      errorCommand: (error as any)?.command,
      errorResponse: (error as any)?.response
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email sending error'
    };
  }
}

/**
 * Send email with retry logic and enhanced error handling
 */
export async function sendEmailWithRetry({
  to,
  subject,
  html,
  attachments = [],
  maxRetries = 3,
  retryDelay = 2000,
  adminId
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
  maxRetries?: number;
  retryDelay?: number;
 adminId: any 
}): Promise<{ success: boolean; messageId?: string; error?: string; attempts: number }> {
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${maxRetries} to: ${Array.isArray(to) ? to.join(', ') : to}`);
      
      const result = await sendEmail({ to, subject, html, attachments, adminId });
      
      if (result.success) {
        console.log(`✅ Email sent successfully on attempt ${attempt}`);
        return {
          success: true,
          messageId: result.messageId,
          attempts: attempt
        };
      } else {
        lastError = result.error || 'Unknown error';
        console.warn(`⚠️ Email attempt ${attempt} failed: ${lastError}`);
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Email attempt ${attempt} error:`, error);
    }
    
    // Wait before retry (except on last attempt)
    if (attempt < maxRetries) {
      console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 1.5; // Exponential backoff
    }
  }
  
  console.error(`❌ All ${maxRetries} email attempts failed. Last error: ${lastError}`);
  return {
    success: false,
    error: lastError,
    attempts: maxRetries
  };
}

/**
 * Clear email configuration cache (useful for testing or when settings change)
 */
export function clearEmailConfigCache(): void {
  emailConfigCache = null;
  configCacheTime = 0;
}
