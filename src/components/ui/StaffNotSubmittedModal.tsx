"use client";

import { FaClock, FaLink, FaPaperPlane } from 'react-icons/fa';
import Modal from './Modal';

interface StaffNotSubmittedModalProps {
  isOpen: boolean;
  onClose: () => void;
  formTitle: string;
  onResendLink?: () => void;
}

export default function StaffNotSubmittedModal({ 
  isOpen, 
  onClose, 
  formTitle,
  onResendLink
}: StaffNotSubmittedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <FaClock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Waiting for Staff Submission</h3>
            <p className="text-sm text-gray-600 mt-1">Form not yet completed by client/staff</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaLink className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">Client/Staff Form Not Submitted</p>
              <p className="mb-2">
                This form was sent to the client/staff via a signature link, but they <strong>haven't submitted their data yet</strong>.
              </p>
              <p className="text-blue-700">
                ⏳ Please wait for the client or support worker to complete and submit the form before proceeding with your review and approval.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Form:</span> {formTitle}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> You can edit this form only after the client/staff submits their portion via the signature link. Once they submit, you'll be able to review their data and complete your supervisor sections.
          </p>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
        {onResendLink && (
          <button
            onClick={onResendLink}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPaperPlane className="inline mr-2 h-4 w-4" />
            Resend Link
          </button>
        )}
        
        <button
          onClick={onClose}
          className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

