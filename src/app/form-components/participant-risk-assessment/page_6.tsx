

import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";

interface Field {
  key: string;
  label: string;
  type: string;
}

interface Page6Props {
     schema: any;
  data: any;
  commonFieldsData: Record<string, string>;
  settings: any;
}

const Page6: React.FC<Page6Props> = ({ data, schema, commonFieldsData, settings }) => {
  const getCheckboxValue = (key: string) => data?.[key] === true;

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-xs font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src='/infinity_logo.png'
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Risk Assessment Table */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-xs">
            <tbody>
              <tr>
                <td className="border border-black w-[5%] p-3"></td>
                <td className="border border-black w-[15%] p-3"></td>
                <td className="border border-black w-[35%] p-3">
                  in services could moderately affect their overall well-being.
                </td>
                <td className="border border-black w-[35%] p-3">
                  tasks they rely on the provider to assist with.
                </td>
                <td className="border border-black w-[10%] p-3"></td>
              </tr>

              {/* High Risk */}
              <tr className="bg-gray-100">
                <td className="border border-black p-3 font-bold text-yellow-700">High</td>
                <td className="border border-black p-3">
                  Participants have a high reliance on provider services to meet essential daily living needs.
                </td>
                <td className="border border-black p-3">
                  Participants require significant assistance from the provider for activities of daily living,
                  including personal care, mobility, meal preparation, and medication management. A disruption in
                  services would have a significant impact on their overall well-being and quality of life.
                </td>
                <td className="border border-black p-3">
                  Disruptions in services would significantly impact participants' health and safety, as they rely
                  heavily on the provider for essential tasks. There could be risks related to personal care, medical
                  needs, and more.
                </td>
                <td className="border border-black p-3 text-center">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={getCheckboxValue('riskLevelHigh')}
                    readOnly
                  />
                </td>
              </tr>

              {/* Critical Risk */}
              <tr>
                <td className="border border-black p-3 font-bold text-red-600">Critical</td>
                <td className="border border-black p-3">
                  Participants have a critical reliance on provider services for all daily living needs.
                </td>
                <td className="border border-black p-3">
                  Participants are entirely dependent on the provider for all activities of daily living, including
                  personal care, mobility, communication, medical support, and more. Any disruption in services would
                  pose a severe and immediate threat to their health and well-being.
                </td>
                <td className="border border-black p-3">
                  Disruptions in services would pose a critical threat to participants' health and safety. Their complete
                  dependency on the provider means that any interruption could lead to life-threatening situations.
                </td>
                <td className="border border-black p-3 text-center">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={getCheckboxValue('riskLevelCritical')}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <div className="flex justify-between text-xs px-2">
            <div>Website: {settings?.company_website}</div>
            <div>{settings?.participant_risk_assessment}</div>
<div>
  Review Date:{' '}
  {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
    ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
    : 'N/A'}
</div>
          </div>
        </div>
      </div>
    </A4PageWrapper>
  );
};

export default Page6;
