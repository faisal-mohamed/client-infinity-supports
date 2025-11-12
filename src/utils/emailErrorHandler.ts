/**
 * Email Error Handler Utility
 * Provides user-friendly error messages for email sending failures
 */

export interface EmailErrorResult {
  title: string;
  message: string;
  duration: number;
  type: 'error' | 'warning' | 'info';
}

/**
 * Parse email error and return user-friendly message
 */
export function parseEmailError(errorMessage: string): EmailErrorResult {
  const lowerError = errorMessage.toLowerCase();

  // EAUTH - Authentication Failed (most common)
  if (lowerError.includes('eauth') || 
      lowerError.includes('username and password not accepted') ||
      lowerError.includes('invalid login') ||
      lowerError.includes('535')) {
    return {
      title: '🔐 Email Authentication Failed',
      message: 
        '❌ Gmail rejected the login credentials.\n\n' +
        '🔧 Common Causes:\n' +
        '• App Password is for a DIFFERENT Gmail account\n' +
        '• App Password was revoked or expired\n' +
        '• Using regular password instead of App Password\n' +
        '• 2-Factor Authentication is not enabled\n\n' +
        '✅ How to Fix:\n' +
        '1. Login to the CORRECT Gmail account\n' +
        '2. Enable 2-Factor Authentication (required!)\n' +
        '3. Go to: myaccount.google.com/apppasswords\n' +
        '4. Generate NEW App Password\n' +
        '5. Copy it WITHOUT spaces\n' +
        '6. Update in Settings → Email → SMTP App Password\n\n' +
        '💡 Tip: App Password must match the "From Email" account!',
      duration: 12000,
      type: 'error'
    };
  }

  // Missing Configuration
  if (lowerError.includes('not configured') || 
      lowerError.includes('is not configured') ||
      lowerError.includes('missing')) {
    return {
      title: '⚙️ Email Not Configured',
      message: 
        `❌ Email settings are incomplete.\n\n` +
        `${errorMessage}\n\n` +
        `✅ How to Fix:\n` +
        `1. Go to Settings → Email\n` +
        `2. Fill in all required fields (marked with *)\n` +
        `3. For Gmail:\n` +
        `   • SMTP Host: smtp.gmail.com\n` +
        `   • SMTP Port: 587\n` +
        `   • From Email: your-gmail@gmail.com\n` +
        `   • SMTP Password: App Password (16 chars)\n` +
        `   • Admin Email: where to receive notifications\n` +
        `4. Save and test connection`,
      duration: 10000,
      type: 'error'
    };
  }

  // Connection Failed
  if (lowerError.includes('econnection') || 
      lowerError.includes('etimedout') ||
      lowerError.includes('enotfound') ||
      lowerError.includes('connection') ||
      lowerError.includes('timeout')) {
    return {
      title: '🌐 Connection Failed',
      message: 
        '❌ Cannot connect to email server.\n\n' +
        '🔧 Possible Issues:\n' +
        '• SMTP Host is incorrect\n' +
        '• SMTP Port is wrong\n' +
        '• Firewall blocking connection\n' +
        '• No internet connection\n\n' +
        '✅ How to Fix:\n' +
        '1. Verify SMTP Host: smtp.gmail.com\n' +
        '2. Try port 587 (STARTTLS) or 465 (SSL)\n' +
        '3. Check internet connection\n' +
        '4. Check firewall/antivirus settings\n' +
        '5. Test connection in Settings → Email',
      duration: 10000,
      type: 'error'
    };
  }

  // Rate Limit / Quota Exceeded
  if (lowerError.includes('rate limit') || 
      lowerError.includes('quota') ||
      lowerError.includes('too many') ||
      lowerError.includes('daily limit')) {
    return {
      title: '⚠️ Email Limit Reached',
      message: 
        '⚠️ Gmail daily sending limit exceeded.\n\n' +
        '📊 Gmail Limits:\n' +
        '• Free accounts: 500 emails/day\n' +
        '• Workspace accounts: 2000 emails/day\n\n' +
        '✅ Solutions:\n' +
        '1. Wait 24 hours for limit to reset\n' +
        '2. Use a different Gmail account\n' +
        '3. Consider using SendGrid or AWS SES for higher limits',
      duration: 8000,
      type: 'warning'
    };
  }

  // Invalid Email Address
  if (lowerError.includes('invalid address') || 
      lowerError.includes('invalid email') ||
      lowerError.includes('emessage')) {
    return {
      title: '📧 Invalid Email Address',
      message: 
        '❌ One or more email addresses are invalid.\n\n' +
        '✅ How to Fix:\n' +
        '1. Check client email is correct\n' +
        '2. Check admin email is correct\n' +
        '3. Update invalid emails in client profile or settings',
      duration: 6000,
      type: 'error'
    };
  }

  // Attachment Too Large
  if (lowerError.includes('too large') || 
      lowerError.includes('size limit') ||
      lowerError.includes('attachment')) {
    return {
      title: '📎 Attachment Too Large',
      message: 
        '⚠️ Email attachments exceed size limit.\n\n' +
        '📊 Gmail Limits:\n' +
        '• Maximum: 25 MB per email\n\n' +
        '✅ Solutions:\n' +
        '1. Send fewer forms per email\n' +
        '2. Send forms in separate batches\n' +
        '3. Provide download link instead of attachments',
      duration: 8000,
      type: 'warning'
    };
  }

  // Generic Error
  return {
    title: '❌ Email Send Failed',
    message: 
      `An error occurred while sending email.\n\n` +
      `Error: ${errorMessage}\n\n` +
      `🔍 Troubleshooting:\n` +
      `1. Check Settings → Email configuration\n` +
      `2. Test email connection\n` +
      `3. Review console logs for details\n` +
      `4. Verify Gmail App Password is current\n\n` +
      `💡 Most common fix: Generate NEW App Password`,
    duration: 10000,
    type: 'error'
  };
}

/**
 * Get user-friendly success message for email sending
 */
export function getEmailSuccessMessage(
  recipient: 'admin' | 'client' | 'both',
  recipientEmail?: string,
  attachmentCount?: number
): { title: string; message: string; duration: number } {
  
  const attachmentText = attachmentCount 
    ? `\n📎 Attachments: ${attachmentCount} PDF file(s)` 
    : '';

  if (recipient === 'both') {
    return {
      title: '✅ Emails Sent Successfully!',
      message: 
        `📧 Sent to BOTH admin and client\n` +
        `✉️ Admin: Notification email sent\n` +
        `✉️ Client: Confirmation email sent` +
        attachmentText,
      duration: 5000
    };
  }

  if (recipient === 'admin') {
    return {
      title: '✅ Admin Email Sent!',
      message: 
        `📧 Admin notification sent successfully` +
        attachmentText,
      duration: 4000
    };
  }

  return {
    title: '✅ Client Email Sent!',
    message: 
      `📧 Sent to: ${recipientEmail || 'client'}\n` +
      `✉️ Confirmation email delivered` +
      attachmentText,
    duration: 4000
  };
}

/**
 * Extract specific error info from error response
 */
export function extractErrorDetails(error: any): string {
  if (typeof error === 'string') return error;
  
  // Check for nested error structures
  if (error?.details) return error.details;
  if (error?.error) return error.error;
  if (error?.message) return error.message;
  
  // Check for response property (from fetch errors)
  if (error?.response?.data?.details) return error.response.data.details;
  if (error?.response?.data?.error) return error.response.data.error;
  
  return 'Unknown error occurred';
}

