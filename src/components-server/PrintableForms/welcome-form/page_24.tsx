

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page24 = ({settings, images}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-[14px] text-black font-[Times_New_Roman]">
        {/* Header Logo */}
        <div className="flex justify-center pt-6 pb-4">
           <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            className="mb-8 w-[200px] h-[80px] object-contain"
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
            <span>Review Date: {settings?.review_date}</span>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page24;
