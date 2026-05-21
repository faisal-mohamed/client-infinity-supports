import { NextRequest, NextResponse } from "next/server";
import { getEmailStats, getRecentEmailFailures } from "@/lib/email-logger";
import { testEmailConnection } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * GET /api/admin/email-monitoring
 * Get email system monitoring data
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');

    console.log(`📊 Fetching email monitoring data for last ${days} days`);

    // Get email statistics
    const stats = await getEmailStats(days);
    
    // Get recent failures
    const recentFailures = await getRecentEmailFailures(10);
    
    // Test current email connection
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || "1";
    const connectionTest = await testEmailConnection(adminId);

    // Calculate health score
    const healthScore = calculateEmailHealthScore(stats, connectionTest.success);

    return NextResponse.json({
      success: true,
      monitoring: {
        period: `Last ${days} days`,
        healthScore,
        connectionStatus: {
          isHealthy: connectionTest.success,
          message: connectionTest.message
        },
        statistics: stats,
        recentFailures: recentFailures.map(failure => ({
          timestamp: failure.timestamp,
          recipient: failure.recipient,
          error: failure.error,
          clientName: failure.clientName,
          emailType: failure.emailType
        })),
        recommendations: generateRecommendations(stats, connectionTest.success, recentFailures)
      }
    });

  } catch (error) {
    console.error('Email monitoring error:', error);
    return NextResponse.json(
      { 
        error: "Failed to fetch email monitoring data", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate email system health score (0-100)
 */
function calculateEmailHealthScore(stats: any, connectionHealthy: boolean): number {
  let score = 0;

  // Connection health (40 points)
  if (connectionHealthy) {
    score += 40;
  }

  // Success rate (40 points)
  if (stats.totalEmails > 0) {
    score += Math.round((stats.successRate / 100) * 40);
  } else if (connectionHealthy) {
    // No emails sent but connection is healthy
    score += 30;
  }

  // Volume health (20 points)
  if (stats.totalEmails > 0) {
    if (stats.failedEmails === 0) {
      score += 20; // Perfect
    } else if (stats.failedEmails <= 2) {
      score += 15; // Good
    } else if (stats.failedEmails <= 5) {
      score += 10; // Fair
    } else {
      score += 5; // Poor
    }
  } else {
    score += 10; // Neutral for no activity
  }

  return Math.min(score, 100);
}

/**
 * Generate recommendations based on email system status
 */
function generateRecommendations(stats: any, connectionHealthy: boolean, recentFailures: any[]): string[] {
  const recommendations: string[] = [];

  if (!connectionHealthy) {
    recommendations.push("🔴 Email connection is failing. Check SMTP settings in admin panel.");
  }

  if (stats.successRate < 90 && stats.totalEmails > 0) {
    recommendations.push("⚠️ Email success rate is below 90%. Review recent failures for patterns.");
  }

  if (stats.failedEmails > 5) {
    recommendations.push("📧 High number of email failures detected. Consider reviewing email configuration.");
  }

  if (recentFailures.length > 3) {
    const commonErrors = findCommonErrors(recentFailures);
    if (commonErrors.length > 0) {
      recommendations.push(`🔍 Common error patterns detected: ${commonErrors.join(', ')}`);
    }
  }

  if (stats.retryAttempts > stats.successfulEmails) {
    recommendations.push("🔄 High retry rate detected. Email server may be experiencing issues.");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Email system is operating normally. No issues detected.");
  }

  return recommendations;
}

/**
 * Find common error patterns in recent failures
 */
function findCommonErrors(failures: any[]): string[] {
  const errorCounts: { [key: string]: number } = {};
  
  failures.forEach(failure => {
    if (failure.error) {
      const error = failure.error.toLowerCase();
      if (error.includes('timeout')) {
        errorCounts['Connection Timeout'] = (errorCounts['Connection Timeout'] || 0) + 1;
      } else if (error.includes('authentication')) {
        errorCounts['Authentication Failed'] = (errorCounts['Authentication Failed'] || 0) + 1;
      } else if (error.includes('invalid')) {
        errorCounts['Invalid Configuration'] = (errorCounts['Invalid Configuration'] || 0) + 1;
      }
    }
  });

  return Object.entries(errorCounts)
    .filter(([_, count]) => count >= 2)
    .map(([error, count]) => `${error} (${count}x)`);
}
