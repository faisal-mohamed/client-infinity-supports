// Email configuration types
export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  fromEmail: string;
  adminEmail: string;
  appName: string;
}

// Email notification types
export type EmailNotificationType = 'batch_completed' | 'test_email';

// Email notification data structure
export interface EmailNotificationData {
  type: EmailNotificationType;
  clientId?: number;
  clientName?: string;
  batchId?: number;
  formsCount?: number;
  completedForms?: Array<{
    id: number;
    formId: number;
    title: string;
  }>;
}

// Email sending result
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Email attachment structure
export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

// Email sending options
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}
