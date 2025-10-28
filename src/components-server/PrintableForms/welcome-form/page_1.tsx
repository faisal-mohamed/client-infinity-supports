import React from 'react';
import A4PageWrapper from './A4PageWrapper'
import { parseISO, isValid, format } from 'date-fns';
 const formatDate = (value: string): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }
  return value;
};
const Page1 = ({ images, settings } : any ) => (
  <A4PageWrapper>
    <div className="a4-inner font-sans text-black">
      {/* Content: Low spacing */}
      <div className="flex-1 flex flex-col items-center justify-center px-2">
        <p className="font-bold text-center text-sm mb-2 mt-4">WELCOME PACK</p>
        <p className="text-center text-xs mb-4">HELPING YOU ACHIEVE GOALS AND BEYOND</p>
        <img src={images?.p1_1} alt="Red infinity symbol" className="mb-4" style={{ width: 100, height: 36 }} />
        <div className="flex justify-center space-x-2 mb-4">
          <img src={images?.p1_2} alt="NDIS logo" style={{ width: 28, height: 28 }} />
          <img src={images?.p1_3} alt="Rainbow pride flag" style={{ width: 28, height: 18 }} />
          <img src={images?.p1_4} alt="Aboriginal flag" style={{ width: 28, height: 18 }} />
          <img src={images?.p1_5} alt="Torres Strait Islander flag" style={{ width: 28, height: 18 }} />
        </div>
      </div>
      {/* Footer: No mt-auto, no margin! */}
      <footer className="w-full border-t border-gray-300 py-2 text-[9px] text-gray-500">
        <div className="max-w-3xl mx-auto px-4 flex justify-between">
           <span>Website: {settings?.company_website}</span>
          <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </div>
      </footer>
    </div>
  </A4PageWrapper>
);

export default Page1;
