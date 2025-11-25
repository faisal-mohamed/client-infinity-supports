import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Load form data via signature link
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formKey: string }> }
) {
  try {
    const { token, formKey: rawFormKey } = await params;
    // Normalize formKey (handle both camelCase and snake_case)
    const formKey = rawFormKey === 'employee-details' ? 'employee_details' : 
                    rawFormKey === 'employee-welcome' ? 'employee_welcome' :
                    rawFormKey === 'support-worker' ? 'support_worker' :
                    rawFormKey.replace(/-/g, '_');
    
    // Find the staff signature batch
    const batch = await prisma.staffFormBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        signatureForms: {
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
        },
      },
    });
    
    if (!batch) {
      return NextResponse.json({ 
        error: 'Signature link not found',
      }, { status: 404 });
    }
    
    if (batch.expiresAt < new Date()) {
      return NextResponse.json({ 
        error: 'Signature link expired',
      }, { status: 410 });
    }
    
    // Find the form submission for this formKey
    const signatureForm = batch.signatureForms.find(
      (sf: any) => sf.formSubmission?.form?.formKey === formKey
    );
    
    if (!signatureForm) {
      return NextResponse.json({ 
        error: 'Form not found in batch',
      }, { status: 404 });
    }
    
    const submission = signatureForm.formSubmission;
    
    console.log(`🔍 [Signature API GET] Processing form ${formKey}:`, {
      submissionId: submission.id,
      staffSignature: submission.staffSignature ? 'EXISTS' : 'NULL',
      staffSignedAt: submission.staffSignedAt,
      dataKeys: Object.keys(submission.data as any || {}),
      dataHasSignature: !!(submission.data as any)?.signature,
      dataHasStaffSignature: !!(submission.data as any)?.staffSignature
    });
    
    // Get form data with signature fields merged back
    const formData: any = submission.data || {};
    
    console.log(`🔍 [Signature API GET] Initial formData for ${formKey}:`, {
      keys: Object.keys(formData),
      hasSignature: !!formData.signature,
      hasStaffSignature: !!formData.staffSignature
    });
    
    // Merge signature fields back into data (similar to onboard logic)
    // IMPORTANT: If staffSignature is null, explicitly clear signature fields from formData
    if (formKey === 'employee_details') {
      if (submission.staffSignature) {
        formData.employeeSignature = submission.staffSignature;
        console.log(`✅ [Signature API GET] Added employeeSignature for ${formKey}`);
      } else {
        delete formData.employeeSignature;
        console.log(`🗑️ [Signature API GET] Removed employeeSignature for ${formKey} (staffSignature is null)`);
      }
      if (submission.staffSignedAt) {
        formData.employeeSignatureDate = submission.staffSignedAt.toISOString().split('T')[0];
      } else {
        delete formData.employeeSignatureDate;
      }
    } else if (formKey === 'support_worker' || formKey === 'pre_employment_medical') {
      if (submission.staffSignature) {
        formData.signature = submission.staffSignature;
        console.log(`✅ [Signature API GET] Added signature for ${formKey}`);
      } else {
        delete formData.signature;
        console.log(`🗑️ [Signature API GET] Removed signature for ${formKey} (staffSignature is null)`);
      }
      if (submission.staffSignedAt) {
        formData.signatureDate = submission.staffSignedAt.toISOString().split('T')[0];
      } else {
        delete formData.signatureDate;
      }
    } else if (formKey === 'employee_welcome' || formKey === 'ndis_workforce_capability' || 
               formKey === 'ndis_code_of_conduct' || formKey === 'bullying_harassment_training' ||
               formKey === 'documentation_acknowledgement') {
      if (submission.staffSignature) {
        formData.signature = submission.staffSignature;
        console.log(`✅ [Signature API GET] Added signature for ${formKey}`);
      } else {
        // Signature was cleared - explicitly remove from formData
        delete formData.signature;
        delete formData.staffSignature;
        delete formData.orientationSignature;
        console.log(`🗑️ [Signature API GET] Removed ALL signature fields for ${formKey} (staffSignature is null)`);
      }
      if (submission.staffSignedAt) {
        formData.date = submission.staffSignedAt.toISOString().split('T')[0];
      } else {
        delete formData.date;
        delete formData.acknowledgedAt;
        delete formData.staffSignedAt;
      }
    } else if (formKey === 'bullying_training') {
      if (submission.staffSignature) {
        formData.staffSignature = submission.staffSignature;
        console.log(`✅ [Signature API GET] Added staffSignature for ${formKey}`);
      } else {
        delete formData.staffSignature;
        console.log(`🗑️ [Signature API GET] Removed staffSignature for ${formKey} (staffSignature is null)`);
      }
      if (submission.staffSignedAt) {
        formData.staffSignedAt = submission.staffSignedAt.toISOString();
        formData.date = submission.staffSignedAt.toISOString().split('T')[0];
      } else {
        delete formData.staffSignedAt;
        delete formData.date;
      }
    }
    
    // Pre-fill staffName from staff data if not already in formData
    // This is important for forms like documentation_acknowledgement, orientation, etc.
    if (formKey === 'documentation_acknowledgement' || formKey === 'orientation' || 
        formKey === 'fair_work_information' || formKey === 'employee_welcome' ||
        formKey === 'ndis_workforce_capability' || formKey === 'ndis_code_of_conduct' ||
        formKey === 'bullying_harassment_training') {
      if (!formData.staffName && !formData.fullName) {
        const staffName = `${batch.staff.firstName || ''} ${batch.staff.surname || ''}`.trim();
        if (staffName) {
          // Use staffName for documentation_acknowledgement, orientation, fair_work_information
          // Use fullName for ndis_workforce_capability, ndis_code_of_conduct, bullying_harassment_training
          if (formKey === 'documentation_acknowledgement' || formKey === 'orientation' || formKey === 'fair_work_information') {
            formData.staffName = staffName;
          } else {
            formData.fullName = staffName;
          }
          console.log(`✅ [Signature API GET] Pre-filled ${formKey === 'documentation_acknowledgement' || formKey === 'orientation' || formKey === 'fair_work_information' ? 'staffName' : 'fullName'} for ${formKey}: ${staffName}`);
        }
      }
    }
    
    console.log(`🔍 [Signature API GET] Final formData for ${formKey}:`, {
      keys: Object.keys(formData),
      hasSignature: !!formData.signature,
      hasStaffSignature: !!formData.staffSignature,
      hasStaffName: !!formData.staffName,
      hasFullName: !!formData.fullName,
      signatureValue: formData.signature ? 'EXISTS' : 'NULL/EMPTY'
    });
    
    // Get common fields
    const commonFields = await prisma.staffCommonField.findUnique({
      where: { staffId: batch.staffId },
    });
    
    return NextResponse.json({
      staff: {
        ...batch.staff,
        commonFields: commonFields ? [commonFields] : [],
      },
      formSubmission: submission,
      submissions: {
        [formKey]: formData
      }
    });
    
  } catch (error: any) {
    console.error('Error loading staff form via signature link:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load form data',
        message: error.message || 'An error occurred while loading your form.',
      },
      { status: 500 }
    );
  }
}

