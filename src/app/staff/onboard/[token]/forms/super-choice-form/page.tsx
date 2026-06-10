"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function SuperChoiceFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          const superChoiceForm = staffData.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'super_choice_form'
          );
          if (superChoiceForm) {
            formSubmission = superChoiceForm.formSubmission?.data || {};
          }
        } else {
          formSubmission = staffData.submissions?.['super_choice_form'] || {};
        }
        
        if (formSubmission && Object.keys(formSubmission).length > 0) {
          setFormData(formSubmission);
        }
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

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData]);

  // Helper to check if date is complete
  const isDateComplete = (date: { day: string; month: string; year: string } | undefined): boolean => {
    if (!date) return false;
    return !!(date.day && date.month && date.year && 
              date.day.length === 2 && date.month.length === 2 && date.year.length === 4);
  };

  const handleSave = async (isSubmit: boolean) => {
    // Validate required fields before submitting
    if (isSubmit) {
      const requiredFields: { key: string; label: string }[] = [
        { key: 'fullName', label: 'Full Name' },
        { key: 'tfn', label: 'TFN' },
      ];
      let missingFields = requiredFields.filter(field => {
        const value = formData[field.key];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      // Add conditional required fields based on fund choice
      if (formData.fundChoice === 'existing') {
        const existingFundFields: { key: string; label: string }[] = [
          { key: 'superFundName', label: 'Super Fund Name' },
          { key: 'superFundABN', label: 'Super Fund ABN' },
          { key: 'superFundUSI', label: 'Super Fund USI' },
          { key: 'memberAccountNumber', label: 'Member Account Number' },
          { key: 'accountName', label: 'Account Name' },
        ];
        missingFields = missingFields.concat(
          existingFundFields.filter(field => {
            const value = formData[field.key];
            return !value || (typeof value === 'string' && value.trim() === '');
          })
        );
        
        // Validate Section B signature and date
        if (!formData.sectionBSignature || formData.sectionBSignature.trim() === '') {
          showToast({
            type: 'error',
            title: 'Signature Required',
            message: 'Please provide your signature for Section B (My existing super fund)',
            duration: 5000,
          });
          return;
        }
        
        if (!isDateComplete(formData.sectionBDate)) {
          showToast({
            type: 'error',
            title: 'Date Required',
            message: 'Please provide the signature date for Section B (My existing super fund)',
            duration: 5000,
          });
          return;
        }
      } else if (formData.fundChoice === 'default') {
        const defaultFundFields: { key: string; label: string }[] = [
          { key: 'businessName', label: 'Business Name' },
          { key: 'businessABN', label: 'Business ABN' },
          { key: 'defaultSuperFundName', label: 'Default Super Fund Name' },
          { key: 'defaultSuperFundABN', label: 'Default Super Fund ABN' },
          { key: 'defaultSuperFundUSI', label: 'Default Super Fund USI' },
        ];
        missingFields = missingFields.concat(
          defaultFundFields.filter(field => {
            const value = formData[field.key];
            return !value || (typeof value === 'string' && value.trim() === '');
          })
        );
        
        // Validate Section C signature and date
        if (!formData.sectionCSignature || formData.sectionCSignature.trim() === '') {
          showToast({
            type: 'error',
            title: 'Signature Required',
            message: 'Please provide your signature for Section C (My employer\'s default super fund)',
            duration: 5000,
          });
          return;
        }
        
        if (!isDateComplete(formData.sectionCDate)) {
          showToast({
            type: 'error',
            title: 'Date Required',
            message: 'Please provide the signature date for Section C (My employer\'s default super fund)',
            duration: 5000,
          });
          return;
        }
      } else if (formData.fundChoice === 'smsf') {
        const smsfFields: { key: string; label: string }[] = [
          { key: 'smsfName', label: 'SMSF Name' },
          { key: 'smsfABN', label: 'SMSF ABN' },
          { key: 'smsfESA', label: 'SMSF ESA' },
          { key: 'smsfAccountName', label: 'SMSF Account Name' },
          { key: 'bankAccountName', label: 'Bank Account Name' },
          { key: 'bsbCode', label: 'BSB Code' },
          { key: 'accountNumber', label: 'Account Number' },
        ];
        missingFields = missingFields.concat(
          smsfFields.filter(field => {
            const value = formData[field.key];
            return !value || (typeof value === 'string' && value.trim() === '');
          })
        );
        
        // Validate Section D signature and date
        if (!formData.sectionDSignature || formData.sectionDSignature.trim() === '') {
          showToast({
            type: 'error',
            title: 'Signature Required',
            message: 'Please provide your signature for Section D (My private self-managed super fund)',
            duration: 5000,
          });
          return;
        }
        
        if (!isDateComplete(formData.sectionDDate)) {
          showToast({
            type: 'error',
            title: 'Date Required',
            message: 'Please provide the signature date for Section D (My private self-managed super fund)',
            duration: 5000,
          });
          return;
        }
      }

      if (missingFields.length > 0) {
        const fieldLabels = missingFields.map(f => f.label).join(', ');
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: `Please fill in required fields: ${fieldLabels}`,
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
        ? `/api/staff/signature/${token}/forms/super_choice_form`
        : `/api/staff/onboard/${token}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formKey: 'super_choice_form',
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
          message: `Your Superannuation Standard Choice Form has been ${action} successfully.`,
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


  if (loading) {
    return <LoadingView title="Loading Super Choice Form" message="Please wait..." />;
  }

  const SuperChoiceFormView = getStaffFormComponent('super_choice_form', 'view');

  return (
    <div className="min-h-screen bg-azure-100 py-4 md:py-8">
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
        <div className="bg-white rounded-lg shadow-soft p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-azure-700">Superannuation Standard Choice Form</h1>
              <p className="text-azure-400">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button 
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="px-4 py-2 text-azure-400 hover:text-azure-700 self-start sm:self-auto"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* View Component */}
        <div className="bg-white rounded-lg shadow-soft p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <SuperChoiceFormView
              initialData={formData}
              onDataChange={setFormData}
              showButtons={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
            <button 
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-azure-500 text-white rounded-lg hover:bg-azure-500 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-azure-500 text-white rounded-lg hover:bg-azure-700 disabled:opacity-50 w-full sm:w-auto"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
