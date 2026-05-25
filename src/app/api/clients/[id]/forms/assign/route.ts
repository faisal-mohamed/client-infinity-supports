import { NextRequest, NextResponse } from "next/server";
import { validateClientOwnership, isOwnershipError } from '@/lib/client-ownership';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ownership = await validateClientOwnership(id);
    if (isOwnershipError(ownership)) return ownership;

    return NextResponse.json({
      message: "Form assigned successfully"
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error assigning form:", error);
    return NextResponse.json(
      { error: "Failed to assign form", details: error.message },
      { status: 500 }
    );
  }
}
