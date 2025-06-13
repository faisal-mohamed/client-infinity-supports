import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const passcode = req.nextUrl.searchParams.get('passcode');
    const body = await req.json();
    
    // Find the form batch by batch token
    const batch = await prisma.formBatch.findUnique({
      where: { batchToken: token },
      include: {
        client: true,
        assignments: {
          include: {
            form: true
          },
          orderBy: {
            displayOrder: 'asc'
          }
        }
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
    
    // Check if passcode is required
    // For batch-level passcode, we'll check the first assignment's passcode
    const firstAssignment = batch.assignments[0];
    if (firstAssignment?.passcode) {
      // If no passcode provided, return error
      if (!passcode) {
        return NextResponse.json(
          { error: "Passcode required" },
          { status: 403 }
        );
      }
      
      // If passcode doesn't match, return error
      if (firstAssignment.passcode !== passcode) {
        return NextResponse.json(
          { error: "Invalid passcode" },
          { status: 403 }
        );
      }
    }


     const client = await prisma.client.update({
  where: { id: batch.clientId },
  data: {
    ...(body.name && { name: body.name }),
    ...(body.email && { email: body.email }),
    ...(body.phone && { phone: body.phone })
  }
});

  
    
    // Update or create common fields for the client
    const commonFields = await prisma.commonField.upsert({
      where: {
        clientId: batch.clientId
      },
      update: {
        ...body,
        updatedAt: new Date()
      },
      create: {
        clientId: batch.clientId,
        ...body
      }
    });
    
    // Mark all assignments in the batch as having common fields completed
    await prisma.formAssignment.updateMany({
      where: {
        batchId: batch.id
      },
      data: {
        isCommonFieldsCompleted: true
      }
    });
    
    // Log the common fields update
    await prisma.formActivityLog.create({
      data: {
        clientId: batch.clientId,
        logType: "CLIENT",
        action: "Updated Common Fields",
        metadata: {
          batchId: batch.id
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      commonFields
    });
  } catch (error: any) {
    console.error("Error updating common fields:", error);
    return NextResponse.json(
      { error: "Failed to update common fields", details: error.message },
      { status: 500 }
    );
  }
}
