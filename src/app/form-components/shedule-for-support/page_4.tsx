import React from 'react';
import A4PageWrapper from './A4PageWrapper';

const Page4: React.FC<any> = ({ schema, data }) => {
  const isChecked = (value: string, option: string) => value?.toLowerCase?.() === option.toLowerCase();

  return (
    <A4PageWrapper>
      <div className="flex flex-col justify-between h-full p-6 text-[11px] text-gray-800 font-sans leading-[1.75]">
        {/* Content Block */}
        <div>
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="https://storage.googleapis.com/a1aa/image/5a54bdc2-2c70-4d65-a83b-9a1b6420845c.jpg"
              alt="Infinity Supports WA logo"
              className="h-[50px] w-[150px] object-contain"
            />
          </div>

          {/* Title */}
          <p className="text-center text-xs font-semibold mb-4">
            {schema?.title}
          </p>

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
                  {data?.participantSignature || ''}
                </td>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center w-1/6">
                  Date
                </td>
                <td className="border border-black p-1 w-1/6">
                  {data?.participantDate || ''}
                </td>
              </tr>
              <tr>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center">
                  {schema?.signatures?.author?.label}
                </td>
                <td className="border border-black p-1">
                  {data?.authorSignature || ''}
                </td>
                <td className="border border-black bg-blue-200 font-bold p-1 text-center">
                  Date
                </td>
                <td className="border border-black p-1">
                  {data?.authorDate || ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-[10px] text-gray-600 mt-6 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF006</div>
          <div>Review Date: 14/03/2026</div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
