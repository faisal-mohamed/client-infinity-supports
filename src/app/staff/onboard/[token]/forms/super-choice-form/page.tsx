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
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load staff data and form submissions in one call
        const response = await fetch(`/api/staff/onboard/${token}`);
        
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
        setStaff(staffData);
        
        // Get the super_choice_form submission (submissions is an object keyed by formKey)
        const formSubmission = staffData.submissions?.['super_choice_form'];
        if (formSubmission) {
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

  const handleSave = async (isSubmit: boolean) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/staff/onboard/${token}`, {
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
          setTimeout(() => {
            router.push(`/staff/onboard/${token}`);
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

  const handleDownload = async () => {
    if (!formData || Object.keys(formData).length === 0) {
      showToast({
        type: 'warning',
        title: 'No Data',
        message: 'Please fill out the form before downloading.',
        duration: 4000,
      });
      return;
    }
    
    setDownloading(true);
    try {
      const response = await fetch('/api/generate-pdf/super-choice-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Superannuation_Standard_Choice_Form_${staff?.firstName || ''}_${staff?.surname || ''}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast({
        type: 'success',
        title: 'PDF Downloaded',
        message: 'Your form has been downloaded successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Download error:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: error.message || 'Failed to download form. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Super Choice Form" message="Please wait..." />;
  }

  const SuperChoiceFormView = getStaffFormComponent('super_choice_form', 'view');

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Superannuation Standard Choice Form</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button 
              onClick={() => router.push(`/staff/onboard/${token}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 self-start sm:self-auto"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* View Component */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
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
            <button
              onClick={handleDownload}
              disabled={downloading || !formData || Object.keys(formData).length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {downloading ? 'Preparing PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
