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
      <div className="flex justify-between items-center text-xs text-gray-600">
        <div>
          <span>{settings?.from_email || ''}</span>
        </div>
        
        <div className="text-center">
          <span>{settings?.emergency_drill || ''}</span>
        </div>
        
        <div className="text-right">
          <span>Date of Report: {settings?.review_date || ''}</span>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
