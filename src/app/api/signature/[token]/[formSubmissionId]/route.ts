import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormConfig } from "@/app/forms/registry";
import { calculateFormStatus } from "@/lib/formStatusHelper";

// GET - Fetch specific form for signature
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);

    if (!token || !formSubmissionIdInt) {
      return NextResponse.json(
        { error: "Token and form submission ID are required" },
        { status: 400 }
      );
    }

    const batch = await prisma.formBatch.findUnique({
      where: {
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
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
                    schema: true,
                    requiresSignature: true,
                  },
                },
              },
            },
          },
        },
      },
    });


    if (!batch) {
      return NextResponse.json(
        { error: "Signature link not found or form not accessible" },
        { status: 404 }
      );
    }

    // Check if batch has expired
    if (batch.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This signature link has expired" },
        { status: 410 }
      );
    }

    // Check if form exists in this batch
    if (batch.signatureForms.length === 0) {
      return NextResponse.json(
        { error: "Form not found in this signature batch" },
        { status: 404 }
      );
    }
    console.log("signatureforms: ", batch.signatureForms);

    const signatureForm = batch.signatureForms[0];

    const result: any = batch.signatureForms.find(item => {
      return item.formSubmission?.id === formSubmissionIdInt;
    });

    console.log(result);

    // Fetch commonFields separately (same as admin API for consistency)
    const commonFields = await prisma.commonField.findUnique({
      where: { clientId: batch.client.id },
    });

    // DEBUG: Log commonFields to verify dob is being fetched
    console.log('[DEBUG] CommonFields for clientId', batch.client.id, ':', {
      name: commonFields?.name,
      surname: commonFields?.surname,
      dob: commonFields?.dob,
      ndis: commonFields?.ndis,
      email: commonFields?.email,
      phone: commonFields?.phone
    });

    // DEBUG: Log form data being sent to frontend
    console.group(`[Signature API GET Debug] Loading form data for ${result.formSubmission?.form?.formKey}`);
    console.log('Form submission ID:', result.formSubmission?.id);
    console.log('Form data keys:', result.formSubmission?.data ? Object.keys(result.formSubmission.data) : 'NO DATA');
    console.log('participantSignature exists:', !!result.formSubmission?.data?.participantSignature);
    console.log('authorSignature exists:', !!result.formSubmission?.data?.authorSignature);
    if (result.formSubmission?.data?.participantSignature) {
      console.log('participantSignature type:', typeof result.formSubmission.data.participantSignature);
      console.log('participantSignature length:', result.formSubmission.data.participantSignature.length);
      console.log('participantSignature preview:', result.formSubmission.data.participantSignature.substring(0, 50) + '...');
    }
    if (result.formSubmission?.data?.authorSignature) {
      console.log('authorSignature type:', typeof result.formSubmission.data.authorSignature);
      console.log('authorSignature length:', result.formSubmission.data.authorSignature.length);
      console.log('authorSignature preview:', result.formSubmission.data.authorSignature.substring(0, 50) + '...');
    }
    console.log('Are they the same?',
      result.formSubmission?.data?.participantSignature === result.formSubmission?.data?.authorSignature);
    console.groupEnd();

    return NextResponse.json({
      formSubmission: result.formSubmission,
      client: {
        ...batch.client,
        commonFields: commonFields ? [commonFields] : [], // Wrap in array for backward compatibility
      },
      batchToken: batch.batchToken,
      isExpired: batch.expiresAt < new Date(),
    });

  } catch (error: any) {
    console.error("Error fetching form for signature:", error);
    return NextResponse.json(
      { error: "Failed to fetch form data", details: error.message },
      { status: 500 }
    );
  }
}


// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
// ) {
//   try {
//     const { token, formSubmissionId } = await params;
//     const formSubmissionIdInt = parseInt(formSubmissionId);
//     const { signature, signatureId, signedAt, signerName } = await req.json();

//     if (!token || !formSubmissionIdInt || !signature || !signatureId || !signedAt) {
//       return NextResponse.json(
//         { error: "Token, formSubmissionId, signature, signatureId, and signedAt are required" },
//         { status: 400 }
//       );
//     }


