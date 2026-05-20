"use client";

import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface FormInfo {
  id: string | number;
  title: string;
  version: number;
  formKey: string;
}

interface SignatureInvalidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'common-fields' | 'form-edit';
  affectedForms: FormInfo[];
  changes: string[];
  isProcessing?: boolean;
}

export default function SignatureInvalidationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  affectedForms,
  changes,
  isProcessing = false
}: SignatureInvalidationModalProps) {
  if (!isOpen) return null;

  const formatFieldName = (field: string): string => {
    // Convert camelCase and snake_case to readable format
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-azure-100 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-900">
                Signature Invalidation Warning
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This action will clear existing signatures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <FaTimes className="h-5 w-5 text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <p className="text-azure-600 mb-4">
              {type === 'common-fields' 
                ? 'Updating common fields will invalidate signatures on the following forms:'
                : 'Updating this form will invalidate its existing signatures:'
              }
            </p>
          </div>
          
          {/* Affected Forms List */}
          <div className="mb-6">
            <h4 className="font-medium text-azure-700 mb-3">Affected Forms ({affectedForms.length}):</h4>
            <div className="space-y-2">
              {affectedForms.map(form => (
                <div key={form.id} className="flex items-center justify-between p-3 bg-azure-50 rounded-lg">
                  <div>
                    <p className="font-medium text-azure-700">{form.title}</p>
                    <p className="text-sm text-azure-500">Version {form.version}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Signature Required
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Changed Fields */}
          {changes.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-azure-700 mb-3">Fields Being Changed ({changes.length}):</h4>
              <div className="flex flex-wrap gap-2">
                {changes.map(field => (
                  <span key={field} className="px-3 py-1 bg-gold-100 text-gold-700 text-sm rounded-full">
                    {formatFieldName(field)}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Impact Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-yellow-900 mb-1">Impact:</h5>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Client will need to re-sign {affectedForms.length} form(s)</li>
                  <li>• All existing signatures will be permanently removed</li>
                  <li>• New signature links will need to be generated</li>
                  {type === 'common-fields' && (
                    <li>• This affects all forms because common fields are shared</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-azure-100 bg-azure-50">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-azure-600 bg-white border border-azure-200 rounded-lg hover:bg-azure-50 transition-colors disabled:opacity-50"
          >
            Cancel Changes
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>Proceed & Clear Signatures</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { FormInfo };
