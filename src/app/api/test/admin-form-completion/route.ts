import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint to simulate admin form completion and email notification
 * POST /api/test/admin-form-completion
 */
export async function POST(req: NextRequest) {
  try {
    const { clientName, clientEmail, formTitle } = await req.json();

    // Default test data if not provided
    const defaultClientName = clientName || "Mike Johnson";
    const defaultClientEmail = clientEmail || "mike.johnson@example.com";
    const defaultFormTitle = formTitle || "Client Intake Form";

    console.log(`🧪 Testing admin form completion email notification`);
    console.log(`👤 Client: ${defaultClientName}, Form: ${defaultFormTitle}`);

    // Simulate the email call that would happen in admin submission
    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'batch_completed', // Using same template
        clientName: defaultClientName,
        clientEmail: defaultClientEmail,
        batchId: 0, // Not applicable for individual form
        completedForms: [{
          id: 999, // Test ID
          formId: 1,
          title: defaultFormTitle
        }],
        completedAt: new Date().toLocaleString()
      })
    });

    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      
      return NextResponse.json({
        success: true,
        message: "Admin form completion email test successful!",
        details: {
          clientName: defaultClientName,
          clientEmail: defaultClientEmail,
          formTitle: defaultFormTitle,
          emailSent: true,
          messageId: emailResult.messageId,
          attachments: emailResult.attachments || 0
        }
      });
    } else {
      const emailError = await emailResponse.text();
      
      return NextResponse.json(
        { 
          error: "Email sending failed", 
          details: emailError,
          clientName: defaultClientName,
          formTitle: defaultFormTitle
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin form completion test error:', error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
