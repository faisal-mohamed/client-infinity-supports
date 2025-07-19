import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page2Props {
  data: Record<string, any>;
}

const Page2: React.FC<Page2Props> = ({ data }) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full px-10 py-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-2">
          <img
            src="https://storage.googleapis.com/a1aa/image/910c4598-57d1-4e07-5c5d-9275c0de8a68.jpg"
            alt="Infinity Supports WA Logo"
            className="h-[60px] w-auto mb-2"
          />
          <p className="text-sm text-gray-600 uppercase tracking-widest text-center">
            Support Coordination Action Plan
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 leading-relaxed text-[10px]">
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

        {/* Footer (always at bottom) */}
        <div className="mt-auto flex justify-between text-[10px] text-gray-500 pt-4 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF006</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
