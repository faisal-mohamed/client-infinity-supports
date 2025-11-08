// Performance optimization utilities for email system

import { generateMultiplePDFBuffers } from './pdf-buffer';
import { sendEmailWithRetry } from './email';

/**
 * Performance metrics tracking
 */
interface PerformanceMetrics {
  pdfGenerationTime: number;
  emailSendingTime: number;
  totalAttachmentSize: number;
  attachmentCount: number;
  totalProcessingTime: number;
}

/**
 * Optimized batch email sending with performance monitoring
 */
export async function sendOptimizedBatchEmail({
  clientName,
  clientEmail,
  completedForms,
  batchId,
  adminEmail,
  adminId
  
}: {
  clientName: string;
  clientEmail?: string;
  completedForms: Array<{ id: number; formId: number; title: string }>;
  batchId: number;
  adminEmail: string;
  adminId: any 
}): Promise<{
  success: boolean;
  metrics: PerformanceMetrics;
  messageId?: string;
  error?: string;
}> {
  const startTime = Date.now();
  const metrics: PerformanceMetrics = {
    pdfGenerationTime: 0,
    emailSendingTime: 0,
    totalAttachmentSize: 0,
    attachmentCount: 0,
    totalProcessingTime: 0
  };

  try {
    console.log(`🚀 Starting optimized batch email for ${clientName} (${completedForms.length} forms, adminId: ${adminId})`);

    // Step 1: Generate PDFs with performance tracking
    const pdfStartTime = Date.now();
    const pdfResults = await generateMultiplePDFBuffers(completedForms, adminId);
    metrics.pdfGenerationTime = Date.now() - pdfStartTime;

    // Filter successful PDFs and calculate metrics
    const successfulPDFs = pdfResults.filter(result => result.success && result.buffer);
    metrics.attachmentCount = successfulPDFs.length;
    metrics.totalAttachmentSize = successfulPDFs.reduce((total, pdf) => 
      total + (pdf.buffer?.length || 0), 0
    );

    console.log(`📄 PDF generation complete: ${metrics.attachmentCount}/${completedForms.length} successful (${metrics.pdfGenerationTime}ms, ${formatBytes(metrics.totalAttachmentSize)})`);

    // Step 2: Optimize email content based on attachment size
    const emailHtml = await generateOptimizedEmailTemplate({
      clientName,
      clientEmail,
      completedForms,
      batchId,
      attachmentSize: metrics.totalAttachmentSize
    });

    // Step 3: Prepare attachments
    const attachments = successfulPDFs.map(pdf => ({
      filename: pdf.filename,
      content: pdf.buffer!,
      contentType: 'application/pdf'
    }));

    // Step 4: Send email with performance tracking
    const emailStartTime = Date.now();
    const emailResult = await sendEmailWithRetry({
      to: adminEmail,
      subject: `Forms Completed - ${clientName} (${metrics.attachmentCount} forms)`,
      html: emailHtml,
      attachments,
      maxRetries: 3,
      retryDelay: 1000,
      adminId: adminId 
    });
    metrics.emailSendingTime = Date.now() - emailStartTime;

    metrics.totalProcessingTime = Date.now() - startTime;

    console.log(`📧 Email sending complete: ${emailResult.success ? 'SUCCESS' : 'FAILED'} (${metrics.emailSendingTime}ms)`);
    console.log(`⚡ Total processing time: ${metrics.totalProcessingTime}ms`);

    return {
      success: emailResult.success,
      metrics,
      messageId: emailResult.messageId,
      error: emailResult.error
    };

  } catch (error) {
    metrics.totalProcessingTime = Date.now() - startTime;
    console.error('❌ Optimized batch email failed:', error);
    
    return {
      success: false,
      metrics,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generate optimized email template based on content size
 */
async function generateOptimizedEmailTemplate({
  clientName,
  clientEmail,
  completedForms,
  batchId,
  attachmentSize
}: {
  clientName: string;
  clientEmail?: string;
  completedForms: Array<{ id: number; formId: number; title: string }>;
  batchId: number;
  attachmentSize: number;
}): Promise<string> {
  
  // Optimize template based on number of forms and attachment size
  const isLargeAttachment = attachmentSize > 10 * 1024 * 1024; // 10MB
  const manyForms = completedForms.length > 5;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Forms Completed - ${clientName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">Infinity Support Portal</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Form Completion Notification</p>
      </div>

      <!-- Main Content -->
      <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin-top: 0;">🎉 Great News!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          <strong>${clientName}</strong> has successfully completed all assigned forms.
        </p>
        <p style="font-size: 16px; margin-bottom: 0;">
          All <strong>${completedForms.length} form(s)</strong> have been signed and are ready for your review.
        </p>
      </div>

      <!-- Forms Table - Optimized for many forms -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Completed Forms Summary</h3>
        ${manyForms ? generateCompactFormsList(completedForms) : generateDetailedFormsTable(completedForms)}
      </div>

      <!-- Attachment Info -->
      <div style="background: #e8f5e8; border-left: 4px solid #27ae60; padding: 20px; margin-bottom: 30px;">
        <h4 style="margin-top: 0; color: #27ae60;">📎 Attachments Included</h4>
        <p style="margin-bottom: 15px;">All completed forms are attached to this email as PDF files.</p>
        <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #d1fae5;">
          <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;">
            <strong>Client Details:</strong><br>
            • Name: <strong>${clientName}</strong><br>
            ${clientEmail ? `• Email: <strong>${clientEmail}</strong><br>` : ''}
            • Total Forms: <strong>${completedForms.length}</strong><br>
            • Total Size: <strong>${formatBytes(attachmentSize)}</strong><br>
            • Completed: <strong>${new Date().toLocaleString()}</strong>
            ${isLargeAttachment ? '<br><br><em style="color: #f59e0b;">⚠️ Large attachment - download may take time</em>' : ''}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 14px;">
        <p style="margin: 0;">This is an automated notification from Infinity Support Portal</p>
        <p style="margin: 5px 0 0 0;">If you have any questions, please contact support.</p>
        <p style="margin: 15px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} Infinity Support Portal. All rights reserved.
        </p>
      </div>

    </body>
    </html>
  `;
}

/**
 * Generate compact forms list for many forms
 */
function generateCompactFormsList(forms: Array<{ title: string }>): string {
  return `
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <ul style="margin: 0; padding-left: 20px;">
        ${forms.map(form => `
          <li style="margin-bottom: 8px;">
            <strong>${form.title}</strong> 
            <span style="background: #27ae60; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-left: 8px;">✅ Completed</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Generate detailed forms table for fewer forms
 */
function generateDetailedFormsTable(forms: Array<{ title: string }>): string {
  return `
    <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background: #3498db; color: white;">
          <th style="padding: 15px; text-align: left; font-weight: 600; width: 70%;">Form Title</th>
          <th style="padding: 15px; text-align: left; font-weight: 600; width: 30%;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${forms.map(form => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px; font-weight: 500;">${form.title}</td>
            <td style="padding: 15px;"><span style="background: #27ae60; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">✅ Completed</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Performance recommendations based on metrics
 */
export function generatePerformanceRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];
  
  if (metrics.pdfGenerationTime > 10000) {
    recommendations.push("🐌 PDF generation is slow (>10s). Consider optimizing form complexity or using background processing.");
  }
  
  if (metrics.emailSendingTime > 30000) {
    recommendations.push("📧 Email sending is slow (>30s). Check SMTP server performance or reduce attachment size.");
  }
  
  if (metrics.totalAttachmentSize > 25 * 1024 * 1024) {
    recommendations.push("📎 Large attachments (>25MB). Consider compressing PDFs or sending download links instead.");
  }
  
  if (metrics.attachmentCount > 10) {
    recommendations.push("📄 Many attachments (>10). Consider combining forms or using a ZIP file.");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("⚡ Performance is optimal!");
  }
  
  return recommendations;
}
