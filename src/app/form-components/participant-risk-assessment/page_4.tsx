

import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Field {
  key: string;
  label: string;
  type: string;
}

interface Page4Props {
  data: Record<string, any>;
  schema?: { fields: Field[] };
  settings: any;
  commonFieldsData: any;
  images?: any;
}

const Page4: React.FC<Page4Props> = ({ data, schema, settings }) => {
  const fields = schema?.fields || [];

  const getCheckboxValue = (key: string) => {
    return data?.[key] === 'yes';
  };

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-sm font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        <h2 className="text-center text-lg font-semibold mb-4">MEDICATION</h2>

        {/* Medication Table */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-sm flex-1">
            <thead>
              <tr className="bg-[#a9b9d9]">
                <th className="border border-black p-3 text-left font-semibold">
                  Management of Medication
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-3">
                  <p className="mb-4">
                    Should any of the below be marked as <strong>YES</strong>, refer to
                    <strong> Form 24. Management of Medication</strong>
                  </p>

                  {fields.map((field) => (
                    <div key={field.key} className="mb-4">
                      <p className="mb-2">{field.label}</p>
                      <div className="flex gap-6">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-checkbox w-3 h-3"
                            checked={getCheckboxValue(field.key)}
                            readOnly
                          />
                          <span>YES</span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-checkbox w-3 h-3"
                            checked={data?.[field.key] === 'no'}
                            readOnly
                          />
                          <span>NO</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Static Instruction Section */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-center font-semibold mb-3">
            Participant Dependency and Health-Safety Risk Assessment Table
          </h3>

          <p className="mb-2">Steps to Use the Extended Table:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Assessment:</strong> Evaluate both the level of reliance on your services and
              the potential impact on health and safety for each participant.
            </li>
            <li>
              <strong>Categorisation:</strong> Assign the appropriate risk level based on the combined
              assessment of reliance and health-safety impact.
            </li>
            <li>
              <strong>Mitigation:</strong> Develop strategies and contingency plans that address not
              only the level of reliance but also the specific health and safety concerns identified
              for each risk level.
            </li>
            <li>
              <strong>Regular Review:</strong> Continuously review and update the risk assessment and
              mitigation strategies, considering any changes in participants' needs and potential
              risks.
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <div className="flex justify-between text-xs px-2">
            <div>Website: infinitysupportswa.org</div>
            <div>CF013</div>
            <div>Review Date: 13/02/2025</div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
