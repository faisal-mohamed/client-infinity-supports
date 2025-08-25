import type React from 'react';

import EmployeeDetailsView from '@/app/form-components/staff/employee-details/View';
import EmployeeWelcomeView from '@/app/form-components/staff/employee-welcome/View';
import SupportWorkerView from '@/app/form-components/staff/support-worker/View';
import PreEmploymentMedicalView from '@/app/form-components/staff/pre-employment-medical/View';
import NdisWorkforceCapabilityView from '@/app/form-components/staff/ndis-workforce-capability/View';
import BullyingHarassmentTrainingView from '@/app/form-components/staff/bullying-harassment-training/View';
import TFNDeclarationView from '@/app/form-components/staff/tfn-declaration';

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
};

export const getAllStaffForms = (): StaffFormRegistryItem[] => Object.values(staffFormRegistry);

export const getStaffFormComponent = (formKey: string, mode: 'view' | 'edit' = 'view') => {
  const item = staffFormRegistry[formKey];
  if (!item) throw new Error(`Staff form not found: ${formKey}`);
  return mode === 'view' ? item.viewComponent : (item.editComponent || item.viewComponent);
};

export const getStaffFormConfig = (formKey: string): StaffFormRegistryItem | undefined => staffFormRegistry[formKey];

export default staffFormRegistry;


