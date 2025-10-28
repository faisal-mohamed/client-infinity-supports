import { NextRequest, NextResponse } from "next/server";
import { generateMultiplePDFBuffers } from "@/lib/pdf-buffer";

/**
 * Debug PDF attachments generation
 * POST /api/debug/pdf-attachments
 */
export async function POST(req: NextRequest) {
  try {
    const { completedForms } = await req.json();

    const testForms = completedForms || [
      { id: 1, formId: 1, title: "Test Form 1" },
      { id: 2, formId: 1, title: "Test Form 2" }
    ];

    console.log(`🔍 Debugging PDF attachments for ${testForms.length} forms`);

    // Generate PDF buffers
    const pdfResults = await generateMultiplePDFBuffers(testForms);

    // Analyze results
    const analysis = {
      totalForms: testForms.length,
      successfulPDFs: 0,
      failedPDFs: 0,
      totalSize: 0,
      details: [] as any[]
    };

    pdfResults.forEach((result, index) => {
      const detail = {
        formIndex: index,
        formTitle: testForms[index].title,
        success: result.success,
        filename: result.filename,
        bufferSize: result.buffer ? result.buffer.length : 0,
        error: result.error
      };

      if (result.success) {
        analysis.successfulPDFs++;
        analysis.totalSize += result.buffer?.length || 0;
      } else {
        analysis.failedPDFs++;
      }

      analysis.details.push(detail);
    });

    console.log(`📊 PDF Generation Analysis:`, analysis);

    // Test attachment creation
    const attachments = pdfResults
      .filter(result => result.success && result.buffer)
      .map(result => ({
        filename: result.filename,
        contentType: 'application/pdf',
        size: result.buffer!.length,
        hasContent: result.buffer!.length > 0
      }));

    return NextResponse.json({
      success: true,
      analysis,
      attachments: {
        count: attachments.length,
        totalSize: analysis.totalSize,
        details: attachments
      },
      recommendations: generateAttachmentRecommendations(analysis)
    });

  } catch (error) {
    console.error('❌ PDF attachment debug failed:', error);
    return NextResponse.json(
      { 
        error: "PDF attachment debug failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

function generateAttachmentRecommendations(analysis: any): string[] {
  const recommendations: string[] = [];

  if (analysis.failedPDFs > 0) {
    recommendations.push(`🔴 ${analysis.failedPDFs} PDF(s) failed to generate - check form submission data`);
  }

  if (analysis.totalSize === 0) {
    recommendations.push(`⚠️ All PDFs have 0 bytes - check PDF generation endpoint`);
  }

  if (analysis.totalSize > 25 * 1024 * 1024) {
    recommendations.push(`📎 Large total attachment size (${Math.round(analysis.totalSize / 1024 / 1024)}MB) - may cause email issues`);
  }

  if (analysis.successfulPDFs === 0) {
    recommendations.push(`❌ No successful PDFs generated - check form submission IDs and form data`);
  }

  if (recommendations.length === 0) {
    recommendations.push(`✅ PDF generation looks good - ${analysis.successfulPDFs} successful PDFs`);
  }

  return recommendations;
}
