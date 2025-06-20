"use client";

import React, { useState } from 'react';
import ClientIntakeFormEnhanced from '@/app/components/forms/ClientIntakeFormEnhanced';
import { ToastProvider } from '@/components/ui/Toast';

export default function EnhancedFormDemo() {
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
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Enhanced Client Intake Form</h1>
            <p className="text-gray-600">Multi-step form with progress tracking and improved UI</p>
          </div>
          
          <ClientIntakeFormEnhanced
            formData={formData}
            commonFieldsData={{}}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            readOnly={false}
            fieldErrors={fieldErrors}
          />
        </div>
      </div>
    </ToastProvider>
  );
}
