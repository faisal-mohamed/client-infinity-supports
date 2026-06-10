

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
  clientId: string | number;
  selectedForms: (string | number)[];
  downloadingPDF: string | number | null;
  onFormSelect: (assignmentId: string | number, checked: boolean) => void;
  onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
  isStaff?: boolean;
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
  const dropdownTriggerRef: any = useRef<HTMLButtonElement>(null);
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
    const isWaitingForStaff = assignment.form.formKey === 'emergency_drill' &&
      !assignment.filledByAdmin &&
      !assignment.hasSubmission;

    if (isWaitingForStaff) {
      setShowStaffNotSubmittedModal(true);
      return;
    }

    const requiresSignatures = formRequiresSignatures(assignment.form.formKey);
    if (requiresSignatures && assignment.currentStatus === 'completed') {
      setShowEditWarningModal(true);
    } else {
      const formKey = assignment.form?.formKey?.replace(/_/g, '-') || assignment.id;
      const editRoute = isStaff
        ? `/admin/staff/${clientId}/forms/${formKey}`
        : `/admin/clients/${clientId}/forms/edit/${assignment.id}`;
      router.push(editRoute);
    }
  };

  const handleEditConfirm = async () => {
    setIsNavigatingToEdit(true);
    setShowEditWarningModal(false);

    try {
      // For staff forms, clear all signatures before navigating
      if (isStaff) {
        try {
          const clearResponse = await fetch(`/api/staff/${clientId}/forms/${assignment.form.formKey}/clear-all-signatures`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignmentId: assignment.id })
          });

          if (!clearResponse.ok) {
            console.error('Failed to clear signatures:', await clearResponse.text());
          }
        } catch (error) {
          console.error('Error clearing signatures:', error);
        }
      }

      const formKey = assignment.form?.formKey?.replace(/_/g, '-') || assignment.id;
      const editRoute = isStaff
        ? `/admin/staff/${clientId}/forms/${formKey}`
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
      // Use staff-form-assignments endpoint for staff, form-assignments for client
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

  const generateQuickLink = async () => {
    try {
      setGeneratingLink(true);
      // Use staff endpoint for staff, client endpoint for clients
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
    const formKey = assignment.form.formKey;
    // Vehicle Safety Inspection does NOT require signature
    const requiresSignature = formKey === 'vehicle_safety_inspection'
      ? false
      : formRequiresSignatures(formKey);
    const status = assignment.currentStatus;

    // Check if this form requires admin signature
    const requiresAdminSignature = isStaff && (
      formKey === 'employee_details' ||
      formKey === 'employment_details' ||
      formKey === 'conflict_of_interest' ||
      formKey === 'bullying_training'
    );

    if (status === "completed") {
      // For staff forms with admin signatures
      if (isStaff && requiresAdminSignature) {
        if (assignment.staffSignature && assignment.adminSignature) {
          return {
            status: 'Both Admin and Staff Signed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
        if (assignment.adminSignature && !assignment.staffSignature) {
          return {
            status: 'Admin Completed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
        if (assignment.staffSignature && !assignment.adminSignature) {
          return {
            status: 'Admin Review',
            color: 'from-gold-300 to-gold-400 text-gold-800 border-gold-500',
            icon: FaSignature,
            bgColor: 'from-gold-500 to-gold-600',
            iconColor: 'text-white'
          };
        }
      }

      // For staff forms without admin signatures
      if (isStaff) {
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
        if (assignment.staffSignature && !assignment.adminSignature) {
          return {
            status: 'Admin Review',
            color: 'from-gold-300 to-gold-400 text-gold-800 border-gold-500',
            icon: FaSignature,
            bgColor: 'from-gold-500 to-gold-600',
            iconColor: 'text-white'
          };
        }
        if (assignment.staffSignature && assignment.adminSignature) {
          return {
            status: 'Both Admin and Staff Signed',
            color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
            icon: FaCheckCircle,
            bgColor: 'from-emerald-500 to-emerald-600',
            iconColor: 'text-white'
          };
        }
      }

      return {
        status: 'In Progress',
        color: 'from-gold-300 to-gold-400 text-gold-800 border-gold-500',
        icon: requiresSignature ? FaSignature : FaClock,
        bgColor: 'from-gold-500 to-gold-600',
        iconColor: 'text-white'
      };
    }

    if (status === "pending_admin_review") {
      return {
        status: 'Awaiting Manager',
        color: 'from-gold-100 to-gold-200 text-gold-800 border-gold-300',
        icon: FaSignature,
        bgColor: 'from-gold-400 to-gold-500',
        iconColor: 'text-white'
      };
    }

    return {
      status: 'Not Started',
      color: 'from-azure-100 to-azure-200 text-azure-700 border-azure-200',
      icon: FaClock,
      bgColor: 'from-azure-500 to-azure-500',
      iconColor: 'text-white'
    };
  };

  const statusInfo = getFormStatus(assignment);
  const StatusIcon = statusInfo.icon;
  const isSelected = selectedForms.includes(assignment.id);

  return (
    <>
      <div className={`relative p-6 sm:p-8   transition-all duration-200 group ${isSelected ? 'bg-gold-50 border-l-4 border-gold-500' : 'bg-white'
        } border border-azure-50 rounded-2xl`}>
        {(generatingLink || isNavigatingToEdit) && (
          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-300 border-t-gold-600 rounded-full animate-spin" />
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            {(isStaff || assignment.adminFilledAt || ['emergency_drill', 'conflict_of_interest'].includes(assignment.form.formKey)) ? (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onFormSelect(assignment.id, e.target.checked)}
                className="h-5 w-5 text-gold-600 focus:ring-gold-500 border-azure-200 rounded-lg shadow-sm hover:scale-110 transition-transform"
              />
            ) : <div className="w-5 h-5" />}

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${statusInfo.bgColor} shadow-soft flex-shrink-0 transition-all duration-200`}>
              <StatusIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${statusInfo.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-base font-semibold text-azure-800 mb-2 group-hover:text-gold-600 transition-colors flex items-center gap-2">
                    {assignment.form.title}
                    {assignment.instanceNumber > 1 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-azure-100 text-azure-700 border border-azure-100 shadow-sm">
                        #{assignment.instanceNumber}
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${statusInfo.color} border-2 shadow-soft`}>
                      {statusInfo.status}
                    </span>
                    {assignment.form.requiresSignature &&
                     assignment.form.formKey !== 'vehicle_safety_inspection' &&
                     assignment.currentStatus !== 'completed' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 border-2 border-gold-300 shadow-soft">
                        <FaSignature className="h-3 w-3" />
                        <span className="hidden sm:inline">Signature Required</span>
                        <span className="sm:hidden">Sig Req</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-azure-50 rounded-xl p-4 border border-azure-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <span className="font-medium text-azure-600">Version {assignment.form.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-3 w-3 text-azure-400" />
                    <span className="text-azure-500">
                      <span className="hidden sm:inline">Assigned </span>
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {assignment.adminFilledAt && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-emerald-600 font-medium">
                        <span className="hidden sm:inline">Last Edited </span>
                        {new Date(assignment.adminFilledAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {(assignment.clientSignedAt || (isStaff && assignment.staffSignedAt)) && (
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="h-3 w-3 text-emerald-500" />
                      <span className="text-green-600 font-bold">
                        <span className="hidden sm:inline">Signed </span>
                        {(() => {
                          if (isStaff && assignment.formData?.date) {
                            const [year, month, day] = assignment.formData.date.split('-');
                            return `${day}/${month}/${year}`;
                          }
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
              className="p-3 text-azure-300 hover:text-gold-600 hover:bg-white hover:shadow-soft rounded-xl transition-all group-hover:bg-white"
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
                try {
                  await onDownloadPDF(assignment);
                  setActiveActionMenu(false);
                } catch (error) {
                  setActiveActionMenu(false);
                }
              }}
              downloadingPDF={downloadingPDF === assignment.id}
              onDeleteClick={async () => {
                try {
                  await handleDeleteFormAssignment();
                  setActiveActionMenu(false);
                } catch (error) {
                  setActiveActionMenu(false);
                }
              }}
              deletingForm={isDeleting}
              showGenerateLink={['emergency_drill', 'conflict_of_interest'].includes(assignment.form.formKey)}
              onGenerateLinkClick={generateQuickLink}
              generatingLink={generatingLink}
              isStaff={isStaff}
              disabled={showEditWarningModal || isNavigatingToEdit}
            />
          </div>
        </div>
      </div>

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
          if (['emergency_drill', 'conflict_of_interest'].includes(assignment.form.formKey)) {
            generateQuickLink();
          }
        }}
      />
    </>
  );
}
