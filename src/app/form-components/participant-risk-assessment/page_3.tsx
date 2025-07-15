import React from 'react';
import A4PageWrapper from './A4PageWrapper';

interface Page3Props {
  formData: Record<string, any>;
}

const Page3: React.FC<Page3Props> = ({ formData }) => {
  const isChecked = (fieldKey: string, value: string) =>
    formData?.[fieldKey]?.toLowerCase() === value.toLowerCase();

  const isMultiChecked = (fieldKey: string, option: string) =>
    Array.isArray(formData?.[fieldKey]) && formData[fieldKey].includes(option);

  return (
    <A4PageWrapper>
      <div className="max-w-4xl mx-auto p-4 text-[13px]">
        <header className="flex justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/1090aa7a-0f12-42dc-7e13-71564c33f54d.jpg"
            alt="Infinity Supports WA logo"
            className="h-14 object-contain"
          />
        </header>

        <table className="w-full border border-black border-collapse">
          <tbody>
            {/* Question 10 */}
            <tr>
              <td className="border px-1 py-2 w-[40px] text-center align-top">10</td>
              <td className="border px-2 py-2 align-top">Is the client affected by noises or sudden sounds?</td>
              <td className="border px-2 py-2 w-[90px] align-top">
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('noiseSensitive', 'yes')} readOnly />
                  <span>YES</span>
                </label>
                <label className="inline-flex items-center space-x-1 ml-3">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('noiseSensitive', 'no')} readOnly />
                  <span>NO</span>
                </label>
              </td>
              <td className="border w-[40px]"></td>
              <td className="border w-[120px]"></td>
            </tr>

            {/* Question 11 */}
            <tr>
              <td className="border px-1 py-2 text-center align-top">11</td>
              <td className="border px-2 py-2 align-top">Is there a history of any family members with behavioural issues</td>
              <td className="border px-2 py-2 align-top">
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('familyBehavioralHistory', 'yes')} readOnly />
                  <span>YES</span>
                </label>
                <label className="inline-flex items-center space-x-1 ml-3">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('familyBehavioralHistory', 'no')} readOnly />
                  <span>NO</span>
                </label>
              </td>
              <td className="border"></td>
              <td className="border px-2 py-2 align-top">
                Is there a behaviour practitioner involved?
                <div className="mt-1">
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" className="form-checkbox" checked={isChecked('behaviorPractitionerInvolved', 'yes')} readOnly />
                    <span>YES</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 ml-3">
                    <input type="checkbox" className="form-checkbox" checked={isChecked('behaviorPractitionerInvolved', 'no')} readOnly />
                    <span>NO</span>
                  </label>
                </div>
              </td>
            </tr>

            {/* Question 12 */}
            <tr>
              <td className="border px-1 py-2 text-center align-top">12</td>
              <td className="border px-2 py-2 align-top">
                Does the client have mobility issues?
                <br />
                <em>e.g., wheelchair or other?</em>
              </td>
              <td className="border px-2 py-2 align-top">
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('mobilityIssues', 'yes')} readOnly />
                  <span>YES</span>
                </label>
                <label className="inline-flex items-center space-x-1 ml-3">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('mobilityIssues', 'no')} readOnly />
                  <span>NO</span>
                </label>
              </td>
              <td className="border"></td>
              <td className="border"></td>
            </tr>

            {/* Question 13 */}
            <tr>
              <td className="border px-1 py-2 text-center align-top">13</td>
              <td className="border px-2 py-2 text-center align-top">
                Have hazards associated with showering, sponging and toileting been considered?
                <br />
                <em>(e.g., manual handling/ slips/trips/falls/biological hazards/humidity, etc.)</em>
              </td>
              <td className="border px-2 py-2 align-top">
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('showeringToiletingHazards', 'yes')} readOnly />
                  <span>YES</span>
                </label>
                <label className="inline-flex items-center space-x-1 ml-3">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('showeringToiletingHazards', 'no')} readOnly />
                  <span>NO</span>
                </label>
              </td>
              <td className="border"></td>
              <td className="border"></td>
            </tr>

            {/* Question 14 */}
            <tr>
              <td className="border px-1 py-2 text-center align-top">14</td>
              <td className="border px-2 py-2 align-top">
                Does the participant take any of the following medications that can cause Respiratory Depression?
                <br />
                <div className="mt-1">
                  {[
                    'Benzodiazepines',
                    'Opioids',
                    'Polypharmacy',
                    'Psychotropic polypharmacy',
                    'Combination of any of the above medications',
                  ].map((option) => (
                    <div key={option} className="flex items-center space-x-1 mt-1">
                      <input type="checkbox" className="form-checkbox" checked={isMultiChecked('medicationRespDepression', option)} readOnly />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="border px-2 py-2 align-top">
                <label className="inline-flex items-center space-x-1">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('medicationRiskYesNo', 'yes')} readOnly />
                  <span>Yes</span>
                </label>
                <br />
                <label className="inline-flex items-center space-x-1 mt-1">
                  <input type="checkbox" className="form-checkbox" checked={isChecked('medicationRiskYesNo', 'no')} readOnly />
                  <span>No</span>
                </label>
                {formData?.medicationRiskYesNo === 'yes' && (
                  <p className="mt-2 text-[12px] text-red-600 leading-tight">
                    If yes, please specify and capture this in the controls table
                  </p>
                )}
              </td>
              <td className="border"></td>
              <td className="border px-2 py-2 align-top">
                {formData?.medicationRiskYesNo === 'yes' && formData?.medicationRiskComment}
              </td>
            </tr>
          </tbody>
        </table>

        <footer className="flex justify-between text-[12px] mt-10 px-2">
          <div>Website: infinitysupportswa.org</div>
          <div>CF013</div>
          <div>Review Date: 13/02/2025</div>
        </footer>
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
