

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = session?.user?.id ? parseInt(session.user.id) : null;

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    const defaultSettings = [
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
    sortOrder: 1,
  },
  {
    key: 'smtp_host',
    value: '',
    type: 'text',
    category: 'email_settings',
    label: 'SMTP Host',
    description: 'The SMTP server used to send emails (e.g., smtp.gmail.com)',
    isRequired: true,
    defaultValue: '',
    sortOrder: 2,
  },
  {
    key: 'smtp_port',
    value: '587',
    type: 'number',
    category: 'email_settings',
    label: 'SMTP Port',
    description: 'The port number used to connect to the SMTP server (e.g., 587 for TLS)',
    isRequired: true,
    defaultValue: '587',
    sortOrder: 3,
  },
  {
    key: 'smtp_password',
    value: '',
    type: 'password',
    category: 'email_settings',
    label: 'SMTP App Password',
    description: 'App password used to authenticate with the SMTP server',
    isRequired: true,
    defaultValue: '',
    sortOrder: 4,
  },
  {
    key: 'admin_email',
    value: '',
    type: 'email',
    category: 'email_settings',
    label: 'Admin Notification Email',
    description: 'Email address where system alerts or notifications will be sent',
    isRequired: true,
    defaultValue: '',
    sortOrder: 5,
  },

  // Form Metadata
  {
    key: 'company_website',
    value: '',
    type: 'url',
    category: 'form_metadata',
    label: 'Company Website',
    description: 'Company website URL that appears on forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 1,
  },
  {
    key: 'review_date',
    value: '',
    type: 'date',
    category: 'form_metadata',
    label: 'Review Date',
    description: 'Default review date for forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 2,
  },

  // Form IDs
  {
    key: 'client_intake_form_id',
    value: 'C001',
    type: 'text',
    category: 'form_ids',
    label: 'Client Intake Form ID',
    description: 'Unique identifier for client intake forms',
    isRequired: true,
    defaultValue: 'C001',
    sortOrder: 1,
  },
  {
    key: 'home_visit_form_id',
    value: 'HV001',
    type: 'text',
    category: 'form_ids',
    label: 'Home Visit Risk Assessment ID',
    description: 'Unique identifier for home visit risk assessment forms',
    isRequired: true,
    defaultValue: 'HV001',
    sortOrder: 2,
  },
  {
    key: 'person_centre_plan_form_id',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Person Centre Plan ID',
    description: 'Unique identifier for person centre plan forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 3,
  },
  {
    key: 'sa_delivery_of_supports',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'SA Delivery of Supports ID',
    description: 'Unique identifier for SA Delivery of Supports forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 4,
  },
  {
    key: 'participant_risk_assessment',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Participant Risk Assessment ID',
    description: 'Unique identifier for Participant Risk Assessment forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 5,
  },
  {
    key: 'emergency_drill',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Emergency Drill ID',
    description: 'Unique identifier for Emergency Drill forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 6,
  },
  {
    key: 'individual_risk_assessment',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Individual Risk Assessment ID',
    description: 'Unique identifier for Individual Risk Assessment forms',
    isRequired: true,
    defaultValue: '',
    sortOrder: 7,
  },
  {
    key: 'welcome_form',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Welcome Form ID',
    description: 'Unique identifier for Welcome form',
    isRequired: true,
    defaultValue: '',
    sortOrder: 8,
  },
  {
    key: 'multi_disciplinary_meeting',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Multi Disciplinary Meeting ID',
    description: 'Unique identifier for Multi Disciplinary Meeting form',
    isRequired: true,
    defaultValue: '',
    sortOrder: 9,
  },
  {
    key: 'support_action_plan',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Support Co-ordination Action Plan ID',
    description: 'Unique identifier for Support Co-ordination Action Plan form',
    isRequired: true,
    defaultValue: '',
    sortOrder: 10,
  },
  {
    key: 'schedule_of_supports',
    value: '',
    type: 'text',
    category: 'form_ids',
    label: 'Schedule of Supports Form ID',
    description: 'Unique identifier for Schedule of Supports form',
    isRequired: true,
    defaultValue: '',
    sortOrder: 11,
  },
];

    const upsertPromises = defaultSettings.map((setting : any ) =>
      prisma.appSettings.upsert({
        where: {
          key_adminId: {
            key: setting.key,
            adminId: adminId,
          },
        },
        update: {
          label: setting.label,
          description: setting.description,
          type: setting.type,
          category: setting.category,
          isRequired: setting.isRequired,
          defaultValue: setting.defaultValue,
          sortOrder: setting.sortOrder,
          isActive: true,
          updatedAt: new Date(),
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
          isActive: true,
          adminId: adminId,
        },
      })
    );

    const results = await prisma.$transaction(upsertPromises);

    return NextResponse.json({
      success: true,
      message: `Initialized ${results.length} admin-specific settings`,
      settings: results,
      categories: [...new Set(results.map((s: any) => s.category))],
    });
  } catch (error: any) {
    console.error("Error initializing settings:", error);
    return NextResponse.json(
      { error: "Failed to initialize settings", details: error.message },
      { status: 500 }
    );
  }
}
