// "use client";

// import { FaExclamationTriangle, FaSignature } from 'react-icons/fa';
// import Modal from './Modal';

// interface EditWarningModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   formTitle: string;
//   onDownload: any;
// }

// export default function EditWarningModal({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   formTitle ,
//   onDownload
// }: EditWarningModalProps) {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
//       {/* Modal Header */}
//       <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200 rounded-t-2xl">
//         <div className="flex items-center gap-4">
//           <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
//             <FaExclamationTriangle className="h-6 w-6" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-gray-900">Edit Form Warning</h3>
//             <p className="text-sm text-gray-600 mt-1">This action may invalidate signatures</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Modal Content */}
//       <div className="p-6">
//         <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
//           <div className="flex items-start gap-3">
//             <FaSignature className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
//             <div className="text-sm text-amber-800">
//               <p className="font-semibold mb-2">Important Notice:</p>
//               <p className="mb-3">
//                 This form has been completed and contains client signatures. 
//                 <strong> Proceeding with editing may invalidate the signature(s)</strong> and the form will need to be re-signed.
//               </p>
//               <p className="text-amber-700">
//                 ⚠️ Please make sure to download a copy of this form before making any edits to preserve the original version.
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//           <p className="text-sm text-gray-600">
//             <span className="font-semibold">Form:</span> {formTitle}
//           </p>
//         </div>
//       </div>
      
//       {/* Modal Actions */}
//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
//         <button
//           onClick={onClose}
//           className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           Proceed to Edit
//         </button>
//         <button
//   onClick={onDownload}
//   className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
// >
//   Download PDF
// </button>
//       </div>
//     </Modal>
//   );
// }


"use client";

import { FaExclamationTriangle, FaSignature } from 'react-icons/fa';
import Modal from './Modal';

interface EditWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formTitle: string;
  onDownload: any;
  isLoading?: boolean;
}

export default function EditWarningModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formTitle,
  onDownload,
  isLoading = false
}: EditWarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-gray-200 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg">
            <FaExclamationTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Warning</h3>
            <p className="text-sm text-gray-600 mt-1">Editing may void signed data</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaSignature className="h-5 w-5 mt-0.5 text-rose-600 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">Signature Warning</p>
              <p className="mb-2">
                This form is <strong>already signed</strong>. Editing it may invalidate the signatures.
              </p>
              <p className="text-rose-700">
                ⚠️ Download the current signed version before editing.
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
          className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all shadow-md hover:shadow-lg"
        >
          Cancel
        </button>
        
        <button
          onClick={onDownload}
          className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Download PDF
        </button>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            'Proceed to Edit'
          )}
        </button>
      </div>
    </Modal>
  );
}
