/**
 * Helper function to check if staff batch is completed and trigger email
 * This is called when admin completes their part of a form that requires both staff and admin signatures
 */
import { prisma } from '@/lib/prisma';

export async function checkAndTriggerStaffBatchEmail(
  staffId: number,
  formKey: string
): Promise<void> {
  try {
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] ===== STARTING BATCH EMAIL CHECK =====`);
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Checking batch completion for staffId: ${staffId}, formKey: ${formKey}`);
    
    // Find the assignment for this form
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Searching for assignment with staffId: ${staffId}, formKey: ${formKey}`);
    const assignment = await prisma.staffFormAssignment.findFirst({
      where: {
        staffId: staffId,
        form: {
          formKey: formKey,
        },
      },
      include: {
        batch: {
          include: {
            signatureForms: {
              include: {
                formSubmission: {
                  include: {
                    form: {
                      select: {
                        id: true,
                        title: true,
                        formKey: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Assignment lookup result:`, {
      found: !!assignment,
      assignmentId: assignment?.id,
      batchId: assignment?.batchId,
      batchFound: !!assignment?.batch,
      batchIsCompleted: assignment?.batch?.isCompleted,
      currentStatus: assignment?.currentStatus,
      isCompleted: assignment?.isCompleted
    });

    if (!assignment) {
      console.log(`⚠️ [STAFF BATCH EMAIL HELPER] No assignment found for staffId: ${staffId}, formKey: ${formKey}`);
      // Try to find any assignment for this staff to debug
      const anyAssignment = await prisma.staffFormAssignment.findFirst({
        where: { staffId: staffId },
        include: { form: { select: { formKey: true, title: true } } }
      });
      console.log(`🔍 [STAFF BATCH EMAIL HELPER] Debug: Found other assignments for this staff:`, {
        found: !!anyAssignment,
        otherFormKey: anyAssignment?.form?.formKey,
        otherFormTitle: anyAssignment?.form?.title
      });
      return;
    }

    if (!assignment.batch) {
      console.log(`⚠️ [STAFF BATCH EMAIL HELPER] Assignment found but no batch associated`);
      return;
    }

    const batch = assignment.batch;
    
    // Get all assignments for this batch
    const allAssignments = await prisma.staffFormAssignment.findMany({
      where: {
        batchId: batch.id,
      },
      include: {
        form: {
          select: {
            id: true,
            title: true,
            formKey: true,
            requiresSignature: true,
          },
        },
      },
    });

    // Fetch all submissions for this batch to verify signatures
    const formKeysInBatch = allAssignments.map(a => a.form.formKey);
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Form keys in batch:`, formKeysInBatch);
    
    const allSubmissions = await prisma.staffFormSubmission.findMany({
      where: {
        staffId: staffId,
        formKey: { in: formKeysInBatch }
      },
      select: {
        id: true,
        formKey: true,
        staffSignature: true,
        staffSignedAt: true,
        adminSignature: true,
        isSubmitted: true,
        data: true,
      }
    });

    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Submissions found:`, {
      count: allSubmissions.length,
      submissions: allSubmissions.map(s => ({
        formKey: s.formKey,
        hasStaffSignature: !!s.staffSignature,
        hasAdminSignature: !!s.adminSignature,
        isSubmitted: s.isSubmitted
      }))
    });

    // Helper to check if a form requires admin signature
    const requiresAdminSignature = (key: string): boolean => {
      const formsRequiringAdminSignatureList = [
        'bullying_training',
        'conflict_of_interest',
        'employee_details',
      ];
      return formsRequiringAdminSignatureList.includes(key);
    };

    // Determine if all forms in the batch are truly completed (staff + admin signatures if required)
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Checking completion for each form in batch...`);
    const allFormsCompleted = allAssignments.every(assignment => {
      const submission = allSubmissions.find(s => s.formKey === assignment.form.formKey);
      if (!submission) {
        console.log(`  ⚠️ [STAFF BATCH EMAIL HELPER] No submission found for formKey: ${assignment.form.formKey}`);
        return false; // No submission means not completed
      }

      const hasStaffSignature = !!submission.staffSignature;
      const hasAdminSignature = !!submission.adminSignature;
      const requiresAdmin = requiresAdminSignature(assignment.form.formKey);

      console.log(`  🔍 [STAFF BATCH EMAIL HELPER] Form ${assignment.form.formKey}:`, {
        hasStaffSignature,
        hasAdminSignature,
        requiresAdmin,
        isSubmitted: submission.isSubmitted,
        assignmentStatus: assignment.currentStatus,
        assignmentIsCompleted: assignment.isCompleted
      });

      if (requiresAdmin) {
        // For forms requiring admin signature, check both staff and admin signatures
        const adminSigCheck = hasAdminSignature || 
          (assignment.form.formKey === 'bullying_training' && !!(submission.data as any)?.managerSignature) ||
          (assignment.form.formKey === 'conflict_of_interest' && (!!submission.adminSignature || !!(submission.data as any)?.reviewerSignature));
        const isCompleted = hasStaffSignature && adminSigCheck;
        console.log(`    → Requires admin: ${isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED'}`);
        return isCompleted;
      } else if (assignment.form.formKey === 'pre_employment_medical') {
        // Pre-Employment Medical requires all 3 signatures:
        // 1. signature (Informed Consent)
        // 2. disclosureAdviceSignature (Disclosure Advice)
        // 3. declarationSignature (Declaration)
        console.log(`    🔍 [PRE-EMPLOYMENT MEDICAL] Detailed signature check in batch email helper:`);
        const formData = (submission.data as any) || {};
        const hasSignature1 = !!(formData.signature || submission.staffSignature);
        const hasSignature2 = !!formData.disclosureAdviceSignature;
        const hasSignature3 = !!formData.declarationSignature;
        const isCompleted = hasSignature1 && hasSignature2 && hasSignature3;
        
        console.log(`    🔍 [PRE-EMPLOYMENT MEDICAL] Signature details:`, {
          submissionId: submission.id,
          staffSignatureInColumn: !!submission.staffSignature,
          staffSignatureLength: submission.staffSignature?.length || 0,
          formDataKeys: Object.keys(formData),
          signature1: {
            exists: hasSignature1,
            inFormData: !!formData.signature,
            inColumn: !!submission.staffSignature,
            length: formData.signature?.length || 0
          },
          signature2: {
            exists: hasSignature2,
            inFormData: !!formData.disclosureAdviceSignature,
            length: formData.disclosureAdviceSignature?.length || 0
          },
          signature3: {
            exists: hasSignature3,
            inFormData: !!formData.declarationSignature,
            length: formData.declarationSignature?.length || 0
          },
          isCompleted: isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED',
          missingSignatures: [
            !hasSignature1 && 'signature1 (Informed Consent)',
            !hasSignature2 && 'signature2 (Disclosure Advice)',
            !hasSignature3 && 'signature3 (Declaration)'
          ].filter(Boolean)
        });
        
        return isCompleted;
      } else if (assignment.form.formKey === 'fair_work_information') {
        // Fairwork Information requires: signature, name, date, and acknowledged flag
        console.log(`    🔍 [FAIRWORK INFORMATION] Detailed completion check in batch email helper:`);
        const formData = (submission.data as any) || {};
        const hasSignature = !!(formData.signature || formData.staffSignature || formData.acknowledgementSignature || submission.staffSignature);
        const hasName = !!(formData.staffName || formData.name);
        const hasDate = !!(formData.date || formData.acknowledgedAt || formData.staffSignedAt);
        const hasAcknowledged = !!(formData.acknowledged || formData.readAcknowledgement || formData.fairworkAcknowledged);
        const isCompleted = hasSignature && hasName && hasDate && hasAcknowledged;
        
        console.log(`    🔍 [FAIRWORK INFORMATION] Completion details:`, {
          submissionId: submission.id,
          isSubmitted: submission.isSubmitted,
          staffSignatureInColumn: !!submission.staffSignature,
          formDataKeys: Object.keys(formData),
          hasSignature: {
            exists: hasSignature,
            inFormData: !!(formData.signature || formData.staffSignature || formData.acknowledgementSignature),
            inColumn: !!submission.staffSignature
          },
          hasName: {
            exists: hasName,
            staffName: !!formData.staffName,
            name: !!formData.name
          },
          hasDate: {
            exists: hasDate,
            date: !!formData.date,
            acknowledgedAt: !!formData.acknowledgedAt,
            staffSignedAt: !!formData.staffSignedAt
          },
          hasAcknowledged: {
            exists: hasAcknowledged,
            acknowledged: !!formData.acknowledged,
            readAcknowledgement: !!formData.readAcknowledgement,
            fairworkAcknowledged: !!formData.fairworkAcknowledged
          },
          isCompleted: isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED',
          missingFields: [
            !hasSignature && 'signature',
            !hasName && 'name',
            !hasDate && 'date',
            !hasAcknowledged && 'acknowledged flag'
          ].filter(Boolean)
        });
        
        return isCompleted;
      } else if (assignment.form.formKey === 'ndis_workforce_capability') {
        // NDIS Workforce Capability requires: signature, fullName, date, and readAcknowledgement flag
        console.log(`    🔍 [NDIS WORKFORCE CAPABILITY] Detailed completion check in batch email helper:`);
        const formData = (submission.data as any) || {};
        const hasSignature = !!(formData.signature || formData.staffSignature || submission.staffSignature);
        const hasName = !!(formData.fullName || formData.staffName || formData.name);
        const hasDate = !!(formData.date || formData.staffSignedAt || submission.staffSignedAt);
        const hasAcknowledged = !!(formData.readAcknowledgement || formData.acknowledged);
        const isCompleted = hasSignature && hasName && hasDate && hasAcknowledged;
        
        console.log(`    🔍 [NDIS WORKFORCE CAPABILITY] Completion details:`, {
          submissionId: submission.id,
          isSubmitted: submission.isSubmitted,
          staffSignatureInColumn: !!submission.staffSignature,
          formDataKeys: Object.keys(formData),
          hasSignature: {
            exists: hasSignature,
            inFormData: !!(formData.signature || formData.staffSignature),
            inColumn: !!submission.staffSignature
          },
          hasName: {
            exists: hasName,
            fullName: !!formData.fullName,
            staffName: !!formData.staffName,
            name: !!formData.name,
            value: formData.fullName || formData.staffName || formData.name || 'MISSING'
          },
          hasDate: {
            exists: hasDate,
            date: !!formData.date,
            staffSignedAt: !!formData.staffSignedAt,
            inColumn: !!submission.staffSignedAt,
            value: formData.date || formData.staffSignedAt || submission.staffSignedAt || 'MISSING'
          },
          hasAcknowledged: {
            exists: hasAcknowledged,
            readAcknowledgement: !!formData.readAcknowledgement,
            acknowledged: !!formData.acknowledged
          },
          isCompleted: isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED',
          missingFields: [
            !hasSignature && 'signature',
            !hasName && 'fullName',
            !hasDate && 'date',
            !hasAcknowledged && 'readAcknowledgement flag'
          ].filter(Boolean)
        });
        
        return isCompleted;
      } else if (assignment.form.formKey === 'ndis_code_of_conduct') {
        // NDIS Code of Conduct requires: signature, date, position, and staffName
        console.log(`    🔍 [NDIS CODE OF CONDUCT] Detailed completion check in batch email helper:`);
        const formData = (submission.data as any) || {};
        const hasSignature = !!(formData.signature || formData.staffSignature || submission.staffSignature);
        const hasDate = !!(formData.date || formData.staffSignedAt || submission.staffSignedAt);
        const hasPosition = !!(formData.position && formData.position.trim() !== '');
        const hasName = !!(formData.staffName || formData.name);
        const isCompleted = hasSignature && hasDate && hasPosition && hasName;
        
        console.log(`    🔍 [NDIS CODE OF CONDUCT] Completion details:`, {
          submissionId: submission.id,
          isSubmitted: submission.isSubmitted,
          staffSignatureInColumn: !!submission.staffSignature,
          formDataKeys: Object.keys(formData),
          hasSignature: {
            exists: hasSignature,
            inFormData: !!(formData.signature || formData.staffSignature),
            inColumn: !!submission.staffSignature
          },
          hasDate: {
            exists: hasDate,
            date: !!formData.date,
            staffSignedAt: !!formData.staffSignedAt,
            inColumn: !!submission.staffSignedAt,
            value: formData.date || formData.staffSignedAt || submission.staffSignedAt || 'MISSING'
          },
          hasPosition: {
            exists: hasPosition,
            value: formData.position || 'MISSING'
          },
          hasName: {
            exists: hasName,
            staffName: !!formData.staffName,
            name: !!formData.name,
            value: formData.staffName || formData.name || 'MISSING'
          },
          isCompleted: isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED',
          missingFields: [
            !hasSignature && 'signature',
            !hasDate && 'date',
            !hasPosition && 'position',
            !hasName && 'staffName'
          ].filter(Boolean)
        });
        
        return isCompleted;
      } else if (assignment.form.formKey === 'govt_tax') {
        // TFN Declaration requires: signature, TFN, name fields, address fields, and signature date
        console.log(`    🔍 [TFN DECLARATION] Detailed completion check in batch email helper:`);
        const formData = (submission.data as any) || {};
        const hasSignature = !!(formData.payeeSignature || formData.payerSignature || formData.staffSignature || submission.staffSignature);
        const hasTFN = !!(formData.tfn && formData.tfn.trim() !== '');
        const hasName = !!(formData.firstName && formData.firstName.trim() !== '' && formData.surname && formData.surname.trim() !== '');
        const hasDOB = !!(formData.dob && formData.dob.trim() !== '');
        const hasAddress = !!(formData.address && formData.address.trim() !== '');
        const hasTown = !!(formData.town && formData.town.trim() !== '');
        const hasState = !!(formData.state && formData.state.trim() !== '');
        const hasPostcode = !!(formData.postcode && formData.postcode.trim() !== '');
        const hasSignatureDate = !!(formData.payeeSignatureAt || formData.staffSignedAt);
        const isCompleted = hasSignature && hasTFN && hasName && hasDOB && hasAddress && hasTown && hasState && hasPostcode && hasSignatureDate;
        
        console.log(`    🔍 [TFN DECLARATION] Completion details:`, {
          submissionId: submission.id,
          isSubmitted: submission.isSubmitted,
          staffSignatureInColumn: !!submission.staffSignature,
          formDataKeys: Object.keys(formData),
          hasSignature: {
            exists: hasSignature,
            payeeSignature: !!formData.payeeSignature,
            payerSignature: !!formData.payerSignature,
            staffSignature: !!formData.staffSignature,
            inColumn: !!submission.staffSignature
          },
          hasTFN: { exists: hasTFN, value: formData.tfn ? '***' : 'MISSING' },
          hasName: {
            exists: hasName,
            firstName: !!formData.firstName,
            surname: !!formData.surname
          },
          hasDOB: { exists: hasDOB, value: formData.dob || 'MISSING' },
          hasAddress: { exists: hasAddress, value: formData.address ? '***' : 'MISSING' },
          hasTown: { exists: hasTown, value: formData.town || 'MISSING' },
          hasState: { exists: hasState, value: formData.state || 'MISSING' },
          hasPostcode: { exists: hasPostcode, value: formData.postcode || 'MISSING' },
          hasSignatureDate: {
            exists: hasSignatureDate,
            payeeSignatureAt: !!formData.payeeSignatureAt,
            staffSignedAt: !!formData.staffSignedAt
          },
          isCompleted: isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED',
          missingFields: [
            !hasSignature && 'signature',
            !hasTFN && 'TFN',
            !hasName && 'name (firstName/surname)',
            !hasDOB && 'date of birth',
            !hasAddress && 'address',
            !hasTown && 'town',
            !hasState && 'state',
            !hasPostcode && 'postcode',
            !hasSignatureDate && 'signature date'
          ].filter(Boolean)
        });
        
        return isCompleted;
      } else {
        const isCompleted = hasStaffSignature || submission.isSubmitted; // For forms not requiring admin, staff signature or submission is enough
        console.log(`    → No admin required: ${isCompleted ? '✅ COMPLETED' : '❌ NOT COMPLETED'}`);
        return isCompleted;
      }
    });

    // Also check that all assignments are marked as completed
    const allAssignmentsCompleted = allAssignments.every((a: any) => a.currentStatus === 'completed');
    
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Assignment status check:`, {
      allAssignmentsCompleted,
      assignmentStatuses: allAssignments.map((a: any) => ({
        formKey: a.form.formKey,
        status: a.currentStatus,
        isCompleted: a.isCompleted
      }))
    });

    // Both conditions must be true: assignments marked completed AND actual signatures verified
    const allCompleted = allAssignmentsCompleted && allFormsCompleted;
    
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Final completion check:`, {
      allAssignmentsCompleted,
      allFormsCompleted,
      allCompleted,
      batchIsCompleted: batch.isCompleted
    });

    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Batch completion check:`, {
      batchId: batch.id,
      totalAssignments: allAssignments.length,
      allAssignmentsCompleted,
      allFormsCompleted,
      allCompleted,
      batchIsCompleted: batch.isCompleted,
      assignmentStatuses: allAssignments.map((a: any) => ({
        formKey: a.form.formKey,
        status: a.currentStatus,
        isCompleted: a.isCompleted,
        hasStaffSig: !!allSubmissions.find(s => s.formKey === a.form.formKey)?.staffSignature,
        hasAdminSig: !!allSubmissions.find(s => s.formKey === a.form.formKey)?.adminSignature,
        requiresAdmin: requiresAdminSignature(a.form.formKey)
      }))
    });

    // If all forms are completed and batch is not marked as completed, trigger email
    console.log(`🔍 [STAFF BATCH EMAIL HELPER] Final decision check:`, {
      allCompleted,
      batchIsCompleted: batch.isCompleted,
      willTriggerEmail: allCompleted && !batch.isCompleted,
      batchId: batch.id,
      staffId,
      formKey
    });
    
    if (allCompleted && !batch.isCompleted) {
      console.log(`🎉 [STAFF BATCH EMAIL HELPER] All forms completed! Triggering email...`);
      console.log(`🔍 [STAFF BATCH EMAIL HELPER] Pre-Employment Medical specific check:`, {
        hasPreEmploymentMedical: allAssignments.some(a => a.form.formKey === 'pre_employment_medical'),
        preEmploymentMedicalAssignment: allAssignments.find(a => a.form.formKey === 'pre_employment_medical') ? {
          formKey: 'pre_employment_medical',
          status: allAssignments.find(a => a.form.formKey === 'pre_employment_medical')?.currentStatus,
          isCompleted: allAssignments.find(a => a.form.formKey === 'pre_employment_medical')?.isCompleted
        } : null,
        preEmploymentMedicalSubmission: allSubmissions.find(s => s.formKey === 'pre_employment_medical') ? {
          formKey: 'pre_employment_medical',
          hasStaffSignature: !!allSubmissions.find(s => s.formKey === 'pre_employment_medical')?.staffSignature,
          dataKeys: Object.keys((allSubmissions.find(s => s.formKey === 'pre_employment_medical')?.data as any) || {})
        } : null
      });
      
      // Mark batch as completed
      await prisma.staffFormBatch.update({
        where: { id: batch.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });
      console.log(`✅ [STAFF BATCH EMAIL HELPER] Batch ${batch.id} marked as completed`);

      // Get staff info
      const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: { 
          id: true, 
          firstName: true, 
          surname: true, 
          email: true,
          createdById: true 
        },
      });

      if (!staff || !staff.email) {
        console.warn(`⚠️ [STAFF BATCH EMAIL HELPER] Staff ${staffId} not found or has no email`);
        return;
      }

      // Use fallback strategy if createdById is null
      let adminId = staff.createdById;
      if (!adminId) {
        console.warn(`⚠️ [STAFF BATCH EMAIL HELPER] Staff ${staffId} has no createdById, trying to find admin with staff email settings...`);
        
        // Try to find an admin that has staff email settings configured
        const adminWithStaffEmailSettings = await prisma.appSettings.findFirst({
          where: {
            key: 'staff_smtp_host',
            isActive: true,
            value: { not: null },
          },
          select: {
            adminId: true,
          },
          orderBy: {
            adminId: 'desc', // Prefer admin-specific over global (null)
          },
        });

        if (adminWithStaffEmailSettings && adminWithStaffEmailSettings.adminId) {
          adminId = adminWithStaffEmailSettings.adminId;
          console.log(`✅ [STAFF BATCH EMAIL HELPER] Found admin ${adminId} with staff email settings, using that`);
        } else {
          // Fallback to adminId: 1, but email config will try generic settings as fallback
          console.warn(`⚠️ [STAFF BATCH EMAIL HELPER] No admin with staff email settings found, using fallback adminId: 1 (will try generic email settings)`);
          adminId = 1;
        }
      }

      // Get all completed form submissions for this batch
      // Use the assignments to find the corresponding submissions
      const completedFormSubmissions = await Promise.all(
        allAssignments.map(async (assignment: any) => {
          const submission = await prisma.staffFormSubmission.findUnique({
            where: {
              staffId_formKey: {
                staffId: staffId,
                formKey: assignment.form.formKey,
              },
            },
            include: {
              form: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          });
          return submission;
        })
      );

      // Filter out null submissions
      const validSubmissions = completedFormSubmissions.filter(
        (submission): submission is NonNullable<typeof submission> => submission !== null
      );

      const completedFormsData = validSubmissions.map((submission: any) => ({
        id: submission.id,
        formId: submission.formId,
        title: submission.form?.title || 'Unknown Form',
        formKey: submission.formKey, // Include formKey for PDF generation
      }));

      if (completedFormsData.length === 0) {
        console.warn(`⚠️ [STAFF BATCH EMAIL HELPER] No completed form submissions found`);
        return;
      }

      const staffName = `${staff.firstName || ''} ${staff.surname || ''}`.trim() || 'Staff Member';
      
      // Build email API URL
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
      const emailApiUrl = `${baseUrl}/api/notifications/send-email/${adminId}`;
      
      const emailPayload = {
        type: 'staff_batch_completed',
        staffId: staff.id,
        staffName: staffName,
        staffEmail: staff.email,
        batchId: batch.id,
        completedForms: completedFormsData,
        completedAt: new Date().toLocaleString(),
      };

      console.log(`📤 [STAFF BATCH EMAIL HELPER] Sending email request:`, {
        url: emailApiUrl,
        adminId,
        staffId: staff.id,
        staffName,
        staffEmail: staff.email,
        formsCount: completedFormsData.length,
        completedForms: completedFormsData.map(f => ({ formKey: f.formKey, title: f.title })),
        emailPayload: {
          ...emailPayload,
          completedForms: `${completedFormsData.length} forms`
        }
      });

      // Send email notification
      try {
        console.log(`📧 [STAFF BATCH EMAIL HELPER] Making fetch request to email API...`);
      const notificationResponse = await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });

        console.log(`📧 [STAFF BATCH EMAIL HELPER] Email API response received:`, {
          status: notificationResponse.status,
          statusText: notificationResponse.statusText,
          ok: notificationResponse.ok,
          headers: Object.fromEntries(notificationResponse.headers.entries())
        });

      if (notificationResponse.ok) {
        const responseData = await notificationResponse.json();
        console.log(`✅ [STAFF BATCH EMAIL HELPER] Email sent successfully:`, responseData);
      } else {
          const errorText = await notificationResponse.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { rawError: errorText };
          }
        console.error(`❌ [STAFF BATCH EMAIL HELPER] Failed to send email:`, {
          status: notificationResponse.status,
            statusText: notificationResponse.statusText,
            error: errorData,
            errorText
          });
        }
      } catch (fetchError) {
        console.error(`❌ [STAFF BATCH EMAIL HELPER] Fetch error when sending email:`, {
          error: fetchError,
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
          url: emailApiUrl
        });
      }
    } else {
      console.log(`ℹ️ [STAFF BATCH EMAIL HELPER] Batch not yet completed or already marked as completed`);
      console.log(`🔍 [STAFF BATCH EMAIL HELPER] Why email not triggered:`, {
        allCompleted,
        batchIsCompleted: batch.isCompleted,
        reason: !allCompleted ? 'Not all forms completed' : 'Batch already marked as completed',
        allAssignmentsCompleted,
        allFormsCompleted,
        assignmentDetails: allAssignments.map((a: any) => {
          const sub = allSubmissions.find(s => s.formKey === a.form.formKey);
          return {
            formKey: a.form.formKey,
            status: a.currentStatus,
            isCompleted: a.isCompleted,
            hasStaffSig: !!sub?.staffSignature,
            hasAdminSig: !!sub?.adminSignature,
            requiresAdmin: requiresAdminSignature(a.form.formKey),
            isPreEmploymentMedical: a.form.formKey === 'pre_employment_medical',
            preEmploymentMedicalDetails: a.form.formKey === 'pre_employment_medical' ? {
              signature1: !!(sub?.data as any)?.signature || !!sub?.staffSignature,
              signature2: !!(sub?.data as any)?.disclosureAdviceSignature,
              signature3: !!(sub?.data as any)?.declarationSignature,
              dataKeys: Object.keys((sub?.data as any) || {})
            } : undefined
          };
        })
      });
    }
  } catch (error) {
    console.error('❌ [STAFF BATCH EMAIL HELPER] Error checking batch completion:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      staffId,
      formKey
    });
    // Don't throw - this is a helper function that shouldn't break the main flow
  }
}

/**
 * Check if a form requires admin signature
 */
function requiresAdminSignature(formKey: string): boolean {
  const formsRequiringAdminSignature = [
    'bullying_training',
    'conflict_of_interest',
    'employee_details',
  ];
  return formsRequiringAdminSignature.includes(formKey);
}

