import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface PageProps {
  schema: any;
  data: any;
}

const Page3: React.FC<PageProps> = ({ schema, data }) => {
  return (
    <A4PageWrapper>
      {/* Header with Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img
          src="/infinity_logo.png"
          alt="Infinity Supports WA logo"
          className="object-contain h-16"
        />
      </div>

      {/* Table - takes up remaining space */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <table className="w-full border border-black border-collapse text-sm flex-1">
          <tbody className="h-full">
            {schema.fields.map((field: any) => (
              <tr key={field.key} className="align-top">
                <td className="border border-black px-3 py-2 bg-gray-50 font-medium align-top leading-tight" style={{ width: '35%' }}>
                  {field.label}
                </td>
                <td className="border border-black px-3 py-2 text-sm leading-tight align-top">
                  {field.type === 'checkbox' ? (
                    <div className="space-y-2">
                      <p className="mb-2 text-sm leading-tight">{field.description}</p>
                      <div className="flex gap-4 mb-2">
                        {field.options.map((option: string) => (
                          <label key={option} className={`inline-flex items-center text-sm ${data[field.key] === option ? 'font-bold' : ''}`}>
                            <input 
                              type="checkbox" 
                              className="mr-2 scale-75" 
                              checked={data[field.key] === option} 
                              readOnly 
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                      <p className="font-bold text-sm leading-tight">{field.note}</p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {data[field.key]}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer - sticks to bottom */}
      <div className="flex justify-between items-center text-xs font-bold px-6 py-3 mt-auto border-t border-gray-200">
        <div>Website: infinitysupportswa.org</div>
        <div>CF014</div>
        <div>Review Date: 14/03/2026</div>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
