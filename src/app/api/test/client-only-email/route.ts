import { NextRequest, NextResponse } from "next/server";

/**
 * Test ONLY client email (no admin email)
 * POST /api/test/client-only-email
 */
export async function POST(req: NextRequest) {
  try {
    const { clientEmail } = await req.json();
    const testEmail = clientEmail || 'stigmataclousecaws@gmail.com';

    console.log(`🧪 Testing ONLY client email to: ${testEmail}`);

    // Send only client confirmation email
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'client_confirmation', // ONLY client email
        clientName: 'Test Client Only',
        clientEmail: testEmail,
        completedForms: [
          { id: 1, formId: 1, title: 'Test Form for Client' }
        ],
        completedAt: new Date().toLocaleString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({
        success: true,
        message: "Client-only email sent successfully!",
        details: {
          recipient: testEmail,
          messageId: result.messageId,
          attachments: result.attachments
        },
        instructions: `Check email inbox for: ${testEmail}`
      });
    } else {
      const error = await response.text();
      return NextResponse.json(
        { 
          error: "Failed to send client email", 
          details: error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Client-only email test failed:', error);
    return NextResponse.json(
      { 
        error: "Client-only email test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
