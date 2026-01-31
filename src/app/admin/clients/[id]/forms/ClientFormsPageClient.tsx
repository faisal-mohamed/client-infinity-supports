"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { getAllForms } from '@/app/forms/registry';
import CommonFieldsModal, { CommonField } from '@/components/CommonFieldsModal';
import CommonFieldsWarningModal from '@/components/CommonFieldsWarningModal';
import SignatureInvalidationModal, { FormInfo } from '@/components/SignatureInvalidationModal';

import { validateFormSignatures, getSignatureStatusText, formRequiresSignatures } from '@/lib/signatureValidation';
import {
  detectCommonFieldChanges,
  getChangedCommonFields
} from '@/lib/signatureInvalidation';

// Import new sub-components
import ClientHeader from '@/app/components/components/client-forms/ClientHeader';
import ActionButtons from '@/app/components/components/client-forms/ActionButtons';
import StatsCards from '@/app/components/components/client-forms/StatsCards';
import FormsList from '@/app/components/components/client-forms/FormsList';
import FormAssignmentModal from '@/app/components/components/client-forms/FormAssignmentModal';
import SignatureLinkModal from '@/app/components/components/client-forms/SignatureLinkModal';

import { FormAssignmentWithDetails, ClientInfo, AvailableForm } from './types'
import { useSession } from 'next-auth/react';

// List of 12 client form keys (excluding staff forms)
const CLIENT_FORM_KEYS = [
  'client_intake_form',
  'home_visit_risk_assessment',
  'person_centred_plan',
  'sa_delivery_of_supports',
  'participant_risk_assessment',
  'emergency_drill',
  'individual_risk_assessment',
  'welcome_form',
  'support_action_plan',
  'schedule_of_supports',
  'sa_support_coordination',
  'multi_disciplinary_meeting',
  'conflict_of_interest',
  'ndis_consent'
];

