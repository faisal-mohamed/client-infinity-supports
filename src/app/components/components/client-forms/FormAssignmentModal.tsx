// "use client";

// import { FaTimes, FaFileAlt, FaSpinner, FaCheckCircle, FaPlus, FaUser } from 'react-icons/fa';
// import { AvailableForm, FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

// interface FormAssignmentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   clientName: string | undefined;
//   availableForms: AvailableForm[];
//   assignments: FormAssignmentWithDetails[];
//   selectedFormsToAssign: number[];
//   assigning: boolean;
//   onFormSelection: (formId: string | number) => void;
//   onAssignForms: () => void;
// }

// export default function FormAssignmentModal({
//   isOpen,
//   onClose,
//   clientName,
//   availableForms,
//   assignments,
//   selectedFormsToAssign,
//   assigning,
//   onFormSelection,
//   onAssignForms
// }: FormAssignmentModalProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden border border-azure-100 animate-modal-appear">
//         {/* Enhanced Header */}
//         <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-azure-50 via-azure-50 to-azure-50 border-b border-azure-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4 min-w-0 flex-1">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-azure-600 to-azure-800 text-white shadow-soft">
//                 <FaPlus className="h-6 w-6" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <h3 className="text-xl sm:text-base font-semibold text-azure-700 mb-1">
//                   Assign Forms
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <FaUser className="h-4 w-4 text-azure-400" />
//                   <p className="text-sm sm:text-base text-azure-500 truncate">
//                     Select forms to assign to <span className="font-semibold text-azure-700">{clientName}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 flex-shrink-0 group"
//             >
//               <FaTimes className="h-5 w-5 text-azure-400 group-hover:text-azure-600 group-hover:rotate-90 transition-all duration-200" />
//             </button>
//           </div>
//         </div>

//         {/* Enhanced Content Area */}
//         <div className="p-6 sm:p-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
//           {availableForms.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="p-8 rounded-full bg-azure-100 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
//                 <FaFileAlt className="h-16 w-16 text-azure-300" />
//               </div>
//               <h4 className="text-xl font-bold text-azure-700 mb-2">No Forms Available</h4>
//               <p className="text-azure-500 max-w-md mx-auto leading-relaxed">
//                 All available forms have already been assigned to this client, or there are no forms configured in the system.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* Selection Summary */}
//               <div className="bg-azure-50 rounded-xl p-4 border border-azure-100 mb-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-azure-500 text-white shadow-soft">
//                     <FaCheckCircle className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold text-azure-700">
//                       {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''} Selected
//                     </div>
//                     <div className="text-sm text-azure-600">
//                       {availableForms.length - assignments.length} available • {assignments.length} already assigned
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Form List */}
//               {availableForms.map((form, index) => {
//                 const isAlreadyAssigned = assignments.some(
//                   assignment => assignment.formId === form.id && assignment.formVersion === form.version
//                 );
//                 const isSelected = selectedFormsToAssign.includes(form.id);

//                 return (
//                   <div
//                     key={`${form.id}-${form.version}`}
//                     className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
//                       isAlreadyAssigned 
//                         ? 'bg-azure-50 border-azure-100 opacity-60' 
//                         : isSelected
//                         ? 'bg-gradient-to-br from-azure-50 to-azure-50 border-gold-300 shadow-soft transform scale-[1.02]'
//                         : 'bg-white border-azure-100 hover:bg-azure-50 hover:border-azure-200'
//                     }`}
//                     onClick={() => !isAlreadyAssigned && onFormSelection(form.id)}
//                     style={{
//                       animationDelay: `${index * 50}ms`,
//                       animation: 'fadeInUp 0.6s ease-out forwards'
//                     }}
//                   >
//                     <div className="flex items-start gap-4">
//                       {/* Enhanced Checkbox */}
//                       <div className="flex-shrink-0 mt-1">
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={() => onFormSelection(form.id)}
//                           disabled={isAlreadyAssigned}
//                           className="h-5 w-5 text-azure-700 focus:ring-gold-500 border-azure-200 rounded-lg disabled:opacity-50 shadow-sm"
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </div>

