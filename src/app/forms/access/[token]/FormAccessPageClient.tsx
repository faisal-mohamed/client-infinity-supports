"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFormBatchByToken } from '@/lib/api';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';

export default function FormAccessPageClient({ token }: { token: string }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [batchInfo, setBatchInfo] = useState<any>(null);

  // Check if the form batch exists
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        // Just check if the batch exists, don't try to access it with a passcode yet
        const data = await getFormBatchByToken(token);
        setBatchInfo(data);
      } catch (err: any) {
        // If the error is "Passcode required", that's actually good - it means the batch exists
        if (err.message === 'Passcode required') {
          // This is expected, we'll prompt for the passcode
        } else {
          setError(err.message || 'Failed to access forms');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passcode.trim()) {
      setError('Please enter a passcode');
      return;
    }
    
    try {
      setChecking(true);
      setError('');
      
      // Try to access the batch with the provided passcode
      await getFormBatchByToken(token, passcode);
      
      // If successful, redirect to the common fields form with the passcode
      router.push(`/forms/common-fields/${token}?passcode=${encodeURIComponent(passcode)}`);
    } catch (err: any) {
      setError(err.message || 'Invalid passcode');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-100 p-3">
            <FaLock className="text-blue-600 text-3xl" />
          </div>
        </div>
        
        <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
          Protected Forms
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          These forms are protected. Please enter the passcode to access them.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-1">
              Passcode
            </label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter passcode"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={checking}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {checking ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Verifying...
              </span>
            ) : (
              'Access Forms'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
