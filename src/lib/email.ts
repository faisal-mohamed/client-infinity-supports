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

export async function getEmailConfig(adminId : number): Promise<EmailConfig> {
  try {
  

    const emailSettings = await getMultipleSettingsFromDB([
      'smtp_host',
      'smtp_port', 
      'from_email',
      'smtp_password',
      'admin_email',
      'app_name'
    ], adminId);

    const {
      smtp_host: host,
      smtp_port: port,
      from_email: fromEmail,
      smtp_password: password,
      admin_email: adminEmail,
      app_name: appName
    } = emailSettings;

    if (!host) throw new Error('SMTP Host (smtp_host) is not configured');
    if (!fromEmail) throw new Error('From Email (from_email) is not configured');
    if (!password) throw new Error('SMTP Password (smtp_password) is not configured');
    if (!adminEmail) throw new Error('Admin Email (admin_email) is not configured');

    const config: EmailConfig = {
      host,
      port: parseInt(port || '587'),
      user: fromEmail,
      password,
      fromEmail,
      adminEmail,
      appName: appName || 'Infinity Support Portal'
    };

    return config;
  } catch (error) {
    console.error('Failed to get email configuration:', error);
    throw new Error(`Email configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


/**
 * Create and configure Nodemailer transporter
 */
export async function createEmailTransporter(adminId : number) {
  const config = await getEmailConfig(adminId);

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
  try {
    const config = await getEmailConfig(adminId);
    const transporter = await createEmailTransporter(adminId);

    const mailOptions = {
      from: `"${config.appName}" <${config.fromEmail}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      attachments
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to ${mailOptions.to}:`, result.messageId);
    
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
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
