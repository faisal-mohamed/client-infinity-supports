"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, FaLink, FaCopy, FaEye, FaCalendarAlt, FaCheck, 
  FaClock, FaExclamationTriangle, FaPlus, FaTrash, FaEdit, 
  FaSave, FaTimes, FaUser, FaFileAlt, FaCheckCircle, FaSpinner,
  FaShare, FaDownload, FaHistory, FaShieldAlt, FaInfoCircle
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
  const confirm  = useConfirm();
  
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

    const confirmed = await confirm.confirm({
      title: 'Delete Signature Link',
      message: 'Are you sure you want to delete this signature link? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
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
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Generated Links</h3>
          <p className="text-gray-600 font-medium">Please wait...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Link 
                href={`/admin/clients/${clientId}/forms`}
                className="mr-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <FaArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                    <FaLink className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Signature Links Management
                  </h1>
                </div>
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <FaUser className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="font-semibold">{client?.name}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center">
                    <FaShieldAlt className="h-4 w-4 mr-2 text-indigo-500" />
                    <span>{client?.email}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Manage and monitor signature links for form completion
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Links</p>
                    <p className="text-3xl font-bold text-gray-900">{signatureBatches.length}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                    <FaLink className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Active Links</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {signatureBatches.filter(batch => new Date(batch.expiresAt) > new Date()).length}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <FaCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {signatureBatches.filter(batch => {
                        const totalForms = batch.signatureForms.length;
                        const signedForms = batch.signatureForms.filter(sf => sf.formSubmission.clientSignature).length;
                        return signedForms === totalForms && totalForms > 0;
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <FaCheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                  <FaInfoCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Signature Links Overview</p>
                  <p className="text-gray-600">{signatureBatches.length} link{signatureBatches.length !== 1 ? 's' : ''} generated for this client</p>
                </div>
              </div>
              {/* <Link
                href={`/admin/clients/${clientId}/forms`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPlus className="mr-2 h-5 w-5" />
                Generate New Link
              </Link> */}
            </div>
          </div>
        </div>

        {/* Enhanced Signature Links List */}
        {signatureBatches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-8 py-20 text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <FaLink className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Signature Links Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                No signature links have been generated for this client yet. Create your first link to enable secure form signing and streamline the completion process.
              </p>
              <div className="space-y-6">
                <Link
                  href={`/admin/clients/${clientId}/forms`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
                >
                  <FaPlus className="mr-3 h-5 w-5" />
                  Generate First Signature Link
                </Link>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mr-2">
                      <FaShieldAlt className="h-3 w-3 text-white" />
                    </div>
                    <span>Secure Links</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg mr-2">
                      <FaClock className="h-3 w-3 text-white" />
                    </div>
                    <span>Time-Limited</span>
                  </div>
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-2">
                      <FaHistory className="h-3 w-3 text-white" />
                    </div>
                    <span>Progress Tracking</span>
                  </div>
                </div>
              </div>
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
                <div key={batch.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                  {/* Card Header */}
                  <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${statusInfo.color}`}>
                          <StatusIcon className="mr-2 h-4 w-4" />
                          {statusInfo.status}
                        </span>
                        <div className="text-sm text-gray-600">
                          <span className="font-bold text-gray-900">{signedCount}</span> of <span className="font-bold text-gray-900">{totalCount}</span> forms signed
                        </div>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 min-w-[3rem]">{Math.round(progressPercentage)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8">
                    {/* Forms Section */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-3 shadow-lg">
                          <FaFileAlt className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Forms in this link ({totalCount})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {batch.signatureForms.map((sf, index) => (
                          <div
                            key={sf.id}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                              sf.formSubmission.clientSignature
                                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-800 shadow-md'
                                : 'bg-gradient-to-r from-gray-50 to-white border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm hover:shadow-md'
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center">
                              {sf.formSubmission.clientSignature ? (
                                <div className="p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mr-3">
                                  <FaCheckCircle className="h-4 w-4 text-white" />
                                </div>
                              ) : (
                                <div className="p-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg mr-3">
                                  <FaClock className="h-4 w-4 text-white" />
                                </div>
                              )}
                              <span className="text-sm font-semibold truncate flex-1">
                                {sf.formSubmission.form.title}
                              </span>
                            </div>
                            {sf.formSubmission.clientSignedAt && (
                              <div className="text-xs text-emerald-600 mt-2 font-medium">
                                ✓ Signed: {new Date(sf.formSubmission.clientSignedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-3 shadow-lg">
                          <FaCalendarAlt className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">Created</span>
                          <span className="text-gray-600">{new Date(batch.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mr-3 shadow-lg">
                          <FaClock className="h-4 w-4 text-white" />
                        </div>
                        {editingExpiry === batch.id ? (
                          <div className="flex items-center space-x-3 flex-1">
                            <div>
                              <span className="font-semibold text-gray-900 block">Expires</span>
                              <input
                                type="datetime-local"
                                value={newExpiryDate}
                                onChange={(e) => setNewExpiryDate(e.target.value)}
                                className="text-sm border-2 border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateExpiry(batch.id)}
                                className="p-2 text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                title="Save"
                              >
                                <FaSave className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEditingExpiry}
                                className="p-2 text-white bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                title="Cancel"
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 flex-1">
                            <div>
                              <span className="font-semibold text-gray-900 block">Expires</span>
                              <span className="text-gray-600">{new Date(batch.expiresAt).toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => startEditingExpiry(batch.id, batch.expiresAt)}
                              className="p-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                              title="Edit expiry date"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl shadow-lg">
                          <FaInfoCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Link ID</p>
                          <p className="text-xs text-gray-500 font-mono">{batch.batchToken.slice(0, 12)}...</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => copyLinkToClipboard(batch.batchToken)}
                          className="inline-flex items-center px-5 py-3 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                          title="Copy link to clipboard"
                        >
                          <FaCopy className="mr-2 h-4 w-4" />
                          Copy Link
                        </button>
                        
                        <Link
                          href={`/forms/signature/${batch.batchToken}`}
                          target="_blank"
                          className="inline-flex items-center px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <FaEye className="mr-2 h-4 w-4" />
                          Preview
                        </Link>

                        <button
                          onClick={() => deleteBatch(batch.id)}
                          className="inline-flex items-center px-5 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
