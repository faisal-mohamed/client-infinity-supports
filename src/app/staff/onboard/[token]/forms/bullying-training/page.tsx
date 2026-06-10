"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BullyingTrainingAckForm, { BullyingTrainingAckFormRef } from '../../components/BullyingTrainingAckForm';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function BullyingTrainingFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<BullyingTrainingAckFormRef>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Detect if this is a signature link or onboard link
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        const apiEndpoint = isSignatureLink 
          ? `/api/staff/signature/${token}` 
          : `/api/staff/onboard/${token}`;
        
        const res = await fetch(apiEndpoint);
        
        // Check if response is OK before parsing JSON
        if (!res.ok) {
          // Try to parse error message, but handle HTML error pages
          let errorMessage = 'Failed to load form data';
          try {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await res.json();
              errorMessage = errorData.message || errorData.error || `HTTP ${res.status}: ${res.statusText}`;
            } else {
              // Response is HTML (error page), use status text
              errorMessage = `HTTP ${res.status}: ${res.statusText}`;
            }
          } catch (parseError) {
            // If parsing fails, use status text
            errorMessage = `HTTP ${res.status}: ${res.statusText}`;
          }
          
          setError(errorMessage);
          showToast({
            type: 'error',
            title: 'Error Loading Form',
            message: errorMessage,
            duration: 5000
          });
          return;
        }
        
        // Parse JSON only if response is OK
        const data = await res.json();
        
        setStaff(data.staff);
        
        // Load saved form data - handle both signature and onboard structures
        let trainingData = {};
        if (isSignatureLink) {
          const bullyingTrainingForm = data.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'bullying_training'
          );
          if (bullyingTrainingForm) {
            trainingData = bullyingTrainingForm.formSubmission?.data || {};
          }
        } else {
          trainingData = data.submissions['bullying_training'] || {};
        }
        setFormData(trainingData);
        
        showToast({
          type: 'success',
          title: 'Form Loaded',
          message: 'Your form data has been loaded successfully',
          duration: 3000
        });
      } catch (error: any) {
        console.error('Error loading data:', error);
        const errorMessage = 'Unable to load form data. Please check your internet connection and try again.';
        setError(errorMessage);
        showToast({
          type: 'error',
          title: 'Connection Error',
          message: errorMessage,
          duration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token, showToast]);

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData])

  const handleSave = async (isSubmit: boolean) => {
    if (!formRef.current) return;
    
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      
      if (success && isSubmit) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Your form has been submitted successfully. Redirecting...',
          duration: 3000
        });
        // Small delay to show the success message
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        setTimeout(() => {
          router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
        }, 1000);
      } else if (success) {
        showToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Your draft has been saved successfully',
          duration: 3000
        });
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save your form. Please try again.',
        duration: 5000
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Bullying Training Form" message="Please wait..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-azure-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Form</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-azure-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-azure-700">Bullying Training</h1>
              <p className="text-azure-400">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="px-4 py-2 text-azure-400 hover:text-azure-700"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* Form Component */}
        <BullyingTrainingAckForm 
          ref={formRef}
          token={token as string}
          staff={staff}
          isSignatureLink={window.location.pathname.includes('/staff/signature/')}
          onSubmitted={() => {
            const isSignatureLink = window.location.pathname.includes('/staff/signature/');
            router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
          }}
        />
        
        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-azure-500 text-white rounded-lg hover:bg-azure-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-azure-500 text-white rounded-lg hover:bg-azure-700 disabled:opacity-50"
          >
            {saving ? 'Submitting...' : 'Submit & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
