import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page2Props {
  schema: any;
  data: Record<string, any>;
}

const Page2: React.FC<Page2Props> = ({ schema, data }) => {
  return (
    <A4PageWrapper>
      <div className="w-full max-w-[794px] mx-auto px-6 pt-6 pb-12 text-[11px]">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://storage.googleapis.com/a1aa/image/5e702d54-cc0b-4027-4974-5ae78fbfaa8e.jpg"
            alt="Infinity Supports WA Logo"
            className="w-[150px] h-[60px] object-contain"
          />
        </div>

        {/* Table */}
        <table className="w-full border border-black border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="border border-black w-[20%]"></th>
              <th className="border border-black text-center font-bold py-1" colSpan={4}>
                INDIVIDUAL RISK ASSESSMENTS
              </th>
            </tr>
            <tr>
              <th className="border border-black font-normal py-1 px-1">No.</th>
              <th className="border border-black font-normal py-1 px-1">Item</th>
              <th className="border border-black font-normal py-1 px-1 w-[10%]">Y/N</th>
              <th className="border border-black font-normal py-1 px-1 w-[7%]">Risk Rating</th>
              <th className="border border-black font-normal py-1 px-1 w-[20%]">Comments/Controls</th>
            </tr>
          </thead>
          <tbody>
            {schema.fields.map((field: any, index: number) => {
              const key = `risk${index + 1}`;
              const yesChecked = data[key] === 'yes';
              const noChecked = data[key] === 'no';
              return (
                <tr key={key}>
                  <td className="border border-black py-1 px-1 align-top">{index + 1}</td>
                  <td className="border border-black py-1 px-1 align-top">{field.label}</td>
                  <td className="border border-black py-1 px-1 align-top">
                    <label className="inline-flex items-center mr-2">
                      <input
                        type="checkbox"
                        checked={yesChecked}
                        readOnly
                        className="w-3 h-3 mr-1"
                      />
                      YES
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={noChecked}
                        readOnly
                        className="w-3 h-3 mr-1"
                      />
                      NO
                    </label>
                  </td>
                  <td className="border border-black py-1 px-1 align-top">{data[`${key}Rating`] ?? ''}</td>
                  <td className="border border-black py-1 px-1 align-top">
                    {field.commentLabel ? `${field.commentLabel}: ` : ''}
                    {data[`${key}Comment`] ?? ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <footer className="flex justify-between text-[10px] mt-6 px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date:13/02/2025</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page2;
