import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Page2Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
}

const Page2: React.FC<Page2Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
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
    sex: 'sex'
  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-black font-sans text-sm">
        {/* Main Content */}
        <div className="flex-grow max-w-3xl mx-auto p-4 flex flex-col">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="/infinity_logo.png"
              alt="Infinity Supports WA logo"
              className="w-[250px] h-[100px]"
            />
          </div>

          {/* Orange and Red Guidelines */}
          <div className="mb-4 text-base leading-tight">
            <p className="mb-1">
              <span className="underline font-normal text-black">MODERATE</span>{' '}
              <span className="font-normal text-orange-500">ORANGE</span>
            </p>
            <p>
              Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk
            </p>
          </div>
          <div className="mb-6 text-base leading-tight">
            <p className="mb-1">
              <span className="underline font-normal text-black">HIGH</span>{' '}
              <span className="font-normal text-red-600">RED</span>
            </p>
            <p>
              Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.
            </p>
          </div>

          {/* Table Wrapper fills remaining height */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border border-black border-collapse text-xs h-full table-fixed">
              <thead>
                <tr>
                  <th className="border border-black font-bold px-1 py-0.5 text-center w-1/4">Risk Identified</th>
                  <th className="border border-black font-bold px-1 py-0.5 text-center w-1/6">Likelihood</th>
                  <th className="border border-black font-bold px-1 py-0.5 text-center w-1/6">Severity</th>
                  <th className="border border-black font-bold px-1 py-0.5 text-center w-1/3">Control Measures</th>
                </tr>
              </thead>
              <tbody>
                {schema?.riskTable?.map?.((row: any, idx: number) => (
                  <tr className="align-top h-[64px]" key={idx}>
                    <td className="border border-black px-1 py-0.5">{getValue(`riskIdentified_${idx + 1}`)}</td>
                    <td className="border border-black px-1 py-0.5">{getValue(`likelihood_${idx + 1}`)}</td>
                    <td className="border border-black px-1 py-0.5">{getValue(`severity_${idx + 1}`)}</td>
                    <td className="border border-black px-1 py-0.5">{getValue(`controls_${idx + 1}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sticky Footer */}
          <footer className="max-w-3xl mx-auto w-full px-4 pb-4 text-[12px] text-blue-700 flex justify-between">
          <a
            className="underline"
            href={settings?.company_website || ''}
            target="_blank"
            rel="noreferrer"
          >
            {settings?.company_website || ''}
          </a>
         <div>
  Date of Review:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>

        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
