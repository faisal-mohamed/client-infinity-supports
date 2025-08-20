import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/staff - list staff with simple search and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const where: any = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { surname: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { role: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const db: any = prisma as any;
    const [totalCount, staff] = await Promise.all([
      db.staff.count({ where }),
      db.staff.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return NextResponse.json({
      staff,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST /api/staff - create staff
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, surname, email, phone } = body || {};

    if (!firstName || !surname || !email) {
      return NextResponse.json({ error: 'First name, surname and email are required' }, { status: 400 });
    }

    const db: any = prisma as any;
    const created = await db.staff.create({
      data: {
        firstName,
        surname,
        email,
        phone,
        status: 'pending',
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: error.message || 'Failed to create staff' }, { status: 500 });
  }
}


