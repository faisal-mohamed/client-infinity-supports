import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Send email notification to staff for selected forms
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await params to get the actual params object
  const { id: staffIdString } = await params;
  const staffId = parseInt(staffIdString);

  try {
    const { formAssignmentIds } = await req.json();

    if (!Array.isArray(formAssignmentIds) || formAssignmentIds.length === 0) {
      return NextResponse.json({ error: 'No form assignments provided' }, { status: 400 });
    }

    const assignments = await prisma.staffFormAssignment.findMany({
      where: {
        id: { in: formAssignmentIds }
      },
      include: {
        staff: { select: { id: true, firstName: true, surname: true, email: true } },
        form: { select: { id: true, title: true, formKey: true } }
      }
    });

    if (assignments.length === 0) {
      return NextResponse.json({ error: 'No valid form assignments found' }, { status: 404 });
    }

    const staff = assignments[0].staff;
    const adminId = assignments[0].assignedById;
    const staffName = `${staff.firstName} ${staff.surname}`;

    if (!staff.email) {
      return NextResponse.json({ 
        error: 'Staff does not have an email address' 
      }, { status: 400 });
    }

    // Get form submissions for the selected assignments
    const completedFormSubmissions = await Promise.all(
      assignments.map(async (assignment) => {
        if (!assignment.form.formKey) {
          return null;
        }

        const submission = await prisma.staffFormSubmission.findUnique({
          where: {
            staffId_formKey: {
              staffId: assignment.staffId,
              formKey: assignment.form.formKey,
            },
          },
        });

        if (!submission) {
          return null;
        }

        return {
          id: submission.id,
          formId: assignment.formId,
          title: assignment.form.title,
        };
      })
    );

    // Filter out null submissions
    const completedForms = completedFormSubmissions
      .filter((submission): submission is NonNullable<typeof submission> => submission !== null);

    if (completedForms.length === 0) {
      return NextResponse.json({ 
        error: 'No completed form submissions found for selected forms' 
      }, { status: 404 });
    }

    // Send the staff confirmation email via internal API
    const notificationResponse = await fetch(
      `${process.env.NEXTAUTH_URL || process.env.VERCEL_URL}/api/notifications/send-email/${adminId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'staff_confirmation',
          adminId,
          staffId: staff.id,
          staffName,
          staffEmail: staff.email,
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
      message: `Email sent successfully to ${staff.email} with ${completedForms.length} PDF attachment(s)`,
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

