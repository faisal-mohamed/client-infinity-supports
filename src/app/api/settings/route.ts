

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Fetch settings (admin-specific or global)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id ? parseInt(session.user.id) : 1;

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session not found" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
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

    // Step 3: Build the filter for current admin settings
    const whereClause: any = {
      isActive: true,
      adminId: adminId,
    };

    if (category) {
      whereClause.category = category;
    }

    const settings = await prisma.appSettings.findMany({
      where: whereClause,
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { label: "asc" },
      ],
    });

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
