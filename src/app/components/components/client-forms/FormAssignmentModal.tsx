"use client";

import { FaTimes, FaFileAlt, FaSpinner, FaCheckCircle, FaPlus, FaUser } from 'react-icons/fa';
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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-gray-200 animate-modal-appear">
        {/* Enhanced Header */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <FaPlus className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Assign Forms
                </h3>
                <div className="flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-gray-500" />
                  <p className="text-sm sm:text-base text-gray-600 truncate">
                    Select forms to assign to <span className="font-semibold text-indigo-600">{clientName}</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 flex-shrink-0 group"
            >
              <FaTimes className="h-5 w-5 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
          {availableForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <FaFileAlt className="h-16 w-16 text-gray-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">No Forms Available</h4>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                All available forms have already been assigned to this client, or there are no forms configured in the system.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selection Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white shadow-md">
                    <FaCheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-800">
                      {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''} Selected
                    </div>
                    <div className="text-sm text-blue-600">
                      {availableForms.length - assignments.length} available • {assignments.length} already assigned
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Form List */}
              {availableForms.map((form, index) => {
                const isAlreadyAssigned = assignments.some(
                  assignment => assignment.formId === form.id && assignment.formVersion === form.version
                );
                const isSelected = selectedFormsToAssign.includes(form.id);
                
                return (
                  <div
                    key={`${form.id}-${form.version}`}
                    className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isAlreadyAssigned 
                        ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 opacity-60' 
                        : isSelected
                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-lg transform scale-[1.02]'
                        : 'bg-white border-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => !isAlreadyAssigned && onFormSelection(form.id)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Enhanced Checkbox */}
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onFormSelection(form.id)}
                          disabled={isAlreadyAssigned}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg disabled:opacity-50 shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Form Icon */}
                      <div className={`p-3 rounded-xl shadow-md flex-shrink-0 ${
                        isAlreadyAssigned 
                          ? 'bg-gray-400 text-white'
                          : isSelected
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:from-blue-600 group-hover:to-blue-700'
                      }`}>
                        <FaFileAlt className="h-5 w-5" />
                      </div>

                      {/* Form Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors duration-200">
                              {form.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                                Version {form.version}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                {form.formKey}
                              </span>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          {isAlreadyAssigned && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-md">
                                <FaCheckCircle className="h-4 w-4" />
                                Already Assigned
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <FaCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''} Selected
                </div>
                <div className="text-sm text-gray-600">
                  Ready to assign to {clientName}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={onAssignForms}
                disabled={selectedFormsToAssign.length === 0 || assigning}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {assigning ? (
                  <div className="flex items-center gap-2">
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    <span>Assigning Forms...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaPlus className="h-4 w-4" />
                    <span>Assign {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
