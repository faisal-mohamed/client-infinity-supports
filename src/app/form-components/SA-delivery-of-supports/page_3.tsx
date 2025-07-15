import React from "react";
import A4PageWrapper from "./A4PageWrapper";

interface Field {
  key: string;
  label: string;
  type: string;
  additionalFields?: { key: string; label: string; type: string }[];
}

interface Page3Props {
   schema  ?: any;
  data : any;
  settings : any
  commonFieldsData: any
}

const Page3: React.FC<Page3Props> = ({ schema, data, commonFieldsData, settings }) => {
  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Service Payments Section */}
          <div className="mb-8">
            <h2 className="font-bold text-sm mb-4 leading-loose">
              Service Payments (NDIS)
            </h2>

            <div className="space-y-5 text-sm">
              {/* Render first 3 checkboxes dynamically */}
              {schema.fields.slice(0, 3).map((field : any ) => (
                <div key={field.key} className="leading-loose">
                  <label className="inline-flex items-start">
                    <input
                      type="checkbox"
                      checked={!!data[field.key]}
                      readOnly
                      className="mt-1 mr-2 scale-75 flex-shrink-0"
                    />
                    <span>{field.label}</span>
                  </label>
                </div>
              ))}

              {/* Hardcoded 4th checkbox with inputs */}
              <div className="leading-loose">
                <label className="inline-flex items-start">
                  <input
                    type="checkbox"
                    checked={!!data["planManagerManaged"]}
                    readOnly
                    className="mt-1 mr-2 scale-75 flex-shrink-0"
                  />
                  <span>
                    The Individual has nominated the Plan Management Provider{" "}
                    <span>
                      {data["planManagerName"] || "________________________"}
                    </span>
                    to manage the funding for NDIS supports provided under this
                    Service Agreement. After providing those supports, Infinity
                    Supports WA will claim payment for those supports from{" "}
                    <span>
                      {data["fundingSource"] || "________________________"}
                    </span>
                    .{" "}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* GST Section */}
          <div className="flex-1">
            <h2 className="font-bold text-sm mb-4 leading-loose">
              Goods and services tax (GST) / NDIS
            </h2>
            <p className="text-sm leading-loose mb-8">
              For the purposes of GST legislation, the Parties confirm that a
              supply of supports under this Service Agreement is a supply of one
              or more of the reasonable and necessary supports specified in the
              statement included, under subsection 33(2) of the National
              Disability Insurance Scheme Act 2013 (NDIS Act), in the
              Participant's NDIS plan currently in effect under section 37 of
              the NDIS Act.
            </p>

            {/* Responsibilities Heading */}
            <div>
              <p className="font-bold mb-3 text-sm leading-loose">
                Responsibilities of Infinity Supports WA
              </p>
              <p className="text-sm leading-loose">
                Infinity Supports WA agrees to:
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs font-bold mt-6 pt-3 border-t border-gray-200">
          <div>Website: infinitysupportswa.org</div>
          <div>CF008A</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
