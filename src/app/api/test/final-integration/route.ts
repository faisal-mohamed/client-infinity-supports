import { NextRequest, NextResponse } from "next/server";
import { sendOptimizedBatchEmail, generatePerformanceRecommendations } from "@/lib/email-performance";
import { getEmailStats } from "@/lib/email-logger";

/**
 * Final Integration Test - Complete Email System
 * POST /api/test/final-integration
 */
export async function POST(req: NextRequest) {
  console.log(`🎯 Starting final integration test...`);
  
  const testReport = {
    timestamp: new Date().toISOString(),
    testName: "Final Email System Integration Test",
    scenarios: [] as any[],
    overallMetrics: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      averageProcessingTime: 0,
      totalAttachmentSize: 0
    },
    systemHealth: {} as any,
    recommendations: [] as string[]
  };

  try {
    // Scenario 1: Single Form Completion
    console.log(`📧 Testing single form completion...`);
    const singleFormResult = await testSingleFormCompletion();
    testReport.scenarios.push(singleFormResult);

    // Scenario 2: Multiple Forms Batch
    console.log(`📧 Testing multiple forms batch...`);
    const multipleFormsResult = await testMultipleFormsBatch();
    testReport.scenarios.push(multipleFormsResult);

    // Scenario 3: Large Batch Performance
    console.log(`📧 Testing large batch performance...`);
    const largeBatchResult = await testLargeBatchPerformance();
    testReport.scenarios.push(largeBatchResult);

    // Calculate overall metrics
    testReport.overallMetrics.totalTests = testReport.scenarios.length;
    testReport.overallMetrics.passedTests = testReport.scenarios.filter(s => s.success).length;
    testReport.overallMetrics.failedTests = testReport.scenarios.filter(s => !s.success).length;
    
    const totalProcessingTime = testReport.scenarios.reduce((sum, s) => sum + (s.metrics?.totalProcessingTime || 0), 0);
    testReport.overallMetrics.averageProcessingTime = Math.round(totalProcessingTime / testReport.scenarios.length);
    
    testReport.overallMetrics.totalAttachmentSize = testReport.scenarios.reduce((sum, s) => sum + (s.metrics?.totalAttachmentSize || 0), 0);

    // Get system health
    testReport.systemHealth = await getSystemHealth();

    // Generate recommendations
    testReport.recommendations = generateFinalRecommendations(testReport);

    const overallSuccess = testReport.overallMetrics.failedTests === 0;
    const successRate = Math.round((testReport.overallMetrics.passedTests / testReport.overallMetrics.totalTests) * 100);

    console.log(`🎯 Final integration test complete: ${overallSuccess ? 'PASSED' : 'FAILED'} (${successRate}% success rate)`);

    return NextResponse.json({
      success: overallSuccess,
      successRate: `${successRate}%`,
      status: overallSuccess ? 'PRODUCTION READY' : 'NEEDS ATTENTION',
      ...testReport
    });

  } catch (error) {
    console.error('❌ Final integration test failed:', error);
    return NextResponse.json(
      { 
        error: "Final integration test failed", 
        details: error instanceof Error ? error.message : "Unknown error",
        partialReport: testReport
      },
      { status: 500 }
    );
  }
}

/**
 * Test single form completion scenario
 */
