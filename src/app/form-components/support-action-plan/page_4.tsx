import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from 'date-fns';


const commonFieldMapping: Record<string, string> = {
  ndisNumber: "ndis",
  gender: 'sex',
  participantName: 'name',
  dob: "dob",
  address: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  phone: "phone",
};


const Page4: React.FC<any> = ({ schema, data, settings, commonFieldsData }) => {
  const isChecked = (value: string, option: string) => value?.toLowerCase?.() === option.toLowerCase();


  const formatDate = (value: string): string => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    }
    return value;
  };
  
    
  const getValue = (key: string): string => {
    const raw = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : data?.[key];
  
    return formatDate(raw ?? '');
  };
  


  return (
    <A4PageWrapper>
      <div className="flex flex-col justify-between h-full p-6 text-gray-800 font-sans" style={{ fontSize: '11px', lineHeight: '1.75' }}>
        {/* Content Block */}
        <div>
          {/* Logo */}
          <div className="flex justify-center mb-2">
             <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA Logo"
            className="h-[50px] w-[150px] object-contain"
          />
          </div>

          {/* Title */}
          {/* <p className="text-center text-[11px] font-semibold mb-4">
            {schema?.title}
          </p> */}

          {/* Table 1 - Goals Section (Budget Approval question removed - it's already in Mainstream Supports section) */}
          <table className="w-full border border-black border-collapse mb-6" style={{ fontSize: '11px' }}>
            <tbody>
              <tr>
                <td colSpan={2} className="border border-black bg-blue-200 font-bold p-1">
                  {schema?.goalsSection?.title}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="border border-black p-4 h-48 whitespace-pre-wrap align-top">
                  {data?.goalsText || ''}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 2 - Signatures */}
          <table className="w-full border border-black border-collapse text-[11px]">
  <tbody>
    {/* Participant Signature */}
    <tr>
      <td colSpan={2} className="border border-black bg-blue-200 font-bold p-1 text-left">
        {schema?.signatures?.participant?.label}
      </td>
    </tr>
    <tr className="h-[60px]">
      <td className="border border-black p-2 w-1/2">
        {data?.participantSignature ? (
          <div className="w-full h-full flex items-center justify-start overflow-hidden">
            <img
              src={data.participantSignature}
              alt="Participant Signature"
              className="h-[50px] object-contain"
            />
          </div>
        ) : (
          <span className="italic text-gray-400">No signature</span>
        )}
      </td>
     <td className="border border-black p-2 w-1/2 align-top">
  <span className="font-bold">Date:</span> {formatDate(data?.participantSignatureDate || '')}
</td>

    </tr>

    {/* Author Signature */}
    <tr>
      <td colSpan={2} className="border border-black bg-blue-200 font-bold p-1 text-left">
        {schema?.signatures?.author?.label}
      </td>
    </tr>
    <tr className="h-[60px]">
      <td className="border border-black p-2 w-1/2">
        {data?.authorSignature ? (
          <div className="w-full h-full flex items-center justify-start overflow-hidden">
            <img
              src={data.authorSignature}
              alt="Author Signature"
              className="h-[50px] object-contain"
            />
          </div>
        ) : (
          <span className="italic text-gray-400">No signature</span>
        )}
      </td>
    <td className="border border-black p-2 w-1/2 align-top">
  <span className="font-bold">Date:</span> {formatDate(data?.providerSignatureDate || '')}
</td>

    </tr>
  </tbody>
</table>

        </div>

        {/* Footer */}
         <footer className="mt-auto flex justify-between text-[11px] text-gray-500 pt-4">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.support_action_plan}</div>
<div>Review Date: {formatDate(settings?.review_date)}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
