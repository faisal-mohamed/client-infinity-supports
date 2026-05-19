import { NextRequest, NextResponse } from "next/server";
import { getFormById } from "@/lib/db/forms";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });

    const form = await getFormById(id);
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    return NextResponse.json(form.schema);
  } catch (error: any) {
    console.error("Error fetching form schema:", error);
    return NextResponse.json({ error: "Failed to fetch form schema", details: error.message }, { status: 500 });
  }
}
