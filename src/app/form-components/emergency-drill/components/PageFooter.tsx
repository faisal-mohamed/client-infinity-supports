import React from 'react';

interface PageFooterProps {
  settings: any;
  pageNumber?: number;
  totalPages?: number;
}

const PageFooter: React.FC<PageFooterProps> = ({ settings, pageNumber, totalPages }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="mt-auto pt-4 border-t border-gray-300">
      {/* Simplified footer content */}
      <div className="flex justify-between items-center text-xs text-blue-800">
        <div>
          <a
            className="underline"
            href={settings?.company_website || 'https://www.infinitysupportswa.org'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {settings?.company_website || 'www.infinitysupportswa.org'}
          </a>
        </div>
        
        <div className="text-center">
          <span>{settings?.emergency_drill || 'ED-001'}</span>
        </div>
        
        <div className="text-right">
          <span>Date of Report: {settings?.review_date || new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
