

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
const Page17: React.FC<any> = ({settings}: any ) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full font-[Times_New_Roman] text-black text-sm leading-relaxed">
        {/* Top: Logo */}
         <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Middle: Content */}
        <div className="flex-grow w-full max-w-3xl mx-auto px-6 space-y-4">
          <ul className="list-disc list-inside mb-2">
            <li>The time, date, and place at which the reportable incident occurred (if known)</li>
            <li>The names and contact details of the persons involved in the reportable incident</li>
          </ul>

          <ul className="space-y-4">
            <li className="relative pl-6">
              <span className="absolute left-0 top-[2px] text-sm">✓</span>
              For an incident to be reportable, a certain act or event must have occurred (or be alleged to have occurred) in connection with the provision of supports or services by the registered NDIS provider. This includes:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The death of a person with disability</li>
                <li>Serious injury of a person with disability</li>
                <li>Abuse or neglect of a person with disability</li>
                <li>Unlawful sexual or physical contact with, or assault of, a person with disability</li>
                <li>●	Sexual misconduct, committed against, or in the presence of, a person with disability, including grooming of the person with disability for sexual activity</li>
              </ul>
            </li>

            <li className="relative pl-6">
              <span className="absolute left-0 top-[2px] text-sm">✓</span>
              Infinity Supports WA will submit a notification form via the NDIS Commission portal within 24 hours if any of the above incidents occur.
            </li>

            <li className="relative pl-6">
              <span className="absolute left-0 top-[2px] text-sm">✓</span>
              The Commissioner must be provided the following information within 5 business days after the provider becomes aware of the incident:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>The names and contact details of any witnesses to the reportable incident</li>
                <li>Any further actions proposed in response to the incident</li>
              </ul>
            </li>

            <li className="relative pl-6">
              <span className="absolute left-0 top-[2px] text-sm">✓</span>
              If an unauthorised restrictive practice is used, the NDIS should be notified within 5 business days of the provider becoming aware of it. If the incident resulted in injury, it must be reported within 24 hours.
            </li>

            <li className="relative pl-6">
              <span className="absolute left-0 top-[2px] text-sm">✓</span>
              If police intervention is required, the incident must be reported as soon as possible. If unsure whether to report an incident, the notifier or approver should contact the NDIS Commission for advice.
            </li>

            <li className="relative pl-6">
              <span className="absolute left-0 top-[2px] text-sm">✓</span>
              Infinity Supports WA will also inform:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Authorities for notifiable work-related injuries, fatalities, or dangerous occurrences</li>
                <li>Police if the incident relates to the death of a person</li>
              </ul>
            </li>
          </ul>
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

export default Page17;
