


import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Page4Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page4: React.FC<Page4Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  return (
    <A4PageWrapper>
      <div
        className="flex flex-col h-full flex-1 px-6 pt-6 pb-3 text-base text-justify"
        style={{ lineHeight: '2.5' }}
      >
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Provider Responsibilities */}
          <div className="mb-8 space-y-4">
  {schema?.sections?.providerResponsibilities?.map((item: string, index: number) => {
    const [before, after] = item.split('Infinity Supports WA');
    return (
      <p key={index} className="flex items-start gap-2">
        {/* PDF-safe bullet marker */}
        <span className="mr-2">•</span>
        <span>
          {item.includes('Infinity Supports WA') ? (
            <>
              {before}
              <span className="text-red-600 font-semibold">Infinity Supports WA</span>
              {after}
            </>
          ) : (
            item
          )}
        </span>
      </p>
    );
  })}
</div>


          {/* Responsibilities of Individual */}
          <div className="flex-1 flex flex-col justify-end">
            <p className="font-bold underline mb-3">
              {schema?.sections?.individualResponsibilitiesHeading}
            </p>
            <p>agrees to:</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-bold mt-auto pt-3 border-t border-gray-200">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.sa_delivery_of_supports}</div>
 <div>
            Review Date:{" "}
            {settings?.review_date &&
            /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
              ? format(parseISO(settings.review_date), "dd-MM-yyyy")
              : "N/A"}
          </div>{" "}        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
