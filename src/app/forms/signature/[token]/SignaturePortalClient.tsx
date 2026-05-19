"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaFileAlt, FaSignature, FaCheck, FaClock, FaUser, FaCalendarAlt,
  FaEye, FaDownload, FaCheckCircle, FaExclamationCircle, FaInfoCircle,
  FaSpinner, FaShieldAlt, FaHistory, FaShare, FaCopy, FaExternalLinkAlt
} from 'react-icons/fa';
import { useToast } from '@/components/ui/Toast';

// Types
interface SignatureForm {
  id: string | number;
  formSubmissionId: string | number;
  formSubmission: {
    id: string | number;
    clientSignature?: string;
    clientSignedAt?: string;
    data: any;
    form: {
      id: string | number; // Add form ID
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
  id: string | number;
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
  const { showToast } = useToast();

  const [batchData, setBatchData] = useState<SignatureBatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingForm, setDownloadingForm] = useState<number | null>(null);

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
      console.log("data: ", data)
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

  const handleDownloadForm = async (formSubmissionId: string | number, formId: string | number, formTitle: string) => {
    try {
      setDownloadingForm(formSubmissionId);

      showToast({
        type: 'info',
        title: 'Generating PDF',
        message: 'Please wait while we prepare your document...',
        duration: 3000,
      });

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
        document.body.removeChild(a);

        showToast({
          type: 'success',
          title: 'Download Complete',
          message: `${formTitle} has been downloaded successfully.`,
          duration: 3000,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error downloading form:', error);
      showToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to download form. Please try again.',
        duration: 5000,
      });
    } finally {
      setDownloadingForm(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-azure-50 to-azure-100 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-t-azure-600 border-azure-200 rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          <h3 className="text-lg sm:text-xl font-bold text-azure-700 mb-2">Loading Form</h3>
          <p className="text-sm sm:text-base text-azure-500 font-medium">Please wait...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-azure-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-azure-50 via-white to-blue-50">
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="max-w-md mx-auto text-center bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaExclamationCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-azure-700 mb-3 sm:mb-4">Access Error</h1>
            <p className="text-sm sm:text-base text-azure-500 mb-4 sm:mb-6 leading-relaxed">{error}</p>
            <div className="bg-azure-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center text-xs sm:text-sm text-azure-500">
                <FaInfoCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500 flex-shrink-0" />
                <span>Please contact support if you believe this is an error.</span>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-azure-600 to-azure-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:from-azure-700 hover:to-azure-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!batchData) {
    return (
      <div className="min-h-screen bg-azure-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-azure-500">No signature forms found.</p>
        </div>
      </div>
    );
  }

  const { completionStatus } = batchData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-azure-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Header Gradient */}
          <div className="bg-gradient-to-r from-azure-600 via-purple-600 to-blue-600 px-4 sm:px-8 py-4 sm:py-6">
            <div className="text-center text-white">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                  <FaSignature className="h-6 w-6 sm:h-10 sm:w-10" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 px-2">
                Document Review & Signature Portal
              </h1>
              <p className="text-azure-100 text-sm sm:text-lg px-2">
                Secure document signing and review platform
              </p>
            </div>
          </div>

          {/* Client Info Section */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-azure-50 to-white">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-azure-600">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-azure-100 rounded-full flex items-center justify-center mr-3">
                  <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-azure-700" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-azure-700 text-sm sm:text-base">{batchData.client.name}</p>
                  <p className="text-xs sm:text-sm text-azure-500">{batchData.client.email}</p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-azure-200"></div>

              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <FaCalendarAlt className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-azure-700 text-sm sm:text-base">Expires</p>
                  <p className="text-xs sm:text-sm text-azure-500">
                    {new Date(batchData.expiresAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-azure-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-blue-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{completionStatus.totalForms}</div>
                <div className="text-xs sm:text-sm font-medium text-blue-700">Total Forms</div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-amber-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaSignature className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">{completionStatus.formsRequiringSignature}</div>
                <div className="text-xs sm:text-sm font-medium text-amber-700">Require Signature</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-green-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{completionStatus.signedForms}</div>
                <div className="text-xs sm:text-sm font-medium text-green-700">Completed</div>
              </div>
            </div>

            {/* Progress Bar for Signature Forms Only */}
            {completionStatus.formsRequiringSignature > 0 && (
              <div className="bg-azure-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-1 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-azure-700">Signature Progress</h3>
                  <span className="text-xs sm:text-sm font-medium text-azure-500">
                    {completionStatus.signedForms} of {completionStatus.formsRequiringSignature} forms signed
                  </span>
                </div>
                <div className="w-full bg-azure-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div
                    className={`h-2 sm:h-3 rounded-full transition-all duration-500 ease-out ${completionStatus.isComplete
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-azure-600 to-azure-500'
                      }`}
                    style={{
                      width: `${completionStatus.formsRequiringSignature > 0 ?
                        (completionStatus.signedForms / completionStatus.formsRequiringSignature) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-azure-400 text-center">
                  {Math.round(completionStatus.formsRequiringSignature > 0 ?
                    (completionStatus.signedForms / completionStatus.formsRequiringSignature) * 100 : 0)}% Complete
                </div>
              </div>
            )}
          </div>

          {/* Completion Status */}
          {completionStatus.isComplete && (
            <div className="mx-4 sm:mx-8 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mr-0 sm:mr-4 mx-auto sm:mx-0">
                    <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-1">
                      🎉 All Required Signatures Completed!
                    </h3>
                    <p className="text-sm sm:text-base text-green-700">
                      Thank you for signing all the required documents. The admin has been notified of your completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-azure-50 to-white px-4 sm:px-8 py-4 sm:py-6 border-b border-azure-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-azure-700 mb-1 sm:mb-2">
                  Forms for Review
                </h2>
                <p className="text-sm sm:text-base text-azure-500">
                  Please review each form below. Some forms require your digital signature.
                </p>
              </div>
              <div className="flex sm:hidden items-center space-x-4 self-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-azure-700">{batchData.signatureForms.length}</div>
                  <div className="text-xs text-azure-400">Total</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-azure-700">{batchData.signatureForms.length}</div>
                  <div className="text-xs text-azure-400">Total</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {batchData.signatureForms.map((form, index) => {
              const statusInfo = getFormStatus(form);
              const StatusIcon = statusInfo.icon;
              const requiresSignature = form.formSubmission.form.requiresSignature;
              const isDownloading = downloadingForm === form.formSubmissionId;

              return (
                <div key={form.id} className="bg-gradient-to-r from-azure-50 to-white rounded-lg sm:rounded-xl border border-azure-100 hover:border-gold-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start sm:items-center flex-1 w-full sm:w-auto">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-azure-600 to-azure-800 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                            <FaFileAlt className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                          </div>
                        </div>

                        <div className="ml-4 sm:ml-6 flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-azure-700 mb-2 pr-2">
                            {form.formSubmission.form.title}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${statusInfo.color} shadow-sm w-fit`}>
                              <StatusIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              {statusInfo.status}
                            </span>
                            {statusInfo.date && (
                              <div className="flex items-center text-xs sm:text-sm text-azure-400">
                                <FaHistory className="mr-1 h-3 w-3" />
                                <span>Signed on {new Date(statusInfo.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-full sm:w-auto sm:ml-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {/* Download Button */}
                        {batchData.isCompleted && (
                          <button
                            onClick={() => handleDownloadForm(
                              form.formSubmissionId,
                              form.formSubmission.form.id,
                              form.formSubmission.form.title
                            )}
                            disabled={isDownloading}
                            className="inline-flex items-center justify-center px-4 py-2.5 border-2 border-azure-200 text-sm font-medium rounded-lg sm:rounded-xl text-azure-600 bg-white hover:bg-azure-50 hover:border-azure-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download PDF"
                          >
                            {isDownloading ? (
                              <FaSpinner className="h-4 w-4 animate-spin" />
                            ) : (
                              <FaDownload className="h-4 w-4" />
                            )}
                            <span className="ml-2">Download</span>
                          </button>
                        )}

                        {/* View/Sign Button */}
                        <Link
                          href={`/forms/signature/${token}/${form.formSubmissionId}`}
                          className={`inline-flex items-center justify-center px-4 sm:px-6 py-2.5 border-2 border-transparent text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${requiresSignature
                              ? form.formSubmission.clientSignature === "true"
                                ? 'text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 focus:ring-green-500'
                                : 'text-white bg-gradient-to-r from-azure-600 to-azure-800 hover:from-azure-700 hover:to-azure-800 focus:ring-gold-500'
                              : 'text-blue-700 bg-gradient-to-r from-blue-100 to-azure-100 hover:from-blue-200 hover:to-azure-200 focus:ring-blue-500'
                            }`}
                        >
                          {requiresSignature ? (
                            form.formSubmission.clientSignature === "true" ? (
                              <>
                                <FaCheckCircle className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">View Signed</span>
                                <span className="sm:hidden">Signed</span>
                              </>
                            ) : (
                              <>
                                <FaSignature className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Sign Now</span>
                                <span className="sm:hidden">Sign</span>
                              </>
                            )
                          ) : (
                            <>
                              <FaEye className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">View Form</span>
                              <span className="sm:hidden">View</span>
                            </>
                          )}
                          <FaExternalLinkAlt className="ml-2 h-3 w-3 opacity-70" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <FaShieldAlt className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-azure-500 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
              If you have any queries about these forms, please contact our support team.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
