import { NextRequest, NextResponse } from "next/server";
import { createClient, listClients } from "@/lib/db/client";
import { createActivityLog } from "@/lib/db/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required to create a client." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const clientName = name?.trim();

    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || undefined;

    const result = await createClient(
      { name: clientName, email: normalizedEmail, phone, createdById: adminId },
      {
        name: commonFields?.name || clientName,
        age: commonFields?.age,
        email: commonFields?.email || normalizedEmail,
        sex: commonFields?.sex,
        street: commonFields?.street,
        state: commonFields?.state,
        postCode: commonFields?.postCode,
        dob: commonFields?.dob,
        ndis: commonFields?.ndis,
        disability: commonFields?.disability,
        address: commonFields?.address,
        phone: commonFields?.phone || phone,
        surname: commonFields?.surname,
      }
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Failed to create client", details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // Email uniqueness check — duplicates are now allowed
    if (url.searchParams.get("exists") === "true") {
      return NextResponse.json({ exists: false });
    }

    const options = {
      search: url.searchParams.get("search") || undefined,
      state: url.searchParams.get("state") || undefined,
      sex: url.searchParams.get("sex") || undefined,
      hasNdis: url.searchParams.get("hasNdis") || undefined,
      hasDisability: url.searchParams.get("hasDisability") || undefined,
      page: parseInt(url.searchParams.get("page") || "1"),
      pageSize: parseInt(url.searchParams.get("pageSize") || "10"),
    };

    const { clients, pagination } = await listClients(options);

    // Serialize to match existing response shape (commonFields as nested object)
    const serializedClients = clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      createdById: client.createdById,
      archivedAt: client.archivedAt,
      archivedBy: client.archivedBy,
      commonFields: client.commonFields || null,
      logs: [], // Activity logs fetched separately if needed
    }));

    return NextResponse.json({ clients: serializedClients, pagination });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients", details: error.message }, { status: 500 });
  }
}
