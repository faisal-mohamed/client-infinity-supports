"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, getClientFormAssignments } from '@/lib/api';
import { FaLink, FaKey, FaCopy, FaCheck, FaArrowLeft, FaExclamationTriangle, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';

type FormAssignment = {
  id: string | number;
  clientId: string | number;
  formId: string | number;
  formVersion: number;
  assignedAt: string;
  expiresAt: string;
  accessToken: string;
  isCompleted: boolean;
  passcode: string | null;
  batchId: string | number | null;
  form: {
    id: string | number;
    title: string;
    version: number;
  };
  batch?: {
    id: string | number;
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
  const { showToast } = useToast ? useToast() : { showToast: () => {} };
  const [editingBatchId, setEditingBatchId] = useState<number | null>(null);
  const [newExpiry, setNewExpiry] = useState<{ date: string; time: string }>({ date: '', time: '' });
  const [updating, setUpdating] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  // Load data when component mounts
  useEffect(() => {
    const parsedClientId = clientId;
    
    if (!parsedClientId) {
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

  // PATCH expiry update handler
  const handleUpdateExpiry = async (batchId: string | number) => {
    if (!newExpiry.date || !newExpiry.time) return;
    // Combine date and time in UTC
    const selectedExpiry = new Date(`${newExpiry.date}T${newExpiry.time}:00Z`);
    const now = new Date();
    if (selectedExpiry <= now) {
      showToast && showToast({ type: 'error', title: 'Invalid Date', message: 'Expiry must be in the future.' });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/form-batches/${batchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresAt: selectedExpiry.toISOString() })
      });
      if (!res.ok) throw new Error('Failed to update expiry');
      showToast && showToast({ type: 'success', title: 'Expiry Updated', message: 'Batch expiry updated successfully.' });
      setEditingBatchId(null);
      setNewExpiry({ date: '', time: '' });
      const assignmentsData = await getClientFormAssignments(clientId);
      setAssignments(assignmentsData);
    } catch (err: any) {
      showToast && showToast({ type: 'error', title: 'Error', message: err.message || 'Failed to update expiry' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-2 border-azure-700 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="rounded-2xl shadow-soft bg-white">
      <div className="bg-azure-50/50 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-2 sm:px-6 md:px-10 py-6 border-b border-azure-100 rounded-t-2xl">
        <div className="flex items-center">
          <div className="rounded-full bg-azure-100 p-3 shadow-md mr-3">
            <FaKey className="text-azure-600" />
          </div>
          <h1 className="text-xl font-bold text-azure-700">Form Access Details</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center text-azure-500 hover:text-azure-700"
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Participant Information</h2>
          <p className="text-azure-600">
            <span className="font-medium">Name:</span> {client?.name}
          </p>
          {client?.email && (
            <p className="text-azure-600">
              <span className="font-medium">Email:</span> {client.email}
            </p>
          )}
        </div>

        {/* Batched Forms */}
        {Object.values(groupedAssignments.batches).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Form Batches</h2>
            
            {Object.values(groupedAssignments.batches).map((batch: any) => (
              <div key={batch.batchId} className="rounded-2xl shadow-soft border-l-4 border-azure-300 transition-all duration-200 mb-8 bg-white">
                <div className="bg-azure-50 px-4 py-3 border-b border-azure-100">
                  <h3 className="font-medium">Batch #{batch.batchId}</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-azure-600 mb-1">
                      Access Link
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={`${baseUrl}/forms/access/${batch.batchToken}`}
                        readOnly
                        className="flex-1 px-3 py-2 border border-azure-200 rounded-l-md bg-azure-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(`${baseUrl}/forms/access/${batch.batchToken}`, 'link', `batch-${batch.batchId}`)}
                        className="bg-azure-600 hover:bg-azure-700 text-white px-3 py-2 rounded-r-md"
                      >
                        {copiedLinks[`batch-${batch.batchId}`] ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  
                  {batch.passcode && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-azure-600 mb-1">
                        Passcode
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={batch.passcode}
                          readOnly
                          className="flex-1 px-3 py-2 border border-azure-200 rounded-l-md bg-azure-50 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(batch.passcode, 'passcode', `batch-${batch.batchId}`)}
                          className="bg-azure-600 hover:bg-azure-700 text-white px-3 py-2 rounded-r-md"
                        >
                          {copiedPasscodes[`batch-${batch.batchId}`] ? <FaCheck /> : <FaCopy />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-azure-600 mb-1 flex items-center gap-2">
                      Expires At
                      <button onClick={() => {
                        setEditingBatchId(batch.batchId);
                        const d = new Date(batch.expiresAt);
                        setNewExpiry({ date: d.toISOString().slice(0,10), time: d.toTimeString().slice(0,5) });
                      }} className="ml-2 text-azure-600 hover:text-azure-700" title="Edit Expiry"><FaEdit /></button>
                    </label>
                    {editingBatchId === batch.batchId ? (
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <input type="date" value={newExpiry.date} min={today} onChange={e => setNewExpiry(v => ({ ...v, date: e.target.value }))} className="border rounded px-2 py-1" />
                        <input type="time" value={newExpiry.time} onChange={e => setNewExpiry(v => ({ ...v, time: e.target.value }))} className="border rounded px-2 py-1" />
                        <button onClick={() => handleUpdateExpiry(batch.batchId)} disabled={updating} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded flex items-center">{updating ? <span className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2'></span> : <FaSave className="mr-1" />}Save</button>
                        <button onClick={() => setEditingBatchId(null)} className="bg-azure-200 hover:bg-azure-200 text-azure-600 px-3 py-1 rounded flex items-center"><FaTimes className="mr-1" />Cancel</button>
                      </div>
                    ) : (
                      <input type="text" value={new Date(batch.expiresAt).toLocaleString()} readOnly className="w-full px-3 py-2 border border-azure-200 rounded-md bg-azure-50 text-sm" />
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Forms in this batch:</h4>
                    <ul className="list-disc pl-5">
                      {batch.forms.map((assignment: FormAssignment) => (
                        <li key={assignment.id} className="mb-1">
                          {assignment.form.title} (v{assignment.form.version})
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            assignment.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-gold-100 text-gold-800'
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
              <div key={assignment.id} className="rounded-2xl shadow-soft border-l-4 border-azure-300 transition-all duration-200 mb-8 bg-white">
                <div className="bg-azure-50 px-4 py-3 border-b border-azure-100">
                  <h3 className="font-medium">{assignment.form.title} (v{assignment.form.version})</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-azure-600 mb-1">
                      Access Link
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={`${baseUrl}/forms/access/${assignment.accessToken}`}
                        readOnly
                        className="flex-1 px-3 py-2 border border-azure-200 rounded-l-md bg-azure-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(`${baseUrl}/forms/access/${assignment.accessToken}`, 'link', `form-${assignment.id}`)}
                        className="bg-azure-600 hover:bg-azure-700 text-white px-3 py-2 rounded-r-md"
                      >
                        {copiedLinks[`form-${assignment.id}`] ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  
                  {assignment.passcode && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-azure-600 mb-1">
                        Passcode
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={assignment.passcode}
                          readOnly
                          className="flex-1 px-3 py-2 border border-azure-200 rounded-l-md bg-azure-50 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(assignment.passcode, 'passcode', `form-${assignment.id}`)}
                          className="bg-azure-600 hover:bg-azure-700 text-white px-3 py-2 rounded-r-md"
                        >
                          {copiedPasscodes[`form-${assignment.id}`] ? <FaCheck /> : <FaCopy />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-azure-600 mb-1">
                      Status
                    </label>
                    <div className={`inline-block rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-xs font-semibold shadow`}>
                      {assignment.isCompleted ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-azure-600 mb-1">
                      Expires At
                    </label>
                    <input
                      type="text"
                      value={new Date(assignment.expiresAt).toLocaleString()}
                      readOnly
                      className="w-full px-3 py-2 border border-azure-200 rounded-md bg-azure-50 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {assignments.length === 0 && (
          <div className="text-center py-8 text-azure-400">
            No form assignments found for this client.
          </div>
        )}
      </div>
    </div>
  );
}
