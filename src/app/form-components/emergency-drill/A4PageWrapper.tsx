import React from 'react';

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        w-[210mm] h-[297mm]
        mx-auto mb-8
        bg-white
        shadow-lg
        border border-gray-300
        flex flex-col
        print:shadow-none
        print:mb-0
        print:border-none
        ${className}
      `}
    >
      <div className="p-[20mm] flex flex-col justify-between h-full">
        {children}
      </div>
    </div>
  );
};

export default A4PageWrapper;
