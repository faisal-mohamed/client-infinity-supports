"use client";

import Link from 'next/link';
import { FaEdit, FaEye, FaDownload, FaSpinner, FaTrash, FaLink } from 'react-icons/fa';
import Dropdown from './Dropdown';

interface FormActionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  onEditClick: () => void;
  clientId: string | number;
  assignmentId: string | number;
  hasSubmission: boolean;
  onDownloadPDF: () => void;
  downloadingPDF: boolean;
  onDeleteClick: any;
  deletingForm?: boolean;
  onGenerateLinkClick?: () => void;
  showGenerateLink?: boolean;
  generatingLink?: boolean;
  isStaff?: boolean;
  disabled?: boolean;
}

export default function FormActionDropdown({
  isOpen,
  onClose,
  triggerRef,
  onEditClick,
  clientId,
  assignmentId,
  hasSubmission,
  onDownloadPDF,
  downloadingPDF,
  onDeleteClick,
  deletingForm = false,
  onGenerateLinkClick,
  showGenerateLink,
  generatingLink,
  isStaff = false,
  disabled = false
}: FormActionDropdownProps) {
  const handleEditClick = () => {
    onEditClick();
    onClose();
  };

  const handleDeleteClick = () => {
    onDeleteClick();
    onClose();
  };

  const handleDownloadClick = () => {
    onDownloadPDF();
  };

  const handleGenerateLinkClick = () => {
    if (onGenerateLinkClick) onGenerateLinkClick();
    onClose();
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      align="right"
    >
      {/* Hide edit button for staff forms - they will be filled via generated link */}
      {!isStaff && (
        <button
          onClick={handleEditClick}
          disabled={disabled}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-azure-600 hover:bg-gradient-to-r hover:from-azure-50 hover:to-azure-100 hover:text-azure-700 transition-all duration-200 w-full text-left rounded-lg mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-2 rounded-lg bg-azure-100 text-azure-700">
            <FaEdit className="h-4 w-4" />
          </div>
          <span>Edit Form</span>
        </button>
      )}

      {hasSubmission && (
        <>
          <Link
            href={isStaff ? `/admin/staff/${clientId}/forms/view/${assignmentId}` : `/admin/clients/${clientId}/forms/view/${assignmentId}`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-azure-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 transition-all duration-200 rounded-lg mx-2"
            onClick={() => {
              setTimeout(() => onClose(), 100);
            }}
          >
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <FaEye className="h-4 w-4" />
            </div>
            <span>View Form</span>
          </Link>

          <button
            onClick={handleDownloadClick}
            disabled={downloadingPDF || disabled}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-azure-600 hover:bg-gradient-to-r hover:from-gold-50 hover:to-gold-100 hover:text-gold-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg mx-2"
          >
            <div className="p-2 rounded-lg bg-gold-100 text-gold-600">
              {downloadingPDF ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <FaDownload className="h-4 w-4" />
              )}
            </div>
            <span>{downloadingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </>
      )}

      {showGenerateLink && (
        <button
          onClick={handleGenerateLinkClick}
          disabled={!!generatingLink || disabled}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-azure-600 hover:bg-gradient-to-r hover:from-gold-50 hover:to-gold-100 hover:text-gold-700 transition-all duration-200 disabled:opacity-50 rounded-lg mx-2"
        >
          <div className="p-2 rounded-lg bg-gold-100 text-gold-600">
            {generatingLink ? (
              <FaSpinner className="h-4 w-4 animate-spin" />
            ) : (
              <FaLink className="h-4 w-4" />
            )}
          </div>
          <span>{generatingLink ? 'Generating Link...' : 'Generate Link'}</span>
        </button>
      )}

      <button
        onClick={handleDeleteClick}
        disabled={deletingForm || disabled}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-azure-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 w-full text-left rounded-lg mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
          {deletingForm ? (
            <FaSpinner className="h-4 w-4 animate-spin" />
          ) : (
            <FaTrash className="h-4 w-4" />
          )}
        </div>
        <span>{deletingForm ? 'Deleting...' : 'Delete Form'}</span>
      </button>
    </Dropdown>
  );
}
