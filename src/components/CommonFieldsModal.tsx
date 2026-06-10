"use client";

import {
  formatDateForInput,
  formatDateForStorage,
} from "@/lib/dateFormatHelper";
import { useState } from "react";
import {
  FaTimes,
  FaSave,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCalendarAlt,
  FaUserCircle,
  FaInfoCircle,
  FaFileAlt,
} from "react-icons/fa";

export interface CommonField {
  id?: number;
  clientId: string | number;
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
  surname?: string;
  // Phase II fields
  preferredName?: string;
  pronouns?: string;
  homePhone?: string;
  suburb?: string;
  preferredLanguage?: string;
  secondaryDisability?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  ndisPlanStartDate?: string;
  ndisPlanEndDate?: string;
  fundingType?: string;
  planManagerName?: string;
  planManagerOrg?: string;
  planManagerEmail?: string;
  planManagerPhone?: string;
  nomineeName?: string;
  nomineeRelationship?: string;
  nomineePhone?: string;
  nomineeEmail?: string;
  nomineeAuthorized?: string;
  hasSupportCoordinator?: string;
  scName?: string;
  scOrganisation?: string;
  scAddress?: string;
  scEmail?: string;
  scPhone?: string;
  [key: string]: unknown;
}

interface CommonFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  commonFields: CommonField | null;
  onFieldChange: (
    field: keyof CommonField,
    value: string | number | null
  ) => void;
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
  clientName,
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
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : null;
  };

  // Enhanced handleCommonFieldsChange to auto-calculate age when DOB changes
  const handleFieldChangeWithAge = (
    field: keyof CommonField,
    value: string | number | null
  ) => {
    if (!commonFields) return;

    // If DOB is being updated, automatically calculate and update age
    if (field === "dob" && typeof value === "string") {
      const calculatedAge = calculateAge(value);
      onFieldChange("age", calculatedAge);
    }

    onFieldChange(field, value);
  };

  if (!isOpen || !commonFields) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-azure-100 animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-azure-700 via-azure-600 to-gold-600 p-8 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-azure-700/90 via-azure-600/90 to-gold-600/90"></div>
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
                  <p className="text-white/90 font-medium">{clientName}</p>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Update the common fields shared across all forms for this
                  client
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
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-azure-50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-azure-50 to-azure-50 rounded-2xl p-6 border border-azure-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-azure-500 to-azure-500 rounded-xl shadow-lg">
                    <FaUser className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-azure-700">
                    Personal Information
                  </h4>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaUser className="h-4 w-4 text-azure-500" />
                      <span>First Name</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.name || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("name", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter First name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaUser className="h-4 w-4 text-azure-500" />
                      <span>Surname</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.surname || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("surname", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter Surname"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaCalendarAlt className="h-4 w-4 text-azure-500" />
                      <span>Date of Birth</span>
                      <div className="flex items-center space-x-1 ml-2">
                        <FaInfoCircle className="h-3 w-3 text-gold-500" />
                        <span className="text-xs text-gold-600 font-medium">
                          (Age will be auto-calculated)
                        </span>
                      </div>
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(commonFields.dob || "")}
                      onChange={(e) =>
                        handleFieldChangeWithAge(
                          "dob",
                          formatDateForStorage(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaCalendarAlt className="h-4 w-4 text-azure-300" />
                      <span>Age</span>
                      <span className="text-xs text-azure-400 font-medium ml-2">
                        (Auto-calculated from Date of Birth)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={
                          commonFields.age !== null &&
                          commonFields.age !== undefined
                            ? `${commonFields.age} years`
                            : "Not calculated"
                        }
                        readOnly
                        className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl bg-gradient-to-r from-azure-50 to-azure-100 text-azure-500 cursor-not-allowed focus:outline-none shadow-sm"
                        placeholder="Age will be calculated from date of birth"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-azure-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaUserCircle className="h-4 w-4 text-azure-500" />
                      <span>Sex/Gender</span>
                    </label>
                    <select
                      value={commonFields.sex || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("sex", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaIdCard className="h-4 w-4 text-azure-500" />
                      <span>NDIS Number</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.ndis || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("ndis", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter NDIS number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaInfoCircle className="h-4 w-4 text-azure-500" />
                      <span>Disability Information</span>
                    </label>
                    <textarea
                      value={commonFields.disability || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("disability", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                      placeholder="Enter disability information"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Address Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-azure-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-azure-500 rounded-xl shadow-lg">
                    <FaEnvelope className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-azure-700">
                    Contact & Address
                  </h4>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaEnvelope className="h-4 w-4 text-emerald-500" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={commonFields.email || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaPhone className="h-4 w-4 text-emerald-500" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={commonFields.phone || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                      <span>Street Address</span>
                    </label>
                    <input
                      type="text"
                      value={commonFields.street || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("street", e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                      <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                      <span>Full Address</span>
                    </label>
                    <textarea
                      value={commonFields.address || ""}
                      onChange={(e) =>
                        handleFieldChangeWithAge("address", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                      placeholder="Enter complete address"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                        <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                        <span>State</span>
                      </label>
                      <select
                        value={commonFields.state || ""}
                        onChange={(e) =>
                          handleFieldChangeWithAge("state", e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                      >
                        <option value="">Select state</option>
                        <option value="Australian Capital Territory">
                          Australian Capital Territory
                        </option>
                        <option value="New South Wales">New South Wales</option>
                        <option value="Northern Territory">
                          Northern Territory
                        </option>
                        <option value="Queensland">Queensland</option>
                        <option value="South Australia">South Australia</option>
                        <option value="Tasmania">Tasmania</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Western Australia">
                          Western Australia
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-azure-600 mb-3">
                        <FaMapMarkerAlt className="h-4 w-4 text-emerald-500" />
                        <span>Post Code</span>
                      </label>
                      <input
                        type="text"
                        value={commonFields.postCode || ""}
                        onChange={(e) =>
                          handleFieldChangeWithAge("postCode", e.target.value)
                        }
                        className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                        placeholder="Enter post code"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase II Additional Fields - inside scrollable content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

            {/* Additional Details Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-azure-50 to-azure-50 rounded-2xl p-6 border border-azure-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-azure-600 to-azure-500 rounded-xl shadow-lg">
                    <FaUser className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-azure-700">Additional Details</h4>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Preferred Name</label>
                    <input type="text" value={commonFields.preferredName || ''} onChange={(e) => handleFieldChangeWithAge('preferredName', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" placeholder="Preferred name" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Pronouns</label>
                    <input type="text" value={commonFields.pronouns || ''} onChange={(e) => handleFieldChangeWithAge('pronouns', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" placeholder="e.g., He/Him, She/Her" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Home Phone</label>
                    <input type="tel" value={commonFields.homePhone || ''} onChange={(e) => handleFieldChangeWithAge('homePhone', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Suburb / City</label>
                    <input type="text" value={commonFields.suburb || ''} onChange={(e) => handleFieldChangeWithAge('suburb', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Preferred Language & Communication</label>
                    <input type="text" value={commonFields.preferredLanguage || ''} onChange={(e) => handleFieldChangeWithAge('preferredLanguage', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" placeholder="e.g., English, Auslan" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Secondary Disability</label>
                    <input type="text" value={commonFields.secondaryDisability || ''} onChange={(e) => handleFieldChangeWithAge('secondaryDisability', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gold-50 to-azure-50 rounded-2xl p-6 border border-gold-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-gold-500 to-azure-500 rounded-xl shadow-lg">
                    <FaPhone className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-azure-700">Emergency Contact</h4>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Contact Name</label>
                    <input type="text" value={commonFields.emergencyContactName || ''} onChange={(e) => handleFieldChangeWithAge('emergencyContactName', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Contact Phone</label>
                    <input type="tel" value={commonFields.emergencyContactPhone || ''} onChange={(e) => handleFieldChangeWithAge('emergencyContactPhone', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* NDIS Plan & Support Coordinator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

            {/* NDIS Plan Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gold-50 to-azure-50 rounded-2xl p-6 border border-gold-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-gold-500 to-azure-500 rounded-xl shadow-lg">
                    <FaFileAlt className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-azure-700">NDIS Plan</h4>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Plan Start Date</label>
                    <input type="date" value={commonFields.ndisPlanStartDate || ''} onChange={(e) => handleFieldChangeWithAge('ndisPlanStartDate', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Plan End Date</label>
                    <input type="date" value={commonFields.ndisPlanEndDate || ''} onChange={(e) => handleFieldChangeWithAge('ndisPlanEndDate', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Funding Type</label>
                    <select value={commonFields.fundingType || ''} onChange={(e) => handleFieldChangeWithAge('fundingType', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md">
                      <option value="">Select...</option>
                      <option value="self_managed">Self Managed</option>
                      <option value="plan_managed">Plan Managed</option>
                      <option value="ndia_managed">NDIA Managed</option>
                      <option value="nominee_managed">Nominee Managed</option>
                    </select>
                  </div>
                  {commonFields.fundingType === 'plan_managed' && (
                    <>
                      <div className="pt-2 border-t border-gold-100">
                        <p className="text-sm font-semibold text-gold-700 mb-3">Plan Manager</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Name</label>
                        <input type="text" value={commonFields.planManagerName || ''} onChange={(e) => handleFieldChangeWithAge('planManagerName', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Organisation</label>
                        <input type="text" value={commonFields.planManagerOrg || ''} onChange={(e) => handleFieldChangeWithAge('planManagerOrg', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Email</label>
                        <input type="email" value={commonFields.planManagerEmail || ''} onChange={(e) => handleFieldChangeWithAge('planManagerEmail', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Phone</label>
                        <input type="tel" value={commonFields.planManagerPhone || ''} onChange={(e) => handleFieldChangeWithAge('planManagerPhone', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                    </>
                  )}
                  {commonFields.fundingType === 'nominee_managed' && (
                    <>
                      <div className="pt-2 border-t border-gold-100">
                        <p className="text-sm font-semibold text-gold-700 mb-3">Nominee / Guardian</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Name</label>
                        <input type="text" value={commonFields.nomineeName || ''} onChange={(e) => handleFieldChangeWithAge('nomineeName', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Relationship</label>
                        <input type="text" value={commonFields.nomineeRelationship || ''} onChange={(e) => handleFieldChangeWithAge('nomineeRelationship', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Phone</label>
                        <input type="tel" value={commonFields.nomineePhone || ''} onChange={(e) => handleFieldChangeWithAge('nomineePhone', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Email</label>
                        <input type="email" value={commonFields.nomineeEmail || ''} onChange={(e) => handleFieldChangeWithAge('nomineeEmail', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Is Nominee Authorized?</label>
                        <select value={commonFields.nomineeAuthorized || ''} onChange={(e) => handleFieldChangeWithAge('nomineeAuthorized', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md">
                          <option value="">Select...</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Support Coordinator Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-azure-50 to-azure-50 rounded-2xl p-6 border border-azure-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-azure-500 to-azure-500 rounded-xl shadow-lg">
                    <FaUser className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-azure-700">Support Coordinator</h4>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-azure-600 mb-3 block">Has Support Coordinator?</label>
                    <select value={commonFields.hasSupportCoordinator || ''} onChange={(e) => handleFieldChangeWithAge('hasSupportCoordinator', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md">
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {commonFields.hasSupportCoordinator === 'yes' && (
                    <>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Coordinator Name</label>
                        <input type="text" value={commonFields.scName || ''} onChange={(e) => handleFieldChangeWithAge('scName', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Organisation</label>
                        <input type="text" value={commonFields.scOrganisation || ''} onChange={(e) => handleFieldChangeWithAge('scOrganisation', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Email</label>
                        <input type="email" value={commonFields.scEmail || ''} onChange={(e) => handleFieldChangeWithAge('scEmail', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Phone</label>
                        <input type="tel" value={commonFields.scPhone || ''} onChange={(e) => handleFieldChangeWithAge('scPhone', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-azure-600 mb-3 block">Address</label>
                        <input type="text" value={commonFields.scAddress || ''} onChange={(e) => handleFieldChangeWithAge('scAddress', e.target.value)} className="w-full px-4 py-3 border-2 border-azure-100 rounded-xl focus:ring-4 focus:ring-gold-500/20 focus:border-azure-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gradient-to-r from-azure-50 to-white border-t border-azure-100 p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-gold-500 to-gold-500 rounded-xl shadow-lg">
                <FaInfoCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-azure-600">
                  Shared Information
                </p>
                <p className="text-xs text-azure-400">
                  These details will be shared across all forms for this participant
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-azure-600 bg-white border-2 border-azure-200 rounded-xl hover:bg-azure-50 hover:border-azure-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
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
                className="px-8 py-3 bg-gradient-to-r from-azure-700 via-azure-600 to-gold-600 text-white rounded-xl hover:from-azure-800 hover:via-azure-700 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
