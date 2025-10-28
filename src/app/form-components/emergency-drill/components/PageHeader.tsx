import React from 'react';

interface PageHeaderProps {
  showTitle?: boolean;
  pageNumber?: number;
  settings?: any;
}

const PageHeader: React.FC<PageHeaderProps> = ({ showTitle = true, pageNumber, settings }) => {
  return (
    <div className="mb-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        {settings?.logoImage ? (
          <img
            src={settings.logoImage}
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '100px', width: '250px' }}
          />
        ) : (
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            style={{ height: '100px', width: '250px' }}
          />
        )}
      </div>



    </div>
  );
};

export default PageHeader;
