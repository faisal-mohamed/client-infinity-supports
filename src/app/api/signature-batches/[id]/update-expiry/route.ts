import { NextRequest, NextResponse } from "next/server";
import { updateBatch } from "@/lib/db/forms";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { expiresAt } = body;

    if (!id) {
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

    const expiryDate = new Date(expiresAt);
    const now = new Date();

    if (expiryDate <= now) {
      return NextResponse.json(
        { error: "Expiry date must be in the future" },
        { status: 400 }
      );
    }

    const updatedBatch = await updateBatch(id, { expiresAt: expiryDate.toISOString() });

    if (!updatedBatch) {
      return NextResponse.json(
        { error: "Signature batch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Expiry date updated successfully",
      batch: updatedBatch,
    });

  } catch (error: any) {
    console.error("Error updating signature batch expiry:", error);
    if (error.message?.includes("not found")) {
      return NextResponse.json(
        { error: "Signature batch not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
