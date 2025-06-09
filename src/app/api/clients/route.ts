import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();

    // Extract client data from the request
    const { name, email, phone, commonFields } = body;

    // Use "Unnamed Client" if no name is provided
    const clientName = name?.trim() || "Unnamed Client";

    // Start a transaction to create both client and common fields
    const result = await prisma.$transaction(async (tx) => {
      // Create the new client
      const newClient = await tx.client.create({
        data: {
          name: clientName,
          email,
          phone,
        }
      });

      // Create common fields if provided
      if (commonFields) {
        await tx.commonField.create({
          data: {
            clientId: newClient.id,
            name: commonFields.name || clientName,
            age: commonFields.age,
            email: commonFields.email || email,
            sex: commonFields.sex,
            street: commonFields.street,
            state: commonFields.state,
            postCode: commonFields.postCode,
            dob: commonFields.dob,
            ndis: commonFields.ndis,
            disability: commonFields.disability,
            address: commonFields.address,
          }
        });
      }

      // Log the client creation activity
      await tx.formActivityLog.create({
        data: {
          logType: "ADMIN",
          action: "Created Client",
          metadata: {
            clientId: newClient.id,
            clientName: newClient.name
          }
        }
      });

      return newClient;
    });

    // Return the created client
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client", details: error.message },
      { status: 500 }
    );
  }
}

// Get all clients
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') as string | undefined;
    const state = url.searchParams.get('state') as string | undefined;
    const sex = url.searchParams.get('sex') as string | undefined;
    const hasNdis = url.searchParams.get('hasNdis') as string | undefined;
    const hasDisability = url.searchParams.get('hasDisability') as string | undefined;

    let whereClause: any = {};
    
    // Search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Additional filters for common fields
    let commonFieldsFilter: any = {};
    
    if (state) {
      commonFieldsFilter.state = state;
    }
    
    if (sex) {
      commonFieldsFilter.sex = sex;
    }
    
    if (hasNdis === 'true') {
      commonFieldsFilter.ndis = { not: null };
    } else if (hasNdis === 'false') {
      commonFieldsFilter.ndis = null;
    }
    
    if (hasDisability === 'true') {
      commonFieldsFilter.disability = { not: null };
    } else if (hasDisability === 'false') {
      commonFieldsFilter.disability = null;
    }
    
    // Add common fields filter if any are set
    if (Object.keys(commonFieldsFilter).length > 0) {
      whereClause.commonFields = {
        some: commonFieldsFilter
      };
    }

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        commonFields: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(clients);
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients", details: error.message },
      { status: 500 }
    );
  }
}
