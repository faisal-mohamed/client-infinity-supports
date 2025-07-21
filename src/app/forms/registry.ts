import ClientIntakeFormEnhanced from '../components/forms/client_intake_form/ClientIntakeFormEnhanced';
import FormRenderer from '@/components/clients-intake-form/FormRenderer'; // Assuming this is the form renderer component

import HomeVisitRiskAssessment from '@/app/form-components/home_visit/page'
import HomeVisitRiskAssessmentEdit from '../components/forms/home_visit_risk_assessment/Edit';


import PersonCentredPlanView from '@/components/person_centred_plan/view';
import PersonCentredPlanEdit from '@/app/components/forms/person_centred_plan/Edit'

import SADeliverySupports from '@/app/form-components/SA-delivery-of-supports/page';
import SADeliverySupportsEdit from '../components/forms/sa-delivery-of-supports/Edit';

import ParticipantRiskAssessmentView from '@/components/participant-risk-assessment/view';
import ParticipantRiskAssessmentEdit from '../components/forms/participant-risk-assessment/Edit_2';

import EmergencyDrillEdit from '../components/forms/emergency-drill/Edit';
import EmergencyDrill from '@/components/emergency-drill/View'; // Assuming this is

import IndividualRiskAssessmentView from '@/components/individual-risk-assessment/View';
import IndividualRiskAssessmentEdit from '../components/forms/individual-risk-assessment/Edit'

import WelcomeFormView from '@/components/welcome-form/View';
import WelcomeFormEdit from '../components/forms/welcome-form/Edit'

import ScheduleForSupportEdit from '../components/forms/support-action-plan/Edit';
import ScheduleForSupportView from '@/components/support-action-plan/View';

import MDTEdit from '../components/forms/mdt/Edit';
import MDTView from '@/components/mdt/View';

import ScheduleForSupportView1 from '@/components/schedule-of-supports/View';
import ScheduleForSupportEdit1 from '../components/forms/schedule-of-supports/Edit';


// Signature requirement interface
interface SignatureRequirement {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  dataKey?: string; // Maps to form data for pre-population (e.g., 'name', 'designation') or signature field (e.g., 'signature', 'witnessSignature')
  condition?: (formData: any) => boolean; // Dynamic requirement based on form data
}

// Enhanced registry structure
interface FormRegistryItem {
  key: string;
  name: string;
  editComponent: React.ComponentType<any>;
  viewComponent: React.ComponentType<any>;
  signatures?: SignatureRequirement[]; // NEW: Signature configuration
}

