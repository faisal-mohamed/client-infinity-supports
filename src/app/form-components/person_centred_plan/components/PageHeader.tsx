import React from 'react';

interface PageHeaderProps {
  showTitle?: boolean;
  pageNumber?: number;
  images?: any;
}

const PageHeader: React.FC<PageHeaderProps> = ({ showTitle = true, pageNumber, images }) => {
  return (
    <div className="mb-2">
      {/* Logo - Much larger size, positioned higher, no lines */}
      <div className="flex justify-center mb-1">
        {images?.infinityLogo ? (
          <img
            src={images.infinityLogo}
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '120px', width: '300px' }}
          />
        ) : (
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '120px', width: '300px' }}
          />
        )}
      </div>
    </div>
  );
};

export default PageHeader;
