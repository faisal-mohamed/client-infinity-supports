

import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";


const Page9: React.FC<any> = ({data, commonFieldsData, settings, schema} : any) => {
  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-sm font-sans px-6 py-6">
        {/* Header */}
          <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
    
        </div>
              <p className="text-sm uppercase tracking-wider text-black-700 font-semibold" style={{ textAlign: 'center' }}>
            Risk Assessment Matrix
          </p>
          <br />

        {/* Risk Matrix Placeholder */}
        <img src="/home_risk_assessment.png" alt="" />

        {/* Summary */}
        {/* <div className="mb-6 font-medium">
          <p>
            Visit should only proceed after consultation with{" "}
            <span className="underline">Manager</span>. The risks should be
            reviewed to consider all the hazards involved. The risks must be
            reduced prior to the visit.
          </p>
        </div> */}

        {/* Emergency Contact Table */}
        <div className="border border-black mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black px-2 py-1 text-left font-bold bg-gray-300"
                >
                  Emergency Contact Numbers
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 w-1/3">Police</td>
                <td colSpan={2} className="border border-black px-2 py-1 text-center">
                  <img
                    src="/participant_risk_assessment_emergency.png"
                    alt="000 Emergency"
                    className="max-h-[60px] mx-auto"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Fire</td>
                <td className="border border-black px-2 py-1"></td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Ambulance</td>
                <td className="border border-black px-2 py-1"></td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Utilities Table */}
        <div className="border border-black">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black px-2 py-1 text-left font-bold bg-gray-300"
                >
                  Utilities
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 w-1/3">Electricity Authority</td>
                <td className="border border-black px-2 py-1">Western Power</td>
                <td className="border border-black px-2 py-1">13 13 51</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">Water Authority</td>
                <td className="border border-black px-2 py-1">Water Corp</td>
                <td className="border border-black px-2 py-1">13 13 75</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto">
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
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
