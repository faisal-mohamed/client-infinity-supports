// "use client";

// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// interface ToastMessage {
//   id: string;
//   type: 'success' | 'error' | 'info' | 'warning';
//   title: string;
//   message: string;
//   duration?: number;
// }

// interface ToastContextType {
//   showToast: (toast: Omit<ToastMessage, 'id'>) => void;
// }

// const ToastContext = createContext<ToastContextType | undefined>(undefined);

// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) {
//     throw new Error('useToast must be used within a ToastProvider');
//   }
//   return context;
// };

// export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [toasts, setToasts] = useState<ToastMessage[]>([]);

//   const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
//     const id = Math.random().toString(36).substr(2, 9);
//     const newToast = { ...toast, id };
    
//     setToasts(prev => [...prev, newToast]);

//     // Auto remove toast after duration
//     setTimeout(() => {
//       setToasts(prev => prev.filter(t => t.id !== id));
//     }, toast.duration || 5000);
//   }, []);

//   const removeToast = useCallback((id: string) => {
//     setToasts(prev => prev.filter(t => t.id !== id));
//   }, []);

//   const getIcon = (type: ToastMessage['type']) => {
//     switch (type) {
//       case 'success':
//         return <FaCheck className="w-5 h-5" />;
//       case 'error':
//         return <FaExclamationTriangle className="w-5 h-5" />;
//       case 'warning':
//         return <FaExclamationTriangle className="w-5 h-5" />;
//       case 'info':
//         return <FaInfoCircle className="w-5 h-5" />;
//       default:
//         return <FaInfoCircle className="w-5 h-5" />;
//     }
//   };

//   const getToastStyles = (type: ToastMessage['type']) => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-50 border-green-200 text-green-800';
//       case 'error':
//         return 'bg-red-50 border-red-200 text-red-800';
//       case 'warning':
//         return 'bg-yellow-50 border-yellow-200 text-yellow-800';
//       case 'info':
//         return 'bg-blue-50 border-blue-200 text-blue-800';
//       default:
//         return 'bg-gray-50 border-gray-200 text-gray-800';
//     }
//   };

//   return (
//     <ToastContext.Provider value={{ showToast }}>
//       {children}
      
//       {/* Toast Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <div
//             key={toast.id}
//             className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 ${getToastStyles(toast.type)}`}
//           >
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 {getIcon(toast.type)}
//               </div>
//               <div className="ml-3 flex-1">
//                 <p className="text-sm font-medium">{toast.title}</p>
//                 <p className="mt-1 text-sm opacity-90">{toast.message}</p>
//               </div>
//               <div className="ml-4 flex-shrink-0">
//                 <button
//                   onClick={() => removeToast(toast.id)}
//                   className="inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2"
//                 >
//                   <FaTimes className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// };


"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-600 text-xl" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-600 text-xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-blue-600 text-xl" />;
    }
  };

  const getToastStyles = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${getToastStyles(toast.type)}`}
          >
            <div className="flex items-start p-4">
              <div className="mr-3 mt-1">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                <p className="mt-1 text-sm text-gray-700">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-md"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
