import { format, parseISO, isValid } from "date-fns";


import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page5Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page5: React.FC<Page5Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  return (
    <A4PageWrapper>
      <div
        className="flex flex-col flex-1 px-6 pt-6 pb-3 h-full text-base text-justify"
        style={{ lineHeight: '2.5' }}
      >
        {/* Header with Logo */}
        <div className="flex justify-center mb-6 shrink-0">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-start mb-6 space-y-4">
          {schema?.responsibilities?.map((item: string, idx: number) => (
            <p key={idx} className="flex items-start gap-2">
              {/* Bullet marker */}
              <span className="mr-2">•</span>
              <span>
                {item.includes('Infinity Supports WA') ? (
                  item.split(/(Infinity Supports WA(?:'s)?)/).map((part, i) =>
                    part.includes('Infinity Supports WA') ? (
                      <span key={i} className="text-red-600 font-semibold">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )
                ) : (
                  item
                )}
              </span>
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-200 text-xs font-bold flex justify-between items-center shrink-0">
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

export default Page5;
