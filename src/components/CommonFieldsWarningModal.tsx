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
  id: string | number;
  form: {
    id: string | number;
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
  onDownloadForm: (assignmentId: string | number, formTitle: string) => Promise<void>;
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

  const handleDownload = async (assignmentId: string | number, formTitle: string) => {
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-azure-100 animate-modal-appear">
        {/* Enhanced Header */}
        <div className="px-4 sm:px-6 py-4 flex-shrink-0 bg-gradient-to-r from-amber-50 via-gold-50 to-red-50 border-b border-azure-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-gold-600 text-white shadow-lg">
                <FaExclamationTriangle className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-azure-700 mb-1">
                  Important: Download Forms Before Editing
                </h3>
                <div className="flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-azure-400" />
                  <p className="text-sm sm:text-base text-azure-500 truncate">
                    Backup current versions before updating common fields for{" "}
                    <span className="font-semibold text-gold-600">
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
              <FaTimes className="h-5 w-5 text-azure-400 group-hover:text-azure-600 group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
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
                  <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                    <FaFileAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-azure-700">
                      Available Forms ({completedForms.length})
                    </h4>
                    <p className="text-sm text-azure-500">
                      Ready for download and backup
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadAll}
                  disabled={downloadingForms.size > 0 || allDownloaded}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-azure-600 to-azure-700 text-white rounded-xl hover:from-azure-700 hover:to-azure-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
                    <span className="text-sm font-semibold text-azure-600">
                      Download Progress
                    </span>
                    <span className="text-sm font-bold text-azure-700">
                      {downloadedForms.size} / {completedForms.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-azure-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-azure-600 to-azure-800 h-3 rounded-full shadow-md transition-all duration-500 ease-out"
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
                <div className="p-8 rounded-full bg-gradient-to-br from-azure-100 to-azure-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <FaFileAlt className="h-16 w-16 text-azure-300" />
                </div>
                <h4 className="text-xl font-bold text-azure-700 mb-2">
                  No Forms Available
                </h4>
                <p className="text-azure-500">
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
                        : "border-azure-100 bg-white hover:border-azure-200 hover:bg-gradient-to-br hover:from-azure-50 hover:to-azure-50"
                      : "border-azure-100 bg-gradient-to-br from-azure-50 to-azure-100"
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
                                : "bg-gradient-to-br from-azure-500 to-azure-600 text-white"
                              : "bg-gradient-to-br from-azure-300 to-azure-500 text-white"
                          }`}
                        >
                          <FaFileAlt className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-azure-700 mb-1">
                            {assignment.form.title}
                          </h5>
                          <p className="text-sm text-azure-500">
                            Form Key:{" "}
                            <span className="font-mono bg-azure-100 px-2 py-1 rounded">
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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-azure-100 to-azure-200 text-azure-600 border border-azure-200">
                          v{assignment.form.version}
                        </span>
                        {assignment.filledByAdmin && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-azure-100 to-azure-200 text-azure-700 border border-azure-200">
                            Admin Filled
                          </span>
                        )}
                        {assignment.clientSignature === "true" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300">
                            Client Signed
                          </span>
                        )}
                        {!assignment.hasSubmission && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-azure-100 to-azure-200 text-azure-400 border border-azure-200">
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
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-azure-700 to-azure-800 text-white rounded-xl hover:from-azure-800 hover:to-azure-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
                        <div className="text-azure-400 bg-azure-100 px-4 py-2 rounded-xl border border-azure-100">
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
        <div className="px-4 sm:px-6 py-4 flex-shrink-0 bg-gradient-to-r from-azure-50 to-azure-100 border-t border-azure-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Information */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-azure-100 text-azure-700">
                <FaCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-azure-700">
                  {completedForms.length > 0
                    ? `${downloadedForms.size} of ${completedForms.length} forms downloaded`
                    : "No completed forms to download"}
                </div>
                <div className="text-sm text-azure-500">
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
                className="w-full sm:w-auto text-center px-6 py-3 text-azure-600 bg-white border-2 border-azure-200 rounded-xl hover:bg-azure-50 hover:border-azure-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cancel
              </button>

              {completedForms.length > 0 && !allDownloaded && (
                <button
                  onClick={onProceed}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-amber-600 to-gold-600 text-white rounded-xl hover:from-amber-700 hover:to-gold-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Skip Downloads & Proceed
                </button>
              )}

              {completedForms.length > 0 && allDownloaded && (
                <button
                  onClick={onProceed}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-xl hover:from-amber-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  All Downloaded. Now Proceed
                </button>
              )}

              {assignments.length === 0 && (
                <button
                  onClick={onProceed}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Proceed to Edit Common Fields
                </button>
              )}

              {assignments.length > 0 && completedForms.length === 0 && (
                <button
                  onClick={onProceed}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-gradient-to-r from-azure-600 to-azure-700 text-white rounded-xl hover:from-azure-700 hover:to-azure-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
