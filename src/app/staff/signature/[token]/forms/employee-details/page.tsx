"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EmployeeDetailsStep, { EmployeeDetailsStepRef } from '../../../../onboard/[token]/components/EmployeeDetailsStep';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';

export default function EmployeeDetailsSignatureFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<EmployeeDetailsStepRef>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load staff data from signature batch
        const res = await fetch(`/api/staff/signature/${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        // Find employee details form submission
        const employeeDetailsForm = data.signatureForms?.find(
          (f: any) => ['employee_details', 'employment_details'].includes(f.formSubmission?.form?.formKey) ||
                      ['employee_details', 'employment_details'].includes(f.formSubmission?.formKey)
        );
        
        if (!employeeDetailsForm) {
          throw new Error('Employee Details form not found in this signature batch');
        }
        
        // Set staff data for display
        setStaff(data.staff);
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Failed to Load Form',
          message: error.message || 'Unable to load form data. Please refresh the page.',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token, showToast]);

  const handleSave = async (isSubmit = false) => {
    if (!formRef.current) return;
    
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      
      if (success && isSubmit) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Employee Details form has been submitted successfully.',
          duration: 4000,
        });
        setTimeout(() => {
          router.push(`/staff/signature/${token}`);
        }, 1500);
      } else if (success) {
        showToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Your progress has been saved.',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Failed to save form. Please try again.',
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingView title="Loading Employee Details Form" message="Please wait..." />;
  }

  return (
    <div className="min-h-screen bg-azure-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-azure-700">Employee Details</h1>
              <p className="text-azure-400">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => router.push(`/staff/signature/${token}`)}
              className="px-4 py-2 text-azure-400 hover:text-azure-700"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <EmployeeDetailsStep 
            ref={formRef}
            token={token}
            isSignatureLink={true} // Indicate this is a signature link context
          />
          
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-azure-500 text-white rounded-lg hover:bg-azure-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-azure-500 text-white rounded-lg hover:bg-azure-700 disabled:opacity-50"
            >
              {saving ? 'Submitting...' : 'Submit & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

