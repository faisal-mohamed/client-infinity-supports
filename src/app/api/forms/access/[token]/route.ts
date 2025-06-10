import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params:Promise<{ token: string }> }
) {
  try {
    const {token} = await params 
    const passcode = req.nextUrl.searchParams.get('passcode');

    // Find the batch by token
    const batch = await prisma.formBatch.findUnique({
      where: { batchToken: token },
      include: {
        client: {
          include: {
            commonFields: true
          }
        },
        assignments: {
          include: {
            form: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
      }
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > new Date(batch.expiresAt)) {
      return NextResponse.json(
        { error: "Access link has expired" },
        { status: 403 }
      );
    }

    // Verify passcode if provided
    if (passcode) {
      const firstAssignment = batch.assignments[0];
      if (!firstAssignment || firstAssignment.passcode !== passcode) {
        return NextResponse.json(
          { error: "Invalid passcode" },
          { status: 403 }
        );
      }
    } else {
      // If no passcode provided, check if one is required
      const firstAssignment = batch.assignments[0];
      if (firstAssignment && firstAssignment.passcode) {
        return NextResponse.json(
          { error: "Passcode required", requiresPasscode: true },
          { status: 403 }
        );
      }
    }

    // Return the batch data with forms
    return NextResponse.json({
      client: batch.client,
      forms: batch.assignments.map(assignment => ({
        id: assignment.id,
        formId: assignment.formId,
        title: assignment.form.title,
        isCompleted: assignment.isCompleted,
        isCommonFieldsCompleted: assignment.isCommonFieldsCompleted,
        accessToken: assignment.accessToken,
        displayOrder: assignment.displayOrder
      })),
      expiresAt: batch.expiresAt
    });
  } catch (error: any) {
    console.error("Error accessing forms:", error);
    return NextResponse.json(
      { error: "Failed to access forms", details: error.message },
      { status: 500 }
    );
  }
}
