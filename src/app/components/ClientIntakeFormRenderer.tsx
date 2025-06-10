// src/components/ClientIntakeFormRenderer.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaAsterisk } from 'react-icons/fa';

interface ClientIntakeFormRendererProps {
  formKey: string;
  formSchema: any;
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  readOnly?: boolean;
}

const ClientIntakeFormRenderer: React.FC<ClientIntakeFormRendererProps> = ({
  formKey,
  formSchema,
  formData,
  commonFieldsData,
  onChange,
  readOnly = false
}) => {
  const [values, setValues] = useState<any>(formData || {});

  // Update parent component when values change
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  // Handle field value change
  const handleFieldChange = (key: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Check if a field should be pre-filled and read-only
  const isCommonField = (key: string) => {
    return commonFieldsData && commonFieldsData.hasOwnProperty(key);
  };

  // Determine which schema to use based on the form key
  const getSchemaForForm = () => {
    if (formKey === 'client_intake_form') {
      return formSchema.clientIntakeSchema;
    } else if (formSchema.allAboutMeSchema) {
      return formSchema.allAboutMeSchema;
    } else if (formSchema.medicationInfoSchema) {
      return formSchema.medicationInfoSchema;
    } else if (formSchema.safetyConsiderationSchema) {
      return formSchema.safetyConsiderationSchema;
    } else if (formSchema.gpMedicalSupportSchema) {
      return formSchema.gpMedicalSupportSchema;
    } else if (formSchema.contactsLivingTravelSchema) {
      return formSchema.contactsLivingTravelSchema;
    }

    // Default to the first schema found
    return Object.values(formSchema)[0];
  };

  // Get the appropriate schema
  const schema = getSchemaForForm();

  // Render a field based on its type and configuration
  const renderField = (field: any, index: number) => {
    // Handle section headers
    if (field.type === 'sectionHeader') {
      return (
        <div
          key={`header-${index}`}
          className={`col-span-${field.colSpan || 1} py-2 px-4 font-bold text-lg ${field.bgColor || 'bg-blue-100'}`}
        >
          {field.label}
        </div>
      );
    }

    // Handle contact headers
    if (field.type === 'contactHeader') {
      return (
        <div
          key={`contact-header-${index}`}
          className="col-span-2 py-2 px-4 font-bold text-lg bg-blue-50 mt-4"
        >
          {field.label}
        </div>
      );
    }

    // Handle contact rows
    if (field.type === 'contactRow') {
      return (
        <div
          key={`contact-row-${index}`}
          className="grid grid-cols-2 gap-4 col-span-2 mb-4"
        >
          {field.columns.map((column: any, colIndex: number) => (
            <div key={`col-${colIndex}`} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {column.label}
              </label>
              {renderInputField(column.key, 'text')}
            </div>
          ))}
        </div>
      );
    }

    // Handle box sections
    if (field.type === 'boxSection') {
      return (
        <div
          key={`box-section-${index}`}
          className="col-span-2 border border-gray-200 rounded-md p-4 mb-4"
        >
          <h3 className="font-bold mb-2">{field.heading}</h3>
          <p className="mb-4">{field.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {field.options.map((option: string, optIndex: number) => (
              <div key={`opt-${optIndex}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.key}-${optIndex}`}
                  checked={values[field.key] === option}
                  onChange={() => handleFieldChange(field.key, option)}
                  disabled={readOnly || isCommonField(field.key)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`${field.key}-${optIndex}`} className="ml-2 text-sm text-gray-900">
                  {option}
                </label>
              </div>
            ))}
          </div>
          {field.otherKey && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Other (please specify):
              </label>
              {renderInputField(field.otherKey, 'text')}
            </div>
          )}
        </div>
      );
    }

    // For standard fields with a key, render the appropriate input
    if (field.key) {
      const fieldWidth = field.width || '100%';
      const colSpan = field.colSpan || 1;

      return (
        <div
          key={field.key}
          className={`col-span-${colSpan}`}
          style={{ width: fieldWidth }}
        >
          {field.label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && (
                <FaAsterisk className="inline-block text-red-500 text-xs ml-1" />
              )}
            </label>
          )}
          {renderInputField(field.key, field.type, field)}
        </div>
      );
    }

    // For fields without a key (like some custom fields)
    return (
      <div key={`field-${index}`} className="col-span-1">
        {field.label && (
          <div className="text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </div>
        )}
      </div>
    );
  };

  // Render the appropriate input field based on type
  const renderInputField = (key: string, type: string, fieldConfig: any = {}) => {
    const isCommon = isCommonField(key);
    const fieldValue = isCommon ? commonFieldsData[key] : values[key] || '';
    const isDisabled = readOnly || isCommon;

    // Common classes for all input types
    const baseClasses = `w-full px-3 py-2 border ${
      isDisabled ? 'bg-gray-100 border-gray-300' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    } rounded-md shadow-sm`;

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            disabled={isDisabled}
            className={baseClasses}
            required={fieldConfig.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            disabled={isDisabled}
            className={baseClasses}
            rows={fieldConfig.height ? Math.floor(fieldConfig.height / 20) : 4}
            required={fieldConfig.required}
          />
        );

      case 'checkboxGroup':
        return (
          <div className="flex flex-wrap gap-4">
            {fieldConfig.options.map((option: string, i: number) => (
              <div key={`${key}-${i}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${key}-${i}`}
                  checked={Array.isArray(fieldValue) ? fieldValue.includes(option) : fieldValue === option}
                  onChange={() => {
                    if (Array.isArray(fieldValue)) {
                      // Toggle in array
                      const newValue = fieldValue.includes(option)
                        ? fieldValue.filter((v: string) => v !== option)
                        : [...fieldValue, option];
                      handleFieldChange(key, newValue);
                    } else {
                      // Single selection
                      handleFieldChange(key, option);
                    }
                  }}
                  disabled={isDisabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`${key}-${i}`} className="ml-2 text-sm text-gray-900">
                  {option}
                </label>
              </div>
            ))}
            {fieldConfig.otherKey && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`${key}-other`}
                  checked={!!values[fieldConfig.otherKey]}
                  onChange={() => {
                    if (values[fieldConfig.otherKey]) {
                      handleFieldChange(fieldConfig.otherKey, '');
                    } else {
                      handleFieldChange(fieldConfig.otherKey, ' ');
                    }
                  }}
                  disabled={isDisabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`${key}-other`} className="ml-2 text-sm text-gray-900">
                  Other:
                </label>
                <input
                  type="text"
                  value={values[fieldConfig.otherKey] || ''}
                  onChange={(e) => handleFieldChange(fieldConfig.otherKey, e.target.value)}
                  disabled={isDisabled || !values[fieldConfig.otherKey]}
                  className="ml-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            disabled={isDisabled}
            className={baseClasses}
            required={fieldConfig.required}
          />
        );
    }
  };

  // Render the client intake form
  const renderClientIntakeForm = () => {
    if (!schema) return null;

    return (
      <div className="space-y-6">
        {schema.logo && (
          <div className="flex justify-center mb-4">
            <Image
              src={schema.logo.src}
              alt={schema.logo.alt}
              width={schema.logo.width}
              height={schema.logo.height}
            />
          </div>
        )}

        {schema.pageTitle && (
          <h1 className="text-xl font-bold text-center mb-6">
            {schema.pageTitle}
          </h1>
        )}

        {schema.title && (
          <h1 className="text-xl font-bold text-center mb-6">
            {schema.title}
          </h1>
        )}

        {/* For client intake form with fields array */}
        {schema.fields && Array.isArray(schema.fields) && (
          <div className="grid grid-cols-3 gap-4">
            {schema.fields.map((field: any, index: number) => renderField(field, index))}
          </div>
        )}

        {/* For medication info schema with yes/no questions */}
        {schema.fields && !Array.isArray(schema.fields) && (
          <div className="border border-gray-200 rounded-md p-4">
            {Object.entries(schema.fields).map(([fieldKey, field]: [string, any], index: number) => (
              <div key={fieldKey} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <label className="text-sm font-medium text-gray-700 flex-1">
                    {field.label}
                  </label>

                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`${fieldKey}-yes`}
                        name={fieldKey}
                        value="Yes"
                        checked={values[fieldKey] === 'Yes'}
                        onChange={() => handleFieldChange(fieldKey, 'Yes')}
                        disabled={readOnly || isCommonField(fieldKey)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`${fieldKey}-yes`} className="ml-2 text-sm text-gray-900">
                        Yes
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`${fieldKey}-no`}
                        name={fieldKey}
                        value="No"
                        checked={values[fieldKey] === 'No'}
                        onChange={() => handleFieldChange(fieldKey, 'No')}
                        disabled={readOnly || isCommonField(fieldKey)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`${fieldKey}-no`} className="ml-2 text-sm text-gray-900">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {field.yesDetail && values[fieldKey] === 'Yes' && (
                  <div className="mt-2 ml-4 pl-4 border-l-2 border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.yesDetail}
                    </label>
                    <textarea
                      value={values[`${fieldKey}Detail`] || ''}
                      onChange={(e) => handleFieldChange(`${fieldKey}Detail`, e.target.value)}
                      disabled={readOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* For forms with sections like allAboutMeSchema */}
        {schema.sections && (
          <div className="space-y-6">
            {Object.entries(schema.sections).map(([sectionKey, section]: [string, any]) => (
              <div key={sectionKey} className="border border-gray-200 rounded-md p-4">
                <h2 className="text-lg font-bold mb-4">{section.title}</h2>

                {section.fields && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(section.fields).map(([fieldKey, field]: [string, any]) => {
                      // Handle different field structures
                      if (typeof field === 'string') {
                        // Simple label field
                        return (
                          <div key={fieldKey} className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field}
                            </label>
                            {renderInputField(fieldKey, 'text')}
                          </div>
                        );
                      } else if (typeof field === 'object') {
                        // Complex field with options
                        return (
                          <div key={fieldKey} className="col-span-2 mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label}
                            </label>

                            {field.options && (
                              <div className="flex space-x-4 mb-2">
                                {field.options.map((option: string, i: number) => (
                                  <div key={`${fieldKey}-${i}`} className="flex items-center">
                                    <input
                                      type="radio"
                                      id={`${fieldKey}-${i}`}
                                      name={fieldKey}
                                      value={option}
                                      checked={values[fieldKey] === option}
                                      onChange={() => handleFieldChange(fieldKey, option)}
                                      disabled={readOnly || isCommonField(fieldKey)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor={`${fieldKey}-${i}`} className="ml-2 text-sm text-gray-900">
                                      {option}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}

                            {field.followUp && values[fieldKey] === 'Yes' && (
                              <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {field.followUp}
                                </label>
                                <textarea
                                  value={values[`${fieldKey}Detail`] || ''}
                                  onChange={(e) => handleFieldChange(`${fieldKey}Detail`, e.target.value)}
                                  disabled={readOnly}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                  rows={3}
                                />
                              </div>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {schema.footer && (
          <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Infinity Support Services. All rights reserved.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="client-intake-form">
      {renderClientIntakeForm()}
    </div>
  );
};

export default ClientIntakeFormRenderer;