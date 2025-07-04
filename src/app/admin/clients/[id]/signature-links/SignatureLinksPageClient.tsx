"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaLink, FaCopy, FaEye, FaCalendarAlt, FaCheck, FaClock, FaExclamationTriangle, FaPlus, FaTrash } from 'react-icons/fa';
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
  const confirm = useConfirm();
  
  const clientId = parseInt(params.id as string);
  
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [signatureBatches, setSignatureBatches] = useState<SignatureBatch[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Signature link copied to clipboard',
        duration: 2000,
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            href={`/admin/clients/${clientId}/forms`}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Signature Links for {client?.name}
            </h1>
            <p className="text-gray-600 mt-1">{client?.email}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/admin/clients/${clientId}/forms`}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            <FaPlus className="mr-2" />
            Generate New Link
          </Link>
        </div>
      </div>

      {/* Signature Links List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Generated Signature Links</h2>
        </div>

        {signatureBatches.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FaLink className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Signature Links</h3>
            <p className="text-gray-600 mb-4">No signature links have been generated for this client yet.</p>
            <Link
              href={`/admin/clients/${clientId}/forms`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Generate First Link
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {signatureBatches.map((batch) => {
              const statusInfo = getBatchStatus(batch);
              const StatusIcon = statusInfo.icon;
              const signedCount = batch.signatureForms.filter(sf => sf.formSubmission.clientSignature).length;
              const totalCount = batch.signatureForms.length;
              
              return (
                <div key={batch.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} mr-3`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {signedCount} of {totalCount} forms signed
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          Forms in this link:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {batch.signatureForms.map((sf) => (
                            <span
                              key={sf.id}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                sf.formSubmission.clientSignature
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {sf.formSubmission.clientSignature && <FaCheck className="mr-1 h-3 w-3" />}
                              {sf.formSubmission.form.title}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-4 w-4 mr-1" />
                          Created: {new Date(batch.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-4 w-4 mr-1" />
                          Expires: {new Date(batch.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => copyLinkToClipboard(batch.batchToken)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        title="Copy link to clipboard"
                      >
                        <FaCopy className="mr-1 h-3 w-3" />
                        Copy Link
                      </button>
                      
                      <Link
                        href={`/forms/signature/${batch.batchToken}`}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaEye className="mr-1 h-3 w-3" />
                        Preview
                      </Link>

                      <button
                        onClick={() => deleteBatch(batch.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete signature link"
                      >
                        <FaTrash className="mr-1 h-3 w-3" />
                        Delete
                      </button>
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
