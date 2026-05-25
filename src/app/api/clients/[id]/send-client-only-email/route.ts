import { NextRequest, NextResponse } from 'next/server';
import { getClientAssignments, getClientById, getSubmission } from '@/lib/db';
import { validateClientOwnership, isOwnershipError } from '@/lib/client-ownership';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ownership = await validateClientOwnership(id);
    if (isOwnershipError(ownership)) return ownership;
    const { formAssignmentIds } = await req.json();

    if (!Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
      return NextResponse.json({ error: 'No form assignments provided' }, { status: 400 });
    }

    const allAssignments = await getClientAssignments(id, true);
    const assignments = allAssignments.filter((a) => formAssignmentIds.includes(a.id));

    if (assignments.length === 0) {
      return NextResponse.json({ error: 'No valid form assignments found' }, { status: 404 });
    }

    const clientData = await getClientById(id);
    if (!clientData) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const adminId = assignments[0].assignedById;

    const submissions = await Promise.all(
      assignments.map((a) => getSubmission(a.clientId, a.formId, a.formVersion, a.instanceNumber))
    );

    const completedForms = submissions
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .map((s) => ({
        id: s.id,
        formId: s.formId,
        title: s.formTitle,
      }));

    const notificationResponse = await fetch(
      `${process.env.INTERNAL_API_URL || process.env.NEXTAUTH_URL}/api/notifications/send-email/${adminId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'client_confirmation',
          clientId: id,
          clientName: clientData.name,
          clientEmail: clientData.email,
          completedForms,
          completedAt: new Date().toLocaleString(),
        }),
      }
    );

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Failed to send internal email:', errorData);
      return NextResponse.json({
        error: 'Failed to send email',
        details: errorData.details || errorData.error || 'Email sending failed',
      }, { status: 500 });
    }

    const result = await notificationResponse.json();

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${clientData.email} with ${completedForms.length} PDF attachment(s)`,
      emailResult: result,
    });
  } catch (error: any) {
    console.error('❌ Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