export default function ClientFormsPageClient() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const clientId = parseInt(params?.id as string);
  const { data: session } = useSession();
  const adminId: any = session?.user?.id;

  const [client, setClient] = useState<ClientInfo | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);

  // Form assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableForms, setAvailableForms] = useState<AvailableForm[]>([]);
  const [selectedFormsToAssign, setSelectedFormsToAssign] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Download state
  const [downloadingPDF, setDownloadingPDF] = useState<number | null>(null);

  // Signature link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    token: string;
    formsCount: number;
    forms: { formTitle: string; formKey: string; }[];
    expiresAt: string;
  } | null>(null);

  // Common fields modal state
  const [showCommonFieldsModal, setShowCommonFieldsModal] = useState(false);
  const [showCommonFieldsWarning, setShowCommonFieldsWarning] = useState(false);
  const [commonFields, setCommonFields] = useState<CommonField | null>(null);
  const [updatingCommonFields, setUpdatingCommonFields] = useState(false);

  // Signature invalidation state
  const [showSignatureInvalidationModal, setShowSignatureInvalidationModal] = useState(false);
  const [signatureInvalidationData, setSignatureInvalidationData] = useState<{
    type: 'common-fields' | 'form-edit';
    affectedForms: FormInfo[];
    changes: string[];
    pendingUpdate: CommonField;
  } | null>(null);
  const [originalCommonFields, setOriginalCommonFields] = useState<CommonField | null>(null);

  // Calculate statistics
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.currentStatus === "completed").length,
    pendingAdminReview: assignments.filter(a => a.currentStatus === "pending_admin_review").length,
    inProgress: assignments.filter(a => a.currentStatus === "in_progress").length,
    notStarted: assignments.filter(a => a.currentStatus === "not_started").length
  };

  // Load client and form assignments
  useEffect(() => {
    loadClientForms();
    loadAvailableForms();
  }, [clientId]);

  const loadClientForms = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/clients/${clientId}/form-assignments`);
      if (!response.ok) throw new Error('Failed to load client forms');

      const data = await response.json();
      console.log("DATA: ", data);
      console.log("Client common fields: ", data.client?.commonFields);
      setClient(data.client);
      setAssignments(data.assignments);

    } catch (error) {
      console.error('Error loading client forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load client forms',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableForms = async () => {
    try {
      const response = await fetch('/api/forms');
      if (!response.ok) throw new Error('Failed to load available forms');

      const data = await response.json();
      // Filter to only show client forms (exclude staff forms)
      const clientForms = Array.isArray(data)
        ? data.filter((form: AvailableForm) => CLIENT_FORM_KEYS.includes(form.formKey))
        : [];
      setAvailableForms(clientForms);

    } catch (error) {
      console.error('Error loading available forms:', error);
    }
  };

  // Handler functions
  const handleFormAssignmentSelection = (formId: number) => {
    setSelectedFormsToAssign(prev =>
      prev.includes(formId)
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const handleFormSelect = (assignmentId: number, checked: boolean) => {
    if (checked) {
      setSelectedForms(prev => [...prev, assignmentId]);
    } else {
      setSelectedForms(prev => prev.filter(id => id !== assignmentId));
    }
  };

  const assignFormsToClient = async () => {
    if (selectedFormsToAssign.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one form to assign',
        duration: 3000,
      });
      return;
    }

    try {
      setAssigning(true);

      const response = await fetch(`/api/clients/${clientId}/assign-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formIds: selectedFormsToAssign,
          adminId: parseInt(adminId)
        }),
      });

      if (!response.ok) throw new Error('Failed to assign forms');

      showToast({
        type: 'success',
        title: 'Forms Assigned',
        message: `Successfully assigned ${selectedFormsToAssign.length} form(s) to client`,
        duration: 3000,
      });

      // Reset and reload
      setSelectedFormsToAssign([]);
      setShowAssignModal(false);
      loadClientForms();

    } catch (error) {
      console.error('Error assigning forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to assign forms to client',
        duration: 3000,
      });
    } finally {
      setAssigning(false);
    }
  };

  const copyLinkToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
      });
    }
  };

  // Download PDF function
  const handleDownloadPDF = async (assignment: FormAssignmentWithDetails) => {
    if (!assignment.hasSubmission || !assignment.submissionId) {
      showToast({
        type: 'error',
        title: 'Cannot Download',
        message: 'Form must be filled before downloading PDF',
        duration: 3000,
      });
      return;
    }

    try {
      setDownloadingPDF(assignment.id);

      const response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${client?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'client'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Form PDF downloaded successfully',
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: error.message || 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloadingPDF(null);
    }
  };

  const generateSignatureLink = async () => {
    if (selectedForms.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one admin-filled form to generate client link',
        duration: 3000,
      });
      return;
    }

    try {
      setGeneratingLink(true);

      const response = await fetch(`/api/clients/${clientId}/generate-signature-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formAssignmentIds: selectedForms
        }),
      });

      if (!response.ok) {
        // Try to extract error message from response
        let errorMessage = 'Failed to generate signature link';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Show modal with option to view all links
      setGeneratedLink({
        url: data.signatureUrl,
        token: data.token,
        formsCount: data.formsCount,
        forms: data.forms,
        expiresAt: data.expiresAt,
      });
      setShowLinkModal(true);

      // Clear selection
      setSelectedForms([]);

      // Optionally reload the page to show updated data
      setTimeout(() => {
        loadClientForms();
      }, 1000);

    } catch (error: any) {
      console.error('Error generating signature link:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.message || 'Failed to generate signature link',
        duration: 5000,
      });
    } finally {
      setGeneratingLink(false);
    }
  };

  const generateEmail = async () => {
    if (selectedForms.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one admin-filled form to send email',
        duration: 3000,
      });
      return;
    }

    try {
      setSendingEmail(true);
      const response = await fetch(`/api/clients/${clientId}/send-client-only-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formAssignmentIds: selectedForms
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details || errorData.error || 'Unknown error';

        // Use centralized error parser
        const { parseEmailError, extractErrorDetails } = await import('@/utils/emailErrorHandler');
        const errorDetails = extractErrorDetails(errorData);
        const errorInfo = parseEmailError(errorDetails);

        showToast({
          type: errorInfo.type,
          title: errorInfo.title,
          message: errorInfo.message,
          duration: errorInfo.duration,
        });
        return;
      }

      const data = await response.json();

      // Use centralized success message
      const { getEmailSuccessMessage } = await import('@/utils/emailErrorHandler');
      const successInfo = getEmailSuccessMessage('client', client?.email, selectedForms.length);

      showToast({
        type: 'success',
        title: successInfo.title,
        message: successInfo.message,
        duration: successInfo.duration,
      });

      setSelectedForms([]);
    } catch (error) {
      console.error('Error sending email:', error);

      // Use centralized error parser for network/unexpected errors
      const { parseEmailError } = await import('@/utils/emailErrorHandler');
      const errorInfo = parseEmailError(error instanceof Error ? error.message : 'Network error');

      showToast({
        type: errorInfo.type,
        title: errorInfo.title,
        message: errorInfo.message,
        duration: errorInfo.duration,
      })

    }
    finally {
      setSendingEmail(false)
    }
  };

  // Trigger completion email for all completed forms
  const triggerCompletionEmail = async () => {
    try {
      setSendingEmail(true);

      console.log(`📧 [MANUAL TRIGGER] Triggering completion email for client ${clientId}...`);

      const response = await fetch(`/api/clients/${clientId}/trigger-completion-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to send email');
      }

      const data = await response.json();

      console.log(`✅ [MANUAL TRIGGER] Email sent successfully:`, data);

      showToast({
        type: 'success',
        title: '✅ Completion Email Sent!',
        message: `📧 Email sent to both admin and client\n\n` +
          `✉️ Admin: ${data.recipients?.admin ? '✅ Sent' : '❌ Failed'}\n` +
          `✉️ Client: ${data.recipients?.client ? '✅ Sent' : '❌ Failed'}\n` +
          `📎 Attachments: ${data.completedForms} PDF(s)`,
        duration: 6000,
      });

    } catch (error: any) {
      console.error('❌ [MANUAL TRIGGER] Error:', error);

      const { parseEmailError } = await import('@/utils/emailErrorHandler');
      const errorInfo = parseEmailError(error.message || 'Failed to send completion email');

      showToast({
        type: errorInfo.type,
        title: errorInfo.title,
        message: errorInfo.message,
        duration: errorInfo.duration,
      });
    } finally {
      setSendingEmail(false);
    }
  };


  // Wrapper function for warning modal downloads
  const downloadFormForWarningModal = async (assignmentId: number, formTitle: string) => {
    console.log("Downloading form from warning modal:", assignmentId, formTitle);
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      console.log("Found assignment:", assignment);
      await handleDownloadPDF(assignment);
    } else {
      console.error("Assignment not found for ID:", assignmentId);
    }
  };

  // Common Fields Functions
  const handleProceedToEditCommonFields = () => {
    setShowCommonFieldsWarning(false);
    openCommonFieldsModal();
  };

  const openCommonFieldsModal = () => {
    console.log("Opening common fields modal, client:", client);
    console.log("Client common fields:", client?.commonFields);

    if (client) {
      // Use commonFields if available, otherwise initialize with basic client info
      const commonFieldsData = client.commonFields || {};

      const fieldsData = {
        clientId: clientId,
        name: commonFieldsData.name || client.name || '',
        age: commonFieldsData.age || null,
        email: commonFieldsData.email || client.email || '',
        sex: commonFieldsData.sex || '',
        street: commonFieldsData.street || '',
        state: commonFieldsData.state || '',
        postCode: commonFieldsData.postCode || '',
        dob: commonFieldsData.dob || '',
        ndis: commonFieldsData.ndis || '',
        disability: commonFieldsData.disability || '',
        address: commonFieldsData.address || '',
        phone: commonFieldsData.phone || client.phone || '',
        surname: commonFieldsData.surname || ''
      };

      setCommonFields(fieldsData);
      setOriginalCommonFields({ ...fieldsData }); // Store original for comparison
    } else {
      // Fallback if no client data
      const fallbackFields = {
        clientId: clientId,
        name: '',
        email: '',
        phone: '',
        age: null,
        sex: '',
        street: '',
      };
      setCommonFields(fallbackFields);
      setOriginalCommonFields({ ...fallbackFields });
    }
    setShowCommonFieldsModal(true);
  };

  const handleCommonFieldsChange = (field: keyof CommonField, value: string | number | null) => {
    if (!commonFields) return;

    setCommonFields(prev => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleCommonFieldsSubmitWithSignatureCheck = async (updatedFields: CommonField) => {
    if (!originalCommonFields) {
      // No original data, proceed normally
      await updateCommonFields();
      return;
    }

    // Check if any fields actually changed
    const hasChanges = detectCommonFieldChanges(originalCommonFields, updatedFields);

    if (!hasChanges) {
      // No changes, just close modal
      setShowCommonFieldsModal(false);
      showToast({
        type: 'info',
        title: 'No Changes',
        message: 'No changes were made to common fields',
        duration: 2000,
      });
      return;
    }

    try {
      // Check if client has any signed forms via API
      const response = await fetch(`/api/clients/${clientId}/signed-forms`);
      if (!response.ok) throw new Error('Failed to check signed forms');

      const { hasSignedForms, signedForms } = await response.json();

      if (hasSignedForms) {
        // Get changed fields
        const changedFields = getChangedCommonFields(originalCommonFields, updatedFields);

        // Show signature invalidation warning
        setSignatureInvalidationData({
          type: 'common-fields',
          affectedForms: signedForms,
          changes: changedFields,
          pendingUpdate: updatedFields
        });
        setShowSignatureInvalidationModal(true);
        return;
      }

      // No signed forms, proceed normally
      await updateCommonFields();

    } catch (error) {
      console.error('Error checking signed forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to check signature status. Please try again.',
        duration: 5000,
      });
    }
  };

  const handleSignatureInvalidationConfirm = async () => {
    if (!signatureInvalidationData) return;

    try {
      setUpdatingCommonFields(true);

      if (signatureInvalidationData.type === 'common-fields') {
        // Clear all client signatures first via API
        const clearResponse = await fetch(`/api/clients/${clientId}/clear-signatures`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'common-fields' })
        });

        if (!clearResponse.ok) throw new Error('Failed to clear signatures');

        // Then update common fields
        await updateCommonFields();

        // 🎯 GET ENHANCED RESPONSE DATA
        const responseData = await clearResponse.json();
        const {
          clearedForms,
          clearedFormsWithSignatures,
          statusUpdatedAssignments,
          details
        } = responseData;

        console.log('Clear signatures response:', responseData);

        // 🎯 CREATE ENHANCED TOAST MESSAGE
        let toastMessage = `Updated common fields and cleared signatures from ${clearedFormsWithSignatures || clearedForms} form(s)`;

        if (statusUpdatedAssignments > 0) {
          toastMessage += `. ${statusUpdatedAssignments} form(s) status changed to "In Progress" (require re-signing)`;
        }

        // Show detailed info in console for debugging
        if (details?.statusUpdates?.length > 0) {
          console.log('🎯 Forms with status updated to "in_progress":',
            details.statusUpdates.map((update: any) => `${update.formTitle} (${update.requiredSignatures} signatures required)`)
          );
        }

        showToast({
          type: 'warning',
          title: 'Signatures Cleared & Status Updated',
          message: toastMessage,
          duration: 6000, // Longer duration for more detailed message
        });
      }

      // Close modals
      setShowSignatureInvalidationModal(false);
      setSignatureInvalidationData(null);

    } catch (error) {
      console.error('Error handling signature invalidation:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update fields and clear signatures',
        duration: 5000,
      });
    } finally {
      setUpdatingCommonFields(false);
    }
  };

  const updateCommonFields = async () => {
    console.log("updating common fields..........")
    if (!commonFields) return;

    try {
      setUpdatingCommonFields(true);

      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commonFields?.name,
          email: commonFields?.email,
          phone: commonFields?.phone,
          commonFields: {
            name: commonFields.name,
            age: commonFields.age,
            email: commonFields.email,
            sex: commonFields.sex,
            street: commonFields.street,
            state: commonFields.state,
            postCode: commonFields.postCode,
            dob: commonFields.dob,
            ndis: commonFields.ndis,
            disability: commonFields.disability,
            address: commonFields.address,
            phone: commonFields.phone,
            surname: commonFields.surname,
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to update common fields');

      showToast({
        type: 'success',
        title: 'Success',
        message: 'Client details updated successfully',
        duration: 3000,
      });

      setShowCommonFieldsModal(false);

      // Reload client data to get updated info
      loadClientForms();

    } catch (error) {
      console.error('Error updating common fields:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update client details',
        duration: 3000,
      });
    } finally {
      setUpdatingCommonFields(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="flex justify-center items-center h-80">
          <div className="text-center">
            {/* Spinner */}
            <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

            {/* Text */}
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Loading Assigned forms
            </h3>
            <p className="text-slate-600 font-medium">
              Please wait...
            </p>

            {/* Bouncing dots */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Client Header */}
      <ClientHeader
        clientId={clientId}
        client={client}
        stats={stats}
      />

      {/* Action Buttons */}
      <ActionButtons
        clientId={clientId}
        selectedForms={selectedForms}
        generatingLink={generatingLink}
        onShowAssignModal={() => setShowAssignModal(true)}
        onShowCommonFieldsWarning={() => setShowCommonFieldsWarning(true)}
        onGenerateSignatureLink={generateSignatureLink}
        sendEmailNotification={generateEmail}
        sendingEmail={sendingEmail}
        allFormsCompleted={stats.completed === stats.total && stats.total > 0}
        onTriggerCompletionEmail={triggerCompletionEmail}
      />

      {/* Stats Cards */}
      {/* <StatsCards stats={stats} /> */}

      {/* Forms List */}
      <FormsList
        assignments={assignments}
        selectedForms={selectedForms}
        downloadingPDF={downloadingPDF}
        clientId={clientId}
        onFormSelect={handleFormSelect}
        onDownloadPDF={handleDownloadPDF}
        onShowAssignModal={() => setShowAssignModal(true)}
      />

      {/* Form Assignment Modal */}
      <FormAssignmentModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        clientName={client?.name}
        availableForms={availableForms}
        assignments={assignments}
        selectedFormsToAssign={selectedFormsToAssign}
        assigning={assigning}
        onFormSelection={handleFormAssignmentSelection}
        onAssignForms={assignFormsToClient}
      />

      {/* Signature Link Modal */}
      <SignatureLinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        clientName={client?.name}
        clientId={clientId}
        generatedLink={generatedLink}
        onCopyLink={copyLinkToClipboard}
      />
      {/* Common Fields Warning Modal */}
      <CommonFieldsWarningModal
        isOpen={showCommonFieldsWarning}
        onClose={() => setShowCommonFieldsWarning(false)}
        onProceed={handleProceedToEditCommonFields}
        clientName={client?.name}
        assignments={assignments}
        onDownloadForm={downloadFormForWarningModal}
      />

      {/* Common Fields Modal */}
      <CommonFieldsModal
        isOpen={showCommonFieldsModal}
        onClose={() => setShowCommonFieldsModal(false)}
        commonFields={commonFields}
        onFieldChange={handleCommonFieldsChange}
        onSave={updateCommonFields}
        onSubmitWithSignatureCheck={handleCommonFieldsSubmitWithSignatureCheck}
        isUpdating={updatingCommonFields}
        clientName={client?.name}
      />

      {/* Signature Invalidation Modal */}
      <SignatureInvalidationModal
        isOpen={showSignatureInvalidationModal}
        onClose={() => {
          setShowSignatureInvalidationModal(false);
          setSignatureInvalidationData(null);
        }}
        onConfirm={handleSignatureInvalidationConfirm}
        type={signatureInvalidationData?.type || 'common-fields'}
        affectedForms={signatureInvalidationData?.affectedForms || []}
        changes={signatureInvalidationData?.changes || []}
        isProcessing={updatingCommonFields}
      />
    </div>
  );
}
