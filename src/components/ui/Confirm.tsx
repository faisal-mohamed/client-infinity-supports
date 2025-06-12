"use client";

import { useState, createContext, useContext, ReactNode } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

// Define confirm types
export type ConfirmType = 'danger' | 'warning' | 'info' | 'question';

// Define confirm options
interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
}

// Define context type
interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// Create context with default values
const ConfirmContext = createContext<ConfirmContextType>({
  confirm: async () => false,
});

// Hook to use the confirm context
export const useConfirm = () => useContext(ConfirmContext);

// Confirm provider component
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(options);
      setIsOpen(true);
      setResolveRef(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolveRef) {
      resolveRef(true);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolveRef) {
      resolveRef(false);
    }
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <ConfirmDialog
          isOpen={isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={options.title || 'Confirm'}
          message={options.message}
          confirmText={options.confirmText || 'Confirm'}
          cancelText={options.cancelText || 'Cancel'}
          type={options.type || 'question'}
        />
      )}
    </ConfirmContext.Provider>
  );
}

// Confirm dialog component
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: ConfirmType;
}) {
  if (!isOpen) return null;

  // Get the appropriate icon and styles based on confirm type
  const getConfirmStyles = () => {
    switch (type) {
      case 'danger':
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
        return {
          icon: <FaInfoCircle className="text-blue-600 text-2xl" />,
          confirmBtnColor: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'question':
      default:
        return {
          icon: <FaQuestionCircle className="text-blue-600 text-2xl" />,
          confirmBtnColor: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const { icon, confirmBtnColor } = getConfirmStyles();

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
                onClick={onConfirm}
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
