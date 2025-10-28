// "use client";

// import { FaFileAlt, FaPlus, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
// import FormItem from './FormItem';
// import { FormAssignmentWithDetails } from '@/app/admin/clients/[id]/forms/types';

// interface FormsListProps {
//   assignments: FormAssignmentWithDetails[];
//   selectedForms: number[];
//   downloadingPDF: number | null;
//   clientId: number;
//   onFormSelect: (assignmentId: number, checked: boolean) => void;
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
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
//           {/* Enhanced Header */}
//           <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 border-b border-gray-200">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
//                   <FaClipboardList className="h-6 w-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 mb-1">Assigned Forms</h2>
//                   <p className="text-gray-600">Manage and track client form assignments</p>
//                 </div>
//               </div>
              
//               {assignments.length > 0 && (
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   {/* Selection Status */}
//                   {selectedForms.length > 0 ? (
//                     <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 shadow-md">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-indigo-500 text-white shadow-md">
//                           <FaCheckCircle className="h-5 w-5" />
//                         </div>
//                         <div>
//                           <div className="text-lg font-bold text-indigo-700">
//                             {selectedForms.length} Selected
//                           </div>
//                           <div className="text-sm font-medium text-indigo-600">Ready for link generation</div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-md">
//                       <div className="text-center">
//                         <div className="text-lg font-bold text-gray-900 mb-1">
//                           {assignments.length} Total Forms
//                         </div>
//                         <div className="text-sm text-gray-600">
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
//               <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
//                 <FaFileAlt className="h-16 w-16 text-gray-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">No Forms Assigned</h3>
//               <p className="text-gray-600 mb-8 text-base max-w-md mx-auto leading-relaxed">
//                 Get started by assigning some forms to this client. Once assigned, you can track their progress and manage submissions.
//               </p>
//               <button
//                 onClick={onShowAssignModal}
//                 className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                   <FaPlus className="h-4 w-4" />
//                 </div>
//                 <span>Assign Forms</span>
//               </button>
//             </div>
//           ) : (
//             /* Enhanced Forms List */
//             <div className="divide-y divide-gray-100">
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
  selectedForms: number[];
  downloadingPDF: number | null;
  clientId: number;
  onFormSelect: (assignmentId: number, checked: boolean) => void;
  onDownloadPDF: (assignment: FormAssignmentWithDetails) => void;
  onShowAssignModal: () => void;
}

export default function FormsList({
  assignments,
  selectedForms,
  downloadingPDF,
  clientId,
  onFormSelect,
  onDownloadPDF,
  onShowAssignModal
}: FormsListProps) {
  const completedForms = assignments.filter(a => a.currentStatus === 'completed').length;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">

          {/* Header */}
          <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600 shadow-md">
                  <FaClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Assigned Forms</h2>
                  <p className="text-gray-600">Manage and track client form assignments</p>
                </div>
              </div>

              {assignments.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedForms.length > 0 ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-600 text-white shadow-md">
                          <FaCheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-rose-700">
                            {selectedForms.length} Selected
                          </div>
                          <div className="text-sm text-rose-600">Ready for link generation</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          {assignments.length} Total Forms
                        </div>
                        <div className="text-sm text-gray-600">
                          Select forms to generate client signature links
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
              <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <FaFileAlt className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Forms Assigned</h3>
              <p className="text-gray-600 mb-8 text-base max-w-md mx-auto leading-relaxed">
                Get started by assigning forms to this client. Once assigned, you can track their progress and manage submissions.
              </p>
              <button
                onClick={onShowAssignModal}
                className="inline-flex items-center gap-3 px-8 py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPlus className="h-4 w-4" />
                <span>Assign Forms</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
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
                  />
                </div>
              ))}
            </div>
          )}
        </div>
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
