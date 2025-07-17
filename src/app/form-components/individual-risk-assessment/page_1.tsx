import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page1Props {
  schema: any;
  data: Record<string, any>;
}

const Page1: React.FC<Page1Props> = ({ schema, data }) => {
  const getValue = (key: string) => data?.[key] ?? '';

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-black font-sans text-[14px]">
        {/* Content Area */}
        <div className="flex-grow p-4 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="/infinity_logo.png"
              alt="Infinity Supports WA logo"
              className="w-[250px] h-[100px]"
            />
          </div>

          <div className="text-center font-bold text-[14px] mb-6">
            Individual Activity Risk Assessment
          </div>

          {/* Person, Activity, Assessor, Date, Location */}
          <div className="flex justify-between mb-6 max-w-3xl mx-auto">
            <div className="w-1/2 space-y-4">
              {schema.headerInfo.slice(0, 3).map((field : any ) => (
                <div key={field.key}>
                  <span className="underline">{field.label}:</span>{' '}
                  <span className="ml-1">{getValue(field.key)}</span>
                </div>
              ))}
            </div>
            <div className="w-1/2 text-right space-y-4">
              {schema.headerInfo.slice(3).map((field : any ) => (
                <div key={field.key}>
                  <span className="underline">{field.label}:</span>{' '}
                  <span className="ml-1">{getValue(field.key)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Matrix Table */}
          <div className="overflow-x-auto">
            <img
              src="/individual-risk-assessment.png"
              alt="Risk Matrix Table"
              className="w-full border border-black"
            />
          </div>

          {/* Legend Explanation */}
          <div className="mt-6 max-w-3xl mx-auto text-[14px]">
            <div className="mb-1">
              <span className="underline">LOW</span>{' '}
              <span className="text-green-600 font-semibold">GREEN</span>
            </div>
            <div className="mb-4">
              Visit acceptable. Ensure control options are followed.
            </div>
            <div className="mb-1">
              <span className="underline">MEDIUM</span>{' '}
              <span className="text-yellow-400 font-semibold">YELLOW</span>
            </div>
            <div>
              Visit should only proceed after consultation with manager. The risks should
              be reviewed to consider all the hazards involved. The risks must be reduced prior
              to the visit – if in doubt, re-classify as Moderate Risk.
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <footer className="max-w-3xl mx-auto w-full px-4 pb-4 text-[12px] text-blue-700 flex justify-between">
          <a
            className="underline"
            href="https://www.infinitysupportswa.org"
            target="_blank"
            rel="noreferrer"
          >
            www.infinitysupportswa.org
          </a>
          <div>Date of Review: 13/02/2026</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
