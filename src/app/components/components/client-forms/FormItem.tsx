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
import EditWarningModal from '@/components/ui/EditWarningModal';
import FormActionDropdown from '@/components/ui/FormActionDropdown';

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
  const dropdownTriggerRef : any = useRef<HTMLButtonElement>(null);

  // Handle form edit with signature warning
  const handleEditClick = () => {
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
                        <span className="hidden sm:inline">Last Edited </span>
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
          <div className="relative flex-shrink-0">
            <button
              ref={dropdownTriggerRef}
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionMenu(!activeActionMenu);
              }}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 group-hover:bg-white"
            >
              <FaCog className="h-5 w-5 hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Portal-based Action Menu Dropdown */}
            <FormActionDropdown
              isOpen={activeActionMenu}
              onClose={() => setActiveActionMenu(false)}
              triggerRef={dropdownTriggerRef}
              onEditClick={handleEditClick}
              clientId={clientId}
              assignmentId={assignment.id}
              hasSubmission={assignment.hasSubmission}
              onDownloadPDF={() => onDownloadPDF(assignment)}
              downloadingPDF={downloadingPDF === assignment.id}
            />
          </div>
        </div>
      </div>

      {/* Portal-based Edit Warning Modal */}
      <EditWarningModal
        isOpen={showEditWarningModal}
        onClose={handleEditCancel}
        onConfirm={handleEditConfirm}
        formTitle={assignment.form.title}
      />
    </>
  );
}
