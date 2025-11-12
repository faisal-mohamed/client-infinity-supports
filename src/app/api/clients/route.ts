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

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Quick precheck for duplicate email
    const existingClient = await prisma.client.findUnique({
      where: { email: normalizedEmail },
      select: { id: true }
    });
    if (existingClient) {
      return NextResponse.json(
        {
          error: "Email already exists",
          fieldErrors: { email: "A client with this email already exists." },
          existingClientId: existingClient.id
        },
        { status: 409 }
      );
    }

    // Proceed with creation inside a transaction
    const clientName = name?.trim();

    const result = await prisma.$transaction(async (tx: any) => {
      const newClient = await tx.client.create({
        data: {
          name: clientName,
          email: normalizedEmail,
          phone,
        },
      });

      await tx.commonField.create({
        data: {
          clientId: newClient.id,
          name: commonFields?.name || clientName,
          age: commonFields?.age,
          email: (commonFields?.email || normalizedEmail),
          sex: commonFields?.sex,
          street: commonFields?.street,
          state: commonFields?.state,
          postCode: commonFields?.postCode,
          dob: commonFields?.dob,
          ndis: commonFields?.ndis,
          disability: commonFields?.disability,
          address: commonFields?.address,
          phone: commonFields?.phone || phone,
          surname: commonFields?.surname 
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
    }, {
      timeout: 10000,
      maxWait: 5000,
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error("Error creating client:", error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'Email already exists',
          fieldErrors: { email: 'A client with this email already exists.' }
        },
        { status: 409 }
      );
    }
    if (error.code === 'P2028') {
      return NextResponse.json(
        { error: 'Request timed out. Please retry.' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create client', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Quick existence check
    const exists = url.searchParams.get('exists');
    if (exists === 'true') {
      const email = (url.searchParams.get('email') || '').trim().toLowerCase();
      if (!email) {
        return NextResponse.json({ exists: false });
      }
      const found = await prisma.client.findUnique({ where: { email }, select: { id: true } });
      return NextResponse.json({ exists: !!found, id: found?.id ?? null });
    }

    // Get filter parameters
    const search = url.searchParams.get('search') as string | undefined;
    const state = url.searchParams.get('state') as string | undefined;
    const sex = url.searchParams.get('sex') as string | undefined;
    const hasNdis = url.searchParams.get('hasNdis') as string | undefined;
    const hasDisability = url.searchParams.get('hasDisability') as string | undefined;

    // Pagination
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Build where clause
    const whereClause: any = {};

    // Search functionality - improved to search across both client and commonFields
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        {
          commonFields: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { surname: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { ndis: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    // Build commonFields filters (one-to-one relationship)
    const commonFieldsWhere: any = {};
    if (state) commonFieldsWhere.state = state;
    if (sex) commonFieldsWhere.sex = sex;
    if (hasNdis === 'true') commonFieldsWhere.ndis = { not: null };
    else if (hasNdis === 'false') commonFieldsWhere.ndis = null;
    if (hasDisability === 'true') commonFieldsWhere.disability = { not: null };
    else if (hasDisability === 'false') commonFieldsWhere.disability = null;

    // Apply commonFields filters
    if (Object.keys(commonFieldsWhere).length > 0) {
      whereClause.commonFields = commonFieldsWhere;
    }

    // Get total count
    const totalCount = await prisma.client.count({ where: whereClause });

    // Get clients with pagination
    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        commonFields: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Serialize response
    const serializedClients = clients.map(client => ({
      ...client,
      logs: client.logs.map((log: any) => ({
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
