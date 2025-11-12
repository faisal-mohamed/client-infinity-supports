import React from 'react';

export default function PdfFooter({ documentRef, date }:{
  documentRef?: string; 
  date?: string;
}) {
  return (
    <footer className="pdf-footer" aria-hidden="true">
      <div className="footer-inner">
        <span></span>
        <span>{documentRef || ""}</span>
        <span>Date of Report: {date || ""}</span>
      </div>
    </footer>
  );
}
