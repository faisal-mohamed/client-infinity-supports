

import React from 'react';
import A4PageWrapper from './A4PageWrapper';
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
const Page24: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-[14px] text-black font-[Times_New_Roman]">
        {/* Header Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-3xl mx-auto px-6 flex-grow space-y-6 leading-relaxed">
          <p>
            Infinity Supports WA provides participants with protection against inhumane or
            degrading treatment, while also prioritizing personal dignity, privacy, self-respect,
            and individual needs.
          </p>
          <p>
            Infinity Supports WA is committed to maintaining a safe working environment for all
            staff and workers.
          </p>
          <p>
            Infinity Supports WA is committed to regularly reviewing the use of restrictive
            practices, including incident reporting where applicable, assessing appropriateness and
            exploring alternatives, and providing aggregated reports.
          </p>
          <p>
            In instances of challenging behaviour, Infinity Supports WA will employ a positive
            behaviour support approach.
          </p>
        </div>

        {/* Footer */}
         <footer className="w-full border-t border-gray-300 py-4">
          <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
            <span>Website: {settings?.company_website}</span>
            <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page24;
