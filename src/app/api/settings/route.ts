import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSettingsByAdmin, getSettingByKey, upsertSetting, bulkUpsertSettings, copyGlobalSettingsToAdmin, getSettingsCount } from "@/lib/db/settings";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const queryAdminId = searchParams.get("adminId");
    let adminId: string | null = null;

    if (queryAdminId) {
      adminId = queryAdminId;
    } else if (session?.user?.id) {
      adminId = session.user.id;
    } else {
      adminId = "1";
    }

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized: Admin ID not found" },
        { status: 401 }
      );
    }

    const category = searchParams.get("category");
    const flat = searchParams.get("forms") === "true";

    // Check if admin has any settings, if not copy global defaults
    const adminSettingCount = await getSettingsCount(adminId);
    if (adminSettingCount === 0) {
      await copyGlobalSettingsToAdmin(adminId);
    }

    // Auto-sync missing settings from default list (only when called from UI)
    if (!queryAdminId && session?.user?.id) {
      const defaultSettings = [
        { key: 'from_email', type: 'email', category: 'email_settings', label: 'From Email Address', description: 'Email address used as sender for all outgoing emails', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'smtp_host', type: 'text', category: 'email_settings', label: 'SMTP Host', description: 'The SMTP server used to send emails (e.g., smtp.gmail.com)', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'smtp_port', type: 'number', category: 'email_settings', label: 'SMTP Port', description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)', isRequired: true, defaultValue: '587', sortOrder: 3 },
        { key: 'smtp_password', type: 'password', category: 'email_settings', label: 'SMTP App Password', description: 'App password used to authenticate with the SMTP server', isRequired: true, defaultValue: '', sortOrder: 4 },
        { key: 'admin_email', type: 'email', category: 'email_settings', label: 'Admin Notification Email', description: 'Email address where system alerts or notifications will be sent', isRequired: true, defaultValue: '', sortOrder: 5 },
        { key: 'company_website', type: 'url', category: 'form_metadata', label: 'Company Website', description: 'Company website URL that appears on forms', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'review_date', type: 'date', category: 'form_metadata', label: 'Review Date', description: 'Default review date for forms', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'client_intake_form_id', type: 'text', category: 'form_ids', label: 'Client Intake Form ID', description: 'Unique identifier for client intake forms', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'home_visit_form_id', type: 'text', category: 'form_ids', label: 'Home Visit Risk Assessment ID', description: 'Unique identifier for home visit risk assessment forms', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'person_centre_plan_form_id', type: 'text', category: 'form_ids', label: 'Person Centre Plan ID', description: 'Unique identifier for person centre plan forms', isRequired: true, defaultValue: '', sortOrder: 3 },
        { key: 'sa_delivery_of_supports', type: 'text', category: 'form_ids', label: 'SA Delivery of Supports ID', description: 'Unique identifier for SA Delivery of Supports forms', isRequired: true, defaultValue: '', sortOrder: 4 },
        { key: 'participant_risk_assessment', type: 'text', category: 'form_ids', label: 'Participant Risk Assessment ID', description: 'Unique identifier for Participant Risk Assessment forms', isRequired: true, defaultValue: '', sortOrder: 5 },
        { key: 'emergency_drill', type: 'text', category: 'form_ids', label: 'Emergency Drill ID', description: 'Unique identifier for Emergency Drill forms', isRequired: true, defaultValue: '', sortOrder: 6 },
        { key: 'individual_risk_assessment', type: 'text', category: 'form_ids', label: 'Individual Activity Risk Assessment ID', description: 'Unique identifier for Individual Activity Risk Assessment forms', isRequired: true, defaultValue: '', sortOrder: 7 },
        { key: 'welcome_form', type: 'text', category: 'form_ids', label: 'Welcome Form ID', description: 'Unique identifier for Welcome form', isRequired: true, defaultValue: '', sortOrder: 8 },
        { key: 'multi_disciplinary_meeting', type: 'text', category: 'form_ids', label: 'Multi Disciplinary Meeting ID', description: 'Unique identifier for Multi Disciplinary Meeting form', isRequired: true, defaultValue: '', sortOrder: 9 },
        { key: 'support_action_plan', type: 'text', category: 'form_ids', label: 'Support Co-ordination Action Plan ID', description: 'Unique identifier for Support Co-ordination Action Plan form', isRequired: true, defaultValue: '', sortOrder: 10 },
        { key: 'schedule_of_supports', type: 'text', category: 'form_ids', label: 'Schedule of Supports Form ID', description: 'Unique identifier for Schedule of Supports form', isRequired: true, defaultValue: '', sortOrder: 11 },
        { key: 'sa_support_coordination', type: 'text', category: 'form_ids', label: 'Service Agreement Support Co-Ordination ID', description: 'Unique identifier for Service Agreement Support Co-Ordination forms', isRequired: true, defaultValue: '', sortOrder: 12 },
      ];

      // Get existing settings and find missing ones
      const existingSettings = await getSettingsByAdmin(adminId);
      const existingKeys = new Set(existingSettings.map((s: any) => s.key));
      const missingSettings = defaultSettings.filter(s => !existingKeys.has(s.key));

      if (missingSettings.length > 0) {
        const settingsToAdd = missingSettings.map((setting: any) => ({
          key: setting.key,
          value: setting.defaultValue ?? '',
          type: setting.type,
          category: setting.category,
          label: setting.label,
          description: setting.description,
          isRequired: setting.isRequired,
          defaultValue: setting.defaultValue,
          sortOrder: setting.sortOrder,
          isActive: true,
          adminId,
        }));
        await bulkUpsertSettings(adminId, settingsToAdd);
      }

      // Ensure sa_support_coordination exists and is up-to-date
      const saSetting = defaultSettings.find(s => s.key === 'sa_support_coordination')!;
      const existingSA = await getSettingByKey('sa_support_coordination', adminId);
      if (!existingSA) {
        await upsertSetting(adminId, {
          key: 'sa_support_coordination',
          value: saSetting.defaultValue ?? '',
          type: saSetting.type,
          category: saSetting.category,
          label: saSetting.label,
          description: saSetting.description,
          isRequired: saSetting.isRequired,
          defaultValue: saSetting.defaultValue,
          sortOrder: saSetting.sortOrder,
          isActive: true,
        });
      } else if (existingSA.label !== saSetting.label || existingSA.description !== saSetting.description || existingSA.sortOrder !== saSetting.sortOrder || existingSA.isActive !== true) {
        await upsertSetting(adminId, {
          key: 'sa_support_coordination',
          value: existingSA.value,
          type: saSetting.type,
          category: saSetting.category,
          label: saSetting.label,
          description: saSetting.description,
          isRequired: saSetting.isRequired,
          defaultValue: saSetting.defaultValue,
          sortOrder: saSetting.sortOrder,
          isActive: true,
        });
      }
    }

    // Fetch settings for this admin
    const settings = await getSettingsByAdmin(adminId, category || undefined);

    if (flat) {
      const flatSettings: Record<string, any> = {};
      // Process legacy categories first, then proper ones override
      const sorted = [...settings].sort((a: any, b: any) => {
        const legacy = ['general', 'email'];
        const aLegacy = legacy.includes(a.category) ? 0 : 1;
        const bLegacy = legacy.includes(b.category) ? 0 : 1;
        return aLegacy - bLegacy;
      });
      sorted.forEach((s: any) => {
        if (!flatSettings[s.key] || !['general', 'email'].includes(s.category)) {
          if (s.value) flatSettings[s.key] = s.value;
        }
      });

      return NextResponse.json({
        success: true,
        settings: flatSettings,
        total: settings.length,
      });
    }

    const groupedSettings = settings.reduce((acc: any, setting: any) => {
      // Skip legacy categories - proper settings are in email_settings, form_ids, form_metadata
      if (setting.category === 'general' || setting.category === 'email') return acc;
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      settings: groupedSettings,
      total: settings.length,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || null;

    const body = await req.json();
    const { key, value, type, category, label, description, isRequired, defaultValue, validation, sortOrder } = body;

    if (!key || !type || !category || !label) {
      return NextResponse.json(
        { error: "Missing required fields: key, type, category, label" },
        { status: 400 }
      );
    }

    const existingSetting = await getSettingByKey(key, adminId!);
    if (existingSetting) {
      return NextResponse.json(
        { error: "Setting with this key already exists for this admin" },
        { status: 409 }
      );
    }

    const newSetting = await upsertSetting(adminId!, {
      key,
      value: value || defaultValue,
      type,
      category,
      label,
      description,
      isRequired: isRequired || false,
      defaultValue,
      validation,
      sortOrder: sortOrder || 0,
    });

    return NextResponse.json({
      success: true,
      setting: newSetting,
      message: "Setting created successfully",
    });

  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json(
      { error: "Failed to create setting" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id || null;

    const body = await req.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Settings must be an array" },
        { status: 400 }
      );
    }

    const settingsToUpsert = settings.map((setting: any) => {
      if (!setting.key) throw new Error("Setting key is required");
      return {
        key: setting.key,
        value: setting.value,
      };
    });

    const updatedSettings = await bulkUpsertSettings(adminId!, settingsToUpsert);

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: `${updatedSettings.length} settings updated successfully`,
    });

  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
