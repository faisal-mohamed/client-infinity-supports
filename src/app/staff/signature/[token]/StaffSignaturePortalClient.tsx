"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaFileAlt, FaSignature, FaCheck, FaClock, FaUser, FaCalendarAlt, 
  FaEye, FaDownload, FaCheckCircle, FaExclamationCircle, FaInfoCircle,
  FaSpinner, FaShieldAlt, FaHistory, FaExternalLinkAlt, FaEdit
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';

// Types
interface SignatureForm {
  id: number;
  formSubmissionId: number;
  formSubmission: {
    id: number;
    staffSignature?: string;
    staffSignedAt?: string;
    data: any;
    form: {
      id: number;
      title: string;
      formKey: string;
      requiresSignature?: boolean;
    };
  };
}

interface CompletionStatus {
  totalForms: number;
  formsRequiringSignature: number;
  formsNotRequiringSignature: number;
  signedForms: number;
  isComplete: boolean;
}

interface SignatureBatchData {
  id: number;
  batchToken: string;
  expiresAt: string;
  isCompleted: boolean;
  completedAt?: string;
  staff: {
    id: number;
    firstName: string;
    surname: string;
    email: string;
    name: string;
  };
  signatureForms: SignatureForm[];
  formsRequiringSignature: SignatureForm[];
  formsNotRequiringSignature: SignatureForm[];
  completionStatus: CompletionStatus;
}

// Helper function to map formKey to route path
const getFormRoute = (formKey: string): string => {
  const routeMap: Record<string, string> = {
    'employee_details': 'employment-details',
    'employee_welcome': 'employment-welcome',
    'support_worker': 'support-worker',
    'pre_employment_medical': 'pre-employment-medical',
    'ndis_workforce_capability': 'ndis-workforce-capability',
    'bullying_harassment_training': 'bullying-harassment-training',
    'bullying_training': 'bullying-training',
    'ndis_code_of_conduct': 'ndis-code-of-conduct',
    'fair_work_information': 'fair-work-information',
    'orientation': 'orientation',
    'govt_tax': 'govt-tax',
    'super_choice_form': 'super-choice-form',
    'vehicle_safety_inspection': 'vehicle-safety-inspection',
    'conflict_of_interest': 'conflict-of-interest',
    'documentation_acknowledgement': 'documentation-acknowledgement',
  };
  
  return routeMap[formKey] || formKey.replace(/_/g, '-');
};

