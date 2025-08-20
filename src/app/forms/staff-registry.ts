import type React from 'react';

import EmployeeDetailsView from '@/app/form-components/staff/employee-details/View';
import EmployeeWelcomeView from '@/app/form-components/staff/employee-welcome/View';

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
};

export const getAllStaffForms = (): StaffFormRegistryItem[] => Object.values(staffFormRegistry);

export const getStaffFormComponent = (formKey: string, mode: 'view' | 'edit' = 'view') => {
  const item = staffFormRegistry[formKey];
  if (!item) throw new Error(`Staff form not found: ${formKey}`);
  return mode === 'view' ? item.viewComponent : (item.editComponent || item.viewComponent);
};

export const getStaffFormConfig = (formKey: string): StaffFormRegistryItem | undefined => staffFormRegistry[formKey];

export default staffFormRegistry;


