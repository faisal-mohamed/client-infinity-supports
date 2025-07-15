import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Field {
  key: string;
  label: string;
  type: string;
  options?: string[];
  subItems?: string[];
}

interface Page9Props {
  data: Record<string, any>;
  schema: { fields: Field[] };
}

const Page9: React.FC<Page9Props> = ({ data, schema }) => {
  const fields = schema.fields;

  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-6">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Content area - takes up remaining space */}
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
                {fields.map((field) => {
                  if (field.type === 'radio') {
                    return (
                      <tr key={field.key}>
                        <td className="border border-black p-3 align-top leading-loose">
                          <div className="leading-loose">
                            {field.label}
                            {field.subItems && (
  <ul className="list-disc ml-4 mt-2 text-xs leading-loose">
    {field.subItems.map((item, idx) => {
      if (item.startsWith("Others")) {
        const othersValue = data.othersInfoSharingConsent;
        return (
          <li key={idx} className="leading-loose">
            Others: {othersValue || "__________________________"}
          </li>
        );
      }
      return <li key={idx} className="leading-loose">{item}</li>;
    })}
  </ul>
)}

                          </div>
                        </td>
                        <td className="border border-black p-3 align-top">
                          <div className="space-y-2">
                            {field.options?.map((opt) => (
                              <label key={opt} className="flex items-center text-xs leading-loose">
                                <input
                                  type="radio"
                                  checked={data[field.key] === opt}
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

          {/* Signature Tables */}
          <div className="space-y-4 flex-1">
            <table className="w-full border border-black text-xs">
              <tbody>
                <tr>
                  <td className="border border-black p-4 leading-loose">
                    <strong>Signature of participant</strong>: { data.participantSignature || "__________________"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Date</strong>: {data.participantSignatureDate || '___/___/____'} <br />
                    <span className="mt-3 inline-block leading-loose"><strong>Name</strong>: {data.participantName || '____________________'}</span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 leading-loose">
                    I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this: [If signed by a Nominee:] 
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 leading-loose">
                    <strong>Signature of Nominee</strong>: { data.signatureOfNominee || "__________________"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Date</strong>: {data.nomineeSignatureDate || '___/___/____'} <br />
                    <span className="mt-3 inline-block leading-loose"><strong>Name</strong>: {data.nomineeName || '____________________'}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border border-black text-xs">
              <tbody>
                <tr>
                  <td className="border border-black p-4 leading-loose">
                    <strong>Signature on behalf of Infinity Supports WA</strong>: { data.signatureOnBehalfOfInfinitySupportsWA || "__________________"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Date</strong>: {data.providerSignatureDate || '___/___/____'} <br />
                    <span className="mt-3 inline-block leading-loose"><strong>Name</strong>: {data.providerName || '____________________'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
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

export default Page9;
