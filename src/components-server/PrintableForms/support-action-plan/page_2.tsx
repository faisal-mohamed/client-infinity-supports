

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page2: React.FC<any> = ({ data, settings, images }) => {

   const renderYesNoCheckbox = (value: string) => (
  <div className="flex gap-6 text-[10px]">
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

  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full min-h-full box-border px-10 py-6"
        style={{
          height: '100%',
          minHeight: '100%',
          paddingLeft: '40px',   // 10 * 4px (Tailwind px-10 fallback)
          paddingRight: '40px',
          paddingTop: '24px',    // 6 * 4px (Tailwind py-6 fallback)
          paddingBottom: '24px',
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-2">
          <img
            src={images?.infinityLogo}
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 leading-relaxed text-[10px]">
          <table className="w-full border border-black border-collapse">
            <tbody>
              <tr>
                <td className="border border-black font-bold p-3 uppercase" style={{backgroundColor: '#a9c1e0'}}>Core Supports</td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Preferred providers</span>
                  <br />
                  1. {data?.corePreferredProviders}
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

              <tr>
                <td className="border border-black font-bold p-3 uppercase" style={{backgroundColor: '#a9c1e0'}}>Capacity Building</td>
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

              <tr >
                <td className="border border-black font-bold p-3 uppercase" style={{backgroundColor: '#a9c1e0'}}>Capital</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sticky Footer */}
        <footer className="flex-shrink-0 mt-auto flex justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-300">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.support_action_plan}</div>
          <div>Review Date: {settings?.review_date}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
