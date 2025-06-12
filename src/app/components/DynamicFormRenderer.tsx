"use client";

import React from 'react';
import formRegistry from '../forms/registry';

interface DynamicFormRendererProps {
  formKey: string;
  formSchema: any;
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>; // Add field errors prop
}

/**
 * DynamicFormRenderer - Renders the appropriate form component based on formKey
 *
 * This component acts as a bridge between the form registry and the application.
 * It selects the correct form component based on the formKey and passes all
 * necessary props to it.
 */
const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  formKey,
  formSchema,
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false,
  fieldErrors = {} // Default to empty object
}) => {
  // Get the appropriate form component based on formKey
  const FormComponent = formRegistry[formKey];

  if (!FormComponent) {
    return (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p>Form type "{formKey}" not found in registry.</p>
        <p className="text-sm mt-2">Please check that the form key is correct and the form component is registered.</p>
      </div>
    );
  }

  return (
    <FormComponent
      formData={formData}
      formSchema={formSchema}
      commonFieldsData={commonFieldsData}
      onChange={onChange}
      onSubmit={onSubmit}
      readOnly={readOnly}
      fieldErrors={fieldErrors} // Pass field errors to the form component
    />
  );
};

export default DynamicFormRenderer;
