"use client";

import Link from 'next/link';
import { FaEdit, FaEye, FaDownload, FaSpinner, FaTrash, FaLink } from 'react-icons/fa';
import Dropdown from './Dropdown';

interface FormActionDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  onEditClick: () => void;
  clientId: number;
  assignmentId: number;
  hasSubmission: boolean;
  onDownloadPDF: () => void;
  downloadingPDF: boolean;
  onDeleteClick:  any
  // Optional emergency-drill specific action
  onGenerateLinkClick?: () => void;
  showGenerateLink?: boolean;
  generatingLink?: boolean;
  isStaff?: boolean; // Indicates if this is for staff (defaults to false for client)
  disabled?: boolean; // Disable all actions (e.g., when modal is open)
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

  const handleDeleteClick = () =>{
    onDeleteClick();
    onClose();
  }

  const handleDownloadClick = () => {
    onDownloadPDF();
    onClose();
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
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 transition-all duration-200 w-full text-left rounded-lg mx-2 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <FaEdit className="h-4 w-4" />
          </div>
          <span>Edit Form</span>
        </button>
      )}
      
      {hasSubmission && (
        <>
          <Link
            href={isStaff ? `/admin/staff/${clientId}/forms/view/${assignmentId}` : `/admin/clients/${clientId}/forms/view/${assignmentId}`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 transition-all duration-200 rounded-lg mx-2 font-montserrat"
            onClick={onClose}
          >
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <FaEye className="h-4 w-4" />
            </div>
            <span>View Form</span>
          </Link>
          
          <button
            onClick={handleDownloadClick}
            disabled={downloadingPDF || disabled}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg mx-2 font-montserrat"
          >
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
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
          disabled={!!generatingLink}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-rose-100 hover:text-rose-700 transition-all duration-200 disabled:opacity-50 rounded-lg mx-2"
        >
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
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
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 transition-all duration-200 w-full text-left rounded-lg mx-2 font-montserrat"
      >
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
          <FaTrash className="h-4 w-4" />
        </div>
        <span>Delete Form</span>
      </button>
    </Dropdown>
  );
}