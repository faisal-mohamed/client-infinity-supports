import React from 'react';

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  pageNumber?: number;
  totalPages?: number;
  footer?: React.ReactNode;
  fixedHeight?: boolean; // if true, uses A4 fixed height; otherwise dynamic height
}

// --- FormRenderer-style A4 Page Wrapper Component with proper content distribution ---
const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ 
  children, 
  className = '',
  pageNumber,
  totalPages,
  footer,
  fixedHeight = true,
}) => {
  return (
    <div 
      className={`bg-white mx-auto shadow-md flex flex-col relative ${className}`}
      style={{
        width: "794px",
        ...(fixedHeight ? { height: "1123px" } : {}),
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
        padding: "20mm",
      }}
    >
      {/* Content area that takes all available space */}
      <div className="flex-1 flex flex-col">
          {children}
      </div>
      
      {/* Footer always at bottom */}
      {footer && (
        <div className="mt-auto pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
      
      {/* Page number always at bottom right */}
      {pageNumber && totalPages && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-600">
          Page {pageNumber} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default A4PageWrapper;
