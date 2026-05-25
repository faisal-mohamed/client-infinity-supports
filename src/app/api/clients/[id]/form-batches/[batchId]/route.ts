import { NextRequest, NextResponse } from "next/server";
import { getBatchById, updateBatch } from "@/lib/db";
import { validateClientOwnership, isOwnershipError } from '@/lib/client-ownership';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; batchId: string }> }
) {
  try {
    const { id, batchId } = await params;

    const ownership = await validateClientOwnership(id);
    if (isOwnershipError(ownership)) return ownership;
    const body = await req.json();
    const { expiresAt } = body;

    if (!expiresAt) {
      return NextResponse.json(
        { error: "Missing required field: expiresAt" },
        { status: 400 }
      );
    }

    const newExpiresAt = new Date(expiresAt);

    if (isNaN(newExpiresAt.getTime()) || newExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or past expiresAt date" },
        { status: 400 }
      );
    }

    const existingBatch = await getBatchById(id, batchId);
    if (!existingBatch) {
      return NextResponse.json(
        { error: "Form batch not found" },
        { status: 404 }
      );
    }

    await updateBatch(id, batchId, { expiresAt: newExpiresAt.toISOString() });

    const batch = await getBatchById(id, batchId);

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    console.error("Error updating form batch expiry:", error);
    return NextResponse.json(
      { error: "Failed to update form batch expiry", details: error.message },
      { status: 500 }
    );
  }
}
