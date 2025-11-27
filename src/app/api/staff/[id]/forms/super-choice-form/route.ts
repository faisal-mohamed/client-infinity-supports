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

    console.log('📋 [Super Choice API] Fetching form data for staff:', staffId);

    if (!staffId) {
      console.error('📋 [Super Choice API] Invalid staff id:', id);
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
      console.error('📋 [Super Choice API] Staff not found:', staffId);
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    console.log('📋 [Super Choice API] Staff found:', { id: staff.id, name: `${staff.firstName} ${staff.surname}` });

    const submission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: "super_choice_form",
        },
      },
    });

    if (!submission) {
      console.log('📋 [Super Choice API] No submission found for staff:', staffId);
      return NextResponse.json({
        staff,
        data: null,
        submission: null,
      });
    }

    console.log('📋 [Super Choice API] Submission found:', {
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

    console.log('📋 [Super Choice API] Initial formData keys:', Object.keys(formData));
    console.log('📋 [Super Choice API] Initial formData signature check:', {
      hasSectionBSignature: !!formData.sectionBSignature,
      hasSectionCSignature: !!formData.sectionCSignature,
      hasSectionDSignature: !!formData.sectionDSignature,
      hasStaffSignature: !!submission.staffSignature,
    });

    // Map staffSignature to sectionBSignature if not already in formData
    // Super Choice Form can have signatures in sectionB, sectionC, or sectionD
    // Priority: sectionBSignature > sectionCSignature > sectionDSignature > staffSignature
    if (submission.staffSignature) {
      if (!formData.sectionBSignature && !formData.sectionCSignature && !formData.sectionDSignature) {
        // If no section signature exists, use staffSignature for sectionB (most common)
        formData.sectionBSignature = submission.staffSignature;
        console.log('📋 [Super Choice API] Mapped staffSignature to sectionBSignature');
      } else if (!formData.sectionBSignature && formData.sectionCSignature) {
        // If sectionC has signature but sectionB doesn't, keep sectionC and don't override
        console.log('📋 [Super Choice API] sectionCSignature exists, keeping it');
      } else if (!formData.sectionBSignature && formData.sectionDSignature) {
        // If sectionD has signature but sectionB doesn't, keep sectionD and don't override
        console.log('📋 [Super Choice API] sectionDSignature exists, keeping it');
      }
    }

    // Map staffSignedAt to sectionBDate if needed
    if (submission.staffSignedAt && !formData.sectionBDate) {
      const signedDate = new Date(submission.staffSignedAt);
      formData.sectionBDate = {
        day: String(signedDate.getDate()).padStart(2, '0'),
        month: String(signedDate.getMonth() + 1).padStart(2, '0'),
        year: String(signedDate.getFullYear()),
      };
      console.log('📋 [Super Choice API] Mapped staffSignedAt to sectionBDate:', formData.sectionBDate);
    }

    console.log('📋 [Super Choice API] Final formData keys:', Object.keys(formData));
    console.log('📋 [Super Choice API] Final formData sample:', {
      fullName: formData.fullName,
      tfn: formData.tfn,
      hasSectionBSignature: !!formData.sectionBSignature,
      hasSectionCSignature: !!formData.sectionCSignature,
      hasSectionDSignature: !!formData.sectionDSignature,
      sectionBDate: formData.sectionBDate,
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
    console.error("📋 [Super Choice API] Error fetching super choice form submission:", error);
    console.error("📋 [Super Choice API] Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to fetch super choice form submission" },
      { status: 500 }
    );
  }
}

