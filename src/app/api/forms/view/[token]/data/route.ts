import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const {token} = await params
    const passcode = req.nextUrl.searchParams.get('passcode');
    
    // Find the form assignment by access token
    const assignment = await prisma.formAssignment.findUnique({
      where: { accessToken: token },
      include: {
        client: {
          include: {
            commonFields: true
          }
        },
        form: true,
        batch: true
      }
    });
    
    if (!assignment) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 404 }
      );
    }
    
    // Check if expired
    if (new Date() > new Date(assignment.expiresAt)) {
      return NextResponse.json(
        { error: "Access link has expired" },
        { status: 403 }
      );
    }
    
    // Verify passcode if required
    if (assignment.passcode) {
      if (!passcode || assignment.passcode !== passcode) {
        return NextResponse.json(
          { error: "Invalid passcode" },
          { status: 403 }
        );
      }
    }
    
    // Get existing form submission if any
    const formSubmission = await prisma.formSubmission.findFirst({
      where: {
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion
      }
    });
    
    // Get next and previous forms in the batch if applicable
    let nextForm = null;
    let previousForm = null;
    
    if (assignment.batchId) {
      const batchForms = await prisma.formAssignment.findMany({
        where: {
          batchId: assignment.batchId
        },
        orderBy: {
          displayOrder: 'asc'
        }
      });
      
      const currentIndex = batchForms.findIndex(form => form.id === assignment.id);
      
      if (currentIndex > 0) {
        previousForm = batchForms[currentIndex - 1];
      }
      
      if (currentIndex < batchForms.length - 1) {
        nextForm = batchForms[currentIndex + 1];
      }
    }
    
    // Prepare the response data
    const responseData = {
      assignment,
      form: assignment.form,
      client: assignment.client,
      commonFields: assignment.client.commonFields[0] || null,
      formData: formSubmission?.data || {},
      isSubmitted: formSubmission?.isSubmitted || false,
      navigation: {
        previousForm: previousForm ? {
          id: previousForm.id,
          accessToken: previousForm.accessToken
        } : null,
        nextForm: nextForm ? {
          id: nextForm.id,
          accessToken: nextForm.accessToken
        } : null,
        batchToken: assignment.batch?.batchToken || null
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error fetching form data:", error);
    return NextResponse.json(
      { error: "Failed to fetch form data", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token || "";
    const passcode = req.nextUrl.searchParams.get('passcode');
    const body = await req.json();
    
    // Find the form assignment by access token
    const assignment = await prisma.formAssignment.findUnique({
      where: { accessToken: token },
      include: {
        form: true
      }
    });
    
    if (!assignment) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 404 }
      );
    }
    
    // Check if expired
    if (new Date() > new Date(assignment.expiresAt)) {
      return NextResponse.json(
        { error: "Access link has expired" },
        { status: 403 }
      );
    }
    
    // Verify passcode if required
    if (assignment.passcode) {
      if (!passcode || assignment.passcode !== passcode) {
        return NextResponse.json(
          { error: "Invalid passcode" },
          { status: 403 }
        );
      }
    }
    
    // Check if already submitted
    if (assignment.isCompleted && body.isSubmitted) {
      return NextResponse.json(
        { error: "Form has already been submitted" },
        { status: 400 }
      );
    }
    
    // Update or create form submission
    const formSubmission = await prisma.formSubmission.upsert({
      where: {
        clientId_formId_formVersion: {
          clientId: assignment.clientId,
          formId: assignment.formId,
          formVersion: assignment.formVersion
        }
      },
      update: {
        data: body.data,
        isSubmitted: body.isSubmitted || false,
        submittedAt: body.isSubmitted ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        clientId: assignment.clientId,
        formId: assignment.formId,
        formVersion: assignment.formVersion,
        data: body.data,
        isSubmitted: body.isSubmitted || false,
        submittedAt: body.isSubmitted ? new Date() : null
      }
    });
    
    // If the form is submitted, update the assignment status
    if (body.isSubmitted) {
      await prisma.formAssignment.update({
        where: {
          id: assignment.id
        },
        data: {
          isCompleted: true
        }
      });
      
      // Log the form submission
      await prisma.formActivityLog.create({
        data: {
          clientId: assignment.clientId,
          logType: "CLIENT",
          action: "Submitted Form",
          metadata: {
            formId: assignment.formId,
            formTitle: assignment.form.title,
            formVersion: assignment.formVersion
          }
        }
      });
    } else {
      // Log the form progress
      await prisma.formActivityLog.create({
        data: {
          clientId: assignment.clientId,
          logType: "CLIENT",
          action: "Saved Form Progress",
          metadata: {
            formId: assignment.formId,
            formTitle: assignment.form.title,
            formVersion: assignment.formVersion
          }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      isSubmitted: body.isSubmitted || false,
      formSubmission
    });
  } catch (error: any) {
    console.error("Error updating form data:", error);
    return NextResponse.json(
      { error: "Failed to update form data", details: error.message },
      { status: 500 }
    );
  }
}
