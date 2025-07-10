"use client";

import { useState } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';

export interface CommonField {
  id?: number;
  clientId: number;
  name?: string;
  age?: number | null;
  email?: string;
  sex?: string;
  street?: string;
  state?: string;
  postCode?: string;
  dob?: string;
  ndis?: string;
  disability?: string;
  address?: string;
  phone?: string;
}

interface CommonFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  commonFields: CommonField | null;
  onFieldChange: (field: keyof CommonField, value: string | number | null) => void;
  onSave: () => void;
  onSubmitWithSignatureCheck: (updatedFields: CommonField) => void; // New prop for signature checking
  isUpdating: boolean;
  clientName?: string;
}

export default function CommonFieldsModal({
  isOpen,
  onClose,
  commonFields,
  onFieldChange,
  onSave,
  onSubmitWithSignatureCheck,
  isUpdating,
  clientName
}: CommonFieldsModalProps) {
  // Age calculation function
  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    // Check if the date is valid
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // If birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  };

  // Enhanced handleCommonFieldsChange to auto-calculate age when DOB changes
  const handleFieldChangeWithAge = (field: keyof CommonField, value: string | number | null) => {
    if (!commonFields) return;
    
    // If DOB is being updated, automatically calculate and update age
    if (field === 'dob' && typeof value === 'string') {
      const calculatedAge = calculateAge(value);
      onFieldChange('age', calculatedAge);
    }
    
    onFieldChange(field, value);
  };

  if (!isOpen || !commonFields) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Update Common Details - {clientName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Update the common fields shared across all forms
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={commonFields.name || ''}
                  onChange={(e) => handleFieldChangeWithAge('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                  <span className="text-xs text-orange-600 ml-2">(Age will be auto-calculated)</span>
                </label>
                <input
                  type="date"
                  value={commonFields.dob || ''}
                  onChange={(e) => handleFieldChangeWithAge('dob', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                  <span className="text-xs text-gray-500 ml-2">(Auto-calculated from Date of Birth)</span>
                </label>
                <input
                  type="text"
                  value={commonFields.age !== null && commonFields.age !== undefined ? `${commonFields.age} years` : 'Not calculated'}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                  placeholder="Age will be calculated from date of birth"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sex/Gender
                </label>
                <select
                  value={commonFields.sex || ''}
                  onChange={(e) => handleFieldChangeWithAge('sex', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NDIS Number
                </label>
                <input
                  type="text"
                  value={commonFields.ndis || ''}
                  onChange={(e) => handleFieldChangeWithAge('ndis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter NDIS number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disability Information
                </label>
                <textarea
                  value={commonFields.disability || ''}
                  onChange={(e) => handleFieldChangeWithAge('disability', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter disability information"
                />
              </div>
            </div>

            {/* Contact & Address Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Contact & Address
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={commonFields.email || ''}
                  onChange={(e) => handleFieldChangeWithAge('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={commonFields.phone || ''}
                  onChange={(e) => handleFieldChangeWithAge('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={commonFields.street || ''}
                  onChange={(e) => handleFieldChangeWithAge('street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  value={commonFields.address || ''}
                  onChange={(e) => handleFieldChangeWithAge('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={commonFields.state || ''}
                    onChange={(e) => handleFieldChangeWithAge('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select state</option>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="WA">WA</option>
                    <option value="SA">SA</option>
                    <option value="TAS">TAS</option>
                    <option value="ACT">ACT</option>
                    <option value="NT">NT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Code
                  </label>
                  <input
                    type="text"
                    value={commonFields.postCode || ''}
                    onChange={(e) => handleFieldChangeWithAge('postCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter post code"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            These details will be shared across all forms for this client
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (commonFields && onSubmitWithSignatureCheck) {
                  onSubmitWithSignatureCheck(commonFields);
                } else {
                  onSave();
                }
              }}
              disabled={isUpdating}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isUpdating ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 h-4 w-4" />
                  Update Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

