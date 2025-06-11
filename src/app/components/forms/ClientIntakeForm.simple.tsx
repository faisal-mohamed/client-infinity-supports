"use client";

import React, { useState, useEffect } from 'react';
import { FaAsterisk, FaArrowRight } from 'react-icons/fa';

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
    ...{
      date: new Date().toISOString().split('T')[0], // Default to today's date
      ndisNumber: '',
      givenName: '',
      surname: '',
      sex: [], // For multiple options, use an array
      pronoun: '',
      aboriginalTorres: [], // Aboriginal or Torres Strait Island descent options
      preferredName: '',
      dateOfBirth: '',

      // Residential Address Details
      addressNumberStreet: '',
      state: '',
      postcode: '',

      // Participant Contact Details
      email: '',
      homePhone: '',
      mobile: '',

      // Disability Conditions
      disabilityConditions: '',

      // GP Medical Contact
      medicalCentreName: '',
      medicalPhone: '',

      // Support Coordinator
      supportCoordinatorName: '',
      supportCoordinatorEmail: '',
      supportCoordinatorCompany: '',
      supportCoordinatorContact: '',

      // Other Supports
      otherSupports: '',

      // All About Me
      advocateName: '',
      advocateRelationship: '',
      advocatePhone: '',
      advocateMobile: '',
      advocateEmail: '',
      advocateAddress: '',
      advocatePostalAddress: '',
      advocateOtherInfo: '',
      barriers: '', // Yes/No field, can be a string like 'yes' or 'no'
      interpreter: '', // Yes/No field
      language: '',
      culturalValues: '',
      culturalBehaviours: '',
      writtenCommunication: '',
      countryOfBirth: '',

      // Contacts, Living and Travel
      primaryContactName: '',
      primaryContactRelationship: '',
      primaryContactHomePhone: '',
      primaryContactMobile: '',
      secondaryContactName: '',
      secondaryContactRelationship: '',
      secondaryContactHomePhone: '',
      secondaryContactMobile: '',
      livingArrangements: [], // Array to hold selected options
      livingArrangementsOther: '', // For "Other" option
      travelArrangements: [], // Array to hold selected options
      travelArrangementsOther: '', // For "Other" option

      // Medication Information
      medicationChart: '', // Yes/No field
      mealtimeManagement: '', // Yes/No field
      bowelCare: '', // Yes/No field
      menstrualIssues: '', // Yes/No field
      epilepsy: '', // Yes/No field
      asthmatic: '', // Yes/No field
      allergies: '', // Yes/No field
      anaphylactic: '', // Yes/No field
      minorInjury: '', // Yes/No field
      training: '', // Yes/No field
      othermedical: '', // Yes/No field
      trigger: '', // Yes/No field

      // Safety Considerations
      absconding: '', // Yes/No field
      historyOfFalls: '', // Yes/No field
      behaviourConcern: '', // Yes/No field
      positiveBehaviour: '', // Yes/No field
      communicationAssistance: '', // Yes/No field
      physicalAssistance: '', // Yes/No field
      languageConcern: '', // Yes/No field
      personalGoals: '', // Yes/No field
    },
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

  // Handle input change - direct approach
  const handleInputChange = (key: string, value: any) => {
    // Only check if form is read-only
    if (readOnly) {
      return; // Don't allow changes
    }
    
    // Update the specific field directly
    setValues({ ...values, [key]: value });
  };

  // Handle checkbox change - direct approach
  const handleCheckboxChange = (key: string, option: string, checked: boolean) => {
    // Only check if form is read-only
    if (readOnly) {
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
    return readOnly; // Only disable if form is in readOnly mode
  };

  // Helper function to get field background color
  const getFieldBgColor = (keyName: string) => {
    return readOnly ? 'bg-gray-50' : '';
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

  // TextArea Component
  const TextArea = ({ label, keyName, height = 100, colSpan = 1 }) => {
    const isMapped = mappedFields[keyName];
    const disabled = isFieldDisabled(keyName);
    const bgColor = getFieldBgColor(keyName);
    
    return (
      <div className={`${colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          value={values[keyName] || ""}
          onChange={(e) => handleInputChange(keyName, e.target.value)}
          style={{ height: `${height}px` }}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${bgColor}`}
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

  // Checkbox Group Component
  const CheckboxGroup = ({ label, keyName, options, colSpan = 1 }) => {
    const isMapped = mappedFields[keyName];
    const disabled = isFieldDisabled(keyName);
    
    return (
      <div className={`${colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={Array.isArray(values[keyName]) 
                  ? values[keyName].includes(option) 
                  : values[keyName] === option}
                onChange={(e) => handleCheckboxChange(keyName, option, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={disabled}
              />
              <span className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This selection is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  // Yes/No Question Component
  const YesNoQuestion = ({ label, keyName, yesDetail }) => {
    const isMapped = mappedFields[keyName];
    const disabled = isFieldDisabled(keyName);
    
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="flex space-x-4 mb-3">
          <label className="flex items-center">
            <input
              type="radio"
              name={keyName}
              value="yes"
              checked={values[keyName] === 'yes'}
              onChange={(e) => handleInputChange(keyName, e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              disabled={disabled}
            />
            <span className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
              Yes
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={keyName}
              value="no"
              checked={values[keyName] === 'no'}
              onChange={(e) => handleInputChange(keyName, e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              disabled={disabled}
            />
            <span className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
              No
            </span>
          </label>
        </div>
        {values[keyName] === 'yes' && yesDetail && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">{yesDetail}</label>
            <textarea
              value={values[`${keyName}_detail`] || ''}
              onChange={(e) => handleInputChange(`${keyName}_detail`, e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                disabled ? 'bg-gray-100' : ''
              }`}
              rows={3}
              disabled={disabled}
            />
          </div>
        )}
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This response is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  // Section Header Component
  const SectionHeader = ({ title, bgColor = "bg-blue-600" }) => (
    <div className={`${bgColor} text-white p-4 rounded-t-lg mb-0`}>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="text-4xl mb-3 font-bold">∞</div>
            <h1 className="text-2xl font-bold mb-1">Infinity Supports WA</h1>
            <p className="text-lg opacity-90">Client Intake Form</p>
            <p className="text-sm opacity-75 mt-1">Achieving Goals and Beyond</p>
          </div>
        </div>

        {/* Pre-filled information notice */}
        {Object.keys(mappedFields).length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Some fields have been pre-filled with your profile information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form content */}
        <form onSubmit={(e) => { e.preventDefault(); if (onSubmit) onSubmit(values); }}>
          {/* Participant Details */}
          <SectionHeader title="Participant Details" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput label="Date:" keyName="date" colSpan={2} />
              <TextInput label="NDIS Number:" keyName="ndisNumber" colSpan={2} />
              <TextInput label="Given name(s):" keyName="givenName" />
              <TextInput label="Surname:" keyName="surname" />
              <CheckboxGroup label="Sex:" keyName="sex" options={["Male", "Female", "Prefer not to say"]} />
              <TextInput label="Pronoun:" keyName="pronoun" colSpan={3} />
              <CheckboxGroup label="Are you an Aboriginal or Torres Strait Island descent?" keyName="aboriginalTorres" options={["Yes", "No"]} />
              <TextInput label="Preferred name:" keyName="preferredName" colSpan={2} />
              <TextInput label="Date of Birth:" keyName="dateOfBirth" type="date" />
            </div>
          </div>

          {/* Residential Address Details */}
          <SectionHeader title="Residential Address Details" bgColor="bg-green-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput label="Number / Street:" keyName="addressNumberStreet" colSpan={3} />
              <TextInput label="State:" keyName="state" />
              <TextInput label="Postcode:" keyName="postcode" colSpan={2} />
            </div>
          </div>

          {/* Participant Contact Details */}
          <SectionHeader title="Participant Contact Details" bgColor="bg-blue-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput label="Email address:" keyName="email" type="email" colSpan={3} />
              <TextInput label="Home Phone No:" keyName="homePhone" />
              <TextInput label="Mobile No:" keyName="mobile" colSpan={2} />
            </div>
          </div>

          {/* Disability Conditions */}
          <SectionHeader title="Disability Conditions/Disability type(s)" bgColor="bg-red-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <TextArea label="Please describe disability conditions/types:" keyName="disabilityConditions" height={150} colSpan={3} />
          </div>

          {/* GP Medical Contact */}
          <SectionHeader title="GP Medical Contact" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Medical Centre Name:" keyName="medicalCentreName" colSpan={2} />
              <TextInput label="Phone:" keyName="medicalPhone" colSpan={2} />
            </div>
          </div>

          {/* Support Coordinator */}
          <SectionHeader title="Support Coordinator" bgColor="bg-gray-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Name:" keyName="supportCoordinatorName" />
              <TextInput label="Email Address:" keyName="supportCoordinatorEmail" />
              <TextInput label="Company:" keyName="supportCoordinatorCompany" />
              <TextInput label="Contact number:" keyName="supportCoordinatorContact" />
            </div>
          </div>

          <SectionHeader title="Other Supports" bgColor="bg-gray-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <TextArea label="What other supports including mainstream health services you receive at present:" keyName="otherSupports" height={256} colSpan={2} />
          </div>

          {/* Rest of the form sections... */}
          
          {/* Submit button */}
          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientIntakeForm;
