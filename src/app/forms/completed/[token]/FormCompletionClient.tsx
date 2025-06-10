"use client";

import { useState, useEffect } from 'react';
import { getFormBatchByToken } from '@/lib/api';
import { FaCheck, FaExclamationTriangle, FaFilePdf } from 'react-icons/fa';

export default function FormCompletionClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batchData, setBatchData] = useState<any>(null);
  
  useEffect(() => {
    const loadBatchData = async () => {
      try {
        setLoading(true);
        
        // Get passcode from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const passcode = urlParams.get('passcode');
        
        // Load batch data with passcode if available
        const data = await getFormBatchByToken(token, passcode || undefined);
        setBatchData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };
    
    loadBatchData();
  }, [token]);
  
  const generatePdf = (formId: number, clientId: number) => {
    // Open PDF in new tab
    window.open(`/api/generate-pdf?formId=${formId}&clientId=${clientId}`, '_blank');
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
  
  if (batchData) {
    const allFormsCompleted = batchData.forms.every((form: any) => form.isCompleted);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">
                {allFormsCompleted ? 'All Forms Completed' : 'Form Status'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {allFormsCompleted 
                  ? 'Thank you for completing all your forms.' 
                  : 'You still have some forms to complete.'}
              </p>
            </div>
            
            <div className="p-6">
              {allFormsCompleted && (
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-100 p-4">
                    <FaCheck className="text-green-600 text-4xl" />
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Form Status:</h2>
                <ul className="space-y-4">
                  {batchData.forms.map((form: any) => (
                    <li key={form.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        {form.isCompleted ? (
                          <div className="rounded-full bg-green-100 p-2 mr-3">
                            <FaCheck className="text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                            <span className="text-gray-500">{form.displayOrder + 1}</span>
                          </div>
                        )}
                        <span className="font-medium">{form.title}</span>
                      </div>
                      
                      <div>
                        {form.isCompleted ? (
                          <button
                            onClick={() => generatePdf(form.formId, batchData.client.id)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FaFilePdf className="mr-1" /> View PDF
                          </button>
                        ) : (
                          <a
                            href={`/forms/view-form/${form.accessToken}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Complete Form
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {!allFormsCompleted && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <p className="text-blue-800">
                    Please complete all forms to finalize your submission.
                  </p>
                </div>
              )}
              
              {allFormsCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800">
                    Thank you for completing all your forms. Your information has been submitted successfully.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
