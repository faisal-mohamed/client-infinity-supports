import React from 'react';

interface A4PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const A4PageWrapper: React.FC<A4PageWrapperProps> = ({ children, className = '' }) => (
  <div
    className={`a4-page flex flex-col w-[210mm] h-[297mm] mx-auto bg-white border border-gray-300 shadow-lg print:shadow-none print:mb-0 print:border-none box-border ${className}`}
    style={{
      width: '210mm',
      height: '297mm',
      paddingTop: '4mm',
      paddingBottom: '4mm',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      background: '#fff',
      margin: 0,
    }}
  >
    {children}
  </div>
);

export default A4PageWrapper;
