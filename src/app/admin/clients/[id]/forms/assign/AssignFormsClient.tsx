"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, getForms, assignFormBatchToClient } from '@/lib/api';
import { FaCheck, FaExclamationTriangle, FaLink, FaCopy } from 'react-icons/fa';

export default function AssignFormsClient({ clientId }: { clientId: string }) {
  const router = useRouter();
  
  const [client, setClient] = useState<any>(null);
  const [forms, setForms] = useState<any[]>([]);
  const [selectedForms, setSelectedForms] = useState<number[]>([]);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load client and forms data
        const [clientData, formsData] = await Promise.all([
          getClient(parseInt(clientId)),
          getForms()
        ]);
        
        setClient(clientData);
        setForms(formsData);
        
        // Set default expiry date to 30 minutes from now
        const defaultExpiry = new Date();
        defaultExpiry.setMinutes(defaultExpiry.getMinutes() + 30);
        
        // Format date as YYYY-MM-DD
        setExpiryDate(defaultExpiry.toISOString().split('T')[0]);
        
        // Format time as HH:MM
        const hours = defaultExpiry.getHours().toString().padStart(2, '0');
        const minutes = defaultExpiry.getMinutes().toString().padStart(2, '0');
        setExpiryTime(`${hours}:${minutes}`);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [clientId]);
  
  const handleFormSelection = (formId: number) => {
    setSelectedForms(prev => {
      if (prev.includes(formId)) {
        return prev.filter(id => id !== formId);
      } else {
        return [...prev, formId];
      }
    });
  };

 
  
  const handleAssignForms = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      if (selectedForms.length === 0) {
        setError("Please select at least one form to assign");
        return;
      }
      
      if (!expiryDate || !expiryTime) {
        setError("Please set an expiry date and time");
        return;
      }
      
      // Combine date and time
      const expiresAt = new Date(`${expiryDate}T${expiryTime}`);
      
      const result = await assignFormBatchToClient(parseInt(clientId), {
        formIds: selectedForms,
        expiresAt: expiresAt.toISOString()
      });
      
      setAssignmentResult(result);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to assign forms");
    } finally {
      setSubmitting(false);
    }
  };
  
  const copyToClipboard = (text: string, type: 'link' | 'passcode') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'link') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedPasscode(true);
        setTimeout(() => setCopiedPasscode(false), 2000);
      }
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (success && assignmentResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-2 mr-3">
                <FaCheck className="text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Forms Assigned Successfully</h1>
            </div>
          </div>
          
          <div className="p-6">
            <p className="mb-4">
              The following forms have been assigned to <strong>{client.name}</strong>:
            </p>
            
            <ul className="mb-6 list-disc pl-5">
              {selectedForms.map(formId => {
                const form = forms.find(f => f.id === formId);
                return (
                  <li key={formId} className="mb-1">
                    {form?.title}
                  </li>
                );
              })}
            </ul>
            
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2">Access Information</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Link
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={`${assignmentResult.accessLink}`}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(assignmentResult.accessLink, 'link')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                  >
                    {copied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passcode
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={assignmentResult.passcode}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(assignmentResult.passcode, 'passcode')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                  >
                    {copiedPasscode ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At
                </label>
                <input
                  type="text"
                  value={new Date(assignmentResult.batch.expiresAt).toLocaleString()}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => router.push(`/admin/clients/${clientId}/forms`)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
              >
                Back to Forms
              </button>
              
              <button
                onClick={() => setSuccess(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Assign More Forms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Assign Forms to {client?.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Select forms to assign to this client and set an expiry date.
          </p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date and Time
            </label>
            <div className="flex space-x-4 max-w-xs">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              The link will expire after this time.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Forms
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
              {forms.map(form => (
                <div key={form.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`form-${form.id}`}
                    checked={selectedForms.includes(form.id)}
                    onChange={() => handleFormSelection(form.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`form-${form.id}`} className="ml-2 block text-sm text-gray-900">
                    {form.title} (v{form.version})
                  </label>
                </div>
              ))}
              
              {forms.length === 0 && (
                <p className="text-gray-500 text-sm">No forms available.</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => router.push(`/admin/clients/${clientId}/forms`)}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            
            <button
              onClick={handleAssignForms}
              disabled={submitting || selectedForms.length === 0 || !expiryDate || !expiryTime}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <FaLink className="mr-2" /> Assign Forms
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
