// PDF buffer generation utilities for email attachments

interface PDFBufferOptions {
  formSubmissionId: string | number;
  formId: string | number;
  filename?: string;
  adminId?: string | number;
}

interface PDFBufferResult {
  success: boolean;
  buffer?: Buffer;
  filename?: string;
  error?: string;
}

/**
 * Generate PDF buffer for email attachment
 */
export async function generatePDFBuffer({
  formSubmissionId,
  formId,
  filename,
  adminId
}: PDFBufferOptions): Promise<PDFBufferResult> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    let url = `${baseUrl}/api/generate-pdf/${formSubmissionId}/${formId}?buffer=true`;
    
    if (filename) {
      url += `&filename=${encodeURIComponent(filename)}`;
    }
    
    if (adminId) {
      url += `&adminId=${adminId}`;
    }
    
    console.log(`📄 Generating PDF buffer from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.status} ${response.statusText}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const pdfFilename = response.headers.get('X-PDF-Filename') || filename || `form_${formSubmissionId}.pdf`;
    
    console.log(`✅ PDF buffer generated successfully: ${pdfFilename} (${buffer.length} bytes)`);
    
    return {
      success: true,
      buffer,
      filename: pdfFilename
    };
  } catch (error) {
    console.error('❌ PDF buffer generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown PDF generation error'
    };
  }
}

/**
 * Generate multiple PDF buffers for batch email
 */
export async function generateMultiplePDFBuffers(
  forms: Array<{
    id: string | number; // This is the formSubmissionId
    formId: string | number;
    title: string;
  }>,
  adminId?: number
): Promise<Array<{
  success: boolean;
  filename: string;
  buffer?: Buffer;
  error?: string;
}>> {
  console.log(`📄 Generating ${forms.length} PDF buffers for batch email (adminId: ${adminId})`);
  
  const results = await Promise.allSettled(
    forms.map(async (form) => {
      const filename = `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      
      console.log(`📄 Generating PDF for: ${form.title} (submissionId: ${form.id}, formId: ${form.formId}, adminId: ${adminId})`);
      
      const result = await generatePDFBuffer({
        formSubmissionId: form.id, // Use 'id' as formSubmissionId
        formId: form.formId,
        filename,
        adminId
      });
      
      return {
        success: result.success,
        filename: result.filename || filename,
        buffer: result.buffer,
        error: result.error
      };
    })
  );
  
  const processedResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        filename: `${forms[index].title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        error: result.reason?.message || 'PDF generation failed'
      };
    }
  });
  
  const successCount = processedResults.filter(r => r.success).length;
  console.log(`✅ Generated ${successCount}/${forms.length} PDF buffers successfully`);
  
  return processedResults;
}

/**
 * Create email attachment from PDF buffer
 */
export function createPDFAttachment(buffer: Buffer, filename: string) {
  return {
    filename,
    content: buffer,
    contentType: 'application/pdf'
  };
}
