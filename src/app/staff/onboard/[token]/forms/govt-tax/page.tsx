"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';

export default function GovtTaxFormPage() {
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
        const res = await fetch(`/api/staff/onboard/${token}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setStaff(data.staff);
        setFormData(data.submissions['govt_tax'] || {});
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

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData])

  const handleSave = async (isSubmit: boolean) => {
    // Validate required fields before submitting
    if (isSubmit) {
      const requiredFields: { key: string; label: string }[] = [
        { key: 'tfn', label: 'TFN' },
        { key: 'surname', label: 'Surname' },
        { key: 'firstName', label: 'First Name' },
        { key: 'dob', label: 'Date of Birth' },
        { key: 'address', label: 'Address' },
        { key: 'town', label: 'Town/City' },
        { key: 'state', label: 'State' },
        { key: 'postcode', label: 'Postcode' },
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = formData[field.key];
        return !value || (typeof value === 'string' && value.trim() === '');
      });
      
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
      
      // Validate date of birth format
      if (formData.dob) {
        const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dobRegex.test(formData.dob)) {
          showToast({
            type: 'error',
            title: 'Invalid Date Format',
            message: 'Date of Birth must be in DD/MM/YYYY format',
            duration: 5000,
          });
          return;
        }
      }
      
      // Validate signature
      const hasPayeeSignature = !!(formData.payeeSignature || formData.staffSignature);
      if (!hasPayeeSignature) {
        showToast({
          type: 'error',
          title: 'Signature Required',
          message: 'Please provide your signature (Section A - Payee signature)',
          duration: 5000,
        });
        return;
      }
      
      // Validate signature date
      const payeeSignatureAt = formData.payeeSignatureAt;
      if (!payeeSignatureAt || payeeSignatureAt.trim() === '') {
        showToast({
          type: 'error',
          title: 'Signature Date Required',
          message: 'Please provide the signature date (Section A - Payee signature date)',
          duration: 5000,
        });
        return;
      }
      
      // Validate signature date format
      if (payeeSignatureAt) {
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(payeeSignatureAt)) {
          showToast({
            type: 'error',
            title: 'Invalid Date Format',
            message: 'Signature date must be in DD/MM/YYYY format',
            duration: 5000,
          });
          return;
        }
      }
    }
    
    setSaving(true);
    try {
      const res = await fetch(`/api/staff/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'govt_tax', data: formData, submit: isSubmit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');
      
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      if (isSubmit) {
        showToast({
          type: 'success',
          title: 'Form Submitted',
          message: 'Your form has been submitted successfully',
          duration: 3000,
        });
        router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
      } else {
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
    return <LoadingView title="Loading Government Tax Form" message="Please wait..." />;
  }

  const GovtTaxView = getStaffFormComponent('govt_tax', 'view');

  return (
    <div className="min-h-screen bg-azure-100 py-4 md:py-8">
      <style jsx>{`
        .view-component-wrapper .text-azure-600 { color: #374151 !important; }
        .view-component-wrapper .text-azure-400 { color: #4b5563 !important; }
        .view-component-wrapper .text-azure-700 { color: #1f2937 !important; }
        .view-component-wrapper .text-xs { font-size: 0.875rem !important; }
        .view-component-wrapper { 
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-soft p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-azure-700">TFN Declaration</h1>
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
        <div className="bg-white rounded-lg shadow-soft p-2 md:p-6 space-y-8">
          <div className="view-component-wrapper w-full">
            <GovtTaxView 
              initialData={formData}
              onDataChange={setFormData}
              showButtons={false}
              lockSectionB
            />
          </div>

          <div className="w-full flex justify-center">
            <div className="border rounded-xl overflow-hidden shadow-inner w-full max-w-[820px]">
              <img
                src="/7.TFN_declaration_form_page2_image.jpg"
                alt="TFN Declaration - Payer Information"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row flex-wrap gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t">
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
