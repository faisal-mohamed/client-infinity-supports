"use client";

import React, { useState, useEffect } from 'react';
import { FaAsterisk } from 'react-icons/fa';

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
}

const ClientIntakeForm: React.FC<FormProps> = ({
  formData,
  commonFieldsData,
  onChange,
  onSubmit,
  readOnly = false
}) => {
  // Initialize state with provided formData or default values
  const [values, setValues] = useState<any>({
    // Default values here...
    ...formData // Override defaults with any provided formData
  });

  // Define common fields mapping
  const commonFieldsMapping = {
    ndisNumber: 'ndis',
    givenName: 'name',
    sex: 'sex',
    dateOfBirth: 'dob',
    addressNumberStreet: 'street',
    state: 'state',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    disabilityConditions: 'disability'
  };

  // Track which fields are mapped from common fields
  const [mappedFields, setMappedFields] = useState<Record<string, boolean>>({});

  // Apply common fields data when component mounts or commonFieldsData changes
  useEffect(() => {
    // Map common fields to the corresponding values in formData
    const mappedData: Record<string, any> = {};
    const mappedFieldsTracking: Record<string, boolean> = {};

    // Only map fields if commonFieldsData exists and has values
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      Object.keys(commonFieldsMapping).forEach(key => {
        const commonKey = commonFieldsMapping[key as keyof typeof commonFieldsMapping];
        // Only map if the common field has a non-empty value
        if (commonKey && commonFieldsData[commonKey] !== undefined && 
            commonFieldsData[commonKey] !== null && 
            commonFieldsData[commonKey] !== '') {
          mappedData[key] = commonFieldsData[commonKey];
          mappedFieldsTracking[key] = true; // Mark this field as mapped
        }
      });
    }

    // Update values with common field values
    if (Object.keys(mappedData).length > 0) {
      setValues(prev => ({ ...prev, ...mappedData }));
    }
    
    // Update tracked mapped fields - this should only happen once
    setMappedFields(mappedFieldsTracking);
  }, [commonFieldsData]); // Only depend on commonFieldsData

  // Simple onChange handler - no debouncing
  useEffect(() => {
    // Call the parent's onChange handler directly
    onChange(values);
  }, [values, onChange]);

  // Handle input change - direct approach like in CommonFieldsFormClient
  const handleInputChange = (key: string, value: any) => {
    // Check if this field is mapped from common fields or if form is read-only
    if (mappedFields[key] || readOnly) {
      return; // Don't allow changes
    }
    
    // Update the specific field directly
    setValues({ ...values, [key]: value });
  };

  // Handle checkbox change (multiple selections)
  const handleCheckboxChange = (key: string, option: string, checked: boolean) => {
    // Check if this field is mapped from common fields or if form is read-only
    if (mappedFields[key] || readOnly) {
      return; // Don't allow changes
    }
    
    const current = values[key] || [];
    if (checked) {
      setValues({ ...values, [key]: [...current, option] });
    } else {
      setValues({ ...values, [key]: current.filter((item: string) => item !== option) });
    }
  };

  // Helper function to check if a field is disabled
  const isFieldDisabled = (keyName: string) => {
    return mappedFields[keyName] || readOnly;
  };

  // Helper function to get field background color
  const getFieldBgColor = (keyName: string) => {
    return mappedFields[keyName] ? 'bg-gray-100' : readOnly ? 'bg-gray-50' : '';
  };

  // Text Input Component
  const TextInput = ({ label, keyName, type = "text", colSpan = 1, width = "w-full", required = false }) => {
    const isMapped = mappedFields[keyName];
    const disabled = isFieldDisabled(keyName);
    const bgColor = getFieldBgColor(keyName);
    
    return (
      <div className={`${colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : ''} ${width}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <FaAsterisk className="inline-block text-red-500 text-xs ml-1" />}
        </label>
        <input
          type={type}
          value={values[keyName] || ""}
          onChange={(e) => handleInputChange(keyName, e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${bgColor}`}
          required={required}
          disabled={disabled}
        />
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This field is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  // Rest of your component code...
  // (TextArea, CheckboxGroup, YesNoQuestion, etc.)

  return (
    <div>
      {/* Your form UI here */}
    </div>
  );
};

export default ClientIntakeForm;
