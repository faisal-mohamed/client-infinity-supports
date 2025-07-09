"use client";

import { useEffect, useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaDownload, FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface FormAssignment {
  id: number;
  form: {
    id: number;
    formKey: string;
    title: string;
    version: number;
  };
  hasSubmission: boolean;
  submissionId?: number;
  filledByAdmin: boolean;
  clientSignature: string;
}

interface CommonFieldsWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  clientName?: string;
  assignments: FormAssignment[];
  onDownloadForm: (assignmentId: number, formTitle: string) => Promise<void>;
}

export default function CommonFieldsWarningModal({
  isOpen,
  onClose,
  onProceed,
  clientName,
  assignments,
  onDownloadForm
}: CommonFieldsWarningModalProps) {
  const [downloadingForms, setDownloadingForms] = useState<Set<number>>(new Set());
  const [downloadedForms, setDownloadedForms] = useState<Set<number>>(new Set());
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

 

  const handleDownload = async (assignmentId: number, formTitle: string) => {
    try {
      setDownloadingForms(prev => new Set(prev).add(assignmentId));
      await onDownloadForm(assignmentId, formTitle);
      setDownloadedForms(prev => new Set(prev).add(assignmentId));
    } catch (error) {
      console.error('Error downloading form:', error);
    } finally {
      setDownloadingForms(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  const handleDownloadAll = async () => {
    const formsToDownload = assignments.filter(assignment => 
      assignment.hasSubmission && !downloadedForms.has(assignment.id)
    );

    for (const assignment of formsToDownload) {
      await handleDownload(assignment.id, assignment.form.title);
      // Add a small delay between downloads to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const completedForms = assignments.filter(assignment => assignment.hasSubmission);
  const allDownloaded = completedForms.every(assignment => downloadedForms.has(assignment.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Important: Download Forms Before Editing
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Backup current versions before updating common fields for {clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                    Why download forms before editing?
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Common field changes will affect all forms for this client</li>
                    <li>• Downloaded PDFs preserve the current version with original data</li>
                    <li>• Maintains audit trail and version control</li>
                    <li>• Required for compliance and record-keeping</li>
                  </ul>
                </div>
              </div>
            </div>

            {completedForms.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Forms Available for Download ({completedForms.length})
                </h4>
                <button
                  onClick={handleDownloadAll}
                  disabled={downloadingForms.size > 0 || allDownloaded}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {downloadingForms.size > 0 ? (
                    <>
                      <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : allDownloaded ? (
                    <>
                      <FaCheckCircle className="mr-2 h-4 w-4" />
                      All Downloaded
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2 h-4 w-4" />
                      Download All
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Forms List */}
          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No forms assigned to this client yet.</p>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    assignment.hasSubmission 
                      ? downloadedForms.has(assignment.id)
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h5 className="font-medium text-gray-900">
                          {assignment.form.title}
                        </h5>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          v{assignment.form.version}
                        </span>
                        {assignment.filledByAdmin && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            Admin Filled
                          </span>
                        )}
                        {assignment.clientSignature === "true" && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                            Client Signed
                          </span>
                        )}
                        {!assignment.hasSubmission && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            Not Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Form Key: {assignment.form.formKey}
                        {assignment.hasSubmission && (
                          <span className="ml-2 text-green-600">• Ready for download</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {assignment.hasSubmission ? (
                        downloadedForms.has(assignment.id) ? (
                          <div className="flex items-center text-green-600">
                            <FaCheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Downloaded</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDownload(assignment.id, assignment.form.title)}
                            disabled={downloadingForms.has(assignment.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {downloadingForms.has(assignment.id) ? (
                              <>
                                <FaSpinner className="mr-1 h-3 w-3 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <FaDownload className="mr-1 h-3 w-3" />
                                Download PDF
                              </>
                            )}
                          </button>
                        )
                      ) : (
                        <span className="text-sm text-gray-500 px-3 py-1.5">
                          Not completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {completedForms.length > 0 ? (
              <span>
                {downloadedForms.size} of {completedForms.length} forms downloaded
              </span>
            ) : (
              <span>No completed forms to download</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {completedForms.length > 0 && !allDownloaded && (
              <button
                onClick={onProceed}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Skip Downloads & Proceed
              </button>
            )}
            
            <button
              onClick={onProceed}
              className={`px-6 py-2 rounded-lg transition-colors ${
                completedForms.length === 0 || allDownloaded
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {completedForms.length === 0 
                ? 'Proceed to Edit Common Fields'
                : allDownloaded 
                  ? 'Proceed to Edit Common Fields'
                  : 'Proceed Anyway'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
