"use client";

import React, { useState } from 'react';
import ClientIntakeFormResponsive from '@/app/components/forms/ClientIntakeFormResponsive';
import { ToastProvider } from '@/components/ui/Toast';

export default function ResponsiveFormDemo() {
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const handleFormChange = (values: any) => {
    setFormData(values);
    console.log('Form data changed:', values);
  };

  const handleFormSubmit = (values: any) => {
    console.log('Form submitted:', values);
    alert('Form submitted successfully!');
  };

  return (
    <ToastProvider>
      <ClientIntakeFormResponsive
        formData={formData}
        commonFieldsData={{}}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        readOnly={false}
        fieldErrors={fieldErrors}
      />
    </ToastProvider>
  );
}
