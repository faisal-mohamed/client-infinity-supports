import React from 'react';
import A4PageWrapper from './A4PageWrapper';
import { parseISO, isValid, format } from "date-fns";
import { A4_PDF_TYPOGRAPHY, STANDARD_LOGO } from './page_FIXED';

interface Page3Props {
  schema: any;
  formData: Record<string, string>;
  commonFieldsData: Record<string, string>;
  settings: any;
  images?: any;
}

// --- Standardized Header Component ---
const StandardHeader = ({ images }: { images?: any }) => (
  <div className="flex justify-center">
    <img
      src={images?.infinityLogo || "/infinity_logo.png"}
      alt="Logo"
      width={STANDARD_LOGO.width}
      height={STANDARD_LOGO.height}
      className={STANDARD_LOGO.className}
    />
  </div>
);

// --- Standardized Footer Component ---
const Footer = ({ settings }: { settings: any }) => {
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  return (
    <div className={`flex justify-between ${A4_PDF_TYPOGRAPHY.footer} px-1 text-gray-600`}>
      <span>Website: {settings?.company_website}</span>
      <span>{settings?.participant_risk_assessment}</span>
      <span>Review Date: {formatDate(settings?.review_date)}</span>
    </div>
  );
};

const Page3: React.FC<Page3Props> = ({ formData, schema, commonFieldsData, settings, images }) => {
  const isChecked = (fieldKey: string, value: string) =>
    formData?.[fieldKey]?.toLowerCase() === value.toLowerCase();

  const isMultiChecked = (fieldKey: string, option: string) =>
    Array.isArray(formData?.[fieldKey]) && formData[fieldKey].includes(option);

  const cellClass = `border border-black px-1 py-0.5 leading-none ${A4_PDF_TYPOGRAPHY.tableCell}`;

  return (
    <A4PageWrapper>
      <div className="flex flex-col w-full h-full px-1 pt-[1mm] pb-[1mm] font-montserrat justify-between" style={{ minHeight: "100%", height: "100%" }}>
        
        <StandardHeader images={images} />

        {/* Risk Assessment Table */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ maxHeight: "210mm", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <table className={`table-fixed border border-black w-full border-collapse ${A4_PDF_TYPOGRAPHY.tableCell}`} style={{ pageBreakInside: "avoid", breakInside: "avoid", height: "100%" }}>
            <tbody>
              {/* Question 10 - Noise Sensitivity */}
              <tr className="align-top" style={{ minHeight: '60px' }}>
                <td className={`${cellClass} text-center w-[40px]`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>10</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Is the client affected by noises or sudden sounds?
                  </div>
                </td>
                <td className={`${cellClass} text-center w-[90px]`} style={{ minHeight: '60px' }}>
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('noiseSensitive', 'yes')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('noiseSensitive', 'no')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-center w-[40px]`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.noiseSensitiveRating}</div>
                </td>
                <td className={`${cellClass} text-left w-[120px]`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.noiseSensitiveComment}</div>
                </td>
              </tr>

              {/* Question 11 - Family Behavioral History */}
              <tr className="align-top" style={{ minHeight: '80px' }}>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>11</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Is there a history of any family members with behavioural issues?
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('familyBehavioralHistory', 'yes')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('familyBehavioralHistory', 'no')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.familyBehavioralHistoryRating}</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Is there a behaviour practitioner involved?
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'yes')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'no')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                    </label>
                  </div>
                </td>
              </tr>

              {/* Question 12 - Mobility Issues */}
              <tr className="align-top" style={{ minHeight: '60px' }}>
                <td className={`${cellClass} text-center`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>12</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Does the client have mobility issues?<br />
                    <em>(e.g., wheelchair or other?)</em>
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '60px' }}>
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('mobilityIssues', 'yes')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('mobilityIssues', 'no')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.mobilityIssuesRating}</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '60px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.mobilityIssuesComment}</div>
                </td>
              </tr>

              {/* Question 13 - Showering/Toileting Hazards */}
              <tr className="align-top" style={{ minHeight: '80px' }}>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>13</div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Have hazards associated with showering, sponging and toileting been considered?<br />
                    <em>(e.g., manual handling/ slips/trips/falls/biological hazards/humidity, etc.)</em>
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className="flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('showeringToiletingHazards', 'yes')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('showeringToiletingHazards', 'no')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.showeringToiletingHazardsRating}</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '80px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.showeringToiletingHazardsComment}</div>
                </td>
              </tr>

              {/* Question 14 - Medication Respiratory Depression */}
              <tr className="align-top" style={{ minHeight: '120px' }}>
                <td className={`${cellClass} text-center`} style={{ minHeight: '120px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>14</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '120px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Does the participant take any of the following medications that can cause Respiratory Depression?
                  </div>
                  <div className="mt-1 space-y-1">
                    {[
                      'Benzodiazepines',
                      'Opioids',
                      'Polypharmacy',
                      'Psychotropic polypharmacy',
                      'Combination of any of the above medications'
                    ].map((option) => (
                      <label key={option} className="inline-flex items-center space-x-1 block">
                        <input
                          type="checkbox"
                          checked={isMultiChecked('medicationRespDepression', option)}
                          readOnly
                          className="w-3 h-3"
                        />
                        <span className={A4_PDF_TYPOGRAPHY.small}>{option}</span>
                      </label>
                    ))}
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '120px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    Do these medications pose a risk?
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('medicationRiskYesNo', 'yes')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={isChecked('medicationRiskYesNo', 'no')} readOnly className="w-3 h-3" />
                      <span className={A4_PDF_TYPOGRAPHY.small}>NO</span>
                    </label>
                  </div>
                </td>
                <td className={`${cellClass} text-center`} style={{ minHeight: '120px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>{formData?.medicationRespDepressionRating}</div>
                </td>
                <td className={`${cellClass} text-left`} style={{ minHeight: '120px' }}>
                  <div className={A4_PDF_TYPOGRAPHY.body}>
                    If yes, please specify and capture this in the controls table:
                  </div>
                  <div className={`mt-1 ${A4_PDF_TYPOGRAPHY.body}`}>
                    {formData?.medicationRiskComment}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Footer settings={settings} />
      </div>
    </A4PageWrapper>
  );
};

export default Page3;
