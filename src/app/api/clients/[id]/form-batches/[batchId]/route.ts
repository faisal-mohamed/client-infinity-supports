import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string }> }
) {
  try {
    const { id, batchId } = await params; // Await here!
    const clientId = parseInt(id || "0");
    const batchIdNum = parseInt(batchId || "0");
    const body = await req.json();
    const { expiresAt } = body;

    if (!expiresAt) {
      return NextResponse.json(
        { error: "Missing required field: expiresAt" },
        { status: 400 }
      );
    }

    const newExpiresAt = new Date(expiresAt);

    console.log("newExpiresAt", newExpiresAt.getTime());
    


    if (isNaN(newExpiresAt.getTime()) || newExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or past expiresAt date" },
        { status: 400 }
      );
    }

    // Update the FormBatch's expiresAt
    const updatedBatch = await prisma.formBatch.updateMany({
      where: {
        id: batchIdNum,
        clientId: clientId,
      },
      data: {
        expiresAt: newExpiresAt,
      },
    });

    if (updatedBatch.count === 0) {
      return NextResponse.json(
        { error: "Form batch not found" },
        { status: 404 }
      );
    }

    // Update all assignments in the batch to have the new expiry
    await prisma.formAssignment.updateMany({
      where: { batchId: batchIdNum },
      data: {  }
    });

    // Optionally, fetch and return the updated batch
    const batch = await prisma.formBatch.findUnique({
      where: { id: batchIdNum },
    });

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    console.error("Error updating form batch expiry:", error);
    return NextResponse.json(
      { error: "Failed to update form batch expiry", details: error.message },
      { status: 500 }
    );
  }
}
