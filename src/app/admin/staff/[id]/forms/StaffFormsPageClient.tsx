// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
import StaffCommonFieldsWarningModal from '@/components/StaffCommonFieldsWarningModal';

export default function StaffFormsPageClient() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const staffId = params?.id as string;
  const { data: session } = useSession();
  const adminId: any = session?.user?.id;
  
  const [staff, setStaff] = useState<ClientInfo | null>(null);
  const [assignments, setAssignments] = useState<FormAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForms, setSelectedForms] = useState<(string | number)[]>([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  
  // Form assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableForms, setAvailableForms] = useState<AvailableForm[]>([]);
  const [selectedFormsToAssign, setSelectedFormsToAssign] = useState<(string | number)[]>([]);
  const [assigning, setAssigning] = useState(false);

  // Download state
  const [downloadingPDF, setDownloadingPDF] = useState<string | number | null>(null);

  // Email state
  const [sendingEmail, setSendingEmail] = useState(false);

  // Signature link modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    url: string;
    token: string;
    formsCount: number;
    forms: { formTitle: string; formKey: string }[];
    expiresAt: string;
  } | null>(null);

  // Common fields warning modal state
  const [showCommonFieldsWarning, setShowCommonFieldsWarning] = useState(false);

  // Calculate statistics
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.currentStatus === "completed").length,
    inProgress: assignments.filter(a => a.currentStatus === "in_progress").length,
    notStarted: assignments.filter(a => a.currentStatus === "not_started").length
  };

  // Check if all forms are completed
  const allFormsCompleted = stats.completed === stats.total && stats.total > 0;

  // Send email notification for selected forms
  const generateEmail = async () => {
    if (selectedForms.length === 0) {
      showToast({
        type: 'error',
        title: 'No Forms Selected',
        message: 'Please select at least one form to send email',
        duration: 3000,
      });
      return;
    }

    try {
      setSendingEmail(true);
      const response = await fetch(`/api/staff/${staffId}/send-staff-only-email`, {
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

      // Show success message
      showToast({
        type: 'success',
        title: '✅ Email Sent!',
        message: `📧 Email sent successfully to ${staff?.email || 'staff'}\n\n📎 Attachments: ${selectedForms.length} PDF file(s)`,
        duration: 5000,
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
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Trigger completion email for all completed forms
  const triggerCompletionEmail = async () => {
    try {
      setSendingEmail(true);
      
      console.log(`📧 [MANUAL TRIGGER] Triggering completion email for staff ${staffId}...`);
      
      const response = await fetch(`/api/staff/${staffId}/trigger-completion-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to send email');
      }

      const data = await response.json();
      
      console.log(`✅ [MANUAL TRIGGER] Email sent successfully:`, data);

      // Check if both emails were sent successfully
      const adminSent = data.recipients?.admin || false;
      const staffSent = data.recipients?.staff || false;
      const bothSent = adminSent && staffSent;

      showToast({
        type: bothSent ? 'success' : 'warning',
        title: bothSent ? '✅ Completion Emails Sent!' : '⚠️ Partial Success',
        message: `📧 Completion email notification:\n\n` +
                 `✉️ Admin: ${adminSent ? '✅ Sent' : '❌ Failed'}\n` +
                 `✉️ Staff: ${staffSent ? '✅ Sent' : '❌ Failed'}\n` +
                 `📎 Attachments: ${data.completedForms || 0} PDF(s)`,
        duration: 8000,
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
  const handleFormAssignmentSelection = (formId: string | number) => {
    setSelectedFormsToAssign(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    );
  };

  const handleFormSelect = (assignmentId: string | number, checked: boolean) => {
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

  // Download PDF function - returns a promise so dropdown can close after completion
  const handleDownloadPDF = async (assignment: FormAssignmentWithDetails): Promise<void> => {
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
      
      // Convert formKey from snake_case to kebab-case for API endpoint
      const formKey = assignment.form.formKey;
      let formType = formKey.replace(/_/g, '-');
      
      // Handle special cases where PDF endpoint name differs from form key
      let pdfFormType = formType;
      if (formKey === 'employee_details' || formKey === 'employment_details') {
        pdfFormType = 'employee-details'; // PDF uses 'employee-details'
      }
      
      let response;
      
      // Check if form has a specific PDF route (same logic as form view page)
      if (formKey === 'govt_tax' || formKey === 'govt-tax') {
        // TFN Declaration uses POST endpoint with form data
        // Need to fetch form data first
        const formDataRes = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}`);
        if (!formDataRes.ok) {
          throw new Error('Failed to fetch form data');
        }
        const formData = await formDataRes.json();
        
        response = await fetch('/api/generate-pdf/tax-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.data || formData),
        });
      } else if (formKey === 'super_choice_form' || formKey === 'super-choice-form') {
        // Super Choice Form also uses POST endpoint with form data
        const formDataRes = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}`);
        if (!formDataRes.ok) {
          throw new Error('Failed to fetch form data');
        }
        const formData = await formDataRes.json();
        
        response = await fetch('/api/generate-pdf/super-choice-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData.data || formData),
        });
      } else if (formKey === 'ndis_workforce_capability') {
        // NDIS form merges framework PDF with acknowledgement
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?merge=true`);
        
        // If that fails, try without merge
        if (!response.ok) {
          response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
        }
      } else if (formKey === 'bullying_harassment_training') {
        // Bullying Harassment Training returns only acknowledgement form PDF (no merge)
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
      } else if (formKey === 'vehicle_safety_inspection') {
        // Vehicle Safety Inspection returns only acknowledgment form PDF for admin
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?acknowledgmentOnly=true`);
      } else {
        // Use the generic staff PDF endpoint for other forms
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
        
        // If generic endpoint fails, try the generic PDF generation endpoint as fallback
        if (!response.ok) {
          response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorMessage = 'Unable to generate PDF';
        
        // Parse error response
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorData.details || errorMessage;
        } catch {
          if (errorText && errorText.trim()) {
            errorMessage = errorText.length > 100 ? 'Failed to generate PDF. Please try again.' : errorText;
          }
        }
        
        throw new Error(errorMessage);
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
    <div className="">
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
        onShowCommonFieldsWarning={() => {
          console.log('🔘 [Update Details] Button clicked, opening warning modal');
          setShowCommonFieldsWarning(true);
        }}
        onGenerateSignatureLink={generateSignatureLink}
        sendEmailNotification={generateEmail}
        sendingEmail={sendingEmail}
        allFormsCompleted={allFormsCompleted}
        onTriggerCompletionEmail={triggerCompletionEmail}
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

      {/* Common Fields Warning Modal */}
      <StaffCommonFieldsWarningModal
        isOpen={showCommonFieldsWarning}
        onClose={() => {
          console.log('🔍 [Modal] onClose called');
          setShowCommonFieldsWarning(false);
        }}
        onProceed={() => {
          console.log('🔍 [Modal] onProceed called - navigating to staff detail page with update modal');
          setShowCommonFieldsWarning(false);
          // Navigate to staff detail page and open update modal directly
          router.push(`/admin/staff/${staffId}?openUpdate=true`);
        }}
        staffName={staff?.name || ''}
        assignments={assignments.map((a: any) => ({
          id: a.id,
          form: {
            id: a.form.id,
            formKey: a.form.formKey,
            title: a.form.title,
            version: a.form.version,
          },
          hasSubmission: a.hasSubmission || false,
          submissionId: a.submissionId,
          filledByAdmin: a.filledByAdmin || false,
          staffSignature: a.staffSignature || null,
        }))}
        onDownloadForm={async (assignmentId: number, formTitle: string) => {
          const assignment = assignments.find((a: any) => a.id === assignmentId);
          if (!assignment) {
            throw new Error('Assignment not found');
          }

          if (!assignment.hasSubmission || !assignment.submissionId) {
            throw new Error('Form must be filled before downloading PDF');
          }

          try {
            // Convert formKey from snake_case to kebab-case for API endpoint
            const formKey = assignment.form.formKey;
            let formType = formKey.replace(/_/g, '-');
            
            // Handle special cases where PDF endpoint name differs from form key
            let pdfFormType = formType;
            if (formKey === 'employee_details' || formKey === 'employment_details') {
              pdfFormType = 'employee-details'; // PDF uses 'employee-details'
            }
            
            let response;
            
            // Check if form has a specific PDF route (same logic as handleDownloadPDF)
            if (formKey === 'govt_tax' || formKey === 'govt-tax') {
              // TFN Declaration uses POST endpoint with form data
              // Need to fetch form data first
              const formDataRes = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}`);
              if (!formDataRes.ok) {
                throw new Error('Failed to fetch form data');
              }
              const formData = await formDataRes.json();
              
              response = await fetch('/api/generate-pdf/tax-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData.data || formData),
              });
            } else if (formKey === 'super_choice_form' || formKey === 'super-choice-form') {
              // Super Choice Form also uses POST endpoint with form data
              const formDataRes = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}`);
              if (!formDataRes.ok) {
                throw new Error('Failed to fetch form data');
              }
              const formData = await formDataRes.json();
              
              response = await fetch('/api/generate-pdf/super-choice-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData.data || formData),
              });
            } else if (formKey === 'ndis_workforce_capability') {
              // NDIS form merges framework PDF with acknowledgement
              response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?merge=true`);
              
              // If that fails, try without merge
              if (!response.ok) {
                response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
              }
            } else if (formKey === 'bullying_harassment_training') {
              // Bullying Harassment Training returns only acknowledgement form PDF (no merge)
              response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
            } else if (formKey === 'vehicle_safety_inspection') {
              // Vehicle Safety Inspection returns only acknowledgment form PDF for admin
              response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?acknowledgmentOnly=true`);
            } else {
              // Use the generic staff PDF endpoint for other forms
              response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
              
              // If generic endpoint fails, try the generic PDF generation endpoint as fallback
              if (!response.ok) {
                response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);
              }
            }
            
            if (!response.ok) {
              const errorText = await response.text().catch(() => '');
              let errorMessage = 'Unable to generate PDF';
              
              // Parse error response
              try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.error || errorData.details || errorMessage;
              } catch {
                if (errorText && errorText.trim()) {
                  errorMessage = errorText.length > 100 ? 'Failed to generate PDF. Please try again.' : errorText;
                }
              }
              
              throw new Error(errorMessage);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const staffName = `${staff?.name || ''}`.replace(/[^a-zA-Z0-9]/g, '_');
            a.download = `${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${staffName}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showToast({
              type: 'success',
              title: 'PDF Downloaded',
              message: `${formTitle} downloaded successfully`,
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
            throw error;
          }
        }}
      />
    </div>
  );
}