const formRegistry: Record<string, FormRegistryItem> = {
  'client_intake_form': {
    key: 'client_intake_form',
    name: 'Client Intake Form',
    editComponent: ClientIntakeFormEnhanced,
    viewComponent: FormRenderer,
  },
  'home_visit_risk_assessment': {
    key: 'home_visit_risk_assessment',
    name: 'Home & Visit Risk Assessment',
    viewComponent: HomeVisitRiskAssessment,
    editComponent: HomeVisitRiskAssessmentEdit,
    signatures: [
      {
        id: 'client_signature',
        label: 'Client Signature',
        description: 'I acknowledge that this risk assessment has been completed and I understand the safety considerations outlined above.',
        required: true,
        dataKey: 'signature' // Maps to formData.signature field where the actual signature is stored
      },
      
      
    ]
  },
  'person_centred_plan': {
    key: 'person_centred_plan',
    name: 'Person Centred Plan',
    editComponent: PersonCentredPlanEdit,
    viewComponent: PersonCentredPlanView,
  },
  'sa_delivery_of_supports': {
    key: 'sa_delivery_of_supports',
    name: 'SA Delivery of Supports',
    viewComponent: SADeliverySupports,
    editComponent: SADeliverySupportsEdit,
    signatures: [
      {
        id: 'participant_signature',
        label: 'Participant Signature',
        description: 'Signature of the Participant',
        required: true,
        dataKey: 'participantSignature' 
      },
      {
        id: 'nominee_signature',
        label: 'Nominee Signature',
        description: 'Signature of the Nominee (if applicable)',
        required: false, // Changed to false since nominee is optional
        dataKey: 'nomineeSignature',
        condition: (formData: any) => {
          // Only require nominee signature if nominee name is provided
          return formData.nomineeName && formData.nomineeName.trim() !== '';
        }
      },
      {
        id: 'provider_signature',
        label: 'Provider Signature',
        description: 'Signature of the Provider',
        required: true,
        dataKey: 'providerSignature' 
      },
    ]
  },
  'participant_risk_assessment': {
    key: 'participant_risk_assessment',
    name: 'Participant Risk Assessment',
    viewComponent: ParticipantRiskAssessmentView,
    editComponent: ParticipantRiskAssessmentEdit,
    signatures: [
      {
        id: 'staff_signature',
        label: 'Authorised by',
        description: 'Signature of the Staff Member',
        required: true,
        dataKey: 'signature' 
      },
        {
        id: 'participant_signature',
        label: 'Participant Signature',
        description: 'Signature of the Participant',
        required: true,
        dataKey: 'guardianSignature' 
      },
     
    ]
  },
  'emergency_drill': {
    key: 'emergency_drill',
    name: 'Emergency Drill',
    viewComponent: EmergencyDrill,
    editComponent: EmergencyDrillEdit,
    signatures: [
      {
        id: 'support_worker_signature',
        label: 'Support Worker Signature',
        description: 'Signature of the Support Worker',
        required: true,
        dataKey: 'supportWorkerSignature' 
      },
        {
        id: 'supervisor_signature',
        label: 'Supervisor/Manager Signature',
        description: 'Signature of the Supervisor/Manager',
        required: true,
        dataKey: 'supervisorSignature' 
      },
     
    ]
  },
  'individual_risk_assessment': {
    key: 'individual_risk_assessment',
    name: 'Individual Risk Assessment',
    viewComponent: IndividualRiskAssessmentView,
    editComponent: IndividualRiskAssessmentEdit,
    signatures: [
      {
        id: 'assessor_signature',
        label: 'Assessor Signature',
        description: 'Signature of the Assessor',
        required: true,
        dataKey: 'assessorSignature' // Maps to formData.signature field where the actual signature is stored
      },
      
      
    ]
  },
  'welcome_form': {
    key: 'welcome_form',
    name: 'Welcome Form',
    viewComponent: WelcomeFormView,
    editComponent: WelcomeFormEdit,
    signatures: [
      {
        id: 'client_signature',
        label: 'Client Signature',
        description: 'I confirm I have received the Welcome Pack from Infinity Supports and have read and understood the content',
        required: true,
        dataKey: 'signature' // Maps to formData.signature field where the actual signature is stored
      },
      
      
    ]
  },
  'support_action_plan': {
    key: 'support_action_plan',
    name: 'Support Action Plan',
    viewComponent: ScheduleForSupportView,
    editComponent: ScheduleForSupportEdit,
    signatures: [
      {
        id: 'author_signature',
        label: 'Authorised by',
        description: 'Signature of the Author',
        required: true,
        dataKey: 'authorSignature' 
      },
        {
        id: 'participant_signature',
        label: 'Participant Signature',
        description: 'Signature of the Participant',
        required: true,
        dataKey: 'participantSignature' 
      },
     
    ]
  },
  'multi_disciplinary_meeting': {
    key: 'multi_disciplinary_meeting',
    name: 'Multi Disciplinary Meeting',
    editComponent: MDTEdit,
    viewComponent: MDTView,
  },

   'schedule_of_supports': {
    key: 'schedule_of_supports',
    name: 'Schedule of Supports',
    viewComponent: ScheduleForSupportView1,
    editComponent: ScheduleForSupportEdit1,
    signatures: [
      {
        id: 'participant_signature',
        label: 'Participant Signature',
        description: 'Signature of the Participant',
        required: true,
        dataKey: 'participantSignature' 
      },
      {
        id: 'nominee_signature',
        label: 'Nominee Signature',
        description: 'Signature of the Nominee (if applicable)',
        required: true, // Changed to false since nominee is optional
        dataKey: 'nomineeSignature',
        condition: (formData: any) => {
          // Only require nominee signature if nominee name is provided
          return formData.nomineeName && formData.nomineeName.trim() !== '';
        }
      },
      {
        id: 'representative_signature',
        label: 'Representative Signature',
        description: 'Signature of the Representative',
        required: true,
        dataKey: 'representativeSignature' 
      },
    ]
  },
};

// Helper functions
export const getFormComponent = (formKey: string, mode: 'edit' | 'view') => {
  const formConfig = formRegistry[formKey];
  if (!formConfig) {
    throw new Error(`Form component not found for key: ${formKey}`);
  }
  
  return mode === 'edit' ? formConfig.editComponent : formConfig.viewComponent;
};

export const getFormConfig = (formKey: string) => {
  return formRegistry[formKey];
};

export const getFormSignatures = (formKey: string): SignatureRequirement[] => {
  const formConfig = formRegistry[formKey];
  return formConfig?.signatures || [];
};

export const hasSignatureRequirement = (formKey: string): boolean => {
  const signatures = getFormSignatures(formKey);
  return signatures.length > 0;
};

export const getAllForms = () => {
  return Object.values(formRegistry);
};

// Export types for use in other components
export type { SignatureRequirement, FormRegistryItem };

export default formRegistry;
