import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page1: React.FC<any> = ({ formSchema, images, settings }) => {
  return (
    <A4PageWrapper>
      {/* Logo */}
      <div className="flex justify-center pt-8 pb-6">
        <img 
          src={formSchema.logoPath} 
          alt="Infinity Supports WA Logo" 
          className="h-20 object-contain" 
        />
      </div>

      {/* Central Visual - takes up most of the space */}
      <div className="flex-1 flex justify-center items-center px-8">
        <img 
          src={formSchema.mainImagePath} 
          alt="Person Centred Plan Circles" 
          className="max-w-full max-h-full object-contain" 
        />
      </div>

      {/* Footer - sticks to bottom */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-4 mt-auto border-t border-gray-200">
        <div>Website: {settings?.company_website}</div>
        <div>{settings?.person_centre_plan_form_id}</div>
        <div>Review Date: {settings?.review_date}</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
