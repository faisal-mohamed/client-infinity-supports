

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Fetch settings (admin-specific or global)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    
    // Allow adminId to be passed as query parameter for server-side calls (e.g., PDF generation)
    const queryAdminId = searchParams.get("adminId");
    let adminId: number | null = null;
    
    if (queryAdminId) {
      adminId = parseInt(queryAdminId);
      console.log(`📋 [Settings API] Using adminId from query param: ${adminId}`);
    } else if (session?.user?.id) {
      adminId = parseInt(session.user.id);
      console.log(`📋 [Settings API] Using adminId from session: ${adminId}`);
    } else {
      // Fallback to default adminId for backward compatibility
      adminId = 1;
      console.log(`📋 [Settings API] Using default adminId: ${adminId}`);
    }

    console.log(`🔍 [SETTINGS DEBUG] Starting GET request with adminId: ${adminId}, queryAdminId: ${queryAdminId}, sessionUserId: ${session?.user?.id}`);

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized: Admin ID not found" },
        { status: 401 }
      );
    }

    const category = searchParams.get("category");
    const flat = searchParams.get("forms") === "true";

    // Step 1: Check if admin has any settings
    const adminSettingCount = await prisma.appSettings.count({
      where: { adminId },
    });

    // Step 2: If not, copy global (adminId: null) settings for this admin
    if (adminSettingCount === 0) {
      const globalSettings = await prisma.appSettings.findMany({
        where: { adminId: null },
      });

      const copiedSettings = globalSettings.map((setting: any) => ({
        key: setting.key,
        value: setting.defaultValue ?? '',
        type: setting.type,
        category: setting.category,
        label: setting.label,
        description: setting.description,
        isRequired: setting.isRequired,
        defaultValue: setting.defaultValue,
        validation: setting.validation,
        sortOrder: setting.sortOrder,
        isActive: setting.isActive,
        adminId: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      if (copiedSettings.length > 0) {
        await prisma.appSettings.createMany({ data: copiedSettings });
      }
    }

    // Step 2.5: Auto-sync missing settings from default list (only when called from UI, not server-side)
    if (!queryAdminId && session?.user?.id) {
      // Import default settings from initialize route
      const defaultSettings = [
        // Client Email Settings
        { key: 'client_from_email', type: 'email', category: 'client_email_settings', label: 'From Email Address', description: 'Email address used as sender for all client-related outgoing emails', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'client_smtp_host', type: 'text', category: 'client_email_settings', label: 'SMTP Host', description: 'The SMTP server used to send client-related emails (e.g., smtp.gmail.com)', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'client_smtp_port', type: 'number', category: 'client_email_settings', label: 'SMTP Port', description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)', isRequired: true, defaultValue: '587', sortOrder: 3 },
        { key: 'client_smtp_password', type: 'password', category: 'client_email_settings', label: 'SMTP App Password', description: 'App password used to authenticate with the SMTP server for client emails', isRequired: true, defaultValue: '', sortOrder: 4 },
        { key: 'client_admin_email', type: 'email', category: 'client_email_settings', label: 'Admin Notification Email', description: 'Email address where client-related system alerts or notifications will be sent', isRequired: true, defaultValue: '', sortOrder: 5 },
        // Client Form Metadata
        { key: 'client_company_website', type: 'url', category: 'client_form_metadata', label: 'Company Website', description: 'Company website URL that appears on client forms', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'client_review_date', type: 'date', category: 'client_form_metadata', label: 'Review Date', description: 'Default review date for client forms', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'client_intake_form_id', type: 'text', category: 'form_ids', label: 'Client Intake Form ID', description: 'Unique identifier for client intake forms', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'home_visit_form_id', type: 'text', category: 'form_ids', label: 'Home Visit Risk Assessment ID', description: 'Unique identifier for home visit risk assessment forms', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'person_centre_plan_form_id', type: 'text', category: 'form_ids', label: 'Person Centre Plan ID', description: 'Unique identifier for person centre plan forms', isRequired: true, defaultValue: '', sortOrder: 3 },
        { key: 'sa_delivery_of_supports', type: 'text', category: 'form_ids', label: 'SA Delivery of Supports ID', description: 'Unique identifier for SA Delivery of Supports forms', isRequired: true, defaultValue: '', sortOrder: 4 },
        { key: 'participant_risk_assessment', type: 'text', category: 'form_ids', label: 'Participant Risk Assessment ID', description: 'Unique identifier for Participant Risk Assessment forms', isRequired: true, defaultValue: '', sortOrder: 5 },
        { key: 'emergency_drill', type: 'text', category: 'form_ids', label: 'Emergency Drill ID', description: 'Unique identifier for Emergency Drill forms', isRequired: true, defaultValue: '', sortOrder: 6 },
        { key: 'individual_risk_assessment', type: 'text', category: 'form_ids', label: 'Individual Risk Assessment ID', description: 'Unique identifier for Individual Risk Assessment forms', isRequired: true, defaultValue: '', sortOrder: 7 },
        { key: 'welcome_form', type: 'text', category: 'form_ids', label: 'Welcome Form ID', description: 'Unique identifier for Welcome form', isRequired: true, defaultValue: '', sortOrder: 8 },
        { key: 'multi_disciplinary_meeting', type: 'text', category: 'form_ids', label: 'Multi Disciplinary Meeting ID', description: 'Unique identifier for Multi Disciplinary Meeting form', isRequired: true, defaultValue: '', sortOrder: 9 },
        { key: 'support_action_plan', type: 'text', category: 'form_ids', label: 'Support Co-ordination Action Plan ID', description: 'Unique identifier for Support Co-ordination Action Plan form', isRequired: true, defaultValue: '', sortOrder: 10 },
        { key: 'schedule_of_supports', type: 'text', category: 'form_ids', label: 'Schedule of Supports Form ID', description: 'Unique identifier for Schedule of Supports form', isRequired: true, defaultValue: '', sortOrder: 11 },
        { key: 'sa_support_coordination', type: 'text', category: 'form_ids', label: 'Service Agreement Support Co-Ordination ID', description: 'Unique identifier for Service Agreement Support Co-Ordination forms', isRequired: true, defaultValue: '', sortOrder: 12 },
        // Staff Form IDs
        { key: 'employee_details_form_id', type: 'text', category: 'staff_form_ids', label: 'Employee Details Form ID', description: 'Unique identifier for Employee Details forms', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'employee_welcome_form_id', type: 'text', category: 'staff_form_ids', label: 'Employee Welcome Pack Form ID', description: 'Unique identifier for Employee Welcome Pack forms', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'support_worker_form_id', type: 'text', category: 'staff_form_ids', label: 'Position Description Form ID', description: 'Unique identifier for Position Description forms', isRequired: true, defaultValue: '', sortOrder: 3 },
        { key: 'pre_employment_medical_form_id', type: 'text', category: 'staff_form_ids', label: 'Pre-Employment Medical Form ID', description: 'Unique identifier for Pre-Employment Medical forms', isRequired: true, defaultValue: '', sortOrder: 4 },
        { key: 'bullying_harassment_training_form_id', type: 'text', category: 'staff_form_ids', label: 'Bullying and Harassment Training Form ID', description: 'Unique identifier for Bullying and Harassment Training forms', isRequired: true, defaultValue: '', sortOrder: 5 },
        { key: 'bullying_training_form_id', type: 'text', category: 'staff_form_ids', label: 'Bullying Training Form ID', description: 'Unique identifier for Bullying Training forms', isRequired: true, defaultValue: '', sortOrder: 6 },
        { key: 'ndis_code_of_conduct_form_id', type: 'text', category: 'staff_form_ids', label: 'NDIS Code of Conduct Form ID', description: 'Unique identifier for NDIS Code of Conduct forms', isRequired: true, defaultValue: '', sortOrder: 7 },
        { key: 'fair_work_information_form_id', type: 'text', category: 'staff_form_ids', label: 'Fairwork Information Statements Form ID', description: 'Unique identifier for Fairwork Information Statements forms', isRequired: true, defaultValue: '', sortOrder: 8 },
        { key: 'orientation_form_id', type: 'text', category: 'staff_form_ids', label: 'Staff Orientation Form ID', description: 'Unique identifier for Staff Orientation forms', isRequired: true, defaultValue: '', sortOrder: 9 },
        { key: 'conflict_of_interest_form_id', type: 'text', category: 'staff_form_ids', label: 'Conflict of Interest Form ID', description: 'Unique identifier for Conflict of Interest forms', isRequired: true, defaultValue: '', sortOrder: 10 },
        { key: 'documentation_acknowledgement_form_id', type: 'text', category: 'staff_form_ids', label: 'Documentation Acknowledgement Form ID', description: 'Unique identifier for Documentation Acknowledgement forms', isRequired: true, defaultValue: '', sortOrder: 11 },
        { key: 'vehicle_safety_inspection_form_id', type: 'text', category: 'staff_form_ids', label: 'Vehicle Safety Inspection Form ID', description: 'Unique identifier for Vehicle Safety Inspection forms', isRequired: true, defaultValue: '', sortOrder: 12 },
        // Staff Email Settings
        { key: 'staff_from_email', type: 'email', category: 'staff_email_settings', label: 'From Email Address', description: 'Email address used as sender for all staff-related outgoing emails', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'staff_smtp_host', type: 'text', category: 'staff_email_settings', label: 'SMTP Host', description: 'The SMTP server used to send staff-related emails (e.g., smtp.gmail.com)', isRequired: true, defaultValue: '', sortOrder: 2 },
        { key: 'staff_smtp_port', type: 'number', category: 'staff_email_settings', label: 'SMTP Port', description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)', isRequired: true, defaultValue: '587', sortOrder: 3 },
        { key: 'staff_smtp_password', type: 'password', category: 'staff_email_settings', label: 'SMTP App Password', description: 'App password used to authenticate with the SMTP server for staff emails', isRequired: true, defaultValue: '', sortOrder: 4 },
        { key: 'staff_admin_email', type: 'email', category: 'staff_email_settings', label: 'Admin Notification Email', description: 'Email address where staff-related system alerts or notifications will be sent', isRequired: true, defaultValue: '', sortOrder: 5 },
        // Staff Form Metadata
        { key: 'staff_company_website', type: 'url', category: 'staff_form_metadata', label: 'Company Website', description: 'Company website URL that appears on staff forms', isRequired: true, defaultValue: '', sortOrder: 1 },
        { key: 'staff_review_date', type: 'date', category: 'staff_form_metadata', label: 'Review Date', description: 'Default review date for staff forms', isRequired: true, defaultValue: '', sortOrder: 2 },
      ];

      // Get existing setting keys for this admin
      const existingSettings = await prisma.appSettings.findMany({
        where: { adminId },
        select: { key: true },
      });
      const existingKeys = new Set(existingSettings.map(s => s.key));

      // Find missing settings
      const missingSettings = defaultSettings.filter(s => !existingKeys.has(s.key));

      // Add missing settings
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
          adminId: adminId,
        }));

        await prisma.appSettings.createMany({ data: settingsToAdd });
        console.log(`✅ Auto-added ${missingSettings.length} missing settings: ${missingSettings.map(s => s.key).join(', ')}`);
      }

      // Special check: Ensure sa_support_coordination setting exists and is up-to-date
      const saSupportCoordinationSetting = defaultSettings.find(s => s.key === 'sa_support_coordination');
      console.log(`🔍 [SETTINGS DEBUG] Looking for sa_support_coordination in defaultSettings:`, saSupportCoordinationSetting ? 'FOUND' : 'NOT FOUND');
      
      if (saSupportCoordinationSetting) {
        const existingSASetting = await prisma.appSettings.findFirst({
          where: {
            key: 'sa_support_coordination',
            adminId: adminId,
          },
        });

        console.log(`🔍 [SETTINGS DEBUG] Existing sa_support_coordination setting:`, existingSASetting ? {
          id: existingSASetting.id,
          key: existingSASetting.key,
          label: existingSASetting.label,
          isActive: existingSASetting.isActive,
          adminId: existingSASetting.adminId,
        } : 'NOT FOUND');

        if (!existingSASetting) {
          // Create if it doesn't exist
          const created = await prisma.appSettings.create({
            data: {
              key: 'sa_support_coordination',
              value: saSupportCoordinationSetting.defaultValue ?? '',
              type: saSupportCoordinationSetting.type,
              category: saSupportCoordinationSetting.category,
              label: saSupportCoordinationSetting.label,
              description: saSupportCoordinationSetting.description,
              isRequired: saSupportCoordinationSetting.isRequired,
              defaultValue: saSupportCoordinationSetting.defaultValue,
              sortOrder: saSupportCoordinationSetting.sortOrder,
              isActive: true,
              adminId: adminId,
            },
          });
          console.log(`✅ [SETTINGS DEBUG] Created missing sa_support_coordination setting:`, {
            id: created.id,
            key: created.key,
            label: created.label,
            isActive: created.isActive,
            adminId: created.adminId,
          });
        } else if (existingSASetting.label !== saSupportCoordinationSetting.label || 
                   existingSASetting.description !== saSupportCoordinationSetting.description ||
                   existingSASetting.sortOrder !== saSupportCoordinationSetting.sortOrder ||
                   existingSASetting.isActive !== true) {
          // Update if label, description, sortOrder, or isActive changed
          const updated = await prisma.appSettings.update({
            where: { id: existingSASetting.id },
            data: {
              label: saSupportCoordinationSetting.label,
              description: saSupportCoordinationSetting.description,
              sortOrder: saSupportCoordinationSetting.sortOrder,
              isActive: true,
            },
          });
          console.log(`✅ [SETTINGS DEBUG] Updated sa_support_coordination setting:`, {
            id: updated.id,
            key: updated.key,
            label: updated.label,
            isActive: updated.isActive,
            adminId: updated.adminId,
          });
        } else {
          console.log(`ℹ️ [SETTINGS DEBUG] sa_support_coordination setting already up-to-date`);
        }
      }
    }

    // Step 3: Build the filter for current admin settings
    const whereClause: any = {
      isActive: true,
      adminId: adminId,
    };

    if (category) {
      whereClause.category = category;
    }

    console.log(`🔍 [SETTINGS DEBUG] Fetching settings with whereClause:`, JSON.stringify(whereClause, null, 2));

    const settings = await prisma.appSettings.findMany({
      where: whereClause,
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { label: "asc" },
      ],
    });

    console.log(`🔍 [SETTINGS DEBUG] Total settings found: ${settings.length}`);
    const saSetting = settings.find(s => s.key === 'sa_support_coordination');
    console.log(`🔍 [SETTINGS DEBUG] sa_support_coordination in results:`, saSetting ? {
      id: saSetting.id,
      key: saSetting.key,
      label: saSetting.label,
      category: saSetting.category,
      isActive: saSetting.isActive,
      sortOrder: saSetting.sortOrder,
    } : 'NOT FOUND');
    
    const formIdsSettings = settings.filter(s => s.category === 'form_ids');
    console.log(`🔍 [SETTINGS DEBUG] Form IDs settings count: ${formIdsSettings.length}`);
    console.log(`🔍 [SETTINGS DEBUG] Form IDs keys:`, formIdsSettings.map(s => s.key).join(', '));

    if (flat) {
      const flatSettings: Record<string, any> = {};
      settings.forEach((s: any) => {
        flatSettings[s.key] = s.value;
      });

      return NextResponse.json({
        success: true,
        settings: flatSettings,
        total: settings.length,
      });
    }

    const groupedSettings = settings.reduce((acc: any, setting: any) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, typeof settings>);

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


