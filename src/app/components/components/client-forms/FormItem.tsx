"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  FaEdit, FaEye, FaDownload, FaEllipsisV, FaCalendarAlt, 
  FaSignature, FaSpinner, FaCheckCircle, FaClock, FaTimesCircle,
  FaCog, FaExclamationTriangle
} from 'react-icons/fa';
import { FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';
import { validateFormSignatures, getSignatureStatusText, formRequiresSignatures } from '@/lib/signatureValidation';

interface FormItemProps {
  assignment: FormAssignmentWithDetails;
  clientId: number;
  selectedForms: number[];
  downloadingPDF: number | null;
  onFormSelect: (assignmentId: number, checked: boolean) => void;
  onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
}

export default function FormItem({
  assignment,
  clientId,
  selectedForms,
  downloadingPDF,
  onFormSelect,
  onDownloadPDF
}: FormItemProps) {
  const router = useRouter();
  const [activeActionMenu, setActiveActionMenu] = useState(false);
  const [showEditWarningModal, setShowEditWarningModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveActionMenu(false);
      }
    };

    if (activeActionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionMenu]);

  // Handle form edit with signature warning
  const handleEditClick = () => {
    setActiveActionMenu(false);
    
    const requiresSignatures = formRequiresSignatures(assignment.form.formKey);
    
    if (requiresSignatures && assignment.currentStatus === 'completed') {
      setShowEditWarningModal(true);
    } else {
      router.push(`/admin/clients/${clientId}/forms/edit/${assignment.id}`);
    }
  };

  const handleEditConfirm = () => {
    setShowEditWarningModal(false);
    router.push(`/admin/clients/${clientId}/forms/edit/${assignment.id}`);
  };

  const handleEditCancel = () => {
    setShowEditWarningModal(false);
  };

  const getFormStatus = (assignment: FormAssignmentWithDetails) => {
    const requiresSignature = formRequiresSignatures(assignment.form.formKey);
    const status = assignment.currentStatus;

    if (status === "completed") {
      return {
        status: requiresSignature ? 'All Signatures Complete' : 'Admin Completed',
        color: 'from-green-100 to-green-200 text-green-800 border-green-300',
        icon: FaCheckCircle,
        bgColor: 'from-green-500 to-green-600',
        iconColor: 'text-white'
      };
    }

    if (status === "in_progress") {
      return {
        status: 'In Progress',
        color: 'from-amber-100 to-amber-200 text-amber-800 border-amber-300',
        icon: requiresSignature ? FaSignature : FaClock,
        bgColor: 'from-amber-500 to-amber-600',
        iconColor: 'text-white'
      };
    }

    if (status === "not_started") {
      return {
        status: 'Not Started',
        color: 'from-gray-100 to-gray-200 text-gray-800 border-gray-300',
        icon: FaClock,
        bgColor: 'from-gray-500 to-gray-600',
        iconColor: 'text-white'
      };
    }

    return {
      status: 'Unknown',
      color: 'from-gray-100 to-gray-200 text-gray-800 border-gray-300',
      icon: FaClock,
      bgColor: 'from-gray-500 to-gray-600',
      iconColor: 'text-white'
    };
  };

  const statusInfo = getFormStatus(assignment);
  const StatusIcon = statusInfo.icon;
  const isSelected = selectedForms.includes(assignment.id);

  return (
    <>
      <div className={`p-6 sm:p-8 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group ${
        isSelected ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' : ''
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            {/* Enhanced Checkbox */}
            {assignment.filledByAdmin && (
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onFormSelect(assignment.id, e.target.checked)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg shadow-sm transform transition-transform duration-200 hover:scale-110"
                />
              </div>
            )}
            
            {!assignment.filledByAdmin && (
              <div className="w-5 h-5 flex-shrink-0"></div>
            )}

            {/* Enhanced Form Icon */}
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${statusInfo.bgColor} shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
              <StatusIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${statusInfo.iconColor}`} />
            </div>

            {/* Enhanced Form Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-200">
                    {assignment.form.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${statusInfo.color} shadow-md border-2`}>
                      {statusInfo.status}
                    </span>
                    {assignment.form.requiresSignature === true && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-2 border-purple-300 shadow-md">
                        <FaSignature className="h-3 w-3" />
                        <span className="hidden sm:inline">Signature Required</span>
                        <span className="sm:hidden">Sig Req</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Metadata */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Version {assignment.form.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">
                      <span className="hidden sm:inline">Assigned </span>
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {assignment.adminFilledAt && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">
                        <span className="hidden sm:inline">Filled </span>
                        {new Date(assignment.adminFilledAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {assignment.clientSignedAt && (
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 font-bold">
                        <span className="hidden sm:inline">Signed </span>
                        {new Date(assignment.clientSignedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Menu */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionMenu(!activeActionMenu);
              }}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 group-hover:bg-white"
            >
              <FaCog className="h-5 w-5 hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Enhanced Action Menu Dropdown */}
            {activeActionMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-dropdown-appear">
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 transition-all duration-200 w-full text-left rounded-lg mx-2"
                >
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <FaEdit className="h-4 w-4" />
                  </div>
                  <span>Edit Form</span>
                </button>
                
                {assignment.hasSubmission && (
                  <>
                    <Link
                      href={`/admin/clients/${clientId}/forms/view/${assignment.id}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 transition-all duration-200 rounded-lg mx-2"
                      onClick={() => setActiveActionMenu(false)}
                    >
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <FaEye className="h-4 w-4" />
                      </div>
                      <span>View Form</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        onDownloadPDF(assignment);
                        setActiveActionMenu(false);
                      }}
                      disabled={downloadingPDF === assignment.id}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 transition-all duration-200 disabled:opacity-50 rounded-lg mx-2"
                    >
                      <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                        {downloadingPDF === assignment.id ? (
                          <FaSpinner className="h-4 w-4 animate-spin" />
                        ) : (
                          <FaDownload className="h-4 w-4" />
                        )}
                      </div>
                      <span>{downloadingPDF === assignment.id ? 'Generating PDF...' : 'Download PDF'}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Edit Warning Modal */}
      {showEditWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 animate-modal-appear">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                  <FaExclamationTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edit Form Warning</h3>
                  <p className="text-sm text-gray-600 mt-1">This action may invalidate signatures</p>
                </div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
                <div className="flex items-start gap-3">
                  <FaSignature className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-2">Important Notice:</p>
                    <p className="mb-3">
                      This form has been completed and contains client signatures. 
                      <strong> Proceeding with editing may invalidate the signature(s)</strong> and the form will need to be re-signed.
                    </p>
                    <p className="text-amber-700">
                      ⚠️ Please make sure to download a copy of this form before making any edits to preserve the original version.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Form:</span> {assignment.form.title}
                </p>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Proceed to Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes dropdown-appear {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-dropdown-appear {
          animation: dropdown-appear 0.2s ease-out forwards;
        }
        
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
