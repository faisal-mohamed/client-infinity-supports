


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
      router.push(`/admin/clients/${clientId}/forms/edit/${assignment.id}`);
    }
  };

  const handleEditConfirm = () => {
    setShowEditWarningModal(false);
    router.push(`/admin/clients/${clientId}/forms/edit/${assignment.id}`);
  };

  const handleEditCancel = () => setShowEditWarningModal(false);

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
      const response = await fetch(`/api/form-assignments/${assignment.id}`, { method: 'DELETE' });
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
      // Generate a signature link for only this assignment
      const response = await fetch(`/api/clients/${clientId}/generate-signature-link`, {
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
    const requiresSignature = formRequiresSignatures(assignment.form.formKey);
    const status = assignment.currentStatus;

    // Custom Status Logic for Conflict of Interest
    if (assignment.form.formKey === 'conflict_of_interest' && assignment.formData) {
      const data = assignment.formData;
      const hasEmployeeSign = !!data.employeeSignature;
      const hasParticipantSign = !!data.participantSignature || !!data.authRepSignature;
      const hasManagerSign = !!data.managerSignature;

      if (hasManagerSign) {
        return {
          status: 'All Signatures Complete',
          color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
          icon: FaCheckCircle,
          bgColor: 'from-emerald-500 to-emerald-600',
          iconColor: 'text-white'
        };
      }
      if (hasParticipantSign && !hasManagerSign) {
        return {
          status: 'Manager Review',
          color: 'from-amber-300 to-amber-400 text-amber-900 border-amber-500',
          icon: FaExclamationTriangle,
          bgColor: 'from-amber-500 to-amber-600',
          iconColor: 'text-white'
        };
      }
      if (hasEmployeeSign && !hasParticipantSign) {
        return {
          status: 'Waiting for Participant',
          color: 'from-blue-300 to-blue-400 text-blue-900 border-blue-500',
          icon: FaClock,
          bgColor: 'from-blue-500 to-blue-600',
          iconColor: 'text-white'
        };
      }
    }

    if (status === "completed") {
      return {
        status: requiresSignature ? 'All Signatures Complete' : 'Admin Completed',
        color: 'from-emerald-400 to-emerald-500 text-emerald-900 border-emerald-600',
        icon: FaCheckCircle,
        bgColor: 'from-emerald-500 to-emerald-600',
        iconColor: 'text-white'
      };
    }
    // New status: Admin Review - Staff submitted, waiting for admin to complete
    if (status === "pending_admin_review") {
      return {
        status: 'Admin Review',
        color: 'from-yellow-300 to-yellow-400 text-yellow-900 border-yellow-500',
        icon: FaExclamationTriangle,
        bgColor: 'from-yellow-500 to-yellow-600',
        iconColor: 'text-white'
      };
    }
    if (status === "in_progress") {
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
      <div className={`relative p-6 sm:p-8  hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group ${isSelected ? 'bg-gradient-to-r from-rose-50 to-rose-100 border-l-4 border-rose-500' : 'bg-white'
        } border border-gray-100 rounded-2xl`}>
        {generatingLink && (
          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            {assignment.adminFilledAt || ['emergency_drill', 'conflict_of_interest'].includes(assignment.form.formKey) ? (
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
                    {assignment.form.requiresSignature && assignment.currentStatus !== 'completed' && (
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
              onDownloadPDF={() => onDownloadPDF(assignment)}
              downloadingPDF={downloadingPDF === assignment.id}
              onDeleteClick={handleDeleteFormAssignment}
              // Show Generate Link only for supported forms
              showGenerateLink={['emergency_drill', 'conflict_of_interest'].includes(assignment.form.formKey)}
              onGenerateLinkClick={generateQuickLink}
              generatingLink={generatingLink}
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
      />

      <StaffNotSubmittedModal
        isOpen={showStaffNotSubmittedModal}
        onClose={() => setShowStaffNotSubmittedModal(false)}
        formTitle={assignment.form.title}
        onResendLink={() => {
          setShowStaffNotSubmittedModal(false);
          // Trigger resend link action if needed
          if (['emergency_drill', 'conflict_of_interest'].includes(assignment.form.formKey)) {
            generateQuickLink();
          }
        }}
      />
    </>
  );
}
