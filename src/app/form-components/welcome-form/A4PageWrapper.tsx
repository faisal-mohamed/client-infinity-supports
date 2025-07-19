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
        bg-white
        shadow-md
        border border-gray-300
        mx-auto my-4
        flex flex-col
        print:shadow-none print:border-none print:my-0
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default A4PageWrapper;
