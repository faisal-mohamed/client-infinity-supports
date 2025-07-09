import ClientIntakeFormEnhanced from '../components/forms/ClientIntakeFormEnhanced';
import FormRenderer from '@/components/clients-intake-form/FormRenderer'; // Assuming this is the form renderer component

import HomeVisitRiskAssessment from '@/app/test/home_visit/page'
import HomeVisitRiskAssessmentEdit from '../components/forms/home_visit_risk_assessment/Edit';

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
      }
    ]
  }
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
