"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaFileAlt, FaSignature, FaCheck, FaClock, FaUser, FaCalendarAlt, FaEye, FaDownload } from 'react-icons/fa';

// Types
interface SignatureForm {
  id: number;
  formSubmissionId: number;
  formSubmission: {
    id: number;
    clientSignature?: string;
    clientSignedAt?: string;
    data: any;
    form: {
      id: number; // Add form ID
      title: string;
      formKey: string;
      requiresSignature?: boolean;
    };
  };
}

interface CompletionStatus {
  totalForms: number;
  formsRequiringSignature: number;
  formsNotRequiringSignature: number;
  signedForms: number;
  isComplete: boolean;
}

interface SignatureBatchData {
  id: number;
  batchToken: string;
  expiresAt: string;
  isCompleted: boolean;
  completedAt?: string;
  client: {
    name: string;
    email: string;
  };
  signatureForms: SignatureForm[];
  formsRequiringSignature: SignatureForm[];
  formsNotRequiringSignature: SignatureForm[];
  completionStatus: CompletionStatus;
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
    const requiresSignature = form.formSubmission.form.requiresSignature;
    
    if (!requiresSignature) {
      return {
        status: 'View Only',
        color: 'text-blue-600 bg-blue-100',
        icon: FaEye,
        date: null,
      };
    }
    
    if (form.formSubmission.clientSignature === "true") {
      return {
        status: 'Signed',
        color: 'text-green-600 bg-green-100',
        icon: FaCheck,
        date: form.formSubmission.clientSignedAt,
      };
    } else {
      return {
        status: 'Signature Required',
        color: 'text-amber-600 bg-amber-100',
        icon: FaClock,
        date: null,
      };
    }
  };

  const handleDownloadForm = async (formSubmissionId: number, formId: number, formTitle: string) => {
    try {
      const response = await fetch(`/api/generate-pdf/${formSubmissionId}/${formId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${formTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading form:', error);
      alert('Failed to download form. Please try again.');
    }
  };

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

  const { completionStatus } = batchData;

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
              Document Review & Signature Portal
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

          {/* Progress Section */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{completionStatus.totalForms}</div>
                <div className="text-sm text-gray-500">Total Forms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{completionStatus.formsRequiringSignature}</div>
                <div className="text-sm text-gray-500">Require Signature</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completionStatus.signedForms}</div>
                <div className="text-sm text-gray-500">Signed</div>
              </div>
            </div>

            {/* Progress Bar for Signature Forms Only */}
            {completionStatus.formsRequiringSignature > 0 && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Signature Progress</span>
                  <span>{completionStatus.signedForms} of {completionStatus.formsRequiringSignature} forms signed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      completionStatus.isComplete ? 'bg-green-500' : 'bg-indigo-600'
                    }`}
                    style={{ 
                      width: `${completionStatus.formsRequiringSignature > 0 ? 
                        (completionStatus.signedForms / completionStatus.formsRequiringSignature) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Completion Status */}
          {completionStatus.isComplete && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <FaCheck className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">All Required Signatures Completed!</p>
                  <p className="text-green-600 text-sm">
                    Thank you for signing all the required documents. The admin has been notified.
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
              Forms for Review
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Please review each form below. Some forms require your signature.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {batchData.signatureForms.map((form, index) => {
              const statusInfo = getFormStatus(form);
              const StatusIcon = statusInfo.icon;
              const requiresSignature = form.formSubmission.form.requiresSignature;
              
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

                    <div className="flex-shrink-0 ml-4 flex space-x-2">
                      {/* Download Button */}
                      <button
                        onClick={() => handleDownloadForm(
                          form.formSubmissionId, 
                          form.formSubmission.form.id, 
                          form.formSubmission.form.title
                        )}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        title="Download PDF"
                      >
                        <FaDownload className="h-4 w-4" />
                      </button>

                      {/* View/Sign Button */}
                      <Link
                        href={`/forms/signature/${token}/${form.formSubmissionId}`}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                          requiresSignature
                            ? form.formSubmission.clientSignature === "true"
                              ? 'text-green-700 bg-green-100 hover:bg-green-200'
                              : 'text-white bg-indigo-600 hover:bg-indigo-700'
                            : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                        }`}
                      >
                        {requiresSignature ? (
                          form.formSubmission.clientSignature === "true" ? (
                            <>
                              <FaCheck className="mr-2 h-4 w-4" />
                              View Signed
                            </>
                          ) : (
                            <>
                              <FaSignature className="mr-2 h-4 w-4" />
                              Sign Now
                            </>
                          )
                        ) : (
                          <>
                            <FaEye className="mr-2 h-4 w-4" />
                            View Form
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
