"use client";

import React, { useState } from 'react';
import FormPage from '@/components/ui/FormPage';

interface DocumentationAcknowledgementViewProps {
  excludeLastPage?: boolean;
  children?: React.ReactNode;
  data?: any;
  staffId?: number;
  showPDF?: boolean;
}

export default function DocumentationAcknowledgementView({ 
  excludeLastPage = false, 
  children, 
  data = {},
  staffId,
  showPDF = false
}: DocumentationAcknowledgementViewProps) {
  const [showPDFView, setShowPDFView] = useState(showPDF);
  
  // Extract form data - handle both direct data and nested data.data
  const formData = (data && data.data) ? data.data : data || {};

  // Helper functions
  const getValue = (key: string): string => {
    return formData[key] || '';
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

  const renderSignature = (signature: string) => {
    if (!signature) {
      return <div className="w-full min-h-32 border-2 border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-base rounded-lg">No signature</div>;
    }
    return (
      <div className="w-full border-2 border-gray-300 bg-white p-4 rounded-lg">
        <img src={signature} alt="Signature" className="max-h-32 w-auto" />
      </div>
    );
  };

  // If showing PDF, render PDF viewer using iframe
  if (showPDFView && staffId) {
    const pdfUrl = `/api/staff/${staffId}/forms/documentation-acknowledgement/pdf`;
    return (
      <div className="bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Documentation Acknowledgement - PDF View</h2>
            <button
              onClick={() => setShowPDFView(false)}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              View Form
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <iframe
              src={pdfUrl}
              className="w-full border border-gray-300 rounded"
              style={{ minHeight: '800px', height: '90vh' }}
              title="Documentation Acknowledgement PDF"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <FormPage
          title="Documentation Acknowledgement"
          meta={{ website: '', version: '', reviewDate: '' }}
        >
          {/* Document Receipt Confirmation Section */}
          <div className="mb-8">
            <p className="text-base text-gray-800 mb-6 leading-relaxed">
              I confirm I have received copies of the following documents from Infinity Supports WA.
            </p>
            <ul className="list-disc list-inside mb-6 space-y-3 text-base text-gray-800 ml-4 leading-relaxed">
              <li className="pl-2">First aid policy</li>
              <li className="pl-2">Vehicle safety policy</li>
              <li className="pl-2">Vehicle safety inspection checklist</li>
              <li className="pl-2">Training on bullying and harassment</li>
            </ul>
            <p className="text-base text-gray-800 mb-4 leading-relaxed">
              Copies of the same documents are available on{' '}
              <a
                href="http://www.infinitysupportswa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                www.infinitysupportswa.org
              </a>
              {' '}and could also be requested via email. I have read and understood the contents of these documents.
            </p>
          </div>

          {/* Commitments Section */}
          <div className="mb-8">
            <p className="text-base text-gray-800 mb-6 leading-relaxed">I also confirm that,</p>
            <ul className="list-disc list-inside mb-6 space-y-4 text-base text-gray-800 ml-4 leading-relaxed">
              <li className="pl-2">
                I will conduct vehicle safety inspection as per the checklist provided by Infinity Supports WA at the start of each working day.
              </li>
              <li className="pl-2">
                I will ensure that my driving license is valid, vehicle used for work purposes is registered, comprehensively insured and mechanically sound.
              </li>
              <li className="pl-2">
                I understand that I will be provided with a first aid kit to be always kept in my vehicle and the onus is on me to inform management should any contents of the first aid kits expire.
              </li>
              <li className="pl-2">I will work in compliance with NDIS code of conduct.</li>
            </ul>
          </div>

          {/* Signature Section */}
          <div className="mt-10 border-t-2 border-gray-300 pt-8">
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-3">Staff Name:</label>
              <div className="w-full min-h-12 px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 text-base rounded-lg">
                {getValue('staffName') || <span className="text-gray-400 italic">Not provided</span>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-3">Signature:</label>
              {renderSignature(getValue('signature'))}
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-3">Date:</label>
              <div className="w-full min-h-12 px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 text-base rounded-lg">
                {formatDate(getValue('date')) || <span className="text-gray-400 italic">Not provided</span>}
              </div>
            </div>
          </div>
        </FormPage>
        {staffId && (
          <div className="mt-8 text-center space-x-4">
            <button
              onClick={() => setShowPDFView(true)}
              className="px-6 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              View PDF
            </button>
            <a
              href={`/api/staff/${staffId}/forms/documentation-acknowledgement/pdf`}
              download
              className="px-6 py-3 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 inline-block transition-colors shadow-md"
            >
              Download PDF
            </a>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

