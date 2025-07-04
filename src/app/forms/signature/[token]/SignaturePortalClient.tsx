"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaFileAlt, FaSignature, FaCheck, FaClock, FaUser, FaCalendarAlt } from 'react-icons/fa';

// Types
interface SignatureForm {
  id: number;
  formSubmissionId: number;
  formSubmission: {
    id: number;
    clientSignature?: string;
    clientSignedAt?: string;
    form: {
      title: string;
      formKey: string;
    };
  };
}

interface SignatureBatchData {
  id: number;
  batchToken: string;
  expiresAt: string;
  client: {
    name: string;
    email: string;
  };
  signatureForms: SignatureForm[];
}

export default function SignaturePortalClient() {
  const params = useParams();
  const token = params.token as string;
  
  const [batchData, setBatchData] = useState<SignatureBatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSignatureBatch();
  }, [token]);

  const loadSignatureBatch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/signature/${token}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Signature link not found or expired');
        } else if (response.status === 410) {
          throw new Error('This signature link has expired');
        }
        throw new Error('Failed to load signature forms');
      }
      
      const data = await response.json();
      setBatchData(data);
      
    } catch (error: any) {
      console.error('Error loading signature batch:', error);
      setError(error.message || 'Failed to load signature forms');
    } finally {
      setLoading(false);
    }
  };

  const getFormStatus = (form: SignatureForm) => {
    if (form.formSubmission.clientSignature) {
      return {
        status: 'Signed',
        color: 'text-green-600 bg-green-100',
        icon: FaCheck,
        date: form.formSubmission.clientSignedAt,
      };
    } else {
      return {
        status: 'Pending Signature',
        color: 'text-amber-600 bg-amber-100',
        icon: FaClock,
        date: null,
      };
    }
  };

  const completedForms = batchData?.signatureForms.filter(
    form => form.formSubmission.clientSignature
  ).length || 0;
  
  const totalForms = batchData?.signatureForms.length || 0;
  const allCompleted = completedForms === totalForms && totalForms > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signature forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <FaFileAlt className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            Please contact support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  if (!batchData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600">No signature forms found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <FaSignature className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Signature Required
            </h1>
            <div className="flex items-center justify-center text-gray-600 mb-4">
              <FaUser className="h-4 w-4 mr-2" />
              <span>{batchData.client.name}</span>
              <span className="mx-2">•</span>
              <span>{batchData.client.email}</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <FaCalendarAlt className="h-4 w-4 mr-2" />
              <span>
                Expires on {new Date(batchData.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedForms} of {totalForms} forms signed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  allCompleted ? 'bg-green-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${totalForms > 0 ? (completedForms / totalForms) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {allCompleted && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FaCheck className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">All Forms Completed!</p>
                  <p className="text-green-600 text-sm">
                    Thank you for signing all the required documents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Forms Requiring Your Signature
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Please review and sign each form below
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {batchData.signatureForms.map((form, index) => {
              const statusInfo = getFormStatus(form);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={form.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FaFileAlt className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {form.formSubmission.form.title}
                        </h3>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.status}
                          </span>
                          {statusInfo.date && (
                            <span className="ml-3 text-sm text-gray-500">
                              Signed on {new Date(statusInfo.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      <Link
                        href={`/forms/signature/${token}/${form.formSubmissionId}`}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                          form.formSubmission.clientSignature
                            ? 'text-green-700 bg-green-100 hover:bg-green-200'
                            : 'text-white bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {form.formSubmission.clientSignature ? (
                          <>
                            <FaCheck className="mr-2 h-4 w-4" />
                            View Signed
                          </>
                        ) : (
                          <>
                            <FaSignature className="mr-2 h-4 w-4" />
                            Start
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            If you have any questions about these forms, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
