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
    const p: any = prisma as any;
    const submissions = await p.staffFormSubmission.findMany({ where: { staffId: staff.id } });
    const specDetails = p.staffEmploymentDetails
      ? await p.staffEmploymentDetails.findUnique({ where: { staffId: staff.id } }).catch(()=>null)
      : null;
    const specWelcome = p.staffEmploymentWelcomeAck
      ? await p.staffEmploymentWelcomeAck.findUnique({ where: { staffId: staff.id } }).catch(()=>null)
      : null;
    const specSupportWorker = p.staffSupportWorker
      ? await p.staffSupportWorker.findUnique({ where: { staffId: staff.id } }).catch(()=>null)
      : null;
    
    const dataByForm = Object.fromEntries(submissions.map((s: any)=>[s.formKey, s.data]));
    
    // Handle Employee Details form with signature
    if (specDetails) {
      dataByForm['employeeDetails'] = {
        ...specDetails.data,
        employeeSignature: specDetails.staffSignature || '',
        employeeSignatureDate: specDetails.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    // Handle Employee Welcome form with signature
    if (specWelcome) {
      dataByForm['employee_welcome'] = {
        ...specWelcome.data,
        signature: specWelcome.staffSignature || '',
        date: specWelcome.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
    // Handle Support Worker form with signature
    if (specSupportWorker) {
      dataByForm['support_worker'] = {
        ...specSupportWorker.data,
        signature: specSupportWorker.staffSignature || '',
        signatureDate: specSupportWorker.staffSignedAt?.toISOString().split('T')[0] || ''
      };
    }
    
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
    const p: any = prisma as any;
    const staff = await db.staff.findFirst({ where: { linkToken: token } });
    if (!staff) return NextResponse.json({ error: 'Invalid link' }, { status: 404 });
    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: 'This link has expired' }, { status: 410 });
    }
    let saved: any;
    if (formKey === 'employeeDetails' && p.staffEmploymentDetails) {
      // Extract signature data if present
      const { employeeSignature, employeeSignatureDate, ...formData } = data;
      const signatureData = employeeSignature ? {
        staffSignature: employeeSignature,
        staffSignedAt: employeeSignatureDate ? new Date(employeeSignatureDate) : new Date()
      } : {};
      
      saved = await p.staffEmploymentDetails.upsert({
        where: { staffId: staff.id },
        update: { 
          data: formData,
          ...signatureData
        },
        create: { 
          staffId: staff.id, 
          data: formData,
          ...signatureData
        },
      });
    } else if (formKey === 'employee_welcome' && p.staffEmploymentWelcomeAck) {
      // Extract signature data if present
      const { signature, date, ...formData } = data;
      const signatureData = signature ? {
        staffSignature: signature,
        staffSignedAt: date ? new Date(date) : new Date()
      } : {};
      
      saved = await p.staffEmploymentWelcomeAck.upsert({
        where: { staffId: staff.id },
        update: { 
          data: formData,
          ...signatureData
        },
        create: { 
          staffId: staff.id, 
          data: formData,
          ...signatureData
        },
      });
    } else if (formKey === 'support_worker' && p.staffSupportWorker) {
      // Extract signature data if present
      const { signature, signatureDate, ...formData } = data;
      const signatureData = signature ? {
        staffSignature: signature,
        staffSignedAt: signatureDate ? new Date(signatureDate) : new Date()
      } : {};
      
      saved = await p.staffSupportWorker.upsert({
        where: { staffId: staff.id },
        update: { 
          data: formData,
          ...signatureData
        },
        create: { 
          staffId: staff.id, 
          data: formData,
          ...signatureData
        },
      });
    } else {
      saved = await db.staffFormSubmission.upsert({
        where: { staffId_formKey: { staffId: staff.id, formKey } },
        update: { data, isSubmitted: !!submit, submittedAt: submit ? new Date() : null },
        create: { staffId: staff.id, formKey, data, isSubmitted: !!submit, submittedAt: submit ? new Date() : null },
      });
    }
    if (submit) {
      await db.staff.update({ where: { id: staff.id }, data: { status: 'success' } });
    }
    return NextResponse.json({ id: saved.id ?? 0, isSubmitted: !!submit });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}