//     const batch = await prisma.formBatch.findUnique({
//       where: {
//         batchToken: token,
//         isSignatureOnly: true,
//       },
//       include: {
//         signatureForms: {
//           include: {
//             formSubmission: {
//               include: {
//                 form: {
//                   select: {
//                     formKey: true,
//                     requiresSignature: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!batch) {
//       return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
//     }

//     if (batch.expiresAt < new Date()) {
//       return NextResponse.json({ error: "This signature link has expired" }, { status: 410 });
//     }

//     const signatureForm: any = batch.signatureForms.find(
//       sf => sf.formSubmissionId === formSubmissionIdInt
//     );

//     if (!signatureForm) {
//       return NextResponse.json({ error: "Form not found in this signature batch" }, { status: 404 });
//     }

//     const currentSubmission: any = await prisma.formSubmission.findUnique({
//       where: { id: formSubmissionIdInt },
//       select: { data: true, clientId: true, formId: true, formVersion: true },
//     });

//     if (!currentSubmission) {
//       return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
//     }

//     const formKey = signatureForm.formSubmission.form.formKey;
//     const formConfig = getFormConfig(formKey);
//     const signatures = formConfig?.signatures || [];

//     const signatureConfig = signatures.find(sig => sig.id === signatureId);
//     if (!signatureConfig) {
//       return NextResponse.json(
//         { error: `Signature configuration not found for ID: ${signatureId}` },
//         { status: 400 }
//       );
//     }

//     const signatureDataKey: any = signatureConfig.dataKey;
//     const signedAtKey: any = signatureConfig.signedAtKey;
//     const signedByKey : any = signatureConfig.signerName

//     const updatedFormData = {
//       ...currentSubmission.data,
//       [signatureDataKey]: signature,
//       ...(signedAtKey && { [signedAtKey]: signedAt }),
//       ...(signedByKey && {[signedByKey] : signerName})
//     };

//     await prisma.formSubmission.update({
//       where: { id: formSubmissionIdInt },
//       data: {
//         clientSignature: "true",
//         clientSignedAt: new Date(),
//         data: updatedFormData,
//       },
//     });

//     // Update formAssignment status
//     const formAssignment = await prisma.formAssignment.findFirst({
//       where: {
//         clientId: currentSubmission.clientId,
//         formId: currentSubmission.formId,
//         formVersion: currentSubmission.formVersion,
//       },
//       select: {
//         id: true,
//         currentStatus: true,
//         isCompleted: true,
//         assignedById: true,
//       },
//     });

//     if (formAssignment) {
//       const requiredSignatures = signatures.filter(sig => {
//         if (sig.condition) return sig.condition(updatedFormData);
//         return sig.required;
//       });

//       const completedCount = requiredSignatures.filter(sig => {
//         const key: any = sig.dataKey;
//         return updatedFormData[key];
//       }).length;

//       const newStatus = completedCount === requiredSignatures.length ? 'completed' : 'in_progress';

//       await prisma.formAssignment.update({
//         where: { id: formAssignment.id },
//         data: {
//           currentStatus: newStatus,
//           isCompleted: newStatus === 'completed',
//         },
//       });
//     }

//     const adminId = formAssignment?.assignedById;

//     // ✅ Check if the entire batch is now fully signed
//     const updatedBatch = await prisma.formBatch.findUnique({
//       where: { id: batch.id },
//       include: {
//         signatureForms: {
//           include: {
//             formSubmission: {
//               include: {
//                 form: {
//                   select: {
//                     id: true,
//                     title: true,
//                     requiresSignature: true,
//                     formKey: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         client: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });


//     console.log("---------------------Updated batch---------------------: ", updatedBatch);

//     if (updatedBatch) {
//       let isNowComplete = true;

//       for (const sf of updatedBatch.signatureForms) {
//         const formKey = sf.formSubmission.form.formKey;
//         const submissionData : any = sf.formSubmission.data;

