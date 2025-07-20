import React from 'react';
import A4PageWrapper from './A4PageWrapper';


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


    const getValue = (key: string) => {
  if (commonFieldMapping[key]) {
    return commonFieldsData?.[commonFieldMapping[key]] ?? '';
  }
  return data?.[key] ?? '';
};



  return (
    <A4PageWrapper>
      <div className="flex flex-col justify-between h-full p-6 text-[11px] text-gray-800 font-sans leading-[1.75]">
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
          {/* <p className="text-center text-xs font-semibold mb-4">
            {schema?.title}
          </p> */}

          {/* Table 1 - Budget Discussion & Goals */}
          <table className="w-full border border-black border-collapse text-xs mb-6">
            <tbody>
              <tr>
                <td className="border border-black p-2 font-bold" colSpan={2}>
                  {schema?.budgetApproval?.label}
                  <input
                    type="checkbox"
                    checked={isChecked(data?.budgetApproval, 'Yes')}
                    readOnly
                    className="ml-2 align-middle w-4 h-4 border border-black bg-gray-300"
                  />
                  <span className="ml-1 font-normal align-middle">Yes</span>
                  <input
                    type="checkbox"
                    checked={isChecked(data?.budgetApproval, 'No')}
                    readOnly
                    className="ml-4 align-middle w-4 h-4 border border-black bg-gray-300"
                  />
                  <span className="ml-1 font-normal align-middle">No</span>
                </td>
              </tr>
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
          <table className="w-full border border-black border-collapse text-xs">
            <tbody>
              <tr>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center w-1/3">
                  {schema?.signatures?.participant?.label}
                </td>
                <td className="border border-black p-1 w-1/3">
                   <img src={`${data?.participantSignature}`} alt="Participant Signature" />
                </td>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center w-1/6">
                  Date
                </td>
                <td className="border border-black p-1 w-1/6">
                  {data?.participantSignatureDate || ''}
                </td>
              </tr>
              <tr>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center">
                  {schema?.signatures?.author?.label}
                </td>
                <td className="border border-black p-1">
                <img src={`${data?.authorSignature}`} alt="Author Signature" />

                
                </td>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center">
                  Date
                </td>
                <td className="border border-black p-1">
                  {data?.providerSignatureDate || ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
         <footer className="mt-auto flex justify-between text-[10px] text-gray-500 pt-4">
          <div>Website: {settings?.company_website}</div>
          <div>{settings?.support_action_plan}</div>
          <div>Review Date: {settings?.review_date}</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
