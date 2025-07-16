import React from 'react';

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  pageNumber?: number;
  totalPages?: number;
  footer?: React.ReactNode;
}

const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ 
  children, 
  className = '',
  pageNumber,
  totalPages,
  footer
}) => {
  return (
    <div 
      className={`
        a4-page
        w-[210mm] min-h-[297mm] 
        mx-auto mb-8 
        bg-white 
        shadow-lg 
        border border-gray-300
        flex flex-col
        p-[20mm]
        relative
        print:shadow-none 
        print:mb-0
        print:border-none
        print:p-[15mm]
        print:break-after-page
        print:break-inside-avoid
        ${className}
      `}
    >
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {footer && (
        <div className="mt-auto pt-[10mm] border-t border-gray-200">
          {footer}
        </div>
      )}
      {pageNumber && totalPages && (
        <div className="absolute bottom-[10mm] right-[10mm] text-sm text-gray-600">
          Page {pageNumber} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default A4PageWrapper;
