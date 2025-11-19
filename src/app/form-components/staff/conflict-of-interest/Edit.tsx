"use client";

import React, { useState, useEffect, useRef } from 'react';
import FormPage from '@/components/ui/FormPage';
import SignatureCanvas from '@/components/ui/SignatureCanvas';

interface ConflictOfInterestFormData {
  // Employee Information
  name: string;
  position: string;
  department: string;
  date: string;

  // Section 1: Disclosure of Potential Conflict of Interest
  hasConflict: 'yes' | 'no' | '';
  conflictDescription: string;

  // Section 2: Relationships with Vendors, Clients, or Competitors
  hasVendorRelationship: 'yes' | 'no' | '';
  vendorDetails: string;

  // Section 3: Outside Employment or Business Activities
  hasOutsideEmployment: 'yes' | 'no' | '';
  employmentDetails: string;

  // Section 4: Acknowledgment and Certification
  employeeSignature: string;
  employeeDate: string;

  // For HR/Management Use Only
  reviewedBy: string;
  reviewerTitle: string;
  reviewDate: string;
  actionTaken: string;
  hrDecision: 'noConflict' | 'mitigation' | 'furtherReview' | '';
  reviewerSignature: string;
  reviewerDate: string;
}

interface ConflictOfInterestEditProps {
  initialData?: Partial<ConflictOfInterestFormData>;
  onDataChange?: (data: ConflictOfInterestFormData) => void;
  readOnly?: boolean;
  showButtons?: boolean;
  isAdmin?: boolean; // If true, allows editing HR section
}

