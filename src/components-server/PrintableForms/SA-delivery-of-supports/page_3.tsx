

import React from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Field {
  key: string;
  label: string;
  type: string;
  additionalFields?: { key: string; label: string; type: string }[];
}

interface Page3Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page3: React.FC<Page3Props> = ({
  schema,
  data,
  commonFieldsData,
  settings,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    address: "street",
    dob: "dob",
    disability: "disability",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    homePhone: "phone",
    sex: "sex",
  };

  const getValue = (key: string) => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? "";
    }
    return data?.[key] ?? "";
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full flex-1 px-6 pt-6 pb-3 text-base leading-relaxed text-justify"
              style={{ lineHeight: '2.5' }}
>
        {/* Header / Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={images?.infinityLogo || "/infinity_logo.png"}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Service Payments Section */}
          <div className="mb-6">
            <h2 className="font-bold mb-4">Service Payments (NDIS)</h2>
            <div className="space-y-5">
              {/* First 3 checkboxes */}
              {schema?.fields?.slice(0, 3)?.map((field: Field) => (
                <div key={field.key}>
                  <label className="inline-flex items-start">
                    <input
                      type="checkbox"
                      checked={!!getValue(field.key)}
                      readOnly
                      className="mt-1 mr-2 scale-75 flex-shrink-0"
                    />
                    <span>{field.label}</span>
                  </label>
                </div>
              ))}

              {/* Plan Manager Managed */}
              <div>
                <label className="inline-flex items-start">
                  <input
                    type="checkbox"
                    checked={!!getValue("planManagerManaged")}
                    readOnly
                    className="mt-1 mr-2 scale-75 flex-shrink-0"
                  />
                  <span>
                    The Individual has nominated the Plan Management Provider{" "}
                    <span className="font-semibold underline">
                      {getValue("planManagerName") || "________________________"}
                    </span>{" "}
                    to manage the funding for NDIS supports provided under this
                    Service Agreement. After providing those supports, Infinity
                    Supports WA will claim payment for those supports from{" "}
                    <span className="font-semibold underline">
                      {getValue("fundingSource") || "________________________"}
                    </span>
                    .
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* GST Section */}
          <div>
            <h2 className="font-bold mb-4">Goods and Services Tax (GST) / NDIS</h2>
            <div className="mb-6">
              <p className="mb-0 font-medium">
                For the purposes of GST legislation, the Parties confirm that a
                supply of supports under this Service Agreement is a supply of
                one or more of the reasonable and necessary supports specified
                in the statement included, under subsection 33(2) of the
                National Disability Insurance Scheme Act 2013 (NDIS Act), in the
                Participant's NDIS plan currently in effect under section 37 of
                the NDIS Act.
              </p>
            </div>

            <div>
              <p className="font-bold mb-3">
                Responsibilities of Infinity Supports WA
              </p>
              <p>
                Infinity Supports WA agrees to:
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-bold">
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

export default Page3;
