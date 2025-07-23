"use client";

import Link from 'next/link';
import { FaEdit, FaEye, FaDownload, FaSpinner, FaTrash } from 'react-icons/fa';
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
  onDeleteClick
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

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      align="right"
    >
      <button
        onClick={handleEditClick}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 transition-all duration-200 w-full text-left rounded-lg mx-2"
      >
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <FaEdit className="h-4 w-4" />
        </div>
        <span>Edit Form</span>
      </button>
      
      {hasSubmission && (
        <>
          <Link
            href={`/admin/clients/${clientId}/forms/view/${assignmentId}`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 transition-all duration-200 rounded-lg mx-2"
            onClick={onClose}
          >
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <FaEye className="h-4 w-4" />
            </div>
            <span>View Form</span>
          </Link>
          
          <button
            onClick={handleDownloadClick}
            disabled={downloadingPDF}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 transition-all duration-200 disabled:opacity-50 rounded-lg mx-2"
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

      <button
        onClick={handleDeleteClick}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 transition-all duration-200 w-full text-left rounded-lg mx-2"
      >
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
          <FaTrash className="h-4 w-4" />
        </div>
        <span>Delete Form</span>
      </button>
    </Dropdown>
  );
}