//         const config = getFormConfig(formKey);
//         const requiredSignatures = (config?.signatures || []).filter(sig => {
//           if (sig.condition) return sig.condition(submissionData);
//           return sig.required;
//         });

//         const allFormSignaturesComplete = requiredSignatures.every(sig => {
//           const key : any = sig.dataKey;
//           return !!submissionData[key];
//         });

//         if (!allFormSignaturesComplete) {
//           isNowComplete = false;
//           break;
//         }
//       }

//       if (isNowComplete && !updatedBatch.isCompleted) {
//         await prisma.formBatch.update({
//           where: { id: batch.id },
//           data: {
//             isCompleted: true,
//             completedAt: new Date(),
//           },
//         });

//         await prisma.formActivityLog.create({
//           data: {
//             clientId: updatedBatch.client.id,
//             logType: 'CLIENT',
//             action: 'Signature Batch Completed',
//             metadata: {
//               batchId: batch.id,
//               batchToken: batch.batchToken,
//               clientName: updatedBatch.client.name,
//               totalForms: updatedBatch.signatureForms.length,
//               completedAt: new Date().toISOString(),
//             },
//           },
//         });

//         const allAdmins = await prisma.admin.findMany({ select: { id: true } });
//         const notificationPromises = allAdmins.map(admin =>
//           prisma.formSubmissionNotification.create({
//             data: {
//               adminId: admin.id,
//               clientId: updatedBatch.client.id,
//               formSubmissionId: formSubmissionIdInt,
//             },
//           })
//         );
//         await Promise.all(notificationPromises);

//         // ✅ Send email notification
//         try {
//           const completedFormsData = updatedBatch.signatureForms.map((sf: any) => ({
//             id: sf.formSubmissionId,
//             formId: sf.formSubmission.form.id,
//             title: sf.formSubmission.form?.title || 'Unknown Form',
//           }));

//           const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               type: 'dual_notification',
//               clientId: updatedBatch.client.id,
//               clientName: updatedBatch.client.name,
//               clientEmail: updatedBatch.client.email,
//               batchId: batch.id,
//               completedForms: completedFormsData,
//               completedAt: new Date().toLocaleString(),
//             }),
//           });

//           if (emailResponse.ok) {
//             const emailResult = await emailResponse.json();
//             console.log(`✅ Email sent:`, emailResult);
//           } else {
//             const emailError = await emailResponse.text();
//             console.error(`❌ Failed to send email:`, emailError);
//           }
//         } catch (err) {
//           console.error("❌ Email error (non-blocking):", err);
//         }
//       }
//     }

//     // Refetch updated form assignment status
// let refreshedAssignmentStatus = 'in_progress';
// if (formAssignment) {
//   const updatedAssignment = await prisma.formAssignment.findUnique({
//     where: { id: formAssignment.id },
//     select: { currentStatus: true },
//   });
//   refreshedAssignmentStatus = updatedAssignment?.currentStatus || 'in_progress';
// }

// return NextResponse.json({
//   success: true,
//   message: "Signature submitted successfully",
//   signatureId,
//   signedAt,
//   allSignaturesComplete: refreshedAssignmentStatus === 'completed',
// });


//     return NextResponse.json({
//       success: true,
//       message: "Signature submitted successfully",
//       signatureId,
//       signedAt,
//       allSignaturesComplete: formAssignment?.currentStatus === 'completed' || false,
//     });
//   } catch (error: any) {
//     console.error("Error submitting signature:", error);
//     return NextResponse.json(
//       { error: "Failed to submit signature", details: error.message },
//       { status: 500 }
//     );
//   }
// }



interface SignatureRequirement {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  dataKey?: string;
  signedAtKey?: string;
  signerName?: string;
  groupId?: string;
  groupRequirementType?: "any" | "all";
  groupRequired?: boolean;
}

