import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    
    // Add search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { ndisNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Count total clients matching the filter
    const total = await prisma.client.count({ where });

    // Get clients with pagination and sorting
    const clients = await prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      select: {
        id: true,
        name: true,
        email: true,
        ndisNumber: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        forms: {
          select: {
            formKey: true,
            status: true
          }
        }
      }
    });

    // Process clients to include form status summary
    const processedClients = clients.map(client => {
      // Count forms by status
      const formStatus: Record<string, number> = {};
      client.forms.forEach(form => {
        formStatus[form.status] = (formStatus[form.status] || 0) + 1;
      });

      // Filter by status if requested
      const includeClient = !status || 
        client.forms.some(form => form.status === status);

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        ndisNumber: client.ndisNumber,
        phone: client.phone,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        formStatus,
        includeClient
      };
    }).filter(client => client.includeClient);

    // Calculate pagination info
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      data: processedClients,
      pagination: {
        total,
        page,
        limit,
        pages
      }
    });
  } catch (err) {
    console.error('Error listing clients:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
