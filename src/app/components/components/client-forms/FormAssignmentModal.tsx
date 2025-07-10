"use client";

import { FaTimes, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { AvailableForm, FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

interface FormAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string | undefined;
  availableForms: AvailableForm[];
  assignments: FormAssignmentWithDetails[];
  selectedFormsToAssign: number[];
  assigning: boolean;
  onFormSelection: (formId: number) => void;
  onAssignForms: () => void;
}

export default function FormAssignmentModal({
  isOpen,
  onClose,
  clientName,
  availableForms,
  assignments,
  selectedFormsToAssign,
  assigning,
  onFormSelection,
  onAssignForms
}: FormAssignmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="min-w-0 flex-1 mr-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Assign Forms to {clientName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Select forms to assign to this client
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {availableForms.length === 0 ? (
            <div className="text-center py-8">
              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No forms available to assign</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableForms.map((form) => {
                // Check if this form is already assigned
                const isAlreadyAssigned = assignments.some(
                  assignment => assignment.formId === form.id && assignment.formVersion === form.version
                );
                
                return (
                  <div
                    key={`${form.id}-${form.version}`}
                    className={`flex items-start sm:items-center p-3 sm:p-4 border rounded-xl transition-all duration-200 ${
                      isAlreadyAssigned 
                        ? 'bg-gray-50 border-gray-200 opacity-50' 
                        : selectedFormsToAssign.includes(form.id)
                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFormsToAssign.includes(form.id)}
                      onChange={() => onFormSelection(form.id)}
                      disabled={isAlreadyAssigned}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50 mt-0.5 sm:mt-0 flex-shrink-0"
                    />
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {form.title}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            Version {form.version} • Key: {form.formKey}
                          </p>
                        </div>
                        {isAlreadyAssigned && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                            Already Assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50 gap-3">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            {selectedFormsToAssign.length} form(s) selected
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={onAssignForms}
              disabled={selectedFormsToAssign.length === 0 || assigning}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
            >
              {assigning ? (
                <>
                  <FaSpinner className="inline mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                `Assign ${selectedFormsToAssign.length} Form(s)`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
