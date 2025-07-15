import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Field {
  key: string;
  label: string;
  type: string;
}

interface Page6Props {
  data: Record<string, any>;
  schema?: { fields: Field[] };
  settings?: any;
  commonFieldsData?: any;
}

const Page6: React.FC<Page6Props> = ({ data }) => {
  const getCheckboxValue = (key: string) => data?.[key] === true;

  return (
    <A4PageWrapper>
      <div className="px-4 pt-10 text-[12px] text-black font-sans">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://storage.googleapis.com/a1aa/image/452ce118-b80e-4083-992e-f75a715ebe53.jpg"
            alt="Infinity Supports WA Logo"
            className="object-contain"
            width="200"
            height="60"
          />
        </div>

        {/* Risk Table */}
        <div className="overflow-x-auto">
          <table className="table-fixed border border-gray-300 w-full text-xs">
            <tbody>
              <tr>
                <td className="border border-gray-300 w-[5%]"></td>
                <td className="border border-gray-300 w-[15%]"></td>
                <td className="border border-gray-300 w-[35%] px-4 py-3">
                  in services could moderately affect their overall well-being.
                </td>
                <td className="border border-gray-300 w-[35%] px-4 py-3">
                  tasks they rely on the provider to assist with.
                </td>
                <td className="border border-gray-300 w-[10%]"></td>
              </tr>

              {/* High Risk Row */}
              <tr className="bg-gray-100">
                <td className="border border-gray-300 px-2 py-3 font-bold text-yellow-700 text-[13px]">
                  High
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Participants have a high reliance on provider services to meet essential daily living needs.
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Participants require significant assistance from the provider for activities of daily living,
                  including personal care, mobility, meal preparation, and medication management. A disruption in
                  services would have a significant impact on their overall well-being and quality of life.
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Disruptions in services would significantly impact participants' health and safety, as they rely
                  heavily on the provider for essential tasks. There could be risks related to personal care, medical
                  needs, and more.
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="checkbox"
                    checked={getCheckboxValue('riskLevelHigh')}
                    readOnly
                  />
                </td>
              </tr>

              {/* Critical Risk Row */}
              <tr>
                <td className="border border-gray-300 px-2 py-3 font-bold text-red-600 text-[13px]">
                  Critical
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Participants have a critical reliance on provider services for all daily living needs.
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Participants are entirely dependent on the provider for all activities of daily living, including
                  personal care, mobility, communication, medical support, and more. Any disruption in services would
                  pose a severe and immediate threat to their health and well-being.
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  Disruptions in services would pose a critical threat to participants' health and safety. Their complete
                  dependency on the provider means that any interruption could lead to life-threatening situations.
                </td>
                <td className="border border-gray-300 text-center">
                  <input
                    type="checkbox"
                    checked={getCheckboxValue('riskLevelCritical')}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-[10px] mt-16 px-1">
          <span>Website: infinitysupportzwa.org</span>
          <span>CF013</span>
          <span>Review Date:13/02/2025</span>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page6;
