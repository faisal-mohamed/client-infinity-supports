"use client";

import React from 'react';

interface PDFViewerWrapperProps {
  staffId: number;
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({ staffId }) => {
  const pdfUrl = `/api/staff/${staffId}/forms/employee-welcome/pdf#toolbar=0&navpanes=0&view=FitH&zoom=page-width`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        src={pdfUrl}
        style={{
          width: '100%',
          height: 'calc(100vh - 200px)',
          minHeight: '800px',
          border: 'none',
          display: 'block',
        }}
        title="Employee Welcome Pack PDF"
      />
    </div>
  );
};

export default PDFViewerWrapper;

