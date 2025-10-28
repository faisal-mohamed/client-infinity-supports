"use client";

import { useEffect, useState } from "react";
import {
  FaTimes,
  FaExclamationTriangle,
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaFileAlt,
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";

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
  onDownloadForm,
}: CommonFieldsWarningModalProps) {
  const [downloadingForms, setDownloadingForms] = useState<Set<number>>(
    new Set()
  );
  const [downloadedForms, setDownloadedForms] = useState<Set<number>>(
    new Set()
  );
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  const handleDownload = async (assignmentId: number, formTitle: string) => {
    try {
      setDownloadingForms((prev) => new Set(prev).add(assignmentId));
      await onDownloadForm(assignmentId, formTitle);
      setDownloadedForms((prev) => new Set(prev).add(assignmentId));
    } catch (error) {
      console.error("Error downloading form:", error);
    } finally {
      setDownloadingForms((prev) => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  const handleDownloadAll = async () => {
    const formsToDownload = assignments.filter(
      (assignment) =>
        assignment.hasSubmission && !downloadedForms.has(assignment.id)
    );

    for (const assignment of formsToDownload) {
      await handleDownload(assignment.id, assignment.form.title);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const completedForms = assignments.filter(
    (assignment) => assignment.hasSubmission
  );
  const allDownloaded = completedForms.every((assignment) =>
    downloadedForms.has(assignment.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-modal-appear">
        {/* Enhanced Header */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                <FaExclamationTriangle className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Important: Download Forms Before Editing
                </h3>
                <div className="flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-gray-500" />
                  <p className="text-sm sm:text-base text-gray-600 truncate">
                    Backup current versions before updating common fields for{" "}
                    <span className="font-semibold text-orange-600">
                      {clientName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 flex-shrink-0 group"
            >
              <FaTimes className="h-5 w-5 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
          {/* Warning Information Card */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md flex-shrink-0">
                <FaShieldAlt className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-amber-800 mb-3">
                  Why download forms before editing?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
                  <div>
                    <h5 className="font-semibold mb-2 text-amber-800">
                      Data Protection:
                    </h5>
                    <ul className="space-y-1">
                      <li>• Common field changes affect all client forms</li>
                      <li>• Downloaded PDFs preserve original data</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2 text-amber-800">
                      Compliance:
                    </h5>
                    <ul className="space-y-1">
                      <li>• Maintains audit trail and version control</li>
                      <li>• Required for record-keeping compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          {completedForms.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FaFileAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Available Forms ({completedForms.length})
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ready for download and backup
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadAll}
                  disabled={downloadingForms.size > 0 || allDownloaded}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {downloadingForms.size > 0 ? (
                    <>
                      <FaSpinner className="h-4 w-4 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : allDownloaded ? (
                    <>
                      <FaCheckCircle className="h-4 w-4" />
                      <span>All Downloaded</span>
                    </>
                  ) : (
                    <>
                      <FaDownload className="h-4 w-4" />
                      <span>Download All</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Indicator */}
              {completedForms.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Download Progress
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {downloadedForms.size} / {completedForms.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full shadow-md transition-all duration-500 ease-out"
                      style={{
                        width: `${
                          (downloadedForms.size / completedForms.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Forms List */}
          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <FaFileAlt className="h-16 w-16 text-gray-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  No Forms Available
                </h4>
                <p className="text-gray-600">
                  No forms have been assigned to this client yet.
                </p>
              </div>
            ) : (
              assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className={`border-2 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-lg ${
                    assignment.hasSubmission
                      ? downloadedForms.has(assignment.id)
                        ? "border-green-300 bg-gradient-to-br from-green-50 to-green-100"
                        : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50"
                      : "border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className={`p-3 rounded-xl shadow-md ${
                            assignment.hasSubmission
                              ? downloadedForms.has(assignment.id)
                                ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                                : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                              : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                          }`}
                        >
                          <FaFileAlt className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-gray-900 mb-1">
                            {assignment.form.title}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Form Key:{" "}
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {assignment.form.formKey}
                            </span>
                            {assignment.hasSubmission && (
                              <span className="ml-2 text-green-600 font-semibold">
                                • Ready for download
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300">
                          v{assignment.form.version}
                        </span>
                        {assignment.filledByAdmin && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300">
                            Admin Filled
                          </span>
                        )}
                        {assignment.clientSignature === "true" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300">
                            Client Signed
                          </span>
                        )}
                        {!assignment.hasSubmission && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 border border-gray-300">
                            Not Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {assignment.hasSubmission ? (
                        downloadedForms.has(assignment.id) ? (
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                            <FaCheckCircle className="h-5 w-5" />
                            <span className="font-semibold">Downloaded</span>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleDownload(
                                assignment.id,
                                assignment.form.title
                              )
                            }
                            disabled={downloadingForms.has(assignment.id)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                          >
                            {downloadingForms.has(assignment.id) ? (
                              <>
                                <FaSpinner className="h-4 w-4 animate-spin" />
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <FaDownload className="h-4 w-4" />
                                <span>Download PDF</span>
                              </>
                            )}
                          </button>
                        )
                      ) : (
                        <div className="text-gray-500 bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
                          <span className="font-medium">Not completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Information */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <FaCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {completedForms.length > 0
                    ? `${downloadedForms.size} of ${completedForms.length} forms downloaded`
                    : "No completed forms to download"}
                </div>
                <div className="text-sm text-gray-600">
                  {completedForms.length > 0 &&
                    !allDownloaded &&
                    "Download remaining forms for backup"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cancel
              </button>

              {completedForms.length > 0 && !allDownloaded && (
                <button
                  onClick={onProceed}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Skip Downloads & Proceed
                </button>
              )}

              {completedForms.length > 0 && allDownloaded && (
                <button
                  onClick={onProceed}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl hover:from-amber-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  All Downloaded. Now Proceed
                </button>
              )}

              {assignments.length === 0 && (
                <button
                  onClick={onProceed}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Proceed to Edit Common Fields
                </button>
              )}

              {assignments.length > 0 && completedForms.length === 0 && (
                <button
                  onClick={onProceed}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Proceed to Edit Common Fields
                </button>
              )}

              {/* <button
                onClick={onProceed}
                className={`px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  completedForms.length === 0 || allDownloaded
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                }`}
              >
                {completedForms.length === 0 
                  ? 'Proceed to Edit Common Fields'
                  : allDownloaded 
                    ? 'Proceed to Edit Common Fields'
                    : 'Proceed Anyway (Not Recommended)'
                }
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
