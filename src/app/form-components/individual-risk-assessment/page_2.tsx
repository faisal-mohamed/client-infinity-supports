import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page2Props {
  schema: any;
  data: Record<string, any>;
}

const Page2: React.FC<Page2Props> = ({ schema, data }) => {
  const getValue = (key: string) => data?.[key] ?? '';

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-black font-sans text-sm">
        {/* Main Content */}
        <div className="flex-grow max-w-3xl mx-auto p-4">
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

          {/* Risk Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-black border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border border-black font-bold px-1 py-0.5 text-center">Risk Identified</th>
                  <th className="border border-black font-bold px-1 py-0.5 text-center">Likelihood</th>
                  <th className="border border-black font-bold px-1 py-0.5 text-center">Severity</th>
                  <th className="border border-black font-bold px-1 py-0.5 text-center">Control Measures</th>
                </tr>
              </thead>
              <tbody>
                {schema.riskTable.map((row: any, idx: number) => (
                  <tr className="h-12" key={idx}>
                    <td className="border border-black px-1 py-0.5 align-top">
                      {getValue(`riskIdentified_${idx + 1}`)}
                    </td>
                    <td className="border border-black px-1 py-0.5 align-top">
                      {getValue(`likelihood_${idx + 1}`)}
                    </td>
                    <td className="border border-black px-1 py-0.5 align-top">
                      {getValue(`severity_${idx + 1}`)}
                    </td>
                    <td className="border border-black px-1 py-0.5 align-top">
                      {getValue(`controls_${idx + 1}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-xs px-4 pb-4">
          <div className="max-w-3xl mx-auto flex justify-between">
            <a
              className="text-blue-600 underline"
              href="http://www.infinitysupportswa.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.infinitysupportswa.org
            </a>
            <span>Date of Review: 13/02/2026</span>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
