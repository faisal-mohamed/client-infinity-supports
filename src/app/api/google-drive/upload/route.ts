import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSubmissionById } from "@/lib/db/forms";
import { getClientById } from "@/lib/db/client";
import { generatePDFBuffer } from "@/lib/pdf-buffer";
import { uploadPDFToDrive } from "@/lib/google-drive";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { formSubmissionId, formId, clientName, filename } = await req.json();

  if (!formSubmissionId || !formId) {
    return NextResponse.json({ error: "formSubmissionId and formId required" }, { status: 400 });
  }

  // Get client name if not provided
  let name = clientName;
  if (!name) {
    const submission = await getSubmissionById(formSubmissionId);
    if (submission) {
      const client = await getClientById(submission.clientId);
      name = client?.commonFields?.name || client?.name || "Unknown";
    } else {
      name = "Unknown";
    }
  }

  // Generate PDF buffer
  const pdfResult = await generatePDFBuffer({
    formSubmissionId,
    formId,
    filename,
    adminId: session.user.id,
  });

  if (!pdfResult.success || !pdfResult.buffer) {
    return NextResponse.json({ error: "PDF generation failed", details: pdfResult.error }, { status: 500 });
  }

  // Upload to Google Drive
  try {
    const driveResult = await uploadPDFToDrive({
      buffer: pdfResult.buffer,
      filename: pdfResult.filename || `${formSubmissionId}.pdf`,
      clientName: name,
    });

    return NextResponse.json({
      success: true,
      fileId: driveResult.fileId,
      webViewLink: driveResult.webViewLink,
    });
  } catch (error: any) {
    console.error("❌ [GDRIVE API] Upload failed:", error);
    return NextResponse.json({ error: "Google Drive upload failed", details: error.message }, { status: 500 });
  }
}
