// "use client";

// import Link from 'next/link';
// import { FaPlus, FaUserEdit, FaLink, FaSpinner, FaCog, FaCheckCircle } from 'react-icons/fa';

// interface ActionButtonsProps {
//   clientId: number;
//   selectedForms: number[];
//   generatingLink: boolean;
//   onShowAssignModal: () => void;
//   onShowCommonFieldsWarning: () => void;
//   onGenerateSignatureLink: () => void;
//   sendEmailNotification: () => any;
//   sendingEmail: boolean;
// }

// export default function ActionButtons({
//   clientId,
//   selectedForms,
//   generatingLink,
//   onShowAssignModal,
//   onShowCommonFieldsWarning,
//   onGenerateSignatureLink,
//   sendEmailNotification,
//   sendingEmail
// }: ActionButtonsProps) {
//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Action Buttons Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
//           {/* Action Buttons Row - Enhanced Responsive Layout */}
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             {/* Enhanced Action Buttons - Stack on mobile, horizontal on larger screens */}
//             <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-4">
//               {/* Assign Forms Button */}
//               <button
//                 onClick={onShowAssignModal}
//                 className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
//               >
//                 <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                   <FaPlus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
//                 </div>
//                 <span className="whitespace-nowrap">Assign Forms</span>
//               </button>

//               {/* Update Common Details Button */}
//               <button
//                 onClick={onShowCommonFieldsWarning}
//                 className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
//               >
//                 <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                   <FaUserEdit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
//                 </div>
//                 <span className="whitespace-nowrap">Update Common Details</span>
//               </button>
              
//               {/* Manage Links Button */}
//               <Link
//                 href={`/admin/clients/${clientId}/signature-links`}
//                 className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
//               >
//                 <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                   <FaCog className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
//                 </div>
//                 <span className="whitespace-nowrap">Manage Links</span>
//               </Link>
              
//               {/* Generate Link Button - Conditional */}
//               {selectedForms.length > 0 && (
//                 <button
//                   onClick={onGenerateSignatureLink}
//                   disabled={generatingLink}
//                   className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
//                 >
//                   <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                     {generatingLink ? (
//                       <FaSpinner className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <FaLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
//                     )}
//                   </div>
//                   <span className="whitespace-nowrap">
//                     {generatingLink ? 'Generating...' : `Generate Link (${selectedForms.length})`}
//                   </span>
//                 </button>
//               )}

//                {selectedForms.length > 0 && (
//                 <button
//                   onClick={sendEmailNotification}
//                   disabled={sendingEmail}
//                   className="group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
//                 >
//                   <div className="p-1 rounded-lg bg-white bg-opacity-20">
//                     {sendingEmail ? (
//                       <FaSpinner className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <FaLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
//                     )}
//                   </div>
//                   <span className="whitespace-nowrap">
//                     {sendingEmail ? 'Sending...' : `Send Email (${selectedForms.length})`}
//                   </span>
//                 </button>
//               )}
//             </div>
            
//             {/* Enhanced Status Display */}
//             <div className="flex-shrink-0">
//               {selectedForms.length > 0 ? (
//                 // <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-md">
//                 //   <div className="flex items-center gap-3">
//                 //     <div className="p-2 rounded-lg bg-green-500 text-white shadow-md">
//                 //       <FaCheckCircle className="h-5 w-5" />
//                 //     </div>
//                 //     <div>
//                 //       <div className="text-lg font-bold text-green-700">
//                 //         {selectedForms.length} Form{selectedForms.length > 1 ? 's' : ''}
//                 //       </div>
//                 //       <div className="text-sm font-medium text-green-600">Selected for Action</div>
//                 //     </div>
//                 //   </div>
//                 // </div>
//                 <></>
//               ) : (
//                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-md">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-lg bg-gray-400 text-white shadow-md">
//                       <FaLink className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <div className="text-sm font-semibold text-gray-700">Ready to Generate</div>
//                       <div className="text-xs text-gray-500">Select forms below to create signature links</div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Enhanced Help Text */}
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//               <div className="flex items-start gap-3">
//                 <div className="p-2 rounded-lg bg-blue-500 text-white shadow-md flex-shrink-0">
//                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="text-sm font-semibold text-blue-800 mb-1">Quick Actions Guide</h4>
//                   <ul className="text-xs text-blue-700 space-y-1">
//                     <li>• <strong>Assign Forms:</strong> Add new forms to this client's workflow</li>
//                     <li>• <strong>Update Details:</strong> Modify client's common information across all forms</li>
//                     <li>• <strong>Manage Links:</strong> View and control all signature links for this client</li>
//                     <li>• <strong>Generate Link:</strong> Create signature links for selected forms</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import Link from 'next/link';
import { FaPlus, FaUserEdit, FaLink, FaSpinner, FaCog } from 'react-icons/fa';

