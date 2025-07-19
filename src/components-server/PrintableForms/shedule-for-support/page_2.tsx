

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page2: React.FC<any> = ({ data, settings, images }) => {
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
              <tr className="bg-[#a9c1e0]">
                <td className="border border-black font-bold p-3 uppercase">Core Supports</td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Preferred providers</span>
                  <br />
                  {data?.corePreferredProviders}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Alternative providers</span>
                  <br />
                  {data?.coreAlternativeProviders}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Service Agreement developed/signed?</span>
                  <br />
                  {data?.coreAgreementSigned}
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
                  {data?.coreBudgetApproved}
                </td>
              </tr>

              <tr className="bg-[#a9c1e0]">
                <td className="border border-black font-bold p-3 uppercase">Capacity Building</td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Preferred providers</span>
                  <br />
                  {data?.capacityPreferredProviders}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Alternative providers</span>
                  <br />
                  {data?.capacityAlternativeProviders}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-3">
                  <span className="font-bold">Service Agreement developed/signed?</span>
                  <br />
                  {data?.capacityAgreementSigned}
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
                  <span>Are additional assessments required?</span>
                  <br />
                  {data?.capacityAssessmentRequired}
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
                  {data?.capacityBudgetApproved}
                </td>
              </tr>

              <tr className="bg-[#a9c1e0]">
                <td className="border border-black font-bold p-3 uppercase">Capital</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sticky Footer */}
        <footer className="flex-shrink-0 mt-auto flex justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-300">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.schedule_for_support}</div>
          <div>Review Date: {settings?.review_date}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
