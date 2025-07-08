import { ComponentType } from 'react';

// PDF-specific form components
import ClientIntakev2 from './ClientIntakev2';
import HomeVisitRiskAssessment from './HomeVisitRiskAssessment';
// Interface for PDF form components
interface PDFFormComponent {
  formKey: string;
  formId?: number; // Optional: for specific form ID matching
  component: ComponentType<any>;
  name: string;
}

// PDF Form Registry - Maps form keys/IDs to their PDF components
const pdfFormRegistry: PDFFormComponent[] = [
  {
    formKey: 'client_intake_form',
    component: ClientIntakev2, // Your main client intake PDF component
    name: 'Client Intake Form',
  },
  {
    formKey: 'home_visit_risk_assessment',
    component: HomeVisitRiskAssessment, 
    name: 'Home Visit Risk Assessment Form',
  },
  
];

// Helper function to get PDF component by form key
export const getPDFComponent = (formKey: string): ComponentType<any> => {
  const formConfig = pdfFormRegistry.find(config => config.formKey === formKey);
  
  if (!formConfig) {
    console.warn(`PDF component not found for form key: ${formKey}, falling back to ClientIntakev2`);
    return ClientIntakev2; // Fallback to default component
  }
  
  return formConfig.component;
};

// // Helper function to get PDF component by form ID (if you prefer ID-based matching)
// export const getPDFComponentById = (formId: number): ComponentType<any> => {
//   // You can implement ID-based mapping here if needed
//   // For now, we'll use a simple mapping
//   switch (formId) {
//     case 1:
//       return ClientIntakev2;
//     case 2:
//       return ClientIntakeForm;
//     // Add more cases as needed:
//     // case 3:
//     //   return MedicalAssessmentPDF;
//     // case 4:
//     //   return HomeRiskAssessmentPDF;
//     default:
//       console.warn(`PDF component not found for form ID: ${formId}, falling back to ClientIntakev2`);
//       return ClientIntakev2; // Fallback to default component
//   }
// };

// Helper function to get all available PDF forms
export const getAllPDFForms = (): PDFFormComponent[] => {
  return pdfFormRegistry;
};

// Helper function to check if a form has a PDF component
export const hasPDFComponent = (formKey: string): boolean => {
  return pdfFormRegistry.some(config => config.formKey === formKey);
};

export default pdfFormRegistry;
