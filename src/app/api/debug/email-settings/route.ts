import { NextRequest, NextResponse } from "next/server";
import { getMultipleSettingsFromDB } from "@/lib/settings-server";

/**
 * Debug endpoint to check email settings
 * GET /api/debug/email-settings
 */
export async function GET() {
  try {
    // Check all email-related settings using server-side function
    const settings = await getMultipleSettingsFromDB([
      'smtp_host',
      'smtp_port',
      'from_email',
      'smtp_password',
      'admin_email',
      'app_name'
    ], 1);

    // Mask password for security
    const debugSettings = {
      ...settings,
      smtp_password: settings.smtp_password ? '***CONFIGURED***' : null
    };

    return NextResponse.json({
      success: true,
      settings: debugSettings,
      status: {
        smtp_host: settings.smtp_host ? '✅ Configured' : '❌ Missing',
        smtp_port: settings.smtp_port ? '✅ Configured' : '❌ Missing', 
        from_email: settings.from_email ? '✅ Configured' : '❌ Missing',
        smtp_password: settings.smtp_password ? '✅ Configured' : '❌ Missing',
        admin_email: settings.admin_email ? '✅ Configured' : '❌ Missing',
        app_name: settings.app_name ? '✅ Configured' : '❌ Missing'
      }
    });

  } catch (error) {
    console.error('Debug email settings error:', error);
    return NextResponse.json(
      { 
        error: "Failed to fetch email settings", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