//                       {/* Form Icon */}
//                       <div className={`p-3 rounded-xl shadow-soft flex-shrink-0 ${
//                         isAlreadyAssigned 
//                           ? 'bg-azure-300 text-white'
//                           : isSelected
//                           ? 'bg-gradient-to-br from-azure-600 to-azure-800 text-white'
//                           : 'bg-azure-500 text-white group-hover:bg-azure-600'
//                       }`}>
//                         <FaFileAlt className="h-5 w-5" />
//                       </div>

//                       {/* Form Details */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
//                           <div className="min-w-0 flex-1">
//                             <h4 className="text-lg font-bold text-azure-700 mb-1 group-hover:text-azure-700 transition-colors duration-200">
//                               {form.title}
//                             </h4>
//                             <div className="flex flex-wrap items-center gap-3 text-sm text-azure-500">
//                               <span className="bg-azure-100 px-3 py-1 rounded-full font-medium">
//                                 Version {form.version}
//                               </span>
//                               <span className="bg-azure-100 text-azure-700 px-3 py-1 rounded-full font-medium">
//                                 {form.formKey}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Status Badge */}
//                           {isAlreadyAssigned && (
//                             <div className="flex-shrink-0">
//                               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
//                                 <FaCheckCircle className="h-4 w-4" />
//                                 Already Assigned
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Enhanced Footer */}
//         <div className="px-6 sm:px-8 py-6 bg-azure-50 border-t border-azure-100">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Selection Info */}
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-lg bg-azure-100 text-azure-700">
//                 <FaCheckCircle className="h-5 w-5" />
//               </div>
//               <div>
//                 <div className="text-lg font-bold text-azure-700">
//                   {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''} Selected
//                 </div>
//                 <div className="text-sm text-azure-500">
//                   Ready to assign to {clientName}
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-3 text-azure-600 bg-white border-2 border-azure-200 rounded-xl hover:bg-azure-50 hover:border-azure-300 transition-all duration-200 font-semibold shadow-soft hover:shadow-soft "
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={onAssignForms}
//                 disabled={selectedFormsToAssign.length === 0 || assigning}
//                 className="px-8 py-3 bg-gradient-to-r from-azure-700 to-azure-800 text-white rounded-xl hover:from-azure-800 hover:to-azure-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-soft   disabled:transform-none"
//               >
//                 {assigning ? (
//                   <div className="flex items-center gap-2">
//                     <FaSpinner className="h-4 w-4 animate-spin" />
//                     <span>Assigning Forms...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <FaPlus className="h-4 w-4" />
//                     <span>Assign {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''}</span>
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Animations */}
//       <style jsx>{`
//         @keyframes modal-appear {
//           from {
//             opacity: 0;
//             transform: scale(0.95) translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }

//         @keyframes fadeInUp {
//           from { 
//             opacity: 0; 
//             transform: translateY(20px); 
//           }
//           to { 
//             opacity: 1; 
//             transform: translateY(0); 
//           }
//         }

//         .animate-modal-appear {
//           animation: modal-appear 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }





"use client";

