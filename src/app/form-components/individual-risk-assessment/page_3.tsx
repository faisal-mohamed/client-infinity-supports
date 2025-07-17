import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page3Props {
  schema: any;
  data: Record<string, any>;
}

const Page3: React.FC<Page3Props> = ({ schema, data }) => {
  const getValue = (key: string) => data?.[key] ?? '';

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-black font-sans">
        {/* Top Content */}
        <div className="flex flex-col flex-grow items-center px-6 pt-6">
          <div className="max-w-3xl w-full">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <img
                src="/infinity_logo.png"
                alt="Infinity Supports WA logo"
                className="w-[250px] h-[100px]"
              />
            </div>

            {/* Empty Grid Placeholder */}
            <div className="w-full border border-black grid grid-cols-[1fr_1fr_4fr] mb-12">
              <div className="border-r border-black h-10"></div>
              <div className="border-r border-black h-10"></div>
              <div className="h-10"></div>
            </div>

            {/* Form Content */}
            <form className="w-full">
              <div className="mb-12">
                <label className="block font-bold mb-4">Additional Support Requirements:</label>
                <div className="whitespace-pre-wrap border-b border-gray-400 min-h-[120px] pb-2">
                  {getValue('additionalSupport')}
                </div>
              </div>

              <div className="mb-8">
                <label className="font-bold">Assessment Review Date:</label>
                <span className="inline-block border-b border-black w-40 ml-2 align-middle">
                  {getValue('reviewDate')}
                </span>
              </div>

              <div className="mb-12">
                <label className="font-bold">Assessor's Signature:</label>
                <span className="inline-block border-b border-black w-48 ml-2 align-middle">
                  {getValue('assessorSignature')}
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Sticky Footer */}
        <footer className="text-xs text-blue-700 px-6">
          <div className="max-w-3xl mx-auto flex justify-between w-full pb-4">
            <a
              className="underline"
              href="http://www.infinitysupportswa.org"
              target="_blank"
              rel="noreferrer"
            >
              www.infinitysupportswa.org
            </a>
            <div>Date of Review: 13/02/2026</div>
          </div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
