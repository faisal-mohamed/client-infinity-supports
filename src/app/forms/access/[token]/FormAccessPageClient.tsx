"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFormBatchByToken } from '@/lib/api';
import { FaLock, FaExclamationTriangle, FaCheck, FaArrowRight } from 'react-icons/fa';

export default function FormAccessPageClient({ token }: { token: string }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [batchData, setBatchData] = useState<any>(null);
  const [needsPasscode, setNeedsPasscode] = useState(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        
        // Try to access without passcode first
        const data = await getFormBatchByToken(token);
        setBatchData(data);
        setNeedsPasscode(false);
      } catch (err: any) {
        console.error(err);
        
        // Check if passcode is required
        if (err.message === "Passcode required") {
          setNeedsPasscode(true);
        } else if (err.message === "Access link has expired") {
          setError("This link has expired. Please contact the administrator.");
        } else {
          setError(err.message || "Failed to access forms");
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [token]);
  
  const handleVerifyPasscode = async () => {
    try {
      setVerifying(true);
      setError('');
      
      const data = await getFormBatchByToken(token, passcode);
      setBatchData(data);
      setNeedsPasscode(false);
    } catch (err: any) {
      setError(err.message || "Invalid passcode");
    } finally {
      setVerifying(false);
    }
  };
  
  const startFormFlow = () => {
    // Check if common fields need to be completed first
    const commonFieldsCompleted = batchData.forms.some(
      (form: any) => form.isCommonFieldsCompleted
    );
    
    if (!commonFieldsCompleted) {
      // Redirect to common fields form with passcode
      router.push(`/forms/common-fields/${token}?passcode=${passcode}`);
    } else {
      // Redirect to the first incomplete form
      const nextForm = batchData.forms.find((form: any) => !form.isCompleted);
      if (nextForm) {
        router.push(`/forms/view-form/${nextForm.accessToken}`);
      } else {
        // All forms are completed
        router.push(`/forms/completed/${token}?passcode=${passcode}`);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error && error.includes("expired")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 text-center mb-6">
            {error}
          </p>
        </div>
      </div>
    );
  }
  
  if (needsPasscode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <FaLock className="text-blue-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">Enter Passcode</h1>
          <p className="text-gray-600 text-center mb-6">
            Please enter the 6-digit passcode provided to you to access your forms.
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <input
              type="text"
              maxLength={6}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit passcode"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleVerifyPasscode}
            disabled={passcode.length !== 6 || verifying}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }
  
  if (batchData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Welcome, {batchData.client.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                You have {batchData.forms.length} forms to complete.
              </p>
            </div>
            
            <div className="p-6">
              <p className="mb-4">
                These forms will help us provide you with the best possible service. Please complete all forms by{' '}
                {new Date(batchData.expiresAt).toLocaleDateString()}.
              </p>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Forms to complete:</h2>
                <ul className="space-y-2">
                  {batchData.forms.map((form: any) => (
                    <li key={form.id} className="flex items-center">
                      {form.isCompleted ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded-full mr-2"></div>
                      )}
                      <span>{form.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={startFormFlow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
              >
                Start Forms <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
