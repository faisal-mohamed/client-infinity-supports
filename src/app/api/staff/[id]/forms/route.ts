import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const staffId = parseInt(id);
    
    const db: any = prisma as any;
    const staff = await db.staff.findUnique({
      where: { id: staffId },
      include: {
        // Generic form submissions
        submissions: true,
        // Individual form tables
        employmentDetails: true,
        employmentWelcomeAck: true,
        supportWorker: true,
        preEmploymentMedical: true,
        ndisWorkforceCapability: true,
        bullyingHarassmentTraining: true,
        bullyingTraining: true,
        ndisCodeOfConduct: true,
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Helper function to check if a generic form exists
    const getGenericFormStatus = (formKey: string) => {
      const submission = staff.submissions?.find((s: any) => s.formKey === formKey);
      return {
        exists: !!submission,
        completedAt: submission?.createdAt?.toLocaleDateString(),
        isSubmitted: submission?.isSubmitted
      };
    };

    // Helper to get form from generic table or dedicated table
    const getFormData = (formKey: string, dedicatedTable: any) => {
      // First check generic table
      const genericForm = staff.submissions?.find((s: any) => s.formKey === formKey);
      if (genericForm) return genericForm;
      // Fallback to dedicated table
      return dedicatedTable;
    };

    const forms = [
      // Forms with dedicated tables and view pages
      {
        formType: 'employment-details',
        formName: 'Employee Details',
        get status() {
          const form = getFormData('employeeDetails', staff.employmentDetails);
          return form?.staffSignature && form?.adminSignature 
            ? 'fully_completed' 
            : form?.staffSignature 
              ? 'awaiting_admin' 
              : form 
                ? 'in_progress' 
                : 'pending';
        },
        get completedAt() {
          const form = getFormData('employeeDetails', staff.employmentDetails);
          return form?.createdAt?.toLocaleDateString();
        },
        get hasSignature() {
          const form = getFormData('employeeDetails', staff.employmentDetails);
          return !!form?.staffSignature;
        },
        get hasAdminSignature() {
          const form = getFormData('employeeDetails', staff.employmentDetails);
          return !!form?.adminSignature;
        },
        hasViewPage: true,
        requiresAdmin: true
      },
      ...['employee_welcome', 'support_worker', 'pre_employment_medical', 'ndis_workforce_capability',
          'bullying_harassment_training', 'bullying_training', 'ndis_code_of_conduct'].map((formKey, idx) => {
        const formTypes = ['employment-welcome', 'support-worker', 'pre-employment-medical', 'ndis-workforce-capability',
                          'bullying-harassment-training', 
                          'bullying-training', 'ndis-code-of-conduct'];
        const formNames = ['Employee Welcome Pack', 'Position Description', 'Pre-Employment Medical', 'NDIS Workforce Capability Framework',
                          'Bullying & Harassment Training',
                          'Bullying Training', 'NDIS Code of Conduct'];
        const dedicatedTables = [staff.employmentWelcomeAck, staff.supportWorker, staff.preEmploymentMedical, staff.ndisWorkforceCapability,
                                staff.bullyingHarassmentTraining,
                                staff.bullyingTraining, staff.ndisCodeOfConduct];
        
        const form = getFormData(formKey, dedicatedTables[idx]);
        return {
          formType: formTypes[idx],
          formName: formNames[idx],
          status: form ? 'completed' : 'pending',
          completedAt: form?.createdAt?.toLocaleDateString(),
          hasSignature: !!form?.staffSignature,
          hasViewPage: true
        };
      }),
      // Generic forms stored in submissions table (no view pages yet)
      {
        formType: 'fair-work-information',
        formName: 'Fairwork Information Statements',
        status: getGenericFormStatus('fair_work_information').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('fair_work_information').completedAt,
        hasSignature: false,
        hasViewPage: true
      },
      {
        formType: 'orientation',
        formName: 'Staff Orientation',
        status: getGenericFormStatus('orientation').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('orientation').completedAt,
        hasSignature: false,
        hasViewPage: true
      },
      {
        formType: 'govt-tax',
        formName: 'TFN Declaration',
        status: getGenericFormStatus('govt_tax').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('govt_tax').completedAt,
        hasSignature: false,
        hasViewPage: true
      },
      {
        formType: 'super-choice-form',
        formName: 'Superannuation Standard Choice Form',
        status: getGenericFormStatus('super_choice_form').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('super_choice_form').completedAt,
        hasSignature: false,
        hasViewPage: true
      },
      {
        formType: 'vehicle-safety-inspection',
        formName: 'Vehicle Safety Inspection Checklist',
        status: getGenericFormStatus('vehicle_safety_inspection').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('vehicle_safety_inspection').completedAt,
        hasSignature: false,
        hasViewPage: true
      },
      {
        formType: 'conflict-of-interest',
        formName: 'Conflict of Interest Disclosure',
        get status() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'conflict_of_interest');
          if (!submission) return 'pending';
          const formData = submission.data || {};
          // Check if admin has signed (form is fully completed)
          if (formData.reviewerSignature && submission.isSubmitted) {
            return 'fully_completed';
          }
          // Check if staff has signed (waiting for admin)
          if (formData.employeeSignature) {
            return 'awaiting_admin';
          }
          // Form exists but not signed
          return 'in_progress';
        },
        get completedAt() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'conflict_of_interest');
          return submission?.createdAt?.toLocaleDateString();
        },
        get hasSignature() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'conflict_of_interest');
          const formData = submission?.data || {};
          return !!formData.employeeSignature;
        },
        get hasAdminSignature() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'conflict_of_interest');
          const formData = submission?.data || {};
          return !!formData.reviewerSignature;
        },
        hasViewPage: true,
        requiresAdmin: true
      },
      {
        formType: 'documentation-acknowledgement',
        formName: 'Documentation Acknowledgement',
        get status() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'documentation_acknowledgement');
          if (!submission) return 'pending';
          // Form is completed if staff has signed
          if (submission.staffSignature || submission.data?.signature) {
            return 'completed';
          }
          // Form exists but not signed
          return 'in_progress';
        },
        get completedAt() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'documentation_acknowledgement');
          return submission?.createdAt?.toLocaleDateString();
        },
        get hasSignature() {
          const submission = staff.submissions?.find((s: any) => s.formKey === 'documentation_acknowledgement');
          return !!(submission?.staffSignature || submission?.data?.signature);
        },
        hasViewPage: true,
        requiresAdmin: false
      }
    ];

    return NextResponse.json({ staff, forms });
  } catch (error: any) {
    console.error('Error fetching staff forms:', error);
    return NextResponse.json({ error: 'Failed to fetch staff forms' }, { status: 500 });
  }
}
