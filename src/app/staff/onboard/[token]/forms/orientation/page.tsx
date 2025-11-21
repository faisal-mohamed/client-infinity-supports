"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getStaffFormComponent } from '@/app/forms/staff-registry';
import LoadingView from '@/components/ui/LoadingView';

export default function OrientationFormPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [staff, setStaff] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    staffName: '',
    acknowledged: false,
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
        let orientationData = {};
        if (isSignatureLink) {
          const orientationForm = data.signatureForms?.find(
            (f: any) => f.formSubmission?.form?.formKey === 'orientation'
          );
          if (orientationForm) {
            orientationData = orientationForm.formSubmission?.data || {};
          }
        } else {
          orientationData = data.submissions['orientation'] || {};
        }
        
        const defaultData = {
          staffName: `${data.staff?.firstName ?? ''} ${data.staff?.surname ?? ''}`.trim(),
          acknowledged: false,
          date: new Date().toISOString().split('T')[0],
        };
        setFormData({
          ...defaultData,
          ...orientationData,
        });
      } catch (error: any) {
        console.error('Error loading data:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  useEffect(() => {
    console.log("formData: ", formData);
  }, [formData])

  const handleAcknowledgementChange = (updates: Record<string, any>) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
  };

  const derivedAcknowledged = useMemo(
    () => formData?.acknowledged || formData?.orientationAcknowledged || formData?.readOrientation,
    [formData]
  );
  const derivedSignature = useMemo(
    () => formData?.signature || formData?.staffSignature || formData?.orientationSignature,
    [formData]
  );
  const derivedDate = useMemo(
    () => formData?.date || formData?.acknowledgedAt || formData?.staffSignedAt,
    [formData]
  );
  const derivedStaffName = useMemo(
    () => formData?.staffName || formData?.employeeName || '',
    [formData]
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
          alert(
            [
              'Complete the Staff Orientation acknowledgement:',
              !acknowledgedChecked && '• Tick the acknowledgement checkbox',
              !nameFilled && '• Enter your full name',
              !signatureFilled && '• Provide your signature',
              !dateFilled && '• Select the acknowledgement date',
            ]
              .filter(Boolean)
              .join('\n')
          );
          setSaving(false);
          return;
        }
      }

      // Detect if this is a signature link or onboard link
      const isSignatureLink = window.location.pathname.includes('/staff/signature/');
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/orientation`
        : `/api/staff/onboard/${token}`;
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'orientation', data: formData, submit: isSubmit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');
      
      if (isSubmit) {
        router.push(isSignatureLink ? `/staff/signature/${token}` : `/staff/onboard/${token}`);
      } else {
        alert('Draft saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const OrientationView = getStaffFormComponent('orientation', 'view');

  if (loading) {
    return <LoadingView title="Loading Orientation Form" message="Please wait..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      <style jsx>{`
        .view-component-wrapper .text-gray-700 { color: #374151 !important; }
        .view-component-wrapper .text-gray-600 { color: #4b5563 !important; }
        .view-component-wrapper .text-gray-800 { color: #1f2937 !important; }
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
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Staff Orientation</h1>
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

        {/* View Component */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-6">
          <div className="view-component-wrapper w-full">
            <OrientationView
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
          </div>
        </div>
      </div>
    </div>
  );
}