async function testSingleFormCompletion() {
  const startTime = Date.now();
  
  try {
    const result = await sendOptimizedBatchEmail({
      clientName: "Test Client - Single Form",
      clientEmail: "single@test.com",
      completedForms: [{
        id: 101,
        formId: 1,
        title: "Client Intake Form"
      }],
      batchId: 1001,
      adminEmail: "admin@test.com"
    });

    return {
      scenario: "Single Form Completion",
      success: result.success,
      duration: Date.now() - startTime,
      metrics: result.metrics,
      messageId: result.messageId,
      error: result.error,
      details: result.success ? "Single form email sent successfully" : `Failed: ${result.error}`
    };
  } catch (error) {
    return {
      scenario: "Single Form Completion",
      success: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Test multiple forms batch scenario
 */
async function testMultipleFormsBatch() {
  const startTime = Date.now();
  
  try {
    const result = await sendOptimizedBatchEmail({
      clientName: "Test Client - Multiple Forms",
      clientEmail: "multiple@test.com",
      completedForms: [
        { id: 201, formId: 1, title: "Client Intake Form" },
        { id: 202, formId: 2, title: "Home Visit Risk Assessment" },
        { id: 203, formId: 3, title: "Support Plan" }
      ],
      batchId: 2001,
      adminEmail: "admin@test.com"
    });

    return {
      scenario: "Multiple Forms Batch",
      success: result.success,
      duration: Date.now() - startTime,
      metrics: result.metrics,
      messageId: result.messageId,
      error: result.error,
      details: result.success ? "Multiple forms email sent successfully" : `Failed: ${result.error}`
    };
  } catch (error) {
    return {
      scenario: "Multiple Forms Batch",
      success: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Test large batch performance scenario
 */
async function testLargeBatchPerformance() {
  const startTime = Date.now();
  
  try {
    // Create a large batch of forms for performance testing
    const largeBatch = Array.from({ length: 7 }, (_, i) => ({
      id: 300 + i,
      formId: 1,
      title: `Performance Test Form ${i + 1}`
    }));

    const result = await sendOptimizedBatchEmail({
      clientName: "Test Client - Large Batch",
      clientEmail: "large@test.com",
      completedForms: largeBatch,
      batchId: 3001,
      adminEmail: "admin@test.com"
    });

    const performanceScore = calculatePerformanceScore(result.metrics);

    return {
      scenario: "Large Batch Performance",
      success: result.success,
      duration: Date.now() - startTime,
      metrics: result.metrics,
      performanceScore,
      messageId: result.messageId,
      error: result.error,
      details: result.success ? 
        `Large batch processed successfully (Performance Score: ${performanceScore}/100)` : 
        `Failed: ${result.error}`
    };
  } catch (error) {
    return {
      scenario: "Large Batch Performance",
      success: false,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Get system health information
 */
async function getSystemHealth() {
  try {
    // Get email statistics
    const emailStats = await getEmailStats(7);
    
    // Test email configuration
    const configResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/send-email`);
    const configHealthy = configResponse.ok;

    return {
      emailStats,
      configurationHealthy: configHealthy,
      lastWeekSuccessRate: emailStats.successRate,
      totalEmailsProcessed: emailStats.totalEmails,
      systemUptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      healthScore: calculateSystemHealthScore(emailStats, configHealthy)
    };
  } catch (error) {
    return {
      error: "Failed to get system health",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Calculate performance score based on metrics
 */
function calculatePerformanceScore(metrics: any): number {
  if (!metrics) return 0;
  
  let score = 100;
  
  // Deduct points for slow PDF generation (>5s)
  if (metrics.pdfGenerationTime > 5000) {
    score -= Math.min(30, (metrics.pdfGenerationTime - 5000) / 1000 * 5);
  }
  
  // Deduct points for slow email sending (>10s)
  if (metrics.emailSendingTime > 10000) {
    score -= Math.min(25, (metrics.emailSendingTime - 10000) / 1000 * 2);
  }
  
  // Deduct points for large attachments (>20MB)
  if (metrics.totalAttachmentSize > 20 * 1024 * 1024) {
    score -= Math.min(20, (metrics.totalAttachmentSize - 20 * 1024 * 1024) / (1024 * 1024) * 2);
  }
  
  // Deduct points for slow total processing (>15s)
  if (metrics.totalProcessingTime > 15000) {
    score -= Math.min(25, (metrics.totalProcessingTime - 15000) / 1000 * 2);
  }
  
  return Math.max(0, Math.round(score));
}

/**
 * Calculate system health score
 */
function calculateSystemHealthScore(emailStats: any, configHealthy: boolean): number {
  let score = 0;
  
  // Configuration health (40 points)
  if (configHealthy) score += 40;
  
  // Email success rate (40 points)
  if (emailStats.totalEmails > 0) {
    score += Math.round((emailStats.successRate / 100) * 40);
  } else if (configHealthy) {
    score += 30; // No emails but config is healthy
  }
  
  // System stability (20 points)
  if (emailStats.failedEmails === 0) {
    score += 20;
  } else if (emailStats.failedEmails <= 2) {
    score += 15;
  } else if (emailStats.failedEmails <= 5) {
    score += 10;
  } else {
    score += 5;
  }
  
  return Math.min(100, score);
}

/**
 * Generate final recommendations
 */
function generateFinalRecommendations(report: any): string[] {
  const recommendations: string[] = [];
  
  const failedScenarios = report.scenarios.filter((s: any) => !s.success);
  if (failedScenarios.length > 0) {
    recommendations.push(`🔴 Fix ${failedScenarios.length} failed scenario(s): ${failedScenarios.map((s: any) => s.scenario).join(', ')}`);
  }
  
  if (report.overallMetrics.averageProcessingTime > 10000) {
    recommendations.push("⏱️ Average processing time is high (>10s). Consider performance optimizations.");
  }
  
  if (report.systemHealth.healthScore < 80) {
    recommendations.push("🏥 System health score is below 80. Review email configuration and recent failures.");
  }
  
  const slowScenarios = report.scenarios.filter((s: any) => s.duration > 15000);
  if (slowScenarios.length > 0) {
    recommendations.push(`🐌 Slow scenarios detected: ${slowScenarios.map((s: any) => s.scenario).join(', ')}`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push("🎉 Excellent! Email system is production-ready with optimal performance.");
    recommendations.push("✅ All integration tests passed successfully.");
    recommendations.push("🚀 System is ready for deployment.");
  }
  
  return recommendations;
}
