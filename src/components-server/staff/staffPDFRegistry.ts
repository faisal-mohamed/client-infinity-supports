import type React from 'react';
// NEW: React PDF version (dynamic pages!)
import EmployeeDetailsPDF from './EmployeeDetailsPDF_ReactPDF';
import EmployeeWelcomePDF from './EmployeeWelcomePDF_ReactPDF';
import SupportWorkerPDF from './SupportWorkerPDF_ReactPDF';
import PreEmploymentMedicalPDF from './PreEmploymentMedicalPDF_ReactPDF';
import NdisWorkforceCapabilityPDF from './NdisWorkforceCapabilityPDF_ReactPDF';
import BullyingHarassmentTrainingPDF from './BullyingHarassmentTrainingPDF_ReactPDF';
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
    name: 'Employee Welcome Acknowledgment',
    component: EmployeeWelcomePDF,
  },
  'employment_welcome': {
    key: 'employment_welcome',
    name: 'Employee Welcome Acknowledgment',
    component: EmployeeWelcomePDF,
  },
  'support-worker': {
    key: 'support-worker',
    name: 'Support Worker Form',
    component: SupportWorkerPDF,
  },
  'support_worker': {
    key: 'support_worker',
    name: 'Support Worker Form',
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
  'ndis_workforce_capability': {
    key: 'ndis_workforce_capability',
    name: 'NDIS Workforce Capability Framework',
    component: NdisWorkforceCapabilityPDF,
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
};

export const getStaffPDFComponent = (formType: string) => {
  const item = staffPDFRegistry[formType];
  if (!item) {
    throw new Error(`Staff PDF component not found: ${formType}`);
  }
  return item.component;
};

export default staffPDFRegistry;
