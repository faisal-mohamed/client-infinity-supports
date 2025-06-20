import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, commonFields } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to create a client." },
        { status: 400 }
      );
    }

    // 🔍 Step 1: Check if email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: "Client already exists with this email." },
        { status: 409 } // 409 Conflict
      );
    }

    // 🛠 Step 2: Proceed with creation inside a transaction
    const clientName = name?.trim();

    const result = await prisma.$transaction(async (tx) => {
      const newClient = await tx.client.create({
        data: {
          name: clientName,
          email,
          phone,
        },
      });

      await tx.commonField.create({
        data: {
          clientId: newClient.id,
          name: commonFields?.name || clientName,
          age: commonFields?.age,
          email: commonFields?.email || email,
          sex: commonFields?.sex,
          street: commonFields?.street,
          state: commonFields?.state,
          postCode: commonFields?.postCode,
          dob: commonFields?.dob,
          ndis: commonFields?.ndis,
          disability: commonFields?.disability,
          address: commonFields?.address,
          phone: commonFields?.phone || phone,
        },
      });

      await tx.formActivityLog.create({
        data: {
          logType: "ADMIN",
          action: "Created Client",
          metadata: {
            clientId: newClient.id,
            clientName: newClient.name,
          },
        },
      });

      return newClient;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client", details: error.message },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') as string | undefined;
    const state = url.searchParams.get('state') as string | undefined;
    const sex = url.searchParams.get('sex') as string | undefined;
    const hasNdis = url.searchParams.get('hasNdis') as string | undefined;
    const hasDisability = url.searchParams.get('hasDisability') as string | undefined;

    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const commonFieldsFilter: any = {};

    if (state) commonFieldsFilter.state = state;
    if (sex) commonFieldsFilter.sex = sex;

    if (hasNdis === 'true') commonFieldsFilter.ndis = { not: null };
    else if (hasNdis === 'false') commonFieldsFilter.ndis = null;

    if (hasDisability === 'true') commonFieldsFilter.disability = { not: null };
    else if (hasDisability === 'false') commonFieldsFilter.disability = null;

    if (Object.keys(commonFieldsFilter).length > 0) {
      whereClause.commonFields = {
        some: commonFieldsFilter
      };
    }

    const totalCount = await prisma.client.count({ where: whereClause });

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        commonFields: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 3 // ✅ limit logs per client (adjust as needed)
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Optional: serialize logs safely (especially metadata)
    const serializedClients = clients.map(client => ({
      ...client,
      logs: client.logs.map(log => ({
        id: log.id,
        action: log.action,
        createdAt: log.createdAt,
        metadata: log.metadata ?? null,
        logType: log.logType
      }))
    }));

    return NextResponse.json({
      clients: serializedClients,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    });

  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients", details: error.message },
      { status: 500 }
    );
  }
}

