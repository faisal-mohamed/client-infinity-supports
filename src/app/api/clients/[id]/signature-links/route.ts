import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id);

    if (isNaN(clientId)) {
      return NextResponse.json(
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Get all signature batches for this client
    const signatureBatches = await prisma.formBatch.findMany({
      where: {
        clientId: clientId,
        isSignatureOnly: true, // Only signature batches
      },
      include: {
        client: {
          select: {
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
                    formKey: true,
                  },
                },
              },
              select: {
                id: true,
                clientSignature: true,
                clientSignedAt: true,
                form: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });

    return NextResponse.json({
      client,
      signatureBatches,
    });

  } catch (error: any) {
    console.error("Error fetching signature links:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature links", details: error.message },
      { status: 500 }
    );
  }
}
