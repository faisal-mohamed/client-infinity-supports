

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, JSX } from 'react';
import { 
  FaCheck, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes, 
  FaExclamationCircle,
  FaCheckCircle 
} from 'react-icons/fa';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean; // Won't auto-dismiss
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  clearAllToasts: () => void;
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
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss unless persistent
    if (!toast.persistent) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Keyboard support - ESC to clear all toasts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && toasts.length > 0) {
        clearAllToasts();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toasts.length, clearAllToasts]);

  const getIcon = (type: ToastMessage['type']) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    switch (type) {
      case 'success':
        return <FaCheckCircle className={`${iconClass} text-emerald-500`} />;
      case 'error':
        return <FaExclamationCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <FaExclamationTriangle className={`${iconClass} text-gold-500`} />;
      case 'info':
      default:
        return <FaInfoCircle className={`${iconClass} text-azure-500`} />;
    }
  };

  const getToastStyles = (type: ToastMessage['type']) => {
    const baseStyles = "backdrop-blur-sm border-l-4 shadow-lg";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-white/95 border-l-emerald-500 border-emerald-100`;
      case 'error':
        return `${baseStyles} bg-white/95 border-l-red-500 border-red-100`;
      case 'warning':
        return `${baseStyles} bg-white/95 border-l-gold-500 border-gold-100`;
      case 'info':
      default:
        return `${baseStyles} bg-white/95 border-l-azure-500 border-azure-100`;
    }
  };

  const getProgressBarColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-gold-500';
      case 'info':
      default:
        return 'bg-azure-500';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, clearAllToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            onRemove={removeToast}
            getIcon={getIcon}
            getToastStyles={getToastStyles}
            getProgressBarColor={getProgressBarColor}
          />
        ))}
      </div>

      {/* Clear all button when multiple toasts */}
      {toasts.length > 1 && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div className="flex justify-end mb-2">
            <button
              onClick={clearAllToasts}
              className="pointer-events-auto text-xs px-3 py-1.5 rounded-full bg-azure-700/90 text-white hover:bg-azure-700 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-azure-400"
            >
              Clear all ({toasts.length})
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Separate ToastItem component to handle individual toast rendering
const ToastItem: React.FC<{
  toast: ToastMessage;
  index: number;
  onRemove: (id: string) => void;
  getIcon: (type: ToastMessage['type']) => JSX.Element;
  getToastStyles: (type: ToastMessage['type']) => string;
  getProgressBarColor: (type: ToastMessage['type']) => string;
}> = ({ toast, index, onRemove, getIcon, getToastStyles, getProgressBarColor }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`
        pointer-events-auto rounded-xl overflow-hidden shadow-lg
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getToastStyles(toast.type)}
        hover:shadow-xl hover:scale-[1.02] group
      `}
    >
      {/* Progress bar for non-persistent toasts */}
      {!toast.persistent && (
        <div className="h-1 w-full bg-azure-100/50 relative overflow-hidden">
          <div 
            className={`h-full ${getProgressBarColor(toast.type)} absolute top-0 left-0 animate-shrink`}
            style={{
              animationDuration: `${toast.duration || 5000}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5">
            {getIcon(toast.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-azure-700 leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="mt-1 text-sm text-azure-500 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 p-1.5 rounded-lg text-azure-300 hover:text-azure-500 hover:bg-azure-50/50 focus:outline-none focus:ring-2 focus:ring-azure-300 transition-colors duration-200 group-hover:opacity-100 opacity-70"
                aria-label="Dismiss notification"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Action button */}
            {toast.action && (
              <div className="mt-3 pt-2 border-t border-azure-100/50">
                <button
                  onClick={() => {
                    toast.action!.onClick();
                    onRemove(toast.id);
                  }}
                  className={`
                    text-sm font-medium px-3 py-1.5 rounded-lg
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${toast.type === 'success' 
                      ? 'text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-300' 
                      : toast.type === 'error'
                      ? 'text-red-700 hover:bg-red-100 focus:ring-red-300'
                      : toast.type === 'warning'
                      ? 'text-gold-700 hover:bg-gold-100 focus:ring-gold-300'
                      : 'text-azure-700 hover:bg-azure-100 focus:ring-azure-300'
                    }
                  `}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
