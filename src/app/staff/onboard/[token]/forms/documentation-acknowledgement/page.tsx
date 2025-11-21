"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function DocumentationAcknowledgementFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
        let formSubmission: any = {};
        if (isSignatureLink) {
          // Signature API returns { staff, formSubmission, submissions: { formKey: formData } }
          if (staffData.submissions?.['documentation_acknowledgement']) {
            formSubmission = staffData.submissions['documentation_acknowledgement'];
          } else if (staffData.formSubmission?.data) {
            formSubmission = staffData.formSubmission.data;
          }
        } else {
          formSubmission = staffData.submissions?.['documentation_acknowledgement'] || {};
        }
        
        // Pre-fill staff name from database if not already in form data
        const staffName = staffData.staff 
          ? `${staffData.staff.firstName || ''} ${staffData.staff.surname || ''}`.trim()
          : '';
        
        const defaultData = {
          staffName: staffName,
          signature: '',
          date: new Date().toISOString().split('T')[0],
        };
        
        const mergedData: any = {
          ...defaultData,
          ...formSubmission,
          // Ensure staffName is always set from database if not in saved data
          staffName: (formSubmission as any).staffName || staffName,
        };
        
        setInitialFormData(mergedData);
        setFormData(mergedData);
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

  // Validation function
  const validateForm = useCallback((data: any): { isValid: boolean; missing: string[] } => {
    const missing: string[] = [];

    if (!data.staffName?.trim()) missing.push('Staff Name');
    if (!data.signature || typeof data.signature !== 'string' || !data.signature.startsWith('data:image/')) {
      missing.push('Signature');
    }
    if (!data.date) {
      missing.push('Date');
    }

    return {
      isValid: missing.length === 0,
      missing,
    };
  }, []);

  // Memoize the onDataChange callback to prevent infinite loops
  const handleDataChange = useCallback((data: any) => {
    setFormData(data);
  }, []);

  // Validate form data whenever it changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      const validation = validateForm(formData);
      setValidationErrors(validation.missing);
    } else {
      const validation = validateForm({});
      setValidationErrors(validation.missing);
    }
  }, [formData, validateForm]);

  const handleSave = async (isSubmit: boolean) => {
    // Validate required fields before submission
    if (isSubmit) {
      const validation = validateForm(formData);
      if (!validation.isValid) {
        showToast({
          type: 'warning',
          title: 'Missing Required Fields',
          message: `Please complete the following fields: ${validation.missing.join(', ')}`,
          duration: 5000,
        });
        return;
      }
    }

    setSaving(true);
    try {
      // Detect if this is a signature link or onboard link
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/documentation_acknowledgement`
        : `/api/staff/onboard/${token}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'documentation_acknowledgement',
          data: formData,
          submit: isSubmit,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (isSubmit) {
          showToast({
            type: 'success',
            title: 'Form Submitted',
            message: 'Documentation Acknowledgement form has been submitted successfully.',
            duration: 4000,
          });

          // Navigate to next form or dashboard
          const isSignatureLink = window.location.pathname.includes('/staff/signature/');
          setTimeout(() => {
            router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
          }, 1500);
        } else {
          showToast({
            type: 'success',
            title: 'Draft Saved',
            message: 'Your progress has been saved.',
            duration: 3000,
          });
        }
      } else {
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: result.message || result.error || 'Failed to save form. Please try again.',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Error saving form:', error);
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Documentation Acknowledgement Form" message="Please wait..." />;
  }

  const DocumentationAcknowledgementEdit = getStaffFormComponent('documentation_acknowledgement', 'edit');

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Documentation Acknowledgement</h1>
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

        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <DocumentationAcknowledgementEdit
              initialData={initialFormData}
              onDataChange={handleDataChange}
              showButtons={false}
            />
          </div>

          {/* Validation Errors Summary */}
          {validationErrors.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                ⚠️ Missing Required Fields:
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

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
              disabled={saving || validationErrors.length > 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

