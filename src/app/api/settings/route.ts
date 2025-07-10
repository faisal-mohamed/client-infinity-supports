import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all settings or settings by category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const whereClause = category ? { category, isActive: true } : { isActive: true };

    const settings = await prisma.appSettings.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { label: 'asc' }
      ]
    });

    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, typeof settings>);

    return NextResponse.json({
      success: true,
      settings: groupedSettings,
      total: settings.length
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

    // Validate required fields
    if (!key || !type || !category || !label) {
      return NextResponse.json(
        { error: "Missing required fields: key, type, category, label" },
        { status: 400 }
      );
    }

    // Check if key already exists
    const existingSetting = await prisma.appSettings.findUnique({
      where: { key }
    });

    if (existingSetting) {
      return NextResponse.json(
        { error: "Setting with this key already exists" },
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
        sortOrder: sortOrder || 0
      }
    });

    return NextResponse.json({
      success: true,
      setting: newSetting,
      message: "Setting created successfully"
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
    const body = await req.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Settings must be an array" },
        { status: 400 }
      );
    }

    // Update settings in a transaction
    const updatePromises = settings.map((setting: any) => {
      const { key, value } = setting;
      
      if (!key) {
        throw new Error("Setting key is required");
      }

      return prisma.appSettings.upsert({
        where: { key },
        update: { 
          value,
          updatedAt: new Date()
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
          sortOrder: setting.sortOrder || 0
        }
      });
    });

    const updatedSettings = await prisma.$transaction(updatePromises);

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: `${updatedSettings.length} settings updated successfully`
    });

  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
