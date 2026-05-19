import { NextRequest, NextResponse } from "next/server";
import { getSubmission, getFormById, upsertSubmission, updateAssignmentStatus, getClientAssignments, createActivityLog } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; formId: string }> }
) {
  try {
    const { id, formId } = await params;

    // Get assignments to find the correct formVersion/instanceNumber
    const assignments = await getClientAssignments(id);
    const assignment = assignments.find((a) => a.formId === formId);

    if (!assignment) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    const formSubmission = await getSubmission(id, formId, assignment.formVersion, assignment.instanceNumber);

    if (!formSubmission) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...formSubmission,
      form: {
        id: assignment.formId,
        formKey: assignment.formKey,
        title: assignment.formTitle,
        version: assignment.formVersion,
      },
    });
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
  { params }: { params: Promise<{ id: string; formId: string }> }
) {
  try {
    const { id, formId } = await params;
    const body = await req.json();
    const { data, isSubmitted = false } = body;

    const form = await getFormById(formId);
    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Find the assignment to get instanceNumber
    const assignments = await getClientAssignments(id);
    const assignment = assignments.find((a) => a.formId === formId);
    const instanceNumber = assignment?.instanceNumber || 1;

    const formSubmission = await upsertSubmission({
      clientId: id,
      formId,
      formVersion: form.version,
      instanceNumber,
      data,
      isSubmitted,
      submittedAt: isSubmitted ? new Date().toISOString() : undefined,
      filledByAdmin: false,
      formKey: form.formKey,
      formTitle: form.title,
    });

    if (isSubmitted && assignment) {
      const { calculateFormStatus } = await import("@/lib/formStatusHelper");
      const newStatus = calculateFormStatus(form.formKey, data, true, true);

      await updateAssignmentStatus(id, assignment.id, newStatus, assignment.currentStatus);

      await createActivityLog({
        clientId: id,
        logType: "CLIENT",
        action: "Submitted Form",
        metadata: {
          formId,
          formTitle: form.title,
          formVersion: form.version,
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
