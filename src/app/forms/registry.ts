import ClientIntakeFormEnhanced from '../components/forms/ClientIntakeFormEnhanced';
import CombinedForms from '../ClientIntakeFormView/page'; // Your view component

import HomeVisitRiskAssessment from '@/app/test/home_visit/page'

// Enhanced registry structure
interface FormRegistryItem {
  key: string;
  name: string;
  editComponent: React.ComponentType<any>;
  viewComponent: React.ComponentType<any>;
  // Removed requiresSignature from here - now stored in database
}

const formRegistry: Record<string, FormRegistryItem> = {
  'client_intake_form': {
    key: 'client_intake_form',
    name: 'Client Intake Form',
    editComponent: ClientIntakeFormEnhanced,
    viewComponent: CombinedForms,
  },
 'home_visit_risk_assessment': {
    key: 'home_visit_risk_assessment',
    name: 'Home & Visit Risk Assessment',
    viewComponent: HomeVisitRiskAssessment,
    editComponent: HomeVisitRiskAssessment, // Assuming the same component is used for both edit
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

export const getAllForms = () => {
  return Object.values(formRegistry);
};

export default formRegistry;
