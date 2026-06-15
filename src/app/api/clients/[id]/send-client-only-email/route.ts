// // Sending Email Notification Only t

// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { clientId: string } }
// ) {
//   try {
//     const clientId = parseInt(params.clientId);
//     const { formAssignmentIds } = await req.json();

//     if (!Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
//       return NextResponse.json({ error: 'No form assignments provided' }, { status: 400 });
//     }

//     const assignments = await prisma.formAssignment.findMany({
//       where: {
//         id: { in: formAssignmentIds }
//       },
//       include: {
//         client: { select: { id: true, name: true, email: true } },
//         form: { select: { id: true, title: true } }
//       }
//     });

//     if (assignments.length === 0) {
//       return NextResponse.json({ error: 'No valid form assignments found' }, { status: 404 });
//     }

//     const client = assignments[0].client;
//     const adminId = assignments[0].assignedById;

//     const submissions = await prisma.formSubmission.findMany({
//       where: {
//         OR: assignments.map(a => ({
//           clientId: a.clientId,
//           formId: a.formId,
//           formVersion: a.formVersion
//         }))
//       },
//       include: {
//         form: { select: { title: true } }
//       }
//     });

//     const completedForms = submissions.map(s => ({
//       id: s.id,
//       formId: s.formId,
//       title: s.form.title
//     }));

//     // Send the client confirmation email via internal API
//     const notificationResponse = await fetch(
//       `${process.env.NEXTAUTH_URL}/api/notifications/send-email/${adminId}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           type: 'client_confirmation',
//           clientId: client.id,
//           clientName: client.name,
//           clientEmail: client.email,
//           completedForms,
//           completedAt: new Date().toLocaleString()
//         })
//       }
//     );

//     if (!notificationResponse.ok) {
//       const errText = await notificationResponse.text();
//       console.error('Failed to send internal email:', errText);
//       return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
//     }

//     const result = await notificationResponse.json();

//     return NextResponse.json({
//       success: true,
//       message: 'Client confirmation email sent',
//       emailResult: result
//     });
//   } catch (error: any) {
//     console.error('Error sending confirmation email:', error);
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// The critical update is here: await "params" (can be Promise in Next 14/15 App Router)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params to get the actual params object
  const { id: clientIdString } = await params;
  const clientId = parseInt(clientIdString);

  try {
    const { formAssignmentIds } = await req.json();

    if (!Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
      return NextResponse.json({ error: 'No form assignments provided' }, { status: 400 });
    }

    const assignments = await prisma.formAssignment.findMany({
      where: {
        id: { in: formAssignmentIds }
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        form: { select: { id: true, title: true } }
      }
    });

    if (assignments.length === 0) {
      return NextResponse.json({ error: 'No valid form assignments found' }, { status: 404 });
    }

    const client = assignments[0].client;
    const adminId = assignments[0].assignedById;

    const submissions = await prisma.formSubmission.findMany({
      where: {
        OR: assignments.map(a => ({
          clientId: a.clientId,
          formId: a.formId,
          formVersion: a.formVersion,
          instanceNumber: a.instanceNumber, // ✅ Added instanceNumber for correct filtering
        }))
      },
      include: {
        form: { select: { title: true } }
      }
    });

    const completedForms = submissions.map(s => ({
      id: s.id,
      formId: s.formId,
      title: s.form.title
    }));

    // Send the client confirmation email via internal API
    const notificationResponse = await fetch(
      `${process.env.INTERNAL_API_URL || req.nextUrl.origin || process.env.NEXTAUTH_URL}/api/notifications/send-email/${adminId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'client_confirmation',
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          completedForms,
          completedAt: new Date().toLocaleString()
        })
      }
    );

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Failed to send internal email:', errorData);

      // Return detailed error for frontend to parse
      return NextResponse.json({
        error: 'Failed to send email',
        details: errorData.details || errorData.error || 'Email sending failed'
      }, { status: 500 });
    }

    const result = await notificationResponse.json();

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${client.email} with ${completedForms.length} PDF attachment(s)`,
      emailResult: result
    });
  } catch (error: any) {
    console.error('❌ Error sending confirmation email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
