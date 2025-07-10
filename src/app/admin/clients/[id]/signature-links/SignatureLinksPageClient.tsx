"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, FaLink, FaCopy, FaEye, FaCalendarAlt, FaCheck, 
  FaClock, FaExclamationTriangle, FaPlus, FaTrash, FaEdit, 
  FaSave, FaTimes, FaUser, FaFileAlt, FaCheckCircle 
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/Confirm';

// Types
interface SignatureBatch {
  id: number;
  batchToken: string;
  expiresAt: string;
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
  signatureForms: {
    id: number;
    formSubmission: {
      id: number;
      clientSignature?: string;
      clientSignedAt?: string;
      form: {
        title: string;
        formKey: string;
      };
    };
  }[];
}

interface ClientInfo {
  id: number;
  name: string;
  email: string;
}

export default function SignatureLinksPageClient() {
  const params = useParams();
  const { showToast } = useToast();
  const confirm  : any = useConfirm();
  
  const clientId = parseInt(params.id as string);
  
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [signatureBatches, setSignatureBatches] = useState<SignatureBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpiry, setEditingExpiry] = useState<number | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState<string>('');

  useEffect(() => {
    loadSignatureLinks();
  }, [clientId]);

  const loadSignatureLinks = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/clients/${clientId}/signature-links`);
      if (!response.ok) throw new Error('Failed to load signature links');
      
      const data = await response.json();
      setClient(data.client);
      setSignatureBatches(data.signatureBatches);
      
    } catch (error) {
      console.error('Error loading signature links:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load signature links',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLinkToClipboard = async (token: string) => {
    const link = `${window.location.origin}/forms/signature/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy link to clipboard',
        duration: 3000,
      });
    }
  };

  const deleteBatch = async (batchId: number) => {

    const confirmed = await confirm({
      title: 'Delete Signature Link',
      message: 'Are you sure you want to delete this signature link? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/signature-batches/${batchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete signature link');

      showToast({
        type: 'success',
        title: 'Link Deleted',
        message: 'Signature link has been deleted',
        duration: 3000,
      });

      loadSignatureLinks();
    } catch (error) {
      console.error('Error deleting signature link:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete signature link',
        duration: 3000,
      });
    }
  };

  const startEditingExpiry = (batchId: number, currentExpiry: string) => {
    setEditingExpiry(batchId);
    const date = new Date(currentExpiry);
    
    // 🎯 FIX: Convert to local timezone for datetime-local input
    // Subtract timezone offset to get local time
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().slice(0, 16);
    
    console.log('🎯 Expiry Edit Debug:', {
      originalExpiry: currentExpiry,
      parsedDate: date.toISOString(),
      localDate: localDate.toISOString(),
      formattedForInput: formattedDate,
      timezoneOffset: date.getTimezoneOffset()
    });
    
    setNewExpiryDate(formattedDate);
  };

  const cancelEditingExpiry = () => {
    setEditingExpiry(null);
    setNewExpiryDate('');
  };

  const updateExpiry = async (batchId: number) => {
    if (!newExpiryDate) {
      showToast({
        type: 'error',
        title: 'Invalid Date',
        message: 'Please select a valid expiry date',
        duration: 3000,
      });
      return;
    }

    try {
      // 🎯 FIX: Handle datetime-local input properly
      // The input gives us local time, we need to convert it properly
      const localDateTime = new Date(newExpiryDate);
      
      console.log('🎯 Update Expiry Debug:', {
        inputValue: newExpiryDate,
        localDateTime: localDateTime.toISOString(),
        localDateTimeString: localDateTime.toString(),
        timezoneOffset: localDateTime.getTimezoneOffset()
      });

      const response = await fetch(`/api/signature-batches/${batchId}/update-expiry`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          expiresAt: localDateTime.toISOString() // This should now be correct
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update expiry');
      }

      const result = await response.json();
      console.log('🎯 Update result:', result);

      showToast({
        type: 'success',
        title: 'Expiry Updated',
        message: 'Link expiry date has been updated successfully',
        duration: 3000,
      });

      setEditingExpiry(null);
      setNewExpiryDate('');
      loadSignatureLinks();
    } catch (error: any) {
      console.error('Error updating expiry:', error);
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update expiry date',
        duration: 3000,
      });
    }
  };

  const getBatchStatus = (batch: SignatureBatch) => {
    const now = new Date();
    const expiresAt = new Date(batch.expiresAt);
    const isExpired = expiresAt < now;
    
    const totalForms = batch.signatureForms.length;
    const signedForms = batch.signatureForms.filter(sf => sf.formSubmission.clientSignature).length;
    const isCompleted = signedForms === totalForms && totalForms > 0;

    if (isExpired) {
      return {
        status: 'Expired',
        color: 'text-red-600 bg-red-100',
        icon: FaExclamationTriangle,
      };
    } else if (isCompleted) {
      return {
        status: 'Completed',
        color: 'text-green-600 bg-green-100',
        icon: FaCheck,
      };
    } else {
      return {
        status: 'Pending',
        color: 'text-amber-600 bg-amber-100',
        icon: FaClock,
      };
    }
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link 
              href={`/admin/clients/${clientId}/forms`}
              className="mr-4 p-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Signature Links
              </h1>
              <div className="flex items-center text-gray-600">
                <FaUser className="h-4 w-4 mr-2" />
                <span className="font-medium">{client?.name}</span>
                <span className="mx-2">•</span>
                <span>{client?.email}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <FaLink className="h-4 w-4 mr-2" />
                <span>{signatureBatches.length} signature link{signatureBatches.length !== 1 ? 's' : ''} generated</span>
              </div>
            </div>
            <Link
              href={`/admin/clients/${clientId}/forms`}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Generate New Link
            </Link>
          </div>
        </div>

        {/* Enhanced Signature Links List */}
        {signatureBatches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLink className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Signature Links</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No signature links have been generated for this client yet. Create your first link to get started.
              </p>
              <Link
                href={`/admin/clients/${clientId}/forms`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Generate First Link
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {signatureBatches.map((batch) => {
              const statusInfo = getBatchStatus(batch);
              const StatusIcon = statusInfo.icon;
              const signedCount = batch.signatureForms.filter(sf => sf.formSubmission.clientSignature).length;
              const totalCount = batch.signatureForms.length;
              const progressPercentage = totalCount > 0 ? (signedCount / totalCount) * 100 : 0;
              
              return (
                <div key={batch.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          <StatusIcon className="mr-1.5 h-4 w-4" />
                          {statusInfo.status}
                        </span>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{signedCount}</span> of <span className="font-medium">{totalCount}</span> forms signed
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Forms Section */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FaFileAlt className="h-4 w-4 mr-2" />
                        Forms in this link ({totalCount})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {batch.signatureForms.map((sf) => (
                          <div
                            key={sf.id}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              sf.formSubmission.clientSignature
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center">
                              {sf.formSubmission.clientSignature ? (
                                <FaCheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <FaClock className="h-4 w-4 mr-2 text-gray-400" />
                              )}
                              <span className="text-sm font-medium truncate">
                                {sf.formSubmission.form.title}
                              </span>
                            </div>
                            {sf.formSubmission.clientSignedAt && (
                              <div className="text-xs text-green-600 mt-1">
                                Signed: {new Date(sf.formSubmission.clientSignedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium mr-2">Created:</span>
                        <span>{new Date(batch.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="h-4 w-4 mr-2 text-gray-400" />
                        {editingExpiry === batch.id ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <span className="font-medium">Expires:</span>
                            <input
                              type="datetime-local"
                              value={newExpiryDate}
                              onChange={(e) => setNewExpiryDate(e.target.value)}
                              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                              min={new Date().toISOString().slice(0, 16)}
                            />
                            <button
                              onClick={() => updateExpiry(batch.id)}
                              className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save"
                            >
                              <FaSave className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditingExpiry}
                              className="p-1.5 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Expires:</span>
                            <span>{new Date(batch.expiresAt).toLocaleString()}</span>
                            <button
                              onClick={() => startEditingExpiry(batch.id, batch.expiresAt)}
                              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit expiry date"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Link ID: {batch.batchToken.slice(0, 8)}...
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => copyLinkToClipboard(batch.batchToken)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                          title="Copy link to clipboard"
                        >
                          <FaCopy className="mr-2 h-4 w-4" />
                          Copy Link
                        </button>
                        
                        <Link
                          href={`/forms/signature/${batch.batchToken}`}
                          target="_blank"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                        >
                          <FaEye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>

                        <button
                          onClick={() => deleteBatch(batch.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                          title="Delete signature link"
                        >
                          <FaTrash className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
