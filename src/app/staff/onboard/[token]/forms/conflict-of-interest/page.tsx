"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function ConflictOfInterestFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
          const conflictForm = staffData.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'conflict_of_interest'
          );
          if (conflictForm) {
            // Preserve admin-filled data from submission
            const submissionData = conflictForm.formSubmission?.data || {};
            // Also check for admin data in the submission itself (for backward compatibility)
            formSubmission = {
              ...submissionData,
              // Preserve admin fields even if they're in the submission object
              reviewedBy: submissionData.reviewedBy || conflictForm.formSubmission?.data?.reviewedBy || '',
              reviewerTitle: submissionData.reviewerTitle || conflictForm.formSubmission?.data?.reviewerTitle || '',
              reviewDate: submissionData.reviewDate || conflictForm.formSubmission?.data?.reviewDate || '',
              actionTaken: submissionData.actionTaken || conflictForm.formSubmission?.data?.actionTaken || '',
              hrDecision: submissionData.hrDecision || conflictForm.formSubmission?.data?.hrDecision || '',
              reviewerSignature: submissionData.reviewerSignature || conflictForm.formSubmission?.data?.reviewerSignature || '',
              reviewerDate: submissionData.reviewerDate || conflictForm.formSubmission?.data?.reviewerDate || '',
            };
          }
        } else {
          formSubmission = staffData.submissions?.['conflict_of_interest'] || {};
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

  // Validation function - defined first (only validates staff-required fields, not admin fields)
  const validateForm = useCallback((data: any): { isValid: boolean; missing: string[] } => {
    const missing: string[] = [];

    // Employee Information - Always required for staff
    if (!data.name?.trim()) missing.push('Name');
    if (!data.position?.trim()) missing.push('Position');
    if (!data.department?.trim()) missing.push('Department');
    if (!data.date) missing.push('Date');

    // Section 1: Conflict of Interest
    if (!data.hasConflict || (data.hasConflict !== 'yes' && data.hasConflict !== 'no')) {
      missing.push('Section 1: Conflict of Interest response');
    }
    if (data.hasConflict === 'yes' && !data.conflictDescription?.trim()) {
      missing.push('Section 1: Conflict Description');
    }

    // Section 2: Vendor Relationships
    if (!data.hasVendorRelationship || (data.hasVendorRelationship !== 'yes' && data.hasVendorRelationship !== 'no')) {
      missing.push('Section 2: Vendor Relationship response');
    }
    if (data.hasVendorRelationship === 'yes' && !data.vendorDetails?.trim()) {
      missing.push('Section 2: Vendor Relationship Details');
    }

    // Section 3: Outside Employment
    if (!data.hasOutsideEmployment || (data.hasOutsideEmployment !== 'yes' && data.hasOutsideEmployment !== 'no')) {
      missing.push('Section 3: Outside Employment response');
    }
    if (data.hasOutsideEmployment === 'yes' && !data.employmentDetails?.trim()) {
      missing.push('Section 3: Outside Employment Details');
    }

    // Section 4: Signature and Date (staff only, not admin fields)
    if (!data.employeeSignature || typeof data.employeeSignature !== 'string' || !data.employeeSignature.startsWith('data:image/')) {
      missing.push('Employee Signature');
    }
    if (!data.employeeDate) {
      missing.push('Employee Signature Date');
    }

    // Note: Admin/HR fields (reviewedBy, reviewerTitle, reviewDate, hrDecision, reviewerSignature, reviewerDate) 
    // are NOT validated here because staff users don't fill those fields

    return {
      isValid: missing.length === 0,
      missing,
    };
  }, []);

  // Memoize the onDataChange callback to prevent infinite loops
  const handleDataChange = useCallback((data: any) => {
    setFormData(data);
    // Validation will happen automatically via useEffect when formData changes
  }, []);

  // Validate form data whenever it changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      const validation = validateForm(formData);
      setValidationErrors(validation.missing);
    } else {
      // If formData is empty, show all required fields as missing
      const validation = validateForm({});
      setValidationErrors(validation.missing);
    }
  }, [formData, validateForm]);

  const handleSave = async (isSubmit: boolean) => {
    // Validate required fields before submission (only staff fields, not admin fields)
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
        ? `/api/staff/signature/${token}/forms/conflict_of_interest`
        : `/api/staff/onboard/${token}`;
      
      // Preserve admin-filled data when saving (merge with existing data)
      const dataToSave = {
        ...initialFormData, // Start with existing data (includes admin fields)
        ...formData, // Override with current form data (staff fields)
        // Explicitly preserve admin fields from initial data if they exist
        reviewedBy: initialFormData?.reviewedBy || formData.reviewedBy || '',
        reviewerTitle: initialFormData?.reviewerTitle || formData.reviewerTitle || '',
        reviewDate: initialFormData?.reviewDate || formData.reviewDate || '',
        actionTaken: initialFormData?.actionTaken || formData.actionTaken || '',
        hrDecision: initialFormData?.hrDecision || formData.hrDecision || '',
        reviewerSignature: initialFormData?.reviewerSignature || formData.reviewerSignature || '',
        reviewerDate: initialFormData?.reviewerDate || formData.reviewerDate || '',
      };
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'conflict_of_interest',
          data: dataToSave,
          submit: isSubmit,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const action = isSubmit ? 'submitted' : 'saved';
        showToast({
          type: 'success',
          title: `Form ${action === 'submitted' ? 'Submitted' : 'Saved'}`,
          message: `Your Conflict of Interest Disclosure Form has been ${action} successfully.`,
          duration: 4000,
        });

        if (isSubmit) {
          const isSignatureLink = window.location.pathname.includes('/staff/signature/');
          setTimeout(() => {
            router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
          }, 1000);
        }
      } else {
        const errorMessage = result.message || result.error || 'Failed to save form';
        let title = 'Save Failed';

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

  if (loading) {
    return <LoadingView title="Loading Conflict of Interest Form" message="Please wait..." />;
  }

  const ConflictOfInterestEdit = getStaffFormComponent('conflict_of_interest', 'edit');

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Conflict of Interest Disclosure Form</h1>
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

        {/* Edit Component */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <ConflictOfInterestEdit
              initialData={initialFormData}
              onDataChange={handleDataChange}
              showButtons={false}
            />
          </div>

          {/* Validation Errors Summary - Only show if there are missing fields */}
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