interface ActionButtonsProps {
  clientId: number;
  selectedForms: number[];
  generatingLink: boolean;
  onShowAssignModal: () => void;
  onShowCommonFieldsWarning: () => void;
  onGenerateSignatureLink: () => void;
  sendEmailNotification: () => any;
  sendingEmail: boolean;
}

export default function ActionButtons({
  clientId,
  selectedForms,
  generatingLink,
  onShowAssignModal,
  onShowCommonFieldsWarning,
  onGenerateSignatureLink,
  sendEmailNotification,
  sendingEmail
}: ActionButtonsProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Responsive Button Group */}
            <div className="flex flex-wrap gap-4 w-full lg:max-w-4xl">
              <button
                onClick={onShowAssignModal}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <div className="p-1 rounded-lg bg-white bg-opacity-20">
                  <FaPlus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                </div>
                <span>Assign Forms</span>
              </button>

              <button
                onClick={onShowCommonFieldsWarning}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <div className="p-1 rounded-lg bg-white bg-opacity-20">
                  <FaUserEdit className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span>Update Common Details</span>
              </button>

              <Link
                href={`/admin/clients/${clientId}/signature-links`}
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                <div className="p-1 rounded-lg bg-white bg-opacity-20">
                  <FaCog className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                </div>
                <span>Manage Links</span>
              </Link>

              {selectedForms.length > 0 && (
                <button
                  onClick={onGenerateSignatureLink}
                  disabled={generatingLink}
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
                >
                  <div className="p-1 rounded-lg bg-white bg-opacity-20">
                    {generatingLink ? (
                      <FaSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <FaLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </div>
                  <span>
                    {generatingLink ? 'Generating...' : `Generate Link (${selectedForms.length})`}
                  </span>
                </button>
              )}

              {selectedForms.length > 0 && (
                <button
                  onClick={sendEmailNotification}
                  disabled={sendingEmail}
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
                >
                  <div className="p-1 rounded-lg bg-white bg-opacity-20">
                    {sendingEmail ? (
                      <FaSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <FaLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    )}
                  </div>
                  <span>
                    {sendingEmail ? 'Sending...' : `Send Email (${selectedForms.length})`}
                  </span>
                </button>
              )}
            </div>

            {/* Responsive Status Display */}
            <div className="w-full lg:w-auto">
              {selectedForms.length === 0 && (
                <div className="mt-2 sm:mt-4 lg:mt-0 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-400 text-white shadow-md">
                      <FaLink className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700">Ready to Generate</div>
                      <div className="text-xs text-gray-500">Select forms below to create signature links</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white shadow-md flex-shrink-0">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Quick Actions Guide</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>Assign Forms:</strong> Add new forms to this client's workflow</li>
                    <li>• <strong>Update Details:</strong> Modify client's common information across all forms</li>
                    <li>• <strong>Manage Links:</strong> View and control all signature links for this client</li>
                    <li>• <strong>Generate Link:</strong> Create signature links for selected forms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
