"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EmployeeDetailsStep, { EmployeeDetailsStepRef } from '../../components/EmployeeDetailsStep';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import FormButton from '@/components/ui/FormButton';
import { useToast } from '@/components/ui/Toast';
import LoadingView from '@/components/ui/LoadingView';
import { useConfirm } from '@/components/ui/Confirm';

export default function EmployeeDetailsFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<EmployeeDetailsStepRef>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
        setFormData(data.submissions['employeeDetails'] || {});
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Failed to Load Form',
          message: error.message || 'Unable to load form data. Please refresh the page and try again.',
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
    
    // Check if admin has approved this form
    const hasAdminApproval = formData.adminSignature;
    
    if (hasAdminApproval && isSubmit) {
      const confirmed = await confirm.confirm({
        title: '⚠️ WARNING: Admin Approval Will Be Cleared',
        message: 'This form has been approved by an administrator. If you submit changes, the admin approval will be cleared and the form will need to be reviewed and approved again.\n\nDo you want to continue?',
        confirmText: 'Continue',
        cancelText: 'Cancel',
      });
      
      if (!confirmed) {
        return;
      }
    }
    
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
          router.push(`/staff/onboard/${token}`);
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

  const EmployeeDetailsView = getStaffFormComponent('employee_details', 'view');

  return (
    <div className="min-h-screen bg-azure-100 py-4 sm:py-8">
      <style jsx>{`
        .view-component-wrapper .text-azure-600 { color: #374151 !important; }
        .view-component-wrapper .text-azure-400 { color: #4b5563 !important; }
        .view-component-wrapper .text-azure-700 { color: #1f2937 !important; }
        .view-component-wrapper .text-xs { font-size: 0.875rem !important; }
        .view-component-wrapper { zoom: 1.1; }
      `}</style>
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-azure-700">Employee Details</h1>
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

        {/* View Component */}
        {/* <div className="bg-white rounded-lg shadow-soft p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="view-component-wrapper">
            <EmployeeDetailsView data={formData} />
          </div>
        </div> */}

        {/* Edit/Signature Component */}
        <div className="bg-white rounded-lg shadow-soft p-3 sm:p-6">
          <EmployeeDetailsStep 
            ref={formRef}
            token={token}
          />
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 pt-6 border-t">
            <FormButton
              onClick={() => handleSave(false)}
              variant="secondary"
              loading={saving}
              icon="save"
            >
              Save Draft
            </FormButton>
            <FormButton
              onClick={() => handleSave(true)}
              variant="gradient"
              loading={saving}
              icon="submit"
            >
              Submit & Continue
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  );
}
