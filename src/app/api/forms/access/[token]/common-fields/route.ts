import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token || "";
    const passcode = req.nextUrl.searchParams.get('passcode');
    const commonFieldsData = await req.json();

    // Find the batch by token
    const batch = await prisma.formBatch.findUnique({
      where: { batchToken: token },
      include: {
        client: true,
        assignments: true
      }
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > new Date(batch.expiresAt)) {
      return NextResponse.json(
        { error: "Access link has expired" },
        { status: 403 }
      );
    }

    // Verify passcode if provided or required
    if (batch.assignments[0]?.passcode) {
      if (!passcode || batch.assignments[0].passcode !== passcode) {
        return NextResponse.json(
          { error: "Invalid passcode" },
          { status: 403 }
        );
      }
    }

    // Update or create common fields
    const clientId = batch.clientId;
    const existingCommonFields = await prisma.commonField.findFirst({
      where: { clientId }
    });

    let commonFields;
    if (existingCommonFields) {
      // Update existing common fields
      commonFields = await prisma.commonField.update({
        where: { clientId },
        data: {
          ...commonFieldsData,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new common fields
      commonFields = await prisma.commonField.create({
        data: {
          clientId,
          ...commonFieldsData
        }
      });
    }

    // Mark all assignments as having common fields completed
    await prisma.formAssignment.updateMany({
      where: {
        batchId: batch.id
      },
      data: {
        isCommonFieldsCompleted: true
      }
    });

    // Log the activity
    await prisma.formActivityLog.create({
      data: {
        clientId,
        logType: "CLIENT",
        action: "Updated Common Fields",
        metadata: {
          batchToken: token
        }
      }
    });

    return NextResponse.json(commonFields);
  } catch (error: any) {
    console.error("Error updating common fields:", error);
    return NextResponse.json(
      { error: "Failed to update common fields", details: error.message },
      { status: 500 }
    );
  }
}
