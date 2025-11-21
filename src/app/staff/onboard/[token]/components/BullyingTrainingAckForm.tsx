"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import FormPage from '@/components/ui/FormPage';
import { useToast } from '@/components/ui/Toast';
import { fetchFormSpecificSettings } from '@/lib/settings';

export interface BullyingTrainingAckFormRef {
  save: (isSubmit: boolean) => Promise<boolean>;
}

interface BullyingTrainingAckFormProps {
  token: string;
  staff?: { firstName: string; surname: string };
  onSubmitted?: () => void;
}

const BullyingTrainingAckForm = forwardRef<BullyingTrainingAckFormRef, BullyingTrainingAckFormProps & { isSignatureLink?: boolean }>(
  ({ token, staff, onSubmitted, isSignatureLink = false }, ref) => {
    const { showToast } = useToast();
    const [acknowledgerName, setAcknowledgerName] = useState('');
    const [hrFocusDate, setHrFocusDate] = useState('');
    const [staffName, setStaffName] = useState('');
    const [staffSignature, setStaffSignature] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [managerInfo, setManagerInfo] = useState({
      name: '',
      signature: '',
      signedAt: '',
    });
    const [meta, setMeta] = useState<{ website: string | null; formId: string | null; reviewDate: string | null }>({
      website: null,
      formId: null,
      reviewDate: null,
    });

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
              } else if (group && typeof group === 'object') {
                const values = Object.values(group);
                const s: any = values.find((it: any) => it && it.key === key);
                if (s) return s.value || s.defaultValue || null;
              }
            }
            return null;
          };

          setMeta({
            website: getSettingValue('company_website') || getSettingValue('website') || null,
            formId: getSettingValue('bullying_training_form_id') || null,
            reviewDate: getSettingValue('bullying_training_review_date') || null,
          });
        } catch (error) {
          console.warn('Failed to load bullying training settings', error);
        }
      })();
    }, []);

    // Load existing data
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/staff/onboard/${token}`);
          const responseData = await res.json();
          
          if (!res.ok) {
            // Handle API errors with user-friendly messages
            const errorMessage = responseData.message || 'Failed to load form data';
            showToast({
              type: 'error',
              title: 'Error Loading Form',
              message: errorMessage,
              duration: 5000
            });
            return;
          }
          
          // Set staff name from database
          if (staff?.firstName && staff?.surname) {
            setStaffName(`${staff.firstName} ${staff.surname}`);
          }
          
          if (responseData.submissions?.bullying_training) {
            const formData = responseData.submissions.bullying_training;
            setAcknowledgerName(formData.acknowledgerName || '');
            setHrFocusDate(formData.hrFocusDate || '');
            setStaffSignature(formData.staffSignature || '');
            setDate(formData.date || new Date().toISOString().split('T')[0]);
            setManagerInfo({
              name: formData.managerName || '',
              signature: formData.managerSignature || '',
              signedAt: formData.managerSignedAt
                ? formData.managerSignedAt.split('T')[0]
                : formData.managerSignedAt || '',
            });
          }
          
          showToast({
            type: 'success',
            title: 'Form Loaded',
            message: 'Your form data has been loaded successfully',
            duration: 3000
          });
          
        } catch (error) {
          console.error('Error loading form data:', error);
          showToast({
            type: 'error',
            title: 'Connection Error',
            message: 'Unable to load form data. Please check your internet connection and try again.',
            duration: 5000
          });
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [token, staff, showToast]);

    const validateForm = () => {
      if (!acknowledgerName.trim()) {
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Your name is required',
          duration: 4000
        });
        return false;
      }
      if (!staffName.trim()) {
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Staff Name is required',
          duration: 4000
        });
        return false;
      }
      if (!staffSignature) {
        showToast({
          type: 'error',
          title: 'Validation Error',
          message: 'Staff Signature is required',
          duration: 4000
        });
        return false;
      }
      return true;
    };

    const save = async (isSubmit: boolean): Promise<boolean> => {
      if (isSubmit && !validateForm()) {
        return false;
      }

      setSaving(true);
      try {
        const formData = {
          acknowledgerName: acknowledgerName.trim(),
          hrFocusDate: hrFocusDate.trim(),
          staffName: staffName.trim(),
          staffSignature,
          date,
          staffSignedAt: new Date().toISOString(),
        };

        const apiEndpoint = isSignatureLink
          ? `/api/staff/signature/${token}/forms/bullying_training`
          : `/api/staff/onboard/${token}`;
        
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            formKey: 'bullying_training', 
            data: formData, 
            submit: isSubmit 
          }),
        });

        const result = await res.json();
        
        if (!res.ok) {
          // Handle API errors with user-friendly messages
          const errorMessage = result.message || result.error || 'Failed to save form';
          showToast({
            type: 'error',
            title: 'Save Failed',
            message: errorMessage,
            duration: 5000
          });
          return false;
        }

        // Show success message
        const action = isSubmit ? 'submitted' : 'saved';
        showToast({
          type: 'success',
          title: 'Form Saved',
          message: `Your form has been ${action} successfully`,
          duration: 4000
        });

        if (isSubmit && onSubmitted) {
          onSubmitted();
        }
        return true;
      } catch (error: any) {
        console.error('Error saving:', error);
        showToast({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to save your form. Please check your internet connection and try again.',
          duration: 5000
        });
        return false;
      } finally {
        setSaving(false);
      }
    };

    useImperativeHandle(ref, () => ({
      save,
    }));

    const footerMeta = {
      website: meta.website || undefined,
      version: meta.formId || undefined,
      reviewDate: meta.reviewDate || undefined,
    };

    if (loading) {
      return (
        <FormPage title="Bullying Training Acknowledgment" meta={footerMeta}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your form data...</p>
            </div>
          </div>
        </FormPage>
      );
    }

    return (
      <FormPage title="Bullying Training Acknowledgment" meta={footerMeta}>
        <div className="space-y-6">
          {/* Acknowledgment Statement */}
          <div className="text-center mb-6">
            <p className="text-gray-700 text-base leading-relaxed">
              I{' '}
              <input
                type="text"
                value={acknowledgerName}
                onChange={(e) => setAcknowledgerName(e.target.value)}
                placeholder="_________________"
                className="inline-block align-middle border-b-2 border-gray-400 px-3 mx-2 min-w-[260px] sm:min-w-[320px] text-center focus:outline-none focus:border-blue-500"
                required
              />
              {' '}acknowledge that I completed <strong className="text-red-600">Bullying and harassment training</strong> conducted by Infinity Supports WA and HR Focus on{' '}
              <input
                type="text"
                value={hrFocusDate}
                onChange={(e) => setHrFocusDate(e.target.value)}
                placeholder="__________"
                className="inline-block align-middle border-b-2 border-gray-400 px-3 mx-2 min-w-[200px] text-center focus:outline-none focus:border-blue-500"
              />
              . I also acknowledge that I have received training/study materials for the above-mentioned training.
            </p>
          </div>

          <div className="space-y-4">
          {/* Staff Name - Auto-populated from database */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={staffName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              placeholder="Loading staff name..."
              readOnly
            />
          </div>

          {/* Staff Signature - Mandatory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Signature <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-md p-2 bg-white">
              <SignatureCanvas
                onSignatureEnd={setStaffSignature}
                existingSignature={staffSignature}
                height={120}
              />
            </div>
            {!staffSignature && (
              <p className="text-red-500 text-xs mt-1">Staff signature is required</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-4 border border-yellow-300 rounded-md bg-yellow-50 text-sm text-yellow-800">
            Manager acknowledgement is completed by administration after you submit this form.
          </div>
        </div>

          <fieldset className="p-4 border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-lg space-y-3">
            <legend className="px-2 text-xs font-semibold uppercase text-yellow-600 tracking-wider">
              Office Use Only
            </legend>
            <p className="text-sm text-yellow-800">
              Manager acknowledgement is completed by administration after you submit this form.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Manager&apos;s Name</label>
                <input
                  type="text"
                  value={managerInfo.name}
                  readOnly
                  placeholder="Completed by administration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Manager Signed Date</label>
                <input
                  type="text"
                  value={managerInfo.signedAt}
                  readOnly
                  placeholder="Completed by administration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-1">Manager Signature</label>
                <div className="w-full min-h-[90px] border border-gray-300 rounded-md bg-gray-100 flex items-center justify-center">
                  {managerInfo.signature ? (
                    <img src={managerInfo.signature} alt="Manager Signature" className="max-h-16 object-contain" />
                  ) : (
                    <span className="text-gray-500 text-sm text-center px-4">
                      Signature will appear once administration completes this section.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {saving && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Saving...</p>
            </div>
          )}
        </div>
      </FormPage>
    );
  }
);

BullyingTrainingAckForm.displayName = 'BullyingTrainingAckForm';

export default BullyingTrainingAckForm;
