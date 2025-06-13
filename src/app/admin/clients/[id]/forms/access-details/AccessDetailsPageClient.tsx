"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, getClientFormAssignments } from '@/lib/api';
import { FaLink, FaKey, FaCopy, FaCheck, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

type FormAssignment = {
  id: number;
  clientId: number;
  formId: number;
  formVersion: number;
  assignedAt: string;
  expiresAt: string;
  accessToken: string;
  isCompleted: boolean;
  passcode: string | null;
  batchId: number | null;
  form: {
    id: number;
    title: string;
    version: number;
  };
  batch?: {
    id: number;
    batchToken: string;
    expiresAt: string;
  };
};

export default function AccessDetailsPageClient({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [assignments, setAssignments] = useState<FormAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLinks, setCopiedLinks] = useState<{[key: string]: boolean}>({});
  const [copiedPasscodes, setCopiedPasscodes] = useState<{[key: string]: boolean}>({});

  // Load data when component mounts
  useEffect(() => {
    const parsedClientId = parseInt(clientId);
    
    if (isNaN(parsedClientId)) {
      setError('Invalid client ID');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // Load client details
        const clientData = await getClient(parsedClientId);
        setClient(clientData);

        // Load form assignments
        const assignmentsData = await getClientFormAssignments(parsedClientId);
        setAssignments(assignmentsData);

        setError('');
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  const copyToClipboard = (text: string, type: 'link' | 'passcode', id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'link') {
        setCopiedLinks(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setCopiedLinks(prev => ({ ...prev, [id]: false })), 2000);
      } else {
        setCopiedPasscodes(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setCopiedPasscodes(prev => ({ ...prev, [id]: false })), 2000);
      }
    });
  };

  // Group assignments by batch
  const groupedAssignments = assignments.reduce((acc, assignment) => {
    if (assignment.batchId) {
      if (!acc.batches[assignment.batchId]) {
        acc.batches[assignment.batchId] = {
          batchId: assignment.batchId,
          batchToken: assignment.batch?.batchToken || '',
          expiresAt: assignment.batch?.expiresAt || assignment.expiresAt,
          passcode: assignment.passcode,
          forms: []
        };
      }
      acc.batches[assignment.batchId].forms.push(assignment);
    } else {
      acc.individual.push(assignment);
    }
    return acc;
  }, { batches: {} as Record<number, any>, individual: [] as FormAssignment[] });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? 
    `${window.location.protocol}//${window.location.host}` : 
    '';

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <FaKey className="text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Form Access Details</h1>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-1" /> Back
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Client Information</h2>
          <p className="text-gray-700">
            <span className="font-medium">Name:</span> {client?.name}
          </p>
          {client?.email && (
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {client.email}
            </p>
          )}
        </div>

        {/* Batched Forms */}
        {Object.values(groupedAssignments.batches).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Form Batches</h2>
            
            {Object.values(groupedAssignments.batches).map((batch: any) => (
              <div key={batch.batchId} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Batch #{batch.batchId}</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Link
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={`${baseUrl}/forms/access/${batch.batchToken}`}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(`${baseUrl}/forms/access/${batch.batchToken}`, 'link', `batch-${batch.batchId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
                      >
                        {copiedLinks[`batch-${batch.batchId}`] ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  
                  {batch.passcode && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passcode
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={batch.passcode}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(batch.passcode, 'passcode', `batch-${batch.batchId}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
                        >
                          {copiedPasscodes[`batch-${batch.batchId}`] ? <FaCheck /> : <FaCopy />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires At
                    </label>
                    <input
                      type="text"
                      value={new Date(batch.expiresAt).toLocaleString()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Forms in this batch:</h4>
                    <ul className="list-disc pl-5">
                      {batch.forms.map((assignment: FormAssignment) => (
                        <li key={assignment.id} className="mb-1">
                          {assignment.form.title} (v{assignment.form.version})
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            assignment.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Individual Forms */}
        {groupedAssignments.individual.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Individual Form Assignments</h2>
            
            {groupedAssignments.individual.map((assignment : any) => (
              <div key={assignment.id} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">{assignment.form.title} (v{assignment.form.version})</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Access Link
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={`${baseUrl}/forms/access/${assignment.accessToken}`}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(`${baseUrl}/forms/access/${assignment.accessToken}`, 'link', `form-${assignment.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
                      >
                        {copiedLinks[`form-${assignment.id}`] ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  
                  {assignment.passcode && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passcode
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={assignment.passcode}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(assignment.passcode, 'passcode', `form-${assignment.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
                        >
                          {copiedPasscodes[`form-${assignment.id}`] ? <FaCheck /> : <FaCopy />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                      assignment.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.isCompleted ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expires At
                    </label>
                    <input
                      type="text"
                      value={new Date(assignment.expiresAt).toLocaleString()}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {assignments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No form assignments found for this client.
          </div>
        )}
      </div>
    </div>
  );
}
