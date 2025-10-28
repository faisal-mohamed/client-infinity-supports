import React from 'react';

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        a4-page
        w-[210mm] h-[297mm]
        mx-auto mb-8
        bg-white
        shadow-lg
        border border-gray-300
        flex flex-col
        print:shadow-none
        print:mb-0
        print:border-none
        p-0
        ${className}
      `}
      style={{
        // Ensure consistent A4 dimensions across all devices
        width: '210mm',
        height: '297mm',
        minWidth: '210mm',
        minHeight: '297mm'
      }}
    >
      {children}
    </div>
  );
};


export default A4PageWrapper;
