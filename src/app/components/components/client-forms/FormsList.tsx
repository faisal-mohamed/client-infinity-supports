// "use client";

// import { FaFileAlt, FaPlus, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
// import FormItem from './FormItem';
// import { FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

// interface FormsListProps {
//   assignments: FormAssignmentWithDetails[];
//   selectedForms: (string | number)[];
//   downloadingPDF: string | number | null;
//   clientId: string | number;
//   onFormSelect: (assignmentId: string | number, checked: boolean) => void;
//   onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
//   onShowAssignModal: () => void;
// }

// export default function FormsList({
//   assignments,
//   selectedForms,
//   downloadingPDF,
//   clientId,
//   onFormSelect,
//   onDownloadPDF,
//   onShowAssignModal
// }: FormsListProps) {
//   const completedForms = assignments.filter(a => a.currentStatus === 'completed').length;
//   const inProgressForms = assignments.filter(a => a.currentStatus === 'in_progress').length;
//   const notStartedForms = assignments.filter(a => a.currentStatus === 'not_started').length;

//   return (
//     <div className="bg-azure-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-soft border border-azure-50 overflow-hidden  transition-all duration-200">
//           {/* Enhanced Header */}
//           <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-azure-50 via-azure-50 to-azure-50 border-b border-azure-100">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-azure-500 to-azure-600 text-white shadow-soft">
//                   <FaClipboardList className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-azure-700 mb-1">Assigned Forms</h2>
//                   <p className="text-azure-500">Manage and track client form assignments</p>
//                 </div>
//               </div>
              
//               {assignments.length > 0 && (
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   {/* Selection Status */}
//                   {selectedForms.length > 0 ? (
//                     <div className="bg-azure-50 border border-azure-200 rounded-xl p-4 shadow-soft">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-azure-600 text-white shadow-soft">
//                           <FaCheckCircle className="h-5 w-5" />
//                         </div>
//                         <div>
//                           <div className="text-lg font-bold text-azure-700">
//                             {selectedForms.length} Selected
//                           </div>
//                           <div className="text-sm font-medium text-azure-700">Ready for link generation</div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-azure-50 border border-azure-100 rounded-xl p-4 shadow-soft">
//                       <div className="text-center">
//                         <div className="text-lg font-bold text-azure-700 mb-1">
//                           {assignments.length} Total Forms
//                         </div>
//                         <div className="text-sm text-azure-500">
//                           Select admin-filled forms to generate client links
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

           
            
//           </div>

//           {assignments.length === 0 ? (
//             /* Enhanced Empty State */
//             <div className="text-center py-16 px-6">
//               <div className="p-8 rounded-full bg-azure-100 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
//                 <FaFileAlt className="h-16 w-16 text-azure-300" />
//               </div>
//               <h3 className="text-base font-semibold text-azure-700 mb-3">No Forms Assigned</h3>
//               <p className="text-azure-500 mb-8 text-base max-w-md mx-auto leading-relaxed">
//                 Get started by assigning some forms to this client. Once assigned, you can track their progress and manage submissions.
//               </p>
//               <button
//                 onClick={onShowAssignModal}
//                 className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-azure-700 to-azure-800 text-white font-semibold rounded-xl hover:from-azure-800 hover:to-azure-800 transition-all duration-200 shadow-soft  "
//               >
//                 <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                   <FaPlus className="h-4 w-4" />
//                 </div>
//                 <span>Assign Forms</span>
//               </button>
//             </div>
//           ) : (
//             /* Enhanced Forms List */
//             <div className="divide-y divide-azure-50">
//               {assignments.map((assignment, index) => (
//                 <div
//                   key={assignment.id}
//                   style={{
//                     animationDelay: `${index * 50}ms`,
//                     animation: 'fadeInUp 0.6s ease-out forwards'
//                   }}
//                 >
//                   <FormItem
//                     assignment={assignment}
//                     clientId={clientId}
//                     selectedForms={selectedForms}
//                     downloadingPDF={downloadingPDF}
//                     onFormSelect={onFormSelect}
//                     onDownloadPDF={onDownloadPDF}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

        
//       </div>

//       {/* Enhanced Animations */}
//       <style jsx>{`
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
//       `}</style>
//     </div>
//   );
// }


"use client";

import { FaFileAlt, FaPlus, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import FormItem from './FormItem';
import { FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

interface FormsListProps {
  assignments: FormAssignmentWithDetails[];
  selectedForms: (string | number)[];
  downloadingPDF: string | number | null;
  clientId: string | number;
  onFormSelect: (assignmentId: string | number, checked: boolean) => void;
  onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
  onShowAssignModal: () => void;
  isStaff?: boolean;
}

export default function FormsList({
  assignments,
  selectedForms,
  downloadingPDF,
  clientId,
  onFormSelect,
  onDownloadPDF,
  onShowAssignModal,
  isStaff
}: FormsListProps) {
  const completedForms = assignments.filter(a => a.currentStatus === 'completed').length;

  return (
    <div className="py-6">
        <div className="bg-white rounded-2xl shadow-soft border border-azure-50 overflow-hidden  transition-all duration-200">

          {/* Header */}
          <div className="px-6 sm:px-8 py-6 bg-azure-50 border-b border-azure-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gold-100 text-gold-600 shadow-soft">
                  <FaClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-azure-700 mb-1">Assigned Forms</h2>
                  <p className="text-azure-500">Manage and track {isStaff ? 'staff' : 'participant'} form assignments</p>
                </div>
              </div>

              {assignments.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedForms.length > 0 ? (
                    <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gold-600 text-white shadow-soft">
                          <FaCheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gold-700">
                            {selectedForms.length} Selected
                          </div>
                          <div className="text-sm text-gold-600">Ready for link generation</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-azure-100 rounded-xl p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-azure-700 mb-1">
                          {assignments.length} Total Forms
                        </div>
                        <div className="text-sm text-azure-500">
                          Select forms to generate {isStaff ? 'staff' : 'participant'} signature links
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}
          {assignments.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="p-8 rounded-full bg-azure-100 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <FaFileAlt className="h-16 w-16 text-azure-300" />
              </div>
              <h3 className="text-base font-semibold text-azure-700 mb-3">No Forms Assigned</h3>
              <p className="text-azure-500 mb-8 text-base max-w-md mx-auto leading-relaxed">
                Get started by assigning forms to this {isStaff ? 'staff' : 'participant'}. Once assigned, you can track their progress and manage submissions.
              </p>
              <button
                onClick={onShowAssignModal}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold-600 text-white font-semibold rounded-xl hover:bg-gold-700 transition-all duration-200 shadow-soft  "
              >
                <FaPlus className="h-4 w-4" />
                <span>Assign Forms</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-azure-50">
              {assignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <FormItem
                    assignment={assignment}
                    clientId={clientId}
                    selectedForms={selectedForms}
                    downloadingPDF={downloadingPDF}
                    onFormSelect={onFormSelect}
                    onDownloadPDF={onDownloadPDF}
                    isStaff={isStaff}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Animations */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
