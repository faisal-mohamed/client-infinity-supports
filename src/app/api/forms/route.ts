import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Extract form data from the request
    const { formKey, title, schema } = body;

    // Validate required fields
    if (!formKey || !title || !schema) {
      return NextResponse.json(
        { error: "Missing required fields: formKey, title, or schema" },
        { status: 400 }
      );
    }

    // Check if the form already exists
    const existingForm = await prisma.masterForm.findFirst({
      where: { formKey },
      orderBy: { version: 'desc' }
    });

    // Determine the version number
    const version = existingForm ? existingForm.version + 1 : 1;

    // Create the new form
    const newForm = await prisma.masterForm.create({
      data: {
        formKey,
        title,
        version,
        schema,
      }
    });

    // Return the created form
    return NextResponse.json(newForm, { status: 201 });
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Failed to create form", details: error.message },
      { status: 500 }
    );
  }
}

// Get all forms or filter by formKey
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const formKey = url.searchParams.get('formKey') as string | undefined;

    let forms;
    if (formKey) {
      // Get all versions of a specific form
      forms = await prisma.masterForm.findMany({
        where: { formKey },
        orderBy: { version: 'desc' }
      });
    } else {
      // Get the latest version of each form
      const allForms = await prisma.masterForm.findMany({
        orderBy: [
          { formKey: 'asc' },
          { version: 'desc' }
        ]
      });

      // Group by formKey and take the latest version
      const latestForms = new Map();
      allForms.forEach(form => {
        if (!latestForms.has(form.formKey) || latestForms.get(form.formKey).version < form.version) {
          latestForms.set(form.formKey, form);
        }
      });

      forms = Array.from(latestForms.values());
    }

    return NextResponse.json(forms);
  } catch (error: any) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms", details: error.message },
      { status: 500 }
    );
  }
}
