

import React from "react";
import A4PageWrapper from "./A4PageWrapper";

const Page9: React.FC<any> = ({ data, commonFieldsData, settings, schema, images }) => {
  const footer = (
    <div className="flex justify-between text-[10px] px-2">
      <div>Website: {settings?.company_website}</div>
      <div>{settings?.participant_risk_assessment}</div>
      <div>Review Date: {settings?.review_date}</div>
    </div>
  );


  console.log("images: ", images);

  return (
    <A4PageWrapper footer={footer}>
      <div className="flex flex-col h-full font-sans text-[10px] px-4 pt-2 pb-4">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <img
            src={images?.infinityLogo || "/infinity_logo.png"}
            alt="Infinity Supports WA logo"
            className="h-[40px] w-[100px] object-contain"
          />
        </div>

        {/* Risk Assessment Matrix */}
        <p className="uppercase tracking-wider font-semibold text-center mb-1">
          Risk Assessment Matrix
        </p>
        <div className="mb-2 flex justify-center">
          <img
            src={images?.riskAssessmentMatrix}
            alt="Risk Assessment Matrix"
            className="h-[80px] object-contain"
          />
        </div>

        {/* Emergency Contact Table */}
        <div className="border border-black mb-2">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black px-1 py-0.5 text-left font-bold bg-gray-300"
                >
                  Emergency Contact Numbers
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 py-0.5 w-1/3">Police</td>
                <td colSpan={2} className="border border-black px-1 py-0.5 text-center">
                  <img
                    src={images?.emergencyNo}
                    alt="000 Emergency"
                    className="max-h-[25px] mx-auto"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5">Fire</td>
                <td className="border border-black px-1 py-0.5"></td>
                <td className="border border-black px-1 py-0.5"></td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5">Ambulance</td>
                <td className="border border-black px-1 py-0.5"></td>
                <td className="border border-black px-1 py-0.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Utilities Table */}
        <div className="border border-black">
          <table className="w-full border-collapse text-[9px]">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="border border-black px-1 py-0.5 text-left font-bold bg-gray-300"
                >
                  Utilities
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-1 py-0.5 w-1/3">Electricity Authority</td>
                <td className="border border-black px-1 py-0.5">Western Power</td>
                <td className="border border-black px-1 py-0.5">13 13 51</td>
              </tr>
              <tr>
                <td className="border border-black px-1 py-0.5">Water Authority</td>
                <td className="border border-black px-1 py-0.5">Water Corp</td>
                <td className="border border-black px-1 py-0.5">13 13 75</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page9;
