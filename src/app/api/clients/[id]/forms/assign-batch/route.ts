import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id || "0");
    const body = await req.json();
    const { formIds, expiresAt } = body;

    // Validate required fields
    if (!formIds || !formIds.length || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields: formIds or expiresAt" },
        { status: 400 }
      );
    }

    // Generate a unique batch token
    const batchToken = crypto.randomBytes(32).toString('hex');
    
    // Generate a 6-digit passcode
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the form batch
      const batch = await tx.formBatch.create({
        data: {
          clientId,
          batchToken,
          expiresAt: new Date(expiresAt),
        }
      });

      // Create form assignments for each form
      const assignments = [];
      for (let i = 0; i < formIds.length; i++) {
        const formId = formIds[i];
        
        // Get the form to check if it exists and get its version
        const form = await tx.masterForm.findUnique({
          where: { id: formId }
        });

        if (!form) {
          throw new Error(`Form with ID ${formId} not found`);
        }

        // Create the form assignment
        const accessToken = crypto.randomBytes(16).toString('hex');
        const assignment = await tx.formAssignment.create({
          data: {
            clientId,
            formId,
            formVersion: form.version,
            expiresAt: new Date(expiresAt),
            accessToken,
            isCompleted: false,
            passcode: i === 0 ? passcode : null, // Only set passcode for the first form
            displayOrder: i,
            batchId: batch.id
          }
        });

        assignments.push(assignment);
      }

      // Log the batch assignment activity
      await tx.formActivityLog.create({
        data: {
          clientId,
          logType: "ADMIN",
          action: "Assigned Form Batch",
          metadata: {
            formIds,
            batchToken,
            expiresAt,
            assignmentCount: formIds.length
          }
        }
      });

      return { 
        batch, 
        assignments, 
        passcode,
        accessLink: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/forms/access/${batchToken}`
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error assigning form batch:", error);
    return NextResponse.json(
      { error: "Failed to assign form batch", details: error.message },
      { status: 500 }
    );
  }
}
