import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';



const Page2: React.FC<any> = ({ data, settings }) => {

  const renderYesNoCheckbox = (value: string) => (
  <div className="flex gap-6 text-[11px]">
    <label className="flex items-center gap-1">
      <span className="font-semibold">Yes</span>
      <input type="checkbox" checked={value === 'Yes'} readOnly />
    </label>
    <label className="flex items-center gap-1">
      <span className="font-semibold">No</span>
      <input type="checkbox" checked={value === 'No'} readOnly />
    </label>
  </div>
);


  const formatDate = (value: string): string => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, 'dd-MM-yyyy');
    }
  }
  return value;
};




  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full px-10 py-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-2">
           <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
          {/* <p className="text-[11px] text-gray-600 uppercase tracking-widest text-center">
            Support Coordination Action Plan
          </p> */}
        </div>

        {/* Main Content */}
        <div className="flex-1 leading-relaxed text-[11px]">
          <table className="w-full border border-black border-collapse">
            <tbody>
              <tr className="bg-[#a9c1e0]">
                <td className="border border-black font-bold p-3 uppercase">Core Supports</td>
              </tr>
              <tr>
                <td className='border border-black p-3'>{data?.coreSupportText}</td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Preferred providers</span>
                  <br />
                  1. {data?.corePreferredProviders} <br />
                  2. {data?.corePreferredProviders2}

                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Alternative providers</span>
                  <br />
                  1. {data?.coreAlternativeProviders} <br />
                  2. {data?.coreAlternativeProviders2}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Service Agreement developed/signed?</span>
                  <br />
{renderYesNoCheckbox(data?.coreAgreementSigned)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Supports have commenced</span>
                  <br />
                  {data?.coreSupportsCommenced}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Discussion held with Plan Manager and budget approved?</span>
                  <br />
                  {renderYesNoCheckbox(data?.coreBudgetApproved)}
                </td>
              </tr>

              <tr className="bg-[#a9c1e0]">
                <td className="border border-black font-bold p-3 uppercase">Capacity Building</td>
              </tr>
               <tr>
                <td className='border border-black p-3'>{data?.capacitySupportText}</td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Preferred providers</span>
                  <br />
                  1. {data?.capacityPreferredProviders}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Alternative providers</span>
                  <br />
                  1. {data?.capacityAlternativeProviders}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Service Agreement developed/signed?</span>
                  <br />
                  {renderYesNoCheckbox(data?.capacityAgreementSigned)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Supports in place at start of plan</span>
                  <br />
                  {data?.capacitySupportsInPlace}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className='font-bold'>Are additional assessments required to access this support type? </span>
                  <br />
                  {renderYesNoCheckbox(data?.capacityAssessmentRequired)}
                </td>
              </tr>
              {data?.capacityAssessmentRequired === 'Yes' && (
                <tr>
                  <td className="border border-black p-3">
                    <span className="font-bold">If Yes - Actions</span>
                    <br />
                    {data?.capacityActions}
                  </td>
                </tr>
              )}
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Discussion held with Plan Manager and budget approved?</span>
                  <br />
                  {renderYesNoCheckbox(data?.capacityBudgetApproved)}
                </td>
              </tr>

              <tr className="bg-[#a9c1e0]">
                <td className="border border-black font-bold p-3 uppercase">Capital</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer (always at bottom) */}
         <footer className="mt-auto flex justify-between text-[11px] text-gray-500 pt-4">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.support_action_plan}</div>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
