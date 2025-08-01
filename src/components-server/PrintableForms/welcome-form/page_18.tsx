

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
const Page18 = ({ settings, images }: any) => (
  <A4PageWrapper>
    <div className="a4-inner font-[Times_New_Roman] text-black text-base leading-relaxed">
      {/* Top: Logo */}
      <div className="flex justify-center pt-6 pb-2">
        <img
          src={images?.infinityLogo}
          alt="Infinity Supports WA logo"
          className="mb-4 w-[140px] h-[56px] object-contain"
        />
      </div>

      {/* Middle: Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 flex flex-col">
        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <span className="mr-2 mt-1">✓</span>
            <p>
              Where an incident is referred to NDIS, the NDIS investigation takes precedence over any organisational process.
            </p>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-1">✓</span>
            <p>
              The progress of the incidents, accidents and near misses will be tracked in the incident report form.
            </p>
          </li>
        </ul>

        <p className="mb-3">
          <strong>Step 2:</strong> Submit a 5-business day form: this form should be submitted via the “My Reportable Incidents” portal within 5 business days after key management personnel are notified. Some additional information, including the corrective actions, is recorded in this form. Any unauthorised use of restrictive practices is recorded by this form.
        </p>

        <p className="mb-5">
          <strong>Step 3:</strong> If required, the final report should be submitted: If this is required, the NDIS Commission will contact the provider and advise the due date for this matter. The final report field will be accessible on the NDIS Commission portal if the provider is required to submit a final report.
        </p>

        <table className="w-full border border-gray-300 text-sm mb-4">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="border border-gray-300 px-3 py-2 text-left">Reportable incident</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Required timeframe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2">Death of a person with disability</td>
              <td className="border border-gray-300 px-3 py-2 font-bold">24 hours</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">Serious injury of a person with disability</td>
              <td className="border border-gray-300 px-3 py-2 font-bold">24 hours</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">Abuse or neglect of a person with disability</td>
              <td className="border border-gray-300 px-3 py-2 font-bold">24 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom: Footer */}
      <footer className="w-full border-t border-gray-300 py-3">
        <div className="max-w-3xl mx-auto px-6 flex justify-between text-xs text-gray-500">
          <span>Website: {settings?.company_website}</span>
          <span>{settings?.welcome_form}</span>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </div>
      </footer>
    </div>
  </A4PageWrapper>
);

export default Page18;
