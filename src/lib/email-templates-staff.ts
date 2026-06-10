// Staff-specific email templates
import { getSettingFromDB } from './settings-server';

export interface StaffEmailData {
  staffName: string;
  staffEmail: string;
  completedForms: Array<{
    id: number;
    formId: number;
    title: string;
  }>;
  completedAt?: string;
}

/**
 * Generate staff confirmation email template
 */
export async function generateStaffConfirmationEmail(data: StaffEmailData): Promise<string> {
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
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">${appName}</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Staff Form Completion Confirmation</p>
      </div>

      <!-- Main Content -->
      <div style="background: #eff6ff; border: 2px solid #3b82f6; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #2563eb; margin-top: 0;">🎉 Thank You, ${data.staffName}!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          We're pleased to confirm that you have successfully completed all your assigned staff forms.
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
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Completion Info -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
        <p style="margin: 0; font-size: 14px; color: #555;">
          <strong>Completed:</strong> ${data.completedAt || new Date().toLocaleString()}
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 14px;">
        <p style="margin: 0;">
          This is an automated confirmation from ${appName}. Please do not reply to this email.
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">
          If you have any questions, please contact your administrator.
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate staff test email template
 */
export async function generateStaffTestEmail(staffName: string = "Test Staff"): Promise<string> {
  const appName = await getSettingFromDB('app_name', 'Infinity Support Portal');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Staff Email Test</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">✅ Staff Email Test</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${appName}</p>
      </div>

      <!-- Success Message -->
      <div style="background: #eff6ff; border: 2px solid #3b82f6; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h2 style="color: #2563eb; margin-top: 0;">🎉 Staff Email System Working!</h2>
        <p style="font-size: 16px; margin-bottom: 0;">
          Hello <strong>${staffName}</strong>! If you're receiving this email, the staff notification system is working correctly.
        </p>
      </div>

      <!-- Test Details -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #2c3e50;">📋 Test Details</h4>
        <p style="margin: 0; font-size: 14px; color: #555;">
          • Email Type: Staff Notification Test<br>
          • Test Time: ${new Date().toLocaleString()}<br>
          • System Status: Fully Operational<br>
          • Ready for: Staff form completion confirmations
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 14px;">
        <p style="margin: 0;">This is an automated test from ${appName}</p>
      </div>
    </body>
    </html>
  `;
}

