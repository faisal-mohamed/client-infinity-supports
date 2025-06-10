"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFormBatchByToken, updateCommonFields } from '@/lib/api';
import { FaExclamationTriangle, FaSave, FaArrowRight } from 'react-icons/fa';

export default function CommonFieldsFormClient({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passcode = searchParams.get('passcode');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [batchData, setBatchData] = useState<any>(null);
  const [formValues, setFormValues] = useState<any>({});
  
  useEffect(() => {
    const loadBatchData = async () => {
      try {
        setLoading(true);
        
        // Load batch data with passcode if available
        const data = await getFormBatchByToken(token, passcode || undefined);
        setBatchData(data);
        
        // Pre-fill form values from existing common fields if available
        if (data.client.commonFields && data.client.commonFields.length > 0) {
          setFormValues(data.client.commonFields[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };
    
    loadBatchData();
  }, [token, passcode]);
  
  const handleSaveCommonFields = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Validate required fields
      if (!formValues.name) {
        setError("Name is required");
        return;
      }
      
      // Save common fields with passcode
      await updateCommonFields(token, formValues, passcode || undefined);
      
      // Redirect to the first form
      if (batchData.forms.length > 0) {
        router.push(`/forms/view-form/${batchData.forms[0].accessToken}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save common fields");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 text-center mb-6">
            {error}
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
            <h1 className="text-xl font-bold text-gray-900">Personal Information</h1>
            <p className="mt-1 text-sm text-gray-500">
              Please provide your personal information. This will be used across all forms.
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.name || ''}
                  onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formValues.email || ''}
                  onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formValues.dob || ''}
                  onChange={(e) => setFormValues({...formValues, dob: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={formValues.age || ''}
                  onChange={(e) => setFormValues({...formValues, age: parseInt(e.target.value) || ''})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex
                </label>
                <select
                  value={formValues.sex || ''}
                  onChange={(e) => setFormValues({...formValues, sex: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NDIS Number
                </label>
                <input
                  type="text"
                  value={formValues.ndis || ''}
                  onChange={(e) => setFormValues({...formValues, ndis: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formValues.street || ''}
                  onChange={(e) => setFormValues({...formValues, street: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={formValues.state || ''}
                  onChange={(e) => setFormValues({...formValues, state: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="WA">Western Australia</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NT">Northern Territory</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formValues.postCode || ''}
                  onChange={(e) => setFormValues({...formValues, postCode: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disability/Conditions
                </label>
                <textarea
                  value={formValues.disability || ''}
                  onChange={(e) => setFormValues({...formValues, disability: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSaveCommonFields}
                disabled={saving || !formValues.name}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Continue <FaArrowRight className="ml-2" />
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
