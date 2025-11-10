"use client";

import React from 'react';
import { FaSave, FaCheck, FaSpinner, FaDownload, FaArrowLeft, FaEdit } from 'react-icons/fa';

interface FormButtonProps {
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'gradient';
  loading?: boolean;
  disabled?: boolean;
  icon?: 'save' | 'submit' | 'download' | 'back' | 'edit' | 'spinner';
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function FormButton({
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  children,
  className = '',
  fullWidth = false
}: FormButtonProps) {
  
  const getIcon = () => {
    if (loading) return <FaSpinner className="w-4 h-4 animate-spin" />;
    
    switch (icon) {
      case 'save': return <FaSave className="w-4 h-4" />;
      case 'submit': return <FaCheck className="w-4 h-4" />;
      case 'download': return <FaDownload className="w-4 h-4" />;
      case 'back': return <FaArrowLeft className="w-4 h-4" />;
      case 'edit': return <FaEdit className="w-4 h-4" />;
      case 'spinner': return <FaSpinner className="w-4 h-4 animate-spin" />;
      default: return null;
    }
  };

  const getVariantClasses = () => {
    const base = "flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (variant) {
      case 'primary':
        return `${base} bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg`;
      case 'secondary':
        return `${base} bg-gray-500 text-white hover:bg-gray-600 shadow-md hover:shadow-lg`;
      case 'success':
        return `${base} bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg`;
      case 'danger':
        return `${base} bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg`;
      case 'warning':
        return `${base} bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg`;
      case 'gradient':
        return `${base} bg-gradient-to-r from-blue-600 to-green-400 text-white hover:from-blue-700 hover:to-green-500 shadow-md hover:shadow-lg`;
      default:
        return `${base} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  const widthClass = fullWidth ? 'w-full' : 'w-full sm:w-auto';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getVariantClasses()} ${widthClass} ${className}`}
    >
      {getIcon()}
      {children}
    </button>
  );
}

