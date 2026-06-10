"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PreEmploymentMedicalForm, { PreEmploymentMedicalFormRef } from '../../components/PreEmploymentMedicalForm';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';

export default function PreEmploymentMedicalFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<PreEmploymentMedicalFormRef>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Detect if this is a signature link or onboard link
        const isSignatureLink = window.location.pathname.includes('/staff/signature/');
        const apiEndpoint = isSignatureLink 
          ? `/api/staff/signature/${token}` 
          : `/api/staff/onboard/${token}`;
        
        const res = await fetch(apiEndpoint);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Error Loading Form',
          message: error.message || 'Failed to load form data',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleSave = async (isSubmit = false) => {
    if (!formRef.current) return;
    
    // Validate before submitting
    if (isSubmit) {
      const validation = formRef.current.validateDetailed();
      if (validation && !validation.isValid) {
        let errorMessage = '';
        
        if (validation.missing && validation.missing.length > 0) {
          errorMessage = 'Please complete the following:\n\n' + validation.missing.join('\n');
        }
        
        if (validation.invalid && validation.invalid.length > 0) {
          if (errorMessage) errorMessage += '\n\n';
          errorMessage += 'Invalid fields:\n' + validation.invalid.join('\n');
        }
        
        showToast({
          type: 'error',
          title: 'Validation Failed',
          message: errorMessage || 'Please fill in all required fields before submitting.',
          duration: 8000,
        });
        
        // Scroll to first error field
        setTimeout(() => {
          const firstErrorField = document.querySelector('.border-red-500');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        
        return;
      }
    }
    
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      if (success && isSubmit) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Your form has been submitted successfully',
          duration: 3000,
        });
        router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
      } else if (success) {
        showToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Your draft has been saved successfully',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save form',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Pre-Employment Medical Form" message="Please wait..." />;
  }

  return (
    <div className="min-h-screen bg-azure-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-azure-700">Pre-Employment Medical</h1>
              <p className="text-azure-400 text-sm sm:text-base">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => {
                const isSignatureLink = window.location.pathname.includes('/staff/signature/');
                router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-azure-400 hover:text-azure-700 rounded-lg hover:bg-azure-50 transition-colors self-start"
            >
              <span>←</span>
              <span>Back to Forms</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-3 sm:p-6">
          <PreEmploymentMedicalForm 
            ref={formRef}
            token={token}
            isSignatureLink={window.location.pathname.includes('/staff/signature/')}
          />
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-azure-500 text-white rounded-lg hover:bg-azure-600 disabled:opacity-50 font-medium"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-azure-700 text-white rounded-lg hover:bg-azure-600 disabled:opacity-50 font-medium"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
