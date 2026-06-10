"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaTimes,
  FaExclamationTriangle,
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaFileAlt,
  FaUser,
  FaShieldAlt,
  FaStop,
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
  staffSignature?: string;
}

interface StaffCommonFieldsWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  staffName?: string;
  assignments: FormAssignment[];
  onDownloadForm: (assignmentId: number, formTitle: string) => Promise<void>;
}

export default function StaffCommonFieldsWarningModal({
  isOpen,
  onClose,
  onProceed,
  staffName,
  assignments,
  onDownloadForm,
}: StaffCommonFieldsWarningModalProps) {
  const [downloadingForms, setDownloadingForms] = useState<Set<number>>(
    new Set()
  );
  const [downloadedForms, setDownloadedForms] = useState<Set<number>>(
    new Set()
  );
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const downloadCancelledRef = useRef(false);

  // Reset cancellation flag when modal opens
  useEffect(() => {
    if (isOpen) {
      downloadCancelledRef.current = false;
      setIsDownloadingAll(false);
      setShowCloseConfirm(false);
    }
  }, [isOpen]);

  const handleDownload = async (assignmentId: number, formTitle: string) => {
    // Check if download was cancelled
    if (downloadCancelledRef.current) {
      return;
    }

    try {
      setDownloadingForms((prev) => new Set(prev).add(assignmentId));
      await onDownloadForm(assignmentId, formTitle);
      
      // Check again after download completes
      if (!downloadCancelledRef.current) {
        setDownloadedForms((prev) => new Set(prev).add(assignmentId));
      }
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
    downloadCancelledRef.current = false;
    setIsDownloadingAll(true);
    
    const formsToDownload = assignments.filter(
      (assignment) =>
        assignment.hasSubmission && !downloadedForms.has(assignment.id)
    );

    for (const assignment of formsToDownload) {
      // Check if download was cancelled before each download
      if (downloadCancelledRef.current) {
        console.log("Download process cancelled by user");
        break;
      }
      
      await handleDownload(assignment.id, assignment.form.title);
      
      // Check again after download
      if (downloadCancelledRef.current) {
        break;
      }
      
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    
    setIsDownloadingAll(false);
  };

  const handleStopDownloads = () => {
    downloadCancelledRef.current = true;
    setIsDownloadingAll(false);
    // Clear all downloading forms
    setDownloadingForms(new Set());
    console.log("Download process stopped by user");
  };

  const handleCloseClick = () => {
    // Check if downloads are in progress
    if (downloadingForms.size > 0 || isDownloadingAll) {
      setShowCloseConfirm(true);
    } else {
      // Reset cancellation flag when closing normally
      downloadCancelledRef.current = false;
      onClose();
    }
  };

  const handleConfirmClose = () => {
    // Stop downloads
    handleStopDownloads();
    // Close modal
    setShowCloseConfirm(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowCloseConfirm(false);
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-azure-200 animate-modal-appear">
        {/* Enhanced Header */}
        <div className="px-6 sm:px-8 py-6 bg-amber-50 via-gold-50 to-red-50 border-b border-azure-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-amber-500 to-gold-600 text-white shadow-soft">
                <FaExclamationTriangle className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-azure-700 mb-1">
                  Important: Download Forms Before Editing
                </h3>
                <div className="flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-azure-400" />
                  <p className="text-sm sm:text-base text-azure-400 truncate">
                    Backup current versions before updating staff details for{" "}
                    <span className="font-semibold text-gold-600">
                      {staffName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseClick}
              className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 flex-shrink-0 group"
            >
              <FaTimes className="h-5 w-5 text-azure-400 group-hover:text-azure-600 group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
          {/* Warning Information Card */}
          <div className="bg-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-6 mb-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500 text-white shadow-soft flex-shrink-0">
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
                      <li>• Staff detail changes affect all staff forms</li>
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
                    <p className="text-sm text-azure-400">
                      Ready for download and backup
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    disabled={downloadingForms.size > 0 || allDownloaded}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-azure-600 to-azure-700 text-white rounded-xl hover:from-azure-700 hover:to-azure-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-soft   disabled:transform-none"
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
                  
                  {/* Stop Button - Only show when downloading */}
                  {(downloadingForms.size > 0 || isDownloadingAll) && (
                    <button
                      type="button"
                      onClick={handleStopDownloads}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-soft  "
                    >
                      <FaStop className="h-4 w-4" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              {completedForms.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-azure-600">
                      Download Progress
                    </span>
                    <span className="text-sm font-bold text-azure-600">
                      {downloadedForms.size} / {completedForms.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-azure-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-azure-600 to-azure-700 h-3 rounded-full shadow-soft transition-all duration-500 ease-out"
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
                <div className="p-8 rounded-full bg-azure-100 to-azure-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <FaFileAlt className="h-16 w-16 text-azure-300" />
                </div>
                <h4 className="text-xl font-bold text-azure-700 mb-2">
                  No Forms Available
                </h4>
                <p className="text-azure-400">
                  No forms have been assigned to this staff member yet.
                </p>
              </div>
            ) : (
              assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className={`border-2 rounded-2xl p-6 transition-all duration-300 shadow-soft  ${
                    assignment.hasSubmission
                      ? downloadedForms.has(assignment.id)
                        ? "border-green-300 bg-emerald-50 to-green-100"
                        : "border-azure-200 bg-white hover:border-azure-100 hover:bg-gradient-to-br hover:from-azure-50 hover:to-azure-50"
                      : "border-azure-200 bg-azure-50 to-azure-100"
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
                          className={`p-3 rounded-xl shadow-soft ${
                            assignment.hasSubmission
                              ? downloadedForms.has(assignment.id)
                                ? "bg-emerald-600 to-green-600 text-white"
                                : "bg-azure-600 to-azure-600 text-white"
                              : "bg-azure-300 to-azure-400 text-white"
                          }`}
                        >
                          <FaFileAlt className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-azure-700 mb-1">
                            {assignment.form.title}
                          </h5>
                          <p className="text-sm text-azure-400">
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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-azure-100 to-azure-200 text-azure-600 border border-azure-300">
                          v{assignment.form.version}
                        </span>
                        {assignment.filledByAdmin && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-azure-100 to-azure-200 text-azure-700 border border-azure-200">
                            Admin Filled
                          </span>
                        )}
                        {assignment.staffSignature && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300">
                            Staff Signed
                          </span>
                        )}
                        {!assignment.hasSubmission && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-azure-100 to-azure-200 text-azure-400 border border-azure-300">
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
                            type="button"
                            onClick={() =>
                              handleDownload(
                                assignment.id,
                                assignment.form.title
                              )
                            }
                            disabled={downloadingForms.has(assignment.id)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-azure-600 to-azure-700 text-white rounded-xl hover:from-azure-700 hover:to-azure-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-soft   disabled:transform-none"
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
                        <div className="text-azure-400 bg-azure-100 px-4 py-2 rounded-xl border border-azure-200">
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
        <div className="px-6 sm:px-8 py-6 bg-azure-50 to-azure-100 border-t border-azure-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Information */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-azure-100 text-azure-600">
                <FaCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-azure-700">
                  {completedForms.length > 0
                    ? `${downloadedForms.size} of ${completedForms.length} forms downloaded`
                    : "No completed forms to download"}
                </div>
                <div className="text-sm text-azure-400">
                  {completedForms.length > 0 &&
                    !allDownloaded &&
                    "Download remaining forms for backup"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleCloseClick}
                className="px-6 py-3 text-azure-600 bg-white border-2 border-azure-300 rounded-xl hover:bg-azure-50 hover:border-azure-400 transition-all duration-200 font-semibold shadow-soft  "
              >
                Cancel
              </button>

              {completedForms.length > 0 && !allDownloaded && (
                <button
                  type="button"
                  onClick={onProceed}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-gold-600 text-white rounded-xl hover:from-amber-700 hover:to-gold-700 transition-all duration-200 font-semibold shadow-soft  "
                >
                  Skip Downloads & Proceed
                </button>
              )}

              {completedForms.length > 0 && allDownloaded && (
                <button
                  type="button"
                  onClick={onProceed}
                  className="px-6 py-3 bg-emerald-600 to-green-600 text-white rounded-xl hover:from-green-700 hover:to-green-700 transition-all duration-200 font-semibold shadow-soft  "
                >
                  All Downloaded. Now Proceed
                </button>
              )}

              {assignments.length === 0 && (
                <button
                  type="button"
                  onClick={onProceed}
                  className="px-6 py-3 bg-emerald-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-soft  "
                >
                  Proceed to Edit Staff Details
                </button>
              )}

              {assignments.length > 0 && completedForms.length === 0 && (
                <button
                  type="button"
                  onClick={onProceed}
                  className="px-6 py-3 bg-azure-600 to-azure-600 text-white rounded-xl hover:from-azure-700 hover:to-azure-700 transition-all duration-200 font-semibold shadow-soft  "
                >
                  Proceed to Edit Staff Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-azure-200 animate-modal-appear">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-amber-500 to-gold-600 text-white shadow-soft">
                  <FaExclamationTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-azure-700">
                    Stop Download Process?
                  </h3>
                </div>
              </div>
              
              <p className="text-azure-600 mb-6">
                Downloads are currently in progress. Closing the modal will stop all ongoing downloads. 
                Are you sure you want to continue?
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancelClose}
                  className="px-6 py-3 text-azure-600 bg-white border-2 border-azure-300 rounded-xl hover:bg-azure-50 hover:border-azure-400 transition-all duration-200 font-semibold shadow-soft "
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClose}
                  className="px-6 py-3 bg-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-soft "
                >
                  Yes, Stop & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

