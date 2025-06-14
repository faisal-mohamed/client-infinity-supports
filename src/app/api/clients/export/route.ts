import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') as string | undefined;
    const state = url.searchParams.get('state') as string | undefined;
    const sex = url.searchParams.get('sex') as string | undefined;
    const hasNdis = url.searchParams.get('hasNdis') as string | undefined;
    const hasDisability = url.searchParams.get('hasDisability') as string | undefined;

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

    // Get ALL clients without pagination
    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        commonFields: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ clients });

  } catch (error: any) {
    console.error("Error exporting clients:", error);
    return NextResponse.json(
      { error: "Failed to export clients", details: error.message },
      { status: 500 }
    );
  }
}
