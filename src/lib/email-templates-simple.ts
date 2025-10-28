// Simplified email templates without Mailgen for debugging
import { getSettingFromDB } from './settings-server';
import fs from 'fs';
import path from 'path';

export interface BatchCompletionEmailData {
  clientName: string;
  clientEmail?: string; // Add client email
  batchId: number;
  completedForms: Array<{
    id: number;
    formId: number;
    title: string;
  }>;
  completedAt?: string;
}

/**
 * Convert company logo to base64
 */
async function getCompanyLogoBase64(): Promise<string> {
  try {
    // Look for logo in public directory
    const logoPath = path.join(process.cwd(), 'public', 'infinity_logo.png');
    
    console.log('Looking for logo at:', logoPath);
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const base64Logo = logoBuffer.toString('base64');

      return `${base64Logo}`;
    } else {
      console.warn('❌ Company logo not found at:', logoPath);
      return '';
    }
  } catch (error) {
    console.error('❌ Error loading company logo:', error);
    return '';
  }
}

/**
 * Generate batch completion email with custom HTML (no Mailgen)
 */
export async function generateBatchCompletionEmailSimple(data: BatchCompletionEmailData): Promise<string> {
  const appName = await getSettingFromDB('app_name', 'Infinity Support Portal');
  const logoBase64 = await getCompanyLogoBase64();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forms Completed - ${data.clientName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header with Logo -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        
        <h1 style="margin: 0; font-size: 28px;">${appName}</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Form Completion Notification</p>
      </div>

      <!-- Main Content -->
      <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin-top: 0;">🎉 Great News!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          <strong>${data.clientName}</strong> has successfully completed all assigned forms.
        </p>
        <p style="font-size: 16px; margin-bottom: 0;">
          All <strong>${data.completedForms.length} form(s)</strong> have been signed and are ready for your review.
        </p>
      </div>

      <!-- Forms Table (Simplified - No ID, No Links) -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Completed Forms Summary</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #3498db; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600; width: 70%;">Form Title</th>
              <th style="padding: 15px; text-align: left; font-weight: 600; width: 30%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.completedForms.map((form) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px; font-weight: 500;">${form.title}</td>
                <td style="padding: 15px;"><span style="background: #27ae60; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">✅ Completed</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Details Box (No Action Button) -->
      <div style="background: #e8f5e8; border-left: 4px solid #27ae60; padding: 20px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #27ae60;">📎 Attachments Included</h4>
        <p style="margin-bottom: 15px;">All completed forms are attached to this email as PDF files for your convenience.</p>
        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #d1fae5;">
          <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;">
            <strong>Client Details:</strong><br>
            • Name: <strong>${data.clientName}</strong><br>
            ${data.clientEmail ? `• Email: <strong>${data.clientEmail}</strong><br>` : ''}
            • Total Forms: <strong>${data.completedForms.length}</strong><br>
            • Completed: <strong>${data.completedAt || new Date().toLocaleString()}</strong>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 14px;">
        <p style="margin: 0;">This is an automated notification from ${appName}</p>
        <p style="margin: 5px 0 0 0;">If you have any questions, please contact support.</p>
        <p style="margin: 15px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} ${appName}. All rights reserved.
        </p>
      </div>

    </body>
    </html>
  `;
}

/**
 * Generate test email with custom HTML (no Mailgen)
 */
export async function generateTestEmailSimple(): Promise<string> {
  const appName = await getSettingFromDB('app_name', 'Infinity Support Portal');
  const logoBase64 = await getCompanyLogoBase64();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email System Test</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header with Logo -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        ${logoBase64 ? `
          <div style="margin-bottom: 15px;">
            <img src="${logoBase64}" alt="${appName} Logo" style="max-height: 60px; max-width: 200px; display: block; margin: 0 auto;">
          </div>
        ` : ''}
        <h1 style="margin: 0; font-size: 28px;">✅ Email System Test</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${appName}</p>
      </div>

      <!-- Success Message -->
      <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 25px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h2 style="color: #059669; margin-top: 0;">🎉 Email Configuration Working!</h2>
        <p style="font-size: 16px; margin-bottom: 0;">
          If you're receiving this email, your email notification system is working correctly.
        </p>
      </div>

      <!-- Status Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 System Status</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #3498db; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">Component</th>
              <th style="padding: 15px; text-align: left; font-weight: 600;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px;">SMTP Configuration</td>
              <td style="padding: 15px;"><span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">✅ Working</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px;">Email Templates</td>
              <td style="padding: 15px;"><span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">✅ Working</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 15px;">PDF Generation</td>
              <td style="padding: 15px;"><span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">✅ Working</span></td>
            </tr>
            <tr>
              <td style="padding: 15px;">Email Delivery</td>
              <td style="padding: 15px;"><span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">✅ Working</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Test Details (No Action Button) -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #2c3e50;">📋 Test Details</h4>
        <p style="margin: 0; font-size: 14px; color: #555;">
          • Application: ${appName}<br>
          • Test Time: ${new Date().toLocaleString()}<br>
          • Email System: Fully Operational<br>
          • Ready for: Form completion notifications
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
