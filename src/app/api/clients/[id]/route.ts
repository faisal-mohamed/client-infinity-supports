import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id);
    
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        commonFields: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Get only the 10 most recent logs
        },
        forms: {
          include: {
            form: true
          }
        }
      }
    });
    
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
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
    const clientId = parseInt(params.id);
    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Start a transaction to update both client and common fields
    const result = await prisma.$transaction(async (tx) => {
      // Update the client
      const updatedClient = await tx.client.update({
        where: { id: clientId },
        data: {
          name,
          email,
          phone,
        }
      });

      // Update common fields if provided
      if (commonFields) {
        await tx.commonField.upsert({
          where: { clientId },
          update: {
            name: commonFields.name || name,
            age: commonFields.age,
            email: commonFields.email || email,
            sex: commonFields.sex,
            street: commonFields.street,
            state: commonFields.state,
            postCode: commonFields.postCode,
            dob: commonFields.dob,
            ndis: commonFields.ndis,
            disability: commonFields.disability,
            address: commonFields.address,
          },
          create: {
            clientId,
            name: commonFields.name || name,
            age: commonFields.age,
            email: commonFields.email || email,
            sex: commonFields.sex,
            street: commonFields.street,
            state: commonFields.state,
            postCode: commonFields.postCode,
            dob: commonFields.dob,
            ndis: commonFields.ndis,
            disability: commonFields.disability,
            address: commonFields.address,
          }
        });
      }

      // Log the client update activity
      await tx.formActivityLog.create({
        data: {
          clientId,
          logType: "ADMIN",
          action: "Updated Client",
          metadata: {
            clientId,
            clientName: name
          }
        }
      });

      return updatedClient;
    });

    return NextResponse.json(result);
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
    const clientId = parseInt(params.id);

    // Start a transaction to delete client and related data
    await prisma.$transaction(async (tx) => {
      // Delete common fields
      await tx.commonField.deleteMany({
        where: { clientId }
      });

      // Delete form submissions
      await tx.formSubmission.deleteMany({
        where: { clientId }
      });

      // Delete form progress
      await tx.formProgress.deleteMany({
        where: { clientId }
      });

      // Delete form assignments
      await tx.formAssignment.deleteMany({
        where: { clientId }
      });

      // Delete signatures
      await tx.formSignature.deleteMany({
        where: { clientId }
      });

      // Delete logs
      await tx.formActivityLog.deleteMany({
        where: { clientId }
      });

      // Delete insights
      await tx.insight.deleteMany({
        where: { clientId }
      });

      // Finally delete the client
      await tx.client.delete({
        where: { id: clientId }
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
