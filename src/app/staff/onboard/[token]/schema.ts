export const employeeDetailsSchema = {
  schemaVersion: 1,
  formKey: 'employeeDetails',
  title: 'Employee Details Form',
  layout: { columns: 2 },
  sections: [] as any[],
};

// sections populated from user provided JSON
employeeDetailsSchema.sections = [
  {
    id: 'personalInfo', title: 'Personal Information', columns: 2,
    fields: [
      { key: 'firstName', label: 'First Name', type: 'text', required: true },
      { key: 'lastName', label: 'Last Name', type: 'text', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true, format: 'YYYY-MM-DD' },
      { key: 'positionTitle', label: 'Position Title', type: 'text' },
      { key: 'gender', label: 'Gender', type: 'radio', options: [ { label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' } ] },
      { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', format: 'YYYY-MM-DD' },
      { key: 'address', label: 'Address', type: 'textarea', columns: 2 },
      { key: 'suburb', label: 'Suburb', type: 'text' },
      { key: 'state', label: 'State', type: 'text' },
      { key: 'postcode', label: 'Postcode', type: 'text', validations: [ { type: 'pattern', value: '^\\d{4}$', message: 'Enter a 4-digit AU postcode' } ] },
      { key: 'homePhone', label: 'Home Phone', type: 'text' },
      { key: 'mobile', label: 'Mobile', type: 'text' },
      { key: 'email', label: 'Email Address', type: 'email' },
      { key: 'employeeTaxFile', label: 'Employee Tax File', type: 'text', validations: [ { type: 'pattern', value: '^\\d{8,9}$', message: 'Enter 8–9 digit TFN' } ] },
    ]
  },
  {
    id: 'residency', title: 'Residency & Work Rights', columns: 2,
    fields: [
      { key: 'isAustralianCitizen', label: 'Are you an Australian citizen?', type: 'boolean', required: true },
      { key: 'isPermanentResident', label: 'Are you a permanent resident?', type: 'boolean', showWhen: [ { key: 'isAustralianCitizen', equals: false } ] },
      { key: 'hasWorkingVisa', label: 'Do you have a Working Visa?', type: 'boolean', showWhen: [ { key: 'isAustralianCitizen', equals: false } ] },
      { key: 'visaExpiryDate', label: 'Visa Expiry Date', type: 'date', format: 'YYYY-MM-DD', showWhen: [ { key: 'hasWorkingVisa', equals: true } ] },
      { key: 'workRestrictions', label: 'Any restrictions?', type: 'textarea', columns: 2, showWhen: [ { key: 'hasWorkingVisa', equals: true } ] },
    ]
  },
  {
    id: 'nextOfKin', title: 'Next of Kin', columns: 2,
    fields: [
      { key: 'nokName', label: 'Next of Kin', type: 'text' },
      { key: 'nokRelationship', label: 'Relationship', type: 'text' },
      { key: 'nokAddress', label: 'Address', type: 'textarea', columns: 2 },
      { key: 'nokSuburb', label: 'Suburb', type: 'text' },
      { key: 'nokState', label: 'State', type: 'text' },
      { key: 'nokPostcode', label: 'Postcode', type: 'text', validations: [ { type: 'pattern', value: '^\\d{4}$', message: 'Enter a 4-digit AU postcode' } ] },
      { key: 'nokHomePhone', label: 'Home Phone', type: 'text' },
      { key: 'nokMobile', label: 'Mobile', type: 'text' },
      { key: 'nokWorkPhone', label: 'Work', type: 'text' },
    ]
  },
  {
    id: 'signatures', title: 'Signatures', columns: 2,
    fields: [
      { key: 'employeeSignature', label: 'Employee Signature', type: 'signature' },
      { key: 'employeeSignatureDate', label: 'Date', type: 'date', format: 'YYYY-MM-DD' },
      { key: 'managerSignature', label: 'Manager’s Signature', type: 'signature' },
      { key: 'managerSignatureDate', label: 'Date', type: 'date', format: 'YYYY-MM-DD' },
    ]
  },
  {
    id: 'officeUseOnly', title: 'Office Use Only', columns: 2,
    fields: [
      { key: 'officeEmployee', label: 'Employee', type: 'text' },
      { key: 'employmentStatus', label: 'Status', type: 'select', options: [ { label: 'Full time', value: 'FullTime' }, { label: 'Part time', value: 'PartTime' }, { label: 'Casual', value: 'Casual' } ] },
      { key: 'payRate', label: 'Pay rate', type: 'number', step: 0.01, prefix: '$' },
      { key: 'schadsScore', label: 'SCHADS score', type: 'text' },
    ]
  },
];


