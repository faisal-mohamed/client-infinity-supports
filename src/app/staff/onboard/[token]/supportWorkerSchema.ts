export const supportWorkerSchema = {
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { key: 'firstName', label: 'First Name', type: 'text', required: true },
        { key: 'lastName', label: 'Last Name', type: 'text', required: true },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
        { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { key: 'address', label: 'Address', type: 'text', required: true },
        { key: 'suburb', label: 'Suburb', type: 'text', required: true },
        { key: 'state', label: 'State', type: 'select', required: true },
        { key: 'postcode', label: 'Postcode', type: 'text', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: true },
      ]
    },
    {
      title: 'Emergency Contact',
      fields: [
        { key: 'emergencyContact', label: 'Emergency Contact Name', type: 'text', required: false },
        { key: 'emergencyRelationship', label: 'Relationship', type: 'text', required: false },
        { key: 'emergencyPhone', label: 'Emergency Phone', type: 'tel', required: false },
      ]
    },
    {
      title: 'Qualifications & Experience',
      fields: [
        { key: 'disabilityExperience', label: 'Experience with disabilities', type: 'select', required: false },
        { key: 'driversLicense', label: 'Driver\'s License', type: 'select', required: false },
        { key: 'vehicleAvailable', label: 'Vehicle Available', type: 'select', required: false },
      ]
    },
    {
      title: 'Employee Declaration',
      fields: [
        { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
        { key: 'employeeSignatureDate', label: 'Date', type: 'date', required: true },
        { key: 'employeeSignature', label: 'Employee Signature', type: 'signature', required: true },
      ]
    }
  ]
};
