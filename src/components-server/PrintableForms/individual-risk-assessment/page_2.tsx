import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page2Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

const TOTAL_ROWS = 6;

const Page2: React.FC<Page2Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images = {},
}) => {
  const commonFieldMapping: Record<string, string> = {
    personName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex',
  };

  const getValue = (key: string) => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  const dataRows = schema?.riskTable || [];
  const displayRows = [...dataRows];
  while (displayRows.length < TOTAL_ROWS) displayRows.push({});

  // Define sticky footer content
  const footer = (
    <div className="flex justify-between text-sm px-2">
      <div>{settings?.company_website || 'https://www.infinitysupportswa.org'}</div>
      <div>Date of Review: {settings?.review_date || 'N/A'}</div>
    </div>
  );

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full text-[17px] font-sans leading-snug">
        {/* Logo */}
        <div className="flex justify-center pt-6">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain mb-4"
          />
        </div>

        {/* Guideline Section */}
        <div className="px-6 mb-4">
          <p className="mb-1 font-semibold underline">
            MODERATE <span className="text-orange-500">ORANGE</span>
          </p>
          <p className="mb-3">
            Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.
          </p>
          <p className="mb-1 font-semibold underline">
            HIGH <span className="text-red-600">RED</span>
          </p>
          <p>
            Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.
          </p>
        </div>

        {/* Table */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full h-full table-fixed border border-black border-collapse text-[16px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-black font-bold px-2 py-1 text-center w-1/4">Risk Identified</th>
                <th className="border border-black font-bold px-2 py-1 text-center w-1/6">Likelihood</th>
                <th className="border border-black font-bold px-2 py-1 text-center w-1/6">Severity</th>
                <th className="border border-black font-bold px-2 py-1 text-center w-1/3">Control Measures</th>
              </tr>
            </thead>
            <tbody>
  {displayRows.map((_, idx) => (
    <tr key={idx} className="align-top" style={{ height: '30mm' }}>
      <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">
        {getValue(`riskIdentified_${idx + 1}`)}
      </td>
      <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">
        {getValue(`likelihood_${idx + 1}`)}
      </td>
      <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">
        {getValue(`severity_${idx + 1}`)}
      </td>
      <td className="border border-black px-2 py-1 break-words whitespace-pre-wrap">
        {getValue(`controls_${idx + 1}`)}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
