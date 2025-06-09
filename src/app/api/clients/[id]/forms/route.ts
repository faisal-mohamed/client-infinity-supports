import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id);
    
    // Get all form assignments for this client
    const formAssignments = await prisma.formAssignment.findMany({
      where: { clientId },
      include: {
        form: true
      },
      orderBy: { assignedAt: 'desc' }
    });
    
    return NextResponse.json(formAssignments);
  } catch (error: any) {
    console.error("Error fetching client forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch client forms", details: error.message },
      { status: 500 }
    );
  }
}
