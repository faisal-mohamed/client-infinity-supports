import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batchId = parseInt(id);
    const body = await req.json();
    const { expiresAt } = body;

    if (isNaN(batchId)) {
      return NextResponse.json(
        { error: "Invalid batch ID" },
        { status: 400 }
      );
    }

    if (!expiresAt) {
      return NextResponse.json(
        { error: "Expiry date is required" },
        { status: 400 }
      );
    }

    // Validate that the expiry date is in the future
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    
    if (expiryDate <= now) {
      return NextResponse.json(
        { error: "Expiry date must be in the future" },
        { status: 400 }
      );
    }

    // Check if the signature batch exists
    const existingBatch = await prisma.formBatch.findUnique({
      where: { 
        id: batchId,
        isSignatureOnly: true // Ensure it's a signature batch
      },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { error: "Signature batch not found" },
        { status: 404 }
      );
    }

    // Update the expiry date
    const updatedBatch = await prisma.formBatch.update({
      where: { id: batchId },
      data: { expiresAt: expiryDate },
    });

    return NextResponse.json({
      message: "Expiry date updated successfully",
      batch: updatedBatch,
    });

  } catch (error) {
    console.error("Error updating signature batch expiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
