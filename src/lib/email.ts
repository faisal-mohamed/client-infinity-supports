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

export async function getEmailConfig(adminId : number, emailType: 'client' | 'staff' = 'client'): Promise<EmailConfig> {
  try {
  
    console.log(`🔧 [EMAIL CONFIG] Fetching ${emailType} email configuration for adminId: ${adminId}`);
    console.log(`🔍 [EMAIL CONFIG] Configuration details:`, {
      adminId,
      emailType,
      settingPrefix: emailType === 'client' ? 'client_' : 'staff_'
    });
    
    // Use client or staff specific settings based on emailType
    const settingPrefix = emailType === 'client' ? 'client_' : 'staff_';
    const settingsKeys = [
      `${settingPrefix}smtp_host`,
      `${settingPrefix}smtp_port`, 
      `${settingPrefix}from_email`,
      `${settingPrefix}smtp_password`,
      `${settingPrefix}admin_email`,
      'app_name' // app_name is shared, no prefix needed
    ];
    
    console.log(`🔍 [EMAIL CONFIG] Requesting settings keys:`, settingsKeys);
    
    const emailSettings = await getMultipleSettingsFromDB(settingsKeys, adminId);

    console.log(`🔍 [EMAIL CONFIG] Raw settings retrieved:`, {
      keys: Object.keys(emailSettings),
      values: Object.keys(emailSettings).reduce((acc: any, key) => {
        if (key.includes('password')) {
          acc[key] = emailSettings[key] ? '***SET***' : 'MISSING';
        } else {
          acc[key] = emailSettings[key] || 'MISSING';
        }
        return acc;
      }, {})
    });

    // Map to generic keys for backward compatibility
    // For staff emails: try staff_* first, then fall back to generic (client) settings
    // For client emails: try client_* first, then fall back to generic settings
    let host = emailSettings[`${settingPrefix}smtp_host`] || emailSettings.smtp_host;
    let port = emailSettings[`${settingPrefix}smtp_port`] || emailSettings.smtp_port;
    let fromEmail = emailSettings[`${settingPrefix}from_email`] || emailSettings.from_email;
    let password = emailSettings[`${settingPrefix}smtp_password`] || emailSettings.smtp_password;
    let adminEmail = emailSettings[`${settingPrefix}admin_email`] || emailSettings.admin_email;
    const appName = emailSettings.app_name;

    // If staff email settings are missing, try to find from any admin that has them
    if (emailType === 'staff' && (!host || !fromEmail || !password || !adminEmail)) {
      console.log(`⚠️ [EMAIL CONFIG] Staff email settings incomplete for adminId ${adminId}, searching for any admin with staff email settings...`);
      
      // Try to find settings from any admin that has staff email configured
      // Query directly to find any admin with staff email settings
      const { prisma } = await import('@/lib/prisma');
      const fallbackSettingsQuery = await prisma.appSettings.findMany({
        where: {
          key: { in: ['staff_smtp_host', 'staff_smtp_port', 'staff_from_email', 'staff_smtp_password', 'staff_admin_email'] },
          isActive: true,
          value: { not: null },
        },
        orderBy: {
          adminId: 'desc', // Prefer admin-specific over global
        },
      });

      // Build fallback settings object (first non-null value for each key wins)
      const fallbackSettings: Record<string, string | null> = {};
      const processedKeys = new Set<string>();
      for (const setting of fallbackSettingsQuery) {
        if (!processedKeys.has(setting.key) && setting.value) {
          fallbackSettings[setting.key] = setting.value;
          processedKeys.add(setting.key);
          console.log(`🔍 [EMAIL CONFIG] Found fallback ${setting.key} from adminId: ${setting.adminId}`);
        }
      }

      // Use fallback settings if they exist and current ones are missing
      if (!host && fallbackSettings.staff_smtp_host) {
        host = fallbackSettings.staff_smtp_host;
        console.log(`✅ [EMAIL CONFIG] Using fallback staff_smtp_host from another admin`);
      }
      if (!port && fallbackSettings.staff_smtp_port) {
        port = fallbackSettings.staff_smtp_port;
        console.log(`✅ [EMAIL CONFIG] Using fallback staff_smtp_port from another admin`);
      }
      if (!fromEmail && fallbackSettings.staff_from_email) {
        fromEmail = fallbackSettings.staff_from_email;
        console.log(`✅ [EMAIL CONFIG] Using fallback staff_from_email from another admin`);
      }
      if (!password && fallbackSettings.staff_smtp_password) {
        password = fallbackSettings.staff_smtp_password;
        console.log(`✅ [EMAIL CONFIG] Using fallback staff_smtp_password from another admin`);
      }
      if (!adminEmail && fallbackSettings.staff_admin_email) {
        adminEmail = fallbackSettings.staff_admin_email;
        console.log(`✅ [EMAIL CONFIG] Using fallback staff_admin_email from another admin`);
      }

      // If still missing, try generic (client) settings as last resort
      if (!host || !fromEmail || !password || !adminEmail) {
        console.log(`⚠️ [EMAIL CONFIG] Still missing staff email settings, trying generic (client) settings as last resort...`);
        const genericSettings = await getMultipleSettingsFromDB([
      'smtp_host',
      'smtp_port', 
      'from_email',
      'smtp_password',
      'admin_email',
    ], adminId);

        if (!host && genericSettings.smtp_host) {
          host = genericSettings.smtp_host;
          console.log(`✅ [EMAIL CONFIG] Using generic smtp_host as last resort`);
        }
        if (!port && genericSettings.smtp_port) {
          port = genericSettings.smtp_port;
          console.log(`✅ [EMAIL CONFIG] Using generic smtp_port as last resort`);
        }
        if (!fromEmail && genericSettings.from_email) {
          fromEmail = genericSettings.from_email;
          console.log(`✅ [EMAIL CONFIG] Using generic from_email as last resort`);
        }
        if (!password && genericSettings.smtp_password) {
          password = genericSettings.smtp_password;
          console.log(`✅ [EMAIL CONFIG] Using generic smtp_password as last resort`);
        }
        if (!adminEmail && genericSettings.admin_email) {
          adminEmail = genericSettings.admin_email;
          console.log(`✅ [EMAIL CONFIG] Using generic admin_email as last resort`);
        }
      }
    }

    console.log(`🔍 [EMAIL CONFIG] Mapped settings (with fallback):`, {
      host: host || 'MISSING',
      port: port || 'MISSING (will default to 587)',
      fromEmail: fromEmail || 'MISSING',
      password: password ? '***SET***' : 'MISSING',
      adminEmail: adminEmail || 'MISSING',
      appName: appName || 'MISSING (will use default)',
      source: {
        host: host ? (emailSettings[`${settingPrefix}smtp_host`] ? `${settingPrefix}smtp_host` : 'smtp_host (fallback)') : 'NONE',
        fromEmail: fromEmail ? (emailSettings[`${settingPrefix}from_email`] ? `${settingPrefix}from_email` : 'from_email (fallback)') : 'NONE',
        adminEmail: adminEmail ? (emailSettings[`${settingPrefix}admin_email`] ? `${settingPrefix}admin_email` : 'admin_email (fallback)') : 'NONE'
      }
    });

    console.log(`📋 [EMAIL CONFIG] ${emailType.toUpperCase()} Settings retrieved:`, {
      smtp_host: host ? `✅ ${host}` : '❌ MISSING',
      smtp_port: port || 'Not set (will default to 587)',
      from_email: fromEmail ? `✅ ${fromEmail}` : '❌ MISSING',
      smtp_password: password ? '✅ Set (***hidden***)' : '❌ MISSING - Need App Password for Gmail',
      admin_email: adminEmail ? `✅ ${adminEmail}` : '❌ MISSING',
      app_name: appName || 'Not set (will use default "Infinity Support Portal")'
    });

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
export async function createEmailTransporter(adminId : number, emailType: 'client' | 'staff' = 'client') {
  console.log(`🔌 [EMAIL TRANSPORTER] Creating transporter for adminId: ${adminId}, emailType: ${emailType}`);
  
  const config = await getEmailConfig(adminId, emailType);

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
export async function testEmailConnection(adminId : number): Promise<{ success: boolean; message: string }> {
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
  adminId,
  emailType = 'client'
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
  emailType?: 'client' | 'staff';
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const recipientList = Array.isArray(to) ? to.join(', ') : to;
  
  try {
    console.log(`📧 [SEND EMAIL] ========== STARTING EMAIL SEND ==========`);
    console.log(`📧 [SEND EMAIL] Email details:`, {
      emailType,
      adminId,
      recipients: recipientList,
      subject,
      attachmentCount: attachments.length,
      attachmentSizes: attachments.map(a => `${a.filename}: ${(a.content.length / 1024).toFixed(2)} KB`)
    });
    
    console.log(`🔍 [SEND EMAIL] Step 1: Fetching email configuration...`);
    const config = await getEmailConfig(adminId, emailType);
    console.log(`✅ [SEND EMAIL] Config loaded successfully:`, {
      host: config.host,
      port: config.port,
      fromEmail: config.fromEmail,
      adminEmail: config.adminEmail,
      appName: config.appName,
      hasPassword: !!config.password
    });
    
    console.log(`🔍 [SEND EMAIL] Step 2: Creating email transporter...`);
    const transporter = await createEmailTransporter(adminId, emailType);
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

    console.log(`🔍 [SEND EMAIL] Step 3: Sending email via transporter...`);
    console.log(`🔍 [SEND EMAIL] Mail options:`, {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html,
      htmlLength: mailOptions.html?.length || 0,
      attachmentCount: mailOptions.attachments?.length || 0
    });

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ [SEND EMAIL] ========== EMAIL SENT SUCCESSFULLY ==========`);
    console.log(`✅ [SEND EMAIL] Result:`, {
      to: recipientList,
      messageId: result.messageId,
      subject: subject,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected
    });
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error(`❌ [SEND EMAIL] ========== EMAIL SEND FAILED ==========`);
    console.error(`❌ [SEND EMAIL] Error details:`, {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      emailType,
      adminId,
      recipients: recipientList,
      subject
    });
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
