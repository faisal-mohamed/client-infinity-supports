"use client";

import Link from 'next/link';
import { FaArrowLeft, FaUser, FaDownload, FaCalendarAlt } from 'react-icons/fa';

interface StaffFormHeaderProps {
  staffId: string;
  formTitle: string;
  staffName?: string;
  staffEmail?: string;
  version?: string;
  onDownload?: () => void;
  downloading?: boolean;
  showDownload?: boolean;
}

export default function StaffFormHeader({
  staffId,
  formTitle,
  staffName,
  staffEmail,
  version,
  onDownload,
  downloading = false,
  showDownload = true,
}: StaffFormHeaderProps) {
  const displayName = staffName || 'Unknown Staff';
  const displayEmail = staffEmail || '';

  return (
    <div className="bg-white shadow-sm border-b border-azure-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <Link
            href={`/admin/staff/${staffId}/forms`}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-azure-600 hover:text-azure-900 hover:bg-azure-100 rounded-lg transition-all duration-200 group"
          >
            <FaArrowLeft className="h-3.5 w-3.5 flex-shrink-0 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Forms</span>
          </Link>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-azure-700 to-gold-600 rounded-full flex items-center justify-center shadow-soft">
              <FaUser className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-azure-900 truncate">
                {formTitle}
              </h1>
              <div className="flex items-center text-sm text-azure-600 space-x-4 mt-1">
                <span className="font-medium">{displayName}</span>
                {displayEmail && (
                  <>
                    <span className="text-azure-400">•</span>
                    <span className="truncate">{displayEmail}</span>
                  </>
                )}
                {version && (
                  <>
                    <span className="text-azure-400">•</span>
                    <span className="flex items-center whitespace-nowrap">
                      <FaCalendarAlt className="h-3 w-3 mr-1" />
                      Version {version}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Download Button */}
          {showDownload && onDownload && (
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={onDownload}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 bg-azure-700 to-gold-600 text-white font-medium rounded-lg hover:from-gold-600 hover:to-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm "
              >
                <FaDownload className="h-4 w-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

