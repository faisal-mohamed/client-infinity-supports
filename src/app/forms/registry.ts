import ClientIntakeFormEnhanced from "../components/forms/client_intake_form/ClientIntakeFormEnhanced";
import ClientIntakeFormEdit from "../components/forms/client_intake_form/ClientIntakeFormEdit"; // NEW: Unified edit wrapper
import ClientIntakeFormView from "../components/forms/client_intake_form/ClientIntakeFormView"; // NEW: Unified view wrapper
import ClientIntakeFormPDF from "../../components/client-intake-form/ClientIntakeFormPDF"; // NEW: Improved HTML-based PDF renderer
import FormRenderer from "@/components/clients-intake-form/FormRenderer"; // Assuming this is the form renderer component

import HomeVisitRiskAssessment from "@/app/form-components/home_visit/page";
import HomeVisitRiskAssessmentEdit from "../components/forms/home_visit_risk_assessment/Edit";
import HomeVisitDynamic from "../components/forms/home-visit-risk-assessment/HomeVisitDynamic";
import HomeRiskAssesmentView from "@/components/home_visit_risk_assessment/view";
import HomeVisitRiskAssessment_MATCHING from "../../components-server/PrintableForms/HomeVisitRiskAssessment_MATCHING";

import PersonCentredPlanView from "@/components/person_centred_plan/view";
import PersonCentredPlanEdit from "@/app/components/forms/person_centred_plan/Edit";

import SADeliverySupports from "@/app/form-components/SA-delivery-of-supports/page";
import SADeliverySupportsView from "../components/forms/sa-delivery-of-supports/SADeliverySupportsView";
import SADeliverySupportsEdit from "../components/forms/sa-delivery-of-supports/Edit";

import ParticipantRiskAssessmentView from "@/components/participant-risk-assessment/view";
import ParticipantRiskAssessmentEdit from "../components/forms/participant-risk-assessment/Edit_2";
import ParticipantRiskAssessmentPDF from "@/components/participant-risk-assessment/ParticipantRiskAssessmentPDF";

import EmergencyDrillEdit from "../components/forms/emergency-drill/Edit";
import EmergencyDrill from "@/components/emergency-drill/View"; // Assuming this is

import IndividualRiskAssessmentView from "@/components/individual-risk-assessment/View";
import IndividualRiskAssessmentEdit from "../components/forms/individual-risk-assessment/Edit";

import WelcomeFormView from "@/components/welcome-form/View";
import WelcomeFormDynamic from "../components/forms/welcome-form/WelcomeFormDynamic";
import WelcomeFormEdit from "../components/forms/welcome-form/Edit";
import WelcomeForm_MATCHING from "../../components-server/PrintableForms/WelcomeForm_MATCHING";

import ScheduleForSupportEdit from "../components/forms/support-action-plan/Edit";
import SupportActionPlanView from "../components/forms/support-action-plan/SupportActionPlanView";

import MDTEdit from "../components/forms/mdt/Edit";
import MDTView from "@/components/mdt/View";

import ScheduleForSupportView1 from "@/components/schedule-of-supports/View";
import ScheduleForSupportEdit1 from "../components/forms/schedule-of-supports/Edit";

import SASupportCoordinationView from "@/components/sa-support-coordination/View";
import SASupportCoordinationEdit from "../components/forms/sa-support-coordination/Edit";


// Signature requirement interface
interface SignatureRequirement {
  id: string;
  label: string;
  description?: string;
  required?: boolean; // Still used for single required fields
  dataKey?: string;
  condition?: (formData: any) => boolean;
  signedAtKey?: string;

  // NEW: Grouping logic
  groupId?: string; // Identifier to group signatures
  groupRequirementType?: "any" | "all"; // Currently only 'any' is needed for your use case
  groupRequired?: boolean; // Whether the group itself is required

  signerName?: string;
}

// Enhanced registry structure
interface FormRegistryItem {
  key: string;
  name: string;
  editComponent: React.ComponentType<any>;
  viewComponent: React.ComponentType<any>;
  pdfComponent?: React.ComponentType<any>; // NEW: PDF component for downloads
  signatures?: SignatureRequirement[]; // NEW: Signature configuration
}

