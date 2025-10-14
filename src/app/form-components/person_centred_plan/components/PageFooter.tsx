import React from 'react';

interface PageFooterProps {
  settings: any;
  pageNumber?: number;
  totalPages?: number;
}

const PageFooter: React.FC<PageFooterProps> = ({ settings, pageNumber, totalPages }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="mt-auto pt-4">
      {/* Footer content matching reference image */}
      <div className="flex justify-between items-center text-xs text-gray-700">
        <div>
          <a
            className="text-blue-600 underline"
            href={settings?.company_website || 'https://www.infinitysupportswa.org'}
            target="_blank"
            rel="noopener noreferrer"
          >
            www.infinitysupportswa.org
          </a>
        </div>
        
        <div className="text-center">
          <span>{settings?.person_centre_plan_form_id || 'PCP-001'}</span>
        </div>
        
        <div className="text-right">
          <span>Date of Report: {settings?.review_date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
