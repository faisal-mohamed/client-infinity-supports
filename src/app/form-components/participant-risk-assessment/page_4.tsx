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
      <div className="max-w-3xl mx-auto p-6 text-[11px] text-black font-sans">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://storage.googleapis.com/a1aa/image/5bfc581d-758a-47de-098f-ac02207058ae.jpg"
            alt="Infinity Supports WA logo"
            className="w-[150px] h-[60px] object-contain"
          />
        </div>

        <p className="text-center text-[10px] font-extrabold mb-4">MEDICATION</p>

        {/* Medication Table */}
        <table className="w-full border border-black border-collapse mb-6">
          <thead>
            <tr className="bg-[#a9b9d9]">
              <th className="border border-black text-left text-[12px] font-semibold px-2 py-1">
                Management of Medication
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-[11px]">
                <p className="mb-2">
                  Should any of the below be marked as <strong>YES</strong>, refer to
                  <strong> Form 24. Management of Medication</strong>
                </p>

                {/* Render each field dynamically */}
                {fields.map((field) => (
                  <div key={field.key} className="mb-3">
                    <p className="mb-1">{field.label}</p>
                    <div className="flex space-x-6">
                      <label className="inline-flex items-center space-x-1">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={getCheckboxValue(field.key)}
                          readOnly
                        />
                        <span>YES</span>
                      </label>
                      <label className="inline-flex items-center space-x-1">
                        <input
                          type="checkbox"
                          className="form-checkbox"
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

        {/* Static Info */}
        <p className="text-[11px] font-semibold text-center mb-3">
          Participant Dependency and Health-Safety Risk Assessment Table
        </p>

        <p className="text-[11px] mb-3">Steps to Use the Extended Table:</p>
        <ol className="list-decimal list-inside text-[11px] space-y-2 mb-16">
          <li>
            Assessment: Evaluate both the level of reliance on your services and the potential
            impact on health and safety for each participant.
          </li>
          <li>
            Categorisation: Assign the appropriate risk level based on the combined assessment of
            reliance and health-safety impact.
          </li>
          <li>
            Mitigation: Develop strategies and contingency plans that address not only the level of
            reliance but also the specific health and safety concerns identified for each risk
            level.
          </li>
          <li>
            Regular Review: Continuously review and update the risk assessment and mitigation
            strategies, considering any changes in participants' needs and potential risks.
          </li>
        </ol>

        {/* Footer */}
        <div className="flex justify-between text-[10px]">
          <span>Website: infinitysupportswa.org</span>
          <span>CF013</span>
          <span>Review Date:13/02/2025</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page4;
