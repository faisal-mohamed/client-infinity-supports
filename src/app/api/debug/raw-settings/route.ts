import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Debug endpoint to check raw settings in database
 * GET /api/debug/raw-settings
 */
export async function GET() {
  try {
    // Get all settings from database
    const allSettings = await prisma.appSettings.findMany({
      select: {
        key: true,
        value: true,
        category: true,
        isActive: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    // Filter email-related settings
    const emailSettings = allSettings.filter(setting => 
      setting.key.includes('smtp') || 
      setting.key.includes('email') || 
      setting.key.includes('app_name')
    );

    return NextResponse.json({
      success: true,
      totalSettings: allSettings.length,
      emailSettings: emailSettings,
      allSettingsKeys: allSettings.map(s => s.key),
      emailSettingsKeys: emailSettings.map(s => s.key)
    });

  } catch (error) {
    console.error('Raw settings debug error:', error);
    return NextResponse.json(
      { 
        error: "Failed to fetch raw settings", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
