"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// Temporarily using placeholder icons to fix build issues
const FaArrowLeft = ({ className }: { className?: string }) => <span className={className}>←</span>;
const FaEdit = ({ className }: { className?: string }) => <span className={className}>✏️</span>;
const FaSignature = ({ className }: { className?: string }) => <span className={className}>✍️</span>;
const FaDownload = ({ className }: { className?: string }) => <span className={className}>⬇️</span>;
const FaUser = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const FaCalendarAlt = ({ className }: { className?: string }) => <span className={className}>📅</span>;
const FaSpinner = ({ className }: { className?: string }) => <span className={className}>⏳</span>;
import { useToast } from '@/components/ui/Toast';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { fetchFormSpecificSettings } from '@/lib/settings';
import NdisWorkforceCapabilityAcknowledgementOverlay from '@/app/form-components/staff/ndis-workforce-capability/AcknowledgementOverlay';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';
import SignatureCanvas from '@/components/ui/SignatureCanvas';

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
  const [submittingAdmin, setSubmittingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(false); // Track if admin is editing
  const [pdfKey, setPdfKey] = useState(0); // Force PDF refresh after admin submit

  // Load assignment and submission data
  useEffect(() => {
    loadAssignmentData();
  }, [assignmentId]);

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
      const formKey = assignment?.form?.formKey;
      const staffId = assignment?.staffId;

      if (!formKey || !staffId) {
        console.error('❌ [View Form] Missing required data:', { formKey, staffId, assignment });
        throw new Error('Missing formKey or staffId in assignment');
      }

      console.log('🔍 [View Form] Form details:', {
        formKey,
        formTitle: assignment.form.title,
        staffId,
        formVersion: assignment.formVersion,
      });

      // Convert formKey from snake_case to kebab-case for API endpoint
      // Special handling for form keys that have different API endpoint names
      let formType = formKey.replace(/_/g, '-');
      
      // Handle special cases where API endpoint name differs from form key
      if (formKey === 'employee_details' || formKey === 'employment_details') {
        formType = 'employment-details'; // API uses 'employment-details', not 'employee-details'
      } else if (formKey === 'employee_welcome' || formKey === 'employment_welcome') {
        formType = 'employment-welcome'; // API uses 'employment-welcome'
      }
      
      console.log('🔄 [View Form] Converted formType:', formType, '(from formKey:', formKey + ')');

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
          if (formKey === 'orientation' && !processedFormData.orientationSignature) {
            processedFormData.orientationSignature = assignment.staffSignature;
          }
          if (formKey === 'fair_work_information' && !processedFormData.fairWorkSignature) {
            processedFormData.fairWorkSignature = assignment.staffSignature;
          }
          if (formKey === 'govt_tax' && !processedFormData.payeeSignature) {
            processedFormData.payeeSignature = assignment.staffSignature;
          }
          // NDIS form uses signature field directly
          if (formKey === 'ndis_workforce_capability' && !processedFormData.signature) {
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

        if (formKey === 'govt_tax' && assignment.staffSignedAt && !processedFormData.payeeSignatureAt) {
          processedFormData.payeeSignatureAt = new Date(assignment.staffSignedAt).toISOString().split('T')[0];
        }
        
        // NDIS form - ensure fullName is set
        if (formKey === 'ndis_workforce_capability' && !processedFormData.fullName) {
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
      if (updatedAssignment.submissionData) {
        setAdminFormData({
          employmentStatus: updatedAssignment.submissionData?.data?.employmentStatus || '',
          payRate: updatedAssignment.submissionData?.data?.payRate || '',
          schadsLevel: updatedAssignment.submissionData?.data?.schadsLevel || updatedAssignment.submissionData?.data?.schadsScore || '',
          adminSignature: updatedAssignment.submissionData?.adminSignature || '',
          adminSignedAt: updatedAssignment.submissionData?.adminSignedAt 
            ? new Date(updatedAssignment.submissionData.adminSignedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
        });
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
      
      // Check if form has a specific PDF route with merge=true (like ndis-workforce-capability, bullying-harassment-training)
      // These forms have dedicated PDF routes that merge the framework PDF with the signed acknowledgement
      if (formKey === 'ndis_workforce_capability' || formKey === 'bullying_harassment_training') {
        // Try the specific PDF route with merge=true
        response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf?merge=true`);
        
        // If that fails, try without merge
        if (!response.ok) {
          response = await fetch(`/api/staff/${staffId}/forms/${pdfFormType}/pdf`);
        }
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const staffName = `${assignment.staff.firstName || ''}_${assignment.staff.surname || ''}`.replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `${assignment.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_${staffName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'Success',
        message: 'PDF downloaded successfully',
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
  
  console.log('🎨 [View Form] Rendering decision:', {
    formKey: assignment.form.formKey,
    isEmployeeDetailsForm,
    isEmployeeWelcomeForm,
    isNdisForm,
    willUsePDFViewer: isEmployeeDetailsForm || isEmployeeWelcomeForm,
    willUseFormComponent: !isEmployeeDetailsForm && !isEmployeeWelcomeForm && !isNdisForm,
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
              href={`/admin/staff/${staffId}`}
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
                
                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.message || 'Failed to submit admin section');
                }
                
                const result = await response.json();
                
                showToast({
                  type: 'success',
                  title: 'Success',
                  message: result.message || 'Admin section submitted successfully',
                  duration: 3000,
                });
                
                // Reload assignment data to refresh PDF
                setPdfKey(prev => prev + 1); // Force PDF refresh
                setEditingAdmin(false); // Exit edit mode after successful submit
                await loadAssignmentData();
                
              } catch (error: any) {
                console.error('Error submitting admin section:', error);
                showToast({
                  type: 'error',
                  title: 'Error',
                  message: error.message || 'Failed to submit admin section',
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
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {submittingAdmin ? 'Submitting...' : editingAdmin ? 'Update Admin Section' : 'Submit Admin Section'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Show read-only admin info if admin has signed and not editing */}
                {adminHasSigned && !editingAdmin && (
                  <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Admin Section - Office Use Only</h3>
                        <button
                          onClick={() => {
                            setEditingAdmin(true);
                            // Populate form with current data
                            setAdminFormData({
                              employmentStatus: assignment?.submissionData?.data?.employmentStatus || '',
                              payRate: assignment?.submissionData?.data?.payRate || '',
                              schadsLevel: assignment?.submissionData?.data?.schadsLevel || assignment?.submissionData?.data?.schadsScore || '',
                              adminSignature: assignment?.submissionData?.adminSignature || assignment?.adminSignature || '',
                              adminSignedAt: (assignment?.submissionData?.adminSignedAt || assignment?.adminSignedAt)
                                ? new Date(assignment?.submissionData?.adminSignedAt || assignment?.adminSignedAt || '').toISOString().split('T')[0]
                                : new Date().toISOString().split('T')[0],
                            });
                          }}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <FaEdit className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                          <div className="text-sm text-gray-900">
                            {assignment?.submissionData?.data?.employmentStatus || 'N/A'}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pay Rate</label>
                            <div className="text-sm text-gray-900">
                              {assignment?.submissionData?.data?.payRate || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SCHADS Level</label>
                            <div className="text-sm text-gray-900">
                              {assignment?.submissionData?.data?.schadsLevel || assignment?.submissionData?.data?.schadsScore || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      {(assignment?.submissionData?.adminSignature || assignment?.adminSignature) && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Signature</label>
                              {(assignment?.submissionData?.adminSignature || assignment?.adminSignature) && (
                                <img src={assignment?.submissionData?.adminSignature || assignment?.adminSignature || ''} alt="Admin Signature" className="max-w-xs h-20 border border-gray-300 rounded" />
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                              <div className="text-sm text-gray-900">
                                {(assignment?.submissionData?.adminSignedAt || assignment?.adminSignedAt) 
                                  ? new Date(assignment?.submissionData?.adminSignedAt || assignment?.adminSignedAt || '').toLocaleDateString('en-AU') 
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
    </div>
  );
}
