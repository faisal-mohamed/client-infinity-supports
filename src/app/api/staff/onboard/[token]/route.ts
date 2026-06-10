import { NextRequest, NextResponse } from "next/server";
import { getStaffByToken, getStaffById, updateStaff, upsertStaffFormData, type StaffFormType } from "@/lib/db/staff";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb, TABLE } from "@/lib/dynamodb";

// GET /api/staff/onboard/[token] — Get staff data for onboarding portal
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) return NextResponse.json({ error: "Token is required" }, { status: 400 });

    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: "This link has expired" }, { status: 410 });
    }

    // Get staff form submissions
    const subsRes = await dynamodb.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: { ":pk": `STAFF#${staff.id}`, ":sk": "FORM_DATA#" },
    }));

    // Return submissions keyed by BOTH snake_case and camelCase (UI uses camelCase)
    const snakeToCamel: Record<string, string> = {
      'employment_details': 'employeeDetails',
      'employment_welcome_ack': 'employeeWelcome',
      'ndis_code_of_conduct': 'ndisCodeOfConduct',
      'ndis_workforce_capability': 'ndisWorkforceCapability',
      'bullying_harassment_training': 'bullyingHarassmentTraining',
      'bullying_training': 'bullyingTraining',
      'conflict_of_interest': 'conflictOfInterest',
      'documentation_acknowledgement': 'documentationAcknowledgement',
      'pre_employment_medical': 'preEmploymentMedical',
      'support_worker': 'supportWorker',
      'vehicle_safety_inspection': 'vehicleSafetyInspection',
    };

    const submissions: Record<string, any> = {};
    (subsRes.Items || []).forEach((item: any) => {
      const camelKey = snakeToCamel[item.formType] || item.formType;
      submissions[camelKey] = {
        ...item.data,
        staffSignature: item.staffSignature || null,
        staffSignedAt: item.staffSignedAt || null,
        adminSignature: item.adminSignature || null,
        adminSignedAt: item.adminSignedAt || null,
      };
      // Also add snake_case key for compatibility
      submissions[item.formType] = submissions[camelKey];
      // Add additional aliases for forms that have multiple naming conventions
      if (item.formType === 'employment_welcome_ack') {
        submissions['employee_welcome'] = submissions[camelKey];
      }
      if (item.formType === 'employment_details') {
        submissions['employee_details'] = submissions[camelKey];
      }
    });

    return NextResponse.json({
      staff: {
        id: staff.id,
        firstName: staff.firstName,
        surname: staff.surname,
        email: staff.email,
        phone: staff.phone || '',
        linkExpiresAt: staff.linkExpiresAt,
      },
      submissions,
    });
  } catch (error: any) {
    console.error("Error in staff onboard GET:", error);
    return NextResponse.json({ error: "Failed to load onboarding data" }, { status: 500 });
  }
}

// POST /api/staff/onboard/[token] — Save/submit form data
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const staff = await getStaffByToken(token);
    if (!staff) return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });

    if (staff.linkExpiresAt && new Date(staff.linkExpiresAt) < new Date()) {
      return NextResponse.json({ error: "This link has expired" }, { status: 410 });
    }

    const body = await req.json();
    const { formKey, data, submit } = body;

    if (!formKey) return NextResponse.json({ error: "formKey is required" }, { status: 400 });

    // Normalize formKey to our StaffFormType (handles camelCase, kebab-case, and aliases)
    const camelToSnake = (s: string) => s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
    const normalized = formKey.includes('-') ? formKey.replace(/-/g, '_') : camelToSnake(formKey);
    const formAliases: Record<string, string> = {
      'employee_details': 'employment_details',
      'employee_welcome': 'employment_welcome_ack',
      'employment_welcome': 'employment_welcome_ack',
    };
    const formType = (formAliases[normalized] || normalized) as StaffFormType;
    const now = new Date().toISOString();

    // Extract signature from form data (branch extracts from various fields)
    let signature = null;
    if (submit) {
      signature = data?.employeeSignature || data?.signature || data?.payeeSignature ||
        data?.sectionBSignature || data?.acknowledgmentData?.signature || null;
    }

    // Save form data
    const result = await upsertStaffFormData(staff.id, formType, {
      data: data || {},
      staffSignature: signature || undefined,
      staffSignedAt: signature ? now : undefined,
      status: submit ? 'submitted' : 'in_progress',
    });

    // Update common fields from form data if applicable
    if (data?.firstName || data?.surname || data?.email || data?.phone) {
      await updateStaff(staff.id, {
        commonFields: {
          ...staff.commonFields,
          firstName: data.firstName || staff.commonFields?.firstName,
          surname: data.surname || staff.commonFields?.surname,
          email: data.email || staff.commonFields?.email,
          phone: data.phone || staff.commonFields?.phone,
          address: data.address || staff.commonFields?.address,
        },
      });
    }

    // Create admin notification when form is submitted
    if (submit && signature) {
      try {
        const { createStaffNotification } = await import('@/lib/db/notifications');
        const { getAllAdmins } = await import('@/lib/db/admin');
        const admins = await getAllAdmins();
        for (const admin of admins) {
          await createStaffNotification({
            adminId: admin.id,
            staffId: staff.id,
            formSubmissionId: formType,
            staffName: `${staff.firstName} ${staff.surname}`,
            formTitle: formType.replace(/_/g, ' '),
          });
        }
      } catch (e) {
        console.error('Failed to create staff notification:', e);
      }
    }

    // Check if all forms are completed (batch completion)
    if (submit && signature) {
      try {
        const { QueryCommand } = await import('@aws-sdk/lib-dynamodb');
        const { dynamodb, TABLE } = await import('@/lib/dynamodb');
        const allForms = await dynamodb.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
          ExpressionAttributeValues: { ':pk': `STAFF#${staff.id}`, ':sk': 'FORM_DATA#' },
        }));
        const allSubmitted = (allForms.Items || []).every((item: any) => item.staffSignature);
        if (allSubmitted && (allForms.Items || []).length > 0) {
          // All forms signed — send completion email to admin
          try {
            const { sendEmail } = await import('@/lib/email');
            const { getAllAdmins } = await import('@/lib/db/admin');
            const admins = await getAllAdmins();
            if (admins.length > 0) {
              await sendEmail({
                to: admins[0].email,
                subject: `Staff Onboarding Complete — ${staff.firstName} ${staff.surname}`,
                adminId: admins[0].id,
                html: `<div style="font-family:Arial;max-width:600px;margin:0 auto"><div style="background:#002344;padding:24px;text-align:center"><h1 style="color:#cab741;margin:0">Staff Onboarding Complete</h1></div><div style="padding:32px 24px"><p><strong>${staff.firstName} ${staff.surname}</strong> has completed and signed all onboarding forms.</p><p style="color:#627d98">Please review and counter-sign their forms from the admin dashboard.</p></div></div>`,
              });
            }
          } catch (emailErr) {
            console.error('Batch completion email failed:', emailErr);
          }
        }
      } catch (e) {
        console.error('Batch completion check failed:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: submit ? "Form submitted successfully" : "Form saved successfully",
      submission: result,
    });
  } catch (error: any) {
    console.error("Error in staff onboard POST:", error);
    return NextResponse.json({ error: "Failed to save form data" }, { status: 500 });
  }
}
