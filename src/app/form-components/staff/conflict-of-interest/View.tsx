"use client";

import React, { useEffect, useState } from 'react';
import AdminPDFCanvasViewer from '@/app/admin/components/AdminPDFCanvasViewer';

interface ConflictOfInterestViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  staffId?: number;
  showPDF?: boolean;
  hideHRSection?: boolean; // Hide HR section when viewing from admin
}

export default function ConflictOfInterestView({ 
  excludeLastPage = false, 
  children, 
  data = {},
  staffId,
  showPDF = false,
  hideHRSection = false
}: ConflictOfInterestViewProps) {
  // Extract form data - handle both direct data and nested data.data
  const formData = (data && data.data) ? data.data : data || {};
  
  // PDF URL - always show PDF if staffId is provided
  const pdfUrl = staffId ? `/api/staff/${staffId}/forms/conflict-of-interest/pdf` : '';

  // Helper functions
  const getValue = (key: string): string => {
    return formData[key] || '';
  };

  const getYesNo = (key: string): 'yes' | 'no' | '' => {
    const value = formData[key];
    if (value === 'yes' || value === true) return 'yes';
    if (value === 'no' || value === false) return 'no';
    return '';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  const renderCheckbox = (checked: boolean) => {
    return (
      <div className={`w-4 h-4 border border-azure-200 mx-auto flex items-center justify-center ${checked ? 'bg-azure-700' : 'bg-white'}`}>
        {checked && <span className="text-white text-xs font-bold">✓</span>}
      </div>
    );
  };

  const renderSignature = (signature: string) => {
    if (!signature) {
      return <div className="w-full h-24 border border-azure-100 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">No signature</div>;
    }
    return (
      <div className="w-full border border-azure-100 bg-white p-2">
        <img src={signature} alt="Signature" className="max-h-24 w-auto" />
      </div>
    );
  };

  // Check if admin fields exist
  const hasAdminData = !!(getValue('reviewedBy') || getValue('reviewerTitle') || getValue('reviewerSignature'));

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* PDF Viewer - Always show PDF if staffId is provided */}
        {staffId && pdfUrl && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <AdminPDFCanvasViewer pdfUrl={pdfUrl} />
          </div>
        )}

        {/* Admin Section - Simple message if admin data exists */}
        {hasAdminData && !hideHRSection && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-emerald-800 font-semibold">
              ✅ HR/Management section has been completed. This form is fully approved.
            </p>
          </div>
        )}

        {/* Download PDF Button */}
        {staffId && pdfUrl && (
          <div className="mt-6 text-center">
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

