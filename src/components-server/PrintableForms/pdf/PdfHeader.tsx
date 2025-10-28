import React from 'react';

export function HeaderFirstPage({ logoDataUrl, className }: { logoDataUrl: string; className?: string }) {
  return (
    <header className={`pdf-header-first running-source ${className || ''}`} aria-hidden="true">
      <div className="header-stack">
        <div className="header-title">
          <h1>Emergency Drill Reporting Form</h1>
          <p>(For Disability Support Workers in a Client's Home)</p>
        </div>
        <img src={logoDataUrl} alt="Logo" className="header-logo" />
      </div>
    </header>
  );
}

export function HeaderRestPages({ logoDataUrl, className }: { logoDataUrl: string; className?: string }) {
  return (
    <header className={`pdf-header-rest running-source ${className || ''}`} aria-hidden="true">
      <div className="header-center">
        <img src={logoDataUrl} alt="Logo" className="header-logo" />
      </div>
    </header>
  );
}
