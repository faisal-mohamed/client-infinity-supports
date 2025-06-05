import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = parseInt(params.id);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 });
    }

    // Get client with related data
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        forms: {
          orderBy: {
            assignedAt: 'desc'
          }
        },
        contracts: {
          orderBy: {
            version: 'desc'
          }
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Get form submissions for this client
    const formSubmissions = await prisma.formSubmission.findMany({
      where: { clientId },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Get form titles from master forms
    const formKeys = [...new Set(client.forms.map(form => form.formKey))];
    const masterForms = await prisma.masterForm.findMany({
      where: {
        formKey: {
          in: formKeys
        }
      },
      distinct: ['formKey'],
      orderBy: {
        version: 'desc'
      },
      select: {
        formKey: true,
        title: true
      }
    });

    // Create a map of formKey to title
    const formTitles: Record<string, string> = {};
    masterForms.forEach(form => {
      formTitles[form.formKey] = form.title;
    });

    // Enhance client forms with titles and submission data
    const enhancedForms = client.forms.map(form => {
      const submission = formSubmissions.find(
        sub => sub.formKey === form.formKey && sub.clientVersion === form.clientVersion
      );

      return {
        formKey: form.formKey,
        title: formTitles[form.formKey] || form.formKey,
        baseVersion: form.baseVersion,
        clientVersion: form.clientVersion,
        status: form.status,
        assignedAt: form.assignedAt,
        updatedAt: form.updatedAt,
        submittedAt: submission?.submittedAt || null,
        hasData: !!submission
      };
    });

    // Format contracts for response
    const enhancedContracts = client.contracts.map(contract => ({
      id: contract.id,
      version: contract.version,
      startDate: contract.startDate,
      endDate: contract.endDate,
      isActive: new Date() >= contract.startDate && new Date() <= contract.endDate
    }));

    // Get form progress
    const formProgress = await prisma.formProgress.findMany({
      where: { clientId }
    });

    // Get form signatures
    const formSignatures = await prisma.formSignature.findMany({
      where: { clientId }
    });

    // Prepare response data
    const responseData = {
      id: client.id,
      name: client.name,
      email: client.email,
      ndisNumber: client.ndisNumber,
      phone: client.phone,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      forms: enhancedForms,
      contracts: enhancedContracts,
      progress: formProgress,
      signatures: formSignatures
    };

    return NextResponse.json({ data: responseData });
  } catch (err) {
    console.error('Error getting client details:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
