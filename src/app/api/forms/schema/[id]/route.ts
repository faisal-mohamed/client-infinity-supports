import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formId = parseInt(params.id);
    
    if (isNaN(formId)) {
      return NextResponse.json(
        { error: "Invalid form ID" },
        { status: 400 }
      );
    }
    
    const form = await prisma.masterForm.findUnique({
      where: { id: formId },
    });
    
    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(form.schema);
  } catch (error: any) {
    console.error("Error fetching form schema:", error);
    return NextResponse.json(
      { error: "Failed to fetch form schema", details: error.message },
      { status: 500 }
    );
  }
}
