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
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <Link
            href={`/admin/staff/${staffId}`}
            className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 group"
          >
            <FaArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Forms
          </Link>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
              <FaUser className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 truncate">
                {formTitle}
              </h1>
              <div className="flex items-center text-sm text-slate-600 space-x-4 mt-1">
                <span className="font-medium">{displayName}</span>
                {displayEmail && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="truncate">{displayEmail}</span>
                  </>
                )}
                {version && (
                  <>
                    <span className="text-slate-400">•</span>
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
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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