// POST - Create new setting
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id ? parseInt(session.user.id) : null;

    const body = await req.json();
    const {
      key,
      value,
      type,
      category,
      label,
      description,
      isRequired,
      defaultValue,
      validation,
      sortOrder
    } = body;

    if (!key || !type || !category || !label) {
      return NextResponse.json(
        { error: "Missing required fields: key, type, category, label" },
        { status: 400 }
      );
    }

    // Check for uniqueness of key + adminId
    const existingSetting = await prisma.appSettings.findFirst({
      where: {
        key,
        adminId: adminId,
      },
    });

    if (existingSetting) {
      return NextResponse.json(
        { error: "Setting with this key already exists for this admin" },
        { status: 409 }
      );
    }

    const newSetting = await prisma.appSettings.create({
      data: {
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
        adminId: adminId,
      },
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

// PUT - Update multiple settings
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminId : any = session?.user?.id ? parseInt(session.user.id) : null;

    const body = await req.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Settings must be an array" },
        { status: 400 }
      );
    }

    const updatePromises = settings.map((setting: any) => {
      const { key, value } = setting;

      if (!key) {
        throw new Error("Setting key is required");
      }

      return prisma.appSettings.upsert({
        where: {
          key_adminId: {
            key,
            adminId: adminId,
          },
        },
        update: {
          value,
          updatedAt: new Date(),
        },
        create: {
          key,
          value,
          type: setting.type || 'string',
          category: setting.category || 'general',
          label: setting.label || key,
          description: setting.description,
          isRequired: setting.isRequired || false,
          defaultValue: setting.defaultValue,
          validation: setting.validation,
          sortOrder: setting.sortOrder || 0,
          adminId: adminId,
        },
      });
    });

    const updatedSettings = await prisma.$transaction(updatePromises);

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
