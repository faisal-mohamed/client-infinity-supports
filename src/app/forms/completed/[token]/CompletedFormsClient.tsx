"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFormBatchByToken } from '@/lib/api';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function CompletedFormsClient({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const passcode = searchParams.get('passcode');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batchData, setBatchData] = useState<any>(null);

  useEffect(() => {
    if (!passcode) return; // Don't load data until passcode is available
    
    const loadBatchData = async () => {
      try {
        setLoading(true);
        
        // Load batch data with passcode if available
        const data = await getFormBatchByToken(token, passcode);
        setBatchData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };
    
    loadBatchData();
  }, [token, passcode]);
  
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
            <h1 className="text-xl font-bold text-gray-900">All Forms Completed</h1>
            <p className="mt-1 text-sm text-gray-500">
              Thank you for completing all your forms.
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-6">
                <FaCheck className="text-green-600 text-4xl" />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold mb-4 text-center">
              Thank you, {batchData?.client?.name}!
            </h2>
            
            <p className="text-center mb-6">
              You have successfully completed all your forms. We will review your submissions and contact you if needed.
               <br /> You can close this window now.
            </p>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Completed Forms:</h3>
              <ul className="space-y-2">
                {batchData?.forms?.map((form: any) => (
                  <li key={form.id} className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    <span>{form.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
