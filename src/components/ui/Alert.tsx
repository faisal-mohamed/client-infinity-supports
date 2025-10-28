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

export default function Alert({ type, title, children, onClose, className = '' }: AlertProps) {
  // Get the appropriate icon and styles based on alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          textColor: 'text-green-800',
          titleColor: 'text-green-800',
        };
      case 'error':
        return {
          icon: <FaExclamationTriangle className="text-red-500" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-800',
          titleColor: 'text-red-800',
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-800',
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-800',
          titleColor: 'text-blue-800',
        };
    }
  };

  const { icon, bgColor, borderColor, textColor, titleColor } = getAlertStyles();

  return (
    <div className={`${bgColor} ${borderColor} border-l-4 p-4 rounded-md ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        <div className="flex-1">
          {title && <h3 className={`font-medium ${titleColor}`}>{title}</h3>}
          <div className={textColor}>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
}
