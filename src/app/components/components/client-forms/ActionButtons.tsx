"use client";

import Link from 'next/link';
import { FaPlus, FaUserEdit, FaLink, FaSpinner } from 'react-icons/fa';

interface ActionButtonsProps {
  clientId: number;
  selectedForms: number[];
  generatingLink: boolean;
  onShowAssignModal: () => void;
  onShowCommonFieldsWarning: () => void;
  onGenerateSignatureLink: () => void;
}

export default function ActionButtons({
  clientId,
  selectedForms,
  generatingLink,
  onShowAssignModal,
  onShowCommonFieldsWarning,
  onGenerateSignatureLink
}: ActionButtonsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons Row - Responsive Layout */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Action Buttons - Stack on mobile, horizontal on larger screens */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-3">
          <button
            onClick={onShowAssignModal}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FaPlus className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Assign Forms</span>
          </button>

          <button
            onClick={onShowCommonFieldsWarning}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FaUserEdit className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Update Common Details</span>
          </button>
          
          <Link
            href={`/admin/clients/${clientId}/signature-links`}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FaLink className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Manage Links</span>
          </Link>
          
          {selectedForms.length > 0 && (
            <button
              onClick={onGenerateSignatureLink}
              disabled={generatingLink}
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {generatingLink ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                  <span className="whitespace-nowrap">Generating...</span>
                </>
              ) : (
                <>
                  <FaLink className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Generate Link ({selectedForms.length})</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Status Text - Stack below buttons on mobile */}
        <div className="text-sm text-gray-500 text-center lg:text-right">
          {selectedForms.length > 0 ? (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium inline-block">
              {selectedForms.length} form{selectedForms.length > 1 ? 's' : ''} selected
            </span>
          ) : (
            <span className="hidden sm:inline">Select forms below to generate signature links</span>
          )}
        </div>
      </div>
    </div>
  );
}
