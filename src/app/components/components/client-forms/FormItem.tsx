


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
import StaffNotSubmittedModal from '@/components/ui/StaffNotSubmittedModal';
import FormActionDropdown from '@/components/ui/FormActionDropdown';
import { useConfirm } from '@/components/ui/Confirm';
import { useToast } from '@/components/ui/Toast';
import SignatureLinkModal from '@/app/components/components/client-forms/SignatureLinkModal';

interface FormItemProps {
  assignment: FormAssignmentWithDetails;
  clientId: number;
  selectedForms: number[];
  downloadingPDF: number | null;
  onFormSelect: (assignmentId: number, checked: boolean) => void;
  onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
  isStaff?: boolean; // Indicates if this is a staff form (defaults to false for client forms)
}

export default function FormItem({
  assignment,
  clientId,
  selectedForms,
  downloadingPDF,
  onFormSelect,
  onDownloadPDF,
  isStaff = false
}: FormItemProps) {
  const router = useRouter();
  const [activeActionMenu, setActiveActionMenu] = useState(false);
  const [showEditWarningModal, setShowEditWarningModal] = useState(false);
  const [showStaffNotSubmittedModal, setShowStaffNotSubmittedModal] = useState(false);
  const dropdownTriggerRef : any = useRef<HTMLButtonElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const confirm = useConfirm();
  const { showToast } = useToast();
  const [generatingLink, setGeneratingLink] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    token: string;
    formsCount: number;
    forms: { formTitle: string; formKey: string }[];
    expiresAt: string;
  } | null>(null);
  const [isNavigatingToEdit, setIsNavigatingToEdit] = useState(false);

  const handleEditClick = () => {
    // Check if form was sent via signature link but staff hasn't submitted yet
    // ONLY apply this restriction to Emergency Drill form
    const isWaitingForStaff = assignment.form.formKey === 'emergency_drill' && 
                              !assignment.filledByAdmin && 
                              !assignment.hasSubmission;
    
    if (isWaitingForStaff) {
      // Show "waiting for staff" modal
      setShowStaffNotSubmittedModal(true);
      return;
    }
    
    // Check if editing will invalidate signatures
    const requiresSignatures = formRequiresSignatures(assignment.form.formKey);
    if (requiresSignatures && assignment.currentStatus === 'completed') {
      setShowEditWarningModal(true);
    } else {
      // Use staff route if it's a staff form, otherwise use client route
      const editRoute = isStaff
        ? `/admin/staff/${clientId}/forms/edit/${assignment.id}`
        : `/admin/clients/${clientId}/forms/edit/${assignment.id}`;
      router.push(editRoute);
    }
  };

  const handleEditConfirm = async () => {
    setIsNavigatingToEdit(true);
    setShowEditWarningModal(false);
    
    try {
      // For staff forms, clear all signatures (staff and admin/manager) before navigating
      if (isStaff) {
        try {
          const clearResponse = await fetch(`/api/staff/${clientId}/forms/${assignment.form.formKey}/clear-all-signatures`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignmentId: assignment.id })
          });
          
          if (!clearResponse.ok) {
            console.error('Failed to clear signatures:', await clearResponse.text());
            // Continue anyway - the edit page will handle it
          }
        } catch (error) {
          console.error('Error clearing signatures:', error);
          // Continue anyway - the edit page will handle it
        }
      }
      
    // Use staff route if it's a staff form, otherwise use client route
    const editRoute = isStaff
      ? `/admin/staff/${clientId}/forms/edit/${assignment.id}`
      : `/admin/clients/${clientId}/forms/edit/${assignment.id}`;
    router.push(editRoute);
    } catch (error) {
      console.error('Error navigating to edit:', error);
      setIsNavigatingToEdit(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditWarningModal(false);
    setIsNavigatingToEdit(false);
  };

  const handleDeleteFormAssignment = async () => {
    if (isDeleting) return;
    const confirmed = await confirm.confirm({
      title: "Delete Form Assignment",
      message: "Are you sure you want to delete this form assignment? This will remove associated progress and submissions.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      // Use staff-form-assignments endpoint if it's a staff form, otherwise use form-assignments for client forms
      const apiEndpoint = isStaff 
        ? `/api/staff-form-assignments/${assignment.id}`
        : `/api/form-assignments/${assignment.id}`;
      const response = await fetch(apiEndpoint, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete form assignment");
      window.location.reload();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete form assignment',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const generateEmergencyDrillLink = async () => {
    try {
      setGeneratingLink(true);
      // Generate a signature link for only this assignment
      // Use staff endpoint if it's a staff form, otherwise use client endpoint
      const apiEndpoint = isStaff
        ? `/api/staff/${clientId}/generate-signature-link`
        : `/api/clients/${clientId}/generate-signature-link`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formAssignmentIds: [assignment.id] })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to generate signature link');
      }

      const data = await response.json();
      setGeneratedLink({
        url: data.signatureUrl,
        token: data.token,
        formsCount: data.formsCount,
        forms: data.forms,
        expiresAt: data.expiresAt,
      });
      setShowLinkModal(true);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to generate link',
        duration: 3500,
      });
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyLinkToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast({ type: 'success', title: 'Link Copied', message: 'Signature link copied to clipboard', duration: 2000 });
    } catch (e) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast({ type: 'success', title: 'Link Copied', message: 'Signature link copied to clipboard', duration: 2000 });
    }
  };

  const getFormStatus = (assignment: FormAssignmentWithDetails) => {
    // Vehicle Safety Inspection does NOT require signature
    const formKey = assignment.form.formKey;
    const requiresSignature = formKey === 'vehicle_safety_inspection' 
      ? false 
      : formRequiresSignatures(formKey);
    const status = assignment.currentStatus;
    
    // Check if this form requires admin signature (like employee_details, conflict_of_interest, bullying_training)
    const requiresAdminSignature = isStaff && (
      assignment.form.formKey === 'employee_details' || 
      assignment.form.formKey === 'employment_details' ||
      assignment.form.formKey === 'conflict_of_interest' ||
      assignment.form.formKey === 'bullying_training'
    );
    
    if (status === "completed") {
      // For staff forms with admin signatures
      if (isStaff && requiresAdminSignature) {
        // Both staff and admin have signed
        if (assignment.staffSignature && assignment.adminSignature) {
          return {
            status: 'Both Admin and Staff Signed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
        // Only admin signed (shouldn't happen normally, but handle it)
        if (assignment.adminSignature && !assignment.staffSignature) {
          return {
            status: 'Admin Completed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
        // Only staff signed but status is completed (legacy data or race condition)
        // This should actually be "in_progress" but if status says completed, show Admin Review
        if (assignment.staffSignature && !assignment.adminSignature) {
          return {
            status: 'Admin Review',
            color: 'from-amber-300 to-amber-400 text-amber-800 border-amber-500',
            icon: FaSignature,
            bgColor: 'from-amber-500 to-amber-600',
            iconColor: 'text-white'
          };
        }
      }
      
      // For staff forms without admin signatures
      if (isStaff) {
        // Vehicle Safety Inspection doesn't require signature - if completed, show "Staff Completed"
        if (formKey === 'vehicle_safety_inspection') {
          return {
            status: 'Staff Completed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
        
        if (assignment.staffSignature) {
          return {
            status: requiresSignature ? 'All Signatures Complete' : 'Staff Completed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        } else if (assignment.filledByAdmin) {
          return {
            status: 'Admin Completed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
      }
      
      // For client forms or default
      return {
        status: requiresSignature ? 'All Signatures Complete' : 'Admin Completed',
        color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
        icon: FaCheckCircle,
        bgColor: 'from-emerald-500 to-emerald-600',
        iconColor: 'text-white'
      };
    }
    
    if (status === "in_progress") {
      // For staff forms with admin signatures, check signature status
      if (isStaff && requiresAdminSignature) {
        // Staff has signed but admin hasn't (most common case after staff submits)
        if (assignment.staffSignature && !assignment.adminSignature) {
          return {
            status: 'Admin Review',
            color: 'from-amber-300 to-amber-400 text-amber-800 border-amber-500',
            icon: FaSignature,
            bgColor: 'from-amber-500 to-amber-600',
            iconColor: 'text-white'
          };
        }
        // Both have signed but status is still in_progress (shouldn't happen, but handle it)
        // This can happen if admin just cleared their signature and status was updated
        if (assignment.staffSignature && assignment.adminSignature) {
          // This shouldn't happen, but if it does, show as completed
          return {
            status: 'Both Admin and Staff Signed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
        // Staff hasn't signed yet
        if (!assignment.staffSignature) {
          return {
            status: 'In Progress',
            color: 'from-amber-300 to-amber-400 text-amber-800 border-amber-500',
            icon: FaClock,
            bgColor: 'from-amber-500 to-amber-600',
            iconColor: 'text-white'
          };
        }
      }
      
      // For other forms or default in_progress
      return {
        status: 'In Progress',
        color: 'from-amber-300 to-amber-400 text-amber-800 border-amber-500',
        icon: requiresSignature ? FaSignature : FaClock,
        bgColor: 'from-amber-500 to-amber-600',
        iconColor: 'text-white'
      };
    }
    
    return {
      status: 'Not Started',
      color: 'from-slate-100 to-slate-200 text-slate-800 border-slate-300',
      icon: FaClock,
      bgColor: 'from-slate-500 to-slate-600',
      iconColor: 'text-white'
    };
  };

  const statusInfo = getFormStatus(assignment);
  const StatusIcon = statusInfo.icon;
  const isSelected = selectedForms.includes(assignment.id);

  return (
    <>
      <div className={`relative p-6 sm:p-8  hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group ${
        isSelected ? 'bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-500' : 'bg-white'
      } border border-gray-100 rounded-2xl`}>
        {generatingLink && (
          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            {/* Always show checkbox for staff forms; for client forms, show checkbox only if admin filled or emergency_drill */}
            {(isStaff || assignment.adminFilledAt || assignment.form.formKey === 'emergency_drill') ? (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onFormSelect(assignment.id, e.target.checked)}
                className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-300 rounded-lg shadow-sm hover:scale-110 transition-transform"
              />
            ) : <div className="w-5 h-5" />}

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${statusInfo.bgColor} shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform`}>
              <StatusIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${statusInfo.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                    {assignment.form.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${statusInfo.color} border-2 shadow-md`}>
                      {statusInfo.status}
                    </span>
                    {assignment.form.requiresSignature && 
                     assignment.form.formKey !== 'vehicle_safety_inspection' && 
                     assignment.currentStatus !== 'completed' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-2 border-rose-300 shadow-md">
                        <FaSignature className="h-3 w-3" />
                        <span className="hidden sm:inline">Signature Required</span>
                        <span className="sm:hidden">Sig Req</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="font-medium text-slate-700">Version {assignment.form.version}</span>
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
                  {(assignment.clientSignedAt || (isStaff && assignment.staffSignedAt)) && (
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 font-bold">
                        <span className="hidden sm:inline">Signed </span>
                        {(() => {
                          // For staff forms, prioritize the user-entered date from submissionData over staffSignedAt
                          if (isStaff && assignment.submissionData?.date) {
                            // Format YYYY-MM-DD to DD/MM/YYYY
                            const [year, month, day] = assignment.submissionData.date.split('-');
                            return `${day}/${month}/${year}`;
                          }
                          // Fallback to staffSignedAt or clientSignedAt
                          return new Date((assignment.clientSignedAt || assignment.staffSignedAt)!).toLocaleDateString();
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <button
              ref={dropdownTriggerRef}
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionMenu(!activeActionMenu);
              }}
              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-xl transition-all group-hover:bg-white"
              title="Form actions"
            >
              <FaCog className="h-5 w-5 hover:rotate-90 transition-transform duration-300" />
            </button>

            <FormActionDropdown
              isOpen={activeActionMenu}
              onClose={() => setActiveActionMenu(false)}
              triggerRef={dropdownTriggerRef}
              onEditClick={handleEditClick}
              clientId={clientId}
              assignmentId={assignment.id}
              hasSubmission={assignment.hasSubmission}
              onDownloadPDF={async () => {
                // Don't close dropdown immediately - let download complete first
                try {
                  await onDownloadPDF(assignment);
                  // Close dropdown after download completes successfully
                  setActiveActionMenu(false);
                } catch (error) {
                  // Close dropdown even on error
                  setActiveActionMenu(false);
                }
              }}
              downloadingPDF={downloadingPDF === assignment.id}
              onDeleteClick={async () => {
                // Don't close dropdown immediately - let delete complete first
                try {
                  await handleDeleteFormAssignment();
                  // Close dropdown after delete completes successfully
                  setActiveActionMenu(false);
                } catch (error) {
                  // Close dropdown even on error
                  setActiveActionMenu(false);
                }
              }}
              deletingForm={isDeleting}
              // Show Generate Link only for emergency_drill
              showGenerateLink={assignment.form.formKey === 'emergency_drill'}
              onGenerateLinkClick={generateEmergencyDrillLink}
              generatingLink={generatingLink}
              isStaff={isStaff}
              disabled={showEditWarningModal || isNavigatingToEdit}
            />
          </div>
        </div>
      </div>

      {/* Signature Link Modal for emergency_drill quick action */}
      <SignatureLinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        clientName={undefined}
        clientId={clientId}
        generatedLink={generatedLink}
        onCopyLink={copyLinkToClipboard}
      />

      <EditWarningModal
        isOpen={showEditWarningModal}
        onClose={handleEditCancel}
        onConfirm={handleEditConfirm}
        formTitle={assignment.form.title}
        onDownload={() => onDownloadPDF(assignment)}
        isLoading={isNavigatingToEdit}
      />

      <StaffNotSubmittedModal
        isOpen={showStaffNotSubmittedModal}
        onClose={() => setShowStaffNotSubmittedModal(false)}
        formTitle={assignment.form.title}
        onResendLink={() => {
          setShowStaffNotSubmittedModal(false);
          // Trigger resend link action if needed
          if (assignment.form.formKey === 'emergency_drill') {
            generateEmergencyDrillLink();
          }
        }}
      />
    </>
  );
}
