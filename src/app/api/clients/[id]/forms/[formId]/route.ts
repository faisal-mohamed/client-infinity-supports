import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; formId: string } }
) {
  try {
    // Make sure to parse params safely
    const clientId = parseInt(params.id || "0");
    const formId = parseInt(params.formId || "0");

    // Get the form submission for this client and form
    const formSubmission = await prisma.formSubmission.findFirst({
      where: {
        clientId,
        formId,
      },
      include: {
        form: true,
      },
    });

    if (!formSubmission) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(formSubmission);
  } catch (error: any) {
    console.error("Error fetching form submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submission", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; formId: string } }
) {
  try {
    const clientId = parseInt(params.id || "0");
    const formId = parseInt(params.formId || "0");
    const body = await req.json();
    const { data, isSubmitted = false } = body;

    // Get the form to get its version
    const form = await prisma.masterForm.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Check if a submission already exists
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: {
        clientId,
        formId,
      },
    });

    let formSubmission;

    if (existingSubmission) {
      // Update existing submission
      formSubmission = await prisma.formSubmission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          data,
          isSubmitted,
          submittedAt: isSubmitted ? new Date() : existingSubmission.submittedAt,
        },
      });
    } else {
      // Create new submission
      formSubmission = await prisma.formSubmission.create({
        data: {
          clientId,
          formId,
          formVersion: form.version,
          data,
          isSubmitted,
          submittedAt: isSubmitted ? new Date() : null,
        },
      });
    }

    // If the form is submitted, update the form assignment status
    if (isSubmitted) {
      await prisma.formAssignment.updateMany({
        where: {
          clientId,
          formId,
        },
        data: {
          isCompleted: true,
        },
      });

      // Log the form submission
      await prisma.formActivityLog.create({
        data: {
          clientId,
          logType: "CLIENT",
          action: "Submitted Form",
          metadata: {
            formId,
            formTitle: form.title,
            formVersion: form.version,
          },
        },
      });
    }

    return NextResponse.json(formSubmission);
  } catch (error: any) {
    console.error("Error updating form submission:", error);
    return NextResponse.json(
      { error: "Failed to update form submission", details: error.message },
      { status: 500 }
    );
  }
}
