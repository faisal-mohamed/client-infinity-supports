import { NextRequest, NextResponse } from "next/server";
import { listForms, getFormByKey, createForm } from "@/lib/db/forms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formKey, title, schema } = body;

    if (!formKey || !title) {
      return NextResponse.json({ error: "Missing required fields: formKey or title" }, { status: 400 });
    }

    // Check existing to determine version
    const existingForm = await getFormByKey(formKey);
    const version = existingForm ? existingForm.version + 1 : 1;

    const newForm = await createForm({
      formKey,
      title,
      version,
      schema,
      requiresSignature: body.requiresSignature || false,
    });

    return NextResponse.json(newForm, { status: 201 });
  } catch (error: any) {
    console.error("Error creating form:", error);
    return NextResponse.json({ error: "Failed to create form", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const formKey = url.searchParams.get("formKey");
    const type = url.searchParams.get("type");

    // Return staff forms from registry
    if (type === 'staff') {
      const { getAllStaffForms } = await import('@/app/forms/staff-registry');
      const staffForms = getAllStaffForms();
      return NextResponse.json(staffForms.map((f: any) => ({
        id: f.key,
        formKey: f.key,
        title: f.name,
        version: 1,
        requiresSignature: true,
      })));
    }

    if (formKey) {
      const form = await getFormByKey(formKey);
      return NextResponse.json(form ? [form] : []);
    }

    const forms = await listForms();
    return NextResponse.json(forms);
  } catch (error: any) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ error: "Failed to fetch forms", details: error.message }, { status: 500 });
  }
}
