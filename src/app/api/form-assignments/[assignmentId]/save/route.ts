// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { validateFormSignatures } from "@/lib/signatureValidation";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ assignmentId: string }> }
// ) {
//   try {
//     const { assignmentId } = await params;
//     const assignmentIdNum = parseInt(assignmentId);
//     const body = await req.json();
//     const { formData, commonFieldsData } = body;

//     if (isNaN(assignmentIdNum)) {
//       return NextResponse.json(
//         { error: "Invalid assignment ID" },
//         { status: 400 }
//       );
//     }

//     // Get form assignment with form details
//     const assignment = await prisma.formAssignment.findUnique({
//       where: { id: assignmentIdNum },
//       include: {
//         form: {
//           select: {
//             id: true,
//             formKey: true,
//             title: true,
//             version: true,
//           },
//         },
//       },
//     });

//     if (!assignment) {
//       return NextResponse.json(
//         { error: "Form assignment not found" },
//         { status: 404 }
//       );
//     }

//     // NEW: Validate signature completion using registry-based system
//     const signatureValidation = validateFormSignatures(
//       assignment.form.formKey,
//       formData
//     );

//     // Determine if form has all required signatures
//     const hasAllSignatures = signatureValidation.isComplete;

//     // Prepare signature completion flag for FormSubmission
//     let clientSignature = null;
//     let clientSignedAt = null;

//     if (hasAllSignatures) {
//       // Store completion status as string flag, not base64 data
//       clientSignature = "true"; // Simple completion flag
//       clientSignedAt = new Date();
//     }

//     // 🎯 SAVE STATUS LOGIC (Always in_progress for saves)
//     const newStatus = "in_progress"; // Save operations always set to in_progress
    

//     // Update or create FormSubmission
//     const formSubmission = await prisma.formSubmission.upsert({
//       where: {
//         clientId_formId_formVersion: {
//           clientId: assignment.clientId,
//           formId: assignment.formId,
//           formVersion: assignment.formVersion,
//         },
//       },
//       create: {
//         clientId: assignment.clientId,
//         formId: assignment.formId,
//         formVersion: assignment.formVersion,
//         data: formData,
//         filledByAdmin: true,
//         adminFilledAt: new Date(),
//         isSubmitted: false, // Save operations are not submissions
//         submittedAt: null, // No submission date for saves
//         clientSignature: clientSignature,
//         clientSignedAt: clientSignedAt,
//       },
//       update: {
//         data: formData,
//         filledByAdmin: true,
//         adminFilledAt: new Date(),
//         isSubmitted: false, // Save operations are not submissions
//         submittedAt: null, // No submission date for saves
//         updatedAt: new Date(),
//         // Update signature fields if signatures are complete
//         ...(hasAllSignatures && {
//           clientSignature: clientSignature,
//           clientSignedAt: clientSignedAt,
//         }),
//       },
//     });

//     // Update common fields if provided - FILTER to only valid CommonField columns
//     if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
//       // Define allowed CommonField columns based on your Prisma schema
//       const allowedCommonFields = [
//         'name', 'age', 'email', 'sex', 'street', 'state', 'postCode', 
//         'dob', 'ndis', 'disability', 'address', 'phone'
//       ];
      
//       // Filter commonFieldsData to only include allowed fields
//       const filteredCommonFields = Object.keys(commonFieldsData)
//         .filter(key => allowedCommonFields.includes(key))
//         .reduce((obj, key) => {
//           obj[key] = commonFieldsData[key];
//           return obj;
//         }, {} as any);

//       // Only update if there are valid common fields
//       if (Object.keys(filteredCommonFields).length > 0) {
//         await prisma.commonField.upsert({
//           where: { clientId: assignment.clientId },
//           create: {
//             clientId: assignment.clientId,
//             ...filteredCommonFields,
//           },
//           update: {
//             ...filteredCommonFields,
//             updatedAt: new Date(),
//           },
//         });
//     console.log(`🎯 Updating FormAssignment ${assignmentIdNum} to status: ${newStatus}`);
//       }
//     }

