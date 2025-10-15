import React from 'react';
import PdfFooter from './PdfFooter';

export default function PdfPageLayout({
  logoDataUrl, footerData, children,
}: {
  logoDataUrl: string;
  footerData: { documentRef?: string; date?: string };
  children: React.ReactNode;
}) {
  return (
    <div className="pdf-wrapper">
      {/* Fixed header for pages 2+ (logo only, centered) */}
      <div className="page-header-repeat">
        <img src={logoDataUrl} alt="Logo" />
      </div>
      
      {/* Fixed footer for all pages */}
      <PdfFooter documentRef={footerData.documentRef} date={footerData.date} />
      
      {/* Body content with inline first page header */}
      <main className="pdf-body pdf-form">
        {/* First page header (inline, shows once at the top) */}
        <div className="first-page-header">
          <img src={logoDataUrl} alt="Logo" />
          <h1>Emergency Drill Reporting Form</h1>
          <p>(For Disability Support Workers in a Client's Home)</p>
        </div>
        
        {children}
      </main>
    </div>
  );
}
