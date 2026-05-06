"use client";

import { ReactNode } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const styles = {
  success: { icon: <FaCheckCircle className="text-emerald-500 w-4 h-4" />, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  error: { icon: <FaExclamationTriangle className="text-red-500 w-4 h-4" />, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  warning: { icon: <FaExclamationTriangle className="text-amber-500 w-4 h-4" />, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  info: { icon: <FaInfoCircle className="text-blue-500 w-4 h-4" />, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
};

export default function Alert({ type, title, children, onClose, className = '' }: AlertProps) {
  const s = styles[type];
  return (
    <div className={`${s.bg} ${s.border} border rounded-lg p-3 ${className}`} role="alert">
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
        <div className="flex-1 min-w-0">
          {title && <p className={`text-sm font-medium ${s.text}`}>{title}</p>}
          <div className={`text-sm ${s.text} ${title ? 'mt-0.5' : ''}`}>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 flex-shrink-0" aria-label="Close">
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
