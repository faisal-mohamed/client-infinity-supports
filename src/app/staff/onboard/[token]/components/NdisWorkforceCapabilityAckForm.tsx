"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { fetchFormSpecificSettings } from '@/lib/settings';
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';
import { useToast } from '@/components/ui/Toast';

export interface NdisWorkforceCapabilityAckFormRef { 
  submit: () => Promise<boolean>;
  save: (submit: boolean) => Promise<boolean>;
  validateDetailed: () => { isValid: boolean; missing?: string[]; invalid?: string[] } | null;
}

const NdisWorkforceCapabilityAckForm = forwardRef<NdisWorkforceCapabilityAckFormRef, { token: string; onValidityChange?: (valid: boolean)=>void; onSubmitted?: ()=>void; isSignatureLink?: boolean }>(
function NdisWorkforceCapabilityAckForm({ token, onValidityChange, onSubmitted, isSignatureLink = false }, ref) {
  const [data, setData] = useState<any>({ readAcknowledgement: false, fullName: '', signature: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ website: string; formId: string; reviewDate: string }>({ website: '', formId: '', reviewDate: '' });
  const sigRef = useRef<SignatureCanvasRef | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const settings = await fetchFormSpecificSettings();
        const getSettingValue = (key: string): string | null => {
          const groups = Object.values(settings || {});
          for (const group of groups) {
            if (Array.isArray(group)) {
              const s = group.find((it: any) => it && it.key === key);
              if (s) return s.value || s.defaultValue || null;
            }
          }
          return null;
        };
        setMeta({
          website: getSettingValue('company_website') || getSettingValue('website') || '',
          formId: getSettingValue('ndis_workforce_capability_form_id') || '',
          reviewDate: getSettingValue('ndis_workforce_capability_review_date') || getSettingValue('review_date') || '',
        });
      } catch {
        // use defaults
      }
    })();
  }, []);

  useEffect(() => {
    // Load saved data if any
    const loadData = async () => {
      console.log('🔵 [NdisWorkforceCapabilityAckForm] Loading data for token:', token);
      try {
        const apiEndpoint = isSignatureLink
          ? `/api/staff/signature/${token}/forms/ndis_workforce_capability`
          : `/api/staff/onboard/${token}`;
        
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const result = await response.json();
          console.log('🔵 [NdisWorkforceCapabilityAckForm] API Response:', result);
          
          let savedData: any = {};
          if (isSignatureLink) {
            // Signature API returns formSubmission directly
            savedData = result.formSubmission?.data || {};
            // Merge signature fields
            if (result.formSubmission?.staffSignature) {
              savedData.signature = result.formSubmission.staffSignature;
            }
            if (result.formSubmission?.staffSignedAt) {
              savedData.date = new Date(result.formSubmission.staffSignedAt).toISOString().split('T')[0];
            }
            const staffName = result.staff ? `${result.staff.firstName || ''} ${result.staff.surname || ''}`.trim() : '';
            setData({
              readAcknowledgement: savedData.readAcknowledgement || false,
              fullName: savedData.fullName || staffName,
              signature: savedData.signature || '',
              date: savedData.date || ''
            });
          } else {
            // Onboard API returns submissions object
            const staffName = result.staff ? `${result.staff.firstName || ''} ${result.staff.surname || ''}`.trim() : '';
            
            if (result.submissions?.ndis_workforce_capability) {
              savedData = result.submissions.ndis_workforce_capability;
              console.log('✅ [NdisWorkforceCapabilityAckForm] Found saved data:', savedData);
              setData({
                readAcknowledgement: savedData.readAcknowledgement || false,
                fullName: savedData.fullName || staffName,
                signature: savedData.signature || '',
                date: savedData.date || ''
              });
            } else {
              console.log('⚠️ [NdisWorkforceCapabilityAckForm] No saved data found, pre-filling name from staff info');
              setData((prev: any) => ({
                ...prev,
                fullName: staffName
              }));
            }
          }
        }
      } catch (e) {
        console.error('❌ [NdisWorkforceCapabilityAckForm] Error loading data:', e);
        // ignore prefill errors
      }
    };
    loadData();
  }, [token, isSignatureLink]);

  const handleChange = (k: string, v: any) => {
    const next = { ...data, [k]: v };
    setData(next);
    const valid = !!next.readAcknowledgement && !!next.fullName && !!next.signature && !!next.date;
    onValidityChange?.(valid);
  };

  const handleSubmit = async () => {
    console.log('🔵 [NdisWorkforceCapabilityAckForm] Submitting data:', data);
    setLoading(true);
    try {
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/ndis_workforce_capability`
        : `/api/staff/onboard/${token}`;
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'ndis_workforce_capability', data, submit: true }),
      });
      const j = await res.json();
      console.log('✅ [NdisWorkforceCapabilityAckForm] Submit response:', j);
      if (!res.ok) throw new Error(j.error || 'Failed to submit');
      onSubmitted?.();
      return true;
    } catch (e: any) {
      console.error('❌ [NdisWorkforceCapabilityAckForm] Submit error:', e);
      showToast({
        type: 'error',
        title: 'Submit Failed',
        message: e.message || 'Failed to submit form',
        duration: 4000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (submit: boolean) => {
    console.log('🔵 [NdisWorkforceCapabilityAckForm] Saving data:', data, 'submit:', submit);
    setLoading(true);
    try {
      const apiEndpoint = isSignatureLink
        ? `/api/staff/signature/${token}/forms/ndis_workforce_capability`
        : `/api/staff/onboard/${token}`;
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'ndis_workforce_capability', data, submit }),
      });
      const j = await res.json();
      console.log('✅ [NdisWorkforceCapabilityAckForm] Save response:', j);
      if (!res.ok) throw new Error(j.error || 'Failed to save');
      if (submit) onSubmitted?.();
      return true;
    } catch (e: any) {
      console.error('❌ [NdisWorkforceCapabilityAckForm] Save error:', e);
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: e.message || 'Failed to save form',
        duration: 4000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateDetailed = () => {
    const missing: string[] = [];
    const invalid: string[] = [];

    if (!data.readAcknowledgement) missing.push('Acknowledgement');
    if (!data.fullName) missing.push('Full Name');
    if (!data.signature) missing.push('Signature');
    if (!data.date) missing.push('Date');

    // Check if date is valid
    if (data.date && isNaN(Date.parse(data.date))) {
      invalid.push('Date (invalid format)');
    }

    return {
      isValid: missing.length === 0 && invalid.length === 0,
      missing: missing.length > 0 ? missing : undefined,
      invalid: invalid.length > 0 ? invalid : undefined
    };
  };

  useImperativeHandle(ref, () => ({ 
    submit: handleSubmit,
    save: handleSave,
    validateDetailed
  }), [data]);

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white w-full max-w-[794px] min-h-[1123px] border shadow relative px-[96px] pt-12 pb-[112px] a4-ack">
        {/* Header with logo */}
        <div className="flex justify-center mt-2 mb-6">
          <img src="/client_full_logo.jpg" alt="Company Logo" className="h-16 object-contain" />
        </div>

        <h2 className="text-center font-semibold mb-6 text-[12pt]">NDIS Workforce Capability Framework Acknowledgement Form</h2>

        <p className="mb-4">
          I confirm I have received the NDIS Workforce Capability Framework from Infinity Supports and have read and
          understood the content.
        </p>
        <p className="mb-8">
          A printed version of this framework is also available. If you would like a printed version, please contact us.
        </p>

        <div className="space-y-6">
          {/* Acknowledgement Checkbox */}
          <div className="flex items-start gap-3 p-4 border border-azure-300 rounded-lg bg-azure-50">
            <input
              id="readAcknowledgement"
              type="checkbox"
              checked={data.readAcknowledgement}
              onChange={(e) => handleChange('readAcknowledgement', e.target.checked)}
              className="mt-1 w-5 h-5 accent-blue-600 rounded border-azure-300 focus:ring-gold-500 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="readAcknowledgement" className="text-[12pt] leading-relaxed">
              <strong>I acknowledge that:</strong><br />
              • I have received the NDIS Workforce Capability Framework from Infinity Supports<br />
              • I have read and understood the content<br />
              • I agree to comply with all policies and procedures outlined in the framework
            </label>
          </div>

          <div>
            <label className="block text-[12pt] mb-1" htmlFor="fullName">Name</label>
            <input id="fullName" title="Full Name" placeholder="Full Name" className="w-full border-b border-black/60 px-1 py-2" value={data.fullName} onChange={(e)=>handleChange('fullName', e.target.value)} />
          </div>
          <div className="mb-8">
            <label className="block text-[12pt] mb-2" htmlFor="signature">Signature</label>
            <SignatureCanvas
              existingSignature={data.signature}
              onSignatureEnd={(sig) => handleChange('signature', sig)}
              onSignatureClear={() => handleChange('signature', '')}
              width={400}
              height={150}
              className="bg-white w-full"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[12pt] mb-1" htmlFor="ackDate">Date</label>
            <input id="ackDate" title="Date" placeholder="YYYY-MM-DD" type="date" className="w-full border-b border-black/60 px-1 py-2" value={data.date} onChange={(e)=>handleChange('date', e.target.value)} />
          </div>
        </div>

        {/* Footer - Only show if settings exist */}
        {(meta.website || meta.formId || meta.reviewDate) && (
          <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-azure-400 flex items-center justify-between">
            {meta.website && <div>Website: {meta.website}</div>}
            {meta.formId && <div>{meta.formId}</div>}
            {meta.reviewDate && <div>Review Date: {meta.reviewDate}</div>}
          </div>
        )}
      </div>
    </div>
  );
});

export default NdisWorkforceCapabilityAckForm;

