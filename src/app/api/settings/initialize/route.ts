import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Define all default settings
    const defaultSettings = [
      // Form Metadata Settings
      {
        key: 'company_website',
        value: '',
        type: 'url',
        category: 'form_metadata',
        label: 'Company Website',
        description: 'Company website URL that appears on forms',
        isRequired: true,
        defaultValue: '',
        sortOrder: 1
      },
      {
        key: 'review_date',
        value: new Date().toISOString().split('T')[0],
        type: 'date',
        category: 'form_metadata',
        label: 'Review Date',
        description: 'Default review date for forms',
        isRequired: true,
        defaultValue: new Date().toISOString().split('T')[0],
        sortOrder: 2
      },
      
      // Email Settings
      {
        key: 'from_email',
        value: '',
        type: 'email',
        category: 'email_settings',
        label: 'From Email Address',
        description: 'Email address used as sender for all outgoing emails',
        isRequired: true,
        defaultValue: '',
        sortOrder: 1
      },
      {
        key: 'email_app_id',
        value: '',
        type: 'password',
        category: 'email_settings',
        label: 'Email Service App ID',
        description: 'Secret App ID or API key for email service integration (e.g., SendGrid, Mailgun, AWS SES)',
        isRequired: true,
        defaultValue: '',
        sortOrder: 2
      },
      
      // Form IDs
      {
        key: 'client_intake_form_id',
        value: 'C001',
        type: 'text',
        category: 'form_ids',
        label: 'Client Intake Form ID',
        description: 'ID assigned to client intake form',
        isRequired: true,
        defaultValue: 'C001',
        sortOrder: 1
      },
      {
        key: 'home_visit_form_id',
        value: 'HV001',
        type: 'text',
        category: 'form_ids',
        label: 'Home Visit Form ID',
        description: 'ID assigned to home visit risk assessment form',
        isRequired: true,
        defaultValue: 'HV001',
        sortOrder: 2
      }
    ];

    // Use upsert to create or update settings
    const upsertPromises = defaultSettings.map((setting) =>
      prisma.appSettings.upsert({
        where: { key: setting.key },
        update: {
          // Only update metadata, not values if they already exist
          label: setting.label,
          description: setting.description,
          type: setting.type,
          category: setting.category,
          isRequired: setting.isRequired,
          defaultValue: setting.defaultValue,
          sortOrder: setting.sortOrder,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type,
          category: setting.category,
          label: setting.label,
          description: setting.description,
          isRequired: setting.isRequired,
          defaultValue: setting.defaultValue,
          sortOrder: setting.sortOrder,
          isActive: true
        }
      })
    );

    const results = await prisma.$transaction(upsertPromises);

    return NextResponse.json({
      success: true,
      message: `Initialized ${results.length} settings`,
      settings: results,
      categories: [...new Set(results.map(s => s.category))]
    });

  } catch (error : any ) {
    console.error("Error initializing settings:", error);
    return NextResponse.json(
      { error: "Failed to initialize settings", details: error.message },
      { status: 500 }
    );
  }
}
