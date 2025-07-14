import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Check what actual data exists in database
 * GET /api/debug/database-contents
 */
export async function GET() {
  try {
    console.log(`🔍 Checking database contents...`);

    // Check clients
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      take: 5
    });

    // Check forms
    const forms = await prisma.masterForm.findMany({
      select: {
        id: true,
        title: true,
        formKey: true,
        version: true
      },
      take: 5
    });

    // Check form submissions
    const formSubmissions = await prisma.formSubmission.findMany({
      select: {
        id: true,
        clientId: true,
        formId: true,
        formVersion: true,
        isSubmitted: true,
        createdAt: true
      },
      include: {
        form: {
          select: {
            id: true,
            title: true
          }
        },
        client: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: 10
    });

    // Check form batches
    const formBatches = await prisma.formBatch.findMany({
      select: {
        id: true,
        clientId: true,
        isCompleted: true,
        createdAt: true
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      take: 5
    });

    // Check form assignments
    const formAssignments = await prisma.formAssignment.findMany({
      select: {
        id: true,
        clientId: true,
        formId: true,
        currentStatus: true,
        isCompleted: true
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        form: {
          select: {
            id: true,
            title: true
          }
        }
      },
      take: 10
    });

    return NextResponse.json({
      success: true,
      databaseContents: {
        clients: {
          count: clients.length,
          data: clients
        },
        forms: {
          count: forms.length,
          data: forms
        },
        formSubmissions: {
          count: formSubmissions.length,
          data: formSubmissions
        },
        formBatches: {
          count: formBatches.length,
          data: formBatches
        },
        formAssignments: {
          count: formAssignments.length,
          data: formAssignments
        }
      },
      recommendations: generateDatabaseRecommendations({
        clients: clients.length,
        forms: forms.length,
        formSubmissions: formSubmissions.length,
        formBatches: formBatches.length,
        formAssignments: formAssignments.length
      })
    });

  } catch (error) {
    console.error('❌ Database contents check failed:', error);
    return NextResponse.json(
      { 
        error: "Failed to check database contents", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function generateDatabaseRecommendations(counts: any): string[] {
  const recommendations: string[] = [];

  if (counts.clients === 0) {
    recommendations.push("❌ No clients found - create a client first");
  }

  if (counts.forms === 0) {
    recommendations.push("❌ No forms found - create a master form first");
  }

  if (counts.formSubmissions === 0) {
    recommendations.push("❌ No form submissions found - create form submissions for testing");
  }

  if (counts.formBatches === 0) {
    recommendations.push("❌ No form batches found - create form batches for testing");
  }

  if (counts.formAssignments === 0) {
    recommendations.push("❌ No form assignments found - assign forms to clients");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Database has data - ready for testing with real IDs");
  }

  return recommendations;
}
