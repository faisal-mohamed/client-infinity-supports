import type React from 'react';

import EmployeeDetailsView from '@/app/form-components/staff/employee-details/View';
import EmployeeWelcomeView from '@/app/form-components/staff/employee-welcome/View';
import SupportWorkerView from '@/app/form-components/staff/support-worker/View';
import SupportWorkerEdit from '@/app/form-components/staff/support-worker/Edit';
import PreEmploymentMedicalView from '@/app/form-components/staff/pre-employment-medical/View';
import NdisWorkforceCapabilityView from '@/app/form-components/staff/ndis-workforce-capability/View';
import BullyingHarassmentTrainingView from '@/app/form-components/staff/bullying-harassment-training/View';
import TFNDeclarationView from '@/app/form-components/staff/tfn-declaration';

import NDISCodeOfConduct from '../form-components/staff/code_of_conduct/page';
import GovtTax from '@/app/form-components/staff/tax/page'

import ConflictFormMain from '../form-components/staff/conflict-of-interest/page';
import DocumentationAcknowledgement from '../form-components/staff/acknowledgement/page';

export interface StaffFormRegistryItem {
  key: string;
  name: string;
  viewComponent: React.ComponentType<any>;
  editComponent?: React.ComponentType<any>;
}

const staffFormRegistry: Record<string, StaffFormRegistryItem> = {
  employee_details: {
    key: 'employee_details',
    name: 'Employee Details',
    viewComponent: EmployeeDetailsView,
  },
  employee_welcome: {
    key: 'employee_welcome',
    name: 'Employee Welcome',
    viewComponent: EmployeeWelcomeView,
  },
  support_worker: {
    key: 'support_worker',
    name: 'Support Worker',
    viewComponent: SupportWorkerView,
    editComponent: SupportWorkerEdit,
  },
  pre_employment_medical: {
    key: 'pre_employment_medical',
    name: 'Pre-Employment Medical',
    viewComponent: PreEmploymentMedicalView,
  },
  ndis_workforce_capability: {
    key: 'ndis_workforce_capability',
    name: 'NDIS Workforce Capability Framework',
    viewComponent: NdisWorkforceCapabilityView,
  },
  bullying_harassment_training: {
    key: 'bullying_harassment_training',
    name: 'Bullying and Harassment Training',
    viewComponent: BullyingHarassmentTrainingView,
  },
  tfn_declaration: {
    key: 'tfn_declaration',
    name: 'TFN Declaration',
    viewComponent: TFNDeclarationView,
  },
  ndis_code_of_conduct : {
    key: 'ndis_code_of_conduct',
    name: 'NDIS Code of Conduct',
    viewComponent: NDISCodeOfConduct,
  },
  govt_tax: {
    key: 'govt_tax',
    name: 'Government Tax',
    viewComponent: GovtTax,
  },
  conflict_of_interest: {
    key: 'conflict_of_interest',
    name: 'Conflict of Interest Disclosure Form',
    viewComponent: ConflictFormMain,
  },
  documentation_acknowledgement: {
    key: 'documentation_acknowledgement',
    name: 'Documentation Acknowledgement',
    viewComponent: DocumentationAcknowledgement,
  }
};

export const getAllStaffForms = (): StaffFormRegistryItem[] => Object.values(staffFormRegistry);

export const getStaffFormComponent = (formKey: string, mode: 'view' | 'edit' = 'view') => {
  const item = staffFormRegistry[formKey];
  if (!item) throw new Error(`Staff form not found: ${formKey}`);
  return mode === 'view' ? item.viewComponent : (item.editComponent || item.viewComponent);
};

export const getStaffFormConfig = (formKey: string): StaffFormRegistryItem | undefined => staffFormRegistry[formKey];

export default staffFormRegistry;


