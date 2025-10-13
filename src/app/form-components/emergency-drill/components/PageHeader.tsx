import React from 'react';

interface PageHeaderProps {
  showTitle?: boolean;
  pageNumber?: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({ showTitle = true, pageNumber }) => {
  return (
    <div className="mb-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo"
          className="object-contain"
          style={{ height: '60px', width: '150px' }}
        />
      </div>

      {showTitle && (
        <>
          <div className="text-center mb-1 font-semibold" style={{ fontSize: '14px' }}>
            Emergency Drill Reporting Form
          </div>
          <div className="text-center mb-4 italic" style={{ fontSize: '12px' }}>
            (For Disability Support Workers in a Client's Home)
          </div>
        </>
      )}

      {pageNumber && pageNumber > 1 && (
        <div className="text-center mb-4 text-sm text-gray-600">
          Page {pageNumber}
        </div>
      )}

      <hr className="border-gray-400 mb-4" />
    </div>
  );
};

export default PageHeader;
