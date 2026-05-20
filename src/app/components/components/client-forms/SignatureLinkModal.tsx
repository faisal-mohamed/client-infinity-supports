"use client";

import Link from 'next/link';
import { FaTimes, FaFileAlt, FaCopy, FaLink } from 'react-icons/fa';
import React from 'react';
import ReactDOM from 'react-dom';

interface GeneratedLink {
  url: string;
  token: string;
  formsCount: number;
  forms: { formTitle: string; formKey: string; }[];
  expiresAt: string;
}

interface SignatureLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string | undefined;
  clientId: string | number;
  generatedLink: GeneratedLink | null;
  onCopyLink: (url: string) => void;
}

export default function SignatureLinkModal({
  isOpen,
  onClose,
  clientName,
  clientId,
  generatedLink,
  onCopyLink
}: SignatureLinkModalProps) {
  if (!isOpen || !generatedLink) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-azure-100 bg-emerald-50">
          <div className="min-w-0 flex-1 mr-4">
            <h3 className="text-base font-semibold text-azure-700">
              Signature Link Generated
            </h3>
            <p className="text-sm text-azure-500 mt-1 truncate">
              Share this link with {clientName} to collect signatures
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-azure-100 rounded-lg transition-colors flex-shrink-0"
          >
            <FaTimes className="h-5 w-5 text-azure-400" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="bg-azure-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-azure-600 mb-2">Signature Link:</p>
                <p className="text-sm text-azure-500 bg-white p-3 rounded border break-all">
                  {generatedLink.url}
                </p>
              </div>
              <button
                onClick={() => onCopyLink(generatedLink.url)}
                className="flex items-center justify-center px-3 py-2 bg-azure-700 text-white rounded-lg hover:bg-azure-800 transition-colors flex-shrink-0 w-full sm:w-auto"
              >
                <FaCopy className="mr-2 h-4 w-4" />
                Copy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-azure-50 rounded-lg p-4">
              <p className="text-sm font-medium text-azure-800">Forms Included</p>
              <p className="text-2xl font-bold text-azure-600">{generatedLink.formsCount}</p>
            </div>
            <div className="bg-gold-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gold-800">Expires</p>
              <p className="text-sm font-semibold text-gold-600">
                {new Date(generatedLink.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-azure-600 mb-3">Forms in this link:</p>
            <div className="space-y-2">
              {generatedLink.forms.map((form, index) => (
                <div key={index} className="flex items-center p-3 bg-azure-50 rounded-lg">
                  <FaFileAlt className="h-4 w-4 text-azure-300 mr-3 flex-shrink-0" />
                  <span className="text-sm text-azure-600 truncate">{form.formTitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-t border-azure-100 bg-azure-50 gap-3">
          <Link
            href={`/admin/clients/${clientId}/signature-links`}
            className="inline-flex items-center justify-center px-4 py-2 bg-azure-600 text-white rounded-lg hover:bg-azure-700 transition-colors order-2 sm:order-1"
            onClick={onClose}
          >
            <FaLink className="mr-2 h-4 w-4" />
            Manage All Links
          </Link>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-azure-700 text-white rounded-lg hover:bg-azure-800 transition-colors order-1 sm:order-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  // Render in a portal to escape any parent stacking contexts
  if (typeof window !== 'undefined') {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return modalContent;
}
