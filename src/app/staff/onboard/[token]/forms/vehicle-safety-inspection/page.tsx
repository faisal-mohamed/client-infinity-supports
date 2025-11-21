"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function VehicleSafetyInspectionFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Detect if this is a signature link or onboard link
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        const apiEndpoint = isSignatureLink 
          ? `/api/staff/signature/${token}` 
          : `/api/staff/onboard/${token}`;
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          showToast({
            type: 'error',
            title: 'Failed to Load Form',
            message: errorData.message || 'Unable to load form data. Please refresh the page and try again.',
            duration: 5000,
          });
          return;
        }

        const staffData = await response.json();
        setStaff(staffData.staff || staffData);
        
        // Load saved form data - handle both signature and onboard structures
        let formSubmission = {};
        if (isSignatureLink) {
          const vehicleForm = staffData.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'vehicle_safety_inspection'
          );
          if (vehicleForm) {
            formSubmission = vehicleForm.formSubmission?.data || {};
          }
        } else {
          formSubmission = staffData.submissions?.['vehicle_safety_inspection'] || {};
        }
        
        setInitialFormData(formSubmission);
        setFormData(formSubmission);
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadData();
    }
  }, [token, showToast]);

  // Memoize the onDataChange callback to prevent infinite loops
  const handleDataChange = useCallback((data: any) => {
    setFormData(data);
  }, []);

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData]);

  const handleSave = async (isSubmit: boolean) => {
    setSaving(true);
    try {
      // Detect if this is a signature link or onboard link
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/vehicle_safety_inspection`
        : `/api/staff/onboard/${token}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'vehicle_safety_inspection',
          data: formData,
          submit: isSubmit,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const action = isSubmit ? 'submitted' : 'saved';
        showToast({
          type: 'success',
          title: `Form ${action === 'submitted' ? 'Submitted' : 'Saved'}`,
          message: `Your Vehicle Safety Inspection Checklist has been ${action} successfully.`,
          duration: 4000,
        });
      
      if (isSubmit) {
          // Small delay to show success message before navigation
          const isSignatureLink = window.location.pathname.includes('/staff/signature/');
          setTimeout(() => {
        router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
          }, 1000);
        }
      } else {
        // Handle different error types with appropriate messages
        const errorMessage = result.message || result.error || 'Failed to save form';
        let title = 'Save Failed';
        
        // Customize error messages based on error code
        if (result.code === 'DUPLICATE_ENTRY') {
          title = 'Already Submitted';
        } else if (result.code === 'LINK_EXPIRED') {
          title = 'Access Link Expired';
        } else if (result.code === 'DATABASE_CONNECTION_ERROR') {
          title = 'Connection Error';
        } else if (result.code === 'DATA_TOO_LONG') {
          title = 'Validation Error';
        }

        showToast({
          type: 'error',
          title,
          message: errorMessage,
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error saving form:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showToast({
          type: 'error',
          title: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection and try again.',
          duration: 5000,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Unexpected Error',
          message: 'An unexpected error occurred while saving. Please try again.',
          duration: 5000,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!staff?.id) {
      showToast({
        type: 'warning',
        title: 'No Staff Data',
        message: 'Please wait for staff data to load before downloading.',
        duration: 3000,
      });
      return;
    }

    setDownloading(true);
    try {
      const pdfUrl = `/api/staff/${staff.id}/forms/vehicle-safety-inspection/pdf`;
      
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vehicle_Safety_Inspection_${staff.firstName}_${staff.surname}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Your Vehicle Safety Inspection Checklist has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Download error:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: error.message || 'Failed to download PDF. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Vehicle Safety Inspection Form" message="Please wait..." />;
  }

  const VehicleSafetyInspectionEdit = getStaffFormComponent('vehicle_safety_inspection', 'edit');

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <style jsx>{`
        .view-component-wrapper {
          min-height: 600px;
        }
        @media (max-width: 768px) {
        .view-component-wrapper { 
            min-height: 400px;
          }
        }
      `}</style>
      
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Vehicle Safety Inspection Checklist</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 self-start sm:self-auto"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* Download PDF Section */}
        {staff?.id && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-gray-700 font-medium">Download your completed form as a PDF</p>
                <p className="text-sm text-gray-500 mt-1">View and share your Vehicle Safety Inspection Checklist</p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Edit Component */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <VehicleSafetyInspectionEdit
              initialData={initialFormData}
              onDataChange={handleDataChange}
              showButtons={false}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
