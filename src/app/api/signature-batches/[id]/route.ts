import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batchId = parseInt(id);

    if (isNaN(batchId)) {
      return NextResponse.json(
        { error: "Invalid batch ID" },
        { status: 400 }
      );
    }

    // Check if the signature batch exists
    const existingBatch = await prisma.formBatch.findUnique({
      where: { 
        id: batchId,
        isSignatureOnly: true // Ensure it's a signature batch
      },
      include: {
        signatureForms: true,
      },
    });

    if (!existingBatch) {
      return NextResponse.json(
        { error: "Signature batch not found" },
        { status: 404 }
      );
    }

    // Delete the signature batch and related records in a transaction
    await prisma.$transaction(async (tx: any) => {
      // First delete all SignatureBatchForm records
      await tx.signatureBatchForm.deleteMany({
        where: { batchId: batchId },
      });

      // Then delete the FormBatch
      await tx.formBatch.delete({
        where: { id: batchId },
      });
    });

    return NextResponse.json({
      message: "Signature batch deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting signature batch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
