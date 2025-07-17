import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page2: React.FC<any> = ({ schema, data }) => {
  const getValue = (key: string) => data?.[key] ?? '';

  const renderRadio = (key: string, options: string[]) => (
    <>
      {options?.map?.((opt) => (
        <label key={opt} className="inline-flex items-center ml-3">
          <input type="checkbox" readOnly checked={getValue(key) === opt} className="mr-1" />
          {opt}
        </label>
      )) ?? null}
    </>
  );

  return (
    <A4PageWrapper>
      <div className="max-w-3xl mx-auto p-6 text-sm leading-relaxed font-sans text-black">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="object-contain"
            height={80}
            width={200}
          />
        </div>

        {/* Section 4 */}
        <p className="font-bold mb-2">4. Observations & Challenges:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {schema?.observations?.map?.((field : any ) => (
            <li key={field?.key}>
              {field?.label}:
              <span className="ml-1 underline">{getValue(field?.key)}</span>
            </li>
          )) ?? null}
        </ul>

        {/* Section 5 */}
        <p className="font-bold mb-2">5. Recommendations & Improvements:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {schema?.recommendations?.map?.((field : any ) => (
            <li key={field?.key}>
              {field?.label}:{' '}
              {field?.type === 'radio'
                ? renderRadio(field?.key, field?.options ?? [])
                : <span className="ml-1 underline">{getValue(field?.key)}</span>}
            </li>
          )) ?? null}
        </ul>

        {/* Section 6 */}
        <p className="font-bold mb-2">6. Follow-Up Actions:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {schema?.followup?.map?.((field : any ) => (
            <li key={field?.key}>
              {field?.label}:{' '}
              {field?.type === 'radio'
                ? renderRadio(field?.key, field?.options ?? [])
                : <span className="ml-1 underline">{getValue(field?.key)}</span>}
            </li>
          )) ?? null}
        </ul>

        {/* Section 7 */}
        <p className="font-bold mb-2">7. Signatures:</p>
        <ul className="list-disc list-inside space-y-2 mb-12">
          {schema?.signatures?.map?.((field : any ) => (
            <li key={field?.key}>
              {field?.label}: <span className="ml-1 underline">{getValue(field?.key)}</span>
            </li>
          )) ?? null}
        </ul>

        {/* Footer */}
        <div className="flex justify-between text-xs text-blue-800">
          <a href="https://www.infinitysupportswa.org" className="underline">www.infinitysupportswa.org</a>
          <span>CF020</span>
          <span>DOR: 14/03/2026</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
