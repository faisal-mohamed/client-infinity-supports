// src/components/DynamicFormRenderer.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaAsterisk } from 'react-icons/fa';

interface DynamicFormRendererProps {
  formKey: string;
  formSchema: any;
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  readOnly?: boolean;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  formKey,
  formSchema,
  formData,
  commonFieldsData,
  onChange,
  readOnly = false
}) => {
  const [values, setValues] = useState<any>(formData || {});

  // Define mapping between form fields and common fields
  const commonFieldsMapping: Record<string, string> = {
    ndisNumber: 'ndis',
    givenName: 'name',
    sex: 'sex',
    dateOfBirth: 'dob',
    addressNumberStreet: 'street',
    state: 'state',
    postcode: 'postCode',
    email: 'email',
    disabilityConditions: 'disability',
    age: 'age'
  };

  // Initialize form with common fields data
  useEffect(() => {
    if (commonFieldsData && Object.keys(commonFieldsData).length > 0) {
      const initialValues = { ...formData };

      // Map common fields to form fields
      Object.entries(commonFieldsMapping).forEach(([formKey, commonKey]) => {
        if (commonFieldsData[commonKey] !== undefined) {
          initialValues[formKey] = commonFieldsData[commonKey];
        }
      });

      setValues(initialValues);
    }
  }, [commonFieldsData, formData]);

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
    const commonKey = commonFieldsMapping[key];
    return commonKey && commonFieldsData && commonFieldsData[commonKey] !== undefined;
  };

  // Determine which schema to use based on the form key
  const getActiveSchema = () => {
    if (formSchema.clientIntakeSchema) return formSchema.clientIntakeSchema;
    if (formSchema.medicationInfoSchema) return formSchema.medicationInfoSchema;
    if (formSchema.allAboutMeSchema) return formSchema.allAboutMeSchema;
    if (formSchema.safetyConsiderationSchema) return formSchema.safetyConsiderationSchema;
    if (formSchema.gpMedicalSupportSchema) return formSchema.gpMedicalSupportSchema;
    if (formSchema.contactsLivingTravelSchema) return formSchema.contactsLivingTravelSchema;

    return null;
  };

  const activeSchema = getActiveSchema();

  if (!activeSchema) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">
          Form schema not found.
        </p>
      </div>
    );
  }

  // Render logo and title
  const renderHeader = () => {
    return (
      <>
        {activeSchema.logo && (
          <div className="flex justify-center mb-6">
            <Image
              src={activeSchema.logo.src}
              alt={activeSchema.logo.alt}
              width={activeSchema.logo.width}
              height={activeSchema.logo.height}
            />
          </div>
        )}

        {activeSchema.pageTitle && (
          <h1 className="text-xl font-bold text-center mb-6">
            {activeSchema.pageTitle}
          </h1>
        )}

        {activeSchema.title && !activeSchema.pageTitle && (
          <h1 className="text-xl font-bold text-center mb-6">
            {activeSchema.title}
          </h1>
        )}
      </>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (activeSchema.footer) {
      return (
        <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Infinity Support Services. All rights reserved.
        </div>
      );
    }
    return null;
  };

  // Render a standard input field
  const renderInputField = (key: string, type: string, isDisabled: boolean, fieldValue: any, fieldConfig: any = {}) => {
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
                  checked={Array.isArray(fieldValue)
                    ? fieldValue.includes(option)
                    : fieldValue === option}
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

  // Render Client Intake Form
  const renderClientIntakeForm = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {activeSchema.fields.map((field: any, index: number) => {
          // If it's a section header, render a heading
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

          // For standard fields with a key, render the appropriate input
          if (field.key) {
            const isCommon = isCommonField(field.key);
            const fieldValue = values[field.key] || '';
            const isDisabled = readOnly || isCommon;

            const colSpan = field.colSpan || 1;
            const fieldWidth = field.width || '100%';

            return (
              <div
                key={field.key}
                className={`col-span-${colSpan}`}
                style={{ width: fieldWidth }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && (
                    <FaAsterisk className="inline-block text-red-500 text-xs ml-1" />
                  )}
                  {isCommon && (
                    <span className="ml-1 text-xs text-blue-600">(Pre-filled)</span>
                  )}
                </label>

                {renderInputField(field.key, field.type, isDisabled, fieldValue, field)}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // Render Medication Info Form
  const renderMedicationInfoForm = () => {
    return (
      <div className="border border-gray-200 rounded-md p-4">
        {Object.entries(activeSchema.fields).map(([fieldKey, field]: [string, any], index: number) => (
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
    );
  };

  // Render All About Me Form
  const renderAllAboutMeForm = () => {
    return (
      <div className="space-y-6">
        {Object.entries(activeSchema.sections).map(([sectionKey, section]: [string, any]) => (
          <div key={sectionKey} className="border border-gray-200 rounded-md p-4">
            <h2 className="text-lg font-bold mb-4">{section.title}</h2>

            {section.fields && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(section.fields).map(([fieldKey, field]: [string, any]) => {
                  // Handle different field structures
                  if (typeof field === 'string') {
                    // Simple label field
                    const isCommon = isCommonField(fieldKey);
                    const fieldValue = values[fieldKey] || '';
                    const isDisabled = readOnly || isCommon;

                    return (
                      <div key={fieldKey} className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field}
                          {isCommon && (
                            <span className="ml-1 text-xs text-blue-600">(Pre-filled)</span>
                          )}
                        </label>
                        {renderInputField(fieldKey, 'text', isDisabled, fieldValue)}
                      </div>
                    );
                  } else if (typeof field === 'object') {
                    // Complex field with options
                    const isCommon = isCommonField(fieldKey);
                    const fieldValue = values[fieldKey] || '';
                    const isDisabled = readOnly || isCommon;

                    return (
                      <div key={fieldKey} className="col-span-2 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {isCommon && (
                            <span className="ml-1 text-xs text-blue-600">(Pre-filled)</span>
                          )}
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
                                  checked={fieldValue === option}
                                  onChange={() => handleFieldChange(fieldKey, option)}
                                  disabled={isDisabled}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor={`${fieldKey}-${i}`} className="ml-2 text-sm text-gray-900">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}

                        {field.followUp && fieldValue === 'Yes' && (
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
    );
  };

  // Render GP Medical Support Form
  const renderGpMedicalSupportForm = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        {activeSchema.fields.map((field: any, index: number) => {
          // If it's a section header, render a heading
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

          // For standard fields with a key, render the appropriate input
          if (field.key) {
            const isCommon = isCommonField(field.key);
            const fieldValue = values[field.key] || '';
            const isDisabled = readOnly || isCommon;

            const colSpan = field.colSpan || 1;
            const fieldWidth = field.width || '100%';

            return (
              <div
                key={field.key}
                className={`col-span-${colSpan}`}
                style={{ width: fieldWidth }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && (
                    <FaAsterisk className="inline-block text-red-500 text-xs ml-1" />
                  )}
                  {isCommon && (
                    <span className="ml-1 text-xs text-blue-600">(Pre-filled)</span>
                  )}
                </label>

                {renderInputField(field.key, field.type, isDisabled, fieldValue, field)}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // Render Safety Consideration Form
  const renderSafetyConsiderationForm = () => {
    return (
      <div className="border border-gray-200 rounded-md p-4">
        {Object.entries(activeSchema.fields).map(([fieldKey, field]: [string, any], index: number) => (
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
    );
  };

  // Render Contacts Living Travel Form
  const renderContactsLivingTravelForm = () => {
    return (
      <div className="space-y-6">
        {activeSchema.fields.map((field: any, index: number) => {
          // Handle contact header
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

          // Handle contact row
          if (field.type === 'contactRow') {
            return (
              <div
                key={`contact-row-${index}`}
                className="grid grid-cols-2 gap-4"
              >
                {field.columns.map((column: any, colIndex: number) => {
                  const isCommon = isCommonField(column.key);
                  const fieldValue = values[column.key] || '';
                  const isDisabled = readOnly || isCommon;

                  return (
                    <div key={`col-${colIndex}`} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        {column.label}
                        {isCommon && (
                          <span className="ml-1 text-xs text-blue-600">(Pre-filled)</span>
                        )}
                      </label>
                      {renderInputField(column.key, 'text', isDisabled, fieldValue)}
                    </div>
                  );
                })}
              </div>
            );
          }

          // Handle box section
          if (field.type === 'boxSection') {
            return (
              <div
                key={`box-section-${index}`}
                className="border border-gray-200 rounded-md p-4 mb-4"
              >
                <h3 className="font-bold mb-2">{field.heading}</h3>
                <p className="mb-4">{field.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {field.options.map((option: string, optIndex: number) => {
                    const isCommon = isCommonField(field.key);
                    const fieldValue = values[field.key] || '';
                    const isDisabled = readOnly || isCommon;

                    return (
                      <div key={`opt-${optIndex}`} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${field.key}-${optIndex}`}
                          checked={fieldValue === option}
                          onChange={() => handleFieldChange(field.key, option)}
                          disabled={isDisabled}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${field.key}-${optIndex}`} className="ml-2 text-sm text-gray-900">
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
                {field.otherKey && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Other (please specify):
                    </label>
                    <input
                      type="text"
                      value={values[field.otherKey] || ''}
                      onChange={(e) => handleFieldChange(field.otherKey, e.target.value)}
                      disabled={readOnly || isCommonField(field.otherKey)}
                      className={`w-full px-3 py-2 border ${
                        readOnly || isCommonField(field.otherKey) ? 'bg-gray-100 border-gray-300' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md shadow-sm`}
                    />
                  </div>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  // Render the appropriate form based on the schema
  const renderFormContent = () => {
    if (activeSchema === formSchema.clientIntakeSchema) {
      return renderClientIntakeForm();
    } else if (activeSchema === formSchema.medicationInfoSchema) {
      return renderMedicationInfoForm();
    } else if (activeSchema === formSchema.allAboutMeSchema) {
      return renderAllAboutMeForm();
    } else if (activeSchema === formSchema.safetyConsiderationSchema) {
      return renderSafetyConsiderationForm();
    } else if (activeSchema === formSchema.gpMedicalSupportSchema) {
      return renderGpMedicalSupportForm();
    } else if (activeSchema === formSchema.contactsLivingTravelSchema) {
      return renderContactsLivingTravelForm();
    }

    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">
          Unknown form schema type.
        </p>
      </div>
    );
  };

  return (
    <div className="dynamic-form-renderer">
      {renderHeader()}
      {renderFormContent()}
      {renderFooter()}
    </div>
  );
};

export default DynamicFormRenderer