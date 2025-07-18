import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page3Props {
  schema: any;
  data: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: Record<string, any>;
  images?: Record<string, string>;
}

const Page3: React.FC<Page3Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images = {},
}) => {
  const commonFieldMapping: Record<string, string> = {
    personName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-black font-sans">
        {/* Top Content */}
        <div className="flex flex-col flex-grow items-center px-6 pt-6">
          <div className="max-w-3xl w-full">
            {/* Logo */}
             <div className="flex justify-center mb-2">
            <img
              src={`${images?.infinityLogo || '/infinity_logo.png'}`} // Use provided image or default
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
                  {getValue?.('additionalSupport')}
                </div>
              </div>

              <div className="mb-8">
                <label className="font-bold">Assessment Review Date:</label>
                <span className="inline-block border-b border-black w-40 ml-2 align-middle">
                  {getValue?.('reviewDate')}
                </span>
              </div>

              <div className="mb-12">
                <label className="font-bold">Assessor's Signature:</label>
                <span className="inline-block border-b border-black w-48 ml-2 align-middle">
                  <img src={getValue?.('assessorSignature')} alt="Assessor Signature" />
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Sticky Footer */}
          <footer className="max-w-3xl mx-auto w-full px-4 pb-4 text-[12px] text-blue-700 flex justify-between">
          <a
            className="underline"
            href={settings?.company_website || 'https://www.infinitysupportswa.org'}
            target="_blank"
            rel="noreferrer"
          >
            {settings?.company_website || 'https://www.infinitysupportswa.org'}
          </a>
          <div>Date of Review: {settings?.review_date || 'N/A'}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
