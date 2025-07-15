import React from 'react';
import A4PageWrapper from './A4PageWrapper';

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
          <div>Website: infinitysupportswa.org</div>
          <div>CF008A</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
