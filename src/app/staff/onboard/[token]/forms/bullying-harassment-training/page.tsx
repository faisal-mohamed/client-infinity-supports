"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import LoadingView from '@/components/ui/LoadingView';
import { useToast } from '@/components/ui/Toast';

export default function BullyingHarassmentTrainingFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    staffName: '',
    readAcknowledgement: false,
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [saving, setSaving] = useState(false);

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
        
        // Load saved form data - handle both signature and onboard structures
        let trainingData = {};
        if (isSignatureLink) {
          const bullyingHarassmentForm = data.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'bullying_harassment_training'
          );
          if (bullyingHarassmentForm) {
            trainingData = bullyingHarassmentForm.formSubmission?.data || {};
          }
        } else {
          trainingData = data.submissions['bullying_harassment_training'] || {};
        }
        
        const defaultData = {
          staffName: `${data.staff?.firstName ?? ''} ${data.staff?.surname ?? ''}`.trim(),
          readAcknowledgement: false,
          date: new Date().toISOString().split('T')[0],
        };
        setFormData({
          ...defaultData,
          ...trainingData,
        });
      } catch (error: any) {
        console.error('Error loading data:', error);
        showToast({
          type: 'error',
          title: 'Error Loading Form',
          message: error.message || 'Failed to load form data',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleAcknowledgementChange = (updates: Record<string, any>) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
  };

  const derivedAcknowledged = useMemo(
    () => formData?.readAcknowledgement || formData?.acknowledged || false,
    [formData?.readAcknowledgement, formData?.acknowledged]
  );
  const derivedSignature = useMemo(
    () => formData?.signature || formData?.staffSignature || '',
    [formData?.signature, formData?.staffSignature]
  );
  const derivedDate = useMemo(
    () => formData?.date || formData?.acknowledgedAt || formData?.staffSignedAt || '',
    [formData?.date, formData?.acknowledgedAt, formData?.staffSignedAt]
  );
  const derivedStaffName = useMemo(
    () => formData?.staffName || formData?.fullName || '',
    [formData?.staffName, formData?.fullName]
  );

  const handleSave = async (isSubmit: boolean) => {
    setSaving(true);
    try {
      if (isSubmit) {
        const nameFilled = !!derivedStaffName?.trim();
        const signatureFilled = !!derivedSignature;
        const dateFilled = !!derivedDate;
        const acknowledgedChecked = !!derivedAcknowledged;

        if (!nameFilled || !signatureFilled || !dateFilled || !acknowledgedChecked) {
          const missingItems = [
            !acknowledgedChecked && 'Tick the acknowledgement checkbox',
            !nameFilled && 'Enter your full name',
            !signatureFilled && 'Provide your signature',
            !dateFilled && 'Select the acknowledgement date',
          ].filter(Boolean);
          
          showToast({
            type: 'error',
            title: 'Complete the Bullying & Harassment Training acknowledgement',
            message: `Please complete: ${missingItems.join(', ')}`,
            duration: 5000,
          });
          setSaving(false);
          return;
        }
      }

      // Detect if this is a signature link or onboard link
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/bullying_harassment_training`
        : `/api/staff/onboard/${token}`;
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'bullying_harassment_training', data: formData, submit: isSubmit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');
      
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

  const BullyingHarassmentTrainingView = getStaffFormComponent('bullying_harassment_training', 'view');

  if (loading) {
    return <LoadingView title="Loading Bullying Harassment Training Form" message="Please wait..." />;
  }

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
              <h1 className="text-xl md:text-2xl font-bold text-azure-700">Bullying & Harassment Training</h1>
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
            <BullyingHarassmentTrainingView
              data={formData}
              acknowledgementMode="editable"
              onAcknowledgementChange={handleAcknowledgementChange}
              onRenderingChange={setRendering}
            />
          </div>
          
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
