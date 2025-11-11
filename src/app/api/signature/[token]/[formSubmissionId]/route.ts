import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormConfig } from "@/app/forms/registry";

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

    const result : any = batch.signatureForms.find(item => {
  return item.formSubmission?.id === formSubmissionIdInt;
});

console.log(result);

    // Fetch commonFields separately (same as admin API for consistency)
    const commonFields = await prisma.commonField.findUnique({
      where: { clientId: batch.client.id },
    });

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

    const signatureForm = batch.signatureForms.find((sf : any ) => sf.formSubmissionId === formSubmissionIdInt);
    if (!signatureForm) return NextResponse.json({ error: "Form not found in batch" }, { status: 404 });

    const currentSubmission : any = await prisma.formSubmission.findUnique({
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

    // Auto-detect signatureRole for schedule_of_supports form
    let autoDetectedRole = currentSubmission.data?.signatureRole || "";
    if (formKey === "schedule_of_supports" && !autoDetectedRole) {
      if (dataKey === "nomineeSignature") {
        autoDetectedRole = "Nominee";
      } else if (dataKey === "participantSignature") {
        autoDetectedRole = "Participant";
      }
    }

    const updatedFormData = {
      ...currentSubmission.data,
      [dataKey!]: signature,
      ...(signedAtKey && { [signedAtKey]: signedAt }),
      ...(signerNameKey && { [signerNameKey]: signerName }),
      ...(autoDetectedRole && { signatureRole: autoDetectedRole }),
    };

    await prisma.formSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        clientSignature: "true",
        clientSignedAt: new Date(),
        data: updatedFormData,
      },
    });

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
      const required = getRequiredSignaturesWithGroups(signatures, updatedFormData);
      const allComplete = required.every(sig => !!updatedFormData[sig.dataKey!]);

      await prisma.formAssignment.update({
        where: { id: formAssignment.id },
        data: {
          currentStatus: allComplete ? "completed" : "in_progress",
          isCompleted: allComplete,
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

      const submissionData : any = latestSubmission?.data || {};
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
        const completedFormsData = batch.signatureForms.map((sf : any ) => ({
          id: sf.formSubmissionId,
          formId: sf.formSubmission.form.id,
          title: sf.formSubmission.form?.title || "Untitled",
        }));

        const emailResponse = await fetch(
          `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
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
        signatureForms: { select: { formSubmissionId: true } },
      },
    });

    if (!batch) return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
    if (batch.expiresAt < new Date()) return NextResponse.json({ error: "Signature link expired" }, { status: 410 });

    const inBatch = batch.signatureForms.some((sf: any) => sf.formSubmissionId === formSubmissionIdInt);
    if (!inBatch) return NextResponse.json({ error: "Form not in this signature link" }, { status: 404 });

    // Update submission data and mark as submitted if this is the final submission
    const updated = await prisma.formSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        data,
        updatedAt: new Date(),
        ...(isSubmitted && {
          isSubmitted: true,
          submittedAt: new Date(),
        }),
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, formSubmissionId: updated.id });
  } catch (error: any) {
    console.error("Error saving form via signature token:", error);
    return NextResponse.json(
      { error: "Failed to save form data", details: error.message },
      { status: 500 }
    );
  }
}