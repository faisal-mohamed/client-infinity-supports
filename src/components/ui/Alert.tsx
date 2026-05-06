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
  warning: { icon: <FaExclamationTriangle className="text-gold-500 w-4 h-4" />, bg: 'bg-gold-50', border: 'border-gold-200', text: 'text-gold-800' },
  info: { icon: <FaInfoCircle className="text-azure-500 w-4 h-4" />, bg: 'bg-azure-50', border: 'border-azure-200', text: 'text-azure-800' },
};

export default function Alert({ type, title, children, onClose, className = '' }: AlertProps) {
  const s = styles[type];
  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-3.5 ${className}`} role="alert">
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
        <div className="flex-1 min-w-0">
          {title && <p className={`text-sm font-semibold ${s.text}`}>{title}</p>}
          <div className={`text-sm ${s.text} ${title ? 'mt-0.5' : ''}`}>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-azure-300 hover:text-azure-500 flex-shrink-0 transition-colors" aria-label="Close">
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
