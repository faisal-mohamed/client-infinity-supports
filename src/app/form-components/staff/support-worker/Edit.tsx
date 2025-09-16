"use client";

import React, { useState, useEffect } from 'react';
import FormPage from '@/components/ui/FormPage';
import { useToast } from '@/components/ui/Toast';

interface SupportWorkerFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  
  // Employment Information
  startDate: string;
  positionTitle: string;
  businessUnit: string;
  reportsTo: string;
  
  // Experience & Qualifications
  previousExperience: string;
  qualifications: string;
  certifications: string[];
  
  // Availability
  availableDays: string[];
  availableHours: string;
  preferredLocation: string;
  
  // Skills & Preferences
  skills: string[];
  preferredClientTypes: string[];
  specializations: string[];
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  // Declaration
  agreeToTerms: boolean;
  agreeToCodeOfConduct: boolean;
  agreeToPrivacyPolicy: boolean;
  
  // Signature
  signature: string;
  signatureDate: string;
}

interface SupportWorkerEditProps {
  data?: Partial<SupportWorkerFormData>;
  onSubmit?: (data: SupportWorkerFormData) => void;
  onSave?: (data: SupportWorkerFormData) => void;
  readOnly?: boolean;
  staffId?: string;
}

export default function SupportWorkerEdit({ 
  data, 
  onSubmit, 
  onSave, 
  readOnly = false,
  staffId 
}: SupportWorkerEditProps) {
  const [formData, setFormData] = useState<SupportWorkerFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
    startDate: '',
    positionTitle: 'Support Worker',
    businessUnit: '',
    reportsTo: '',
    previousExperience: '',
    qualifications: '',
    certifications: [],
    availableDays: [],
    availableHours: '',
    preferredLocation: '',
    skills: [],
    preferredClientTypes: [],
    specializations: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    agreeToTerms: false,
    agreeToCodeOfConduct: false,
    agreeToPrivacyPolicy: false,
    signature: '',
    signatureDate: '',
    ...data
  });

  // Force readOnly to false to ensure form is editable
  const isFormEditable = true; // This will make all fields editable

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const handleInputChange = (field: keyof SupportWorkerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: keyof SupportWorkerFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.emergencyContactName) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    if (!formData.agreeToCodeOfConduct) newErrors.agreeToCodeOfConduct = 'You must agree to the code of conduct';
    if (!formData.agreeToPrivacyPolicy) newErrors.agreeToPrivacyPolicy = 'You must agree to the privacy policy';
    if (!formData.signature) newErrors.signature = 'Signature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
          showToast({
        type: 'error',
        title: 'Please fill in all required fields',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Add staff ID to form data
      const submitData = {
        ...formData,
        staffId,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      };

      if (onSubmit) {
        await onSubmit(submitData);
      }

      showToast({
        type: 'success',
        title: 'Support Worker form submitted successfully!',
        message: 'Your application has been submitted successfully.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error submitting form',
        message: 'Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    try {
      const saveData = {
        ...formData,
        staffId,
        savedAt: new Date().toISOString(),
        status: 'draft'
      };

      if (onSave) {
        await onSave(saveData);
      }
      
      showToast({
        type: 'success',
        title: 'Form saved successfully!',
        message: 'Your form has been saved successfully.'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error saving form',
        message: 'Please try again.'
      });
    }
  };

  const renderField = (label: string, field: keyof SupportWorkerFormData, type: string = 'text', required: boolean = false) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isFormEditable}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
    </div>
  );

  const renderSelect = (label: string, field: keyof SupportWorkerFormData, options: string[], required: boolean = false) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isFormEditable}
        aria-label={label}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {errors[field] && <p className="text-sm text-red-600">{errors[field]}</p>}
    </div>
  );

  const renderCheckbox = (label: string, field: keyof SupportWorkerFormData, required: boolean = false) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={formData[field] as boolean}
        onChange={(e) => handleInputChange(field, e.target.checked)}
        disabled={!isFormEditable}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {errors[field] && <p className="text-sm text-red-600 ml-2">{errors[field]}</p>}
    </div>
  );

  const renderMultiCheckbox = (label: string, field: keyof SupportWorkerFormData, options: string[]) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={(formData[field] as string[]).includes(option)}
              onChange={(e) => handleArrayChange(field, option, e.target.checked)}
              disabled={!isFormEditable}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 py-8">
      <FormPage title="Support Worker Application Form" meta={{ website: 'infinitysupportswa.org', version: 'SW001', reviewDate: '2025-03-01' }}>
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('First Name', 'firstName', 'text', true)}
              {renderField('Last Name', 'lastName', 'text', true)}
              {renderField('Date of Birth', 'dateOfBirth', 'date', true)}
              {renderField('Phone Number', 'phone', 'tel', true)}
              {renderField('Email Address', 'email', 'email', true)}
              {renderField('Address', 'address', 'text', true)}
              {renderField('Suburb', 'suburb', 'text', true)}
              {renderSelect('State', 'state', ['WA', 'NSW', 'VIC', 'QLD', 'SA', 'TAS', 'NT', 'ACT'], true)}
              {renderField('Postcode', 'postcode', 'text', true)}
            </div>
          </div>

          {/* Employment Information */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Start Date', 'startDate', 'date', true)}
              {renderField('Position Title', 'positionTitle', 'text', true)}
              {renderField('Business Unit', 'businessUnit', 'text')}
              {renderField('Reports To', 'reportsTo', 'text')}
            </div>
          </div>

          {/* Experience & Qualifications */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience & Qualifications</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Experience</label>
                <textarea
                  value={formData.previousExperience}
                  onChange={(e) => handleInputChange('previousExperience', e.target.value)}
                  disabled={!isFormEditable}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isFormEditable ? 'bg-gray-100' : ''
                  }`}
                  placeholder="Describe your previous experience in support work or related fields..."
                />
              </div>
              {renderField('Qualifications', 'qualifications', 'text')}
              {renderMultiCheckbox('Certifications', 'certifications', [
                'First Aid Certificate',
                'CPR Certificate',
                'NDIS Worker Screening Check',
                'Working with Children Check',
                'Police Clearance',
                'Manual Handling Certificate',
                'Mental Health First Aid',
                'Other'
              ])}
            </div>
          </div>

          {/* Availability */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderMultiCheckbox('Available Days', 'availableDays', [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
              ])}
              {renderField('Available Hours', 'availableHours', 'text')}
              {renderField('Preferred Location', 'preferredLocation', 'text')}
            </div>
          </div>

          {/* Skills & Preferences */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Preferences</h3>
            <div className="space-y-4">
              {renderMultiCheckbox('Skills', 'skills', [
                'Personal Care', 'Domestic Assistance', 'Community Access', 'Transport', 'Meal Preparation',
                'Medication Management', 'Behavioral Support', 'Communication Support', 'Mobility Support'
              ])}
              {renderMultiCheckbox('Preferred Client Types', 'preferredClientTypes', [
                'Elderly', 'Disability Support', 'Mental Health', 'Children', 'Adults', 'All Ages'
              ])}
              {renderMultiCheckbox('Specializations', 'specializations', [
                'Autism Support', 'Physical Disability', 'Intellectual Disability', 'Mental Health',
                'Aged Care', 'Palliative Care', 'Respite Care', 'Community Participation'
              ])}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('Emergency Contact Name', 'emergencyContactName', 'text', true)}
              {renderField('Emergency Contact Phone', 'emergencyContactPhone', 'tel', true)}
              {renderField('Relationship', 'emergencyContactRelationship', 'text')}
            </div>
          </div>

          {/* Declaration */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
            <div className="space-y-4">
              {renderCheckbox('I agree to the terms and conditions', 'agreeToTerms', true)}
              {renderCheckbox('I agree to abide by the Code of Conduct', 'agreeToCodeOfConduct', true)}
              {renderCheckbox('I agree to the Privacy Policy', 'agreeToPrivacyPolicy', true)}
            </div>
          </div>

          {/* Signature */}
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  disabled={!isFormEditable}
                  placeholder="Type your full name as a digital signature"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.signature ? 'border-red-500' : 'border-gray-300'
                  } ${!isFormEditable ? 'bg-gray-100' : ''}`}
                />
                {errors.signature && <p className="text-sm text-red-600">{errors.signature}</p>}
              </div>
              {renderField('Date', 'signatureDate', 'date', true)}
            </div>
          </div>

          {/* Action Buttons */}
          {!isFormEditable && (
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          )}
        </div>
      </FormPage>
    </div>
  );
}