//     // Update FormAssignment completion status
//     // 🎯 UPDATE FORM ASSIGNMENT WITH NEW STATUS
//     {
//       await prisma.formAssignment.update({
//         where: { id: assignmentIdNum },
//         data: { 
//         currentStatus: newStatus,
//         isCompleted: false,
//       },
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       submissionId: formSubmission.id,
//       currentStatus: newStatus, // Return new status
//       signatureStatus: {
//         isComplete: signatureValidation.isComplete,
//         completedCount: signatureValidation.completedCount,
//         totalRequired: signatureValidation.totalRequired,
//         completedSignatures: signatureValidation.completedSignatures,
//         missingSignatures: signatureValidation.missingSignatures,
//       },
//       message: hasAllSignatures 
//         ? `Form completed with all ${signatureValidation.totalRequired} signature(s)` 
//         : signatureValidation.totalRequired > 0
//           ? `Form saved - ${signatureValidation.missingSignatures.length} signature(s) remaining`
//           : 'Form saved successfully',
//     });

//   } catch (error: any) {
//     console.error("Error saving form data:", error);
//     return NextResponse.json(
//       { error: "Failed to save form data", details: error.message },
//       { status: 500 }
//     );
//   }
// }


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
    const assignment = await prisma.formAssignment.findUnique({
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
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Form assignment not found" },
        { status: 404 }
      );
    }

    // Fetch existing submission to check if it was already signed
    const existingSubmission = await prisma.formSubmission.findUnique({
      where: {
        clientId_formId_formVersion: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
        },
      },
    });

    // Validate signature status based on new formData
    const signatureValidation = validateFormSignatures(
      assignment.form.formKey,
      formData
    );
    const hasAllSignatures = signatureValidation.isComplete;

    // Logic to reset signature if form was already signed
    let clientSignature = null;
    let clientSignedAt = null;

    if (existingSubmission?.clientSignature === "true") {
      // Signature was already marked, but form is being edited → remove signature
      clientSignature = null;
      clientSignedAt = null;
    } else if (hasAllSignatures) {
      // Newly signed
      clientSignature = "true";
      clientSignedAt = new Date();
    }

    const newStatus = "in_progress"; // Always 'in_progress' on save

    // Upsert form submission
    const formSubmission = await prisma.formSubmission.upsert({
      where: {
        clientId_formId_formVersion: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion,
        },
      },
      create: {
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: false,
        submittedAt: null,
        clientSignature,
        clientSignedAt,
      },
      update: {
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: false,
        submittedAt: null,
        updatedAt: new Date(),
        clientSignature,
        clientSignedAt,
      },
    });

    // Update common fields (only valid ones)
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      const allowedCommonFields = [
        'name', 'age', 'email', 'sex', 'street', 'state', 'postCode',
        'dob', 'ndis', 'disability', 'address', 'phone'
      ];

      const filteredCommonFields = Object.keys(commonFieldsData)
        .filter(key => allowedCommonFields.includes(key))
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

    // Update FormAssignment status
    await prisma.formAssignment.update({
      where: { id: assignmentIdNum },
      data: {
        currentStatus: newStatus,
        isCompleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: formSubmission.id,
      currentStatus: newStatus,
      signatureStatus: {
        isComplete: signatureValidation.isComplete,
        completedCount: signatureValidation.completedCount,
        totalRequired: signatureValidation.totalRequired,
        completedSignatures: signatureValidation.completedSignatures,
        missingSignatures: signatureValidation.missingSignatures,
      },
      message: hasAllSignatures
        ? `Form completed with all ${signatureValidation.totalRequired} signature(s)`
        : signatureValidation.totalRequired > 0
          ? `Form saved - ${signatureValidation.missingSignatures.length} signature(s) remaining`
          : 'Form saved successfully',
    });

  } catch (error: any) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { error: "Failed to save form data", details: error.message },
      { status: 500 }
    );
  }
}
