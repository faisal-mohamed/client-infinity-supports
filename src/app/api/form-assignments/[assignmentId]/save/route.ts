import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;
    const assignmentIdNum = parseInt(assignmentId);
    const body = await req.json();
    const { formData, commonFieldsData, submit = true } = body;

    if (isNaN(assignmentIdNum)) {
      return NextResponse.json(
        { error: "Invalid assignment ID" },
        { status: 400 }
      );
    }

    // Get form assignment
    const assignment = await prisma.formAssignment.findUnique({
      where: { id: assignmentIdNum },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Form assignment not found" },
        { status: 404 }
      );
    }

    // Update or create FormSubmission
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
        isSubmitted: submit,
        submittedAt: submit ? new Date() : null,
      },
      update: {
        data: formData,
        filledByAdmin: true,
        adminFilledAt: new Date(),
        isSubmitted: submit,
        submittedAt: submit ? new Date() : null,
        updatedAt: new Date(),
      },
    });

    // Update common fields if provided - FILTER to only valid CommonField columns
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      // Define allowed CommonField columns based on your Prisma schema
      const allowedCommonFields = [
        'name', 'age', 'email', 'sex', 'street', 'state', 'postCode', 
        'dob', 'ndis', 'disability', 'address', 'phone'
      ];
      
      // Filter commonFieldsData to only include allowed fields
      const filteredCommonFields = Object.keys(commonFieldsData)
        .filter(key => allowedCommonFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = commonFieldsData[key];
          return obj;
        }, {} as any);

      // Only update if there are valid common fields
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

    // Update FormAssignment completion status
    if (submit) {
      await prisma.formAssignment.update({
        where: { id: assignmentIdNum },
        data: { isCompleted: true },
      });
    }

    return NextResponse.json({
      success: true,
      submissionId: formSubmission.id,
      message: submit ? 'Form saved successfully' : 'Progress saved',
    });

  } catch (error: any) {
    console.error("Error saving form data:", error);
    return NextResponse.json(
      { error: "Failed to save form data", details: error.message },
      { status: 500 }
    );
  }
}
