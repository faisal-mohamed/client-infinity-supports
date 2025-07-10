import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id);
    const body = await req.json();
    const { formIds } = body;

    if (isNaN(clientId)) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    if (!formIds || !Array.isArray(formIds) || formIds.length === 0) {
      return NextResponse.json(
        { error: "No forms selected for assignment" },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, name: true, email: true },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get the forms to be assigned
    const forms = await prisma.masterForm.findMany({
      where: { id: { in: formIds } },
      select: {
        id: true,
        formKey: true,
        title: true,
        version: true,
      },
    });

    if (forms.length !== formIds.length) {
      return NextResponse.json(
        { error: "Some forms not found" },
        { status: 400 }
      );
    }

    // Check for existing assignments to avoid duplicates
    const existingAssignments = await prisma.formAssignment.findMany({
      where: {
        clientId: clientId,
        OR: forms.map(form => ({
          formId: form.id,
          formVersion: form.version,
        })),
      },
      select: {
        formId: true,
        formVersion: true,
      },
    });

    // Filter out forms that are already assigned
    const newFormsToAssign = forms.filter(form => 
      !existingAssignments.some(existing => 
        existing.formId === form.id && existing.formVersion === form.version
      )
    );

    if (newFormsToAssign.length === 0) {
      return NextResponse.json(
        { error: "All selected forms are already assigned to this client" },
        { status: 400 }
      );
    }

    // Generate unique batch token
    const batchToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days

    // Create FormBatch
    const formBatch = await prisma.formBatch.create({
      data: {
        clientId: clientId,
        batchToken: batchToken,
        passcode: null, // No passcode needed for admin-managed workflow
        expiresAt: expiresAt,
        isSignatureOnly: false, // This is for form assignment, not signature
      },
    });

    // Create FormAssignments
    const formAssignments = await Promise.all(
      newFormsToAssign.map(async (form, index) => {
        return prisma.formAssignment.create({
          data: {
            clientId: clientId,
            formId: form.id,
            formVersion: form.version,
            batchId: formBatch.id,
            displayOrder: index + 1,
          },
        });
      })
    );

    // Log the assignment activity
    await prisma.formActivityLog.create({
      data: {
        clientId: clientId,
        logType: 'ADMIN',
        action: 'Forms Assigned',
        metadata: {
          batchId: formBatch.id,
          formsAssigned: newFormsToAssign.map(form => ({
            formId: form.id,
            formKey: form.formKey,
            title: form.title,
            version: form.version,
          })),
          assignedCount: newFormsToAssign.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${newFormsToAssign.length} form(s) to ${client.name}`,
      batchId: formBatch.id,
      batchToken: batchToken,
      assignedForms: newFormsToAssign.map(form => ({
        id: form.id,
        title: form.title,
        formKey: form.formKey,
        version: form.version,
      })),
      skippedForms: forms.length - newFormsToAssign.length, // Already assigned forms
    });

  } catch (error: any) {
    console.error("Error assigning forms to client:", error);
    return NextResponse.json(
      { error: "Failed to assign forms to client", details: error.message },
      { status: 500 }
    );
  }
}
