import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const staffId = parseInt(id, 10);
    if (!staffId) return NextResponse.json({ error: 'Invalid staff id' }, { status: 400 });

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const db: any = prisma as any;
    const updated = await db.staff.update({
      where: { id: staffId },
      data: { linkToken: token, linkExpiresAt: expiresAt },
      select: { id: true, linkToken: true, linkExpiresAt: true, firstName: true, surname: true, email: true },
    });

    const urlBase = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${urlBase}/staff/onboard/${updated.linkToken}`;
    return NextResponse.json({ link, expiresAt: updated.linkExpiresAt });
  } catch (error: any) {
    console.error('Error generating staff link:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate link' }, { status: 500 });
  }
}