export default function StaffSignaturePortalClient() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { showToast } = useToast();
  
  const [batchData, setBatchData] = useState<SignatureBatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingForm, setDownloadingForm] = useState<number | null>(null);
  const [navigatingFormId, setNavigatingFormId] = useState<number | null>(null);
  const [editingFormId, setEditingFormId] = useState<number | null>(null);
  const [showEditWarning, setShowEditWarning] = useState<{ form: SignatureForm; formUrl: string } | null>(null);

  useEffect(() => {
    loadSignatureBatch();
  }, [token]);

  // Reset navigating state when component unmounts (navigation started)
  useEffect(() => {
    return () => {
      setNavigatingFormId(null);
    };
  }, []);

  const loadSignatureBatch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/staff/signature/${token}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Signature link not found or expired');
        } else if (response.status === 410) {
          throw new Error('This signature link has expired');
        }
        throw new Error('Failed to load signature forms');
      }
      
      const data = await response.json();
      setBatchData(data);
      
    } catch (error: any) {
      console.error('Error loading signature batch:', error);
      setError(error.message || 'Failed to load signature forms');
    } finally {
      setLoading(false);
    }
  };

  const getFormStatus = (form: SignatureForm) => {
    const requiresSignature = form.formSubmission.form.requiresSignature;
    
    // All forms in signature link are fillable, even if they don't require signature
    if (!requiresSignature) {
      return {
        status: 'Fill Form',
        color: 'text-blue-600 bg-blue-100',
        icon: FaEdit,
        date: null,
      };
    }
    
    if (form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null) {
      return {
        status: 'Signed',
        color: 'text-green-600 bg-green-100',
        icon: FaCheck,
        date: form.formSubmission.staffSignedAt,
      };
    } else {
      return {
        status: 'Signature Required',
        color: 'text-amber-600 bg-amber-100',
        icon: FaClock,
        date: null,
      };
    }
  };

  const handleEditForm = (form: SignatureForm, formUrl: string) => {
    // Check if form has signature
    const hasSignature = form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null;
    
    if (hasSignature) {
      // Show warning modal
      setShowEditWarning({ form, formUrl });
    } else {
      // No signature, proceed directly
      setEditingFormId(form.id);
      router.push(formUrl);
    }
  };

  const handleConfirmEdit = async () => {
    if (!showEditWarning) return;
    
    const { form, formUrl } = showEditWarning;
    setEditingFormId(form.id);
    
    try {
      // Prepare form data without signature fields (universal approach)
      const formKey = form.formSubmission.form.formKey;
      console.log('🔵 [Edit] Starting signature clear for form:', formKey);
      console.log('🔵 [Edit] Current form submission:', {
        id: form.formSubmission.id,
        staffSignature: form.formSubmission.staffSignature ? 'EXISTS' : 'NULL',
        staffSignedAt: form.formSubmission.staffSignedAt,
        data: form.formSubmission.data
      });
      
      const formDataWithoutSignature = { ...form.formSubmission.data };
      
      // Clear ALL possible signature field names (works for all forms including overlays)
      const signatureFieldsToClear = [
        'signature', 'staffSignature', 'orientationSignature', 'employeeSignature',
        'date', 'acknowledgedAt', 'staffSignedAt', 'signatureDate', 'employeeDate', 
        'employeeSignatureDate', 'staffSignatureDate',
        // Tax form signatures
        'payeeSignature', 'payerSignature', 'payeeSignatureAt', 'payerSignatureAt',
        // Super Choice form signatures
        'sectionBSignature', 'sectionCSignature', 'sectionDSignature', 
        'sectionBDate', 'sectionCDate', 'sectionDDate'
      ];
      
      console.log('🔵 [Edit] Clearing signature fields from formData:', signatureFieldsToClear);
      signatureFieldsToClear.forEach(field => {
        if (field in formDataWithoutSignature) {
          console.log(`  🗑️ Removing field: ${field}`);
          delete formDataWithoutSignature[field];
        }
      });
      console.log('🔵 [Edit] FormData after clearing:', formDataWithoutSignature);
      
      // Clear signature via API
      const requestBody = { 
        formKey: formKey, 
        data: formDataWithoutSignature,
        clearSignature: true // Flag to clear signature
      };
      console.log('🔵 [Edit] Sending API request:', {
        url: `/api/staff/signature/${token}/forms/${formKey}`,
        body: requestBody
      });
      
      const response = await fetch(`/api/staff/signature/${token}/forms/${formKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('🔵 [Edit] API Response:', {
        ok: response.ok,
        status: response.status,
        data: responseData
      });

      if (response.ok) {
        // CRITICAL: Verify the signature was actually cleared in the response
        console.log('✅ [Edit] API call successful, checking response data:', responseData);
        
        // Check if the submission in the response has the signature cleared
        const submission = responseData.submission;
        const signatureWasCleared = submission && 
          (submission.staffSignature === null || submission.staffSignature === undefined || submission.staffSignature === '');
        
        console.log('🔍 [Edit] Verifying signature was cleared:', {
          hasSubmission: !!submission,
          staffSignature: submission?.staffSignature ? 'EXISTS - ERROR!' : 'NULL - SUCCESS',
          signatureWasCleared: signatureWasCleared
        });
        
        if (!signatureWasCleared) {
          // Signature was NOT cleared - show error
          console.error('❌ [Edit] Signature was NOT cleared by backend!', {
            staffSignature: submission?.staffSignature,
            submission: submission
          });
          showToast({
            type: 'error',
            title: 'Error',
            message: 'Failed to clear signature. The signature still exists. Please try again.',
            duration: 5000,
          });
          setEditingFormId(null);
          return;
        }
        
        // Signature was successfully cleared - proceed
        console.log('✅ [Edit] Backend confirmed signature cleared, proceeding to form');
        showToast({
          type: 'info',
          title: 'Signature Cleared',
          message: 'Your signature has been cleared. Please sign again after editing.',
          duration: 4000,
        });
        
        // Reload batch data to reflect cleared signature
        await loadSignatureBatch();
        
        // Navigate to form with a timestamp to force reload
        router.push(`${formUrl}?reload=${Date.now()}`);
        // Force a hard refresh to ensure form reloads with cleared signature
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        const errorMsg = responseData.error || responseData.message || 'Failed to clear signature';
        console.error('❌ [Edit] API call failed:', {
          status: response.status,
          error: errorMsg,
          responseData
        });
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('❌ [Edit] Error clearing signature:', error);
      setEditingFormId(null);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to clear signature. Please try again.',
        duration: 5000,
      });
    } finally {
      setShowEditWarning(null);
    }
  };

  const handleDownloadForm = async (formSubmissionId: number, formId: number, formTitle: string) => {
    try {
      setDownloadingForm(formSubmissionId);
      
      showToast({
        type: 'info',
        title: 'Generating PDF',
        message: 'Please wait while we prepare your document...',
        duration: 3000,
      });

      const response = await fetch(`/api/generate-pdf/${formSubmissionId}/${formId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${formTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showToast({
          type: 'success',
          title: 'Download Complete',
          message: `${formTitle} has been downloaded successfully.`,
          duration: 3000,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading form:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download form. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloadingForm(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Loading Forms</h3>
          <p className="text-sm sm:text-base text-gray-600 font-medium">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaExclamationCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Access Error</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!batchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">No signature forms found.</p>
        </div>
      </div>
    );
  }

  const { completionStatus } = batchData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 px-4 sm:px-8 py-4 sm:py-6">
            <div className="text-center text-white">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                  <FaSignature className="h-6 w-6 sm:h-10 sm:w-10" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 px-2">
                Staff Forms Portal
              </h1>
              <p className="text-indigo-100 text-sm sm:text-lg px-2">
                Complete and sign your assigned forms
              </p>
            </div>
          </div>

          {/* Staff Info Section */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-gray-700">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{batchData.staff.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{batchData.staff.email}</p>
                </div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <FaCalendarAlt className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Expires</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(batchData.expiresAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-blue-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{completionStatus.totalForms}</div>
                <div className="text-xs sm:text-sm font-medium text-blue-700">Total Forms</div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-amber-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaSignature className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">{completionStatus.formsRequiringSignature}</div>
                <div className="text-xs sm:text-sm font-medium text-amber-700">Require Signature</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-green-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{completionStatus.signedForms}</div>
                <div className="text-xs sm:text-sm font-medium text-green-700">Completed</div>
              </div>
            </div>

            {/* Progress Bar for Signature Forms Only */}
            {completionStatus.formsRequiringSignature > 0 && (
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-1 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Signature Progress</h3>
                  <span className="text-xs sm:text-sm font-medium text-gray-600">
                    {completionStatus.signedForms} of {completionStatus.formsRequiringSignature} forms signed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div 
                    className={`h-2 sm:h-3 rounded-full transition-all duration-500 ease-out ${
                      completionStatus.isComplete 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ 
                      width: `${completionStatus.formsRequiringSignature > 0 ? 
                        (completionStatus.signedForms / completionStatus.formsRequiringSignature) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {Math.round(completionStatus.formsRequiringSignature > 0 ? 
                    (completionStatus.signedForms / completionStatus.formsRequiringSignature) * 100 : 0)}% Complete
                </div>
              </div>
            )}
          </div>

          {/* Completion Status */}
          {completionStatus.isComplete && (
            <div className="mx-4 sm:mx-8 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mr-0 sm:mr-4 mx-auto sm:mx-0">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-1">
                      🎉 All Required Forms Completed!
                    </h3>
                    <p className="text-sm sm:text-base text-green-700">
                      Thank you for completing all the required forms. The admin has been notified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Forms to Complete
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Please complete each form below. Some forms require your digital signature.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {batchData.signatureForms.map((form) => {
              const statusInfo = getFormStatus(form);
              const StatusIcon = statusInfo.icon;
              const requiresSignature = form.formSubmission.form.requiresSignature;
              const isDownloading = downloadingForm === form.formSubmissionId;
              // Link to staff signature form fill page (not admin edit page)
              // Link to editable form route using formKey (not submission ID)
              const formKey = form.formSubmission.form.formKey;
              const formUrl = `/staff/signature/${token}/forms/${formKey.replace(/_/g, '-')}`;
              
              return (
                <div key={form.id} className="bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start sm:items-center flex-1 w-full sm:w-auto">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <FaFileAlt className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                          </div>
                        </div>
                        
                        <div className="ml-4 sm:ml-6 flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 pr-2">
                            {form.formSubmission.form.title}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${statusInfo.color} shadow-sm w-fit`}>
                              <StatusIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              {statusInfo.status}
                            </span>
                            {statusInfo.date && (
                              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                <FaHistory className="mr-1 h-3 w-3" />
                                <span>Signed on {new Date(statusInfo.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-full sm:w-auto sm:ml-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {/* Download Button - REMOVED: Staff don't need to download forms */}

                        {/* Edit Button - Only show for signed forms */}
                        {requiresSignature && form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null && (
                          <button
                            onClick={() => handleEditForm(form, formUrl)}
                            disabled={editingFormId === form.id || navigatingFormId === form.id}
                            className={`inline-flex items-center justify-center px-4 py-2.5 border-2 text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                              editingFormId === form.id
                                ? 'border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            title="Edit Form"
                          >
                            {editingFormId === form.id ? (
                              <>
                                <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                                <span className="hidden sm:inline">Clearing...</span>
                                <span className="sm:hidden">...</span>
                              </>
                            ) : (
                              <>
                                <FaEdit className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Edit</span>
                                <span className="sm:hidden">Edit</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Fill/Sign Button - Links to existing admin staff form page */}
                        <button
                          onClick={() => {
                            if (requiresSignature && form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null) {
                              // If signed, show view mode (read-only)
                              setNavigatingFormId(form.id);
                              router.push(formUrl);
                            } else {
                              // Not signed, allow editing
                              setNavigatingFormId(form.id);
                              router.push(formUrl);
                            }
                          }}
                          disabled={navigatingFormId === form.id || editingFormId === form.id}
                          className={`inline-flex items-center justify-center px-4 sm:px-6 py-2.5 border-2 border-transparent text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            navigatingFormId === form.id
                              ? requiresSignature && form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null
                                ? 'text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
                                : 'text-white bg-gradient-to-r from-indigo-400 to-purple-500 border-indigo-300'
                              : requiresSignature
                              ? form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null
                                ? 'text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 focus:ring-green-500'
                                : 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500'
                              : 'text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 focus:ring-blue-500'
                          }`}
                        >
                          {navigatingFormId === form.id ? (
                            <>
                              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                              <span className="hidden sm:inline">Loading...</span>
                              <span className="sm:hidden">Loading...</span>
                            </>
                          ) : requiresSignature ? (
                            form.formSubmission.staffSignature && form.formSubmission.staffSignature !== null ? (
                              <>
                                <FaCheckCircle className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">View Signed</span>
                                <span className="sm:hidden">Signed</span>
                              </>
                            ) : (
                              <>
                                <FaSignature className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Fill & Sign</span>
                                <span className="sm:hidden">Fill</span>
                              </>
                            )
                          ) : (
                            <>
                              <FaEdit className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">Fill Form</span>
                              <span className="sm:hidden">Fill</span>
                            </>
                          )}
                          {navigatingFormId !== form.id && editingFormId !== form.id && (
                            <FaExternalLinkAlt className="ml-2 h-3 w-3 opacity-70" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <FaShieldAlt className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
              If you have any queries about these forms, please contact your administrator.
            </p>
          </div>
        </div>

        {/* Edit Warning Modal */}
        {showEditWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <FaExclamationCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Edit Signed Form</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  You are about to edit a form that has already been signed. Editing this form will:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Clear your existing signature</li>
                  <li>Require you to sign the form again after making changes</li>
                  <li>Reset the form status to "In Progress"</li>
                </ul>
                <p className="text-sm font-semibold text-gray-800">
                  Form: <span className="font-normal">{showEditWarning.form.formSubmission.form.title}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowEditWarning(null)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEdit}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

