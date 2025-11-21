"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { fetchFormSpecificSettings } from '@/lib/settings';
import SignatureCanvas, { SignatureCanvasRef } from '@/components/ui/SignatureCanvas';
import { useToast } from '@/components/ui/Toast';

export interface BullyingHarassmentTrainingAckFormRef { 
  submit: () => Promise<boolean>;
  save: (submit: boolean) => Promise<boolean>;
  validateDetailed: () => { isValid: boolean; missing?: string[]; invalid?: string[] } | null;
}

const BullyingHarassmentTrainingAckForm = forwardRef<BullyingHarassmentTrainingAckFormRef, { token: string; onValidityChange?: (valid: boolean)=>void; onSubmitted?: ()=>void; isSignatureLink?: boolean }>(
function BullyingHarassmentTrainingAckForm({ token, onValidityChange, onSubmitted, isSignatureLink = false }, ref) {
  const [data, setData] = useState<any>({ readAcknowledgement: false, fullName: '', signature: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ website: string | null; formId: string | null; reviewDate: string | null }>({ website: null, formId: null, reviewDate: null });
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
          website: getSettingValue('company_website') || getSettingValue('website') || null,
          formId: getSettingValue('bullying_harassment_training_form_id') || null,
          // Only use form-specific review date, no fallback to general review_date
          reviewDate: getSettingValue('bullying_harassment_training_review_date') || null,
        });
      } catch {
        // use defaults
      }
    })();
  }, []);

  useEffect(() => {
    // Load saved data if any
    const loadData = async () => {
      console.log('🔵 [BullyingHarassmentTrainingAckForm] Loading data for token:', token);
      try {
        const response = await fetch(`/api/staff/onboard/${token}`);
        const result = await response.json();
        console.log('🔵 [BullyingHarassmentTrainingAckForm] API Response:', result);
        
        const staffName = result.staff ? `${result.staff.firstName || ''} ${result.staff.surname || ''}`.trim() : '';
        
        const savedData = result.submissions?.bullying_harassment_training;
        if (savedData) {
          console.log('✅ [BullyingHarassmentTrainingAckForm] Loaded saved data:', savedData);
          setData({
            readAcknowledgement: savedData.readAcknowledgement || false,
            fullName: savedData.fullName || staffName,
            signature: savedData.signature || '', // Load saved signature
            date: savedData.date || '',
          });
        } else if (staffName) {
          // Pre-fill name from staff info if no saved data
          setData((prev: any) => ({ ...prev, fullName: staffName }));
        }
      } catch (error) {
        console.error('❌ [BullyingHarassmentTrainingAckForm] Error loading data:', error);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleChange = (field: string, value: any) => {
    setData((prev: any) => {
      const updated = { ...prev, [field]: value };
      if (onValidityChange) {
        const validation = validateForm(updated);
        onValidityChange(validation.isValid);
      }
      return updated;
    });
  };

  const validateForm = (formData: any = data) => {
    const missing: string[] = [];
    if (!formData.readAcknowledgement) missing.push('Acknowledgement checkbox');
    if (!formData.fullName?.trim()) missing.push('Full Name');
    if (!formData.signature?.trim()) missing.push('Signature');
    if (!formData.date) missing.push('Date');

    return {
      isValid: missing.length === 0,
      missing,
    };
  };

  const save = async (isSubmit = false, isSignatureLinkOverride?: boolean) => {
    const useSignatureLink = isSignatureLinkOverride !== undefined ? isSignatureLinkOverride : isSignatureLink;
      const validation = validateForm();
      if (!validation.isValid) {
        showToast({
          type: 'warning',
          title: 'Missing Required Fields',
          message: `Please complete all required fields: ${validation.missing?.join(', ')}`,
          duration: 4000,
        });
        return false;
      }

      setLoading(true);
      try {
        // Get signature from canvas if it exists, otherwise use saved signature
        const signature = sigRef.current && !sigRef.current.isEmpty() 
          ? sigRef.current.toDataURL() 
          : data.signature;
        const payload = {
          formKey: 'bullying_harassment_training',
          data: {
            ...data,
            signature,
          },
          submit: isSubmit,
        };

        console.log('🔵 [BullyingHarassmentTrainingAckForm] Saving form:', payload, 'useSignatureLink:', useSignatureLink);
        const apiEndpoint = useSignatureLink
          ? `/api/staff/signature/${token}/forms/bullying_harassment_training`
          : `/api/staff/onboard/${token}`;
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save form');

        console.log('✅ [BullyingHarassmentTrainingAckForm] Form saved successfully');
        if (isSubmit && onSubmitted) {
          onSubmitted();
        }
        return true;
      } catch (error: any) {
        console.error('❌ [BullyingHarassmentTrainingAckForm] Error saving form:', error);
        showToast({
          type: 'error',
          title: 'Save Failed',
          message: error.message || 'Failed to save form',
          duration: 4000,
        });
        return false;
      } finally {
        setLoading(false);
      }
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      return await save(true);
    },
    save,
    validateDetailed: () => {
      return validateForm();
    },
  }));

  return (
    <div className="relative" style={{ minHeight: '800px', paddingBottom: '100px' }}>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/infinity_logo.png" alt="Infinity Supports" className="h-12" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-8">Bullying & Harassment Training</h1>

      {/* Content */}
      <div className="space-y-6 text-sm">
        <p className="text-gray-700 leading-relaxed">
          I acknowledge that I have received, read, and understood the Bullying & Harassment Training materials provided to me.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700 mb-4">
            By signing below, I confirm that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>I have completed the Bullying & Harassment Training</li>
            <li>I understand the key concepts and procedures covered in the training</li>
            <li>I will apply this knowledge in my work environment</li>
            <li>I am aware of the complaint procedures and support available</li>
          </ul>
        </div>

        {/* Acknowledgement Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="readAcknowledgement"
            checked={data.readAcknowledgement}
            onChange={(e) => handleChange('readAcknowledgement', e.target.checked)}
            className="mt-1 w-5 h-5 accent-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <label htmlFor="readAcknowledgement" className="text-gray-700 cursor-pointer">
            I acknowledge that I have read and understood the Bullying & Harassment Training materials and agree to comply with the policies and procedures outlined.
          </label>
        </div>

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full border-b border-gray-400 px-2 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        {/* Signature Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Signature</label>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
            <SignatureCanvas
              ref={sigRef}
              existingSignature={data.signature}
              onSignatureEnd={(sig) => handleChange('signature', sig)}
              onSignatureClear={() => handleChange('signature', '')}
              width={400}
              height={150}
              className="bg-white w-full"
            />
          </div>
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="ackDate">Date</label>
          <input
            id="ackDate"
            title="Date"
            placeholder="YYYY-MM-DD"
            type="date"
            className="w-full border-b border-black/60 px-1 py-2"
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
      </div>

      {/* Footer - Only show if settings exist */}
      {(meta.website || meta.formId || meta.reviewDate) && (
        <div className="absolute bottom-6 left-[96px] right-[96px] text-[10pt] text-gray-600 flex items-center justify-between">
          {meta.website && <div>Website: {meta.website}</div>}
          {meta.formId && <div>{meta.formId}</div>}
          {meta.reviewDate && <div>Review Date: {meta.reviewDate}</div>}
        </div>
      )}
    </div>
  );
});

export default BullyingHarassmentTrainingAckForm;




