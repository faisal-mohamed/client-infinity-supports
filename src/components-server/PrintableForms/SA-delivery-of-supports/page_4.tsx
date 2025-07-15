import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page4Props {
  schema: {
    sections: {
      providerResponsibilities: string[];
      individualResponsibilitiesHeading: string;
    };
  };
  logoPath: string;
}

const Page4: React.FC<Page4Props> = ({ schema, logoPath }) => {
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
        <div className="flex-1 flex flex-col">
          {/* Provider Responsibilities */}
          <div className="flex-1">
            <ul className="list-disc pl-5 space-y-4 mb-8 text-sm leading-loose">
              {schema.sections.providerResponsibilities.map((item, index) => (
                <li key={index} className="leading-loose">
                  {item.includes("Infinity Supports WA") ? (
                    <>
                      {item.split("Infinity Supports WA")[0]}
                      <span className="text-red-600 font-semibold">Infinity Supports WA</span>
                      {item.split("Infinity Supports WA")[1]}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>


            {/* Individual Responsibilities Heading */}
            <div>
              <p className="font-bold underline text-sm leading-loose mb-3">
                {schema.sections.individualResponsibilitiesHeading}
              </p>
              <p className="text-sm leading-loose">agrees to:</p>
            </div>
          </div>
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

export default Page4;
