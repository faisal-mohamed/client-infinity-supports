// Client-specific email templates
import { getSettingFromDB } from './settings-server';

export interface ClientEmailData {
  clientName: string;
  clientEmail: string;
  completedForms: Array<{
    id: number;
    formId: number;
    title: string;
  }>;
  completedAt?: string;
}

/**
 * Generate client confirmation email template
 */
export async function generateClientConfirmationEmail(data: ClientEmailData): Promise<string> {
  const appName = await getSettingFromDB('app_name', 'Infinity Support Portal');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forms Completed - Thank You</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">${appName}</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Form Completion Confirmation</p>
      </div>

      <!-- Main Content -->
      <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #059669; margin-top: 0;">🎉 Thank You, ${data.clientName}!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          We're pleased to confirm that you have successfully completed all your assigned forms.
        </p>
        <p style="font-size: 16px; margin-bottom: 0;">
          Your <strong>${data.completedForms.length} form(s)</strong> have been submitted and are now being processed by our team.
        </p>
      </div>

      <!-- Forms Summary -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Your Completed Forms</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <ul style="margin: 0; padding-left: 20px;">
            ${data.completedForms.map(form => `
              <li style="margin-bottom: 12px; font-size: 15px;">
                <strong>${form.title}</strong> 
                <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 3px; font-size: 11px; margin-left: 8px; font-weight: 600;">✅ Completed</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- What Happens Next -->
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #1e40af;">📋 What Happens Next?</h4>
        <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 8px;">Our team will review your submitted forms</li>
          <li style="margin-bottom: 8px;">We'll contact you if any additional information is needed</li>
          <li style="margin-bottom: 8px;">You'll receive updates on the progress of your application</li>
          <li style="margin-bottom: 0;">Keep copies of your forms for your records (attached to this email)</li>
        </ul>
      </div>

      <!-- Form Copies Info -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #92400e;">📎 Your Form Copies</h4>
        <p style="margin-bottom: 15px; color: #78350f;">
          For your records, we've attached copies of all your completed forms to this email.
        </p>
        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #fbbf24;">
          <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;">
            <strong>Completion Details:</strong><br>
            • Your Name: <strong>${data.clientName}</strong><br>
            • Email: <strong>${data.clientEmail}</strong><br>
            • Forms Completed: <strong>${data.completedForms.length}</strong><br>
            • Completion Date: <strong>${data.completedAt || new Date().toLocaleString()}</strong>
          </p>
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #2c3e50;">📞 Need Help?</h4>
        <p style="margin: 0; font-size: 14px; color: #555;">
          If you have any questions about your forms or need assistance, please don't hesitate to contact our support team. 
          We're here to help you through every step of the process.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 14px;">
        <p style="margin: 0;">Thank you for choosing ${appName}</p>
        <p style="margin: 5px 0 0 0;">This is an automated confirmation email.</p>
        <p style="margin: 15px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.
        </p>
      </div>

    </body>
    </html>
  `;
}

/**
 * Generate client test email template
 */
export async function generateClientTestEmail(clientName: string = "Test Client"): Promise<string> {
  const appName = await getSettingFromDB('app_name', 'Infinity Support Portal');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Client Email Test</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">✅ Client Email Test</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${appName}</p>
      </div>

      <!-- Success Message -->
      <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h2 style="color: #059669; margin-top: 0;">🎉 Client Email System Working!</h2>
        <p style="font-size: 16px; margin-bottom: 0;">
          Hello <strong>${clientName}</strong>! If you're receiving this email, the client notification system is working correctly.
        </p>
      </div>

      <!-- Test Details -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #2c3e50;">📋 Test Details</h4>
        <p style="margin: 0; font-size: 14px; color: #555;">
          • Email Type: Client Notification Test<br>
          • Test Time: ${new Date().toLocaleString()}<br>
          • System Status: Fully Operational<br>
          • Ready for: Client form completion confirmations
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 14px;">
        <p style="margin: 0;">This is an automated test from ${appName}</p>
        <p style="margin: 15px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.
        </p>
      </div>

    </body>
    </html>
  `;
}
