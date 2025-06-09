"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaEye, FaDownload, FaShareAlt, FaTimes } from 'react-icons/fa';
import { getClient, getClientForms, getForms, assignFormToClient, generatePdfUrl } from '@/lib/api';

export default function ClientFormsPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [client, setClient] = useState(null);
  const [clientForms, setClientForms] = useState([]);
  const [availableForms, setAvailableForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFormIds, setSelectedFormIds] = useState([]);
  const [expiryDate, setExpiryDate] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [clientData, clientFormsData, availableFormsData] = await Promise.all([
          getClient(parseInt(id)),
          getClientForms(parseInt(id)),
          getForms()
        ]);
        
        setClient(clientData);
        setClientForms(clientFormsData);
        setAvailableForms(availableFormsData);
        
        // Set default expiry date to 30 days from now
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        setExpiryDate(thirtyDaysFromNow.toISOString().split('T')[0]);
        
        setError('');
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAssignForms = async () => {
    if (selectedFormIds.length === 0 || !expiryDate) return;
    
    try {
      setAssignLoading(true);
      
      // Assign each selected form
      const assignPromises = selectedFormIds.map(formId => 
        assignFormToClient(parseInt(id), {
          formId: parseInt(formId),
          expiresAt: new Date(expiryDate).toISOString()
        })
      );
      
      await Promise.all(assignPromises);
      
      // Refresh the client forms list
      const updatedForms = await getClientForms(parseInt(id));
      setClientForms(updatedForms);
      
      // Reset form state
      setShowAssignModal(false);
      setSelectedFormIds([]);
      setError('');
    } catch (err) {
      setError('Failed to assign forms: ' + err.message);
      console.error(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleFormCheckboxChange = (formId) => {
    setSelectedFormIds(prev => {
      if (prev.includes(formId)) {
        return prev.filter(id => id !== formId);
      } else {
        return [...prev, formId];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Client not found'}
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            href={`/admin/clients/${id}`}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">{client.name}'s Forms</h1>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Assign Forms
        </button>
      </div>

      {clientForms.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No forms have been assigned to this client yet.</p>
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Assign Forms
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientForms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{form.form.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      form.isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {form.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(form.assignedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(form.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      {form.isCompleted && (
                        <a 
                          href={generatePdfUrl({
                            formId: form.formId,
                            clientId: parseInt(id)
                          })}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900"
                          title="View PDF"
                        >
                          <FaEye />
                        </a>
                      )}
                      {form.isCompleted && (
                        <a 
                          href={generatePdfUrl({
                            formId: form.formId,
                            clientId: parseInt(id),
                            download: true
                          })}
                          className="text-green-600 hover:text-green-900"
                          title="Download PDF"
                        >
                          <FaDownload />
                        </a>
                      )}
                      {!form.isCompleted && (
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Share Form Link"
                          onClick={() => {
                            // Copy form link to clipboard
                            const formLink = `${window.location.origin}/forms/${form.accessToken}`;
                            navigator.clipboard.writeText(formLink);
                            alert('Form link copied to clipboard!');
                          }}
                        >
                          <FaShareAlt />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Form Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Assign Forms to {client.name}</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Forms to Assign
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto">
                {availableForms.map((form) => (
                  <div key={form.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`form-${form.id}`}
                      checked={selectedFormIds.includes(form.id.toString())}
                      onChange={() => handleFormCheckboxChange(form.id.toString())}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`form-${form.id}`} className="ml-2 block text-sm text-gray-900">
                      {form.title} <span className="text-xs text-gray-500">(v{form.version})</span>
                    </label>
                  </div>
                ))}
                
                {availableForms.length === 0 && (
                  <p className="text-gray-500 text-center py-2">No forms available</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignForms}
                disabled={selectedFormIds.length === 0 || !expiryDate || assignLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
              >
                {assignLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Assign Selected Forms
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
