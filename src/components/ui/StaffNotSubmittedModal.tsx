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
      <div className="px-6 py-4 bg-azure-50 to-azure-50 border-b border-azure-100 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-azure-600 to-azure-600 text-white shadow-soft">
            <FaClock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-azure-700">Waiting for Staff Submission</h3>
            <p className="text-sm text-azure-500 mt-1">Form not yet completed by client/staff</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="bg-azure-50 border border-azure-100 text-azure-700 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaLink className="h-5 w-5 mt-0.5 text-azure-600 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">Client/Staff Form Not Submitted</p>
              <p className="mb-2">
                This form was sent to the client/staff via a signature link, but they <strong>haven't submitted their data yet</strong>.
              </p>
              <p className="text-azure-700">
                ⏳ Please wait for the client or support worker to complete and submit the form before proceeding with your review and approval.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-azure-50 border border-azure-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-azure-600">
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
      <div className="px-6 py-4 bg-azure-50 border-t border-azure-100 rounded-b-2xl flex justify-end gap-3">
        {onResendLink && (
          <button
            onClick={onResendLink}
            className="px-6 py-3 text-sm font-semibold text-white bg-azure-600 to-azure-700 rounded-xl hover:from-azure-700 hover:to-azure-700 transition-all shadow-soft  "
          >
            <FaPaperPlane className="inline mr-2 h-4 w-4" />
            Resend Link
          </button>
        )}
        
        <button
          onClick={onClose}
          className="px-6 py-3 text-sm font-semibold text-azure-600 bg-white border-2 border-azure-200 rounded-xl hover:bg-azure-50 hover:border-azure-300 transition-all duration-200 shadow-soft "
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

