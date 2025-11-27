"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// Temporarily using placeholder icons to fix build issues
const FaArrowLeft = ({ className }: { className?: string }) => <span className={className}>←</span>;
const FaEdit = ({ className }: { className?: string }) => <span className={className}>✏️</span>;
const FaSignature = ({ className }: { className?: string }) => <span className={className}>✍️</span>;
const FaDownload = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const FaUser = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const FaCalendarAlt = ({ className }: { className?: string }) => <span className={className}>📅</span>;
const FaSpinner = ({ className }: { className?: string }) => <span className={className}>⏳</span>;
import { useToast } from '@/components/ui/Toast';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { fetchFormSpecificSettings } from '@/lib/settings';
import NdisWorkforceCapabilityAcknowledgementOverlay from '@/app/form-components/staff/ndis-workforce-capability/AcknowledgementOverlay';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import AdminEditWarningModal from '@/components/ui/AdminEditWarningModal';

// Types
interface StaffFormAssignmentData {
  id: number;
  staffId: number;
  formId: number;
  formVersion: number;
  form: {
    id: number;
    formKey: string;
    title: string;
    requiresSignature: boolean | null;
  };
  staff: {
    id: number;
    firstName: string;
    surname: string;
    email: string;
  };
  submissionData?: any;
  submissionId?: number;
  staffSignature?: string;
  staffSignedAt?: string;
  adminSignature?: string;
  adminSignedAt?: string;
  hasSubmission?: boolean;
}

