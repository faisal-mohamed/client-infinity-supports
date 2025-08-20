import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const db: any = prisma as any;
    const staff = await db.staff.findFirst({ where: { linkToken: token } });
    if (!staff) return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }
    const submissions = await (prisma as any).staffFormSubmission.findMany({ where: { staffId: staff.id } });
    const dataByForm = Object.fromEntries(submissions.map((s: any)=>[s.formKey, s.data]));
    return NextResponse.json({
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone,
        status: staff.status,
      },
      submissions: dataByForm
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const payload = await req.json();
    const { formKey, data, submit } = payload || {};
    if (!formKey || !data) return NextResponse.json({ error: 'Missing formKey or data' }, { status: 400 });
    const db: any = prisma as any;
    const staff = await db.staff.findFirst({ where: { linkToken: token } });
    if (!staff) return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }
    const saved = await db.staffFormSubmission.upsert({
      where: { staffId_formKey: { staffId: staff.id, formKey } },
      update: { data, isSubmitted: !!submit, submittedAt: submit ? new Date() : null },
      create: { staffId: staff.id, formKey, data, isSubmitted: !!submit, submittedAt: submit ? new Date() : null },
    });
    if (submit) {
      await db.staff.update({ where: { id: staff.id }, data: { status: 'success' } });
    }
    return NextResponse.json({ id: saved.id, isSubmitted: saved.isSubmitted });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}


