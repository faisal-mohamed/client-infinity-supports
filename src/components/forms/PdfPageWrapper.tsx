import React from 'react';

interface PdfPageWrapperProps {
  children: React.ReactNode;
}

export const PdfPageWrapper: React.FC<PdfPageWrapperProps> = ({ children }) => {
  return (
    <div 
      className="bg-white mx-auto shadow-md flex flex-col"
      style={{
        width: "794px",  // A4 width in px
        height: "1123px", // A4 height in px
        pageBreakAfter: "always",
        breakAfter: "page", // Modern CSS property
        pageBreakInside: "avoid",
        breakInside: "avoid", // Modern CSS property
        margin: 0,
        padding: 0,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {children}
    </div>
  );
};

export default PdfPageWrapper;
