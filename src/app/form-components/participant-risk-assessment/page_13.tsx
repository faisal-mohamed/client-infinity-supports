


import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Page13Props {
  data: any;
}

const Page13: React.FC<any> = ({ data, commonFieldsData, settings, schema } : any) => {
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

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full justify-between bg-white font-sans text-sm">
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex justify-center mt-10 mb-20">
            <img
              src='/infinity_logo.png'
              alt="Infinity Supports WA logo"
              className="w-[200px] h-[70px]"
            />
          </div>

          {/* Table */}
          <table className="w-full border border-black border-collapse text-center text-[12px]">
            <thead>
              <tr className="bg-gray-300 font-bold">
                <th className="border border-black py-1">Authorisation</th>
                <th className="border border-black"></th>
                <th className="border border-black"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black py-1 text-left px-2"><strong>Authorised by:</strong></td>
                <td className="border border-black">{getValue('authorisedBy')}</td>
                <td className="border border-black text-left px-2"><strong>Role:</strong> {getValue('role')}</td>
              </tr>
              <tr>
  <td className="border border-black py-1 text-left px-2"><strong>Signature:</strong></td>
  <td className="border border-black">
    {getValue('signature')?.startsWith('data:image') ? (
      <img src={getValue('signature')} alt="Signature" className="h-12 object-contain" />
    ) : (
      getValue('signature')
    )}
  </td>
  <td className="border border-black text-left px-2"><strong>Date:</strong> {getValue('signatureDate')}</td>
</tr>
<tr>
  <td className="border border-black py-1 text-left px-2">
    <strong>Participant / Guardian
    <br />
    Signature:</strong>
  </td>
  <td className="border border-black">
    {getValue('guardianSignature')?.startsWith('data:image') ? (
      <img src={getValue('guardianSignature')} alt="Guardian Signature" className="h-12 object-contain" />
    ) : (
      getValue('guardianSignature')
    )}
  </td>
  <td className="border border-black text-left px-2"><strong>Date:</strong> {getValue('guardianDate')}</td>
</tr>

              <tr>
                <td className="border border-black py-1 text-left px-2">
                  <strong>Is a copy supplied to the participant? </strong>   <br />
                
                {/* <td className="border border-black text-left px-2"> */}
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={getValue('copySupplied') === 'Yes'} readOnly />
                    <span>YES</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={getValue('copySupplied') === 'No'} readOnly />
                    <span>NO</span>
                  </label>
                {/* </td> */}
                </td>
                <td className="border border-black text-left px-2">
                  <strong>Copy placed on file?</strong>
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
                  <strong>Date for Review:</strong> {getValue('reviewDate')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer pinned to bottom */}
        <footer className="mt-10 text-[10px] font-sans px-2">
          <div className="flex justify-between text-xs px-2">
            <div>Website: {settings?.company_website}</div>
            <div>{settings?.participant_risk_assessment}</div>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page13;

