import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkSignatureClearing } from '@/lib/staffFormUtils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    
    // Validate token format
    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ 
        error: 'Invalid access link',
        message: 'The access link you provided is not valid. Please check the link and try again.',
        code: 'INVALID_TOKEN'
      }, { status: 400 });
    }
    
    // 🚀 OPTIMIZED: Check if this is a signature token or onboard token
    // First try signature batch (for signature links)
    let staff = null;
    let batch = null;
    
    try {
      batch = await prisma.staffFormBatch.findUnique({
        where: { 
          batchToken: token,
          isSignatureOnly: true,
        },
        include: {
          staff: {
            include: {
              submissions: true,
              employmentDetails: true,
              employmentWelcomeAck: true,
              supportWorker: true,
              preEmploymentMedical: true,
              ndisWorkforceCapability: true,
              bullyingHarassmentTraining: true,
              bullyingTraining: true,
              ndisCodeOfConduct: true,
            },
          },
        },
      });
      
      if (batch && batch.expiresAt >= new Date()) {
        staff = batch.staff;
      }
    } catch (error) {
      // Not a signature token, continue with onboard check
    }
    
    // If not a signature token, try onboard token
    if (!staff) {
      try {
        staff = await prisma.staff.findFirst({
          where: { linkToken: token },
          include: {
            // Generic form submissions
            submissions: true,
            // Individual form tables
            employmentDetails: true,
            employmentWelcomeAck: true,
            supportWorker: true,
            preEmploymentMedical: true,
            ndisWorkforceCapability: true,
            bullyingHarassmentTraining: true,
            bullyingTraining: true,
            ndisCodeOfConduct: true,
          }
        });
      } catch (error: any) {
        if (error.code === 'P2021' && error.message.includes('StaffNdisCodeOfConduct')) {
        // Table doesn't exist, create it and retry
        console.log('Creating missing StaffNdisCodeOfConduct table...');
        
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "StaffNdisCodeOfConduct" (
            "id" SERIAL NOT NULL,
            "staffId" INTEGER NOT NULL,
            "data" JSONB NOT NULL,
            "staffSignature" TEXT,
            "staffSignedAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "StaffNdisCodeOfConduct_pkey" PRIMARY KEY ("id")
          )
        `);
        
        await prisma.$executeRawUnsafe(`
          CREATE UNIQUE INDEX IF NOT EXISTS "StaffNdisCodeOfConduct_staffId_key" 
          ON "StaffNdisCodeOfConduct"("staffId")
        `);
        
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "StaffNdisCodeOfConduct" 
          ADD CONSTRAINT IF NOT EXISTS "StaffNdisCodeOfConduct_staffId_fkey" 
          FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);
        
        // Retry the query
        staff = await prisma.staff.findFirst({
          where: { linkToken: token },
          include: {
            // Generic form submissions
            submissions: true,
            // Individual form tables
            employmentDetails: true,
            employmentWelcomeAck: true,
            supportWorker: true,
            preEmploymentMedical: true,
            ndisWorkforceCapability: true,
            bullyingHarassmentTraining: true,
            bullyingTraining: true,
            ndisCodeOfConduct: true,
          }
        });
        } else {
          throw error;
        }
      }
    }
    
    if (!staff) {
      return NextResponse.json({ 
        error: 'Access link not found',
        message: 'This access link is not valid or has been removed. Please contact your administrator for a new link.',
        code: 'LINK_NOT_FOUND'
      }, { status: 404 });
    }
    
    // Check if this is a signature batch token
    const isSignatureToken = !!batch;
    
    // Only check expiration for onboard tokens (signature tokens have their own expiration in batch)
    if (!isSignatureToken) {
      if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
        return NextResponse.json({ 
          error: 'Access link expired',
          message: 'This access link has expired. Please contact your administrator for a new link.',
          code: 'LINK_EXPIRED',
          expiredAt: staff.linkExpiresAt
        }, { status: 410 });
      }
      
      if (staff.status === 'deleted') {
        return NextResponse.json({ 
          error: 'Account deactivated',
          message: 'Your staff account has been deactivated. Please contact your administrator.',
          code: 'ACCOUNT_DEACTIVATED'
        }, { status: 403 });
      }
    }
    
    // 🚀 NEW: Unified approach using StaffFormSubmission (like client forms)
    const dataByForm: any = {};
    
    // Process all submissions from generic table
    // Handle both onboard tokens (staff.submissions) and signature tokens (need to fetch from batch)
    let submissions: any[] = [];
    
    if (isSignatureToken && batch) {
      // Get submissions from signature forms in the batch
      const signatureForms = await prisma.staffSignatureBatchForm.findMany({
        where: { batchId: batch.id },
        include: {
          formSubmission: {
            include: {
              form: {
                select: {
                  id: true,
                  formKey: true,
                  title: true,
                  version: true,
                },
              },
            },
          },
        },
      });
      
      // Map signature forms to submission format
      submissions = signatureForms.map((sf: any) => ({
        id: sf.formSubmission.id,
        formKey: sf.formSubmission.formKey,
        data: sf.formSubmission.data,
        staffSignature: sf.formSubmission.staffSignature,
        staffSignedAt: sf.formSubmission.staffSignedAt,
        adminSignature: sf.formSubmission.adminSignature,
        adminSignedAt: sf.formSubmission.adminSignedAt,
      }));
    } else {
      // For onboard tokens, use staff.submissions
      submissions = staff.submissions ? [...staff.submissions] : [];
    }
    
    submissions.forEach((s: any) => {
      console.log(`🔍 [Onboard API] Processing submission for formKey: ${s.formKey}`, {
        id: s.id,
        staffSignature: s.staffSignature ? 'EXISTS' : 'NULL',
        staffSignedAt: s.staffSignedAt,
        dataKeys: Object.keys(s.data || {}),
        dataHasSignature: !!(s.data as any)?.signature,
        dataHasStaffSignature: !!(s.data as any)?.staffSignature
      });
      
      const formData: any = {
        ...(s.data || {}),
        // Add admin fields if present
        ...(s.adminSignature ? {
          adminSignature: s.adminSignature,
          adminSignedAt: s.adminSignedAt?.toISOString().split('T')[0] || ''
        } : {})
      };
      
      console.log(`🔍 [Onboard API] FormData before signature merge for ${s.formKey}:`, {
        keys: Object.keys(formData),
        hasSignature: !!formData.signature,
        hasStaffSignature: !!formData.staffSignature
      });
      
      // Merge signature fields back into data for forms that use them
      // IMPORTANT: If staffSignature is null, explicitly clear signature fields from formData
      if (s.formKey === 'pre_employment_medical' || s.formKey === 'support_worker') {
        // Merge staffSignature and staffSignedAt back into data as signature and signatureDate
        if (s.staffSignature) {
          formData.signature = s.staffSignature;
          console.log(`✅ [Onboard API] Added signature to formData for ${s.formKey}`);
        } else {
          // Signature was cleared - remove from formData
          delete formData.signature;
          console.log(`🗑️ [Onboard API] Removed signature from formData for ${s.formKey} (staffSignature is null)`);
        }
        if (s.staffSignedAt) {
          formData.signatureDate = s.staffSignedAt.toISOString().split('T')[0];
        } else {
          delete formData.signatureDate;
        }
      } else if (s.formKey === 'employee_welcome' || s.formKey === 'ndis_workforce_capability' || s.formKey === 'ndis_code_of_conduct' || s.formKey === 'bullying_harassment_training' || s.formKey === 'documentation_acknowledgement') {
        // Merge staffSignature and staffSignedAt back into data as signature and date
        if (s.staffSignature) {
          formData.signature = s.staffSignature;
          console.log(`✅ [Onboard API] Added signature to formData for ${s.formKey}`);
        } else {
          // Signature was cleared - explicitly remove from formData
          delete formData.signature;
          delete formData.staffSignature;
          delete formData.orientationSignature;
          console.log(`🗑️ [Onboard API] Removed ALL signature fields from formData for ${s.formKey} (staffSignature is null)`);
        }
        if (s.staffSignedAt) {
          formData.date = s.staffSignedAt.toISOString().split('T')[0];
        } else {
          delete formData.date;
          delete formData.acknowledgedAt;
          delete formData.staffSignedAt;
        }
      } else if (s.formKey === 'bullying_training') {
        // Merge staffSignature and staffSignedAt back into data
        if (s.staffSignature) {
          formData.staffSignature = s.staffSignature;
        } else {
          delete formData.staffSignature;
        }
        if (s.staffSignedAt) {
          formData.staffSignedAt = s.staffSignedAt.toISOString();
          formData.date = s.staffSignedAt.toISOString().split('T')[0];
        } else {
          delete formData.staffSignedAt;
          delete formData.date;
        }
      }
      
      console.log(`🔍 [Onboard API] Final formData for ${s.formKey}:`, {
        keys: Object.keys(formData),
        hasSignature: !!formData.signature,
        hasStaffSignature: !!formData.staffSignature,
        signatureValue: formData.signature ? 'EXISTS' : 'NULL/EMPTY'
      });
      
      dataByForm[s.formKey] = formData;
    });
    
    // 🔄 BACKWARD COMPATIBILITY: Check dedicated tables for old data (only for onboard tokens)
    // Handle Employee Details form with signature
    if (!isSignatureToken && staff.employmentDetails && !dataByForm['employeeDetails']) {
      dataByForm['employeeDetails'] = {
        ...(staff.employmentDetails.data as any || {}),
        employeeSignature: staff.employmentDetails.staffSignature || '',
        employeeSignatureDate: staff.employmentDetails.staffSignedAt?.toISOString().split('T')[0] || '',
        adminSignature: staff.employmentDetails.adminSignature || '',
        adminSignedAt: staff.employmentDetails.adminSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    // Handle Employee Welcome form with signature
    if (!isSignatureToken && staff.employmentWelcomeAck && !dataByForm['employee_welcome']) {
      dataByForm['employee_welcome'] = {
        ...(staff.employmentWelcomeAck.data as any || {}),
        signature: staff.employmentWelcomeAck.staffSignature || '',
        date: staff.employmentWelcomeAck.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    // Handle Support Worker form
    if (!isSignatureToken && staff.supportWorker && !dataByForm['support_worker']) {
      dataByForm['support_worker'] = {
        ...(staff.supportWorker.data as any || {}),
        signature: staff.supportWorker.staffSignature || '',
        signatureDate: staff.supportWorker.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    // Handle other dedicated tables similarly (backward compatibility - only for onboard tokens)
    if (!isSignatureToken && staff.preEmploymentMedical && !dataByForm['pre_employment_medical']) {
      dataByForm['pre_employment_medical'] = {
        ...(staff.preEmploymentMedical.data as any || {}),
        signature: staff.preEmploymentMedical.staffSignature || '',
        signatureDate: staff.preEmploymentMedical.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    // Only use dedicated table as fallback for onboard tokens (not signature tokens)
    // Signature tokens should use StaffFormSubmission which is already processed above
    if (!isSignatureToken && staff.ndisWorkforceCapability && !dataByForm['ndis_workforce_capability']) {
      console.log(`🔍 [Onboard API] Using dedicated table fallback for ndis_workforce_capability`, {
        staffSignature: staff.ndisWorkforceCapability.staffSignature ? 'EXISTS' : 'NULL',
        staffSignedAt: staff.ndisWorkforceCapability.staffSignedAt,
        dataKeys: Object.keys(staff.ndisWorkforceCapability.data as any || {})
      });
      
      const dedicatedData = { ...(staff.ndisWorkforceCapability.data as any || {}) };
      // Only include signature if it exists (not null/empty)
      if (staff.ndisWorkforceCapability.staffSignature) {
        dedicatedData.signature = staff.ndisWorkforceCapability.staffSignature;
        console.log(`✅ [Onboard API] Added signature from dedicated table`);
      } else {
        // Signature was cleared - remove from data
        delete dedicatedData.signature;
        delete dedicatedData.staffSignature;
        console.log(`🗑️ [Onboard API] Removed signature from dedicated table data (staffSignature is null)`);
      }
      if (staff.ndisWorkforceCapability.staffSignedAt) {
        dedicatedData.date = staff.ndisWorkforceCapability.staffSignedAt.toISOString().split('T')[0];
      } else {
        delete dedicatedData.date;
      }
      dataByForm['ndis_workforce_capability'] = dedicatedData;
    }
    
    if (!isSignatureToken && staff.bullyingHarassmentTraining && !dataByForm['bullying_harassment_training']) {
      dataByForm['bullying_harassment_training'] = {
        ...(staff.bullyingHarassmentTraining.data as any || {}),
        signature: staff.bullyingHarassmentTraining.staffSignature || '',
        date: staff.bullyingHarassmentTraining.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    if (!isSignatureToken && staff.bullyingTraining && !dataByForm['bullying_training']) {
      dataByForm['bullying_training'] = {
        ...(staff.bullyingTraining.data as any || {}),
        staffSignature: staff.bullyingTraining.staffSignature || '',
        staffSignedAt: staff.bullyingTraining.staffSignedAt?.toISOString() || ''
      };
    }

    if (!isSignatureToken && staff.ndisCodeOfConduct && !dataByForm['ndis_code_of_conduct']) {
      dataByForm['ndis_code_of_conduct'] = {
        ...(staff.ndisCodeOfConduct.data as any || {}),
        signature: staff.ndisCodeOfConduct.staffSignature || '',
        date: staff.ndisCodeOfConduct.staffSignedAt?.toISOString().split('T')[0] || '',
        staffSignature: staff.ndisCodeOfConduct.staffSignature || '',
        staffSignedAt: staff.ndisCodeOfConduct.staffSignedAt?.toISOString() || ''
      };
    }

    return NextResponse.json({
      success: true,
      message: 'Staff data loaded successfully',
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone,
        status: staff.status,
      },
      submissions: dataByForm
    });
  } catch (e: any) {
    console.error('Error loading staff data:', e);

    // Handle specific database errors
    if (e.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Database constraint violation',
        message: 'There was a conflict with the data. Please try again.',
        code: 'CONSTRAINT_VIOLATION'
      }, { status: 409 });
    }
    
    if (e.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Record not found',
        message: 'The requested data could not be found.',
        code: 'RECORD_NOT_FOUND'
      }, { status: 404 });
    }
    
    // Handle connection errors
    if (e.code === 'P1001') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        message: 'Unable to connect to the database. Please try again later.',
        code: 'DATABASE_CONNECTION_ERROR'
      }, { status: 503 });
    }
    
    // Generic error fallback
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while loading your data. Please try again.',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    
    // Validate token format
    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ 
        error: 'Invalid access link',
        message: 'The access link you provided is not valid. Please check the link and try again.',
        code: 'INVALID_TOKEN'
      }, { status: 400 });
    }
    
    // Parse and validate request body
    let payload;
    try {
      payload = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        message: 'The data you sent is not valid. Please check your form and try again.',
        code: 'INVALID_JSON'
      }, { status: 400 });
    }
    
    const { formKey, data, submit } = payload || {};
    
    // Validate required fields
    if (!formKey) {
      return NextResponse.json({ 
        error: 'Missing form type',
        message: 'Please specify which form you are submitting.',
        code: 'MISSING_FORM_KEY'
      }, { status: 400 });
    }
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ 
        error: 'Missing form data',
        message: 'Please fill out the form before submitting.',
        code: 'MISSING_FORM_DATA'
      }, { status: 400 });
    }
    
    // 🚀 OPTIMIZED: Check if this is a signature token or onboard token
    // First try signature batch (for signature links)
    let staff = null;
    let batch = null;
    let isSignatureLink = false;
    
    try {
      batch = await prisma.staffFormBatch.findUnique({
        where: { 
          batchToken: token,
          isSignatureOnly: true,
        },
        include: {
          staff: true,
        },
      });
      
      if (batch && batch.expiresAt >= new Date()) {
        staff = batch.staff;
        isSignatureLink = true;
      }
    } catch (error) {
      // Not a signature token, continue with onboard check
    }
    
    // If not a signature token, try onboard token
    if (!staff) {
      staff = await prisma.staff.findFirst({ where: { linkToken: token } });
    }
    
    if (!staff) {
      return NextResponse.json({ 
        error: 'Access link not found',
        message: 'This access link is not valid or has been removed. Please contact your administrator for a new link.',
        code: 'LINK_NOT_FOUND'
      }, { status: 404 });
    }
    
    // Check expiration (onboard token only)
    if (!isSignatureLink && staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ 
        error: 'Access link expired',
        message: 'This access link has expired. Please contact your administrator for a new link.',
        code: 'LINK_EXPIRED',
        expiredAt: staff.linkExpiresAt
      }, { status: 410 });
    }
    
    if (staff.status === 'deleted') {
      return NextResponse.json({ 
        error: 'Account deactivated',
        message: 'Your staff account has been deactivated. Please contact your administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      }, { status: 403 });
    }
    // 🚀 NEW: Unified JSON storage (like client forms) - NO MORE DEDICATED TABLES!
    let saved: any;
    
    // Special handling for forms with admin approval (e.g., employeeDetails)
    if (formKey === 'employeeDetails') {
      // Extract signature data if present
      const { employeeSignature, employeeSignatureDate, ...formData } = data;
      const signatureData = employeeSignature ? {
        staffSignature: employeeSignature,
        staffSignedAt: employeeSignatureDate ? new Date(employeeSignatureDate) : new Date()
      } : {};
      
      // Check if form exists and if data has changed
      const existing = await prisma.staffEmploymentDetails.findUnique({
        where: { staffId: staff.id }
      });

      // Use reusable utility function for signature clearing logic
      const { shouldClearSignatures, shouldClearAdminApproval, cleanedFormData, message } = 
        checkSignatureClearing(existing, formData, !!employeeSignature);

      saved = await prisma.staffEmploymentDetails.upsert({
        where: { staffId: staff.id },
        update: { 
          data: cleanedFormData,
          ...signatureData,
          // Clear signatures if data changed
          ...(shouldClearSignatures ? {
            staffSignature: null,
            staffSignedAt: null,
          } : {}),
          // Clear admin approval if form data changed
          ...(shouldClearAdminApproval ? {
            adminSignature: null,
            adminSignedAt: null,
          } : {})
        },
        create: { 
          staffId: staff.id, 
          data: cleanedFormData,
          ...signatureData
        },
      });

      // Return warning if signatures were cleared
      if (message) {
        return NextResponse.json({ 
          success: true,
          message: message,
          id: saved.id ?? 0, 
          isSubmitted: !!submit,
          action: submit ? 'submitted' : 'saved',
          signaturesCleared: shouldClearSignatures,
          adminApprovalCleared: shouldClearAdminApproval
        });
      }
    } else {
      // 🆕 ALL OTHER FORMS: Use generic StaffFormSubmission table (like client forms!)
      // Extract signature data based on formKey
      let signatureData: any = {};
      let formData = { ...data };
      
      if (formKey === 'employee_welcome' || formKey === 'ndis_workforce_capability' || formKey === 'bullying_harassment_training') {
        const { signature, date, ...restData } = data;
        formData = restData;
        if (signature) {
          signatureData = {
            staffSignature: signature,
            staffSignedAt: date ? new Date(date) : new Date()
          };
        }
      } else if (formKey === 'support_worker' || formKey === 'pre_employment_medical') {
        const { signature, signatureDate, ...restData } = data;
        formData = restData;
        if (signature) {
          signatureData = {
            staffSignature: signature,
            staffSignedAt: signatureDate ? new Date(signatureDate) : new Date()
          };
        }
      } else if (formKey === 'bullying_training') {
        const { staffSignature, staffSignedAt, ...restData } = data;
        formData = restData;
        if (staffSignature) {
          signatureData = {
            staffSignature: staffSignature,
            staffSignedAt: staffSignedAt ? new Date(staffSignedAt) : new Date()
          };
        }
      } else if (formKey === 'ndis_code_of_conduct') {
        const { signature, date, ...restData } = data;
        formData = restData;
        if (signature) {
          signatureData = {
            staffSignature: signature,
            staffSignedAt: date ? new Date(date) : new Date()
          };
        }
      } else if (formKey === 'conflict_of_interest') {
        // For conflict_of_interest, extract employeeSignature and employeeDate
        const { employeeSignature, employeeDate, ...restData } = data;
        formData = restData;
        if (employeeSignature) {
          signatureData = {
            staffSignature: employeeSignature,
            staffSignedAt: employeeDate ? new Date(employeeDate) : new Date()
          };
        }
      } else if (formKey === 'documentation_acknowledgement') {
        // For documentation_acknowledgement, extract signature and date
        const { signature, date, ...restData } = data;
        formData = restData;
        if (signature) {
          signatureData = {
            staffSignature: signature,
            staffSignedAt: date ? new Date(date) : new Date()
          };
        }
      } else if (formKey === 'orientation') {
        // For orientation, extract signature and date (can be signature, staffSignature, or orientationSignature)
        const { signature, staffSignature, orientationSignature, date, acknowledgedAt, staffSignedAt, ...restData } = data;
        formData = restData;
        // Check all possible signature field names
        const sig = signature || staffSignature || orientationSignature;
        const sigDate = date || acknowledgedAt || staffSignedAt;
        if (sig) {
          signatureData = {
            staffSignature: sig,
            staffSignedAt: sigDate ? new Date(sigDate) : new Date()
          };
        }
      }

      // 🎯 CHECK IF FORM IS ALREADY SUBMITTED WITH SIGNATURE - CLEAR IF EDITING
      const existingSubmission = await prisma.staffFormSubmission.findUnique({
        where: { staffId_formKey: { staffId: staff.id, formKey } },
      });

      // Check if form has signature (either in column or in data JSON for overlay forms)
      const hasSignatureInColumn = !!existingSubmission?.staffSignature;
      const submissionData = existingSubmission?.data as any;
      const hasSignatureInData = submissionData && typeof submissionData === 'object' && !Array.isArray(submissionData)
        ? (formKey === 'govt_tax' 
            ? !!(submissionData.payeeSignature || submissionData.payerSignature)
            : formKey === 'super_choice_form'
            ? !!(submissionData.sectionBSignature || submissionData.sectionCSignature || submissionData.sectionDSignature)
            : formKey === 'ndis_workforce_capability'
            ? !!(submissionData.signature)
            : false)
        : false;
      const hasExistingSignature = hasSignatureInColumn || hasSignatureInData;
      
      // If form was previously submitted with signature and user is editing (not submitting with new signature)
      // This happens when user edits a form that was already signed
      if (existingSubmission?.isSubmitted && hasExistingSignature && !signatureData.staffSignature && !submit) {
        // User is editing a submitted form - clear signature and reset submission status
        console.log(`🔄 Editing submitted form ${formKey} - clearing signature`);
        signatureData = {
          staffSignature: null,
          staffSignedAt: null,
        };
        
        // Clear ALL possible signature field names from formData (universal approach)
        // Includes all overlay forms: NDIS Workforce, Tax, Super Choice, etc.
        const signatureFieldsToClear = [
          'signature', 'staffSignature', 'orientationSignature', 'employeeSignature',
          'date', 'acknowledgedAt', 'staffSignedAt', 'signatureDate', 'employeeDate', 
          'employeeSignatureDate', 'staffSignatureDate',
          // Tax form signatures
          'payeeSignature', 'payerSignature', 'payeeSignatureAt', 'payerSignatureAt',
          // Super Choice form signatures
          'sectionBSignature', 'sectionCSignature', 'sectionDSignature', 
          'sectionBDate', 'sectionCDate', 'sectionDDate'
        ];
        
        signatureFieldsToClear.forEach(field => {
          if (field in formData) {
            delete formData[field];
          }
        });
      }

      // Save to generic table (like client forms!)
      // Determine submission status: if signature was cleared, reset to false
      const wasSignatureCleared = existingSubmission?.isSubmitted && existingSubmission?.staffSignature && !signatureData.staffSignature && !submit;
      const finalIsSubmitted = wasSignatureCleared ? false : (submit ? true : (existingSubmission?.isSubmitted && signatureData.staffSignature ? true : false));
      const finalSubmittedAt = wasSignatureCleared ? null : (submit ? new Date() : (existingSubmission?.isSubmitted && signatureData.staffSignature ? existingSubmission.submittedAt : null));
      
      saved = await prisma.staffFormSubmission.upsert({
        where: { staffId_formKey: { staffId: staff.id, formKey } },
        update: { 
          data: formData,
          isSubmitted: finalIsSubmitted,
          submittedAt: finalSubmittedAt,
          ...signatureData
        },
        create: { 
          staffId: staff.id,
          formKey,
          data: formData,
          isSubmitted: !!submit,
          submittedAt: submit ? new Date() : null,
          ...signatureData
        },
      });

      // 🎯 UPDATE STAFF FORM ASSIGNMENT STATUS (like client forms)
      // When form is saved (draft), mark as in_progress
      // When form is submitted, mark as completed (if requirements met)
      try {
        // Find the form by formKey to get formId and requiresSignature flag
        const masterForm = await prisma.masterForm.findFirst({
          where: { formKey: formKey },
          select: { id: true, version: true, requiresSignature: true },
        });

        if (masterForm) {
          // Find the StaffFormAssignment for this staff and form
          const assignment = await prisma.staffFormAssignment.findUnique({
            where: {
              staffId_formId_formVersion: {
                staffId: staff.id,
                formId: masterForm.id,
                formVersion: masterForm.version,
              },
            },
          });

          if (assignment) {
            // Check if form had signature before clearing
            const hadSignatureInColumn = !!existingSubmission?.staffSignature;
            const submissionDataForCheck = existingSubmission?.data as any;
            const hadSignatureInData = submissionDataForCheck && typeof submissionDataForCheck === 'object' && !Array.isArray(submissionDataForCheck)
              ? (formKey === 'govt_tax' 
                  ? !!(submissionDataForCheck.payeeSignature || submissionDataForCheck.payerSignature)
                  : formKey === 'super_choice_form'
                  ? !!(submissionDataForCheck.sectionBSignature || submissionDataForCheck.sectionCSignature || submissionDataForCheck.sectionDSignature)
                  : formKey === 'ndis_workforce_capability'
                  ? !!(submissionDataForCheck.signature)
                  : false)
              : false;
            const hadSignature = hadSignatureInColumn || hadSignatureInData;
            
            // If form was submitted with signature and now being edited (signature cleared), reset status
            if (existingSubmission?.isSubmitted && hadSignature && !signatureData.staffSignature && !submit) {
              // Signature was cleared - reset to in_progress
              await prisma.staffFormAssignment.update({
                where: { id: assignment.id },
                data: {
                  currentStatus: 'in_progress',
                  isCompleted: false,
                },
              });
              console.log(`🔄 Reset StaffFormAssignment ${assignment.id} to in_progress - signature cleared for editing`);
            } else if (assignment.currentStatus === 'completed' && !submit) {
              // Don't update if already completed and just saving draft
              console.log(`⚠️ StaffFormAssignment ${assignment.id} already completed, skipping status update`);
            } else if (submit) {
              // Form is being submitted - check if it should be marked as completed
              const requiresSignature = masterForm.requiresSignature ?? false;
              // Check both staffSignature column AND signature fields in formData for overlay forms
              const hasSignatureInColumn = !!signatureData.staffSignature;
              // For overlay forms (tax, super choice), check if any signature fields exist in formData
              const hasSignatureInData = formKey === 'govt_tax' 
                ? !!(formData.payeeSignature || formData.payerSignature)
                : formKey === 'super_choice_form'
                ? !!(formData.sectionBSignature || formData.sectionCSignature || formData.sectionDSignature)
                : false;
              const hasSignature = hasSignatureInColumn || hasSignatureInData;
              
              // Mark as completed if:
              // 1. Form doesn't require signature (any submission counts), OR
              // 2. Form requires signature AND signature is present
              const shouldMarkCompleted = !requiresSignature || (requiresSignature && hasSignature);

              if (shouldMarkCompleted) {
                // Update assignment status to completed
                await prisma.staffFormAssignment.update({
                  where: { id: assignment.id },
                  data: {
                    currentStatus: 'completed',
                    isCompleted: true,
                  },
                });
                console.log(`✅ Updated StaffFormAssignment ${assignment.id} status to completed for form: ${formKey}`);
              } else {
                // Form submitted but missing required signature - keep as in_progress
                if (assignment.currentStatus === 'not_started') {
                  await prisma.staffFormAssignment.update({
                    where: { id: assignment.id },
                    data: {
                      currentStatus: 'in_progress',
                      isCompleted: false,
                    },
                  });
                  console.log(`📝 Updated StaffFormAssignment ${assignment.id} status to in_progress for form: ${formKey}`);
                }
              }
            } else {
              // Form is being saved (draft) - mark as in_progress if not started
              if (assignment.currentStatus === 'not_started') {
                await prisma.staffFormAssignment.update({
                  where: { id: assignment.id },
                  data: {
                    currentStatus: 'in_progress',
                    isCompleted: false,
                  },
                });
                console.log(`📝 Updated StaffFormAssignment ${assignment.id} status to in_progress for form: ${formKey}`);
              }
            }
          }
        }
      } catch (assignmentError) {
        // Don't fail the whole request if assignment update fails
        console.error('Error updating StaffFormAssignment status:', assignmentError);
      }
    }
    
    // Note: Individual form completion is tracked by the presence of data in submissions
    // The staff status should only be updated when ALL required forms are completed
    
    // Return success response with appropriate message
    const action = submit ? 'submitted' : 'saved';
    return NextResponse.json({ 
      success: true,
      message: `Form ${action} successfully`,
      id: saved.id ?? 0, 
      isSubmitted: !!submit,
      action: action
    });
    
  } catch (e: any) {
    console.error('Error saving staff form:', e);
    
    // Handle specific database errors
    if (e.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Duplicate entry',
        message: 'This form has already been submitted. Please refresh the page to see the current status.',
        code: 'DUPLICATE_ENTRY'
      }, { status: 409 });
    }
    
    if (e.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Record not found',
        message: 'The form data could not be found. Please try again.',
        code: 'RECORD_NOT_FOUND'
      }, { status: 404 });
    }
    
    if (e.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Invalid reference',
        message: 'There was an issue with the form data. Please check your inputs and try again.',
        code: 'INVALID_REFERENCE'
      }, { status: 400 });
    }
    
    // Handle connection errors
    if (e.code === 'P1001') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        message: 'Unable to save your form. Please check your internet connection and try again.',
        code: 'DATABASE_CONNECTION_ERROR'
      }, { status: 503 });
    }
    
    // Handle validation errors
    if (e.code === 'P2000') {
      return NextResponse.json({ 
        error: 'Data too long',
        message: 'Some of your form data is too long. Please shorten your inputs and try again.',
        code: 'DATA_TOO_LONG'
      }, { status: 400 });
    }
    
    // Handle timeout errors
    if (e.code === 'P1008') {
      return NextResponse.json({ 
        error: 'Operation timeout',
        message: 'The operation took too long to complete. Please try again.',
        code: 'OPERATION_TIMEOUT'
      }, { status: 408 });
    }
    
    // Generic error fallback
    return NextResponse.json({ 
      error: 'Failed to save form',
      message: 'An unexpected error occurred while saving your form. Please try again.',
      code: 'SAVE_ERROR',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined
    }, { status: 500 });
  }
}


