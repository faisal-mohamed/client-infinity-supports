import { NextRequest, NextResponse } from "next/server";

/**
 * Test client and dual email notifications
 * POST /api/test/client-dual-email
 */
export async function POST(req: NextRequest) {
  try {
    const { testType } = await req.json();

    console.log(`🧪 Testing ${testType || 'all'} email notifications...`);

    const testResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test 1: Client Test Email
    if (!testType || testType === 'client_test') {
      console.log(`📧 Testing client test email...`);
      const clientTestResult = await testClientTestEmail();
      testResults.tests.push(clientTestResult);
    }

    // Test 2: Client Confirmation Email
    if (!testType || testType === 'client_confirmation') {
      console.log(`📧 Testing client confirmation email...`);
      const clientConfirmationResult = await testClientConfirmationEmail();
      testResults.tests.push(clientConfirmationResult);
    }

    // Test 3: Dual Notification Email
    if (!testType || testType === 'dual_notification') {
      console.log(`📧 Testing dual notification email...`);
      const dualNotificationResult = await testDualNotificationEmail();
      testResults.tests.push(dualNotificationResult);
    }

    const successCount = testResults.tests.filter(t => t.success).length;
    const totalCount = testResults.tests.length;

    return NextResponse.json({
      success: successCount === totalCount,
      summary: `${successCount}/${totalCount} tests passed`,
      testResults,
      instructions: "Check both admin and client email inboxes for test emails"
    });

  } catch (error) {
    console.error('❌ Client/dual email test failed:', error);
    return NextResponse.json(
      { 
        error: "Client/dual email test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Test client test email
 */
async function testClientTestEmail() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'client_test',
        clientName: 'Test Client User',
        clientEmail: 'stigmataclousecaws@gmail.com' // Your email for testing
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        test: 'Client Test Email',
        success: true,
        details: 'Client test email sent successfully',
        messageId: result.messageId
      };
    } else {
      const error = await response.text();
      return {
        test: 'Client Test Email',
        success: false,
        error: `Failed to send: ${error}`
      };
    }
  } catch (error) {
    return {
      test: 'Client Test Email',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test client confirmation email
 */
async function testClientConfirmationEmail() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'client_confirmation',
        clientName: 'John Doe',
        clientEmail: 'stigmataclousecaws@gmail.com', // Your email for testing
        completedForms: [
          { id: 1, formId: 1, title: 'Client Intake Form' },
          { id: 2, formId: 2, title: 'Home Visit Risk Assessment' }
        ],
        completedAt: new Date().toLocaleString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        test: 'Client Confirmation Email',
        success: true,
        details: `Client confirmation sent with ${result.attachments} PDF attachments`,
        messageId: result.messageId,
        attachments: result.attachments
      };
    } else {
      const error = await response.text();
      return {
        test: 'Client Confirmation Email',
        success: false,
        error: `Failed to send: ${error}`
      };
    }
  } catch (error) {
    return {
      test: 'Client Confirmation Email',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test dual notification email
 */
async function testDualNotificationEmail() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'dual_notification',
        clientName: 'Jane Smith',
        clientEmail: 'stigmataclousecaws@gmail.com', // Your email for testing (client)
        completedForms: [
          { id: 1, formId: 1, title: 'Client Intake Form' },
          { id: 2, formId: 2, title: 'Support Plan' }
        ],
        completedAt: new Date().toLocaleString()
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        test: 'Dual Notification Email',
        success: true,
        details: `Dual notification sent - Admin: ${result.adminEmail.success}, Client: ${result.clientEmail.success}`,
        adminEmail: result.adminEmail,
        clientEmail: result.clientEmail,
        totalEmails: result.totalEmails
      };
    } else {
      const error = await response.text();
      return {
        test: 'Dual Notification Email',
        success: false,
        error: `Failed to send: ${error}`
      };
    }
  } catch (error) {
    return {
      test: 'Dual Notification Email',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
