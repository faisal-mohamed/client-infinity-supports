import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);

    if (isNaN(staffId)) {
      return NextResponse.json(
        { error: "Invalid staff ID" },
        { status: 400 }
      );
    }

    // Get staff info
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff not found" },
        { status: 404 }
      );
    }

    // Get all signature batches for this staff
    const signatureBatches = await prisma.staffFormBatch.findMany({
      where: {
        staffId: staffId,
        isSignatureOnly: true, // Only signature batches
      },
      include: {
        staff: {
          select: {
            firstName: true,
            surname: true,
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
      staff: {
        id: staff.id,
        name: `${staff.firstName} ${staff.surname}`,
        email: staff.email,
      },
      signatureBatches,
    });

  } catch (error: any) {
    console.error("Error fetching staff signature links:", error);
    return NextResponse.json(
      { error: "Failed to fetch signature links", details: error.message },
      { status: 500 }
    );
  }
}

