"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStaffSettingsForForm } from "@/lib/settings-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id, 10);

    if (!staffId) {
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
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    const submission = await db.staffFormSubmission.findUnique({
      where: {
        staffId_formKey: {
          staffId,
          formKey: "orientation",
        },
      },
    });

    if (!submission) {
      // Get staff-specific settings even when no submission exists
      const settings = await getStaffSettingsForForm(staffId, 'orientation');
      const meta = {
        website: settings?.website || settings?.company_website || null,
        formId: settings?.orientation_form_id || null,
        reviewDate: settings?.orientation_review_date || settings?.review_date || null,
      };
      
      return NextResponse.json({
        staff,
        data: null,
        meta,
        submission: null,
      });
    }

    const formData: Record<string, any> = {
      ...(submission.data || {}),
    };

    if (!formData.staffName) {
      formData.staffName = `${staff.firstName || ""} ${staff.surname || ""}`.trim();
    }

    if (!formData.signature && submission.staffSignature) {
      formData.signature = submission.staffSignature;
    }

    if (!formData.staffSignature && submission.staffSignature) {
      formData.staffSignature = submission.staffSignature;
    }

    if (!formData.orientationSignature && submission.staffSignature) {
      formData.orientationSignature = submission.staffSignature;
    }

    const dateValue =
      formData.date ||
      formData.acknowledgedAt ||
      formData.staffSignedAt ||
      (submission.staffSignedAt
        ? new Date(submission.staffSignedAt).toISOString().split("T")[0]
        : "");

    if (dateValue) {
      formData.date = dateValue;
    }

    if (
      formData.acknowledged === undefined &&
      (formData.orientationAcknowledged !== undefined ||
        formData.readOrientation !== undefined)
    ) {
      formData.acknowledged =
        formData.orientationAcknowledged ?? formData.readOrientation;
    }

    // Get staff-specific settings for footer
    const settings = await getStaffSettingsForForm(staffId, 'orientation');
    
    // Prepare meta data for the view component
    const meta = {
      website: settings?.website || settings?.company_website || null,
      formId: settings?.orientation_form_id || null,
      reviewDate: settings?.orientation_review_date || settings?.review_date || null,
    };

    return NextResponse.json({
      staff,
      data: formData,
      meta,
      submission: {
        id: submission.id,
        isSubmitted: submission.isSubmitted,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching orientation submission:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orientation submission" },
      { status: 500 }
    );
  }
}

