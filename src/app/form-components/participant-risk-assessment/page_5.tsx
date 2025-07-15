import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Field {
  key: string;
  label: string;
  type: string;
}

interface Page5Props {
  data: Record<string, any>;
  schema?: { fields: Field[] };
  settings?: any;
  commonFieldsData?: any;
}

const Page5: React.FC<Page5Props> = ({ data, schema }) => {
  const getCheckboxValue = (key: string) => data?.[key] === true;

  return (
    <A4PageWrapper>
      <div className="px-6 py-6 text-[12px] text-black font-sans leading-relaxed">
        {/* Header with Logo */}
        <header className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/c481bc31-5c0c-4c36-aad9-84fd38d3b1a7.jpg"
            alt="Infinity Supports WA"
            className="h-[60px] w-[150px] object-contain"
          />
        </header>

        {/* Intro Section */}
        <main className="max-w-4xl mx-auto">
          <ol className="list-decimal list-inside space-y-3 mb-6">
            <li>
              <strong>Communication:</strong> Ensure that all stakeholders, including participants,
              families, and your team, understand the dual assessment of reliance and health-safety
              impact, as well as the corresponding mitigation plans.
            </li>
            <li>
              <strong>Emergency Planning:</strong> For participants with higher risk levels, develop
              emergency plans that outline steps to be taken in case of service disruptions or
              unexpected events.
            </li>
          </ol>

          <p className="mb-6">
            By considering both the participants' level of reliance on the services and the
            potential consequences for their health and safety in case of disruptions, we can create
            a more comprehensive risk assessment framework that prioritises their well-being.
          </p>

          {/* Risk Assessment Table */}
          <div className="overflow-x-auto border border-gray-300 rounded-md">
            <table className="w-full border-collapse border text-[11px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left w-24">Risk Level</th>
                  <th className="border p-2 text-left w-48">Description</th>
                  <th className="border p-2 text-left w-48">Criteria</th>
                  <th className="border p-2 text-left w-48">Impact on Health-Safety</th>
                  <th className="border p-2 text-left w-24 font-semibold text-center">
                    Select Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-green-600 font-semibold">Low</td>
                  <td className="border p-2">
                    Participants have a low reliance on provider services to meet daily living
                    needs.
                  </td>
                  <td className="border p-2">
                    Participants can independently perform most daily living activities without
                    assistance. Any disruptions in services would have minimal impact on their
                    overall well-being.
                  </td>
                  <td className="border p-2">
                    Disruptions in services would have minimal impact on participants' health and
                    safety, as they can manage most activities independently.
                  </td>
                  <td className="border p-2 bg-gray-100 text-center">
                    <input
                      type="checkbox"
                      checked={getCheckboxValue('riskLevelLow')}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 text-blue-700 font-semibold">Moderate</td>
                  <td className="border p-2">
                    Participants have a moderate reliance on provider services for certain daily
                    living needs.
                  </td>
                  <td className="border p-2">
                    Participants can perform some daily activities independently but rely on the
                    provider for specific tasks such as transportation, meal preparation, or
                    medication management.
                  </td>
                  <td className="border p-2">
                    Disruptions in services could moderately impact participants' health and safety.
                  </td>
                  <td className="border p-2 bg-gray-100 text-center">
                    <input
                      type="checkbox"
                      checked={getCheckboxValue('riskLevelModerate')}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex justify-between text-[10px] mt-12">
          <span>Website: infinitysupportzwa.org</span>
          <span>CF013</span>
          <span>Review Date:13/02/2025</span>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page5;
