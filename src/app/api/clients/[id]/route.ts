import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id || "0");

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        commonFields: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error: any) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id || "0");
    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name,
        email,
        phone,
      },
      include: {
        commonFields: true,
      },
    });

    // Update or create common fields if provided
    if (commonFields) {
      if (updatedClient.commonFields.length > 0) {
        // Update existing common fields
        await prisma.commonField.update({
          where: { clientId },
          data: {
            ...commonFields,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new common fields
        await prisma.commonField.create({
          data: {
            clientId,
            ...commonFields,
          },
        });
      }
    }

    // Get the updated client with common fields
    const clientWithCommonFields = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        commonFields: true,
      },
    });

    return NextResponse.json(clientWithCommonFields);
  } catch (error: any) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id || "0");

    // Start a transaction to delete client and related data
    await prisma.$transaction(async (tx) => {
      // Delete common fields
      await tx.commonField.deleteMany({
        where: { clientId },
      });

      // Delete form submissions
      await tx.formSubmission.deleteMany({
        where: { clientId },
      });

      // Delete form progress
      await tx.formProgress.deleteMany({
        where: { clientId },
      });

      // Delete form signatures
      await tx.formSignature.deleteMany({
        where: { clientId },
      });

      // Delete form assignments
      await tx.formAssignment.deleteMany({
        where: { clientId },
      });

      // Delete insights
      await tx.insight.deleteMany({
        where: { clientId },
      });

      // Delete activity logs
      await tx.formActivityLog.deleteMany({
        where: { clientId },
      });

      // Delete the client
      await tx.client.delete({
        where: { id: clientId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client", details: error.message },
      { status: 500 }
    );
  }
}
