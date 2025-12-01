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
    
    // Email uniqueness check removed - duplicate emails are now allowed
    const exists = url.searchParams.get('exists');
    if (exists === 'true') {
      return NextResponse.json({ exists: false });
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
    // Normalize search term to lowercase for case-insensitive search
    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      whereClause.OR = [
        { name: { contains: normalizedSearch, mode: 'insensitive' } },
        { email: { contains: normalizedSearch, mode: 'insensitive' } },
        { phone: { contains: normalizedSearch, mode: 'insensitive' } },
        {
          commonFields: {
            OR: [
              { name: { contains: normalizedSearch, mode: 'insensitive' } },
              { surname: { contains: normalizedSearch, mode: 'insensitive' } },
              { email: { contains: normalizedSearch, mode: 'insensitive' } },
              { phone: { contains: normalizedSearch, mode: 'insensitive' } },
              { ndis: { contains: normalizedSearch, mode: 'insensitive' } },
              { state: { contains: normalizedSearch, mode: 'insensitive' } }
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

    // Fetch filtered clients and sort case-insensitively
    // Using database filtering + in-memory sorting for case-insensitive name sorting
    // (Prisma doesn't support case-insensitive orderBy directly, so we sort filtered results)
    const allFilteredClients = await prisma.client.findMany({
      where: whereClause,
      include: {
        commonFields: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    });

    // Sort filtered clients case-insensitively by name (nulls last, with locale support)
    const sortedClients = allFilteredClients.sort((a, b) => {
      try {
        // Get the name to sort by (prefer commonFields name + surname if available)
        const aName = a?.commonFields?.name && a?.commonFields?.surname
          ? `${a.commonFields.name} ${a.commonFields.surname}`.trim().toLowerCase()
          : (a.name || '').toLowerCase();
        const bName = b?.commonFields?.name && b?.commonFields?.surname
          ? `${b.commonFields.name} ${b.commonFields.surname}`.trim().toLowerCase()
          : (b.name || '').toLowerCase();
        
        // Put empty names last (nulls last)
        if (!aName && bName) return 1;
        if (aName && !bName) return -1;
        if (!aName && !bName) return 0;
        
        // Case-insensitive comparison with locale support
        const nameComparison = aName.localeCompare(bName, 'en-AU', { 
          sensitivity: 'base',
          numeric: true 
        });
        if (nameComparison !== 0) return nameComparison;
        
        // If names are equal (case-insensitive), sort by createdAt desc as tiebreaker
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } catch (error) {
        // Fallback to simple comparison if localeCompare fails
        const aName = (a?.commonFields?.name && a?.commonFields?.surname
          ? `${a.commonFields.name} ${a.commonFields.surname}`.trim()
          : (a.name || '')).toLowerCase();
        const bName = (b?.commonFields?.name && b?.commonFields?.surname
          ? `${b.commonFields.name} ${b.commonFields.surname}`.trim()
          : (b.name || '')).toLowerCase();
        return aName.localeCompare(bName);
      }
    });

    // Apply pagination after sorting
    const clients = sortedClients.slice(skip, skip + pageSize);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Serialize response
    const serializedClients = (clients as any[]).map((client: any) => ({
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
