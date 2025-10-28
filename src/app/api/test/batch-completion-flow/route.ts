import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Test endpoint to simulate complete batch completion workflow
 * POST /api/test/batch-completion-flow
 */
export async function POST(req: NextRequest) {
  try {
    const { testScenario } = await req.json();
    
    console.log(`🧪 Testing batch completion flow - Scenario: ${testScenario || 'default'}`);

    // Test Scenario 1: Simulate partial batch completion (no email)
    if (testScenario === 'partial') {
      return await testPartialBatchCompletion();
    }
    
    // Test Scenario 2: Simulate full batch completion (email sent)
    if (testScenario === 'complete') {
      return await testFullBatchCompletion();
    }

    // Default: Show available test scenarios
    return NextResponse.json({
      message: "Batch completion test endpoint",
      availableScenarios: [
        {
          scenario: "partial",
          description: "Simulate partial batch completion (2/3 forms done) - No email should be sent",
          command: `curl -X POST http://localhost:3000/api/test/batch-completion-flow -H "Content-Type: application/json" -d '{"testScenario": "partial"}'`
        },
        {
          scenario: "complete", 
          description: "Simulate full batch completion (3/3 forms done) - Email should be sent",
          command: `curl -X POST http://localhost:3000/api/test/batch-completion-flow -H "Content-Type: application/json" -d '{"testScenario": "complete"}'`
        }
      ]
    });

  } catch (error) {
    console.error('Batch completion test error:', error);
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Test partial batch completion (should NOT send email)
 */
async function testPartialBatchCompletion() {
  console.log(`📊 Testing partial batch completion...`);

  // Simulate batch with 3 forms, only 2 completed
  const mockBatchData = {
    id: 999,
    clientId: 1,
    client: {
      id: 1,
      name: "Test Client - Partial",
      email: "test.partial@example.com"
    },
    assignments: [
      { id: 1, currentStatus: "completed", formId: 1, form: { title: "Form 1" } },
      { id: 2, currentStatus: "completed", formId: 2, form: { title: "Form 2" } },
      { id: 3, currentStatus: "in_progress", formId: 3, form: { title: "Form 3" } } // Not completed
    ]
  };

  const completedCount = mockBatchData.assignments.filter(a => a.currentStatus === "completed").length;
  const totalCount = mockBatchData.assignments.length;

  console.log(`📊 Batch ${mockBatchData.id} status: ${completedCount}/${totalCount} forms completed`);

  if (completedCount === totalCount) {
    console.log(`🎉 Batch would be complete - Email would be sent`);
    return NextResponse.json({
      success: true,
      scenario: "partial",
      batchComplete: true,
      emailSent: true,
      message: "This should not happen in partial test!",
      batchStatus: `${completedCount}/${totalCount} completed`
    });
  } else {
    console.log(`⏳ Batch not yet complete: ${completedCount}/${totalCount} forms done`);
    return NextResponse.json({
      success: true,
      scenario: "partial",
      batchComplete: false,
      emailSent: false,
      message: "✅ Correct! Partial batch completion detected - No email sent",
      batchStatus: `${completedCount}/${totalCount} completed`,
      remainingForms: mockBatchData.assignments
        .filter(a => a.currentStatus !== "completed")
        .map(a => a.form.title)
    });
  }
}

/**
 * Test full batch completion (should send email)
 */
async function testFullBatchCompletion() {
  console.log(`📊 Testing full batch completion...`);

  // Simulate batch with 3 forms, all completed
  const mockBatchData = {
    id: 888,
    clientId: 1,
    client: {
      id: 1,
      name: "Test Client - Complete",
      email: "test.complete@example.com"
    },
    assignments: [
      { id: 1, currentStatus: "completed", formId: 1, form: { title: "Client Intake Form" } },
      { id: 2, currentStatus: "completed", formId: 2, form: { title: "Home Visit Risk Assessment" } },
      { id: 3, currentStatus: "completed", formId: 3, form: { title: "Support Plan" } }
    ]
  };

  const completedCount = mockBatchData.assignments.filter(a => a.currentStatus === "completed").length;
  const totalCount = mockBatchData.assignments.length;

  console.log(`📊 Batch ${mockBatchData.id} status: ${completedCount}/${totalCount} forms completed`);

  if (completedCount === totalCount && totalCount > 0) {
    console.log(`🎉 Batch ${mockBatchData.id} is now fully completed! Sending email notification.`);

    // Prepare completed forms data for email
    const completedFormsData = mockBatchData.assignments.map(assignment => ({
      id: assignment.id + 100, // Mock submission IDs
      formId: assignment.formId,
      title: assignment.form.title
    }));

    try {
      // Send actual email
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'batch_completed',
          clientId: mockBatchData.clientId,
          clientName: mockBatchData.client.name,
          clientEmail: mockBatchData.client.email,
          batchId: mockBatchData.id,
          completedForms: completedFormsData,
          completedAt: new Date().toLocaleString()
        })
      });

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        console.log(`✅ Batch completion email sent successfully:`, emailResult);
        
        return NextResponse.json({
          success: true,
          scenario: "complete",
          batchComplete: true,
          emailSent: true,
          message: "✅ Full batch completion detected - Email sent successfully!",
          batchStatus: `${completedCount}/${totalCount} completed`,
          emailDetails: {
            messageId: emailResult.messageId,
            attachments: emailResult.attachments,
            client: mockBatchData.client.name,
            formsCount: completedFormsData.length
          }
        });
      } else {
        const emailError = await emailResponse.text();
        console.error(`❌ Failed to send batch completion email:`, emailError);
        
        return NextResponse.json({
          success: false,
          scenario: "complete",
          batchComplete: true,
          emailSent: false,
          message: "❌ Batch complete but email failed",
          error: emailError
        }, { status: 500 });
      }
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      return NextResponse.json({
        success: false,
        scenario: "complete", 
        batchComplete: true,
        emailSent: false,
        message: "❌ Batch complete but email error occurred",
        error: emailError instanceof Error ? emailError.message : "Unknown email error"
      }, { status: 500 });
    }
  } else {
    return NextResponse.json({
      success: true,
      scenario: "complete",
      batchComplete: false,
      emailSent: false,
      message: "This should not happen in complete test!",
      batchStatus: `${completedCount}/${totalCount} completed`
    });
  }
}
