"use client";

import { FaExclamationTriangle, FaSignature } from 'react-icons/fa';
import Modal from './Modal';

interface AdminEditWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formTitle: string;
  isLoading?: boolean;
}

export default function AdminEditWarningModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formTitle,
  isLoading = false
}: AdminEditWarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-gray-200 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg">
            <FaExclamationTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Admin Section Warning</h3>
            <p className="text-sm text-gray-600 mt-1">Editing will clear admin signature</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaSignature className="h-5 w-5 mt-0.5 text-rose-600 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">Admin Signature Warning</p>
              <p className="mb-2">
                This admin section is <strong>already signed</strong>. Editing it will <strong>clear the admin signature</strong> and the form will need to be re-approved.
              </p>
              <p className="text-rose-700">
                ⚠️ The admin signature will be removed when you proceed with editing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Form:</span> {formTitle}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Clearing...</span>
            </>
          ) : (
            'Continue & Clear Signature'
          )}
        </button>
      </div>
    </Modal>
  );
}

