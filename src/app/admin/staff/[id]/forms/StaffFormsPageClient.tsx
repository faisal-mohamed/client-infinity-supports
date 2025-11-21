"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { getAllForms } from '@/app/forms/registry';
import LoadingView from '@/components/ui/LoadingView';

// Import client form components (reuse them)
import ClientHeader from '@/app/components/components/client-forms/ClientHeader';
import ActionButtons from '@/app/components/components/client-forms/ActionButtons';
import FormsList from '@/app/components/components/client-forms/FormsList';
import FormAssignmentModal from '@/app/components/components/client-forms/FormAssignmentModal';
import SignatureLinkModal from '@/app/components/components/client-forms/SignatureLinkModal';

import { FormAssignmentWithDetails, ClientInfo, AvailableForm } from '@/app/admin/clients/[id]/forms/types';
import { useSession } from 'next-auth/react';

export default function StaffFormsPageClient() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const staffId = parseInt(params?.id as string);
  const { data: session } = useSession();
  const adminId: any = session?.user?.id;
  
  const [staff, setStaff] = useState<ClientInfo | null>(null);
  const [assignments, setAssignments] = useState<FormAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  
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
    forms: { formTitle: string; formKey: string }[];
    expiresAt: string;
  } | null>(null);

  // Calculate statistics
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.currentStatus === "completed").length,
    inProgress: assignments.filter(a => a.currentStatus === "in_progress").length,
    notStarted: assignments.filter(a => a.currentStatus === "not_started").length
  };

  // Load staff and form assignments
  useEffect(() => {
    loadStaffForms();
    loadAvailableForms();
  }, [staffId]);

  const loadStaffForms = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/staff/${staffId}/form-assignments`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (!data.staff) {
        throw new Error('Staff not found');
      }
      
      // Map staff to ClientInfo format for reuse of components
      setStaff({
        id: data.staff.id,
        name: `${data.staff.firstName} ${data.staff.surname}`,
        email: data.staff.email,
        phone: data.staff.phone,
      });
      setAssignments(data.assignments || []);
      
    } catch (error: any) {
      console.error('Error loading staff forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error?.message || 'Failed to load staff forms',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableForms = async () => {
    try {
      // Fetch ONLY staff forms - staff should only get staff forms assigned (logical separation)
      const response = await fetch('/api/forms?type=staff');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to load available forms');
      }
      
      const data = await response.json();
      setAvailableForms(Array.isArray(data) ? data : []);
      
      if (Array.isArray(data) && data.length === 0) {
        showToast({
          type: 'info',
          title: 'No Forms Available',
          message: 'No staff forms found in the database. Please ensure forms are seeded.',
          duration: 5000,
        });
      }
      
    } catch (error: any) {
      console.error('Error loading available forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to load available forms. Please check if forms are seeded in the database.',
        duration: 5000,
      });
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

  const assignFormsToStaff = async () => {
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
      
      const response = await fetch(`/api/staff/${staffId}/assign-forms`, {
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
        message: `Successfully assigned ${selectedFormsToAssign.length} form(s) to staff`,
        duration: 3000,
      });

      // Reset and reload
      setSelectedFormsToAssign([]);
      setShowAssignModal(false);
      loadStaffForms();
      
    } catch (error) {
      console.error('Error assigning forms:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to assign forms to staff',
        duration: 3000,
      });
    } finally {
      setAssigning(false);
    }
  };

  // Generate signature link function
  const generateSignatureLink = async () => {
    // Check if staff has any assigned forms
    if (assignments.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Assigned',
        message: 'Please assign forms to this staff member before generating a signature link.',
        duration: 5000,
      });
      return;
    }

    if (selectedForms.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one form to generate signature link',
        duration: 3000,
      });
      return;
    }

    try {
      setGeneratingLink(true);
      
      const response = await fetch(`/api/staff/${staffId}/generate-signature-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formAssignmentIds: selectedForms 
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate signature link';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      // Show modal with signature link
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
      
      // Reload to show updated data
      setTimeout(() => {
        loadStaffForms();
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

  // Copy link to clipboard function
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
      a.download = `${assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${staff?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'staff'}.pdf`;
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

  if (loading) {
    return (
      <LoadingView title="Loading Staff Forms" message="Please wait..." />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Staff Header - reuse ClientHeader but adapted */}
      <ClientHeader 
        clientId={staffId}
        client={staff}
        stats={stats}
        isStaff={true}
      />

      {/* Action Buttons - simplified version for staff */}
      <ActionButtons
        clientId={staffId}
        selectedForms={selectedForms}
        generatingLink={generatingLink}
        onShowAssignModal={() => setShowAssignModal(true)}
        onShowCommonFieldsWarning={() => {}}
        onGenerateSignatureLink={generateSignatureLink}
        sendEmailNotification={() => {}}
        sendingEmail={false}
        isStaff={true}
      />

      {/* Forms List */}
      <FormsList
        assignments={assignments}
        selectedForms={selectedForms}
        downloadingPDF={downloadingPDF}
        clientId={staffId}
        onFormSelect={handleFormSelect}
        onDownloadPDF={handleDownloadPDF}
        onShowAssignModal={() => setShowAssignModal(true)}
        isStaff={true}
      />

      {/* Form Assignment Modal */}
      <FormAssignmentModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        clientName={staff?.name}
        availableForms={availableForms}
        assignments={assignments}
        selectedFormsToAssign={selectedFormsToAssign}
        assigning={assigning}
        onFormSelection={handleFormAssignmentSelection}
        onAssignForms={assignFormsToStaff}
        isStaff={true}
      />

      {/* Signature Link Modal */}
      <SignatureLinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        clientName={staff?.name}
        clientId={staffId}
        generatedLink={generatedLink}
        onCopyLink={copyLinkToClipboard}
      />
    </div>
  );
}

