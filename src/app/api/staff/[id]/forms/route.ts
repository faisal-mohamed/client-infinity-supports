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

    const forms = [
      // Forms with dedicated tables and view pages
      {
        formType: 'employment-details',
        formName: 'Employee Details',
        status: staff.employmentDetails?.staffSignature && staff.employmentDetails?.adminSignature 
          ? 'fully_completed' 
          : staff.employmentDetails?.staffSignature 
            ? 'awaiting_admin' 
            : staff.employmentDetails 
              ? 'in_progress' 
              : 'pending',
        completedAt: staff.employmentDetails?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.employmentDetails?.staffSignature,
        hasAdminSignature: !!staff.employmentDetails?.adminSignature,
        hasViewPage: true,
        requiresAdmin: true
      },
      {
        formType: 'employment-welcome',
        formName: 'Employee Welcome',
        status: staff.employmentWelcomeAck ? 'completed' : 'pending',
        completedAt: staff.employmentWelcomeAck?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.employmentWelcomeAck?.staffSignature,
        hasViewPage: true
      },
      {
        formType: 'support-worker',
        formName: 'Support Worker',
        status: staff.supportWorker ? 'completed' : 'pending',
        completedAt: staff.supportWorker?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.supportWorker?.staffSignature,
        hasViewPage: true
      },
      {
        formType: 'pre-employment-medical',
        formName: 'Pre-Employment Medical',
        status: staff.preEmploymentMedical ? 'completed' : 'pending',
        completedAt: staff.preEmploymentMedical?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.preEmploymentMedical?.staffSignature,
        hasViewPage: true
      },
      {
        formType: 'ndis-workforce-capability',
        formName: 'NDIS Workforce Capability',
        status: staff.ndisWorkforceCapability ? 'completed' : 'pending',
        completedAt: staff.ndisWorkforceCapability?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.ndisWorkforceCapability?.staffSignature,
        hasViewPage: true
      },
      {
        formType: 'bullying-harassment-training',
        formName: 'Bullying & Harassment Training',
        status: staff.bullyingHarassmentTraining ? 'completed' : 'pending',
        completedAt: staff.bullyingHarassmentTraining?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.bullyingHarassmentTraining?.staffSignature,
        hasViewPage: true
      },
      {
        formType: 'bullying-training',
        formName: 'Bullying Training',
        status: staff.bullyingTraining ? 'completed' : 'pending',
        completedAt: staff.bullyingTraining?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.bullyingTraining?.staffSignature,
        hasViewPage: true
      },
      {
        formType: 'ndis-code-of-conduct',
        formName: 'NDIS Code of Conduct',
        status: staff.ndisCodeOfConduct ? 'completed' : 'pending',
        completedAt: staff.ndisCodeOfConduct?.createdAt?.toLocaleDateString(),
        hasSignature: !!staff.ndisCodeOfConduct?.staffSignature,
        hasViewPage: true
      },
      // Generic forms stored in submissions table (no view pages yet)
      {
        formType: 'fair-work-information',
        formName: 'Fair Work Information Statement',
        status: getGenericFormStatus('fair_work_information').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('fair_work_information').completedAt,
        hasSignature: false,
        hasViewPage: false
      },
      {
        formType: 'casual-employment-information',
        formName: 'Casual Employment Information Statement',
        status: getGenericFormStatus('casual_employment_information').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('casual_employment_information').completedAt,
        hasSignature: false,
        hasViewPage: false
      },
      {
        formType: 'orientation',
        formName: 'Staff Orientation',
        status: getGenericFormStatus('orientation').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('orientation').completedAt,
        hasSignature: false,
        hasViewPage: false
      },
      {
        formType: 'govt-tax',
        formName: 'Government Tax',
        status: getGenericFormStatus('govt_tax').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('govt_tax').completedAt,
        hasSignature: false,
        hasViewPage: false
      },
      {
        formType: 'super-choice-form',
        formName: 'Superannuation Standard Choice Form',
        status: getGenericFormStatus('super_choice_form').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('super_choice_form').completedAt,
        hasSignature: false,
        hasViewPage: false
      },
      {
        formType: 'vehicle-safety-inspection',
        formName: 'Vehicle Safety Inspection Checklist',
        status: getGenericFormStatus('vehicle_safety_inspection').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('vehicle_safety_inspection').completedAt,
        hasSignature: false,
        hasViewPage: false
      },
      {
        formType: 'conflict-of-interest',
        formName: 'Conflict of Interest Disclosure',
        status: getGenericFormStatus('conflict_of_interest').exists ? 'completed' : 'pending',
        completedAt: getGenericFormStatus('conflict_of_interest').completedAt,
        hasSignature: false,
        hasViewPage: false
      }
    ];

    return NextResponse.json({ staff, forms });
  } catch (error: any) {
    console.error('Error fetching staff forms:', error);
    return NextResponse.json({ error: 'Failed to fetch staff forms' }, { status: 500 });
  }
}
