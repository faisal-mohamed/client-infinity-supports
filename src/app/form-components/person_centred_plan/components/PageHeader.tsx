import React from 'react';

interface PageHeaderProps {
  showTitle?: boolean;
  pageNumber?: number;
  images?: any;
}

const PageHeader: React.FC<PageHeaderProps> = ({ showTitle = true, pageNumber, images }) => {
  return (
    <div className="mb-4">
      {/* Logo */}
      <div className="flex justify-center mb-2">
        {images?.infinityLogo ? (
          <img
            src={images.infinityLogo}
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '80px', width: '200px' }}
          />
        ) : (
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '80px', width: '200px' }}
          />
        )}
      </div>
      
      {/* Page Number - only show if not cover page */}
      {pageNumber && pageNumber > 1 && (
        <>
          <div className="text-center mb-2">
            <span className="text-lg font-medium">Page {pageNumber}</span>
          </div>
          <hr className="border-gray-400 mb-4" />
        </>
      )}
    </div>
  );
};

export default PageHeader;
