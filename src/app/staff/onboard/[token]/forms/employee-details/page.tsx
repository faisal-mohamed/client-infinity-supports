"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import EmployeeDetailsStep, { EmployeeDetailsStepRef } from '../../components/EmployeeDetailsStep';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import FormButton from '@/components/ui/FormButton';

export default function EmployeeDetailsFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
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
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleSave = async (isSubmit = false) => {
    if (!formRef.current) return;
    
    // Check if admin has approved this form
    const hasAdminApproval = formData.adminSignature;
    
    if (hasAdminApproval && isSubmit) {
      const confirmEdit = window.confirm(
        '⚠️ WARNING: Admin Approval Will Be Cleared\n\n' +
        'This form has been approved by an administrator. If you submit changes, the admin approval will be cleared and the form will need to be reviewed and approved again.\n\n' +
        'Do you want to continue?'
      );
      
      if (!confirmEdit) {
        return;
      }
    }
    
    setSaving(true);
    try {
      const success = await formRef.current.save(isSubmit);
      
      if (success && isSubmit) {
        router.push(`/staff/onboard/${token}`);
      } else if (success) {
        alert('Draft saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const EmployeeDetailsView = getStaffFormComponent('employee_details', 'view');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <style jsx>{`
        .view-component-wrapper .text-gray-700 { color: #374151 !important; }
        .view-component-wrapper .text-gray-600 { color: #4b5563 !important; }
        .view-component-wrapper .text-gray-800 { color: #1f2937 !important; }
        .view-component-wrapper .text-xs { font-size: 0.875rem !important; }
        .view-component-wrapper { zoom: 1.1; }
      `}</style>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
              <p className="text-gray-600">{staff?.firstName} {staff?.surname}</p>
            </div>
            <button
              onClick={() => router.push(`/staff/onboard/${token}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Forms
            </button>
          </div>
        </div>

        {/* View Component */}
        {/* <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="view-component-wrapper">
            <EmployeeDetailsView data={formData} />
          </div>
        </div> */}

        {/* Edit/Signature Component */}
        <div className="bg-white rounded-lg shadow-lg p-6">
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
