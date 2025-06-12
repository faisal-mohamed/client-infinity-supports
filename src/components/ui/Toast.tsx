"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Define toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Define toast data structure
export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  title?: string;
}

// Define context type
interface ToastContextType {
  toasts: ToastData[];
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  hideToast: (id: string) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

// Hook to use the toast context
export const useToast = () => useContext(ToastContext);

// Toast provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Function to show a toast
  const showToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  };

  // Function to hide a toast
  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Toast container component
function ToastContainer() {
  const { toasts, hideToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>
  );
}

// Individual toast component
function Toast({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  // Get the appropriate icon and styles based on toast type
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-white text-xl" />,
          bgColor: 'bg-green-600',
          borderColor: 'border-green-700',
        };
      case 'error':
        return {
          icon: <FaExclamationTriangle className="text-white text-xl" />,
          bgColor: 'bg-red-600',
          borderColor: 'border-red-700',
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle className="text-white text-xl" />,
          bgColor: 'bg-yellow-500',
          borderColor: 'border-yellow-600',
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle className="text-white text-xl" />,
          bgColor: 'bg-blue-600',
          borderColor: 'border-blue-700',
        };
    }
  };

  const { icon, bgColor, borderColor } = getToastStyles();

  return (
    <div
      className={`${bgColor} ${borderColor} border-l-4 rounded-md shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in`}
      role="alert"
    >
      <div className="flex p-4 items-center">
        <div className="flex-shrink-0 mr-3">{icon}</div>
        <div className="flex-1 mr-2">
          {toast.title && (
            <h3 className="font-medium text-white">{toast.title}</h3>
          )}
          <p className="text-white">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

// Alert dialog component for confirmations
export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ToastType;
}) {
  if (!isOpen) return null;

  // Get the appropriate icon and styles based on alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-600 text-2xl" />,
          confirmBtnColor: 'bg-green-600 hover:bg-green-700',
        };
      case 'error':
        return {
          icon: <FaExclamationTriangle className="text-red-600 text-2xl" />,
          confirmBtnColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle className="text-yellow-500 text-2xl" />,
          confirmBtnColor: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle className="text-blue-600 text-2xl" />,
          confirmBtnColor: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const { icon, confirmBtnColor } = getAlertStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="bg-white rounded-lg max-w-md w-full mx-auto shadow-xl z-10 overflow-hidden transform transition-all animate-fade-in">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">{icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            
            <div className="mt-2">
              <p className="text-gray-600">{message}</p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${confirmBtnColor} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
