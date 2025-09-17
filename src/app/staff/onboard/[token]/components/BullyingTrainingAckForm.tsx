"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import FormPage from '@/components/ui/FormPage';
import { useToast } from '@/components/ui/Toast';

export interface BullyingTrainingAckFormRef {
  save: (isSubmit: boolean) => Promise<boolean>;
}

interface BullyingTrainingAckFormProps {
  token: string;
  staff?: { firstName: string; surname: string };
  onSubmitted?: () => void;
}

const BullyingTrainingAckForm = forwardRef<BullyingTrainingAckFormRef, BullyingTrainingAckFormProps>(
  ({ token, staff, onSubmitted }, ref) => {
    const { showToast } = useToast();
    const [staffName, setStaffName] = useState('');
    const [staffSignature, setStaffSignature] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [managerName, setManagerName] = useState('');
    const [managerSignature, setManagerSignature] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setStaffSignature(formData.staffSignature || '');
            setDate(formData.date || new Date().toISOString().split('T')[0]);
            setManagerName(formData.managerName || '');
            setManagerSignature(formData.managerSignature || '');
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
          staffName: staffName.trim(),
          staffSignature,
          date,
          managerName: managerName.trim(),
          managerSignature,
          staffSignedAt: new Date().toISOString(),
        };

        const res = await fetch(`/api/staff/onboard/${token}`, {
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

    if (loading) {
      return (
        <FormPage title="Bullying Training Acknowledgment" meta={{ website: 'infinitysupportswa.org', version: 'BT001', reviewDate: new Date().toISOString().slice(0,10) }}>
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
      <FormPage title="Bullying Training Acknowledgment" meta={{ website: 'infinitysupportswa.org', version: 'BT001', reviewDate: new Date().toISOString().slice(0,10) }}>
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-gray-700 text-sm">
              I acknowledge that I completed <strong className="text-red-600">Bullying training</strong> conducted by Infinity Supports WA.
            </p>
            <p className="text-gray-700 text-sm mt-2">
              I also acknowledge that I have received training/study materials for the above-mentioned training.
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

          {/* Manager Name - Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager's Name <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter manager's name (optional)"
            />
          </div>

          {/* Manager Signature - Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager's Signature <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="border border-gray-300 rounded-md p-2 bg-white">
              <SignatureCanvas
                onSignatureEnd={setManagerSignature}
                existingSignature={managerSignature}
                height={120}
              />
            </div>
          </div>
        </div>

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
