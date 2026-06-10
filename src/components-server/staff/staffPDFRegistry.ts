import type React from 'react';
// NEW: React PDF version (dynamic pages!)
import EmployeeDetailsPDF from './EmployeeDetailsPDF_ReactPDF';
import EmployeeWelcomePDF from './EmployeeWelcomePDF_ReactPDF';
import SupportWorkerPDF from './SupportWorkerPDF_ReactPDF';
import PreEmploymentMedicalPDF from './PreEmploymentMedicalPDF_ReactPDF';
import NdisWorkforceCapabilityPDF from '../PrintableForms/staff/ndis-workforce-capability/page';
import NdisCodeOfConductPDF from '../PrintableForms/staff/ndis-code-of-conduct/page';
import BullyingHarassmentTrainingPDF from '../PrintableForms/staff/bullying-harassment-training/page';
import BullyingTrainingPDF from '../PrintableForms/staff/bullying-training/page';
import FairworkInformationPDF from '../PrintableForms/staff/fairwork-information-statements/page';
import OrientationPDF from '../PrintableForms/staff/orientation/page';
import VehicleSafetyInspectionPDF from '../PrintableForms/staff/vehicle-safety-inspection/page';
import ConflictOfInterestPDF from '../PrintableForms/staff/conflict-of-interest/page';
import DocumentationAcknowledgementPDF from '../PrintableForms/staff/documentation-acknowledgement/page';
// OLD: Playwright version (keep for reference)
// import EmployeeDetailsPDF from './EmployeeDetailsPDF';

export interface StaffPDFRegistryItem {
  key: string;
  name: string;
  component: React.ComponentType<any>;
}

const staffPDFRegistry: Record<string, StaffPDFRegistryItem> = {
  'employee-details': {
    key: 'employee-details',
    name: 'Employee Details',
    component: EmployeeDetailsPDF,
  },
  'employee_details': {
    key: 'employee_details', 
    name: 'Employee Details',
    component: EmployeeDetailsPDF,
  },
  'employment-welcome': {
    key: 'employment-welcome',
    name: 'Employee Welcome Pack Acknowledgment',
    component: EmployeeWelcomePDF,
  },
  'employment_welcome': {
    key: 'employment_welcome',
    name: 'Employee Welcome Pack Acknowledgment',
    component: EmployeeWelcomePDF,
  },
  'support-worker': {
    key: 'support-worker',
    name: 'Position Description Form',
    component: SupportWorkerPDF,
  },
  'support_worker': {
    key: 'support_worker',
    name: 'Position Description Form',
    component: SupportWorkerPDF,
  },
  'pre-employment-medical': {
    key: 'pre-employment-medical',
    name: 'Pre-Employment Medical',
    component: PreEmploymentMedicalPDF,
  },
  'pre_employment_medical': {
    key: 'pre_employment_medical',
    name: 'Pre-Employment Medical',
    component: PreEmploymentMedicalPDF,
  },
  'ndis-workforce-capability': {
    key: 'ndis-workforce-capability',
    name: 'NDIS Workforce Capability Framework',
    component: NdisWorkforceCapabilityPDF,
  },
  'ndis-code-of-conduct': {
    key: 'ndis-code-of-conduct',
    name: 'NDIS Code of Conduct',
    component: NdisCodeOfConductPDF,
  },
  'ndis_code_of_conduct': {
    key: 'ndis_code_of_conduct',
    name: 'NDIS Code of Conduct',
    component: NdisCodeOfConductPDF,
  },
  'ndis_workforce_capability': {
    key: 'ndis_workforce_capability',
    name: 'NDIS Workforce Capability Framework',
    component: NdisWorkforceCapabilityPDF,
  },
  'fair_work_information': {
    key: 'fair_work_information',
    name: 'Fairwork Information Statements',
    component: FairworkInformationPDF,
  },
  'fair-work-information': {
    key: 'fair-work-information',
    name: 'Fairwork Information Statements',
    component: FairworkInformationPDF,
  },
  orientation: {
    key: 'orientation',
    name: 'Staff Orientation',
    component: OrientationPDF,
  },
  'bullying-harassment-training': {
    key: 'bullying-harassment-training',
    name: 'Bullying and Harassment Training',
    component: BullyingHarassmentTrainingPDF,
  },
  'bullying_harassment_training': {
    key: 'bullying_harassment_training',
    name: 'Bullying and Harassment Training',
    component: BullyingHarassmentTrainingPDF,
  },
  'bullying-training': {
    key: 'bullying-training',
    name: 'Bullying Training',
    component: BullyingTrainingPDF,
  },
  'bullying_training': {
    key: 'bullying_training',
    name: 'Bullying Training',
    component: BullyingTrainingPDF,
  },
  'vehicle-safety-inspection': {
    key: 'vehicle-safety-inspection',
    name: 'Vehicle Safety Inspection Checklist',
    component: VehicleSafetyInspectionPDF,
  },
  'vehicle_safety_inspection': {
    key: 'vehicle_safety_inspection',
    name: 'Vehicle Safety Inspection Checklist',
    component: VehicleSafetyInspectionPDF,
  },
  'conflict-of-interest': {
    key: 'conflict-of-interest',
    name: 'Conflict of Interest Disclosure Form',
    component: ConflictOfInterestPDF,
  },
  'conflict_of_interest': {
    key: 'conflict_of_interest',
    name: 'Conflict of Interest Disclosure Form',
    component: ConflictOfInterestPDF,
  },
  'documentation-acknowledgement': {
    key: 'documentation-acknowledgement',
    name: 'Documentation Acknowledgement',
    component: DocumentationAcknowledgementPDF,
  },
  'documentation_acknowledgement': {
    key: 'documentation_acknowledgement',
    name: 'Documentation Acknowledgement',
    component: DocumentationAcknowledgementPDF,
  },
};

export const getStaffPDFComponent = (formType: string) => {
  const item = staffPDFRegistry[formType];
  if (!item) {
    throw new Error(`Staff PDF component not found: ${formType}`);
  }
  return item.component;
};

export default staffPDFRegistry;
