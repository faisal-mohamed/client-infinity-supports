"use client";

import { useState } from 'react';
import { FaTimes, FaSave, FaSpinner, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCalendarAlt, FaUserCircle, FaInfoCircle } from 'react-icons/fa';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Update Common Details
                </h3>
                <div className="flex items-center mt-2 space-x-2">
                  <FaUserCircle className="h-4 w-4 text-white/80" />
                  <p className="text-white/90 font-medium">
                    {clientName}
                  </p>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Update the common fields shared across all forms for this client
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:rotate-90 border border-white/30 backdrop-blur-sm"
            >
              <FaTimes className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <FaUser className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h4>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaUser className="h-4 w-4 text-blue-500" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.name || ''}
                      onChange={(e) => handleFieldChangeWithAge('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                      <span>Date of Birth</span>
                      <div className="flex items-center space-x-1 ml-2">
                        <FaInfoCircle className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">(Age will be auto-calculated)</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={commonFields.dob || ''}
                      onChange={(e) => handleFieldChangeWithAge('dob', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                      <span>Age</span>
                      <span className="text-xs text-gray-500 font-medium ml-2">(Auto-calculated from Date of Birth)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={commonFields.age !== null && commonFields.age !== undefined ? `${commonFields.age} years` : 'Not calculated'}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 cursor-not-allowed focus:outline-none shadow-sm"
                        placeholder="Age will be calculated from date of birth"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaUserCircle className="h-4 w-4 text-blue-500" />
                      <span>Sex/Gender</span>
                    </label>
                    <select
                      value={commonFields.sex || ''}
                      onChange={(e) => handleFieldChangeWithAge('sex', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaIdCard className="h-4 w-4 text-blue-500" />
                      <span>NDIS Number</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.ndis || ''}
                      onChange={(e) => handleFieldChangeWithAge('ndis', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter NDIS number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaInfoCircle className="h-4 w-4 text-blue-500" />
                      <span>Disability Information</span>
                    </label>
                    <textarea
                      value={commonFields.disability || ''}
                      onChange={(e) => handleFieldChangeWithAge('disability', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                      placeholder="Enter disability information"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Address Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <FaEnvelope className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">
                    Contact & Address
                  </h4>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaEnvelope className="h-4 w-4 text-emerald-500" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={commonFields.email || ''}
                      onChange={(e) => handleFieldChangeWithAge('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaPhone className="h-4 w-4 text-emerald-500" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={commonFields.phone || ''}
                      onChange={(e) => handleFieldChangeWithAge('phone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                      <span>Street Address</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.street || ''}
                      onChange={(e) => handleFieldChangeWithAge('street', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                      <span>Full Address</span>
                    </label>
                    <textarea
                      value={commonFields.address || ''}
                      onChange={(e) => handleFieldChangeWithAge('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                      placeholder="Enter complete address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                        <span>State</span>
                      </label>
                      <select
                        value={commonFields.state || ''}
                        onChange={(e) => handleFieldChangeWithAge('state', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
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
                      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                        <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                        <span>Post Code</span>
                      </label>
                      <input
                        type="text"
                        value={commonFields.postCode || ''}
                        onChange={(e) => handleFieldChangeWithAge('postCode', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter post code"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <FaInfoCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Shared Information
                </p>
                <p className="text-xs text-gray-500">
                  These details will be shared across all forms for this client
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
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
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isUpdating ? (
                  <>
                    <FaSpinner className="mr-3 h-5 w-5 animate-spin" />
                    <span>Updating Details...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-3 h-5 w-5" />
                    <span>Update Details</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

