

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page13Props {
  data: any;
  commonFieldsData?: any;
  settings: any;
  schema?: any;
  images: any;
}
import { format, parseISO, isValid } from "date-fns";

const Page13: React.FC<Page13Props> = ({ data, commonFieldsData, settings, schema, images }) => {
const getValue = (key: string) => {
  const rawValue = data?.[key] ?? '';

  if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    const parsed = parseISO(rawValue);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }

  return rawValue;
};

  const footer = (
    <div className="flex justify-between text-xs px-2">
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.participant_risk_assessment}</div>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full w-full px-6 pt-4 pb-4 font-sans text-[11px]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Table */}
        <table className="w-full border border-black border-collapse text-center text-[11px]">
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th className="border border-black py-1">Authorisation</th>
              <th className="border border-black"></th>
              <th className="border border-black"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black py-1 text-left px-2">Authorised by:</td>
              <td className="border border-black">{getValue('authorisedBy')}</td>
              <td className="border border-black text-left px-2">Role: {getValue('role')}</td>
            </tr>

            <tr>
              <td className="border border-black py-1 text-left px-2">Signature:</td>
              <td className="border border-black">
                {getValue('signature')?.startsWith('data:image') ? (
                  <img src={getValue('signature')} alt="Signature" className="h-10 object-contain mx-auto" />
                ) : (
                  getValue('signature')
                )}
              </td>
              <td className="border border-black text-left px-2">Date: {getValue('signatureDate')}</td>
            </tr>

            <tr>
              <td className="border border-black py-1 text-left px-2">
                Participant / Guardian<br />Signature:
              </td>
              <td className="border border-black">
                {getValue('guardianSignature')?.startsWith('data:image') ? (
                  <img src={getValue('guardianSignature')} alt="Guardian Signature" className="h-10 object-contain mx-auto" />
                ) : (
                  getValue('guardianSignature')
                )}
              </td>
              <td className="border border-black text-left px-2">Date: {getValue('guardianDate')}</td>
            </tr>

            <tr>
              <td className="border border-black py-1 text-left px-2">
                Is a copy supplied to the participant?
              </td>
              <td className="border border-black text-left px-2">
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" checked={getValue('copySupplied') === 'Yes'} readOnly />
                  <span>YES</span>
                </label>
                <br />
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" checked={getValue('copySupplied') === 'No'} readOnly />
                  <span>NO</span>
                </label>
              </td>
              <td className="border border-black text-left px-2">
                Copy placed on file?
                <br />
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" checked={getValue('copyOnFile') === 'Yes'} readOnly />
                  <span>YES</span>
                </label>
                <br />
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" checked={getValue('copyOnFile') === 'No'} readOnly />
                  <span>NO</span>
                </label>
              </td>
              <td className="border border-black text-left px-2">
                Date for Review: {getValue('reviewDate')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </A4PageWrapper>
  );
};

export default Page13;
