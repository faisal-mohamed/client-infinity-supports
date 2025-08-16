

import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { format, parseISO, isValid } from "date-fns";


interface Page3Props {
    schema: any;
  formData: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
}

const Page3: React.FC<Page3Props> = ({ formData, schema, commonFieldsData, settings }) => {
  const isChecked = (fieldKey: string, value: string) =>
    formData?.[fieldKey]?.toLowerCase() === value.toLowerCase();

  const isMultiChecked = (fieldKey: string, option: string) =>
    Array.isArray(formData?.[fieldKey]) && formData[fieldKey].includes(option);

  return (
    <A4PageWrapper>
      <div className="flex flex-col h-full text-xs font-sans">
        {/* Logo */}
        <div className="flex justify-center pt-6 pb-4">
          <img
            src="/infinity_logo.png"
            alt="Infinity Supports WA logo"
            className="h-[60px] w-[150px] object-contain"
          />
        </div>

        {/* Risk Table */}
        <div className="flex-1 flex flex-col px-6">
          <table className="w-full border border-black border-collapse text-xs flex-1">
            <tbody>
              {/* Question 10 */}
              <tr>
                <td className="border border-black px-2 py-2 w-[40px] text-center align-top">10</td>
                <td className="border border-black px-2 py-2 align-top">
                  Is the client affected by noises or sudden sounds?
                </td>
                <td className="border border-black px-2 py-2 w-[90px] align-top">
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('noiseSensitive', 'yes')} readOnly className="w-3 h-3" />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('noiseSensitive', 'no')} readOnly className="w-3 h-3" />
                      <span>NO</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black w-[40px]">{formData?.noiseSensitiveRating}</td>
                <td className="border border-black w-[120px]">{formData?.noiseSensitiveComment}</td>
              </tr>

              {/* Question 11 */}
              <tr>
                <td className="border border-black px-2 py-2 text-center align-top">11</td>
                <td className="border border-black px-2 py-2 align-top">
                  Is there a history of any family members with behavioural issues?
                </td>
                <td className="border border-black px-2 py-2 align-top">
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('familyBehavioralHistory', 'yes')} readOnly className="w-3 h-3" />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('familyBehavioralHistory', 'no')} readOnly className="w-3 h-3" />
                      <span>NO</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black">{formData?.familyBehavioralHistoryRating}</td>
                <td className="border border-black px-2 py-2 align-top">
                  Is there a behaviour practitioner involved?
                  <div className="mt-2 flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'yes')} readOnly className="w-3 h-3" />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'no')} readOnly className="w-3 h-3" />
                      <span>NO</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Question 12 */}
              <tr>
                <td className="border border-black px-2 py-2 text-center align-top">12</td>
                <td className="border border-black px-2 py-2 align-top">
                  Does the client have mobility issues?<br />
                  <em>e.g., wheelchair or other?</em>
                </td>
                <td className="border border-black px-2 py-2 align-top">
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('mobilityIssues', 'yes')} readOnly className="w-3 h-3" />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('mobilityIssues', 'no')} readOnly className="w-3 h-3" />
                      <span>NO</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black">{formData?.mobilityIssuesRating}</td>
                <td className="border border-black">{formData?.mobilityIssuesComment}</td>
              </tr>

              {/* Question 13 */}
              <tr>
                <td className="border border-black px-2 py-2 text-center align-top">13</td>
                <td className="border border-black px-2 py-2 align-top text-center">
                  Have hazards associated with showering, sponging and toileting been considered?
                  <br />
                  <em>(e.g., manual handling/ slips/trips/falls/biological hazards/humidity, etc.)</em>
                </td>
                <td className="border border-black px-2 py-2 align-top">
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('showeringToiletingHazards', 'yes')} readOnly className="w-3 h-3" />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('showeringToiletingHazards', 'no')} readOnly className="w-3 h-3" />
                      <span>NO</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black">{formData?.showeringToiletingHazardsRating}</td>
                <td className="border border-black">{formData?.showeringToiletingHazardsComment}</td>
              </tr>

              {/* Question 14 */}
              <tr>
                <td className="border border-black px-2 py-2 text-center align-top">14</td>
                <td className="border border-black px-2 py-2 align-top">
                  Does the participant take any of the following medications that can cause Respiratory Depression?
                  <div className="mt-2">
                    {[
                      'Benzodiazepines',
                      'Opioids',
                      'Polypharmacy',
                      'Psychotropic polypharmacy',
                      'Combination of any of the above medications',
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-1 mt-1">
                        <input type="checkbox" checked={false} readOnly className="w-3 h-3" />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border border-black px-2 py-2 align-top">
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={isChecked('medicationRiskDepression', 'yes')} readOnly className="w-3 h-3" />
                    <span>Yes</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center space-x-1 mt-1">
                    <input type="checkbox" checked={isChecked('medicationRiskDepression', 'no')} readOnly className="w-3 h-3" />
                    <span>No</span>
                  </label>
                  
                    <p className="mt-2 text-xs text-red-600 leading-tight">
                      If yes, please specify and capture this in the controls table
                    </p>
                 
                </td>
                <td className="border border-black">{formData?.medicationRiskDepressionRating}</td>
                <td className="border border-black px-2 py-2 align-top">
                  {formData?.medicationRiskDepressionComment}
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

export default Page3;
