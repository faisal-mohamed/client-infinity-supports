import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateFormSignatures } from "@/lib/signatureValidation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const assignmentIdNum = parseInt(assignmentId);
    const body = await req.json();
    const { formData, commonFieldsData } = body;

    if (isNaN(assignmentIdNum)) {
      return NextResponse.json(
        { error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    // Get form assignment with form details
    const assignment: any = await prisma.formAssignment.findUnique({
      where: { id: assignmentIdNum },
      include: {
        form: {
          select: {
            id: true,
            formKey: true,
            title: true,
            version: true,
          },
        },
        assignedBy: {
          select: {
            id: true, // This is adminId
            email: true, // Optional: If needed for email
          },
        },
      },
    });

    const adminId = assignment?.assignedBy?.id;

    // 🎯 Track previous status to detect admin completing a "pending_admin_review" form
    const previousStatus = assignment?.currentStatus;

    if (!assignment) {
      return NextResponse.json(
        { error: "Form assignment not found" },
        { status: 404 }
      );
    }

    // Validate signature completion using registry-based system
    const signatureValidation = validateFormSignatures(
      assignment.form.formKey,
      formData
    );

    // Determine if form has all required signatures
    const hasAllSignatures = signatureValidation.isComplete;

    // Prepare signature completion flag for FormSubmission
    let clientSignature = null;
    let clientSignedAt = null;

    if (hasAllSignatures) {
      // Store completion status as string flag
      clientSignature = "true";
      clientSignedAt = new Date();
    }

    // 🎯 SUBMIT STATUS LOGIC
    let newStatus = "completed"; // Default for submission
    let canSubmit = true;
    let submitMessage = "Form submitted successfully!";

    // Check if submission requirements are met
    if (signatureValidation.totalRequired > 0 && !hasAllSignatures) {
      // Has signature requirements but not all complete
      newStatus = "in_progress"; // Keep as in_progress
      canSubmit = false;
      submitMessage = `${signatureValidation.missingSignatures.length} signature(s) still required`;
    }

    console.log(
      `🎯 Submit Status: assignmentId=${assignmentIdNum}, hasAllSignatures=${hasAllSignatures}, totalRequired=${signatureValidation.totalRequired}, newStatus=${newStatus}, canSubmit=${canSubmit}`
    );

    // 🧹 Cleanup: Clear conditional fields based on their parent values
    if (assignment.form.formKey === 'support_action_plan') {
      // Clear capacityActions if capacityAssessmentRequired is not "Yes"
      if (formData.capacityAssessmentRequired !== 'Yes') {
        formData.capacityActions = '';
      }

      // Clear assessmentActions1 if additionalAssessment1 is not "Yes"
      if (formData.additionalAssessment1 !== 'Yes') {
        formData.assessmentActions1 = '';
      }

      // Clear assessmentActions2 if additionalAssessment2 is not "Yes"
      if (formData.additionalAssessment2 !== 'Yes') {
        formData.assessmentActions2 = '';
      }
    }

    // Check for existing submission to determine if it's an update or create
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: {
        clientId_formId_formVersion_instanceNumber: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
          instanceNumber: assignment.instanceNumber,
        },
      },
    });

    // Update or create FormSubmission
    const formSubmission = await prisma.formSubmission.upsert({
      where: {
        clientId_formId_formVersion_instanceNumber: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
          instanceNumber: assignment.instanceNumber,
        },
      },
      create: {
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        instanceNumber: assignment.instanceNumber,
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: canSubmit, // Only mark as submitted if requirements met
        submittedAt: canSubmit ? new Date() : null,
        clientSignature: clientSignature,
        clientSignedAt: clientSignedAt,
      },
      update: {
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: canSubmit, // Only mark as submitted if requirements met
        submittedAt: canSubmit ? new Date() : null,
        updatedAt: new Date(),
        // Update signature fields if signatures are complete
        ...(hasAllSignatures && {
          clientSignature: clientSignature,
          clientSignedAt: clientSignedAt,
        }),
      },
    });

    // Update common fields if provided
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      const allowedCommonFields = [
        "name",
        "age",
        "email",
        "sex",
        "street",
        "state",
        "postCode",
        "dob",
        "ndis",
        "disability",
        "address",
        "phone",
      ];

      const filteredCommonFields = Object.keys(commonFieldsData)
        .filter((key) => allowedCommonFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = commonFieldsData[key];
          return obj;
        }, {} as any);

      if (Object.keys(filteredCommonFields).length > 0) {
        await prisma.commonField.upsert({
          where: { clientId: assignment.clientId },
          create: {
            clientId: assignment.clientId,
            ...filteredCommonFields,
          },
          update: {
            ...filteredCommonFields,
            updatedAt: new Date(),
          },
        });
      }
    }

    // 🎯 UPDATE FORM ASSIGNMENT STATUS
    console.log(
      `🎯 Updating FormAssignment ${assignmentIdNum} to status: ${newStatus}`
    );
    console.log(
      `🎯 Previous status was: ${previousStatus}`
    );

    await prisma.formAssignment.update({
      where: { id: assignmentIdNum },
      data: {
        currentStatus: newStatus,
        isCompleted: newStatus === "completed", // Keep legacy field in sync
      },
    });

    console.log(
      `✅ FormAssignment ${assignmentIdNum} submitted with status: ${newStatus}`
    );

    // 🔔 SPECIAL CASE: Admin completed a form that was in "pending_admin_review" status
    // This happens when staff submitted their part, and now admin is completing theirs
    if (previousStatus === 'pending_admin_review' && newStatus === 'completed') {
      console.log(`🎉 [ADMIN COMPLETED] Admin completed a pending_admin_review form!`);
      console.log(`🎉 [ADMIN COMPLETED] Form: ${assignment.form.title}`);

      try {
        // Get client info
        const clientInfo = await prisma.client.findUnique({
          where: { id: assignment.clientId },
          select: { name: true, email: true },
        });

        // Get all admins in the system
        const allAdmins = await prisma.admin.findMany({
          select: { id: true },
        });

        // Create notifications for all admins (form fully completed)
        const notificationPromises = allAdmins.map((admin) =>
          prisma.formSubmissionNotification.create({
            data: {
              adminId: admin.id,
              clientId: assignment.clientId,
              formSubmissionId: formSubmission.id,
            },
          })
        );

        await Promise.all(notificationPromises);
        console.log(`✅ [ADMIN COMPLETED] Notifications created for ${allAdmins.length} admin(s)`);

        // Create activity log
        await prisma.formActivityLog.create({
          data: {
            clientId: assignment.clientId,
            adminId: adminId,
            logType: "ADMIN",
            action: "Form Fully Completed by Admin",
            metadata: {
              formKey: assignment.form.formKey,
              formTitle: assignment.form.title,
              formSubmissionId: formSubmission.id,
              previousStatus: 'pending_admin_review',
              newStatus: 'completed',
              completedAt: new Date().toISOString(),
            },
          },
        });

        // Send dual notification email (admin + client)
        console.log(`📧 [ADMIN COMPLETED] Sending completion email...`);
        try {
          const completedFormsData = [{
            id: formSubmission.id,
            formId: assignment.form.id,
            title: assignment.form.title,
          }];

          const emailUrl = `${process.env.NEXTAUTH_URL || req.nextUrl.origin}/api/notifications/send-email/${adminId}`;
          console.log(`📧 [ADMIN COMPLETED] Email URL: ${emailUrl}`);

          const emailResponse = await fetch(emailUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "dual_notification",
              adminId,
              clientId: assignment.clientId,
              clientName: clientInfo?.name,
              clientEmail: clientInfo?.email,
              batchId: 0,
              completedForms: completedFormsData,
              completedAt: new Date().toLocaleString(),
            }),
          });

          if (emailResponse.ok) {
            const emailResult = await emailResponse.json();
            console.log(`✅ [ADMIN COMPLETED] Completion email sent!`, emailResult);
          } else {
            const errorText = await emailResponse.text();
            console.error(`❌ [ADMIN COMPLETED] Email failed:`, errorText);
          }
        } catch (emailError) {
          console.error(`❌ [ADMIN COMPLETED] Email error (non-blocking):`, emailError);
        }
      } catch (notificationError) {
        console.error(`❌ [ADMIN COMPLETED] Notification error:`, notificationError);
      }
    }

    // 🔔 CREATE NOTIFICATIONS for ALL ADMINS when client has signed the form
    if (hasAllSignatures && clientSignature) {
      try {
        // Get client info for notification and email
        const clientInfo = await prisma.client.findUnique({
          where: { id: assignment.clientId },
          select: { name: true, email: true },
        });

        // Get all admins in the system
        const allAdmins = await prisma.admin.findMany({
          select: { id: true },
        });

        // Create notifications for all admins
        const notificationPromises = allAdmins.map((admin) =>
          prisma.formSubmissionNotification.create({
            data: {
              adminId: admin.id,
              clientId: assignment.clientId,
              formSubmissionId: formSubmission.id,
            },
          })
        );

        await Promise.all(notificationPromises);

        console.log(
          `🔔 Notifications created for ${allAdmins.length} admins - Client ${clientInfo?.name} signed ${assignment.form.title}`
        );

        // 🔔 NEW: Check if this form completion triggers batch completion
        try {
          console.log(
            `🔍 Checking if batch is completed for client: ${clientInfo?.name}`
          );

          // Find the batch this form assignment belongs to
          const formAssignmentWithBatch =
            await prisma.formAssignment.findUnique({
              where: { id: assignmentIdNum },
              include: {
                batch: {
                  include: {
                    assignments: {
                      include: {
                        form: {
                          select: {
                            id: true,
                            title: true,
                            requiresSignature: true,
                          },
                        },
                      },
                    },
                    client: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            });

          if (!formAssignmentWithBatch?.batch) {
            console.log(
              `⚠️ No batch found for form assignment ${assignmentIdNum}`
            );
            return NextResponse.json({
              success: canSubmit,
              submissionId: formSubmission.id,
              currentStatus: newStatus,
              canSubmit: canSubmit,
              signatureStatus: {
                isComplete: signatureValidation.isComplete,
                completedCount: signatureValidation.completedCount,
                totalRequired: signatureValidation.totalRequired,
                completedSignatures: signatureValidation.completedSignatures,
                missingSignatures: signatureValidation.missingSignatures,
              },
              message: submitMessage,
            });
          }

          const batch = formAssignmentWithBatch.batch;

          // Check if ALL forms in this batch are completed
          const allAssignments = batch.assignments;
          const completedAssignments = allAssignments.filter(
            (assignment) => assignment.currentStatus === "completed"
          );

          console.log(
            `📊 [BATCH CHECK] Batch ${batch.id} status: ${completedAssignments.length}/${allAssignments.length} forms completed`
          );
          console.log(`📊 [BATCH CHECK] Completed form IDs:`, completedAssignments.map(a => a.id));
          console.log(`📊 [BATCH CHECK] All form statuses:`, allAssignments.map(a => ({
            id: a.id,
            title: a.form.title,
            status: a.currentStatus
          })));

          // If all forms in batch are completed, send email
          if (
            completedAssignments.length === allAssignments.length &&
            allAssignments.length > 0
          ) {
            console.log(`🎉 [BATCH CHECK] ALL FORMS COMPLETED! Triggering email to admin + client...`);
            console.log(`🎉 [BATCH CHECK] Batch ${batch.id}: ${allAssignments.length} forms all done!`);

            // 🔍 DEBUG LOGS ----------------------------------------------------------------
            console.log("🔍 [DEBUG] All Assignments in Batch:", allAssignments.map(a => ({
              id: a.id,
              formId: a.formId,
              instanceNumber: a.instanceNumber
            })));
            // -----------------------------------------------------------------------------

            // Get all completed form submissions for this batch
            const completedFormSubmissions =
              await prisma.formSubmission.findMany({
                where: {
                  OR: allAssignments.map((a) => ({
                    clientId: batch.clientId,
                    formId: a.formId,
                    formVersion: a.formVersion,
                    instanceNumber: a.instanceNumber,
                  })),
                  isSubmitted: true,
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

            console.log("🔍 [DEBUG] Fetched Submissions:", completedFormSubmissions.map(s => ({
              id: s.id,
              formId: s.formId,
              instanceNumber: s.instanceNumber
            })));

            // Prepare completed forms data for email ----------------------------------------------
            const completedFormsData = completedFormSubmissions.map(
              (submission) => ({
                id: submission.id,
                formId: submission.formId,
                title: submission.form.title,
              })
            );




            // Check if email was already sent for this batch
            const batchAlreadySent = batch.isCompleted && batch.completedAt;

            if (batchAlreadySent) {
              console.log(`⚠️ [BATCH COMPLETE] Batch ${batch.id} was already completed at ${batch.completedAt}`);
              console.log(`⚠️ [BATCH COMPLETE] Email may have already been sent. Skipping duplicate email.`);
            }

            // Send dual notification email (admin + client)
            console.log(`📧 [BATCH COMPLETE] All forms completed! Sending dual notification emails...`);
            console.log(`📧 [BATCH COMPLETE] Batch info:`, {
              batchId: batch.id,
              clientName: batch.client.name,
              clientEmail: batch.client.email,
              formsCount: completedFormsData.length,
              wasAlreadyCompleted: batchAlreadySent
            });

            try {
              const emailResponse = await fetch(
                `${process.env.NEXTAUTH_URL || `${req.nextUrl.origin}`
                }/api/notifications/send-email/${adminId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    type: "dual_notification",
                    adminId,
                    clientId: batch.clientId,
                    clientName: batch.client.name,
                    clientEmail: batch.client.email,
                    batchId: batch.id,
                    completedForms: completedFormsData,
                    completedAt: new Date().toLocaleString(),
                  }),
                }
              );

              if (emailResponse.ok) {
                const emailResult = await emailResponse.json();
                console.log(`✅ [BATCH COMPLETE] Dual notification emails sent successfully:`, {
                  adminEmail: emailResult.adminEmail,
                  clientEmail: emailResult.clientEmail,
                  totalEmails: emailResult.totalEmails,
                  client: batch.client.name,
                  batchId: batch.id,
                  totalForms: completedFormsData.length,
                });
              } else {
                const emailError = await emailResponse.text();
                console.error(
                  `❌ [BATCH COMPLETE] Failed to send dual notification emails:`,
                  emailError
                );
              }
            } catch (emailSendError) {
              console.error("❌ [BATCH COMPLETE] Email sending error (non-blocking):", emailSendError);
            }







          } else {
            console.log(
              `⏳ Batch ${batch.id} not yet complete: ${completedAssignments.length}/${allAssignments.length} forms done`
            );
          }
        } catch (emailError) {
          console.error(
            "❌ Batch completion check failed (non-blocking):",
            emailError
          );
          // Don't fail the main request if email fails
        }
      } catch (notificationError) {
        console.error("Error creating notifications:", notificationError);
        // Don't fail the main request if notification fails
      }
    }

    return NextResponse.json({
      success: canSubmit,
      submissionId: formSubmission.id,
      currentStatus: newStatus,
      canSubmit: canSubmit,
      signatureStatus: {
        isComplete: signatureValidation.isComplete,
        completedCount: signatureValidation.completedCount,
        totalRequired: signatureValidation.totalRequired,
        completedSignatures: signatureValidation.completedSignatures,
        missingSignatures: signatureValidation.missingSignatures,
      },
      message: submitMessage,
    });
  } catch (error: any) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form", details: error.message },
      { status: 500 }
    );
  }
}
