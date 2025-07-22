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
        commonFields: {
          select: {
            name: true,
            age: true,
            email: true,
            sex: true,
            street: true,
            state: true,
            postCode: true,
            dob: true,
            ndis: true,
            disability: true,
            address: true,
            phone: true,
          },
        },
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

    return NextResponse.json({
      formSubmission: result.formSubmission,
      client: batch.client,
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

// POST - Submit signature for specific form
// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
// ) {
//   try {
//     const { token, formSubmissionId } = await params;
//     const formSubmissionIdInt = parseInt(formSubmissionId);
//     const { signature, signatureId } = await req.json();

//     if (!token || !formSubmissionIdInt || !signature) {
//       return NextResponse.json(
//         { error: "Token, form submission ID, and signature are required" },
//         { status: 400 }
//       );
//     }

//     // Find and verify the signature batch
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
//       return NextResponse.json(
//         { error: "Signature link not found" },
//         { status: 404 }
//       );
//     }

//     // Check if batch has expired
//     if (batch.expiresAt < new Date()) {
//       return NextResponse.json(
//         { error: "This signature link has expired" },
//         { status: 410 }
//       );
//     }

//     // Verify the form exists in this batch
//     const signatureForm: any = batch.signatureForms.find(
//       sf => sf.formSubmissionId === formSubmissionIdInt
//     );

//     if (!signatureForm) {
//       return NextResponse.json(
//         { error: "Form not found in this signature batch" },
//         { status: 404 }
//       );
//     }

//     // Update the form submission with signature
//     const currentSubmission: any = await prisma.formSubmission.findUnique({
//       where: { id: formSubmissionIdInt },
//       select: { data: true },
//     });

//     if (!currentSubmission) {
//       return NextResponse.json(
//         { error: "Form submission not found" },
//         { status: 404 }
//       );
//     }

//     // Get the signature field key from form registry
//     const formConfig = getFormConfig(signatureForm.formSubmission.form.formKey);
//     const signatures = formConfig?.signatures || [];

//     // Find the specific signature config based on signatureId
//     let signatureConfig : any;
//     let signatureDataKey : string;
    
//     if (signatureId) {
//       // Multi-signature: find specific signature by ID
//       signatureConfig = signatures.find(sig => sig.id === signatureId);
//       if (!signatureConfig) {
//         return NextResponse.json(
//           { error: `Signature configuration not found for ID: ${signatureId}` },
//           { status: 400 }
//         );
//       }
//       signatureDataKey = signatureConfig.dataKey;
//     } else {
//       // Legacy single signature: use primary signature
//       const primarySignature = signatures.find(sig => sig.required) || signatures[0];
//       signatureDataKey = primarySignature?.dataKey || 'signature';
//       signatureConfig = primarySignature;
//     }

//     const updatedFormData = {
//       ...currentSubmission.data,
//       [signatureDataKey]: signature,
//     };

//     await prisma.formSubmission.update({
//       where: { id: formSubmissionIdInt },
//       data: {
//         clientSignature: "true",
//         clientSignedAt: new Date(),
//         data: updatedFormData,
//       },
//     });

//     // Update form assignment status - check if ALL required signatures are now complete
//     const formAssignment = await prisma.formAssignment.findFirst({
//       where: {
//         clientId: signatureForm.formSubmission.clientId,
//         formId: signatureForm.formSubmission.formId,
//         formVersion: signatureForm.formSubmission.formVersion,
//       },
//     });

//     if (formAssignment) {
//       const requiredSignatures = signatures.filter(sig => sig.required);
//       const completedCount = requiredSignatures.filter(sig => {
//         const dataKey = sig.dataKey || sig.id;
//         return updatedFormData[dataKey];
//       }).length;

//       const newStatus = completedCount === requiredSignatures.length ? "completed" : "in_progress";

//       await prisma.formAssignment.update({
//         where: { id: formAssignment.id },
//         data: {
//           currentStatus: newStatus,
//           isCompleted: newStatus === "completed",
//         },
//       });
//     }

//     // Check if all required signatures in this batch are now complete
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
//                     title: true, // ✅ Add title field
//                     requiresSignature: true,
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

//     if (updatedBatch) {
//       const formsRequiringSignature = updatedBatch.signatureForms.filter(
//         sf => sf.formSubmission.form.requiresSignature === true
//       );

//       const signedForms = formsRequiringSignature.filter(
//         sf => sf.formSubmission.clientSignature !== null
//       );

//       const isNowComplete =
//         formsRequiringSignature.length === signedForms.length &&
//         formsRequiringSignature.length > 0;

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
//               totalForms: formsRequiringSignature.length,
//               completedAt: new Date().toISOString(),
//             },
//           },
//         });

//         // ✅ Send admin notifications
//         try {
//           const allAdmins = await prisma.admin.findMany({ select: { id: true } });

//           const notificationPromises = allAdmins.map(admin =>
//             prisma.formSubmissionNotification.create({
//               data: {
//                 adminId: admin.id,
//                 clientId: updatedBatch.client.id,
//                 formSubmissionId: signatureForm.formSubmissionId,
//               },
//             })
//           );

//           await Promise.all(notificationPromises);

//           console.warn(`🔔 Notifications sent to ${allAdmins.length} admins for completed batch`);

//           // 🔔 NEW: Send email notification for batch completion ------------------------------------------
//           try {
//             console.log(`📧 Sending batch completion email for client: ${updatedBatch.client.name}`);
            
//             // Prepare completed forms data for email
//             const completedFormsData = formsRequiringSignature.map((sf : any)  => {
//               console.log(`🔍 Form data for email:`, {
//                 formSubmissionId: sf.formSubmissionId,
//                 formId: sf.formSubmission.formId,
//                 formTitle: sf.formSubmission.form?.title,
//                 hasForm: !!sf.formSubmission.form,
//                 formObject: sf.formSubmission.form
//               });
              
//               return {
//                 id: sf.formSubmissionId,
//                 formId: sf.formSubmission.formId,
//                 title: sf.formSubmission.form?.title || 'Unknown Form'
//               };
//             });

//             console.log(`📧 Final completed forms data for email:`, completedFormsData);

//             // Make internal API call to send dual notification (admin + client)
//             const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || `${window.location.origin}`}/api/notifications/send-email`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 type: 'dual_notification', // Send to both admin and client
//                 clientId: updatedBatch.client.id,
//                 clientName: updatedBatch.client.name,
//                 clientEmail: updatedBatch.client.email, // Client will receive confirmation
//                 batchId: batch.id,
//                 completedForms: completedFormsData,
//                 completedAt: new Date().toLocaleString()
//               })
//             });

//             if (emailResponse.ok) {
//               const emailResult = await emailResponse.json();
//               console.log(`✅ Dual notification emails sent successfully:`, {
//                 adminEmail: emailResult.adminEmail,
//                 clientEmail: emailResult.clientEmail,
//                 totalEmails: emailResult.totalEmails,
//                 client: updatedBatch.client.name
//               });
//             } else {
//               const emailError = await emailResponse.text();
//               console.error(`❌ Failed to send dual notification emails:`, emailError);
//             }
//           } catch (emailError) {
//             console.error("❌ Email notification failed (non-blocking):", emailError);
//             // Don't fail the main request if email fails
//           }




//           //mail notification code end
//         } catch (notifyErr) {
//           console.error("❌ Failed to create admin notifications:", notifyErr);
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Signature submitted successfully",
//       signatureId: signatureId || 'primary',
//       signatureLabel: signatureConfig?.label || 'Signature',
//       allSignaturesComplete: formAssignment ? (formAssignment.currentStatus === "completed") : false,
//     });

//   } catch (error: any) {
//     console.error("Error submitting signature:", error);
//     return NextResponse.json(
//       { error: "Failed to submit signature", details: error.message },
//       { status: 500 }
//     );
//   }
// }




export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string; formSubmissionId: string }> }
) {
  try {
    const { token, formSubmissionId } = await params;
    const formSubmissionIdInt = parseInt(formSubmissionId);
    const { signature, signatureId, signedAt } = await req.json();

    if (!token || !formSubmissionIdInt || !signature || !signatureId || !signedAt) {
      return NextResponse.json(
        { error: "Token, formSubmissionId, signature, signatureId, and signedAt are required" },
        { status: 400 }
      );
    }

    // Fetch the signature batch and include relevant data
    const batch = await prisma.formBatch.findUnique({
      where: {
        batchToken: token,
        isSignatureOnly: true,
      },
      include: {
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    formKey: true,
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
      return NextResponse.json({ error: "Signature link not found" }, { status: 404 });
    }

    if (batch.expiresAt < new Date()) {
      return NextResponse.json({ error: "This signature link has expired" }, { status: 410 });
    }

    const signatureForm: any = batch.signatureForms.find(
      sf => sf.formSubmissionId === formSubmissionIdInt
    );

    if (!signatureForm) {
      return NextResponse.json({ error: "Form not found in this signature batch" }, { status: 404 });
    }

    const currentSubmission = await prisma.formSubmission.findUnique({
      where: { id: formSubmissionIdInt },
      select: { data: true, clientId: true, formId: true, formVersion: true },
    });

    if (!currentSubmission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 });
    }

    const formKey = signatureForm.formSubmission.form.formKey;
    const formConfig = getFormConfig(formKey);
    const signatures = formConfig?.signatures || [];

    const signatureConfig = signatures.find(sig => sig.id === signatureId);
    if (!signatureConfig) {
      return NextResponse.json(
        { error: `Signature configuration not found for ID: ${signatureId}` },
        { status: 400 }
      );
    }

    const signatureDataKey = signatureConfig.dataKey;
    const signedAtKey = signatureConfig.signedAtKey;

    const updatedFormData = {
      ...currentSubmission.data,
      [signatureDataKey]: signature,
      ...(signedAtKey && { [signedAtKey]: signedAt }),
    };

    await prisma.formSubmission.update({
      where: { id: formSubmissionIdInt },
      data: {
        clientSignature: "true",
        clientSignedAt: new Date(),
        data: updatedFormData,
      },
    });

    // Update FormAssignment status
    const formAssignment = await prisma.formAssignment.findFirst({
      where: {
        clientId: currentSubmission.clientId,
        formId: currentSubmission.formId,
        formVersion: currentSubmission.formVersion,
      },
    });

    if (formAssignment) {
      const requiredSignatures = signatures.filter(sig => sig.required);
      const completedCount = requiredSignatures.filter(sig => {
        const key = sig.dataKey;
        return updatedFormData[key];
      }).length;

      const newStatus = completedCount === requiredSignatures.length ? 'completed' : 'in_progress';

      await prisma.formAssignment.update({
        where: { id: formAssignment.id },
        data: {
          currentStatus: newStatus,
          isCompleted: newStatus === 'completed',
        },
      });
    }

    // Check if batch is fully signed
    const updatedBatch = await prisma.formBatch.findUnique({
      where: { id: batch.id },
      include: {
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: { id: true, title: true, requiresSignature: true },
                },
              },
            },
          },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (updatedBatch) {
      const formsRequiringSignature = updatedBatch.signatureForms.filter(
        sf => sf.formSubmission.form.requiresSignature === true
      );

      const signedForms = formsRequiringSignature.filter(
        sf => sf.formSubmission.clientSignature !== null
      );

      const isNowComplete =
        formsRequiringSignature.length === signedForms.length &&
        formsRequiringSignature.length > 0;

      if (isNowComplete && !updatedBatch.isCompleted) {
        await prisma.formBatch.update({
          where: { id: batch.id },
          data: {
            isCompleted: true,
            completedAt: new Date(),
          },
        });

        await prisma.formActivityLog.create({
          data: {
            clientId: updatedBatch.client.id,
            logType: 'CLIENT',
            action: 'Signature Batch Completed',
            metadata: {
              batchId: batch.id,
              batchToken: batch.batchToken,
              clientName: updatedBatch.client.name,
              totalForms: formsRequiringSignature.length,
              completedAt: new Date().toISOString(),
            },
          },
        });

        // Notify all admins
        const allAdmins = await prisma.admin.findMany({ select: { id: true } });
        const notificationPromises = allAdmins.map(admin =>
          prisma.formSubmissionNotification.create({
            data: {
              adminId: admin.id,
              clientId: updatedBatch.client.id,
              formSubmissionId: formSubmissionIdInt,
            },
          })
        );
        await Promise.all(notificationPromises);

        // Optional: send email notification here (as in your original version)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Signature submitted successfully",
      signatureId,
      signedAt,
      allSignaturesComplete: formAssignment?.currentStatus === 'completed' || false,
    });
  } catch (error: any) {
    console.error("Error submitting signature:", error);
    return NextResponse.json(
      { error: "Failed to submit signature", details: error.message },
      { status: 500 }
    );
  }
}
