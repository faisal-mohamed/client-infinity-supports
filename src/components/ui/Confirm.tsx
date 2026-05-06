"use client";

import { useState, createContext, useContext, ReactNode } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';

export type ConfirmType = 'danger' | 'warning' | 'info' | 'question';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType>({ confirm: async () => false });
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => { setOptions(opts); setIsOpen(true); setResolveRef(() => resolve); });
  };

  const handleConfirm = () => { resolveRef?.(true); setIsOpen(false); };
  const handleCancel = () => { resolveRef?.(false); setIsOpen(false); };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <ConfirmDialog isOpen={isOpen} onClose={handleCancel} onConfirm={handleConfirm} title={options.title || 'Confirm'} message={options.message} confirmText={options.confirmText || 'Confirm'} cancelText={options.cancelText || 'Cancel'} type={options.type || 'question'} />
      )}
    </ConfirmContext.Provider>
  );
}

const typeConfig = {
  danger: { icon: <FaExclamationTriangle className="text-red-500 w-5 h-5" />, btn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500' },
  warning: { icon: <FaExclamationTriangle className="text-amber-500 w-5 h-5" />, btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' },
  info: { icon: <FaInfoCircle className="text-blue-500 w-5 h-5" />, btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' },
  question: { icon: <FaQuestionCircle className="text-blue-500 w-5 h-5" />, btn: 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500' },
};

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmText: string; cancelText: string; type: ConfirmType;
}) {
  if (!isOpen) return null;
  const { icon, btn } = typeConfig[type];

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}></div>
        <div className="bg-white rounded-xl max-w-sm w-full shadow-elevated border border-gray-200 z-10 animate-fade-in">
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="ml-8">
              {message.split('\n').map((line, i) => (
                <p key={i} className="text-sm text-gray-600">{line}</p>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition-colors" onClick={onClose}>
                {cancelText}
              </button>
              <button type="button" className={`px-3 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${btn}`} onClick={onConfirm}>
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
