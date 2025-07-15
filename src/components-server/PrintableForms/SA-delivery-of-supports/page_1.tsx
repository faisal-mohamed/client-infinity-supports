import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page1Props {
  schema: {
    fields: { key: string; label: string; type: string; options?: string[] }[];
  };
  data: { [key: string]: string };
}

const Page1: React.FC<Page1Props> = ({ schema, data } ) => {
  const getValue = (key: string) => data[key] || '';

  return (
    <A4PageWrapper>
      <div className="h-full flex flex-col p-6">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src={'/infinity_logo.png'} 
            alt="Infinity Supports WA Logo" 
            className="h-16 object-contain" 
          />
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <p className="font-bold underline text-sm">SERVICE AGREEMENT FOR SERVICE DELIVERY</p>
        </div>

        {/* Section 1 */}
        <div className="mb-3">
          <p className="font-bold underline text-sm">Section 1</p>
        </div>

        {/* Table - takes up most of the remaining space */}
        <div className="flex-1 flex flex-col">
          <table className="w-full border border-black border-collapse text-xs flex-1">
            <tbody className="h-full">
              <tr>
                <td className="border border-black p-2 font-bold align-top" style={{ width: '20%' }}> Date :</td>
                <td className="border border-black p-2 align-top" colSpan={3}>
                  {getValue('agreementDate')}
                </td>
              </tr>

            <tr className="bg-gray-300 font-bold">
  <td className="border border-black p-2 align-top" style={{ width: '60%' }} colSpan={3}>
    Participant Details
  </td>
  <td className="border border-black p-2 align-top text-right whitespace-nowrap" style={{ width: '40%' }}>
    NDIS Number: <span className="font-normal">{getValue('ndisNumber')}</span>
  </td>
</tr>


              <tr>
                <td className="border border-black p-2 align-top">
                  <strong>{schema.fields.find(f => f.key === 'surname')?.label}</strong>: {getValue('surname')}
                </td>
                <td className="border border-black p-2 align-top">
                  <strong>{schema.fields.find(f => f.key === 'givenNames')?.label}</strong>: {getValue('givenNames')}
                </td>
                <td className="border border-black p-2 align-top" colSpan={2}>
                  <div>
                    <p className="font-semibold mb-1">Sex:</p>
                    {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
                      <div key={option} className="flex items-center text-xs mb-1">
                        <input 
                          type="checkbox" 
                          readOnly 
                          checked={getValue('sex') === option} 
                          className="mr-2 scale-75" 
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={4}>
                   <strong>Pronoun</strong> : {getValue('pronoun')}
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={3}>
                  <strong>Are you an Aboriginal or Torres Strait Island descent?</strong>
                </td>
                <td className="border border-black p-2 align-top">
                  <label className="inline-flex items-center mr-3 text-xs">
                    <input 
                      type="checkbox" 
                      readOnly 
                      checked={getValue('indigenousStatus') === 'Yes'} 
                      className="mr-1 scale-75" 
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center text-xs">
                    <input 
                      type="checkbox" 
                      readOnly 
                      checked={getValue('indigenousStatus') === 'No'} 
                      className="mr-1 scale-75" 
                    />
                    No
                  </label>
                </td>
              </tr>

              <tr>
  <td className="border border-black p-2 align-top" colSpan={2}>
    <strong>Preferred name</strong> : {getValue('preferredName')}
  </td>
  <td className="border border-black p-2 align-top" colSpan={2}>
    <strong>Date of Birth</strong> : {getValue('dob')}
  </td>
</tr>


              <tr className="bg-gray-300 font-bold">
                <td className="border border-black p-2 align-top" colSpan={4}>
                 Residential Address Details
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={4}>
                  <strong>Number / Street</strong> : {getValue('street')}
                </td>
              </tr>

             <tr>
  <td className="border border-black p-2 align-top" colSpan={2}>
    <strong>State</strong> : {getValue('state')}
  </td>
  <td className="border border-black p-2 align-top" colSpan={2}>
    <strong>Postcode</strong> : {getValue('postcode')}
  </td>
</tr>


              <tr className="bg-gray-300 font-bold">
                <td className="border border-black p-2 align-top" colSpan={4}>
                  Participant Contact Details
                </td>
              </tr>

              <tr>
                <td className="border border-black p-2 align-top" colSpan={4}>
                  <strong>Email address</strong> : {getValue('email')}
                </td>
              </tr>

              <tr>
  <td className="border border-black p-2 align-top" colSpan={2}>
    <strong>Home Phone No</strong> : {getValue('homePhone')}
  </td>
  <td className="border border-black p-2 align-top" colSpan={2}>
    <strong>Mobile No</strong> : {getValue('mobilePhone')}
  </td>
</tr>

            </tbody>
          </table>
        </div>

        {/* Footer Description */}
        <div className="mt-4">
          <p className="leading-relaxed text-xs">
            All figures quoted are based on NDIS price guide. This Service Agreement is made for the purpose
            of providing supports in accordance with the Individual's plan, it outlines key responsibilities required
            to enable <span className="text-red-600 font-semibold">Infinity Supports WA</span> to deliver quality support to
          </p>
        </div>

        {/* Footer - at bottom */}
        <div className="flex justify-between items-center text-xs font-bold mt-4 pt-3 border-t border-gray-200">
          <div>Website: infinitysupportswa.org</div>
          <div>CF008A</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page1;
