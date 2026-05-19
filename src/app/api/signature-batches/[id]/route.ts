import { NextRequest, NextResponse } from "next/server";
import { deleteBatch } from "@/lib/db/forms";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid batch ID" },
        { status: 400 }
      );
    }

    await deleteBatch(id);

    return NextResponse.json({
      message: "Signature batch deleted successfully",
    });

  } catch (error: any) {
    console.error("Error deleting signature batch:", error);
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
