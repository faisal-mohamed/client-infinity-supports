import ClientIntakeFormEnhanced from '../components/forms/ClientIntakeFormEnhanced';
import CombinedForms from '../ClientIntakeFormView/page'; // Your view component

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
  // Future forms will be added here like:
  // 'medical_assessment': {
  //   key: 'medical_assessment', 
  //   name: 'Medical Assessment Form',
  //   editComponent: MedicalAssessmentFormEnhanced,
  //   viewComponent: MedicalAssessmentView,
  // },
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
