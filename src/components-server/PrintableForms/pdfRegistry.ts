import { ComponentType } from 'react';

// PDF-specific form components
import ClientIntakev2 from './ClientIntakev2';
import ClientIntakev2Natural from './ClientIntakev2_NATURAL'; // Natural flow version
import ClientIntakev2Matching from './ClientIntakev2_MATCHING'; // Matches web view design
import HomeVisitRiskAssessment from './HomeVisitRiskAssessment';
import PersonCentredPlan from './Person_Centred_Plan/page_FRESH'; // Using fresh version
import SADeliverySupports from './SA-delivery-of-supports/page_FIXED';
import SADeliverySupportsMatching from './SADeliverySupports_MATCHING'; // Dynamic PDF with auto page breaks
import ParticipantRiskAssessmentPDF from './participant-risk-assessment/ParticipantRiskAssessmentPDF'; // Server-side PDF component
import EmergencyDrill from './emergency-drill/page_strict_form'; // Using strict form layout
import IndividualRiskAssessmentView from './individual-risk-assessment/page_FIXED'; // Assuming this is the correct import path
import WelcomeForm from './welcome-form/page_FIXED';
import ScheduleForSupport from './support-action-plan/page_FIXED';
import MDT from './mdt/page'
import ScheduleOfSupports from './schedule-of-supports/page_FIXED';
import SASupportCoordination from './sa-support-coordination/page_FIXED';

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
    component: ClientIntakev2Matching, // Use matching design version
    name: 'Client Intake Form',
  },
  {
    formKey: 'home_visit_risk_assessment',
    component: HomeVisitRiskAssessment,
    name: 'Home Visit Risk Assessment Form',
  },
  {
    formKey: "person_centred_plan",
    component: PersonCentredPlan,
    name: 'Person Centred Plan',
  },
  {
    formKey: 'sa_delivery_of_supports',
    component: SADeliverySupportsMatching, // Use matching dynamic PDF component
    name: 'SA Delivery of Supports',
  },
  {
    formKey: 'participant_risk_assessment',
    component: ParticipantRiskAssessmentPDF,
    name: 'Participant Risk Assessment',
  },
  {
    formKey: 'emergency_drill',
    component: EmergencyDrill,
    name: 'Emergency Drill Reporting Form',
  },
  {
    formKey: 'individual_risk_assessment',
    component: IndividualRiskAssessmentView, // Assuming this is the correct import path
    name: 'Individual Risk Assessment',
  },
  {
    formKey: "welcome_form",
    component: WelcomeForm,
    name: "Welcome Form"
  },
  {
    formKey: "support_action_plan",
    component: ScheduleForSupport,
    name: "Support Co-ordination Action Plan"
  },
  {
    formKey: 'multi_disciplinary_meeting',
    component: MDT,
    name: "Multi Disciplinary Meeting"
  },
  {
    formKey: 'schedule_of_supports',
    component: ScheduleOfSupports,
    name: "Schedule of Supports"
  },
  {
    formKey: 'sa_support_coordination',
    name: "SASupportCoordination",
    component: SASupportCoordination
  }

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


export const getAllPDFForms = (): PDFFormComponent[] => {
  return pdfFormRegistry;
};

// Helper function to check if a form has a PDF component
export const hasPDFComponent = (formKey: string): boolean => {
  return pdfFormRegistry.some(config => config.formKey === formKey);
};

export default pdfFormRegistry;
