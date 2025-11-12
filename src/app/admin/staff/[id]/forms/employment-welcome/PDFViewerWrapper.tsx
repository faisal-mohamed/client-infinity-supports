"use client";

import React from 'react';

interface PDFViewerWrapperProps {
  staffId: number;
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({ staffId }) => {
  const pdfUrl = `/api/staff/${staffId}/forms/employee-welcome/pdf#view=FitH&toolbar=0`;

  return (
    <iframe
      src={pdfUrl}
      className="w-full"
      style={{
        height: 'calc(100vh - 100px)',
        border: 'none',
        display: 'block',
        minHeight: '900px',
      }}
      title="Employee Welcome Pack PDF"
    />
  );
};

export default PDFViewerWrapper;

