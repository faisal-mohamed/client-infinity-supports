import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/batch/signature
// Body: { batchToken: string, signature: string }
export async function POST(req: NextRequest) {
  try {
    const { batchToken, signature } = await req.json();
    if (!batchToken || !signature) {
      return NextResponse.json({ error: "Missing batchToken or signature" }, { status: 400 });
    }

    // Find the batch
    const batch = await prisma.formBatch.findUnique({
      where: { batchToken },
    });
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    // Update the batch with signature, mark as signed, and set signedAt
    await prisma.formBatch.update({
      where: { batchToken },
      data: {
        signature,
        isSigned: true,
        signedAt: new Date(),
        signedBy: "client", // or "admin" if needed
      },
    });

    // Optionally, lock all assignments in the batch (if you want to prevent edits)
    await prisma.formAssignment.updateMany({
      where: { batchId: batch.id },
      data: { isCompleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
