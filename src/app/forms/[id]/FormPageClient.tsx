"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientFormSubmission, saveClientFormSubmission } from '@/lib/api';
import { FaCheck, FaExclamationTriangle, FaSave } from 'react-icons/fa';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';

export default function FormPageClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const formAssignmentId = parseInt(params.id);

  
  
  const [formData, setFormData] = useState<any>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        
        // Load form assignment data
        const data = await getClientFormSubmission(0, formAssignmentId);
        setFormData(data);
        
        // Check if form is expired
        const now = new Date();
        const expiryDate = new Date(data.expiresAt);
        setIsExpired(expiryDate < now);
        
        // Check if form is already submitted
        setIsSubmitted(data.isSubmitted);
        
        // Set initial form values
        if (data.data) {
          setFormValues(data.data);
        }
        
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load form');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadFormData();
  }, [formAssignmentId]);
  
  const handleSave = async (submit: boolean = false) => {
    try {
      if (submit) {
        setSubmitting(true);
      } else {
        setSaving(true);
      }
      
      setError('');
      setSuccess('');
      
      await saveClientFormSubmission(formData.clientId, formAssignmentId, {
        data: formValues,
        isSubmitted: submit
      });
      
      if (submit) {
        setIsSubmitted(true);
        setSuccess('Form submitted successfully!');
      } else {
        setSuccess('Progress saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save form');
      console.error(err);
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">Form Expired</h1>
          <p className="text-gray-600 text-center mb-6">
            This form has expired and is no longer available for submission.
          </p>
          <p className="text-gray-600 text-center">
            Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <FaCheck className="text-green-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">Form Submitted</h1>
          <p className="text-gray-600 text-center mb-6">
            Thank you! Your form has been successfully submitted.
          </p>
          <p className="text-gray-600 text-center">
            You can close this page now.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">{formData?.form?.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Please complete the form below. Your progress will be saved automatically.
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            <div className="mb-6">
              <JsonForms
                schema={formData?.form?.schema}
                uischema={formData?.form?.uiSchema || undefined}
                data={formValues}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data }) => setFormValues(data)}
              />
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => handleSave(false)}
                disabled={saving || submitting}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Progress
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleSave(true)}
                disabled={saving || submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> Submit Form
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
