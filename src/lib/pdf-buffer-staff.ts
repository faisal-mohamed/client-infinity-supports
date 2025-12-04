// PDF buffer generation utilities for staff form email attachments

interface StaffPDFBufferOptions {
  staffId: number;
  formKey: string;
  formId: number;
  filename?: string;
}

interface StaffPDFBufferResult {
  success: boolean;
  buffer?: Buffer;
  filename?: string;
  error?: string;
}

/**
 * Generate PDF buffer for staff form email attachment
 */
export async function generateStaffPDFBuffer({
  staffId,
  formKey,
  formId,
  filename
}: StaffPDFBufferOptions): Promise<StaffPDFBufferResult> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    
    // 🎯 SPECIAL HANDLING: super_choice_form uses a different PDF generation endpoint
    // It uses Playwright + jsPDF instead of React PDF
    if (formKey === 'super_choice_form' || formKey === 'super-choice-form') {
      console.log(`📄 [STAFF PDF] Using special Playwright endpoint for super_choice_form`);
      
      // Fetch form submission data to get the form data
      const { prisma } = await import('@/lib/prisma');
      const submission = await prisma.staffFormSubmission.findUnique({
        where: {
          staffId_formKey: {
            staffId,
            formKey: 'super_choice_form'
          }
        },
        include: {
          staff: {
            select: {
              firstName: true,
              surname: true,
              email: true
            }
          }
        }
      });
      
      if (!submission) {
        throw new Error(`StaffFormSubmission not found for staffId: ${staffId}, formKey: super_choice_form`);
      }
      
      // Extract form data from submission
      const formData = (submission.data as any) || {};
      
      // 🎯 CRITICAL: Map staffSignature to sectionBSignature if not already in formData
      // Super Choice Form can have signatures in sectionB, sectionC, or sectionD
      // Priority: sectionBSignature > sectionCSignature > sectionDSignature > staffSignature
      if (submission.staffSignature) {
        if (!formData.sectionBSignature && !formData.sectionCSignature && !formData.sectionDSignature) {
          // If no section signature exists, use staffSignature for sectionB (most common)
          formData.sectionBSignature = submission.staffSignature;
          console.log('📄 [STAFF PDF] Mapped staffSignature to sectionBSignature');
        }
      }
      
      // Map staffSignedAt to sectionBDate if needed
      if (submission.staffSignedAt && !formData.sectionBDate) {
        const signedDate = new Date(submission.staffSignedAt);
        formData.sectionBDate = {
          day: String(signedDate.getDate()).padStart(2, '0'),
          month: String(signedDate.getMonth() + 1).padStart(2, '0'),
          year: String(signedDate.getFullYear()),
        };
        console.log('📄 [STAFF PDF] Mapped staffSignedAt to sectionBDate:', formData.sectionBDate);
      }
      
      // Use the special super-choice-form PDF endpoint
      const url = `${baseUrl}/api/generate-pdf/super-choice-form`;
      
      console.log(`📄 [STAFF PDF] Generating super_choice_form PDF from: ${url}`);
      console.log(`📄 [STAFF PDF] Form data keys:`, Object.keys(formData));
      console.log(`📄 [STAFF PDF] Form data sample:`, {
        fullName: formData.fullName,
        tfn: formData.tfn ? '***' : undefined,
        employeeNumber: formData.employeeNumber,
        fundChoice: formData.fundChoice,
        hasSectionBSignature: !!formData.sectionBSignature,
        hasSectionCSignature: !!formData.sectionCSignature,
        hasSectionDSignature: !!formData.sectionDSignature,
        sectionBDate: formData.sectionBDate
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [STAFF PDF] Super choice form PDF generation failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Super choice form PDF generation failed: ${response.status} ${response.statusText}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const pdfFilename = filename || `Superannuation_Standard_Choice_Form_${submission.staff.firstName || ''}_${submission.staff.surname || ''}.pdf`.replace(/\s+/g, '_');
      
      console.log(`✅ [STAFF PDF] Super choice form PDF buffer generated successfully: ${pdfFilename} (${buffer.length} bytes)`);
      
      return {
        success: true,
        buffer,
        filename: pdfFilename
      };
    } else if (formKey === 'govt_tax' || formKey === 'govt-tax') {
      console.log(`📄 [STAFF PDF] Using special Playwright endpoint for govt_tax (TFN Declaration)`);
      
      // Fetch form submission data to get the form data
      const { prisma } = await import('@/lib/prisma');
      const submission = await prisma.staffFormSubmission.findUnique({
        where: {
          staffId_formKey: {
            staffId,
            formKey: 'govt_tax'
          }
        },
        include: {
          staff: {
            select: {
              firstName: true,
              surname: true,
              email: true
            }
          }
        }
      });
      
      if (!submission) {
        throw new Error(`StaffFormSubmission not found for staffId: ${staffId}, formKey: govt_tax`);
      }
      
      // Extract form data from submission
      const formData = (submission.data as any) || {};
      
      // Use the special tax-form PDF endpoint
      const url = `${baseUrl}/api/generate-pdf/tax-form`;
      
      console.log(`📄 [STAFF PDF] Generating govt_tax PDF from: ${url}`);
      console.log(`📄 [STAFF PDF] Form data keys:`, Object.keys(formData));
      console.log(`📄 [STAFF PDF] Form data sample:`, {
        tfn: formData.tfn ? '***' : undefined,
        firstName: formData.firstName,
        surname: formData.surname,
        hasPayeeSignature: !!formData.payeeSignature,
        hasPayerSignature: !!formData.payerSignature,
        payeeSignatureAt: formData.payeeSignatureAt
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [STAFF PDF] TFN Declaration PDF generation failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`TFN Declaration PDF generation failed: ${response.status} ${response.statusText}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const pdfFilename = filename || `TFN_Declaration_Form_${submission.staff.firstName || ''}_${submission.staff.surname || ''}.pdf`.replace(/\s+/g, '_');
      
      console.log(`✅ [STAFF PDF] TFN Declaration PDF buffer generated successfully: ${pdfFilename} (${buffer.length} bytes)`);
      
      return {
        success: true,
        buffer,
        filename: pdfFilename
      };
    } else if (formKey === 'ndis_workforce_capability' || formKey === 'ndis-workforce-capability') {
      console.log(`📄 [STAFF PDF] Using special Playwright endpoint for ndis_workforce_capability`);
      
      // NDIS Workforce Capability uses a GET endpoint that fetches data from database
      // Use the staff-specific PDF endpoint
      const url = `${baseUrl}/api/staff/${staffId}/forms/ndis-workforce-capability/pdf`;
      
      console.log(`📄 [STAFF PDF] Generating ndis_workforce_capability PDF from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [STAFF PDF] NDIS Workforce Capability PDF generation failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`NDIS Workforce Capability PDF generation failed: ${response.status} ${response.statusText}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Get staff name for filename
      const { prisma } = await import('@/lib/prisma');
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: { firstName: true, surname: true }
      });
      
      const pdfFilename = filename || `NDIS_Workforce_Capability_${staff?.firstName || ''}_${staff?.surname || ''}.pdf`.replace(/\s+/g, '_');
      
      console.log(`✅ [STAFF PDF] NDIS Workforce Capability PDF buffer generated successfully: ${pdfFilename} (${buffer.length} bytes)`);
      
      return {
        success: true,
        buffer,
        filename: pdfFilename
      };
    }
    
    // For all other forms, use the standard React PDF endpoint
    // Map formKey to URL format (snake_case to kebab-case)
    const formType = formKey.replace(/_/g, '-');
    
    // Use staff-specific PDF endpoint
    let url = `${baseUrl}/api/staff/${staffId}/forms/${formType}/pdf`;
    
    // Add cache-busting parameter
    url += `?key=${Date.now()}`;
    
    if (filename) {
      url += `&filename=${encodeURIComponent(filename)}`;
    }
    
    console.log(`📄 [STAFF PDF] Generating PDF buffer from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Staff PDF generation failed: ${response.status} ${response.statusText}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    const pdfFilename = response.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] 
      || filename 
      || `${formKey}_${staffId}.pdf`;
    
    console.log(`✅ [STAFF PDF] PDF buffer generated successfully: ${pdfFilename} (${buffer.length} bytes)`);
    
    return {
      success: true,
      buffer,
      filename: pdfFilename
    };
  } catch (error) {
    console.error('❌ [STAFF PDF] PDF buffer generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown staff PDF generation error'
    };
  }
}

/**
 * Generate multiple PDF buffers for staff batch email
 * This function fetches staff form submission data to get staffId and formKey
 */
export async function generateMultipleStaffPDFBuffers(
  completedForms: Array<{
    id: number; // StaffFormSubmission.id
    formId: number;
    title: string;
  }>,
  adminId?: number
): Promise<Array<{
  success: boolean;
  filename: string;
  buffer?: Buffer;
  error?: string;
}>> {
  console.log(`📄 [STAFF PDF] Generating ${completedForms.length} PDF buffers for staff batch email (adminId: ${adminId})`);
  
  // Import prisma to fetch staff form submission data
  const { prisma } = await import('@/lib/prisma');
  
  // Fetch all staff form submissions to get staffId and formKey
  const submissionIds = completedForms.map(f => f.id);
  const submissions = await prisma.staffFormSubmission.findMany({
    where: {
      id: { in: submissionIds }
    },
    select: {
      id: true,
      staffId: true,
      formKey: true,
      formId: true
    }
  });
  
  // Create a map for quick lookup
  const submissionMap = new Map(submissions.map(s => [s.id, s]));
  
  const results = await Promise.allSettled(
    completedForms.map(async (form) => {
      const submission = submissionMap.get(form.id);
      
      if (!submission) {
        console.error(`❌ [STAFF PDF] StaffFormSubmission ${form.id} not found`);
        return {
          success: false,
          filename: `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          error: `StaffFormSubmission ${form.id} not found`
        };
      }
      
      const filename = `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      
      console.log(`📄 [STAFF PDF] Generating PDF for: ${form.title} (submissionId: ${form.id}, staffId: ${submission.staffId}, formKey: ${submission.formKey})`);
      
      const result = await generateStaffPDFBuffer({
        staffId: submission.staffId,
        formKey: submission.formKey || '',
        formId: submission.formId || form.formId,
        filename
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
        filename: `${completedForms[index].title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
        error: result.reason?.message || 'Staff PDF generation failed'
      };
    }
  });
  
  const successCount = processedResults.filter(r => r.success).length;
  const failedResults = processedResults.filter(r => !r.success);
  
  console.log(`✅ [STAFF PDF] Generated ${successCount}/${completedForms.length} PDF buffers successfully`);
  
  if (failedResults.length > 0) {
    console.error(`❌ [STAFF PDF] Failed PDF generations:`, failedResults.map(r => ({
      filename: r.filename,
      error: r.error
    })));
  }
  
  // Log details for special forms (super_choice_form, govt_tax) specifically
  const specialFormResults = processedResults.map((r, i) => {
    const submission = submissionMap.get(completedForms[i].id);
    return { result: r, formKey: submission?.formKey };
  }).filter(({ formKey }) => formKey === 'super_choice_form' || formKey === 'govt_tax');
  
  specialFormResults.forEach(({ result, formKey }) => {
    console.log(`🔍 [STAFF PDF] ${formKey === 'super_choice_form' ? 'Super Choice Form' : 'TFN Declaration'} PDF result:`, {
      success: result.success,
      filename: result.filename,
      bufferSize: 'buffer' in result ? (result.buffer?.length || 0) : 0,
      error: result.error
    });
  });
  
  return processedResults;
}

