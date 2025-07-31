


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
const Page14: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-base leading-relaxed">
        {/* Top: Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Middle: Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6">
          {/* Cancellation Conditions */}
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>
              You do not show up for a scheduled support within a reasonable time, or are not present at the agreed place and time when the provider is travelling to deliver the support.
            </li>
            <li>
              You have given less than seven (7) clear business days’ notice for cancellation of support in line with the current NDIS price guide.
            </li>
            <li>The support is less than 8 hours continuous duration; AND</li>
            <li>The agreed total price for the support is less than $1000; OR</li>
            <li>Less than seven (7) business days’ notice is given for any other support.</li>
          </ul>

          <p className="mb-6">In these circumstances, full support fees will be charged.</p>

          {/* Exit Policy */}
          <p className="font-bold mb-2">Exiting Services</p>
          <p className="mb-2">
            If either party chooses to end this Service Agreement before the cease date, they must give 2 weeks’ notice in writing.
          </p>
          <p className="mb-8">
            If either party seriously breaches this Service Agreement, the requirement of notice will be waived.
          </p>

          {/* Incident Reporting */}
          <p className="font-bold text-center mb-2">Incident Reporting</p>
          <p className=" mb-2">
            While we hope that incident reporting is not necessary, in the event it occurs, we are prepared to support and assist you by following procedures that appropriately handle a critical incident.
          </p>
          <p className=" mb-2">
            An incident is classified as an event (or alleged event) that occurs during the delivery of services and causes—or is likely to cause—a significant negative impact on your health, safety, or wellbeing.
          </p>
          <p className=" mb-2">
            If an incident does occur, we will engage the required authorities to support you during this time.
          </p>
          <p className=" mb-8">
            Incidents that relate to you may include, but are not necessarily limited to:
          </p>
        </div>

        {/* Bottom: Footer */}
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

export default Page14;
