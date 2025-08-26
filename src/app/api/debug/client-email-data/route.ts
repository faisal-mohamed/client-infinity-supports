import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Debug client email data flow
 * POST /api/debug/client-email-data
 */
export async function POST(req: NextRequest) {
  try {
    const { clientId, batchId } = await req.json();

    console.log(`🔍 Debugging client email data for clientId: ${clientId}, batchId: ${batchId}`);

    // Test 1: Check if client exists and has email
    const client = await prisma.client.findUnique({
      where: { id: clientId || 1 },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    });

    // Test 2: Check batch data if provided
    let batchData = null;
    if (batchId) {
      batchData = await prisma.formBatch.findUnique({
        where: { id: batchId },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          assignments: {
            include: {
              form: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      });
    }

    // Test 3: Check recent form submissions for this client
    const recentSubmissions = await prisma.formSubmission.findMany({
      where: {
        clientId: clientId || 1
      },
      include: {
        form: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5
    });

    const analysis = {
      clientData: {
        exists: !!client,
        hasEmail: !!(client?.email),
        email: client?.email || 'NO EMAIL',
        name: client?.name || 'NO NAME',
        details: client
      },
      batchData: batchData ? {
        exists: true,
        clientEmail: batchData.client.email,
        formsCount: batchData.assignments.length,
        details: batchData
      } : null,
      recentSubmissions: {
        count: recentSubmissions.length,
        submissions: recentSubmissions.map((sub: any) => ({
          id: sub.id,
          formTitle: sub.form.title,
          isSubmitted: sub.isSubmitted,
          updatedAt: sub.updatedAt
        }))
      },
      issues: [] as string[]
    };

    // Identify issues
    if (!client) {
      analysis.issues.push("❌ Client not found in database");
    } else if (!client.email) {
      analysis.issues.push("❌ Client has no email address");
    } else if (!client.email.includes('@')) {
      analysis.issues.push("❌ Client email appears invalid");
    }

    if (batchData && !batchData.client.email) {
      analysis.issues.push("❌ Batch client has no email address");
    }

    if (analysis.issues.length === 0) {
      analysis.issues.push("✅ Client data looks good for email sending");
    }

    return NextResponse.json({
      success: true,
      analysis,
      recommendations: generateEmailDataRecommendations(analysis)
    });

  } catch (error) {
    console.error('❌ Client email data debug failed:', error);
    return NextResponse.json(
      { 
        error: "Client email data debug failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function generateEmailDataRecommendations(analysis: any): string[] {
  const recommendations: string[] = [];

  if (!analysis.clientData.exists) {
    recommendations.push("🔧 Create a client record in the database first");
  } else if (!analysis.clientData.hasEmail) {
    recommendations.push("🔧 Add an email address to the client record");
  } else if (!analysis.clientData.email.includes('@')) {
    recommendations.push("🔧 Fix the client's email address format");
  }

  if (analysis.recentSubmissions.count === 0) {
    recommendations.push("📝 No form submissions found - create test form submissions");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Client data is ready for email notifications");
    recommendations.push("🧪 Try testing the dual notification email");
  }

  return recommendations;
}
