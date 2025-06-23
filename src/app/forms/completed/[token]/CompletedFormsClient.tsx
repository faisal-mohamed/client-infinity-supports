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
    if (!passcode) return;
    const loadBatchData = async () => {
      try {
        setLoading(true);
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-red-100">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-4 shadow">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 text-center mb-6">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 overflow-hidden px-6 py-10 md:px-12 md:py-12 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-6 shadow-lg mb-2">
              <FaCheck className="text-white text-4xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center">All Forms Completed</h1>
            <p className="mt-1 text-base text-gray-500 text-center max-w-md">
              Thank you for completing all your forms.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            <h2 className="text-lg font-semibold text-center text-blue-700 mb-1">
              Thank you, {batchData?.client?.name}!
            </h2>
            <p className="text-center text-gray-600 mb-2">
              You have successfully completed all your forms. We will review your submissions and contact you if needed.<br />You can close this window now.
            </p>
          </div>

          <div className="w-full">
            <h3 className="text-md font-semibold mb-2 text-gray-800">Completed Forms</h3>
            <ul className="space-y-2">
              {batchData?.forms?.map((form: any) => (
                <li key={form.id} className="flex items-center bg-green-50 rounded-lg px-3 py-2">
                  <FaCheck className="text-green-500 mr-2" />
                  <span className="text-gray-800 font-medium">{form.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
