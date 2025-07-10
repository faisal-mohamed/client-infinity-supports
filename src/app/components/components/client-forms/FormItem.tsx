"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  FaEdit, FaEye, FaDownload, FaEllipsisV, FaCalendarAlt, 
  FaSignature, FaSpinner, FaCheckCircle, FaClock, FaTimesCircle 
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
  const [activeActionMenu, setActiveActionMenu] = useState(false);
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

  const getFormStatus = (assignment: FormAssignmentWithDetails) => {
    const requiresSignature = formRequiresSignatures(assignment.form.formKey);
    
    // If form has been filled by admin and requires signatures, validate them
    if (assignment.filledByAdmin && requiresSignature && assignment.formData) {
      const signatureValidation = validateFormSignatures(assignment.form.formKey, assignment.formData);
      
      if (signatureValidation.isComplete) {
        return {
          status: getSignatureStatusText(signatureValidation),
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: FaCheckCircle,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500'
        };
      } else if (signatureValidation.completedCount > 0) {
        return {
          status: getSignatureStatusText(signatureValidation),
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: FaSignature,
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-500'
        };
      } else {
        return {
          status: 'Ready for Signatures',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: FaSignature,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500'
        };
      }
    }
    
    // Fallback to legacy logic for backward compatibility
    if (assignment.clientSignature === "true") {
      return {
        status: 'All Signatures Complete',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: FaCheckCircle,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-500'
      };
    }
    
    if (assignment.filledByAdmin && !requiresSignature) {
      return {
        status: 'Admin Completed',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: FaCheckCircle,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-500'
      };
    } else if (assignment.hasSubmission) {
      return {
        status: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: FaClock,
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-500'
      };
    } else {
      return {
        status: 'Not Started',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: FaTimesCircle,
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-400'
      };
    }
  };

  const statusInfo = getFormStatus(assignment);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          {/* Checkbox for signature link generation - show for admin-filled forms */}
          {assignment.filledByAdmin && (
            <input
              type="checkbox"
              checked={selectedForms.includes(assignment.id)}
              onChange={(e) => onFormSelect(assignment.id, e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded flex-shrink-0"
            />
          )}
          
          {/* Placeholder space for forms that are not completed */}
          {!assignment.isCompleted && (
            <div className="w-4 h-4 flex-shrink-0"></div>
          )}

          {/* Form Icon */}
          <div className={`p-2 sm:p-3 rounded-lg ${statusInfo.bgColor} flex-shrink-0`}>
            <StatusIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${statusInfo.iconColor}`} />
          </div>

          {/* Form Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                {assignment.form.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                  {statusInfo.status}
                </span>
                {/* Signature requirement indicator */}
                {assignment.form.requiresSignature === true && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    <FaSignature className="mr-1 h-2 w-2" />
                    <span className="hidden sm:inline">Signature Required</span>
                    <span className="sm:hidden">Sig Req</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <span>Version {assignment.form.version}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <FaCalendarAlt className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="hidden sm:inline">Assigned </span>
                {new Date(assignment.assignedAt).toLocaleDateString()}
              </span>
              {assignment.adminFilledAt && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Filled {new Date(assignment.adminFilledAt).toLocaleDateString()}</span>
                  <span className="sm:hidden text-green-600">Admin Filled</span>
                </>
              )}
              {assignment.clientSignedAt && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-green-600 font-medium">
                    <span className="hidden sm:inline">Signed {new Date(assignment.clientSignedAt).toLocaleDateString()}</span>
                    <span className="sm:hidden">Client Signed</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative flex-shrink-0 self-start sm:self-center" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveActionMenu(!activeActionMenu);
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <FaEllipsisV className="h-4 w-4" />
          </button>

          {/* Action Menu Dropdown */}
          {activeActionMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
              <Link
                href={`/admin/clients/${clientId}/forms/edit/${assignment.id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setActiveActionMenu(false)}
              >
                <FaEdit className="mr-3 h-4 w-4 text-indigo-500 flex-shrink-0" />
                Edit Form
              </Link>
              
              {assignment.hasSubmission && (
                <>
                  <Link
                    href={`/admin/clients/${clientId}/forms/view/${assignment.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveActionMenu(false)}
                  >
                    <FaEye className="mr-3 h-4 w-4 text-green-500 flex-shrink-0" />
                    View Form
                  </Link>
                  
                  <button
                    onClick={() => {
                      onDownloadPDF(assignment);
                      setActiveActionMenu(false);
                    }}
                    disabled={downloadingPDF === assignment.id}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {downloadingPDF === assignment.id ? (
                      <FaSpinner className="mr-3 h-4 w-4 text-orange-500 animate-spin flex-shrink-0" />
                    ) : (
                      <FaDownload className="mr-3 h-4 w-4 text-orange-500 flex-shrink-0" />
                    )}
                    {downloadingPDF === assignment.id ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
