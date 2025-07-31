import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Page5Props {
   schema  ?: any;
  data : any;
  settings : any
  commonFieldsData: any
}

const Page5: React.FC<Page5Props> = ({ schema, data, commonFieldsData, settings }) => {
  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
        <img
            src={'/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content area - takes up remaining space */}
        <div className="flex-1">
          {/* Responsibilities List */}
          <ul className="list-disc list-inside space-y-5 text-sm leading-loose">
            {schema.responsibilities.map((item : any , idx : any ) => (
              <li key={idx} className="leading-loose">
                {item.includes("Infinity Supports WA") ? (
                  item.split(/(Infinity Supports WA(?:'s)?)/).map((part : any , i : any) =>
                    part.includes("Infinity Supports WA") ? (
                      <span key={i} className="text-red-600 font-semibold">{part}</span>
                    ) : (
                      part
                    )
                  )
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer - at bottom */}
        <div className="flex justify-between items-center text-xs font-bold mt-6 pt-3 border-t border-gray-200">
        <div>Website: {settings?.company_website}</div>
          <div>{settings?.sa_delivery_of_supports}</div>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>          </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
