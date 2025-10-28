import React from 'react';

export default function PdfFooter({ documentRef, date }:{
  documentRef?: string; 
  date?: string;
}) {
  return (
    <footer className="pdf-footer" aria-hidden="true">
      <div className="footer-inner">
        <span>www.infinitysupportswa.org</span>
        <span>{documentRef || "ED-001"}</span>
        <span>Date of Report: {date || new Date().toLocaleDateString()}</span>
      </div>
    </footer>
  );
}
