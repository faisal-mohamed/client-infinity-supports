import React from 'react';
import PdfFooter from './PdfFooter';
import { formatDateForPDF } from '@/lib/dateFormatter';

export default function PdfPageLayout({
  logoDataUrl, footerData, children,
}: {
  logoDataUrl: string;
  footerData: { documentRef?: string; date?: string };
  children: React.ReactNode;
}) {
  const formattedDate = formatDateForPDF(footerData?.date);
  
  return (
    <div className="pdf-wrapper">
      {/* fixed header for ALL pages (logo only) */}
      <div className="page-header-fixed" aria-hidden="true">
        <img src={logoDataUrl} alt="Infinity Supports WA" />
      </div>

      {/* fixed footer for ALL pages */}
      <footer className="pdf-footer-fixed" aria-hidden="true">
        <span>www.infinitysupportswa.org</span>
        <span>{footerData?.documentRef || "ED-001"}</span>
        <span>Date of Report: {formattedDate}</span>
      </footer>

      {/* body content lives strictly between header and footer */}
      <main className="pdf-body">
        {/* one-time spacer so page-1 can show title+subtitle above the logo-only fixed header spacing */}
        <div className="page-1-spacer" aria-hidden="true"></div>

        {/* real page-1 header (title + subtitle + logo if you want it here too) */}
        <header className="header-first-page" aria-hidden="true">
          <div>
            <h1>Emergency Drill Reporting Form</h1>
            <p>(For Disability Support Workers in a Client's Home)</p>
          </div>
        </header>

        <div className="pdf-form">
          {children}
        </div>
      </main>
    </div>
  );
}