export default function ConflictOfInterestEdit({
  initialData = {},
  onDataChange,
  readOnly = false,
  isAdmin = false,
}: ConflictOfInterestEditProps) {
  const [formData, setFormData] = useState<ConflictOfInterestFormData>({
    name: '',
    position: '',
    department: '',
    date: '',
    hasConflict: '',
    conflictDescription: '',
    hasVendorRelationship: '',
    vendorDetails: '',
    hasOutsideEmployment: '',
    employmentDetails: '',
    employeeSignature: '',
    employeeDate: '',
    reviewedBy: '',
    reviewerTitle: '',
    reviewDate: '',
    actionTaken: '',
    hrDecision: '',
    reviewerSignature: '',
    reviewerDate: '',
    ...initialData,
  });

  // Use ref to store the callback to avoid infinite loops
  const onDataChangeRef = useRef(onDataChange);
  const isInitialMount = useRef(true);
  const skipNextUpdate = useRef(false);

  // Update the ref whenever the callback changes
  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  // Sync from initialData once on mount (only if it has data)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      skipNextUpdate.current = true; // Skip the first onDataChange call for initial data
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, []); // Only run once on mount

  // Call onDataChange when formData changes (after initial mount)
  // This must be in useEffect to avoid calling setState during render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Still notify parent of initial data if it exists
      if (skipNextUpdate.current) {
        skipNextUpdate.current = false;
        onDataChangeRef.current?.(formData);
      }
      return;
    }
    
    // Skip if this was an update from initialData sync
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      onDataChangeRef.current?.(formData);
      return;
    }
    
    // Always call onDataChange when formData changes after initial mount
    onDataChangeRef.current?.(formData);
  }, [formData]);

  const handleInputChange = (field: keyof ConflictOfInterestFormData, value: string | 'yes' | 'no' | 'noConflict' | 'mitigation' | 'furtherReview') => {
    // Only update state - onDataChange will be called by useEffect
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderYesNoRadio = (
    field: keyof ConflictOfInterestFormData,
    value: 'yes' | 'no' | '',
    yesLabel: string,
    noLabel: string
  ) => {
    return (
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={field}
            value="yes"
            checked={value === 'yes'}
            onChange={() => handleInputChange(field, 'yes')}
            disabled={readOnly}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <span>{yesLabel}</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={field}
            value="no"
            checked={value === 'no'}
            onChange={() => handleInputChange(field, 'no')}
            disabled={readOnly}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <span>{noLabel}</span>
        </label>
      </div>
    );
  };

  const renderTextField = (field: keyof ConflictOfInterestFormData, className: string = '') => {
    return (
      <input
        type="text"
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={readOnly}
        className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${className} ${readOnly ? 'bg-gray-100' : ''}`}
      />
    );
  };

  const renderDateField = (field: keyof ConflictOfInterestFormData) => {
    return (
      <input
        type="date"
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={readOnly}
        className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${readOnly ? 'bg-gray-100' : ''}`}
      />
    );
  };

  const renderTextareaField = (field: keyof ConflictOfInterestFormData, rows: number = 4) => {
    return (
      <textarea
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={readOnly}
        rows={rows}
        className={`w-full min-h-[4rem] px-2 py-1 border border-gray-300 bg-white rounded resize-y ${readOnly ? 'bg-gray-100' : ''}`}
        style={{
          minHeight: '4rem',
          maxHeight: '12rem',
          overflowY: 'auto'
        }}
      />
    );
  };

  const renderRadio = (
    field: keyof ConflictOfInterestFormData,
    value: string,
    label: string,
    currentValue: string
  ) => {
    return (
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name={field}
          value={value}
          checked={currentValue === value}
          onChange={(e) => handleInputChange(field, e.target.value as any)}
          disabled={readOnly}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <span>{label}</span>
      </label>
    );
  };

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page 1 - Employee Information and Section 1 */}
        <FormPage
          title="Conflict of Interest Disclosure Form"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Employee Information Section */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Employee Information</h2>
            <div className="border border-gray-300">
              <div className="grid grid-cols-2">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Name <span className="text-red-500">*</span></div>
                <div className="p-3">
                  {renderTextField('name')}
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Position <span className="text-red-500">*</span></div>
                <div className="p-3">
                  {renderTextField('position')}
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Department <span className="text-red-500">*</span></div>
                <div className="p-3">
                  {renderTextField('department')}
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-gray-300">
                <div className="bg-gray-100 border-r border-gray-300 p-3 text-sm font-medium text-gray-800">Date <span className="text-red-500">*</span></div>
                <div className="p-3">
                  {renderDateField('date')}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Disclosure of Potential Conflict of Interest */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 1: Disclosure of Potential Conflict of Interest</h2>
            <p className="text-sm text-gray-700 mb-3">
              Do you have any financial, personal, or professional interests that may conflict, or appear to conflict, with your duties at Infinity Supports WA Pty Ltd?
            </p>
            <div className="mb-3">
              {renderYesNoRadio(
                'hasConflict',
                formData.hasConflict,
                'Yes, I have a potential conflict to disclose. (Please provide details below.)',
                'No, I do not have any conflicts to disclose.'
              )}
            </div>
            {formData.hasConflict === 'yes' && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Description of the potential conflict of interest: <span className="text-red-500">*</span>
                </p>
                {renderTextareaField('conflictDescription', 5)}
              </div>
            )}
            {formData.hasConflict === 'no' && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Description of the potential conflict of interest:</p>
                <textarea
                  value=""
                  disabled
                  rows={3}
                  className="w-full min-h-[3rem] px-2 py-1 border border-gray-300 bg-gray-100 rounded resize-y cursor-not-allowed"
                  placeholder="Not applicable - No conflict disclosed"
                />
              </div>
            )}
          </div>

          {/* Section 2: Relationships with Vendors, Clients, or Competitors */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 2: Relationships with Vendors, Clients, or Competitors</h2>
            <p className="text-sm text-gray-700 mb-3">
              Do you or any immediate family members have any financial interest, employment, or any other relationship with any vendors, clients, or competitors of Infinity Supports WA?
            </p>
            <div className="mb-3">
              {renderYesNoRadio(
                'hasVendorRelationship',
                formData.hasVendorRelationship,
                'Yes (If yes, please describe the relationship below.)',
                'No'
              )}
            </div>
            {formData.hasVendorRelationship === 'yes' && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Vendor Relationship Details: <span className="text-red-500">*</span>
                </p>
                {renderTextareaField('vendorDetails', 4)}
              </div>
            )}
            {formData.hasVendorRelationship === 'no' && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Vendor Relationship Details:</p>
                <textarea
                  value=""
                  disabled
                  rows={3}
                  className="w-full min-h-[3rem] px-2 py-1 border border-gray-300 bg-gray-100 rounded resize-y cursor-not-allowed"
                  placeholder="Not applicable - No vendor relationship"
                />
              </div>
            )}
          </div>

          {/* Section 3: Outside Employment or Business Activities */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 3: Outside Employment or Business Activities</h2>
            <p className="text-sm text-gray-700 mb-3">
              Are you engaged in any outside employment, consulting, or business activities that may impact your role at Infinity Supports WA?
            </p>
            <div className="mb-3">
              {renderYesNoRadio(
                'hasOutsideEmployment',
                formData.hasOutsideEmployment,
                'Yes (If yes, please describe below.)',
                'No'
              )}
            </div>
            {formData.hasOutsideEmployment === 'yes' && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Outside Employment Details: <span className="text-red-500">*</span>
                </p>
                {renderTextareaField('employmentDetails', 4)}
              </div>
            )}
            {formData.hasOutsideEmployment === 'no' && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Outside Employment Details:</p>
                <textarea
                  value=""
                  disabled
                  rows={3}
                  className="w-full min-h-[3rem] px-2 py-1 border border-gray-300 bg-gray-100 rounded resize-y cursor-not-allowed"
                  placeholder="Not applicable - No outside employment"
                />
              </div>
            )}
          </div>
        </FormPage>

        {/* Page 2 - Section 4: Acknowledgment and HR Review */}
        <FormPage
          title="Conflict of Interest Disclosure Form"
          meta={{
            website: '',
            version: '',
            reviewDate: ''
          }}
        >
          {/* Section 4: Acknowledgment and Certification */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Section 4: Acknowledgment and Certification</h2>
            <p className="text-sm text-gray-700 mb-4">
              I certify that the information provided above is complete and accurate to the best of my knowledge. I understand that failure to disclose a potential conflict of interest may result in disciplinary action, up to and including termination of employment. If a potential conflict arises after signing this form, I will promptly notify Infinity Supports WA in writing.
            </p>
            <div className="border border-gray-300 p-3 mb-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Employee Signature: <span className="text-red-500">*</span></p>
                <div className="border border-gray-300 rounded">
                  <SignatureCanvas
                    existingSignature={formData.employeeSignature}
                    onSignatureEnd={(signature) => handleInputChange('employeeSignature', signature)}
                    onSignatureClear={() => handleInputChange('employeeSignature', '')}
                    width={600}
                    height={100}
                    className="bg-white"
                    disabled={readOnly}
                  />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Date: <span className="text-red-500">*</span></p>
                {renderDateField('employeeDate')}
              </div>
            </div>
          </div>

          {/* For HR/Management Use Only */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 mb-3">For HR/Management Use Only</h2>
            {!isAdmin && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800 font-semibold">
                  ⚠️ This section is for HR/Management use only. Staff members cannot fill this section.
                </p>
              </div>
            )}
            <div className={`border border-gray-300 p-3 mb-4 ${!isAdmin ? 'opacity-60' : ''}`}>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-2">Reviewed by: <span className="text-red-500">*</span></p>
                  <input
                    type="text"
                    value={formData.reviewedBy}
                    onChange={(e) => handleInputChange('reviewedBy', e.target.value)}
                    disabled={readOnly || !isAdmin}
                    className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${readOnly || !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-2">Title: <span className="text-red-500">*</span></p>
                  <input
                    type="text"
                    value={formData.reviewerTitle}
                    onChange={(e) => handleInputChange('reviewerTitle', e.target.value)}
                    disabled={readOnly || !isAdmin}
                    className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${readOnly || !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Date: <span className="text-red-500">*</span></p>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => handleInputChange('reviewDate', e.target.value)}
                  disabled={readOnly || !isAdmin}
                  className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${readOnly || !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Action Taken (if applicable):</p>
                <textarea
                  value={formData.actionTaken}
                  onChange={(e) => handleInputChange('actionTaken', e.target.value)}
                  disabled={readOnly || !isAdmin}
                  rows={2}
                  className={`w-full min-h-[2.5rem] px-2 py-1 border border-gray-300 bg-white rounded resize-y ${readOnly || !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">HR Decision: <span className="text-red-500">*</span></p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hrDecision"
                      value="noConflict"
                      checked={formData.hrDecision === 'noConflict'}
                      onChange={(e) => handleInputChange('hrDecision', e.target.value as any)}
                      disabled={readOnly || !isAdmin}
                      className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${readOnly || !isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    />
                    <span className={readOnly || !isAdmin ? 'text-gray-500' : ''}>No conflict found</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hrDecision"
                      value="mitigation"
                      checked={formData.hrDecision === 'mitigation'}
                      onChange={(e) => handleInputChange('hrDecision', e.target.value as any)}
                      disabled={readOnly || !isAdmin}
                      className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${readOnly || !isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    />
                    <span className={readOnly || !isAdmin ? 'text-gray-500' : ''}>Conflict identified and mitigation plan implemented</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hrDecision"
                      value="furtherReview"
                      checked={formData.hrDecision === 'furtherReview'}
                      onChange={(e) => handleInputChange('hrDecision', e.target.value as any)}
                      disabled={readOnly || !isAdmin}
                      className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 ${readOnly || !isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    />
                    <span className={readOnly || !isAdmin ? 'text-gray-500' : ''}>Further review required</span>
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Signature of Reviewer: <span className="text-red-500">*</span></p>
                <div className="border border-gray-300 rounded mb-3">
                  <SignatureCanvas
                    existingSignature={formData.reviewerSignature}
                    onSignatureEnd={(signature) => handleInputChange('reviewerSignature', signature)}
                    onSignatureClear={() => handleInputChange('reviewerSignature', '')}
                    width={600}
                    height={100}
                    className="bg-white"
                    disabled={readOnly || !isAdmin}
                  />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-800 mb-2">Date: <span className="text-red-500">*</span></p>
                <input
                  type="date"
                  value={formData.reviewerDate}
                  onChange={(e) => handleInputChange('reviewerDate', e.target.value)}
                  disabled={readOnly || !isAdmin}
                  className={`w-full h-8 px-2 border border-gray-300 bg-white rounded ${readOnly || !isAdmin ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
          </div>
        </FormPage>
      </div>
    </div>
  );
}

