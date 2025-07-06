import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Fetch admin notifications
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get completed signature batches that haven't been acknowledged
    const completedBatches = await prisma.formBatch.findMany({
      where: {
        isSignatureOnly: true,
        isCompleted: true,
        adminNotified: false, // Only unacknowledged notifications
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        signatureForms: {
          include: {
            formSubmission: {
              include: {
                form: {
                  select: {
                    title: true,
                    requiresSignature: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Format notifications
    const notifications = completedBatches.map(batch => ({
      id: batch.id,
      type: 'signature_batch_completed',
      title: 'Signature Batch Completed',
      message: `${batch.client.name} has completed signing all required documents`,
      clientId: batch.clientId,
      clientName: batch.client.name,
      clientEmail: batch.client.email,
      batchToken: batch.batchToken,
      completedAt: batch.completedAt,
      formsCount: batch.signatureForms.length,
      signedFormsCount: batch.signatureForms.filter(sf => 
        sf.formSubmission.form.requiresSignature && sf.formSubmission.clientSignature
      ).length,
    }));

    return NextResponse.json({
      notifications,
      count: notifications.length,
    });

  } catch (error: any) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Mark notifications as read
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { batchIds } = await req.json();

    if (!Array.isArray(batchIds)) {
      return NextResponse.json(
        { error: "batchIds must be an array" },
        { status: 400 }
      );
    }

    // Mark batches as notified
    await prisma.formBatch.updateMany({
      where: {
        id: { in: batchIds },
        isSignatureOnly: true,
        isCompleted: true,
      },
      data: {
        adminNotified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Marked ${batchIds.length} notifications as read`,
    });

  } catch (error: any) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read", details: error.message },
      { status: 500 }
    );
  }
}
