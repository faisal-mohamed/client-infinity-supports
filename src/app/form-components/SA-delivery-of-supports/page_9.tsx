import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Field {
  key: string;
  label: string;
  type: string;
  options?: string[];
  subItems?: string[];
}

interface Page9Props {
  schema?: any;
  data: any;
  settings: any;
  commonFieldsData: any;
}

const Page9: React.FC<Page9Props> = ({ data, schema, settings, commonFieldsData }) => {
  const fields = schema.fields;

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
    sex: 'sex'
  };

   const getValue = (key: string): string => {
    const rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];
  
    // ✅ Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }
  
    return rawValue ?? '';
  };

  const renderSignature = (key: string) => {
  const value = getValue(key);
  if (value?.startsWith('data:image')) {
    return <img src={value} alt="Signature" className="h-10" />;
  }
  return "__________________";
};


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

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Consent Table */}
          <div className="mb-6">
            <table className="w-full border border-black text-xs">
              <thead>
                <tr>
                  <th className="border border-black text-left p-3 font-semibold leading-loose">Consent</th>
                  <th className="border border-black w-32 p-3 font-semibold leading-loose"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field: any) => {
                  if (field.type === 'radio') {
                    return (
                      <tr key={field.key}>
                        <td className="border border-black p-3 align-top leading-loose">
                          <div>
                            {field.label}
                            {field.subItems && (
                              <ul className="list-disc ml-4 mt-2 text-xs leading-loose">
                                {field.subItems.map((item: any, idx: number) => {
                                  if (item.startsWith("Others")) {
                                    const othersValue = getValue("othersInfoSharingConsent");
                                    return (
                                      <li key={idx}>Others: {othersValue || "__________________________"}</li>
                                    );
                                  }
                                  return <li key={idx}>{item}</li>;
                                })}
                              </ul>
                            )}
                          </div>
                        </td>
                        <td className="border border-black p-3 align-top">
                          <div className="space-y-2">
                            {field.options?.map((opt: any) => (
                              <label key={opt} className="flex items-center text-xs">
                                <input
                                  type="radio"
                                  checked={getValue(field.key) === opt}
                                  readOnly
                                  className="mr-2 scale-75"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="space-y-4 flex-1">
            <table className="w-full border border-black text-xs">
              <tbody>
              <tr>
  <td className="border border-black p-4 leading-loose">
    <div className="flex">
      <div className="w-1/3">
        <strong>Signature of participant</strong>:<br />
        {renderSignature('participantSignature') || "__________________"}
      </div>
      <div className="w-1/3">
        <strong>Date</strong>:<br />
        {getValue('participantSignatureDate') || '___/___/____'}
      </div>
      <div className="w-1/3">
        <strong>Name</strong>:<br />
        {getValue('participantName') || '____________________'}
      </div>
    </div>
  </td>
</tr>

                <tr>
  <td className="border border-black p-4 leading-loose">
    I conrm that this agreement has been explained to the person receiving the services (participant) and that they agree to
this: [If signed by a Nominee:]
    <div className="flex">
      <div className="w-1/3">
        <strong>Signature of Nominee</strong>:<br />
        
        {renderSignature('nomineeSignature') || "__________________"}
      </div>
      <div className="w-1/3">
        <strong>Date</strong>:<br />
        {getValue('nomineeSignatureDate') || '___/___/____'}
      </div>
      <div className="w-1/3">
        <strong>Name</strong>:<br />
        {getValue('nomineeName') || '____________________'}
      </div>
    </div>
  </td>
</tr>
              </tbody>
            </table>

            <table className="w-full border border-black text-xs">
              <tbody>
                <tr>
  <td className="border border-black p-4 leading-loose">
    <div className="flex">
      <div className="w-1/3">
        <strong>Signature of Provider</strong>:<br />
        {renderSignature('providerSignature') || "__________________"}
      </div>
      <div className="w-1/3">
        <strong>Date</strong>:<br />
        {getValue('providerSignatureDate') || '___/___/____'}
      </div>
      <div className="w-1/3">
        <strong>Name</strong>:<br />
        {getValue('providerName') || '____________________'}
      </div>
    </div>
  </td>
</tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
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

export default Page9;
