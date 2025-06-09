import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; formId: string } }
) {
  try {
    const clientId = parseInt(params.id);
    const formId = parseInt(params.formId);
    
    // Get the form submission for this client and form
    const formSubmission = await prisma.formSubmission.findFirst({
      where: {
        clientId,
        formId
      },
      include: {
        form: true
      }
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
    const clientId = parseInt(params.id);
    const formId = parseInt(params.formId);
    const body = await req.json();
    const { data, isSubmitted } = body;
    
    // Get the form to check if it exists and get its version
    const form = await prisma.masterForm.findUnique({
      where: { id: formId }
    });
    
    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }
    
    // Update or create the form submission
    const formSubmission = await prisma.formSubmission.upsert({
      where: {
        clientId_formId_formVersion: {
          clientId,
          formId,
          formVersion: form.version
        }
      },
      update: {
        data,
        isSubmitted: isSubmitted || false,
        submittedAt: isSubmitted ? new Date() : null
      },
      create: {
        clientId,
        formId,
        formVersion: form.version,
        data,
        isSubmitted: isSubmitted || false,
        submittedAt: isSubmitted ? new Date() : null
      }
    });
    
    // If the form is submitted, update the form assignment status
    if (isSubmitted) {
      await prisma.formAssignment.updateMany({
        where: {
          clientId,
          formId
        },
        data: {
          isCompleted: true
        }
      });
      
      // Log the form submission activity
      await prisma.formActivityLog.create({
        data: {
          clientId,
          logType: "CLIENT",
          action: "Submitted Form",
          metadata: {
            formId,
            formKey: form.formKey,
            formTitle: form.title,
            formVersion: form.version,
            submissionId: formSubmission.id
          }
        }
      });
    } else {
      // Log the form progress activity
      await prisma.formActivityLog.create({
        data: {
          clientId,
          logType: "CLIENT",
          action: "Saved Form Progress",
          metadata: {
            formId,
            formKey: form.formKey,
            formTitle: form.title,
            formVersion: form.version,
            submissionId: formSubmission.id
          }
        }
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
