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
//       <div className="px-6 py-4 bg-gradient-to-r from-gold-50 to-red-50 border-b border-azure-100 rounded-t-2xl">
//         <div className="flex items-center gap-4">
//           <div className="p-3 rounded-xl bg-gradient-to-br from-gold-500 to-red-600 text-white shadow-lg">
//             <FaExclamationTriangle className="h-6 w-6" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-azure-700">Edit Form Warning</h3>
//             <p className="text-sm text-azure-500 mt-1">This action may invalidate signatures</p>
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
        
//         <div className="bg-azure-50 rounded-xl p-4 border border-azure-100">
//           <p className="text-sm text-azure-500">
//             <span className="font-semibold">Form:</span> {formTitle}
//           </p>
//         </div>
//       </div>
      
//       {/* Modal Actions */}
//       <div className="px-6 py-4 bg-azure-50 border-t border-azure-100 rounded-b-2xl flex justify-end gap-3">
//         <button
//           onClick={onClose}
//           className="px-6 py-3 text-sm font-semibold text-azure-600 bg-white border-2 border-azure-200 rounded-xl hover:bg-azure-50 hover:border-azure-300 transition-all duration-200 shadow-md hover:shadow-lg"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gold-600 to-red-600 rounded-xl hover:from-gold-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//         >
//           Proceed to Edit
//         </button>
//         <button
//   onClick={onDownload}
//   className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-azure-600 to-azure-700 rounded-xl hover:from-azure-700 hover:to-azure-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
}

export default function EditWarningModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  formTitle,
  onDownload
}: EditWarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg w-full">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gold-50 to-amber-50 border-b border-azure-100 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gold-500 to-amber-500 text-white shadow-lg">
            <FaExclamationTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-azure-700">Edit Warning</h3>
            <p className="text-sm text-azure-500 mt-1">Editing may void signed data</p>
          </div>
        </div>
      </div>
      
      {/* Body */}
      <div className="p-6">
        <div className="bg-gold-50 border border-gold-200 text-gold-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FaSignature className="h-5 w-5 mt-0.5 text-gold-600 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">Signature Warning</p>
              <p className="mb-2">
                This form is <strong>already signed</strong>. Editing it may invalidate the signatures.
              </p>
              <p className="text-gold-700">
                ⚠️ Download the current signed version before editing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-azure-50 border border-azure-100 rounded-xl p-4">
          <p className="text-sm text-azure-600">
            <span className="font-semibold">Form:</span> {formTitle}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-azure-50 border-t border-azure-100 rounded-b-2xl flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-3 text-sm font-semibold text-azure-600 bg-white border border-azure-200 rounded-xl hover:bg-azure-100 hover:border-azure-300 transition-all shadow-md hover:shadow-lg"
        >
          Cancel
        </button>
        
        <button
          onClick={onDownload}
          className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-azure-600 to-azure-700 rounded-xl hover:from-azure-700 hover:to-azure-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Download PDF
        </button>

        <button
          onClick={onConfirm}
          className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-gold-600 to-gold-700 rounded-xl hover:from-gold-700 hover:to-gold-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Proceed to Edit
        </button>
      </div>
    </Modal>
  );
}
