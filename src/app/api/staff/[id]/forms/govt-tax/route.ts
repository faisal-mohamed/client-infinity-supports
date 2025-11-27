"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id, 10);

    console.log('📋 [TFN API] Fetching form data for staff:', staffId);

    if (!staffId) {
      console.error('📋 [TFN API] Invalid staff id:', id);
      return NextResponse.json({ error: "Invalid staff id" }, { status: 400 });
    }

    const db: any = prisma as any;
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
      },
    });

    if (!staff) {
      console.error('📋 [TFN API] Staff not found:', staffId);
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    console.log('📋 [TFN API] Staff found:', { id: staff.id, name: `${staff.firstName} ${staff.surname}` });

    const submission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: "govt_tax",
        },
      },
    });

    if (!submission) {
      console.log('📋 [TFN API] No submission found for staff:', staffId);
      return NextResponse.json({
        staff,
        data: null,
        submission: null,
      });
    }

    console.log('📋 [TFN API] Submission found:', {
      id: submission.id,
      hasData: !!submission.data,
      dataType: typeof submission.data,
      dataKeys: submission.data ? Object.keys(submission.data) : [],
      hasStaffSignature: !!submission.staffSignature,
      hasStaffSignedAt: !!submission.staffSignedAt,
    });

    const formData: Record<string, any> = {
      ...(submission.data || {}),
    };

    console.log('📋 [TFN API] Initial formData keys:', Object.keys(formData));
    console.log('📋 [TFN API] Initial formData sample:', {
      tfn: formData.tfn,
      firstName: formData.firstName,
      surname: formData.surname,
      hasPayeeSignature: !!formData.payeeSignature,
    });

    if (!formData.staffName) {
      formData.staffName = `${staff.firstName || ""} ${staff.surname || ""}`.trim();
    }

    if (!formData.payeeSignature && submission.staffSignature) {
      formData.payeeSignature = submission.staffSignature;
      console.log('📋 [TFN API] Added payeeSignature from submission.staffSignature');
    }

    if (!formData.payeeSignatureAt && submission.staffSignedAt) {
      formData.payeeSignatureAt = new Date(submission.staffSignedAt).toISOString().split("T")[0];
      console.log('📋 [TFN API] Added payeeSignatureAt from submission.staffSignedAt:', formData.payeeSignatureAt);
    }

    console.log('📋 [TFN API] Final formData keys:', Object.keys(formData));
    console.log('📋 [TFN API] Final formData sample:', {
      tfn: formData.tfn,
      firstName: formData.firstName,
      surname: formData.surname,
      dob: formData.dob,
      address: formData.address,
      hasPayeeSignature: !!formData.payeeSignature,
      payeeSignatureAt: formData.payeeSignatureAt,
      hasPayerSignature: !!formData.payerSignature,
      payerSignatureAt: formData.payerSignatureAt,
    });

    return NextResponse.json({
      staff,
      data: formData,
      submission: {
        id: submission.id,
        isSubmitted: submission.isSubmitted,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("📋 [TFN API] Error fetching govt tax submission:", error);
    console.error("📋 [TFN API] Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to fetch govt tax submission" },
      { status: 500 }
    );
  }
}

