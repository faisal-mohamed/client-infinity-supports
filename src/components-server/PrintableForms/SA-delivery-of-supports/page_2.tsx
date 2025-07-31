

import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Page2Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
  images: any;
}

const Page2: React.FC<Page2Props> = ({
  schema,
  data,
  settings,
  commonFieldsData,
  images,
}) => {
  const commonFieldMapping: Record<string, string> = {
    givenNames: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex',
  };

  const getValue = (key: string) => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? '';
    }
    return data?.[key] ?? '';
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full flex-1 px-6 pt-6 pb-3 text-base"
              style={{ lineHeight: '2' }}
>
        {/* Header / Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={images?.infinityLogo || '/infinity_logo.png'}
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col text-justify">
          <p className="leading-relaxed mb-6">
            Individuals. This agreement is of ongoing nature and will remain in place unless either party
            chooses to terminate by giving appropriate notice as mentioned in the “ending this service
            agreement” section.
          </p>

          <div className="space-y-4 mb-6">
            {schema?.fields?.map((field: any) => (
              <p key={field.key} className="flex items-start leading-relaxed">
                <input
                  type="checkbox"
                  className="mt-1 mr-2 scale-75 flex-shrink-0"
                  readOnly
                  checked={!!getValue(field.key)}
                />
                <span>{field.label}</span>
              </p>
            ))}
          </div>

          <p className="leading-relaxed mb-6">
            The Parties agree that this Service Agreement is made in line with the funding body which
            provides the Individual's funding, which aims to:
          </p>

          <ol className="list-decimal list-inside ml-4 space-y-3 leading-relaxed mb-6">
            <li>
              Support the independence and social and economic participation of people with disability, and
            </li>
            <li>
              Enable people with a disability to exercise choice and control in the pursuit of their goals and
              the planning and delivery of their supports.
            </li>
          </ol>

          <p className="font-bold leading-relaxed mb-4">Schedule of Supports</p>

          <p className="leading-relaxed mb-6">
            <span className="text-red-600 font-semibold">Infinity Supports WA</span> agrees to provide the
            Individual named in Section 1 the support as per the Schedule of Support and duration of the
            support.
          </p>

          <p className="leading-relaxed mb-6">
            The supports and their prices are set out in the Schedule of Supports. All supports are as per
            the NDIS Price Guide and are GST inclusive (if applicable) and include the cost of providing the
            supports. All figures quoted below are based on NDIS pricing and the individual's NDIS plan at
            the time of agreement. Prices, funding totals and hours will be adjusted periodically to reflect
            changes to NDIS pricing and the individual's NDIS plan.
          </p>

          <div className="flex-1 flex flex-col justify-end">
            <p className="mb-0 font-medium leading-relaxed text-justify">
              Additional Agreed information in the provision of support by{' '}
              <span className="text-red-600 font-semibold">Infinity Supports WA</span> PTY Ltd
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between items-center font-bold">
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

export default Page2;
