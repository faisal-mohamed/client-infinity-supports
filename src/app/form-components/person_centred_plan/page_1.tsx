import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

const Page1: React.FC<any> = ({ formSchema, images, settings }) => {
  return (
    <A4PageWrapper>
      {/* Logo - Fixed desktop sizing */}
      <div className="flex justify-center pt-8 pb-6">
        <img 
          src={formSchema.logoPath} 
          alt="Infinity Supports WA Logo" 
          className="h-20 object-contain" 
          style={{ height: '80px' }} // Fixed height for consistency
        />
      </div>

      {/* Central Visual - Fixed sizing for zoom-out consistency */}
      <div className="flex-1 flex justify-center items-center px-8">
        <img 
          src={formSchema.mainImagePath} 
          alt="Person Centred Plan Circles" 
          className="object-contain" 
          style={{ 
            maxWidth: '600px', 
            maxHeight: '500px',
            width: 'auto',
            height: 'auto'
          }}
        />
      </div>

      {/* Footer - Fixed desktop layout */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-4 mt-auto border-t border-gray-200">
        <div>Website: {settings?.company_website}</div>
        <div>{settings?.person_centre_plan_form_id}</div>
        <div>
          Review Date:{' '}
          {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
            ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
            : 'N/A'}
        </div>      
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
