import React from 'react';

// Simple wrapper for PDF view - delegates to the server-side PDF component
// The actual PDF generation happens in route.ts
const ParticipantRiskAssessmentPDF = ({ formData = {}, commonFieldsData, settings, images }: any) => {
  return (
    <div className="pdf-container">
      <p>PDF Preview - Use Download button to generate PDF</p>
      <div className="pdf-placeholder">
        <p>This is a placeholder. The actual PDF download is handled by the API route.</p>
      </div>
    </div>
  );
};

export default ParticipantRiskAssessmentPDF;

