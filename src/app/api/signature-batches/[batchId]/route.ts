import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;
    const batchIdNum = parseInt(batchId);

    if (isNaN(batchIdNum)) {
      return NextResponse.json(
        { error: "Invalid batch ID" },
        { status: 400 }
      );
    }

    // Verify the batch exists and is a signature batch
    const batch = await prisma.formBatch.findUnique({
      where: { 
        id: batchIdNum,
        isSignatureOnly: true, // Only allow deletion of signature batches
      },
      include: {
        signatureForms: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Signature batch not found" },
        { status: 404 }
      );
    }

    // Delete in correct order due to foreign key constraints
    // First delete SignatureBatchForm entries
    await prisma.signatureBatchForm.deleteMany({
      where: { batchId: batchIdNum },
    });

    // Then delete the FormBatch
    await prisma.formBatch.delete({
      where: { id: batchIdNum },
    });

    // Log the deletion activity
    await prisma.formActivityLog.create({
      data: {
        clientId: batch.clientId,
        logType: 'ADMIN',
        action: 'Signature Batch Deleted',
        metadata: {
          batchId: batchIdNum,
          batchToken: batch.batchToken,
          formsCount: batch.signatureForms.length,
          deletedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Signature batch deleted successfully',
    });

  } catch (error: any) {
    console.error("Error deleting signature batch:", error);
    return NextResponse.json(
      { error: "Failed to delete signature batch", details: error.message },
      { status: 500 }
    );
  }
}