// POST - Save form data via signature link (similar to onboard but for signature batch)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formKey: string }> }
) {
  try {
    const { token, formKey: rawFormKey } = await params;
    // Normalize formKey (handle both camelCase and snake_case)
    const formKey = rawFormKey === 'employee-details' ? 'employee_details' : 
                    rawFormKey === 'employee-welcome' ? 'employee_welcome' :
                    rawFormKey === 'support-worker' ? 'support_worker' :
                    rawFormKey.replace(/-/g, '_');
    
    // Validate token format
    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ 
        error: 'Invalid signature link',
        message: 'The signature link you provided is not valid.',
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
        message: 'The data you sent is not valid.',
        code: 'INVALID_JSON'
      }, { status: 400 });
    }
    
    const { data, submit, clearSignature } = payload || {};
    
    console.log(`🔄 [API] Parsed payload:`, {
      hasData: !!data,
      hasSubmit: !!submit,
      hasClearSignature: !!clearSignature,
      clearSignatureValue: clearSignature,
      payloadKeys: Object.keys(payload || {})
    });
    
    // Validate required fields
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ 
        error: 'Missing form data',
        message: 'Please fill out the form before submitting.',
        code: 'MISSING_FORM_DATA'
      }, { status: 400 });
    }
    
    // Find the staff signature batch
    const batch = await prisma.staffFormBatch.findUnique({
      where: { 
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
          },
        },
        signatureForms: {
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
        },
      },
    });
    
    if (!batch) {
      return NextResponse.json({ 
        error: 'Signature link not found',
        message: 'This signature link is not valid or has been removed.',
        code: 'LINK_NOT_FOUND'
      }, { status: 404 });
    }
    
    if (batch.expiresAt < new Date()) {
      return NextResponse.json({ 
        error: 'Signature link expired',
        message: 'This signature link has expired. Please contact your administrator for a new link.',
        code: 'LINK_EXPIRED'
      }, { status: 410 });
    }
    
    // Find the form submission for this formKey in the batch
    const signatureForm = batch.signatureForms.find(
      (sf: any) => sf.formSubmission?.form?.formKey === formKey
    );
    
    if (!signatureForm) {
      return NextResponse.json({ 
        error: 'Form not found',
        message: 'This form is not part of your signature batch.',
        code: 'FORM_NOT_IN_BATCH'
      }, { status: 404 });
    }
    
    const submission = signatureForm.formSubmission;
    const staffId = batch.staffId;
    
    // Process form data and extract signature information
    // IMPORTANT: Start with existing submission data to preserve admin-filled fields (like managerName, reviewedBy, etc.)
    const existingSubmissionData = (submission?.data as any) || {};
    
    // When clearing signatures, also fetch admin data from dedicated tables if they exist
    // This ensures we have ALL admin data even if it's not in the generic submission data
    let adminDataFromDedicatedTable: any = {};
    if (clearSignature === true) {
      try {
        const db: any = prisma as any;
        if (formKey === 'bullying_training') {
          const dedicated = await db.staffBullyingTraining.findUnique({ where: { staffId } }).catch(() => null);
          if (dedicated && dedicated.data) {
            const dedicatedData = dedicated.data as any;
            // Extract admin fields from dedicated table
            if (dedicatedData.managerName) adminDataFromDedicatedTable.managerName = dedicatedData.managerName;
          }
        } else if (formKey === 'conflict_of_interest') {
          const dedicated = await db.staffConflictOfInterest.findUnique({ where: { staffId } }).catch(() => null);
          if (dedicated && dedicated.data) {
            const dedicatedData = dedicated.data as any;
            // Extract admin fields from dedicated table
            if (dedicatedData.reviewedBy) adminDataFromDedicatedTable.reviewedBy = dedicatedData.reviewedBy;
            if (dedicatedData.reviewerTitle) adminDataFromDedicatedTable.reviewerTitle = dedicatedData.reviewerTitle;
            if (dedicatedData.actionTaken) adminDataFromDedicatedTable.actionTaken = dedicatedData.actionTaken;
            if (dedicatedData.hrDecision) adminDataFromDedicatedTable.hrDecision = dedicatedData.hrDecision;
          }
        } else if (formKey === 'employee_details' || formKey === 'employment_details') {
          const dedicated = await db.staffEmploymentDetails.findUnique({ where: { staffId } }).catch(() => null);
          if (dedicated) {
            // Extract admin fields from dedicated table (both from data and direct columns)
            if (dedicated.employmentStatus) adminDataFromDedicatedTable.employmentStatus = dedicated.employmentStatus;
            if (dedicated.payRate) adminDataFromDedicatedTable.payRate = dedicated.payRate;
            if (dedicated.schadsLevel) adminDataFromDedicatedTable.schadsLevel = dedicated.schadsLevel;
            if (dedicated.data) {
              const dedicatedData = dedicated.data as any;
              if (dedicatedData.employmentStatus) adminDataFromDedicatedTable.employmentStatus = dedicatedData.employmentStatus;
              if (dedicatedData.payRate) adminDataFromDedicatedTable.payRate = dedicatedData.payRate;
              if (dedicatedData.schadsLevel) adminDataFromDedicatedTable.schadsLevel = dedicatedData.schadsLevel;
              if (dedicatedData.schadsScore) adminDataFromDedicatedTable.schadsLevel = dedicatedData.schadsScore;
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ [API] Could not fetch admin data from dedicated table:', error);
      }
    }
    
    // When clearing signatures, preserve ALL admin-filled data by starting with existing data
    // Only override with incoming data fields that are NOT admin fields
    let formData: any;
    if (clearSignature === true) {
      // Start with existing submission data, then merge admin data from dedicated table, then merge incoming data
      formData = { ...existingSubmissionData, ...adminDataFromDedicatedTable };
      
      // Merge non-admin fields from incoming data (staff fields only)
      // Admin fields are preserved from existingSubmissionData and adminDataFromDedicatedTable
      Object.keys(data).forEach(key => {
        // Only update if it's not an admin field
        if (formKey === 'bullying_training' && key === 'managerName') {
          // Preserve managerName - don't override
        } else if (formKey === 'conflict_of_interest' && ['reviewedBy', 'reviewerTitle', 'actionTaken', 'hrDecision'].includes(key)) {
          // Preserve these fields - don't override
        } else if ((formKey === 'employee_details' || formKey === 'employment_details') && ['employmentStatus', 'payRate', 'schadsLevel', 'schadsScore'].includes(key)) {
          // Preserve these fields - don't override
        } else {
          // Update with incoming data (staff fields)
          formData[key] = data[key];
        }
      });
      
      console.log(`🔄 [API] Preserved admin fields from submission:`, {
        managerName: formKey === 'bullying_training' ? formData.managerName : 'N/A',
        reviewedBy: formKey === 'conflict_of_interest' ? formData.reviewedBy : 'N/A',
        reviewerTitle: formKey === 'conflict_of_interest' ? formData.reviewerTitle : 'N/A',
        employmentStatus: (formKey === 'employee_details' || formKey === 'employment_details') ? formData.employmentStatus : 'N/A',
      });
      console.log(`🔄 [API] Admin data from dedicated table:`, adminDataFromDedicatedTable);
    } else {
      // Normal save - merge as usual
      formData = { ...existingSubmissionData, ...data };
    }
    
    let signatureData: any = {};
    
    // Check if this is a request to clear signature (for editing)
    // CRITICAL FIX: clearSignature is in the payload, not in data!
    const shouldClearSignature = clearSignature === true;
    
    console.log(`🔄 [API] Processing form ${formKey}:`, {
      shouldClearSignature,
      clearSignatureFromPayload: clearSignature,
      incomingDataKeys: Object.keys(data),
      existingDataKeys: Object.keys(existingSubmissionData),
      managerNamePreserved: formKey === 'bullying_training' ? (formData.managerName || 'NOT FOUND') : 'N/A',
      reviewedByPreserved: formKey === 'conflict_of_interest' ? (formData.reviewedBy || 'NOT FOUND') : 'N/A',
      payloadHasClearSignature: clearSignature === true
    });
    
    // IMPORTANT: If clearing signature, skip extraction - we'll set it to null later
    // Extract signature fields based on formKey (similar to onboard logic)
    // BUT ONLY if we're NOT clearing the signature
    if (!shouldClearSignature && formKey === 'employee_details') {
      const { employeeSignature, employeeSignatureDate, ...restData } = data;
      formData = restData;
      if (employeeSignature) {
        signatureData = {
          staffSignature: employeeSignature,
          staffSignedAt: employeeSignatureDate ? new Date(employeeSignatureDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && (formKey === 'support_worker' || formKey === 'pre_employment_medical')) {
      const { signature, signatureDate, ...restData } = data;
      formData = restData;
      if (signature) {
        signatureData = {
          staffSignature: signature,
          staffSignedAt: signatureDate ? new Date(signatureDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && (formKey === 'employee_welcome' || formKey === 'ndis_workforce_capability' || 
               formKey === 'ndis_code_of_conduct' || formKey === 'bullying_harassment_training' ||
               formKey === 'documentation_acknowledgement' || formKey === 'orientation')) {
      const { signature, staffSignature, orientationSignature, date, acknowledgedAt, staffSignedAt, ...restData } = data;
      formData = restData;
      // For orientation, check all possible signature field names
      const sig = signature || staffSignature || orientationSignature;
      const sigDate = date || acknowledgedAt || staffSignedAt;
      if (sig) {
        signatureData = {
          staffSignature: sig,
          staffSignedAt: sigDate ? new Date(sigDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && formKey === 'bullying_training') {
      const { staffSignature, staffSignedAt, date, ...restData } = data;
      formData = restData;
      if (staffSignature) {
        signatureData = {
          staffSignature: staffSignature,
          staffSignedAt: staffSignedAt || date ? new Date(staffSignedAt || date) : new Date()
        };
      }
    } else if (!shouldClearSignature && formKey === 'conflict_of_interest') {
      const { employeeSignature, employeeDate, ...restData } = data;
      formData = restData;
      if (employeeSignature) {
        signatureData = {
          staffSignature: employeeSignature,
          staffSignedAt: employeeDate ? new Date(employeeDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && formKey === 'fair_work_information') {
      // Fairwork Information - uses signature (primary) or staffSignature (alias)
      const { signature, staffSignature, acknowledgementSignature, date, acknowledgedAt, staffSignedAt, ...restData } = data;
      formData = restData;
      const sig = signature || staffSignature || acknowledgementSignature;
      const sigDate = date || acknowledgedAt || staffSignedAt;
      if (sig) {
        signatureData = {
          staffSignature: sig,
          staffSignedAt: sigDate ? new Date(sigDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && formKey === 'govt_tax') {
      // TFN Declaration - uses payeeSignature
      const { payeeSignature, staffSignature, payeeSignatureAt, staffSignedAt, ...restData } = data;
      formData = restData;
      const sig = payeeSignature || staffSignature;
      const sigDate = payeeSignatureAt || staffSignedAt;
      if (sig) {
        signatureData = {
          staffSignature: sig,
          staffSignedAt: sigDate ? new Date(sigDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && formKey === 'super_choice_form') {
      // Super Choice Form - uses sectionBSignature, sectionCSignature, or sectionDSignature
      const { sectionBSignature, sectionCSignature, sectionDSignature, staffSignature, 
              sectionBSignedAt, sectionCSignedAt, sectionDSignedAt, staffSignedAt, ...restData } = data;
      formData = restData;
      const sig = sectionBSignature || sectionCSignature || sectionDSignature || staffSignature;
      const sigDate = sectionBSignedAt || sectionCSignedAt || sectionDSignedAt || staffSignedAt;
      if (sig) {
        signatureData = {
          staffSignature: sig,
          staffSignedAt: sigDate ? new Date(sigDate) : new Date()
        };
      }
    } else if (!shouldClearSignature && formKey === 'vehicle_safety_inspection') {
      // Vehicle Safety Inspection - uses acknowledgmentData.signature
      const ackData = data.acknowledgmentData || {};
      const sig = ackData.signature || data.signature || data.staffSignature;
      const sigDate = ackData.acknowledgmentDate || data.staffSignedAt || data.signedAt;
      if (sig) {
        // Parse the date safely
        let parsedDate: Date | null = null;
        if (sigDate) {
          if (typeof sigDate === 'string') {
            // Skip if it's the string "Invalid Date"
            if (sigDate !== 'Invalid Date' && !sigDate.toLowerCase().includes('invalid')) {
              const dateObj = new Date(sigDate);
              if (!isNaN(dateObj.getTime())) {
                parsedDate = dateObj;
              }
            }
          } else if (sigDate instanceof Date) {
            parsedDate = isNaN(sigDate.getTime()) ? null : sigDate;
          }
        }
        signatureData = {
          staffSignature: sig,
          staffSignedAt: parsedDate || new Date()
        };
      }
    }
    
    // If clearing signature, set signature data to null AND clear from formData
    if (shouldClearSignature) {
      console.log(`🔄 [API] Clearing signature for form ${formKey}`);
      console.log(`🔄 [API] Current submission before clear:`, {
        id: submission.id,
        staffSignature: submission.staffSignature ? 'EXISTS' : 'NULL',
        staffSignedAt: submission.staffSignedAt,
        isSubmitted: submission.isSubmitted,
        dataKeys: Object.keys(submission.data as any || {}),
        dataHasSignature: !!(submission.data as any)?.signature
      });
      
      // CRITICAL: Explicitly set to null (not undefined) to ensure Prisma clears the field
      signatureData = {
        staffSignature: null as any,
        staffSignedAt: null as any,
      };
      
      console.log(`🔄 [API] Signature data to clear:`, signatureData);
      
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
      
      // Special handling for vehicle_safety_inspection - clear acknowledgmentData.signature
      if (formKey === 'vehicle_safety_inspection') {
        if (formData.acknowledgmentData && typeof formData.acknowledgmentData === 'object') {
          console.log(`🔄 [API] Clearing acknowledgmentData.signature for vehicle_safety_inspection`);
          // Clear signature from acknowledgmentData but preserve other fields
          formData.acknowledgmentData = {
            ...formData.acknowledgmentData,
            signature: '',
            // Keep acknowledged and acknowledgmentDate if they exist
          };
          console.log(`🔄 [API] Cleared acknowledgmentData.signature, preserved other acknowledgmentData fields`);
        }
      }
      
      console.log(`🔄 [API] Clearing signature fields from formData:`, signatureFieldsToClear);
      const clearedFields: string[] = [];
      signatureFieldsToClear.forEach(field => {
        if (field in formData) {
          clearedFields.push(field);
          delete formData[field];
        }
      });
      console.log(`🔄 [API] Cleared ${clearedFields.length} fields:`, clearedFields);
      console.log(`🔄 [API] FormData after clearing:`, Object.keys(formData));
      
      console.log(`🔄 [API] Signature data to save:`, signatureData);
    }

    // Update or create form submission
    console.log(`🔄 [API] Upserting form submission for ${formKey}:`, {
      staffId,
      formKey,
      shouldClearSignature,
      signatureData,
      isSubmitted: shouldClearSignature ? false : (!!submit),
      formDataKeys: Object.keys(formData)
    });
    
    // CRITICAL: For Prisma, we need to explicitly set null values when clearing
    const updateData: any = {
      data: formData,
      isSubmitted: shouldClearSignature ? false : (!!submit),
      submittedAt: shouldClearSignature ? null : (submit ? new Date() : null),
      updatedAt: new Date(),
    };
    
    // When clearing signature, explicitly set to null (Prisma requires this)
    if (shouldClearSignature) {
      updateData.staffSignature = null;
      updateData.staffSignedAt = null;
      // Also clear admin signatures when clearing for editing
      updateData.adminSignature = null;
      updateData.adminSignedAt = null;
      console.log(`🔄 [API] Explicitly setting staffSignature, staffSignedAt, adminSignature, and adminSignedAt to null in update`);
      
      // Clear form-specific admin signatures from data JSON
      // IMPORTANT: All admin data (managerName, reviewedBy, etc.) is already preserved in formData
      // We only delete signature-related fields, never admin-filled data
      if (formKey === 'bullying_training') {
        // Only delete signature fields - preserve ALL other fields including managerName
        delete formData.managerSignature;
        delete formData.managerSignedAt;
        delete formData.staffSignature;
        delete formData.staffSignedAt;
        // managerName and ALL other fields are preserved
        console.log(`🔄 [API] Cleared managerSignature/managerSignedAt, preserved managerName: ${formData.managerName || 'N/A'}`);
      } else if (formKey === 'conflict_of_interest') {
        // Only delete signature fields - preserve ALL other fields including reviewedBy, reviewerTitle, actionTaken, hrDecision
        delete formData.reviewerSignature;
        delete formData.reviewerDate;
        delete formData.employeeSignature;
        delete formData.employeeDate;
        delete formData.staffSignature;
        delete formData.staffSignedAt;
        // reviewedBy, reviewerTitle, actionTaken, hrDecision and ALL other fields are preserved
        console.log(`🔄 [API] Cleared reviewerSignature/reviewerDate, preserved reviewer info: reviewedBy=${formData.reviewedBy || 'N/A'}, reviewerTitle=${formData.reviewerTitle || 'N/A'}, actionTaken=${formData.actionTaken || 'N/A'}, hrDecision=${formData.hrDecision || 'N/A'}`);
      } else if (formKey === 'employee_details' || formKey === 'employment_details') {
        // Only delete signature fields - preserve ALL other fields including employmentStatus, payRate, schadsLevel
        delete formData.employeeSignature;
        delete formData.employeeSignatureDate;
        delete formData.staffSignature;
        delete formData.staffSignedAt;
        // employmentStatus, payRate, schadsLevel and ALL other fields are preserved
        console.log(`🔄 [API] Cleared employeeSignature, preserved employment data: employmentStatus=${formData.employmentStatus || 'N/A'}, payRate=${formData.payRate || 'N/A'}, schadsLevel=${formData.schadsLevel || formData.schadsScore || 'N/A'}`);
      } else {
        // Generic forms - only delete signature fields
        delete formData.signature;
        delete formData.staffSignature;
        delete formData.signatureDate;
        delete formData.staffSignedAt;
      }
      updateData.data = formData; // Update with cleared admin signature fields but ALL admin data preserved
    } else {
      // When not clearing, use signatureData (which may be empty object)
      Object.assign(updateData, signatureData);
      
      // CRITICAL: Also extract signature from formData and save to staffSignature column
      // This ensures completion tracking works even if signatureData doesn't have it
      if (submit && !updateData.staffSignature) {
        let extractedSignature: string | null = null;
        let extractedSignedAt: Date | null = null;
        
        if (formKey === 'fair_work_information') {
          extractedSignature = formData.acknowledgementSignature || formData.signature || formData.staffSignature || null;
          extractedSignedAt = formData.acknowledgedAt || formData.staffSignedAt || formData.date ? new Date(formData.date) : null;
        } else if (formKey === 'govt_tax') {
          extractedSignature = formData.payeeSignature || formData.staffSignature || null;
          extractedSignedAt = formData.payeeSignatureAt || formData.staffSignedAt || null;
        } else if (formKey === 'super_choice_form') {
          extractedSignature = formData.sectionBSignature || formData.sectionCSignature || formData.sectionDSignature || formData.staffSignature || null;
          extractedSignedAt = formData.sectionBSignedAt || formData.sectionCSignedAt || formData.sectionDSignedAt || formData.staffSignedAt || null;
        } else {
          extractedSignature = formData.signature || formData.staffSignature || null;
          extractedSignedAt = formData.signatureDate || formData.staffSignedAt || formData.signedAt ? new Date(formData.signedAt) : null;
        }
        
        if (extractedSignature && !extractedSignedAt) {
          extractedSignedAt = new Date();
        }
        
        if (extractedSignature) {
          updateData.staffSignature = extractedSignature;
          updateData.staffSignedAt = extractedSignedAt;
          console.log(`📋 [Signature API] Extracted and saved signature for ${formKey} to staffSignature column`);
        }
      }
    }
    
    console.log(`🔄 [API] Update data for upsert:`, {
      keys: Object.keys(updateData),
      staffSignature: updateData.staffSignature,
      staffSignedAt: updateData.staffSignedAt,
      shouldClearSignature
    });
    
    const saved = await prisma.staffFormSubmission.upsert({
      where: { 
        staffId_formKey: { 
          staffId: staffId, 
          formKey: formKey 
        } 
      },
      update: updateData,
      create: { 
        staffId: staffId,
        formId: submission.form?.id || null,
        formVersion: submission.form?.version || 1,
        formKey: formKey,
        data: formData,
        isSubmitted: !!submit,
        submittedAt: submit ? new Date() : null,
        filledByAdmin: false,
        ...signatureData
      },
    });
    
    // Re-fetch the saved submission to verify it was actually saved correctly
    const verified = await prisma.staffFormSubmission.findUnique({
      where: { id: saved.id }
    });
    
    console.log(`✅ [API] Form submission saved:`, {
      id: saved.id,
      staffSignature: saved.staffSignature ? 'EXISTS - ERROR!' : 'NULL - SUCCESS',
      staffSignedAt: saved.staffSignedAt,
      isSubmitted: saved.isSubmitted,
      dataKeys: Object.keys(saved.data as any || {}),
      dataHasSignature: !!(saved.data as any)?.signature,
      dataHasStaffSignature: !!(saved.data as any)?.staffSignature
    });
    
    console.log(`🔍 [API] Verified submission from DB:`, {
      id: verified?.id,
      staffSignature: verified?.staffSignature ? 'EXISTS' : 'NULL',
      staffSignedAt: verified?.staffSignedAt,
      dataKeys: Object.keys((verified?.data as any) || {}),
      dataHasSignature: !!((verified?.data as any)?.signature),
      dataHasStaffSignature: !!((verified?.data as any)?.staffSignature),
      dataSignatureValue: (verified?.data as any)?.signature ? 'EXISTS' : 'NULL/EMPTY'
    });
    
    // Verify signatures were actually cleared
    if (shouldClearSignature) {
      const staffSigStillExists = saved.staffSignature || (saved.data as any)?.signature || (saved.data as any)?.staffSignature;
      const adminSigStillExists = saved.adminSignature || 
        (formKey === 'bullying_training' && (saved.data as any)?.managerSignature) ||
        (formKey === 'conflict_of_interest' && (saved.data as any)?.reviewerSignature);
      
      if (staffSigStillExists || adminSigStillExists) {
        console.error(`❌ [API] CRITICAL ERROR: Signatures were NOT cleared!`, {
          staffSignature: saved.staffSignature,
          adminSignature: saved.adminSignature,
          dataSignature: (saved.data as any)?.signature,
          dataStaffSignature: (saved.data as any)?.staffSignature,
          managerSignature: (saved.data as any)?.managerSignature,
          reviewerSignature: (saved.data as any)?.reviewerSignature
        });
        // Return error response
        return NextResponse.json({
          success: false,
          error: 'Failed to clear signatures',
          message: 'The signatures could not be cleared. Please try again.',
          submission: saved, // Include so frontend can verify
        }, { status: 500 });
      } else {
        console.log(`✅ [API] All signatures (staff and admin) successfully cleared and verified`);
      }
    }
    
    // 🎯 CRITICAL: Also clear signature from dedicated tables for backward compatibility
    // Some forms (like NDIS Workforce Capability) have dedicated tables that also store signatures
    if (shouldClearSignature) {
      try {
        if (formKey === 'ndis_workforce_capability') {
          console.log(`🔄 [API] Clearing signature from StaffNdisWorkforceCapability dedicated table`);
          const dedicatedRecord = await prisma.staffNdisWorkforceCapability.findUnique({
            where: { staffId: staffId }
          });
          
          if (dedicatedRecord) {
            const dedicatedData = (dedicatedRecord.data as any) || {};
            // Remove signature fields from data JSON
            delete dedicatedData.signature;
            delete dedicatedData.staffSignature;
            delete dedicatedData.date;
            delete dedicatedData.staffSignedAt;
            
            await prisma.staffNdisWorkforceCapability.update({
              where: { staffId: staffId },
              data: {
                staffSignature: null,
                staffSignedAt: null,
                data: dedicatedData
              }
            });
            console.log(`✅ [API] Cleared signature from StaffNdisWorkforceCapability table`);
          } else {
            console.log(`ℹ️ [API] No dedicated StaffNdisWorkforceCapability record found for staffId ${staffId}`);
          }
        } else if (formKey === 'pre_employment_medical') {
          console.log(`🔄 [API] Clearing signature from StaffPreEmploymentMedical dedicated table`);
          await prisma.staffPreEmploymentMedical.updateMany({
            where: { staffId: staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null
            }
          });
        } else if (formKey === 'bullying_harassment_training') {
          console.log(`🔄 [API] Clearing signature from StaffBullyingHarassmentTraining dedicated table`);
          await prisma.staffBullyingHarassmentTraining.updateMany({
            where: { staffId: staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null
            }
          });
        } else if (formKey === 'bullying_training') {
          console.log(`🔄 [API] Clearing signatures from StaffBullyingTraining dedicated table`);
          const dedicatedRecord = await prisma.staffBullyingTraining.findUnique({
            where: { staffId: staffId }
          });
          
          if (dedicatedRecord) {
            const dedicatedData = (dedicatedRecord.data as any) || {};
            // IMPORTANT: Create a new object with all existing data, then only delete signature fields
            const preservedData = { ...dedicatedData };
            // Clear only signatures - keep managerName and ALL other admin data
            delete preservedData.managerSignature;
            delete preservedData.managerSignedAt;
            delete preservedData.staffSignature;
            delete preservedData.staffSignedAt;
            // DO NOT delete managerName or any other fields
            
            await prisma.staffBullyingTraining.update({
              where: { staffId: staffId },
              data: {
                staffSignature: null,
                staffSignedAt: null,
                adminSignature: null,
                adminSignedAt: null,
                data: preservedData // Keep ALL admin data including managerName
              }
            });
            console.log(`✅ [API] Cleared all signatures from StaffBullyingTraining table (kept managerName: ${preservedData.managerName || 'N/A'})`);
          }
        } else if (formKey === 'conflict_of_interest') {
          console.log(`🔄 [API] Clearing signatures from StaffConflictOfInterest dedicated table`);
          const dedicatedRecord = await prisma.staffConflictOfInterest.findUnique({
            where: { staffId: staffId }
          });
          
          if (dedicatedRecord) {
            const dedicatedData = (dedicatedRecord.data as any) || {};
            // IMPORTANT: Create a new object with all existing data, then only delete signature fields
            const preservedData = { ...dedicatedData };
            // Clear only signatures - keep reviewedBy, reviewerTitle, actionTaken, hrDecision and ALL other admin data
            delete preservedData.reviewerSignature;
            delete preservedData.reviewerDate;
            delete preservedData.staffSignature;
            delete preservedData.staffSignedAt;
            // DO NOT delete reviewedBy, reviewerTitle, actionTaken, hrDecision or any other fields
            
            await prisma.staffConflictOfInterest.update({
              where: { staffId: staffId },
              data: {
                staffSignature: null,
                staffSignedAt: null,
                adminSignature: null,
                adminSignedAt: null,
                data: preservedData // Keep ALL admin data including reviewedBy, reviewerTitle, etc.
              }
            });
            console.log(`✅ [API] Cleared all signatures from StaffConflictOfInterest table (kept reviewer info: reviewedBy=${preservedData.reviewedBy || 'N/A'}, reviewerTitle=${preservedData.reviewerTitle || 'N/A'})`);
          }
        } else if (formKey === 'employee_details' || formKey === 'employment_details') {
          console.log(`🔄 [API] Clearing signatures from StaffEmploymentDetails dedicated table`);
          const dedicatedRecord = await prisma.staffEmploymentDetails.findUnique({
            where: { staffId: staffId }
          });
          
          if (dedicatedRecord) {
            // IMPORTANT: Keep ALL existing data in the dedicated table - only clear signature columns
            await prisma.staffEmploymentDetails.update({
              where: { staffId: staffId },
              data: {
                staffSignature: null,
                staffSignedAt: null,
                adminSignature: null,
                adminSignedAt: null,
                // Keep ALL other fields including employmentStatus, payRate, schadsLevel, data JSON, etc.
                // DO NOT update data field - it will preserve all admin-filled data
              }
            });
            console.log(`✅ [API] Cleared all signatures from StaffEmploymentDetails table (kept all employment data)`);
          }
        } else if (formKey === 'ndis_code_of_conduct') {
          console.log(`🔄 [API] Clearing signature from StaffNdisCodeOfConduct dedicated table`);
          await prisma.staffNdisCodeOfConduct.updateMany({
            where: { staffId: staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null
            }
          });
        }
      } catch (dedicatedTableError: any) {
        // Don't fail if dedicated table doesn't exist or update fails
        console.warn(`⚠️ [API] Could not clear dedicated table for ${formKey}:`, dedicatedTableError.message);
      }
    }
    
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
        let assignment = await prisma.staffFormAssignment.findUnique({
          where: {
            staffId_formId_formVersion: {
              staffId: staffId,
              formId: masterForm.id,
              formVersion: masterForm.version,
            },
          },
        });

        // Fallback: If not found with unique constraint, try findFirst
        if (!assignment) {
          console.warn(`⚠️ [Signature API] Assignment not found with unique constraint, trying findFirst...`);
          assignment = await prisma.staffFormAssignment.findFirst({
            where: {
              staffId: staffId,
              formId: masterForm.id,
              formVersion: masterForm.version,
            },
          });
        }

        if (assignment) {
          console.log(`✅ [Signature API] Found StaffFormAssignment ${assignment.id} for form: ${formKey}, staffId: ${staffId}, formId: ${masterForm.id}, formVersion: ${masterForm.version}`);
            // If signature was cleared, reset status to in_progress (all signatures cleared)
            if (shouldClearSignature) {
              await prisma.staffFormAssignment.update({
                where: { id: assignment.id },
                data: {
                  currentStatus: 'in_progress',
                  isCompleted: false,
                },
              });
              console.log(`🔄 Reset StaffFormAssignment ${assignment.id} to in_progress - all signatures cleared for editing`);
            } else if (assignment.currentStatus === 'completed' && !submit) {
              // Don't update if already completed and just saving draft
              console.log(`⚠️ StaffFormAssignment ${assignment.id} already completed, skipping status update`);
            } else if (submit) {
              // Form is being submitted - check if it should be marked as completed
              // Vehicle Safety Inspection has an acknowledgement form with signature - always require signature
              let requiresSignature = masterForm.requiresSignature ?? false;
              if (formKey === 'vehicle_safety_inspection') {
                requiresSignature = true; // Always require signature for acknowledgment form
              }
              
              // Check both staffSignature column AND signature fields in formData for overlay forms
              // For vehicle_safety_inspection, check acknowledgment signature
              let hasSignatureInColumn = false;
              let hasSignatureInData = false;
              let hasSignature = false;
              
              if (formKey === 'vehicle_safety_inspection') {
                // Vehicle Safety Inspection - check acknowledgment signature
                const ackData = formData.acknowledgmentData || {};
                hasSignatureInColumn = !!signatureData.staffSignature;
                hasSignatureInData = !!(formData.signature || formData.staffSignature || ackData.signature);
                hasSignature = hasSignatureInColumn || hasSignatureInData;
              } else {
                hasSignatureInColumn = !!signatureData.staffSignature;
                // For overlay forms (tax, super choice), check if any signature fields exist in formData
                hasSignatureInData = formKey === 'govt_tax' 
                  ? !!(formData.payeeSignature || formData.payerSignature)
                  : formKey === 'super_choice_form'
                  ? !!(formData.sectionBSignature || formData.sectionCSignature || formData.sectionDSignature)
                  : false;
                hasSignature = hasSignatureInColumn || hasSignatureInData;
              }
              
              // Check if form requires admin/manager signature (forms that need both staff and admin signatures)
              const formsRequiringAdminSignature = [
                'bullying_training',
                'conflict_of_interest',
                'employee_details',
                'employment_details'
              ];
              const requiresAdminSignature = formsRequiringAdminSignature.includes(formKey);
              
              // Check if admin signature exists - use the saved submission
              let hasAdminSignature = false;
              if (requiresAdminSignature) {
                // Check the saved submission for admin signature
                hasAdminSignature = !!saved?.adminSignature || 
                  (formKey === 'bullying_training' && !!(saved?.data as any)?.managerSignature) ||
                  (formKey === 'conflict_of_interest' && !!(saved?.data as any)?.reviewerSignature) ||
                  (formKey === 'employee_details' && !!saved?.adminSignature);
              }
            
            // Status logic:
            // 1. If form doesn't require signature → completed
            // 2. If form requires signature but NOT admin signature → completed when staff signs
            // 3. If form requires admin signature:
            //    - If only staff signed → in_progress (admin review required)
            //    - If both staff and admin signed → completed
            let newStatus = 'in_progress';
            let shouldMarkCompleted = false;
            
            if (!requiresSignature) {
              // Form doesn't require any signature
              newStatus = 'completed';
              shouldMarkCompleted = true;
            } else if (requiresAdminSignature) {
              // Form requires both staff and admin signatures
              if (hasSignature && hasAdminSignature) {
                // Both signatures present → completed
                newStatus = 'completed';
                shouldMarkCompleted = true;
              } else if (hasSignature) {
                // Only staff signed → in_progress (admin review required)
                newStatus = 'in_progress';
                shouldMarkCompleted = false;
              } else {
                // No signatures → in_progress
                newStatus = 'in_progress';
                shouldMarkCompleted = false;
              }
            } else if (hasSignature) {
              // Form requires signature but not admin signature, and staff has signed
              newStatus = 'completed';
              shouldMarkCompleted = true;
            } else {
              // Form requires signature but staff hasn't signed
              newStatus = 'in_progress';
              shouldMarkCompleted = false;
            }

            // Update assignment status
            await prisma.staffFormAssignment.update({
              where: { id: assignment.id },
              data: {
                currentStatus: newStatus,
                isCompleted: shouldMarkCompleted,
              },
            });
            console.log(`✅ Updated StaffFormAssignment ${assignment.id} status to ${newStatus} for form: ${formKey} (staff signed: ${hasSignature}, admin signed: ${hasAdminSignature})`);
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
        } else {
          console.error(`❌ [Signature API] StaffFormAssignment NOT FOUND for form: ${formKey}, staffId: ${staffId}, formId: ${masterForm.id}, formVersion: ${masterForm.version}`);
          console.error(`   Looking for: staffId=${staffId}, formId=${masterForm.id}, formVersion=${masterForm.version}`);
        }
      } else {
        console.error(`❌ [Signature API] MasterForm NOT FOUND for formKey: ${formKey}`);
      }
    } catch (assignmentError) {
      console.error(`❌ [Signature API] Error updating StaffFormAssignment:`, assignmentError);
      // Don't fail the whole request if assignment update fails
      console.error('Error updating StaffFormAssignment status:', assignmentError);
    }

    // If form was submitted, check if batch is complete
    if (submit) {
      // Check if all forms in batch are completed (signed or filled)
      const allSignatureForms = await prisma.staffSignatureBatchForm.findMany({
        where: { batchId: batch.id },
        include: {
          formSubmission: {
            select: {
              id: true,
              staffSignature: true,
              isSubmitted: true,
              data: true,
              form: {
                select: {
                  formKey: true,
                  requiresSignature: true,
                },
              },
            },
          },
        },
      });
      
      const formsRequiringSignature = allSignatureForms.filter(
        (sf: any) => sf.formSubmission.form.requiresSignature === true
      );
      
      const formsNotRequiringSignature = allSignatureForms.filter(
        (sf: any) => sf.formSubmission.form.requiresSignature !== true
      );
      
      // Check if all forms requiring signature are signed
      const allSigned = formsRequiringSignature.every((sf: any) => {
        const submission = sf.formSubmission;
        const formKey = submission.form?.formKey;
        const data = submission.data || {};
        
        // Check staffSignature column first
        if (submission.staffSignature !== null && submission.staffSignature !== undefined && submission.staffSignature !== "") {
          return true;
        }
        
        // Check form-specific signature fields in data JSON
        if (formKey === 'fair_work_information') {
          return !!(data.acknowledgementSignature || data.signature || data.staffSignature);
        }
        if (formKey === 'govt_tax') {
          return !!(data.payeeSignature || data.staffSignature);
        }
        if (formKey === 'super_choice_form') {
          return !!(data.sectionBSignature || data.sectionCSignature || data.sectionDSignature || data.staffSignature);
        }
        
        // Generic check
        return !!(data.signature || data.staffSignature);
      });
      
      // Check if all forms not requiring signature are filled/submitted
      const allFilled = formsNotRequiringSignature.every((sf: any) => {
        const submission = sf.formSubmission;
        const formKey = submission.form?.formKey;
        const data = submission.data || {};
        
        // If form is submitted, consider it completed
        if (submission.isSubmitted === true) {
          return true;
        }
        
        // Fairwork Information - check for acknowledgement
        if (formKey === 'fair_work_information') {
          const hasAck = !!(data.acknowledgementSignature || data.signature || data.staffSignature || submission.staffSignature);
          const hasName = !!(data.staffName || data.name);
          const hasDate = !!(data.date || data.acknowledgedAt || data.staffSignedAt);
          const hasAcknowledged = !!(data.acknowledged || data.readAcknowledgement || data.fairworkAcknowledged);
          return hasAck && hasName && hasDate && hasAcknowledged;
        }
        
        // For other forms, check if they have meaningful data
        if (submission.staffSignature || data.signature || data.staffSignature) {
          return true;
        }
        
        return false;
      });
      
      const totalFormsToComplete = formsRequiringSignature.length + formsNotRequiringSignature.length;
      const allCompleted = (formsRequiringSignature.length === 0 || allSigned) && 
                          (formsNotRequiringSignature.length === 0 || allFilled) &&
                          totalFormsToComplete > 0;
      
      if (allCompleted && !batch.isCompleted) {
        await prisma.staffFormBatch.update({
          where: { id: batch.id },
          data: {
            isCompleted: true,
            completedAt: new Date(),
          },
        });
        
        console.log(`✅ [Signature API] Batch ${batch.id} marked as completed - all ${totalFormsToComplete} forms completed`);
        
        // Create notifications for admins
        try {
          const allAdmins = await prisma.admin.findMany({ select: { id: true } });
          await Promise.all(
            allAdmins.map((admin: any) =>
              prisma.staffSubmissionNotification.create({
                data: {
                  adminId: admin.id,
                  staffId: staffId,
                  formSubmissionId: saved.id,
                },
              }).catch(() => null)
            )
          );
        } catch (notifError) {
          console.error('Error creating notifications:', notifError);
        }
      }
    }
    
    // Return the verified submission (not just saved) so frontend can verify signature was cleared
    const finalSubmission = verified || saved;
    
    return NextResponse.json({
      success: true,
      message: submit ? 'Form submitted successfully' : 'Form saved successfully',
      submission: finalSubmission, // Use verified submission if available
      signatureCleared: shouldClearSignature ? !finalSubmission.staffSignature : undefined,
    });
    
  } catch (error: any) {
    console.error('Error saving staff form via signature link:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save form',
        message: error.message || 'An error occurred while saving your form.',
        code: 'SAVE_FAILED'
      },
      { status: 500 }
    );
  }
}