import { FaTimes, FaFileAlt, FaSpinner, FaCheckCircle, FaPlus, FaUser } from 'react-icons/fa';
import { AvailableForm, FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

const MULTI_INSTANCE_FORM_KEYS = ['home_visit_risk_assessment', 'emergency_drill'];

interface FormAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string | undefined;
  availableForms: AvailableForm[];
  assignments: FormAssignmentWithDetails[];
  selectedFormsToAssign: number[];
  assigning: boolean;
  onFormSelection: (formId: string | number) => void;
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-azure-100 animate-modal-appear">

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 flex-shrink-0 bg-azure-50/50 border-b border-azure-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
                <FaPlus className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-azure-800 mb-1">Assign Forms</h3>
                <div className="flex items-center gap-2">
                  <FaUser className="h-4 w-4 text-azure-400" />
                  <p className="text-sm sm:text-base text-azure-500 truncate">
                    Assign forms to <span className="font-semibold text-gold-600">{clientName}</span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200 group"
            >
              <FaTimes className="h-5 w-5 text-azure-400 group-hover:text-azure-600 group-hover:rotate-90 transition-all" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {availableForms.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-8 rounded-full bg-azure-100 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <FaFileAlt className="h-16 w-16 text-azure-300" />
              </div>
              <h4 className="text-xl font-bold text-azure-800 mb-2">No Forms Available</h4>
              <p className="text-azure-500 max-w-md mx-auto leading-relaxed">
                All available forms have already been assigned to this client, or no forms are currently configured.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selection Summary */}
              <div className="bg-gold-50 rounded-xl p-4 border border-gold-200 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-500 text-white shadow-soft">
                    <FaCheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gold-800">
                      {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''} Selected
                    </div>
                    <div className="text-sm text-gold-700">
                      {availableForms.length - assignments.length} available • {assignments.length} assigned
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Cards */}
              {availableForms.map((form, index) => {
                const isAlreadyAssigned = assignments.some(
                  a => a.formId === form.id && a.formVersion === form.version
                );
                const isSelected = selectedFormsToAssign.includes(form.id);

                return (
                  <div
                    key={`${form.id}-${form.version}`}
                    className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${isAlreadyAssigned && !MULTI_INSTANCE_FORM_KEYS.includes(form.formKey)
                      ? 'bg-azure-50 border-azure-100 opacity-60' // Disabled look for single-instance
                      : isSelected
                        ? 'bg-gold-50 border-gold-300 shadow-soft'
                        : 'bg-white border-azure-100 hover:bg-azure-50 hover:border-azure-200'
                      }`}
                    onClick={() => {
                      // Allow selection if NOT assigned OR if it supports multi-instance
                      if (!isAlreadyAssigned || MULTI_INSTANCE_FORM_KEYS.includes(form.formKey)) {
                        onFormSelection(form.id);
                      }
                    }}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onFormSelection(form.id)}
                          disabled={isAlreadyAssigned && !MULTI_INSTANCE_FORM_KEYS.includes(form.formKey)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-5 w-5 text-gold-600 border-azure-200 rounded-lg shadow-sm disabled:opacity-50"
                        />
                      </div>

                      <div className={`p-3 rounded-xl shadow-soft flex-shrink-0 ${isAlreadyAssigned && !MULTI_INSTANCE_FORM_KEYS.includes(form.formKey)
                        ? 'bg-azure-300 text-white'
                        : isSelected
                          ? 'bg-gold-500 text-azure-700'
                          : 'bg-azure-500 text-white group-hover:bg-azure-600'
                        }`}>
                        <FaFileAlt className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-bold text-azure-800 mb-1 group-hover:text-gold-600 transition-colors duration-200">
                              {form.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-azure-500">
                              <span className="bg-azure-100 px-3 py-1 rounded-full font-medium">
                                Version {form.version}
                              </span>
                              <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full font-medium">
                                {form.formKey}
                              </span>
                            </div>
                          </div>
                          {isAlreadyAssigned && (
                            MULTI_INSTANCE_FORM_KEYS.includes(form.formKey) ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-azure-100 text-azure-700 shadow-sm border border-azure-100">
                                <FaPlus className="h-3 w-3" />
                                Add Copy
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <FaCheckCircle className="h-4 w-4" />
                                Already Assigned
                              </span>
                            )
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

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 flex-shrink-0 bg-azure-50 border-t border-azure-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-100 text-gold-600">
                <FaCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-azure-800">
                  {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''} Selected
                </div>
                <div className="text-sm text-azure-500">Ready to assign to {clientName}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto text-center px-6 py-3 text-azure-600 bg-white border-2 border-azure-200 rounded-xl hover:bg-azure-50 hover:border-azure-300 font-semibold shadow-soft hover:shadow-soft "
              >
                Cancel
              </button>
              <button
                onClick={onAssignForms}
                disabled={selectedFormsToAssign.length === 0 || assigning}
                className="w-full sm:w-auto px-8 py-3 bg-azure-700 text-white rounded-xl hover:bg-azure-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-soft   disabled:transform-none"
              >
                {assigning ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="h-4 w-4 animate-spin" />
                    Assigning Forms...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaPlus className="h-4 w-4" />
                    Assign {selectedFormsToAssign.length} Form{selectedFormsToAssign.length !== 1 ? 's' : ''}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
