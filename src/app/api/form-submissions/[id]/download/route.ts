import { NextRequest, NextResponse } from "next/server";
import { getSubmissionById, getFormById } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Valid form submission ID is required" }, { status: 400 });

    const submission = await getSubmissionById(id);
    if (!submission) return NextResponse.json({ error: "Form submission not found" }, { status: 404 });

    // Redirect to the PDF generation route
    const pdfUrl = `/api/generate-pdf/${submission.id}/${submission.formId}`;
    return NextResponse.redirect(new URL(pdfUrl, req.url));
  } catch (error: any) {
    console.error("Error downloading form submission:", error);
    return NextResponse.json({ error: "Failed to download form submission" }, { status: 500 });
  }
}