function getRequiredSignaturesWithGroups(signatures: SignatureRequirement[], formData: any): SignatureRequirement[] {
  const individualRequired: SignatureRequirement[] = [];
  const grouped: Record<string, SignatureRequirement[]> = {};

  for (const sig of signatures) {
    if (sig.groupId && sig.groupRequired) {
      if (!grouped[sig.groupId]) grouped[sig.groupId] = [];
      grouped[sig.groupId].push(sig);
    } else if (sig.required) {
      individualRequired.push(sig);
    }
  }

  const groupEvaluated: SignatureRequirement[] = [];
  for (const [groupId, groupSignatures] of Object.entries(grouped)) {
    const type = groupSignatures[0]?.groupRequirementType || "any";

    const hasOneSigned = groupSignatures.some(sig => !!formData?.[sig.dataKey ?? ""]);
    const allSigned = groupSignatures.every(sig => !!formData?.[sig.dataKey ?? ""]);

    if (type === "any" && !hasOneSigned) {
      groupEvaluated.push(...groupSignatures);
    } else if (type === "all" && !allSigned) {
      groupEvaluated.push(...groupSignatures);
    }
  }

  return [...individualRequired, ...groupEvaluated];
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);
    const { signature, signatureId, signedAt, signerName } = await req.json();

    if (!token || !formSubmissionIdInt || !signature || !signatureId || !signedAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const batch = await prisma.formBatch.findUnique({
      where: { batchToken: token, isSignatureOnly: true },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    formKey: true,
                    requiresSignature: true,
                    title: true, // in case you need title for email
                    id: true
                  },
                },
              },
            },
          },
        },
      },
    });


    if (!batch) return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
    if (batch.expiresAt < new Date()) return NextResponse.json({ error: "Signature link expired" }, { status: 410 });

    const signatureForm = batch.signatureForms.find((sf: any) => sf.formSubmissionId === formSubmissionIdInt);
    if (!signatureForm) return NextResponse.json({ error: "Form not found in batch" }, { status: 404 });

    const currentSubmission: any = await prisma.formSubmission.findUnique({
      where: { id: formSubmissionIdInt },
      select: { data: true, clientId: true, formId: true, formVersion: true },
    });

    if (!currentSubmission) return NextResponse.json({ error: "Form submission not found" }, { status: 404 });

    const formKey = signatureForm.formSubmission.form.formKey;
    const formConfig = getFormConfig(formKey);
    const signatures = formConfig?.signatures || [];

    let signatureConfig = signatures.find(sig => sig.id === signatureId);

    // Special handling for conflict signature (sa_support_coordination specific)
    if (!signatureConfig && signatureId === "conflict_signature" && formKey === "sa_support_coordination") {
      signatureConfig = {
        id: "conflict_signature",
        dataKey: "signature",
        signedAtKey: "signDate",
        signerName: "printName",
        label: "Conflict Signature"
      };
    }

    if (!signatureConfig) {
      return NextResponse.json({ error: `Signature config not found for ID: ${signatureId}` }, { status: 400 });
    }

    const { dataKey, signedAtKey, signerName: signerNameKey } = signatureConfig;

    // Auto-detect signatureRole for forms with participant/nominee signatures
    // Always update based on which signature is actually submitted through the link
    // This ensures the signature link selection takes precedence over edit form selection
    let autoDetectedRole = "";
    const formsWithSignatureRole = ["schedule_of_supports", "sa_delivery_of_supports", "sa_support_coordination"];
    if (formsWithSignatureRole.includes(formKey)) {
      if (dataKey === "nomineeSignature") {
        autoDetectedRole = "Nominee";
      } else if (dataKey === "participantSignature") {
        autoDetectedRole = "Participant";
      }
    }

    // DEBUG: Log signature submission details
    console.group(`[Signature API Debug] Submitting signature for ${formKey}`);
    console.log('signatureId:', signatureId);
    console.log('dataKey:', dataKey);
    console.log('signedAtKey:', signedAtKey);
    console.log('signerNameKey:', signerNameKey);
    console.log('Current submission data keys:', Object.keys(currentSubmission.data || {}));
    console.log('Current participantSignature exists:', !!currentSubmission.data?.participantSignature);
    console.log('Current authorSignature exists:', !!currentSubmission.data?.authorSignature);
    console.log('Signature being saved to:', dataKey);
    console.log('Signature length:', signature ? signature.length : 0);
    console.log('Signature preview:', signature ? signature.substring(0, 50) + '...' : 'EMPTY');

    // CRITICAL: For support_action_plan, ensure we only update the correct signature field
    // Prevent accidentally copying signature to wrong field
    const updatedFormData: any = {
      ...currentSubmission.data,
    };

    // Only update the specific signature field that was signed
    if (formKey === 'support_action_plan') {
      if (dataKey === 'authorSignature') {
        // Only update authorSignature - do NOT touch participantSignature
        updatedFormData.authorSignature = signature;
        if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
        if (signerNameKey) updatedFormData[signerNameKey] = signerName;
        // Ensure participantSignature is NOT affected
        if (!updatedFormData.participantSignature) {
          updatedFormData.participantSignature = '';
        }
        console.log('[API Debug] Saving authorSignature only, participantSignature preserved as:',
          updatedFormData.participantSignature ? 'EXISTS' : 'EMPTY');
      } else if (dataKey === 'participantSignature') {
        // Only update participantSignature - do NOT touch authorSignature
        updatedFormData.participantSignature = signature;
        if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
        if (signerNameKey) updatedFormData[signerNameKey] = signerName;
        // Ensure authorSignature is NOT affected
        if (!updatedFormData.authorSignature) {
          updatedFormData.authorSignature = '';
        }
        console.log('[API Debug] Saving participantSignature only, authorSignature preserved as:',
          updatedFormData.authorSignature ? 'EXISTS' : 'EMPTY');
      } else {
        // Fallback for other fields
        updatedFormData[dataKey!] = signature;
        if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
        if (signerNameKey) updatedFormData[signerNameKey] = signerName;
      }
    } else {
      // For other forms, use standard update
      updatedFormData[dataKey!] = signature;
      if (signedAtKey) updatedFormData[signedAtKey] = signedAt;
      if (signerNameKey) updatedFormData[signerNameKey] = signerName;
    }

    if (autoDetectedRole) {
      updatedFormData.signatureRole = autoDetectedRole;
    }

    console.log('Updated formData keys:', Object.keys(updatedFormData));
    console.log('Updated participantSignature exists:', !!updatedFormData.participantSignature);
    console.log('Updated authorSignature exists:', !!updatedFormData.authorSignature);
    console.log('Updated participantSignature === authorSignature?',
      updatedFormData.participantSignature === updatedFormData.authorSignature);
    console.log('Updated participantSignature value:',
      updatedFormData.participantSignature ? updatedFormData.participantSignature.substring(0, 50) + '...' : 'EMPTY');
    console.log('Updated authorSignature value:',
      updatedFormData.authorSignature ? updatedFormData.authorSignature.substring(0, 50) + '...' : 'EMPTY');
    console.groupEnd();

    await prisma.formSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        clientSignature: "true",
        clientSignedAt: new Date(),
        data: updatedFormData,
      },
    });

    // DEBUG: Verify what was saved
    const savedSubmission = await prisma.formSubmission.findUnique({
      where: { id: formSubmissionIdInt },
      select: { data: true },
    });
    const savedData = savedSubmission?.data as any;
    console.log('[Signature API Debug] After save - participantSignature exists:', !!savedData?.participantSignature);
    console.log('[Signature API Debug] After save - authorSignature exists:', !!savedData?.authorSignature);
    console.log('[Signature API Debug] After save - Are they the same?',
      savedData?.participantSignature === savedData?.authorSignature);

    // update form assignment
    const formAssignment = await prisma.formAssignment.findFirst({
      where: {
        clientId: currentSubmission.clientId,
        formId: currentSubmission.formId,
        formVersion: currentSubmission.formVersion,
      },
      select: {
        id: true,
        currentStatus: true,
        isCompleted: true,
        assignedById: true,
      },
    });

    if (formAssignment) {
      const newStatus = calculateFormStatus(formKey, updatedFormData, true, !!currentSubmission.isSubmitted);

      await prisma.formAssignment.update({
        where: { id: formAssignment.id },
        data: {
          currentStatus: newStatus,
          isCompleted: newStatus === "completed",
        },
      });
    }

    const adminId = formAssignment?.assignedById;

    // ✅ Check if entire batch is complete (latest fetch for each form submission)
    let isNowComplete = true;

    for (const sf of batch.signatureForms) {
      const formKey = sf.formSubmission.form.formKey;
      const config = getFormConfig(formKey);

      const latestSubmission = await prisma.formSubmission.findUnique({
        where: { id: sf.formSubmissionId },
        select: { data: true },
      });

      const submissionData: any = latestSubmission?.data || {};
      const required = getRequiredSignaturesWithGroups(config?.signatures || [], submissionData);

      const allSigned = required.every(sig => !!submissionData[sig.dataKey!]);
      if (!allSigned) {
        isNowComplete = false;
        break;
      }
    }

    if (isNowComplete && !batch.isCompleted) {
      await prisma.formBatch.update({
        where: { id: batch.id },
        data: {
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      await prisma.formActivityLog.create({
        data: {
          clientId: batch.clientId,
          logType: "CLIENT",
          action: "Signature Batch Completed",
          metadata: {
            batchId: batch.id,
            batchToken: batch.batchToken,
            totalForms: batch.signatureForms.length,
            completedAt: new Date().toISOString(),
          },
        },
      });

      const allAdmins = await prisma.admin.findMany({ select: { id: true } });
      await Promise.all(
        allAdmins.map(admin =>
          prisma.formSubmissionNotification.create({
            data: {
              adminId: admin.id,
              clientId: batch.clientId,
              formSubmissionId: formSubmissionIdInt,
            },
          })
        )
      );

      // 📧 Send notification email
      try {
        const completedFormsData = batch.signatureForms.map((sf: any) => ({
          id: sf.formSubmissionId,
          formId: sf.formSubmission.form.id,
          title: sf.formSubmission.form?.title || "Untitled",
        }));

        const emailResponse = await fetch(
          `${process.env.INTERNAL_API_URL || req.nextUrl.origin || process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "dual_notification",
              clientId: batch.clientId,
              clientName: batch.client.name,
              clientEmail: batch.client.email,
              batchId: batch.id,
              completedForms: completedFormsData,
              completedAt: new Date().toLocaleString(),
            }),
          }
        );

        if (!emailResponse.ok) {
          console.error("❌ Email error:", await emailResponse.text());
        }
      } catch (err) {
        console.error("❌ Email send failed (non-blocking):", err);
      }
    }

    // return final status
    const refreshedAssignment = formAssignment
      ? await prisma.formAssignment.findUnique({
        where: { id: formAssignment.id },
        select: { currentStatus: true },
      })
      : null;

    return NextResponse.json({
      success: true,
      message: "Signature submitted successfully",
      signatureId,
      signedAt,
      allSignaturesComplete: refreshedAssignment?.currentStatus === "completed",
    });
  } catch (error: any) {
    console.error("Error in signature POST:", error);
    return NextResponse.json(
      { error: "Failed to submit signature", details: error.message },
      { status: 500 }
    );
  }
}

// Save in-progress form data for a signature link
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);
    const { data, isSubmitted } = await req.json();

    if (!token || !formSubmissionIdInt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate signature batch and that this submission is part of it
    const batch = await prisma.formBatch.findUnique({
      where: { batchToken: token, isSignatureOnly: true },
      include: {
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    id: true,
                    formKey: true,
                    title: true,
                  }
                }
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    });

    if (!batch) return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
    if (batch.expiresAt < new Date()) return NextResponse.json({ error: "Signature link expired" }, { status: 410 });

    const signatureForm = batch.signatureForms.find((sf: any) => sf.formSubmissionId === formSubmissionIdInt);
    if (!signatureForm) return NextResponse.json({ error: "Form not in this signature link" }, { status: 404 });

    // Update submission data and mark as submitted if this is the final submission
    const updated = await prisma.formSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        data,
        updatedAt: new Date(),
        ...(isSubmitted && {
          isSubmitted: true,
          submittedAt: new Date(),
          clientSignature: "true", // Placeholder to indicate signed status for progress calculation
          clientSignedAt: new Date(),
        }),
      },
      select: {
        id: true,
        clientId: true,
        formId: true,
        formVersion: true,
        instanceNumber: true,
        isSubmitted: true,
        data: true
      },
    });

    // 🎯 Update FormAssignment status using centralized logic
    const formAssignment = await prisma.formAssignment.findFirst({
      where: {
        clientId: updated.clientId,
        formId: updated.formId,
        formVersion: updated.formVersion,
        instanceNumber: updated.instanceNumber,
      },
    });

    if (formAssignment) {
      const { calculateFormStatus } = await import('@/lib/formStatusHelper');
      const newStatus = calculateFormStatus(
        signatureForm.formSubmission?.form?.formKey,
        updated.data,
        true,
        updated.isSubmitted
      );

      await prisma.formAssignment.update({
        where: { id: formAssignment.id },
        data: {
          currentStatus: newStatus,
          isCompleted: newStatus === 'completed',
        },
      });
      console.log(`✅ [SIGNATURE PUT] Updated status for ${formAssignment.id} to ${newStatus}`);
    }

    // 🔔 NOTIFICATION: When staff submits their part of the form, notify admin
    if (isSubmitted) {
      const formKey = signatureForm.formSubmission?.form?.formKey;
      const formTitle = signatureForm.formSubmission?.form?.title || 'Unknown Form';
      const formId = signatureForm.formSubmission?.form?.id;
      const clientName = batch.client?.name || 'Unknown Client';

      // Get staff name from the form data (support worker signature field or similar)
      const staffName = data?.supportWorkers || data?.staffName || 'Support Worker';

      // 🎯 Get adminId from FormAssignment using the form submission details
      let adminId: number | undefined;
      try {
        const formSubmissionDetails = await prisma.formSubmission.findUnique({
          where: { id: formSubmissionIdInt },
          select: { clientId: true, formId: true, formVersion: true }
        });

        if (formSubmissionDetails) {
          const formAssignment = await prisma.formAssignment.findFirst({
            where: {
              clientId: formSubmissionDetails.clientId,
              formId: formSubmissionDetails.formId,
              formVersion: formSubmissionDetails.formVersion,
            },
            select: { assignedById: true }
          });
          adminId = formAssignment?.assignedById ?? undefined;
          console.log(`🔍 [STAFF SUBMITTED] Found adminId from FormAssignment: ${adminId}`);
        }
      } catch (adminLookupError) {
        console.error(`❌ [STAFF SUBMITTED] Error looking up adminId:`, adminLookupError);
      }

      console.log(`🔔 [STAFF SUBMITTED] Staff submitted form via signature link`, {
        formKey,
        formTitle,
        clientName,
        staffName,
        formSubmissionId: formSubmissionIdInt,
        adminId
      });

      // 🎯 UPDATE FORM ASSIGNMENT STATUS TO "pending_admin_review"
      // This indicates staff has completed their part, waiting for admin to complete
      try {
        const formSubmission = await prisma.formSubmission.findUnique({
          where: { id: formSubmissionIdInt },
          select: { clientId: true, formId: true, formVersion: true }
        });

        if (formSubmission) {
          await prisma.formAssignment.updateMany({
            where: {
              clientId: formSubmission.clientId,
              formId: formSubmission.formId,
              formVersion: formSubmission.formVersion,
            },
            data: {
              currentStatus: 'pending_admin_review',
              isCompleted: false,
            },
          });
          console.log(`✅ [STAFF SUBMITTED] Form assignment status updated to 'pending_admin_review'`);
        }
      } catch (statusError) {
        console.error(`❌ [STAFF SUBMITTED] Failed to update form assignment status:`, statusError);
      }

      try {
        // 1. Create dashboard notification for all admins
        const allAdmins = await prisma.admin.findMany({ select: { id: true } });

        const notificationPromises = allAdmins.map((admin) =>
          prisma.formSubmissionNotification.create({
            data: {
              adminId: admin.id,
              clientId: batch.client.id,
              formSubmissionId: formSubmissionIdInt,
            },
          })
        );

        await Promise.all(notificationPromises);
        console.log(`✅ [STAFF SUBMITTED] Dashboard notifications created for ${allAdmins.length} admin(s)`);

        // 2. Update batch as notified
        await prisma.formBatch.update({
          where: { id: batch.id },
          data: { adminNotified: true },
        });

        // 3. Send email notification to admin (non-blocking)
        console.log(`📧 [STAFF SUBMITTED] Preparing email notification...`);
        console.log(`📧 [STAFF SUBMITTED] Admin ID: ${adminId}`);
        console.log(`📧 [STAFF SUBMITTED] NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
        console.log(`📧 [STAFF SUBMITTED] VERCEL_URL: ${process.env.VERCEL_URL}`);

        if (adminId) {
          try {
            const emailUrl = `${process.env.INTERNAL_API_URL || req.nextUrl.origin || process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`;
            console.log(`📧 [STAFF SUBMITTED] Email API URL: ${emailUrl}`);

            const emailPayload = {
              type: "staff_form_submitted",
              clientId: batch.client.id,
              clientName,
              staffName,
              formTitle,
              formId,
              formSubmissionId: formSubmissionIdInt,
              submittedAt: new Date().toLocaleString(),
            };
            console.log(`📧 [STAFF SUBMITTED] Email payload:`, JSON.stringify(emailPayload, null, 2));

            const emailResponse = await fetch(emailUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(emailPayload),
            });

            console.log(`📧 [STAFF SUBMITTED] Email response status: ${emailResponse.status}`);

            if (emailResponse.ok) {
              const emailResult = await emailResponse.json();
              console.log(`✅ [STAFF SUBMITTED] Email notification sent to admin successfully!`);
              console.log(`✅ [STAFF SUBMITTED] Email result:`, JSON.stringify(emailResult, null, 2));
            } else {
              const errorText = await emailResponse.text();
              console.error(`❌ [STAFF SUBMITTED] Email notification failed!`);
              console.error(`❌ [STAFF SUBMITTED] Response status: ${emailResponse.status}`);
              console.error(`❌ [STAFF SUBMITTED] Error details:`, errorText);
            }
          } catch (emailError: any) {
            console.error(`❌ [STAFF SUBMITTED] Email send error (non-blocking)!`);
            console.error(`❌ [STAFF SUBMITTED] Error name: ${emailError?.name}`);
            console.error(`❌ [STAFF SUBMITTED] Error message: ${emailError?.message}`);
            console.error(`❌ [STAFF SUBMITTED] Error stack:`, emailError?.stack);
          }
        } else {
          console.warn(`⚠️ [STAFF SUBMITTED] No adminId found, skipping email notification`);
          console.warn(`⚠️ [STAFF SUBMITTED] Could not find FormAssignment for this form submission`);
        }

        // 4. Create activity log
        await prisma.formActivityLog.create({
          data: {
            clientId: batch.client.id,
            logType: "CLIENT",
            action: "Staff Form Section Submitted",
            metadata: {
              formKey,
              formTitle,
              formSubmissionId: formSubmissionIdInt,
              staffName,
              batchId: batch.id,
              submittedAt: new Date().toISOString(),
            },
          },
        });

      } catch (notificationError) {
        console.error(`❌ [STAFF SUBMITTED] Notification error (non-blocking):`, notificationError);
        // Don't fail the main request if notification fails
      }
    }

    return NextResponse.json({ success: true, formSubmissionId: updated.id });
  } catch (error: any) {
    console.error("Error saving form via signature token:", error);
    return NextResponse.json(
      { error: "Failed to save form data", details: error.message },
      { status: 500 }
    );
  }
}