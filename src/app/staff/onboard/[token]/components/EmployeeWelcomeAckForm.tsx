"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { fetchFormSpecificSettings } from '@/lib/settings';
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';

export interface EmployeeWelcomeAckFormRef { 
  submit: () => Promise<boolean>;
  save: (submit: boolean) => Promise<boolean>;
  validateDetailed: () => { isValid: boolean; missing?: string[]; invalid?: string[] } | null;
}

const EmployeeWelcomeAckForm = forwardRef<EmployeeWelcomeAckFormRef, { token: string; onValidityChange?: (valid: boolean)=>void; onSubmitted?: ()=>void }>(
function EmployeeWelcomeAckForm({ token, onValidityChange, onSubmitted }, ref) {
  const [data, setData] = useState<any>({ readAcknowledgement: false, fullName: '', signature: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ website: string; formId: string; reviewDate: string }>({ website: 'infinitysupportswa.org', formId: 'SF009', reviewDate: new Date().toISOString().slice(0,10) });
  const sigRef = useRef<SignatureCanvasRef | null>(null);

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
          website: getSettingValue('company_website') || 'infinitysupportswa.org',
          formId: getSettingValue('employee_welcome_form_id') || 'SF009',
          reviewDate: getSettingValue('review_date') || new Date().toISOString().slice(0,10),
        });
      } catch {
        // use defaults
      }
    })();
  }, []);

  useEffect(() => {
    // Load saved data if any
    const loadData = async () => {
      try {
        const response = await fetch(`/api/staff/onboard/${token}`);
        if (response.ok) {
          const result = await response.json();
          if (result.submissions?.employee_welcome) {
            const savedData = result.submissions.employee_welcome;
            setData({
              readAcknowledgement: savedData.readAcknowledgement || false,
              fullName: savedData.fullName || '',
              signature: savedData.signature || '',
              date: savedData.date || ''
            });
          }
        }
      } catch (e) {
        // ignore prefill errors
      }
    };
    loadData();
  }, [token]);

  const handleChange = (k: string, v: any) => {
    const next = { ...data, [k]: v };
    setData(next);
    const valid = !!next.readAcknowledgement && !!next.fullName && !!next.signature && !!next.date;
    onValidityChange?.(valid);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'employee_welcome', data, submit: true }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to submit');
      onSubmitted?.();
      return true;
    } catch (e: any) {
      alert(e.message || 'Failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (submit: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/staff/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formKey: 'employee_welcome', data, submit }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');
      if (submit) onSubmitted?.();
      return true;
    } catch (e: any) {
      alert(e.message || 'Failed');
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

        <h2 className="text-center font-semibold mb-6 text-[12pt]">Employee Handbook Acknowledgement Form</h2>

        <p className="mb-4">
          I confirm I have received the Employee handbook from Infinity Supports and have read and
          understood the content.
        </p>
        <p className="mb-8">
          A printed version of this handbook is also available. If you would like a printed version, please contact us.
        </p>

        <div className="space-y-6">
          {/* Acknowledgement Checkbox */}
          <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <input
              id="readAcknowledgement"
              type="checkbox"
              checked={data.readAcknowledgement}
              onChange={(e) => handleChange('readAcknowledgement', e.target.checked)}
              className="mt-1 w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
            />
            <label htmlFor="readAcknowledgement" className="text-[12pt] leading-relaxed">
              <strong>I acknowledge that:</strong><br />
              • I have received the Employee Handbook from Infinity Supports<br />
              • I have read and understood the content<br />
              • I agree to comply with all policies and procedures outlined in the handbook
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

        {/* Footer */}
        <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
          <div>Website: {meta.website}</div>
          <div>{meta.formId}</div>
          <div>Review Date: {meta.reviewDate}</div>
        </div>

        {/* No page number and no internal action button */}
      </div>
    </div>
  );
});

export default EmployeeWelcomeAckForm;


