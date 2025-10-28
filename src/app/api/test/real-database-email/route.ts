import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Test email with REAL database data (not mock data)
 * POST /api/test/real-database-email
 */
export async function POST(req: NextRequest) {
  try {
    console.log(`🧪 Testing email with REAL database data...`);

    // Step 1: Get real client data from database
    const client = await prisma.client.findFirst({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!client) {
      return NextResponse.json({
        error: "No client found in database",
        suggestion: "Create a client record first"
      }, { status: 404 });
    }

    // Step 2: Get real form submissions from database
    const formSubmissions = await prisma.formSubmission.findMany({
      where: {
        clientId: client.id
      },
      include: {
        form: {
          select: {
            id: true,
            title: true,
            formKey: true
          }
        }
      },
      take: 3 // Limit to 3 forms
    });

    if (formSubmissions.length === 0) {
      return NextResponse.json({
        error: "No form submissions found for client",
        clientId: client.id,
        suggestion: "Create some form submissions first"
      }, { status: 404 });
    }

    // Step 3: Prepare REAL form data (same as production code)
    const completedFormsData = formSubmissions.map(submission => {
      console.log(`🔍 Real form data:`, {
        submissionId: submission.id,
        formId: submission.formId,
        formTitle: submission.form?.title,
        hasFormObject: !!submission.form
      });

      return {
        id: submission.id,
        formId: submission.formId,
        title: submission.form?.title || 'Unknown Form' // ← This will show the REAL issue
      };
    });

    console.log(`📧 Real completed forms data:`, completedFormsData);

    // Step 4: Send email with REAL data
    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'dual_notification',
        clientName: client.name,
        clientEmail: client.email,
        completedForms: completedFormsData, // ← REAL database data
        completedAt: new Date().toLocaleString()
      })
    });

    if (emailResponse.ok) {
      const result = await emailResponse.json();
      return NextResponse.json({
        success: true,
        message: "Email sent with REAL database data",
        clientData: {
          id: client.id,
          name: client.name,
          email: client.email
        },
        formsData: completedFormsData,
        emailResult: {
          adminSuccess: result.adminEmail?.success,
          clientSuccess: result.clientEmail?.success,
          totalEmails: result.totalEmails
        }
      });
    } else {
      const error = await emailResponse.text();
      return NextResponse.json({
        error: "Email sending failed",
        details: error,
        formsData: completedFormsData // Show what data was attempted
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Real database email test failed:', error);
    return NextResponse.json(
      { 
        error: "Real database email test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
