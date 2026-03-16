import React from 'react';

export default function PdfFooter({ documentRef, date }:{
  documentRef?: string; 
  date?: string;
}) {
  return (
    <footer className="pdf-footer" aria-hidden="true" style={{ fontSize: '9px', color: '#666', borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '10px' }}>
      <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Website: www.infinitysupports.com.au</span>
        <span style={{ fontWeight: 'bold' }}>{documentRef || ""}</span>
        <span>Review Date: {date || ""}</span>
      </div>
    </footer>
  );
}
