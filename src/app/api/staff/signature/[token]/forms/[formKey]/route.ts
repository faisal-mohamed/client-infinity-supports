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
    let formData: any = { ...data };
    let signatureData: any = {};
    
    // Check if this is a request to clear signature (for editing)
    // CRITICAL FIX: clearSignature is in the payload, not in data!
    const shouldClearSignature = clearSignature === true;
    
    console.log(`🔄 [API] Processing form ${formKey}:`, {
      shouldClearSignature,
      clearSignatureFromPayload: clearSignature,
      incomingDataKeys: Object.keys(data),
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
      console.log(`🔄 [API] Explicitly setting staffSignature and staffSignedAt to null in update`);
    } else {
      // When not clearing, use signatureData (which may be empty object)
      Object.assign(updateData, signatureData);
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
    
    // Verify signature was actually cleared
    if (shouldClearSignature && (saved.staffSignature || (saved.data as any)?.signature || (saved.data as any)?.staffSignature)) {
      console.error(`❌ [API] CRITICAL ERROR: Signature was NOT cleared!`, {
        staffSignature: saved.staffSignature,
        dataSignature: (saved.data as any)?.signature,
        dataStaffSignature: (saved.data as any)?.staffSignature
      });
      // Return error response
      return NextResponse.json({
        success: false,
        error: 'Failed to clear signature',
        message: 'The signature could not be cleared. Please try again.',
        submission: saved, // Include so frontend can verify
      }, { status: 500 });
    } else if (shouldClearSignature) {
      console.log(`✅ [API] Signature successfully cleared and verified`);
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
          console.log(`🔄 [API] Clearing signature from StaffBullyingTraining dedicated table`);
          await prisma.staffBullyingTraining.updateMany({
            where: { staffId: staffId },
            data: {
              staffSignature: null,
              staffSignedAt: null
            }
          });
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
        const assignment = await prisma.staffFormAssignment.findUnique({
          where: {
            staffId_formId_formVersion: {
              staffId: staffId,
              formId: masterForm.id,
              formVersion: masterForm.version,
            },
          },
        });

        if (assignment) {
            // If signature was cleared, reset status to in_progress
            if (shouldClearSignature) {
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

    // If form was submitted with signature, check if batch is complete
    if (submit && signatureData.staffSignature) {
      // Check if all forms in batch are signed
      const allSignatureForms = await prisma.staffSignatureBatchForm.findMany({
        where: { batchId: batch.id },
        include: {
          formSubmission: {
            select: {
              id: true,
              staffSignature: true,
              form: {
                select: {
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
      
      const allSigned = formsRequiringSignature.every(
        (sf: any) => sf.formSubmission.staffSignature !== null && 
                     sf.formSubmission.staffSignature !== undefined &&
                     sf.formSubmission.staffSignature !== ""
      );
      
      if (allSigned && formsRequiringSignature.length > 0 && !batch.isCompleted) {
        await prisma.staffFormBatch.update({
          where: { id: batch.id },
          data: {
            isCompleted: true,
            completedAt: new Date(),
          },
        });
        
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

