import type React from 'react';
// NEW: React PDF version (dynamic pages!)
import EmployeeDetailsPDF from './EmployeeDetailsPDF_ReactPDF';
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
  }
};

export const getStaffPDFComponent = (formType: string) => {
  const item = staffPDFRegistry[formType];
  if (!item) {
    throw new Error(`Staff PDF component not found: ${formType}`);
  }
  return item.component;
};

export default staffPDFRegistry;
