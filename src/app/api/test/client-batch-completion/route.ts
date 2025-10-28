import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint to simulate client batch completion and email notification
 * POST /api/test/client-batch-completion
 */
export async function POST(req: NextRequest) {
  try {
    const { clientName, batchId, testForms } = await req.json();

    // Default test data if not provided
    const defaultClientName = clientName || "Jane Smith";
    const defaultBatchId = batchId || 456;
    const defaultForms = testForms || [
      {
        id: 1,
        formId: 1,
        title: "Client Intake Form"
      },
      {
        id: 2,
        formId: 2,
        title: "Home Visit Risk Assessment"
      }
    ];

    console.log(`🧪 Testing client batch completion email notification`);
    console.log(`👤 Client: ${defaultClientName}, Batch: ${defaultBatchId}, Forms: ${defaultForms.length}`);

    // Simulate the email call that would happen in client submission
    const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'batch_completed',
        clientName: defaultClientName,
        batchId: defaultBatchId,
        completedForms: defaultForms,
        completedAt: new Date().toLocaleString()
      })
    });

    if (emailResponse.ok) {
      const emailResult = await emailResponse.json();
      
      return NextResponse.json({
        success: true,
        message: "Client batch completion email test successful!",
        details: {
          clientName: defaultClientName,
          batchId: defaultBatchId,
          formsCount: defaultForms.length,
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
          batchId: defaultBatchId
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Client batch completion test error:', error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
