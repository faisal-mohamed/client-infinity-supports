import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';

interface EnhancedA4PageProps {
  children: React.ReactNode;
  settings: any;
  pageNumber?: number;
  totalPages?: number;
  showTitle?: boolean;
  className?: string;
  images?: any;
}

const EnhancedA4Page: React.FC<EnhancedA4PageProps> = ({ 
  children, 
  settings, 
  pageNumber = 1, 
  totalPages,
  showTitle = true,
  className = '',
  images
}) => {
  return (
    <div
      className={`
        w-[210mm] h-[297mm]
        mx-auto mb-8
        bg-white
        shadow-lg
        border border-gray-300
        flex flex-col
        print:shadow-none
        print:mb-0
        print:border-none
        print:break-after-page
        ${className}
      `}
      style={{
        width: '210mm',
        height: '297mm',
        minWidth: '210mm',
        minHeight: '297mm'
      }}
    >
      <div className="pt-[12mm] px-[20mm] pb-[20mm] flex flex-col h-full">
        <PageHeader showTitle={showTitle} pageNumber={pageNumber} images={images} />
        
        <div className="flex-1 overflow-hidden">
          <div className="text-black leading-relaxed font-sans" style={{ fontSize: '12px' }}>
            {children}
          </div>
        </div>
        
        <PageFooter settings={settings} pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default EnhancedA4Page;
