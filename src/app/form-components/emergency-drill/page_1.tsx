import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page1: React.FC<any> = ({ schema, data }) => {
  const getValue = (key: string) => data?.[key] ?? '';
  const isChecked = (key: string) => !!data?.[key];

  const renderRadioGroup = (key: string, options: string[]) => (
    <span className="ml-2">
      {options?.map?.((opt) => (
        <label key={opt} className="inline-flex items-center ml-3">
          <input type="checkbox" checked={getValue(key) === opt} readOnly className="mr-1" />
          {opt}
        </label>
      )) ?? null}
    </span>
  );

  return (
    <A4PageWrapper>
      <div className="bg-white text-black p-6 max-w-3xl mx-auto text-xs leading-relaxed font-sans">
        {/* Header */}
        <div className="flex justify-center mb-2">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            height={70}
            width={150}
          />
        </div>
        <div className="text-center mb-1 font-semibold text-sm">
          Emergency Drill Reporting Form
        </div>
        <div className="text-center mb-6 italic text-xs">
          (For Disability Support Workers in a Client’s Home)
        </div>
        <hr className="border-gray-400 mb-6" />

        {/* Section 1 */}
        <div className="mb-4 font-semibold">1. General Information:</div>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {schema?.generalInfo?.map?.((field : any ) => (
            <li key={field?.key}>
              {field?.label}:{' '}
              {field?.type === 'radio'
                ? renderRadioGroup(field?.key, field?.options ?? [])
                : <span className="inline-block border-b border-black w-60 ml-1">{getValue(field?.key)}</span>}
            </li>
          )) ?? null}
        </ul>

        {/* Section 2 */}
        <div className="mb-4 font-semibold">2. Type of Emergency Drill Conducted:</div>
        <ul className="list-none space-y-2 mb-6">
          {schema?.drillTypes?.map?.((field : any ) => (
            <li key={field?.key}>
              <label className="inline-flex items-center">
                {field?.type === 'checkbox' ? (
                  <>
                    <input type="checkbox" checked={isChecked(field?.key)} readOnly className="mr-2" />
                    {field?.label}
                  </>
                ) : (
                  <>
                    <span className="mr-2">{field?.label}</span>
                    <span className="inline-block border-b border-black w-48 ml-1">
                      {getValue(field?.key)}
                    </span>
                  </>
                )}
              </label>
            </li>
          )) ?? null}
        </ul>

        {/* Section 3 */}
        <div className="mb-4 font-semibold">3. Drill Execution Details:</div>
        <ul className="list-disc list-inside space-y-2 mb-12">
          {schema?.executionDetails?.map?.((field : any ) => (
            <li key={field?.key}>
              {field?.label}:{' '}
              {field?.type === 'radio'
                ? renderRadioGroup(field?.key, field?.options ?? [])
                : <span className="inline-block border-b border-black w-60 ml-1">{getValue(field?.key)}</span>}
            </li>
          )) ?? null}
        </ul>

        {/* Footer */}
        <div className="flex justify-between text-xs text-blue-700 font-normal">
          <a
            className="underline"
            href="https://www.infinitysupportswa.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.infinitysupportswa.org
          </a>
          <div>CF020</div>
          <div>DOR: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
