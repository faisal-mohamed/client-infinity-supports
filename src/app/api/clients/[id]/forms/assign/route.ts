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
    const { formId, expiresAt } = body;

    // Validate required fields
    if (!formId || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields: formId or expiresAt" },
        { status: 400 }
      );
    }

    // Get the form to check if it exists and get its version
    const form = await prisma.masterForm.findUnique({
      where: { id: formId }
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Generate a unique access token
    const accessToken = crypto.randomBytes(16).toString('hex');

    // Create the form assignment
    const formAssignment = await prisma.formAssignment.create({
      data: {
        clientId,
        formId,
        formVersion: form.version,
        expiresAt: new Date(expiresAt),
        accessToken,
        isCompleted: false,
      }
    });

    // Log the assignment activity
    await prisma.formActivityLog.create({
      data: {
        clientId,
        logType: "ADMIN",
        action: "Assigned Form",
        metadata: {
          formId,
          formTitle: form.title,
          formVersion: form.version,
          expiresAt
        }
      }
    });

    return NextResponse.json({
      ...formAssignment,
      accessLink: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/forms/${formAssignment.id}`
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error assigning form:", error);
    return NextResponse.json(
      { error: "Failed to assign form", details: error.message },
      { status: 500 }
    );
  }
}
