import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    const body = await req.json();
    const { formIds, adminId } = body;

    if (!adminId || isNaN(adminId)) {
      return NextResponse.json(
        { error: "Missing or invalid admin ID" },
        { status: 400 }
      );
    }

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    if (!formIds || !Array.isArray(formIds) || formIds.length === 0) {
      return NextResponse.json(
        { error: "No forms selected for assignment" },
        { status: 400 }
      );
    }

    // Verify staff exists
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { id: true, firstName: true, surname: true, email: true },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff not found" },
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
    const existingAssignments = await prisma.staffFormAssignment.findMany({
      where: {
        staffId,
        formId: { in: formIds },
      },
      select: {
        formId: true,
        formVersion: true,
      },
    });

    const existingKeys = new Set(
      existingAssignments.map(a => `${a.formId}-${a.formVersion}`)
    );

    // Generate unique batch token
    const batchToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expires in 30 days (consistent with client form assignments)

    // Create a new batch for this assignment
    const batch = await prisma.staffFormBatch.create({
      data: {
        staffId,
        batchToken: batchToken,
        expiresAt: expiresAt,
        isSignatureOnly: false, // This is for form assignment, not signature
      },
    });

    // Filter out duplicates and create new assignments
    const newAssignments = forms.filter(
      form => !existingKeys.has(`${form.id}-${form.version}`)
    );

    if (newAssignments.length === 0) {
      return NextResponse.json(
        { error: "All selected forms are already assigned to this staff" },
        { status: 400 }
      );
    }

    // Create assignments in a transaction
    await prisma.$transaction(
      newAssignments.map((form, index) =>
        prisma.staffFormAssignment.create({
          data: {
            staffId,
            formId: form.id,
            formVersion: form.version,
            batchId: batch.id,
            assignedById: adminId,
            displayOrder: index,
            currentStatus: 'not_started',
            isCompleted: false,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${newAssignments.length} form(s) to staff`,
      assignedForms: newAssignments.map(f => ({ id: f.id, title: f.title })),
    });

  } catch (error: any) {
    console.error("Error assigning forms to staff:", error);
    return NextResponse.json(
      { error: "Failed to assign forms", details: error.message },
      { status: 500 }
    );
  }
}