export default function StaffFormViewPageClient() {
  const params = useParams();
  const { showToast } = useToast();
  
  const staffId = parseInt(params.id as string);
  const assignmentId = parseInt(params.assignmentId as string);
  
  const [assignment, setAssignment] = useState<StaffFormAssignmentData | null>(null);
  const [commonFields, setCommonFields] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [settings, setSettings] = useState({});
  
  // Admin section state for employee details
  const [adminFormData, setAdminFormData] = useState({
    employmentStatus: '',
    payRate: '',
    schadsLevel: '',
    adminSignature: '',
    adminSignedAt: new Date().toISOString().split('T')[0],
  });
  
  // Admin section state for bullying training
  const [bullyingTrainingAdminData, setBullyingTrainingAdminData] = useState({
    managerName: '',
    managerSignature: '',
    managerSignedAt: new Date().toISOString().split('T')[0],
  });
  
  // Admin section state for conflict of interest
  const [conflictOfInterestAdminData, setConflictOfInterestAdminData] = useState({
    reviewedBy: '',
    reviewerTitle: '',
    reviewDate: new Date().toISOString().split('T')[0],
    actionTaken: '',
    hrDecision: '',
    reviewerSignature: '',
    reviewerDate: new Date().toISOString().split('T')[0],
  });
  
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(false); // Track if admin is editing
  const [clearingAdminSignature, setClearingAdminSignature] = useState(false); // Track if clearing signature
  const [showAdminEditWarning, setShowAdminEditWarning] = useState(false); // Show warning modal
  const [pdfKey, setPdfKey] = useState(0); // Force PDF refresh after admin submit

  // Load assignment and submission data
  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

  // Debug: Log adminFormData changes
  useEffect(() => {
    console.log('🟡 [Admin Form Data Changed] Current adminFormData:', adminFormData);
  }, [adminFormData]);

  const loadAssignmentData = async () => {
    try {
      setLoading(true);
      
      console.log('🔵 [View Form] Starting to load assignment data for assignmentId:', assignmentId);

      // First, fetch assignment to get formKey and staffId
      const assignmentRes = await fetch(`/api/staff-form-assignments/${assignmentId}`);
      if (!assignmentRes.ok) {
        const errorData = await assignmentRes.json().catch(() => ({}));
        console.error('❌ [View Form] Failed to load assignment:', errorData);
        throw new Error('Failed to load assignment data');
      }
      
      const assignmentData = await assignmentRes.json();
      console.log('✅ [View Form] Assignment data received:', {
        assignmentId: assignmentData.assignment?.id,
        formKey: assignmentData.assignment?.form?.formKey,
        formTitle: assignmentData.assignment?.form?.title,
        staffId: assignmentData.assignment?.staffId,
        hasSubmission: !!assignmentData.assignment?.hasSubmission,
        submissionId: assignmentData.assignment?.submissionId,
      });
      
      const assignment = assignmentData.assignment;
      const currentFormKey = assignment?.form?.formKey;
      const staffId = assignment?.staffId;

      if (!currentFormKey || !staffId) {
        console.error('❌ [View Form] Missing required data:', { formKey: currentFormKey, staffId, assignment });
        throw new Error('Missing formKey or staffId in assignment');
      }

      console.log('🔍 [View Form] Form details:', {
        formKey: currentFormKey,
        formTitle: assignment.form.title,
        staffId,
        formVersion: assignment.formVersion,
      });

      // Convert formKey from snake_case to kebab-case for API endpoint
      // Special handling for form keys that have different API endpoint names
      let formType = currentFormKey.replace(/_/g, '-');
      
      // Handle special cases where API endpoint name differs from form key
      if (currentFormKey === 'employee_details' || currentFormKey === 'employment_details') {
        formType = 'employment-details'; // API uses 'employment-details', not 'employee-details'
      } else if (currentFormKey === 'employee_welcome' || currentFormKey === 'employment_welcome') {
        formType = 'employment-welcome'; // API uses 'employment-welcome'
      }
      
      console.log('🔄 [View Form] Converted formType:', formType, '(from formKey:', currentFormKey + ')');

      // Try to fetch form data from form-specific endpoint (which processes the data correctly)
      // This endpoint handles signature merging, date formatting, etc.
      let formDataResponse;
      try {
        const formDataUrl = `/api/staff/${staffId}/forms/${formType}`;
        console.log('📡 [View Form] Fetching form data from:', formDataUrl);
        formDataResponse = await fetch(formDataUrl);
        console.log('📡 [View Form] Form data response status:', formDataResponse.status, formDataResponse.ok);
      } catch (e) {
        // If form-specific endpoint doesn't exist, we'll process the raw data below
        console.log(`⚠️ [View Form] Form-specific endpoint not found for ${formType}, using raw data`, e);
      }

      // Fetch settings in parallel
      const [fetchedSettings] = await Promise.all([
        fetchFormSpecificSettings()
      ]);

      let processedFormData = null;
      let staffInfo = assignment.staff;

      if (formDataResponse && formDataResponse.ok) {
        // Use processed data from form-specific endpoint
        const formData = await formDataResponse.json();
        console.log('✅ [View Form] Form data from API:', {
          hasData: !!formData.data,
          dataKeys: formData.data ? Object.keys(formData.data) : [],
          hasStaff: !!formData.staff,
        });
        processedFormData = formData.data;
        staffInfo = formData.staff || staffInfo;
      } else if (assignment.submissionData) {
        console.log('📋 [View Form] Using submission data from assignment:', {
          hasSubmissionData: !!assignment.submissionData,
          submissionDataKeys: assignment.submissionData ? Object.keys(assignment.submissionData) : [],
        });
        // Process raw submission data similar to form-specific endpoints
        processedFormData = { ...(assignment.submissionData || {}) };

        // Add staffName if missing
        if (!processedFormData.staffName && staffInfo) {
          processedFormData.staffName = `${staffInfo.firstName || ''} ${staffInfo.surname || ''}`.trim();
        }

        // Add signature fields in various formats (different forms expect different field names)
        if (assignment.staffSignature) {
          if (!processedFormData.signature) {
            processedFormData.signature = assignment.staffSignature;
          }
          if (!processedFormData.staffSignature) {
            processedFormData.staffSignature = assignment.staffSignature;
          }
          // Form-specific signature fields
          if (currentFormKey === 'orientation' && !processedFormData.orientationSignature) {
            processedFormData.orientationSignature = assignment.staffSignature;
          }
          if (currentFormKey === 'fair_work_information' && !processedFormData.fairWorkSignature) {
            processedFormData.fairWorkSignature = assignment.staffSignature;
          }
          if (currentFormKey === 'govt_tax' && !processedFormData.payeeSignature) {
            processedFormData.payeeSignature = assignment.staffSignature;
          }
          // NDIS form uses signature field directly
          if (currentFormKey === 'ndis_workforce_capability' && !processedFormData.signature) {
            processedFormData.signature = assignment.staffSignature;
          }
        }

        // Add date fields
        const dateValue =
          processedFormData.date ||
          processedFormData.acknowledgedAt ||
          processedFormData.staffSignedAt ||
          (assignment.staffSignedAt
            ? new Date(assignment.staffSignedAt).toISOString().split('T')[0]
            : '');

        if (dateValue) {
          processedFormData.date = dateValue;
        }

        if (currentFormKey === 'govt_tax' && assignment.staffSignedAt && !processedFormData.payeeSignatureAt) {
          processedFormData.payeeSignatureAt = new Date(assignment.staffSignedAt).toISOString().split('T')[0];
        }
        
        // NDIS form - ensure fullName is set
        if (currentFormKey === 'ndis_workforce_capability' && !processedFormData.fullName) {
          const staffFullName = staffInfo ? `${staffInfo.firstName || ''} ${staffInfo.surname || ''}`.trim() : '';
          processedFormData.fullName = processedFormData.staffName || staffFullName;
        }
      }

      // Update assignment with processed data
      const updatedAssignment = {
        ...assignment,
        submissionData: {
          ...processedFormData,
          staffSignature: assignment.staffSignature,
          staffSignedAt: assignment.staffSignedAt,
          adminSignature: assignment.adminSignature,
          adminSignedAt: assignment.adminSignedAt,
        },
        staff: staffInfo,
      };

      console.log('✅ [View Form] Final assignment prepared:', {
        formKey: updatedAssignment.form.formKey,
        formTitle: updatedAssignment.form.title,
        hasSubmissionData: !!updatedAssignment.submissionData,
        submissionDataKeys: updatedAssignment.submissionData ? Object.keys(updatedAssignment.submissionData) : [],
        hasStaffSignature: !!updatedAssignment.staffSignature,
        hasAdminSignature: !!updatedAssignment.adminSignature,
        staffName: staffInfo ? `${staffInfo.firstName} ${staffInfo.surname}` : 'N/A',
      });

      setAssignment(updatedAssignment);
      setCommonFields(assignmentData.commonFields || {});
      setSettings(fetchedSettings);
      
      // Update admin form data if assignment has admin data
      // Only update if NOT in edit mode (to preserve user's current input when editing)
      console.log('🟢 [Load Assignment] Checking admin form data update:', {
        hasSubmissionData: !!updatedAssignment.submissionData,
        editingAdmin,
        willUpdate: !!(updatedAssignment.submissionData && !editingAdmin),
        formKey: updatedAssignment.form.formKey,
      });
      
      // Update admin form data based on form type
      // Use updatedAssignment.form.formKey (same as currentFormKey but from updated assignment)
      const updatedFormKey = updatedAssignment.form.formKey;
      if (updatedAssignment.submissionData && !editingAdmin) {
        if (updatedFormKey === 'employee_details' || updatedFormKey === 'employment_details') {
          // Employee Details form
          const newAdminFormData = {
            employmentStatus: updatedAssignment.submissionData.employmentStatus || updatedAssignment.submissionData?.data?.employmentStatus || '',
            payRate: updatedAssignment.submissionData.payRate || updatedAssignment.submissionData?.data?.payRate || '',
            schadsLevel: updatedAssignment.submissionData.schadsLevel || updatedAssignment.submissionData.schadsScore || updatedAssignment.submissionData?.data?.schadsLevel || updatedAssignment.submissionData?.data?.schadsScore || '',
            adminSignature: updatedAssignment.submissionData.adminSignature || '',
            adminSignedAt: updatedAssignment.submissionData.adminSignedAt 
              ? new Date(updatedAssignment.submissionData.adminSignedAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
          };
          setAdminFormData(newAdminFormData);
        } else if (updatedFormKey === 'bullying_training') {
          // Bullying Training form
          const submissionData = updatedAssignment.submissionData;
          const data = submissionData.data || submissionData;
          setBullyingTrainingAdminData({
            managerName: data.managerName || '',
            managerSignature: submissionData.adminSignature || data.managerSignature || '',
            managerSignedAt: submissionData.adminSignedAt || data.managerSignedAt
              ? new Date(submissionData.adminSignedAt || data.managerSignedAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
          });
        } else if (updatedFormKey === 'conflict_of_interest') {
          // Conflict of Interest form
          const submissionData = updatedAssignment.submissionData;
          const data = submissionData.data || submissionData;
          setConflictOfInterestAdminData({
            reviewedBy: data.reviewedBy || '',
            reviewerTitle: data.reviewerTitle || '',
            reviewDate: data.reviewDate || new Date().toISOString().split('T')[0],
            actionTaken: data.actionTaken || '',
            hrDecision: data.hrDecision || '',
            reviewerSignature: submissionData.adminSignature || data.reviewerSignature || '',
            reviewerDate: submissionData.adminSignedAt || data.reviewerDate
              ? new Date(submissionData.adminSignedAt || data.reviewerDate).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
          });
        }
      } else if (editingAdmin) {
        console.log('🟢 [Load Assignment] Skipping adminFormData update because editingAdmin is true');
      }
      
      console.log('✅ [View Form] State updated, component will render');

    } catch (error) {
      console.error('Error loading assignment or settings:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load form data or settings',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear admin signature function
  const handleClearAdminSignature = async () => {
    if (!assignment) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Assignment data not available',
        duration: 3000,
      });
      return;
    }

    try {
      setClearingAdminSignature(true);
      setShowAdminEditWarning(false);

      // PRESERVE existing field values BEFORE clearing signature
      // This ensures the form fields remain filled when entering edit mode
      const currentFormKey = assignment.form.formKey;
      console.log('🔵 [Clear Signature] ===== START CLEAR SIGNATURE =====');
      console.log('🔵 [Clear Signature] Current assignment:', {
        hasAssignment: !!assignment,
        formKey: currentFormKey,
        hasSubmissionData: !!assignment?.submissionData,
        submissionDataKeys: assignment?.submissionData ? Object.keys(assignment.submissionData) : [],
      });
      
      const submissionData = assignment?.submissionData || {};
      const nestedData = submissionData.data || {};
      
      // Preserve field values based on form type
      let preservedFieldValues: any = {};
      
      if (currentFormKey === 'employee_details' || currentFormKey === 'employment_details') {
        preservedFieldValues = {
          employmentStatus: submissionData.employmentStatus || nestedData.employmentStatus || adminFormData.employmentStatus || '',
          payRate: submissionData.payRate || nestedData.payRate || adminFormData.payRate || '',
          schadsLevel: submissionData.schadsLevel || submissionData.schadsScore || nestedData.schadsLevel || nestedData.schadsScore || adminFormData.schadsLevel || '',
        };
        console.log('🔵 [Clear Signature] Preserved Employee Details values:', preservedFieldValues);
      } else if (currentFormKey === 'bullying_training') {
        preservedFieldValues = {
          managerName: nestedData.managerName || submissionData.managerName || bullyingTrainingAdminData.managerName || '',
        };
        console.log('🔵 [Clear Signature] Preserved Bullying Training values:', preservedFieldValues);
      } else if (currentFormKey === 'conflict_of_interest') {
        preservedFieldValues = {
          reviewedBy: nestedData.reviewedBy || submissionData.reviewedBy || conflictOfInterestAdminData.reviewedBy || '',
          reviewerTitle: nestedData.reviewerTitle || submissionData.reviewerTitle || conflictOfInterestAdminData.reviewerTitle || '',
          reviewDate: nestedData.reviewDate || submissionData.reviewDate || conflictOfInterestAdminData.reviewDate || '',
          actionTaken: nestedData.actionTaken || submissionData.actionTaken || conflictOfInterestAdminData.actionTaken || '',
          hrDecision: nestedData.hrDecision || submissionData.hrDecision || conflictOfInterestAdminData.hrDecision || '',
        };
        console.log('🔵 [Clear Signature] Preserved Conflict of Interest values:', preservedFieldValues);
      }
      
      console.log('🔵 [Clear Signature] Full submissionData:', JSON.stringify(submissionData, null, 2));

      // Determine form type from formKey
      let formType: string;
      
      if (currentFormKey === 'employee_details' || currentFormKey === 'employment_details') {
        formType = 'employee-details';
      } else if (currentFormKey === 'conflict_of_interest') {
        formType = 'conflict-of-interest';
      } else if (currentFormKey === 'bullying_training') {
        formType = 'bullying-training';
      } else {
        throw new Error('Form type not supported for admin signature clearing');
      }

      const response = await fetch(`/api/staff/${staffId}/forms/${formType}/clear-admin-signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Parse response
      let result: any;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ [Clear Signature] Failed to parse response:', parseError);
        throw new Error('Invalid response from server. Please try again.');
      }

      // Check if request was successful
      if (!response.ok) {
        // Handle different error status codes
        const errorMessage = result.message || result.error || `Failed to clear admin signature (HTTP ${response.status})`;
        
        // Specific error messages based on status code
        let userFriendlyMessage = errorMessage;
        if (response.status === 400) {
          if (errorMessage.includes('No admin signature found')) {
            userFriendlyMessage = 'No admin signature found to clear. The form may not have been signed yet.';
          } else if (errorMessage.includes('Invalid')) {
            userFriendlyMessage = 'Invalid request. Please refresh the page and try again.';
          }
        } else if (response.status === 404) {
          userFriendlyMessage = 'Form submission not found. The form may have been deleted or not yet submitted.';
        } else if (response.status === 500) {
          if (errorMessage.includes('Signature not cleared')) {
            userFriendlyMessage = 'Failed to clear admin signature from database. Please try again or contact support if the issue persists.';
          } else {
            userFriendlyMessage = 'Server error occurred while clearing signature. Please try again.';
          }
        }

        showToast({
          type: 'error',
          title: 'Failed to Clear Signature',
          message: userFriendlyMessage,
          duration: 5000,
        });
        
        console.error('❌ [Clear Signature] API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: result,
        });
        
        return; // Exit early on error
      }

      // Verify that signature was actually cleared
      if (!result.success) {
        const failureMessage = result.message || result.error || 'Signature was not cleared successfully';
        showToast({
          type: 'error',
          title: 'Signature Not Cleared',
          message: failureMessage,
          duration: 5000,
        });
        console.error('❌ [Clear Signature] Signature not cleared:', result);
        return; // Exit early if not cleared
      }

      // Success - signature was cleared
      const successMessage = result.message || 'Admin signature cleared successfully';
      showToast({
        type: 'success',
        title: 'Signature Cleared',
        message: successMessage,
        duration: 3000,
      });
      
      console.log('✅ [Clear Signature] Signature cleared successfully:', result.details || {});

      // Enable edit mode FIRST, so loadAssignmentData() won't overwrite our form data
      setEditingAdmin(true);
      
      // Set form data with preserved field values (signature cleared) based on form type
      if (currentFormKey === 'employee_details' || currentFormKey === 'employment_details') {
        const newFormData = {
          employmentStatus: preservedFieldValues.employmentStatus,
          payRate: preservedFieldValues.payRate,
          schadsLevel: preservedFieldValues.schadsLevel,
          adminSignature: '', // Clear signature only
          adminSignedAt: new Date().toISOString().split('T')[0],
        };
        console.log('🔵 [Clear Signature] Setting adminFormData to:', newFormData);
        setAdminFormData(newFormData);
      } else if (currentFormKey === 'bullying_training') {
        const newFormData = {
          managerName: preservedFieldValues.managerName,
          managerSignature: '', // Clear signature only
          managerSignedAt: new Date().toISOString().split('T')[0],
        };
        console.log('🔵 [Clear Signature] Setting bullyingTrainingAdminData to:', newFormData);
        setBullyingTrainingAdminData(newFormData);
      } else if (currentFormKey === 'conflict_of_interest') {
        const newFormData = {
          reviewedBy: preservedFieldValues.reviewedBy,
          reviewerTitle: preservedFieldValues.reviewerTitle,
          reviewDate: preservedFieldValues.reviewDate,
          actionTaken: preservedFieldValues.actionTaken,
          hrDecision: preservedFieldValues.hrDecision,
          reviewerSignature: '', // Clear signature only
          reviewerDate: new Date().toISOString().split('T')[0],
        };
        console.log('🔵 [Clear Signature] Setting conflictOfInterestAdminData to:', newFormData);
        setConflictOfInterestAdminData(newFormData);
      }
      
      // Reload assignment data to get updated status (won't overwrite form data since editingAdmin is true)
      console.log('🔵 [Clear Signature] About to call loadAssignmentData(), editingAdmin:', true);
      await loadAssignmentData();
      console.log('🔵 [Clear Signature] ===== END CLEAR SIGNATURE =====');

    } catch (error: unknown) {
      console.error('❌ [Clear Signature] Unexpected error:', error);
      
      // Determine error message
      let errorMessage = 'An unexpected error occurred while clearing the signature.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setClearingAdminSignature(false);
    }
  };

  // Download PDF function
  const handleDownloadPDF = async () => {
    if (!assignment || !assignment.submissionId) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Cannot download PDF: Form submission not found',
        duration: 3000,
      });
      return;
    }

    try {
      setDownloadingPDF(true);
      
      // Convert formKey from snake_case to kebab-case for API endpoint
      const formKey = assignment.form.formKey;
      let formType = formKey.replace(/_/g, '-');
      
      // Handle special cases where PDF endpoint name differs from form key
      // PDF endpoints use 'employee-details' not 'employment-details'
      let pdfFormType = formType;
      if (formKey === 'employee_details' || formKey === 'employment_details') {
        pdfFormType = 'employee-details'; // PDF uses 'employee-details'
      }
      
      console.log('📥 [View Form] Download PDF - formKey:', formKey, 'pdfFormType:', pdfFormType);
      
      let response;
      
      // Check if form has a specific PDF route
      // Note: bullying_harassment_training now returns only acknowledgement form PDF (no merge by default)
      if (formKey === 'ndis_workforce_capability') {
        // NDIS form merges framework PDF with acknowledgement
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?merge=true`);
        
        // If that fails, try without merge
        if (!response.ok) {
          response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
        }
      } else if (formKey === 'bullying_harassment_training') {
        // Bullying Harassment Training returns only acknowledgement form PDF (no merge)
        console.log('📥 [View Form] Fetching acknowledgement form PDF only (no merge)');
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
      } else if (formKey === 'vehicle_safety_inspection') {
        // Vehicle Safety Inspection returns only acknowledgment form PDF for admin
        console.log('📥 [View Form] Fetching acknowledgment form PDF only for vehicle_safety_inspection');
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?acknowledgmentOnly=true`);
      } else {
        // Use the generic staff PDF endpoint for other forms
        console.log('📥 [View Form] Fetching PDF from:', `/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
        
        // If generic endpoint fails, try the generic PDF generation endpoint as fallback
        if (!response.ok) {
          console.log('⚠️ [View Form] Generic PDF endpoint failed, trying fallback');
          response = await fetch(`/api/generate-pdf/${assignment.submissionId}/${assignment.form.id}`);
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorMessage = 'Unable to generate PDF';
        let errorTitle = 'Download Failed';
        
        // Parse error response
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorData.details || errorMessage;
          
          // Set user-friendly title based on error type
          if (response.status === 404) {
            errorTitle = 'Form Not Found';
            errorMessage = 'The form data could not be found. Please ensure the form has been submitted.';
          } else if (response.status === 500) {
            errorTitle = 'Server Error';
            errorMessage = 'An error occurred while generating the PDF. Please try again or contact support.';
          } else if (response.status === 503) {
            errorTitle = 'Service Unavailable';
            errorMessage = 'The PDF service is temporarily unavailable. Please try again in a moment.';
          }
        } catch {
          // If not JSON, use the text or default message
          if (errorText && errorText.trim()) {
            errorMessage = errorText.length > 100 ? 'Failed to generate PDF. Please try again.' : errorText;
          }
          
          // Set title based on status code
          if (response.status === 404) {
            errorTitle = 'Form Not Found';
            errorMessage = 'The form data could not be found.';
          } else if (response.status >= 500) {
            errorTitle = 'Server Error';
            errorMessage = 'An error occurred while generating the PDF. Please try again.';
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const blob = await response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('The generated PDF file is empty. Please try again.');
      }
      
      // Check if blob is actually a PDF
      if (blob.type && !blob.type.includes('pdf')) {
        // Might be an error JSON response
        const text = await blob.text().catch(() => '');
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || errorData.error || 'Invalid PDF file received');
        } catch {
          throw new Error('Received an invalid file. Please try again.');
        }
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.position = 'fixed';
      a.style.left = '-9999px';
      a.style.top = '-9999px';
      a.href = url;
      const staffName = `${assignment.staff.firstName || ''}_${assignment.staff.surname || ''}`.replace(/[^a-zA-Z0-9]/g, '_');
      const formTitle = assignment.form.formKey === 'vehicle_safety_inspection' 
        ? 'Vehicle_Safety_Inspection_Acknowledgment'
        : assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `${formTitle}_${staffName}.pdf`;
      
      console.log('🔵 [View Form Download] Appending link to body...');
      document.body.appendChild(a);
      console.log('🔵 [View Form Download] Link appended, triggering click...');
      a.click();
      console.log('🔵 [View Form Download] Click triggered');
      
      // Cleanup with safety checks
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('🔵 [View Form Download] Cleanup - checking link state...');
          if (a && a.parentNode === document.body) {
            try {
              console.log('🔵 [View Form Download] Removing link from body...');
              document.body.removeChild(a);
              console.log('✅ [View Form Download] Link removed successfully');
            } catch (e: any) {
              console.error('❌ [View Form Download] Error removing link:', e);
            }
          } else {
            console.warn('⚠️ [View Form Download] Link not removed - parentNode check failed');
          }
          
          // Revoke URL after delay
          setTimeout(() => {
            if (url) {
              window.URL.revokeObjectURL(url);
              console.log('✅ [View Form Download] URL revoked');
            }
          }, 1000);
        });
      });
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'PDF downloaded successfully',
        duration: 3000,
      });
      
    } catch (error: unknown) {
      console.error('❌ [View Form] Error downloading PDF:', error);
      
      let errorTitle = 'Download Failed';
      let errorMessage = 'Unable to download PDF. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide user-friendly messages for common errors
        if (error.message.includes('not found') || error.message.includes('404')) {
          errorTitle = 'Form Not Found';
          errorMessage = 'The form data could not be found. Please ensure the form has been submitted.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorTitle = 'Connection Error';
          errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message.includes('empty') || error.message.includes('invalid')) {
          errorTitle = 'PDF Generation Error';
          errorMessage = 'The PDF could not be generated properly. Please try again or contact support.';
        } else if (error.message.includes('500') || error.message.includes('Server Error')) {
          errorTitle = 'Server Error';
          errorMessage = 'An error occurred on the server. Please try again in a moment.';
        }
      }
      
      showToast({
        type: 'error',
        title: errorTitle,
        message: errorMessage,
        duration: 6000,
      });
    } finally {
      setDownloadingPDF(false);
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
              Loading View Form
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

  if (!assignment || !assignment.hasSubmission || !assignment.submissionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-xl shadow-sm p-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {!assignment ? 'Form Not Found' : 'Form Not Filled Yet'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {!assignment 
                ? 'The requested form assignment could not be found.'
                : 'This form has not been filled yet.'
              }
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link 
                href={`/admin/staff/${staffId}`}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Forms List
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate staff form component from registry
  console.log('🎨 [View Form] Determining which component to render for formKey:', assignment.form.formKey);
  
  let FormViewComponent;
  try {
    FormViewComponent = getStaffFormComponent(assignment.form.formKey);
    console.log('✅ [View Form] Form component found:', FormViewComponent ? FormViewComponent.name : 'unknown');
  } catch (error) {
    console.error('❌ [View Form] Failed to get form component:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-xl shadow-sm p-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Component Not Found</h1>
            <p className="text-gray-600 mb-8">
              No view component found for form: {assignment.form.formKey}
            </p>
            <Link 
              href={`/admin/staff/${staffId}`}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Forms List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const staffName = `${assignment.staff.firstName || ''} ${assignment.staff.surname || ''}`.trim();
  
  // Check if this is NDIS Workforce Capability form - use overlay component
  const isNdisForm = assignment.form.formKey === 'ndis_workforce_capability';
  
  // Check if this is Employee Welcome form - use PDF viewer (like employee details)
  // This ensures what you see matches exactly what gets downloaded
  const isEmployeeWelcomeForm = assignment.form.formKey === 'employee_welcome' || assignment.form.formKey === 'employment_welcome';
  
  // Check if this is Employee Details form - use PDF viewer (like dedicated page)
  // This ensures what you see matches exactly what gets downloaded
  const isEmployeeDetailsForm = assignment.form.formKey === 'employee_details' || assignment.form.formKey === 'employment_details';
  
  // Check if this is Bullying Training form - use PDF viewer with admin section
  const isBullyingTrainingForm = assignment.form.formKey === 'bullying_training';
  
  // Check if this is Bullying Harassment Training form - use PDF viewer (acknowledgement form only)
  const isBullyingHarassmentTrainingForm = assignment.form.formKey === 'bullying_harassment_training';
  
  // Check if this is Conflict of Interest form - use PDF viewer with admin section
  const isConflictOfInterestForm = assignment.form.formKey === 'conflict_of_interest';
  
  // Check if this is Vehicle Safety Inspection form - use PDF viewer (acknowledgment form only)
  const isVehicleSafetyInspectionForm = assignment.form.formKey === 'vehicle_safety_inspection';
  
  // Check if this is Support Worker (Position Description) form - use PDF viewer (matches download)
  const isSupportWorkerForm = assignment.form.formKey === 'support_worker';
  
  // Check if this is Pre-Employment Medical form - use PDF viewer (matches download)
  const isPreEmploymentMedicalForm = assignment.form.formKey === 'pre_employment_medical';
  
  // Check if this is Documentation Acknowledgement form - use PDF viewer (matches download)
  const isDocumentationAcknowledgementForm = assignment.form.formKey === 'documentation_acknowledgement';
  
  console.log('🎨 [View Form] Rendering decision:', {
    formKey: assignment.form.formKey,
    isEmployeeDetailsForm,
    isBullyingTrainingForm,
    isBullyingHarassmentTrainingForm,
    isConflictOfInterestForm,
    isEmployeeWelcomeForm,
    isNdisForm,
    isVehicleSafetyInspectionForm,
    isSupportWorkerForm,
    isPreEmploymentMedicalForm,
    isDocumentationAcknowledgementForm,
    willUsePDFViewer: isEmployeeDetailsForm || isEmployeeWelcomeForm || isBullyingTrainingForm || isBullyingHarassmentTrainingForm || isConflictOfInterestForm || isVehicleSafetyInspectionForm || isSupportWorkerForm || isPreEmploymentMedicalForm || isDocumentationAcknowledgementForm,
    willUseFormComponent: !isEmployeeDetailsForm && !isEmployeeWelcomeForm && !isNdisForm && !isBullyingTrainingForm && !isBullyingHarassmentTrainingForm && !isConflictOfInterestForm && !isVehicleSafetyInspectionForm && !isSupportWorkerForm && !isPreEmploymentMedicalForm && !isDocumentationAcknowledgementForm,
  });
  
  // Prepare overlay data for NDIS form
  const overlayData = isNdisForm && assignment.submissionData ? {
    fullName: assignment.submissionData.fullName || assignment.submissionData.staffName || staffName,
    signature: assignment.submissionData.signature || assignment.submissionData.staffSignature || '',
    date: assignment.submissionData.date || assignment.submissionData.staffSignedAt || '',
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <div className="flex items-center mb-4">
            <Link 
              href={`/admin/staff/${staffId}/forms`}
              className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
            >
              <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Forms
            </Link>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-slate-900 truncate">
                  {assignment.form.title}
                </h1>
                <div className="flex items-center text-sm text-slate-600 space-x-4 mt-1">
                  <span className="font-medium">{staffName}</span>
                  <span className="text-slate-400">•</span>
                  <span className="truncate">{assignment.staff.email}</span>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center whitespace-nowrap">
                    <FaCalendarAlt className="h-3 w-3 mr-1" />
                    Version {assignment.formVersion}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Signature Status */}
              {assignment.staffSignature && (
                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 min-w-[130px]">
                  <FaSignature className="h-4 w-4" />
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">Signed</span>
                    <span className="text-xs text-emerald-600">
                      {assignment.staffSignedAt ? new Date(assignment.staffSignedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                title="Download PDF"
              >
                {downloadingPDF ? (
                  <>
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <FaDownload className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content with Enhanced Styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEmployeeDetailsForm ? (
          /* Use PDF viewer for Employee Details form - shows generated PDF (matches download) */
          (() => {
            console.log('📄 [View Form] Rendering Employee Details PDF viewer');
            // PDF endpoint uses 'employee-details' not 'employment-details'
            const pdfUrl = `/api/staff/${staffId}/forms/employee-details/pdf?key=${pdfKey}`;
            console.log('📄 [View Form] PDF URL:', pdfUrl);
            
            const staffHasSigned = !!assignment?.staffSignature;
            const adminHasSigned = !!(assignment?.submissionData?.adminSignature || assignment?.adminSignature);
            const showAdminSection = staffHasSigned && (!adminHasSigned || editingAdmin);
            
            const handleAdminSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              
              // Validate required fields
              if (!adminFormData.employmentStatus || !adminFormData.payRate || !adminFormData.schadsLevel || !adminFormData.adminSignature) {
                showToast({
                  type: 'error',
                  title: 'Validation Error',
                  message: 'Please fill all required fields: Employment Status, Pay Rate, SCHADS Level, and Admin Signature',
                  duration: 5000,
                });
                return;
              }
              
              try {
                setSubmittingAdmin(true);
                
                const response = await fetch(`/api/staff/${staffId}/forms/employee-details/admin`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    employmentStatus: adminFormData.employmentStatus,
                    payRate: adminFormData.payRate,
                    schadsLevel: adminFormData.schadsLevel,
                    adminSignature: adminFormData.adminSignature,
                    adminSignedAt: adminFormData.adminSignedAt,
                  }),
                });
                
                // Parse response
                let result: any;
                try {
                  result = await response.json();
                } catch (parseError) {
                  console.error('❌ [Admin Submit] Failed to parse response:', parseError);
                  throw new Error('Invalid response from server. Please try again.');
                }
                
                if (!response.ok) {
                  // Handle different error status codes
                  const errorMessage = result.message || result.error || `Failed to submit admin section (HTTP ${response.status})`;
                  
                  let userFriendlyMessage = errorMessage;
                  if (response.status === 400) {
                    if (errorMessage.includes('required')) {
                      userFriendlyMessage = 'Please fill all required fields before submitting.';
                    } else {
                      userFriendlyMessage = 'Invalid data provided. Please check your input and try again.';
                    }
                  } else if (response.status === 404) {
                    userFriendlyMessage = 'Form submission not found. The form may have been deleted.';
                  } else if (response.status === 500) {
                    userFriendlyMessage = 'Server error occurred. Please try again or contact support if the issue persists.';
                  }
                  
                  showToast({
                    type: 'error',
                    title: 'Submission Failed',
                    message: userFriendlyMessage,
                    duration: 5000,
                  });
                  
                  console.error('❌ [Admin Submit] API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: result,
                  });
                  
                  return; // Exit early on error
                }
                
                // Success - show success message
                const successMessage = result.message || 'Admin section submitted successfully';
                showToast({
                  type: 'success',
                  title: 'Success',
                  message: successMessage,
                  duration: 3000,
                });
                
                // Reload assignment data to refresh PDF
                setPdfKey(prev => prev + 1); // Force PDF refresh
                setEditingAdmin(false); // Exit edit mode after successful submit
                await loadAssignmentData();
                
              } catch (error: unknown) {
                console.error('❌ [Admin Submit] Unexpected error:', error);
                
                // Determine error message
                let errorMessage = 'An unexpected error occurred while submitting.';
                if (error instanceof Error) {
                  errorMessage = error.message;
                }
                
                // Check if it's a network error
                if (error instanceof TypeError && error.message.includes('fetch')) {
                  errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
                }
                
                showToast({
                  type: 'error',
                  title: 'Submission Failed',
                  message: errorMessage,
                  duration: 5000,
                });
              } finally {
                setSubmittingAdmin(false);
              }
            };
            
            return (
              <div className="space-y-6">
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                  <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
                </div>
                
                {/* Admin Section - Only show if staff has signed and admin hasn't */}
                {showAdminSection && (
                  <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Section - Office Use Only</h3>
                      <form onSubmit={handleAdminSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Employment Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Employment Status <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="employmentStatus"
                                  value="FullTime"
                                  checked={adminFormData.employmentStatus === 'FullTime'}
                                  onChange={(e) => setAdminFormData({...adminFormData, employmentStatus: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                  required
                                />
                                <span className="text-sm">Full time</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="employmentStatus"
                                  value="PartTime"
                                  checked={adminFormData.employmentStatus === 'PartTime'}
                                  onChange={(e) => setAdminFormData({...adminFormData, employmentStatus: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">Part time</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="employmentStatus"
                                  value="Casual"
                                  checked={adminFormData.employmentStatus === 'Casual'}
                                  onChange={(e) => setAdminFormData({...adminFormData, employmentStatus: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm">Casual</span>
                              </label>
                            </div>
                          </div>
                          
                          {/* Pay Rate and SCHADS Level */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pay Rate <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={adminFormData.payRate}
                                onChange={(e) => setAdminFormData({...adminFormData, payRate: e.target.value})}
                                placeholder="e.g., $25.00/hour"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                SCHADS Level <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={adminFormData.schadsLevel}
                                onChange={(e) => setAdminFormData({...adminFormData, schadsLevel: e.target.value})}
                                placeholder="e.g., Level 3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Admin Signature */}
                        <div className="border-t border-gray-200 pt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Admin Signature <span className="text-red-500">*</span>
                          </label>
                          <SignatureCanvas
                            existingSignature={adminFormData.adminSignature}
                            onSignatureEnd={(sig) => setAdminFormData({...adminFormData, adminSignature: sig})}
                            onSignatureClear={() => setAdminFormData({...adminFormData, adminSignature: ''})}
                            width={500}
                            height={150}
                            className="bg-white border-2 border-gray-300 rounded-lg"
                          />
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={adminFormData.adminSignedAt}
                              onChange={(e) => setAdminFormData({...adminFormData, adminSignedAt: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                          {editingAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdmin(false);
                                // Reset form to original data
                                if (assignment) {
                                  setAdminFormData({
                                    employmentStatus: assignment?.submissionData?.data?.employmentStatus || '',
                                    payRate: assignment?.submissionData?.data?.payRate || '',
                                    schadsLevel: assignment?.submissionData?.data?.schadsLevel || assignment?.submissionData?.data?.schadsScore || '',
                                    adminSignature: assignment?.submissionData?.adminSignature || assignment?.adminSignature || '',
                                    adminSignedAt: (assignment?.submissionData?.adminSignedAt || assignment?.adminSignedAt)
                                      ? new Date(assignment?.submissionData?.adminSignedAt || assignment?.adminSignedAt || '').toISOString().split('T')[0]
                                      : new Date().toISOString().split('T')[0],
                                  });
                                }
                              }}
                              disabled={submittingAdmin}
                              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={submittingAdmin}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                          >
                            {submittingAdmin ? (
                              <>
                                <FaSpinner className="h-4 w-4 animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : editingAdmin ? (
                              'Update Admin Section'
                            ) : (
                              'Submit Admin Section'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Show simple message if admin has signed and not editing */}
                {adminHasSigned && !editingAdmin && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-center justify-between">
                    <p className="text-sm text-green-800 font-semibold">
                      ✅ Admin section has been completed. This form is fully approved.
                    </p>
                        <button
                          onClick={() => setShowAdminEditWarning(true)}
                          disabled={clearingAdminSignature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                        >
                          {clearingAdminSignature ? (
                            <>
                          <FaSpinner className="h-4 w-4 animate-spin" />
                          Clearing...
                            </>
                          ) : (
                            <>
                          <FaEdit className="h-4 w-4" />
                          Edit
                            </>
                          )}
                        </button>
                  </div>
                )}
              </div>
            );
          })()
        ) : isEmployeeWelcomeForm ? (
          /* Use PDF viewer for Employee Welcome form - shows generated PDF (matches download) */
          (() => {
            console.log('📄 [View Form] Rendering Employee Welcome PDF viewer');
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <AdminPDFCanvasViewer pdfUrl={`/api/staff/${staffId}/forms/employee-welcome/pdf`} />
              </div>
            );
          })()
        ) : isBullyingHarassmentTrainingForm ? (
          /* Use PDF viewer for Bullying Harassment Training form - shows acknowledgement form PDF only */
          (() => {
            console.log('📄 [View Form] Rendering Bullying Harassment Training PDF viewer (acknowledgement form only)');
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <AdminPDFCanvasViewer pdfUrl={`/api/staff/${staffId}/forms/bullying-harassment-training/pdf`} />
              </div>
            );
          })()
        ) : isVehicleSafetyInspectionForm ? (
          /* Use PDF viewer for Vehicle Safety Inspection form - shows acknowledgment form PDF only */
          (() => {
            console.log('📄 [View Form] Rendering Vehicle Safety Inspection PDF viewer (acknowledgment form only)');
            const pdfUrl = `/api/staff/${staffId}/forms/vehicle-safety-inspection/pdf?acknowledgmentOnly=true`;
            console.log('📄 [View Form] Vehicle Safety Inspection PDF URL:', pdfUrl);
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
              </div>
            );
          })()
        ) : isBullyingTrainingForm ? (
          /* Use PDF viewer for Bullying Training form with admin section */
          (() => {
            console.log('📄 [View Form] Rendering Bullying Training PDF viewer with admin section');
            const pdfUrl = `/api/staff/${staffId}/forms/bullying-training/pdf?key=${pdfKey}`;
            
            const staffHasSigned = !!assignment?.staffSignature;
            const adminHasSigned = !!(assignment?.submissionData?.adminSignature || assignment?.adminSignature);
            const showAdminSection = staffHasSigned && (!adminHasSigned || editingAdmin);
            
            const handleBullyingTrainingAdminSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              
              // Validate required fields
              if (!bullyingTrainingAdminData.managerName?.trim() || !bullyingTrainingAdminData.managerSignature) {
                showToast({
                  type: 'error',
                  title: 'Validation Error',
                  message: 'Please fill all required fields: Manager Name and Manager Signature',
                  duration: 5000,
                });
                return;
              }
              
              try {
                setSubmittingAdmin(true);
                
                const response = await fetch(`/api/staff/${staffId}/forms/bullying-training/admin`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    managerName: bullyingTrainingAdminData.managerName,
                    managerSignature: bullyingTrainingAdminData.managerSignature,
                    managerSignedAt: bullyingTrainingAdminData.managerSignedAt,
                  }),
                });
                
                // Parse response
                let result: any;
                try {
                  result = await response.json();
                } catch (parseError) {
                  console.error('❌ [Bullying Training Admin] Failed to parse response:', parseError);
                  throw new Error('Invalid response from server. Please try again.');
                }
                
                if (!response.ok) {
                  // Handle different error status codes
                  const errorMessage = result.message || result.error || `Failed to submit manager acknowledgement (HTTP ${response.status})`;
                  
                  let userFriendlyMessage = errorMessage;
                  if (response.status === 400) {
                    if (errorMessage.includes('required')) {
                      userFriendlyMessage = 'Please fill all required fields: Manager Name and Manager Signature.';
                    } else if (errorMessage.includes('Staff signature required')) {
                      userFriendlyMessage = 'Staff member must sign the form before manager acknowledgement.';
                    } else {
                      userFriendlyMessage = 'Invalid data provided. Please check your input and try again.';
                    }
                  } else if (response.status === 404) {
                    userFriendlyMessage = 'Form submission not found. Staff must submit their section before manager approval.';
                  } else if (response.status === 500) {
                    userFriendlyMessage = 'Server error occurred. Please try again or contact support if the issue persists.';
                  }
                  
                  showToast({
                    type: 'error',
                    title: 'Submission Failed',
                    message: userFriendlyMessage,
                    duration: 5000,
                  });
                  
                  console.error('❌ [Bullying Training Admin] API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: result,
                  });
                  
                  return; // Exit early on error
                }
                
                // Success - show success message
                const successMessage = result.message || 'Manager acknowledgement submitted successfully';
                showToast({
                  type: 'success',
                  title: 'Success',
                  message: successMessage,
                  duration: 3000,
                });
                
                // Reload assignment data to refresh PDF
                setPdfKey(prev => prev + 1);
                setEditingAdmin(false);
                await loadAssignmentData();
                
              } catch (error: unknown) {
                console.error('❌ [Bullying Training Admin] Error submitting:', error);
                
                // Determine error message
                let errorMessage = 'Failed to submit manager acknowledgement.';
                if (error instanceof Error) {
                  errorMessage = error.message;
                }
                
                // Check if it's a network error
                if (error instanceof TypeError && error.message.includes('fetch')) {
                  errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
                }
                
                showToast({
                  type: 'error',
                  title: 'Submission Failed',
                  message: errorMessage,
                  duration: 5000,
                });
              } finally {
                setSubmittingAdmin(false);
              }
            };
            
            return (
              <div className="space-y-6">
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                  <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
                </div>
                
                {/* Admin Section - Only show if staff has signed and admin hasn't */}
                {showAdminSection && (
                  <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Manager Acknowledgement - Office Use Only</h3>
                      <form onSubmit={handleBullyingTrainingAdminSubmit} className="space-y-6">
                        {/* Manager Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Manager Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={bullyingTrainingAdminData.managerName}
                            onChange={(e) => setBullyingTrainingAdminData({...bullyingTrainingAdminData, managerName: e.target.value})}
                            placeholder="Enter manager name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        
                        {/* Manager Signature */}
                        <div className="border-t border-gray-200 pt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Manager Signature <span className="text-red-500">*</span>
                          </label>
                          <SignatureCanvas
                            existingSignature={bullyingTrainingAdminData.managerSignature}
                            onSignatureEnd={(sig) => setBullyingTrainingAdminData({...bullyingTrainingAdminData, managerSignature: sig})}
                            onSignatureClear={() => setBullyingTrainingAdminData({...bullyingTrainingAdminData, managerSignature: ''})}
                            width={500}
                            height={150}
                            className="bg-white border-2 border-gray-300 rounded-lg"
                          />
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={bullyingTrainingAdminData.managerSignedAt}
                              onChange={(e) => setBullyingTrainingAdminData({...bullyingTrainingAdminData, managerSignedAt: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                          {editingAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdmin(false);
                                // Reset form to original data
                                if (assignment) {
                                  const submissionData = assignment.submissionData || {};
                                  const data = submissionData.data || submissionData;
                                  setBullyingTrainingAdminData({
                                    managerName: data.managerName || '',
                                    managerSignature: submissionData.adminSignature || data.managerSignature || '',
                                    managerSignedAt: submissionData.adminSignedAt || data.managerSignedAt
                                      ? new Date(submissionData.adminSignedAt || data.managerSignedAt).toISOString().split('T')[0]
                                      : new Date().toISOString().split('T')[0],
                                  });
                                }
                              }}
                              disabled={submittingAdmin}
                              className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={submittingAdmin}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                          >
                            {submittingAdmin ? (
                              <>
                                <FaSpinner className="h-4 w-4 animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : editingAdmin ? (
                              'Update Manager Acknowledgement'
                            ) : (
                              'Submit Manager Acknowledgement'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Show simple message if admin has signed and not editing */}
                {adminHasSigned && !editingAdmin && (
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-center justify-between">
                    <p className="text-sm text-green-800 font-semibold">
                      ✅ Manager section has been completed. This form is fully approved.
                    </p>
                        <button
                          onClick={() => setShowAdminEditWarning(true)}
                          disabled={clearingAdminSignature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                        >
                          {clearingAdminSignature ? (
                            <>
                          <FaSpinner className="h-4 w-4 animate-spin" />
                          Clearing...
                            </>
                          ) : (
                            <>
                          <FaEdit className="h-4 w-4" />
                              Edit
                            </>
                          )}
                        </button>
                      </div>
                )}
              </div>
            );
          })()
        ) : isSupportWorkerForm ? (
          /* Use PDF viewer for Support Worker (Position Description) form - shows generated PDF (matches download) */
          (() => {
            console.log('📄 [View Form] Rendering Support Worker (Position Description) PDF viewer');
            const pdfUrl = `/api/staff/${staffId}/forms/support-worker/pdf?key=${pdfKey}`;
            console.log('📄 [View Form] Support Worker PDF URL:', pdfUrl);
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
              </div>
            );
          })()
        ) : isPreEmploymentMedicalForm ? (
          /* Use PDF viewer for Pre-Employment Medical form - shows generated PDF (matches download) */
          (() => {
            console.log('📄 [View Form] Rendering Pre-Employment Medical PDF viewer');
            const pdfUrl = `/api/staff/${staffId}/forms/pre-employment-medical/pdf?key=${pdfKey}`;
            console.log('📄 [View Form] Pre-Employment Medical PDF URL:', pdfUrl);
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
              </div>
            );
          })()
        ) : isDocumentationAcknowledgementForm ? (
          /* Use PDF viewer for Documentation Acknowledgement form - shows generated PDF (matches download) */
          (() => {
            console.log('📄 [View Form] Rendering Documentation Acknowledgement PDF viewer');
            const pdfUrl = `/api/staff/${staffId}/forms/documentation-acknowledgement/pdf?key=${pdfKey}`;
            console.log('📄 [View Form] Documentation Acknowledgement PDF URL:', pdfUrl);
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
              </div>
            );
          })()
        ) : isConflictOfInterestForm ? (
          /* Use PDF viewer for Conflict of Interest form with admin section */
          (() => {
            console.log('📄 [View Form] Rendering Conflict of Interest PDF viewer with admin section');
            const pdfUrl = `/api/staff/${staffId}/forms/conflict-of-interest/pdf?key=${pdfKey}`;
            
            const staffHasSigned = !!(assignment?.submissionData?.employeeSignature || assignment?.submissionData?.staffSignature);
            const adminHasSigned = !!(assignment?.submissionData?.reviewerSignature || assignment?.submissionData?.adminSignature);
            const showAdminSection = staffHasSigned && (!adminHasSigned || editingAdmin);
            
            const handleConflictOfInterestAdminSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              
              // Validate required fields
              if (!conflictOfInterestAdminData.reviewedBy?.trim() || !conflictOfInterestAdminData.reviewerTitle?.trim() || !conflictOfInterestAdminData.reviewerSignature) {
                showToast({
                  type: 'error',
                  title: 'Validation Error',
                  message: 'Please fill all required fields: Reviewed By, Reviewer Title, and Reviewer Signature',
                  duration: 5000,
                });
                return;
              }
              
              try {
                setSubmittingAdmin(true);
                
                const response = await fetch(`/api/staff/${staffId}/forms/conflict-of-interest/admin`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(conflictOfInterestAdminData),
                });
                
                let result: any;
                try {
                  result = await response.json();
                } catch (parseError) {
                  console.error('❌ [Conflict of Interest Admin] Failed to parse response:', parseError);
                  throw new Error('Invalid response from server. Please try again.');
                }
                
                if (!response.ok) {
                  const errorMessage = result.message || result.error || `Failed to submit HR section (HTTP ${response.status})`;
                  showToast({
                    type: 'error',
                    title: 'Submission Failed',
                    message: errorMessage,
                    duration: 5000,
                  });
                  return;
                }
                
                showToast({
                  type: 'success',
                  title: 'Success',
                  message: result.message || 'HR section submitted successfully',
                  duration: 3000,
                });
                
                setPdfKey(prev => prev + 1);
                setEditingAdmin(false);
                await loadAssignmentData();
                
              } catch (error: unknown) {
                console.error('❌ [Conflict of Interest Admin] Error submitting:', error);
                let errorMessage = 'Failed to submit HR section.';
                if (error instanceof Error) {
                  errorMessage = error.message;
                }
                if (error instanceof TypeError && error.message.includes('fetch')) {
                  errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and try again.';
                }
                showToast({
                  type: 'error',
                  title: 'Submission Failed',
                  message: errorMessage,
                  duration: 5000,
                });
              } finally {
                setSubmittingAdmin(false);
              }
            };
            
            return (
              <div className="space-y-6">
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                  <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
                </div>
                
                {/* Admin Section - Show always, editable if not completed, read-only if completed */}
                {staffHasSigned && (
                  <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      {adminHasSigned && !editingAdmin ? (
                        /* Simple message with Edit button when admin has already signed */
                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-center justify-between">
                          <p className="text-sm text-green-800 font-semibold">
                            ✅ HR/Management section has been completed. This form is fully approved.
                          </p>
                          <button
                            onClick={handleClearAdminSignature}
                            disabled={clearingAdminSignature}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                          >
                            <FaEdit className="h-4 w-4" />
                            {clearingAdminSignature ? 'Clearing...' : 'Edit'}
                          </button>
                      </div>
                      ) : (
                        /* Editable form when admin hasn't signed */
                        <form onSubmit={handleConflictOfInterestAdminSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reviewed by: <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={conflictOfInterestAdminData.reviewedBy}
                                onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, reviewedBy: e.target.value})}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                              </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title: <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={conflictOfInterestAdminData.reviewerTitle}
                                onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, reviewerTitle: e.target.value})}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                          </div>

                            <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Date: <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={conflictOfInterestAdminData.reviewDate}
                              onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, reviewDate: e.target.value})}
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                            </div>

                            <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Action Taken (if applicable):
                            </label>
                            <textarea
                              value={conflictOfInterestAdminData.actionTaken}
                              onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, actionTaken: e.target.value})}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            />
                              </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              HR Decision: <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="hrDecision"
                                  value="noConflict"
                                  checked={conflictOfInterestAdminData.hrDecision === 'noConflict'}
                                  onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, hrDecision: e.target.value as any})}
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  required
                                />
                                <span className="text-sm">No conflict found</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="hrDecision"
                                  value="mitigation"
                                  checked={conflictOfInterestAdminData.hrDecision === 'mitigation'}
                                  onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, hrDecision: e.target.value as any})}
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  required
                                />
                                <span className="text-sm">Conflict identified and mitigation plan implemented</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="hrDecision"
                                  value="furtherReview"
                                  checked={conflictOfInterestAdminData.hrDecision === 'furtherReview'}
                                  onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, hrDecision: e.target.value as any})}
                                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  required
                                />
                                <span className="text-sm">Further review required</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Signature of Reviewer: <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-300 rounded-lg p-2">
                              <SignatureCanvas
                                existingSignature={conflictOfInterestAdminData.reviewerSignature}
                                onSignatureEnd={(signature) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, reviewerSignature: signature})}
                                onSignatureClear={() => setConflictOfInterestAdminData({...conflictOfInterestAdminData, reviewerSignature: ''})}
                                width={600}
                                height={100}
                                className="bg-white"
                                disabled={false}
                              />
                        </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Date: <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={conflictOfInterestAdminData.reviewerDate}
                              onChange={(e) => setConflictOfInterestAdminData({...conflictOfInterestAdminData, reviewerDate: e.target.value})}
                              className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                            <button
                              type="submit"
                              disabled={submittingAdmin}
                              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 w-full sm:w-auto"
                            >
                              {submittingAdmin ? 'Saving...' : 'Submit HR Section & Complete Form'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        ) : isNdisForm ? (
          /* Use overlay component for NDIS form - shows PDF first page with data overlay */
          <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-2 md:p-6">
              <NdisWorkforceCapabilityAcknowledgementOverlay
                data={overlayData || {}}
                onDataChange={() => {}}
                readOnly={true}
              />
            </div>
          </div>
        ) : (
          /* Use regular form component for other forms */
          (() => {
            console.log('📋 [View Form] Rendering form component:', FormViewComponent?.name, {
              hasSubmissionData: !!assignment.submissionData,
              submissionDataKeys: assignment.submissionData ? Object.keys(assignment.submissionData) : [],
            });
            return (
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <FormViewComponent
                  data={assignment.submissionData}
                  staff={assignment.staff}
                  isAdminView={true}
                  commonFields={commonFields}
                  settings={settings}
                  staffId={staffId}
                />
              </div>
            );
          })()
        )}
      </div>

      {/* Admin Edit Warning Modal - Show for all forms that require admin signatures */}
      {assignment && (
        (() => {
          const formKey = assignment.form.formKey;
          const requiresAdminSignature = formKey === 'employee_details' || 
                                         formKey === 'employment_details' ||
                                         formKey === 'conflict_of_interest' ||
                                         formKey === 'bullying_training';
          
          return requiresAdminSignature ? (
            <AdminEditWarningModal
              isOpen={showAdminEditWarning}
              onClose={() => setShowAdminEditWarning(false)}
              onConfirm={handleClearAdminSignature}
              formTitle={assignment.form.title}
              isLoading={clearingAdminSignature}
            />
          ) : null;
        })()
      )}
    </div>
  );
}
