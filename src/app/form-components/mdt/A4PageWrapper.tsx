import React from 'react';

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

// --- FormRenderer-style A4 Page Wrapper Component ---
const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`bg-white mx-auto shadow-md flex flex-col ${className}`}
      style={{
        width: "794px",
        height: "1123px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
      }}
    >
      {children}
    </div>
  );
};

export default A4PageWrapper;