const formRegistry: Record<string, FormRegistryItem> = {
  client_intake_form: {
    key: "client_intake_form",
    name: "Client Intake Form",
    // NEW: Using unified component via wrappers
    editComponent: ClientIntakeFormEdit,
    viewComponent: ClientIntakeFormView,
    pdfComponent: ClientIntakeFormPDF, // NEW: Improved HTML-based PDF renderer
  },
  home_visit_risk_assessment: {
    key: "home_visit_risk_assessment",
    name: "Home & Visit Risk Assessment",
    viewComponent: HomeRiskAssesmentView, // FIXED: Use proper wrapper component
    editComponent: HomeVisitRiskAssessmentEdit,
    pdfComponent: HomeVisitRiskAssessment_MATCHING, // NEW: Unified PDF download
    signatures: [
      {
        id: "assessor_signature",
        label: "Assessor Signature",
        description: "Signature of the Risk Assessment Assessor",
        required: true,
        dataKey: "assessorSignature",
        signedAtKey: "completionDate",
        signerName: "assessorName",
      },
    ],
  },
  person_centred_plan: {
    key: "person_centred_plan",
    name: "Person Centred Plan",
    editComponent: PersonCentredPlanEdit,
    viewComponent: PersonCentredPlanView,
  },

  sa_delivery_of_supports: {
    key: "sa_delivery_of_supports",
    name: "SA Delivery of Supports",
    viewComponent: SADeliverySupportsView,
    editComponent: SADeliverySupportsEdit,
    signatures: [
      {
        id: "participant_signature",
        label: "Participant Signature",
        description: "Signature of the Participant",
        dataKey: "participantSignature",
        signedAtKey: "participantSignatureDate",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
        groupRequired: true,
        signerName: "participantName",
      },
      {
        id: "nominee_signature",
        label: "Nominee Signature",
        description: "Signature of the Nominee",
        dataKey: "nomineeSignature",
        signedAtKey: "nomineeSignatureDate",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
        groupRequired: true,
        signerName: "nomineeName",
      },
      {
        id: "provider_signature",
        label: "Provider Signature",
        description: "Signature of the Provider",
        required: true, // Always required
        dataKey: "providerSignature",
        signedAtKey: "providerSignatureDate",
        signerName: "providerName",
      },
    ],
  },

  participant_risk_assessment: {
    key: "participant_risk_assessment",
    name: "Participant Risk Assessment",
    viewComponent: ParticipantRiskAssessmentView,
    editComponent: ParticipantRiskAssessmentEdit,
    pdfComponent: ParticipantRiskAssessmentPDF,
    signatures: [
      {
        id: "staff_signature",
        label: "Authorised by",
        description: "Signature of the Staff Member",
        required: true,
        dataKey: "signature",
        signedAtKey: "signatureDate",
      },
      {
        id: "participant_signature",
        label: "Participant Signature",
        description: "Signature of the Participant",
        required: true,
        dataKey: "guardianSignature",
        signedAtKey: "guardianDate",
      },
    ],
  },
  emergency_drill: {
    key: "emergency_drill",
    name: "Emergency Drill",
    viewComponent: EmergencyDrill,
    editComponent: EmergencyDrillEdit,
    signatures: [
      {
        id: "support_worker_signature",
        label: "Support Worker Signature",
        description: "Signature of the Support Worker",
        required: true,
        dataKey: "supportWorkerSignature",
        signedAtKey: "signatureDate",
      },
      {
        id: "supervisor_signature",
        label: "Supervisor/Manager Signature",
        description: "Signature of the Supervisor/Manager",
        required: true,
        dataKey: "supervisorSignature",
      },
    ],
  },
  individual_risk_assessment: {
    key: "individual_risk_assessment",
    name: "Individual Risk Assessment",
    viewComponent: IndividualRiskAssessmentView,
    editComponent: IndividualRiskAssessmentEdit,
    signatures: [
      {
        id: "assessor_signature",
        label: "Assessor Signature",
        description: "Signature of the Assessor",
        required: true,
        dataKey: "assessorSignature", // Maps to formData.signature field where the actual signature is stored
        signedAtKey: "assessorSignatureDate",
        signerName: 'assessorName'
      },
    ],
  },
  welcome_form: {
    key: "welcome_form",
    name: "Welcome Form",
    viewComponent: WelcomeFormDynamic, // NEW: Dynamic view with auto-pagination
    editComponent: WelcomeFormEdit,
    pdfComponent: WelcomeForm_MATCHING, // NEW: Unified PDF download
    signatures: [
      {
        id: "client_signature",
        label: "Client Signature",
        description:
          "I confirm I have received the Welcome Pack from Infinity Supports and have read and understood the content",
        required: true,
        dataKey: "signature", // Maps to formData.signature field where the actual signature is stored
        signedAtKey: "date",
      },
    ],
  },
  support_action_plan: {
    key: "support_action_plan",
    name: "Support Action Plan",
    viewComponent: SupportActionPlanView,
    editComponent: ScheduleForSupportEdit,
    signatures: [
      {
        id: "author_signature",
        label: "Authorised by",
        description: "Signature of the Author",
        required: true,
        dataKey: "authorSignature",
        signedAtKey: "authorDate",
      },
      {
        id: "participant_signature",
        label: "Participant’s or Participant’s Representative’s Signature",
        description: "Participant’s or Participant’s Representative’s Signature",
        required: true,
        dataKey: "participantSignature",
        signedAtKey: "participantDate",
      },
    ],
  },
  multi_disciplinary_meeting: {
    key: "multi_disciplinary_meeting",
    name: "Multi Disciplinary Meeting",
    editComponent: MDTEdit,
    viewComponent: MDTView,
  },

  schedule_of_supports: {
    key: "schedule_of_supports",
    name: "Schedule of Supports",
    viewComponent: ScheduleForSupportView1,
    editComponent: ScheduleForSupportEdit1,
    signatures: [
      {
        id: "participant_signature",
        label: "Participant Signature",
        description: "Signature of the Participant",
        dataKey: "participantSignature",
        signedAtKey: "participantSignatureDate",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
        groupRequired: true,
        signerName: "participantName",
      },
      {
        id: "nominee_signature",
        label: "Nominee Signature",
        description: "Signature of the Nominee (if applicable)",
        dataKey: "nomineeSignature",
        signedAtKey: "nomineeSignatureDate",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
        groupRequired: true,
        signerName: "nomineeName",
      },
      {
        id: "representative_signature",
        label: "Representative Signature",
        description: "Signature of the Representative",
        required: true,
        dataKey: "representativeSignature",
        signedAtKey: "representativeSignatureDate",
        signerName: 'representativeName'
      },
    ],
  },
  sa_support_coordination: {
    key: "sa_support_coordination",
    name: "SA Support Co-Ordination",
    viewComponent: SASupportCoordinationView,
    editComponent: SASupportCoordinationEdit,
    signatures: [
      {
        id: "participant_signature",
        label: "Participant Signature",
        description: "Signature of the Participant",
        dataKey: "participantSignature",
        signedAtKey: "participantSignatureDate",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
        groupRequired: true,
        signerName: "participantName",
      },
      {
        id: "nominee_signature",
        label: "Nominee Signature",
        description: "Signature of the Nominee",
        dataKey: "nomineeSignature",
        signedAtKey: "nomineeSignatureDate",
        groupId: "participant_or_nominee",
        groupRequirementType: "any",
        groupRequired: true,
        signerName: "nomineeName",
      },
      {
        id: "provider_signature",
        label: "Provider Signature",
        description: "Signature of the Provider",
        required: true, // Always required
        dataKey: "providerSignature",
        signedAtKey: "providerSignatureDate",
        signerName: "providerName",
      },
      {
        id: "conflict_signature",
        label: "Conflict Signature",
        description: "Signature of the Provider/Nominee",
        condition: (formData: any) => {
         return formData.isConflictOfInterest === "Yes";
   },
        dataKey: "signature",
        signedAtKey: "signDate",
        signerName: "printName",
      },
    ],
  }
};

// Helper functions
export const getFormComponent = (formKey: string, mode: "edit" | "view") => {
  const formConfig = formRegistry[formKey];
  if (!formConfig) {
    throw new Error(`Form component not found for key: ${formKey}`);
  }

  return mode === "edit" ? formConfig.editComponent : formConfig.viewComponent;
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

export const getPDFComponent = (formKey: string) => {
  const formConfig = formRegistry[formKey];
  return formConfig?.pdfComponent;
};

export const getAllForms = () => {
  return Object.values(formRegistry);
};

// Export types for use in other components
export type { SignatureRequirement, FormRegistryItem };

export default formRegistry;
