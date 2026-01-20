"use client";

import { useEffect, useState } from 'react';
import FormPage from '@/components/ui/FormPage';
import { fetchFormSpecificSettings } from '@/lib/settings';

interface PreEmploymentMedicalViewProps {
  data?: any;
  staffInfo?: any;
}

export default function PreEmploymentMedicalView({ data: rawData = {}, staffInfo: staffInfoProp = {} }: PreEmploymentMedicalViewProps) {
  const data: any = (rawData as any)?.data ? (rawData as any).data : rawData;
  const staffInfo = (rawData as any)?.staff || staffInfoProp || {};
  const signatureImage = (rawData as any)?.staffSignature || (data as any)?.signature;
  const signatureDate = (rawData as any)?.staffSignedAt || (data as any)?.signatureDate;

  const [meta, setMeta] = useState<{ website: string; formId: string; reviewDate: string }>({
    website: 'infinitysupportswa.org',
    formId: 'SF014',
    reviewDate: '01/03/2025'
  });

  useEffect(() => {
    const metaFromData = (rawData as any)?.meta || (rawData as any)?.data?.meta;
    if (metaFromData) {
      setMeta((prev) => ({
        website: metaFromData.website || prev.website,
        formId: metaFromData.formId || prev.formId,
        reviewDate: metaFromData.reviewDate || prev.reviewDate,
      }));
    }
  }, [rawData]);

  useEffect(() => {
    // Load form-specific settings
    const loadSettings = async () => {
      try {
        const settings = await fetchFormSpecificSettings();
        const getSettingValue = (key: string): string | null => {
          const groups = Object.values(settings || {});
          for (const group of groups) {
            if (Array.isArray(group)) {
              const s = group.find((it: any) => it && it.key === key);
              if (s) return s.value || s.defaultValue || null;
            }
          }
          return null;
        };
        setMeta({
          website: getSettingValue('company_website') || 'infinitysupportswa.org',
          formId: getSettingValue('pre_employment_medical_form_id') || 'SF014',
          reviewDate: getSettingValue('review_date') || '01/03/2025',
        });
      } catch {}
    };
    loadSettings();
  }, []);

  return (
    <div className="bg-gray-100 py-8">
      {/* Page 1 - Consent Form */}
      <FormPage showTitle={false} meta={meta}>
        <div className="space-y-4 text-sm w-full">
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 w-full">
              <div className="space-y-6">
                {/* Applicant Details */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Pre-Employment Medical Examination Consent Form</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400">
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm font-medium text-gray-700 w-1/2">Full Name</td>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900 w-1/2">
                              {data.fullName || `${staffInfo.firstName || ''} ${staffInfo.surname || ''}`.trim() || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm font-medium text-gray-700 w-1/2">Address</td>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900 w-1/2">
                              {data.address || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm font-medium text-gray-700 w-1/2">Date of Birth</td>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900 w-1/2">
                              {data.dateOfBirth || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm font-medium text-gray-700 w-1/2">Position Applied For</td>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900 w-1/2">
                              {data.positionApplied || ''}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Informed Consent */}
                <div className="mt-8">
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Informed Consent (to be completed by the applicant)</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="space-y-4 mb-6">
                      <p className="text-sm text-gray-700">
                        All applicants for positions at Infinity Supports WA are asked to sign that they have read and understood the content of the following statement and that they give their consent to use and disclose their personal information for the purposes of recruitment and selection.
                      </p>
                      <p className="text-sm text-gray-700">
                        In accordance with the Privacy legislation, Infinity Supports WA is committed to ensuring the confidentiality and security of your personal information. The information you supply during the recruitment and selection process will be used solely for the purposes of assessing your suitability for employment in the specified position.
                      </p>
                      <p className="text-sm text-gray-700">
                        In order to assist Infinity Supports WA and the assessment of your application, it may be necessary for us to disclose your personal information to certain third parties such as internal managers, your referees etc. and as may be required by law. We will only disclose your personal information to third parties for this purpose.
                      </p>
                      <p className="text-sm text-gray-700">
                        Infinity Supports WA has a policy of retaining information relating to all applicants for a period of 6 months after the selection process for the position has been completed. During this period if another position for which you may be suitable arises, we may use your information in considering your suitability for such a position.
                      </p>
                      <p className="text-sm text-gray-700">
                        In addition, Infinity Supports WA will, in accordance with the Corporations Act, seek information in relation to past performance and employment history of all candidates prior to appointment to any position. Therefore, reference checks with previous employers, police checks, WWCC and educational qualifications checks may be carried out prior to any offer of employment.
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 w-3/4">Consent Statement</th>
                            <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700 w-1/8">Yes</th>
                            <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700 w-1/8">No</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                              I consent to Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for the position stated above.
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent1 === 'yes'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">Yes</span>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent1 === 'no'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">No</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                              I consent Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for ANY OTHER suitable positions that may arise in the future.
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent2 === 'yes'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">Yes</span>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent2 === 'no'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">No</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                              I consent to Infinity Supports WA making inquiries about me from my referees and any other person including colleagues on Linkedin.
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent3 === 'yes'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">Yes</span>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent3 === 'no'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">No</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-700">
                              I consent to Infinity Supports WA carrying out a police check.
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent4 === 'yes'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">Yes</span>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex flex-col items-center justify-center h-full">
                                <input
                                  type="checkbox"
                                  checked={data.consent4 === 'no'}
                                  readOnly
                                  className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                />
                                <span className="text-xs mt-1 text-gray-700">No</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPage>

      {/* Page 2 - Medical and Consent */}
      <FormPage showTitle={false} meta={meta}>
        <div className="space-y-4 text-sm w-full">
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 w-full">
              <div className="space-y-6">
                {/* Educational Qualifications Check - Simple Table */}
                <div className="border border-black p-4 w-full">
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border border-black">
                      <tbody>
                        <tr>
                          <td className="border border-black px-3 py-2 text-sm text-gray-900">
                            I consent to Infinity Supports WA carrying out an educational qualifications check.
                          </td>
                          <td className="border border-black px-3 py-2 text-center w-20">
                            <div className="flex flex-col items-center justify-center h-full">
                              <input
                                type="checkbox"
                                checked={data.educationalCheck === 'yes'}
                                readOnly
                                className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                              />
                              <span className="text-xs mt-1 text-gray-700">Yes</span>
                            </div>
                          </td>
                          <td className="border border-black px-3 py-2 text-center w-20">
                            <div className="flex flex-col items-center justify-center h-full">
                              <input
                                type="checkbox"
                                checked={data.educationalCheck === 'no'}
                                readOnly
                                className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                              />
                              <span className="text-xs mt-1 text-gray-700">No</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-900">Applicant's Signature:</span>
                        <div className="flex-1 border-b border-black"></div>
                      </div>
                      <div className="h-16">
                        {signatureImage ? (
                          <img src={signatureImage} alt="Applicant Signature" className="max-w-full max-h-full" />
                        ) : (
                          <span className="text-gray-400 text-sm"></span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-900">Date:</span>
                        <div className="flex-1 border-b border-black"></div>
                      </div>
                      <div className="h-16 flex items-center">
                        <span className="text-gray-900 text-sm">
                          {formatDateValue(signatureDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-Existing Injury or Disease Disclosure Statement */}
                <div className="mt-6">
                  <div className="bg-blue-600 text-white px-6 py-3">
                    <h3 className="text-lg font-semibold">Pre-Existing Injury or Disease Disclosure Statement (to be completed by the applicant)</h3>
                  </div>
                  <div className="border border-black p-4 w-full">
                    <div className="space-y-3 text-gray-900 text-sm leading-relaxed">
                      <p>
                        Infinity Supports WA is committed to providing a safe working environment for all employees. As part of this it is our objective to ensure potential employees are not required to work in duties that they are not able to perform safely. As part of the application process for employment with Infinity Supports WA, we request you to disclose any pre-existing injury or disease which may be adversely affected by the performance of the inherent requirements of the position you have applied for – as described in the attached Position Description.
                      </p>
                      <p>
                        You are required to disclose to Infinity Supports WA any pre-existing injury or disease that you have suffered of which you are aware, and could reasonably be expected to foresee, could be affected by the nature of this proposed employment.
                      </p>
                      <p>
                        Should any alteration, change or rearrangement be necessary to enable you to effectively carry out the inherent requirements of the position, we also request that you disclose these requirements.
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-900 mb-2">
                        Please disclose in the space below any pre-existing injuries or diseases that you suffer from, or have suffered from, which could be affected by the nature of your proposed employment with Infinity Supports WA (attach a separate page if necessary):
                      </p>
                      <div className="space-y-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="border-b border-black h-6"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclosure Advice */}
                <div className="mt-6">
                  <div className="border border-black p-4 w-full">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Disclosure Advice (to be completed by the applicant)</h4>
                      <p className="text-sm text-gray-900">
                        I confirm that I have read and understood the content of the above information and state that I have disclosed all relevant information in relation to my health and physical ability to carry out the inherent requirements of this position.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-900">Applicant's Signature:</span>
                          <div className="flex-1 border-b border-black"></div>
                        </div>
                        <div className="h-16">
                          {data.declarationSignature ? (
                            <img src={data.declarationSignature} alt="Declaration Signature" className="max-w-full max-h-full" />
                          ) : (
                            <span className="text-gray-400 text-sm"></span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-900">Date:</span>
                          <div className="flex-1 border-b border-black"></div>
                        </div>
                        <div className="h-16 flex items-center">
                          <span className="text-gray-900 text-sm">
                            {formatDateValue(data.declarationDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPage>

      {/* Page 3 - Medical History and Declaration */}
      <FormPage showTitle={false} meta={meta}>
        <div className="space-y-4 text-sm w-full">
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 w-full">
              <div className="space-y-6">
                {/* General Health Questionnaire - Single Table */}
                <div className="border border-black p-4 w-full">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">General Health Questionnaire (to be completed by the applicant)</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left text-sm font-medium text-gray-700">Question</th>
                          <th className="border border-black px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                          <th className="border border-black px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                          <th className="border border-black px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* General Health Questions */}
                        {[
                          'Are you being treated by any Doctor for any illness?',
                          'Have you ever broken any bones?',
                          'Are you taking regular medication?',
                          'Have you ever been immunised against tetanus?',
                          'Have you ever had any operations?'
                        ].map((question, index) => {
                          const key = `generalHealth${index}`;
                          return (
                            <tr key={index}>
                              <td className="border border-black px-3 py-2 text-sm text-gray-900">{question}</td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[key] === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[key] === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2">
                                {data[key] === true && data[`${key}Details`] && (
                                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                    {data[`${key}Details`]}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        
                        {/* Body Parts Questions */}
                        {[
                          'Wrist or elbow',
                          'Ankles or knees'
                        ].map((bodyPart, index) => {
                          const key = bodyPart.toLowerCase().replace(/[^a-z0-9]/g, '');
                          return (
                            <tr key={`body-${index}`}>
                              <td className="border border-black px-3 py-2 text-sm text-gray-900">{bodyPart}</td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[key] === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[key] === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2">
                                {data[key] === true && data[`${key}Details`] && (
                                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                    {data[`${key}Details`]}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        
                        {/* Medical Conditions */}
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="border border-black px-3 py-2 text-sm font-semibold text-gray-800">
                            Do you, or have you ever, suffered from:
                          </td>
                        </tr>
                        {[
                          'Tuberculosis',
                          'Wheezing/Bronchitis/Asthma',
                          'Diabetes',
                          'Blood pressure or heart disease',
                          'Stomach pains or ulcers',
                          'Excessive noise exposure or loss of hearing',
                          'Skin disorders or dermatitis',
                          'Chronic ear infections',
                          'Fits, black-outs or dizziness',
                          'Head injury or concussion',
                          'Hernia',
                          'Allergies',
                          'Anxieties or depressive illness',
                          'Hepatitis B',
                          'Severe headaches',
                          'Colour blindness'
                        ].map((condition, index) => {
                          const key = condition.toLowerCase().replace(/[^a-z0-9]/g, '');
                          return (
                            <tr key={index}>
                              <td className="border border-black px-3 py-2 text-sm text-gray-900">{condition}</td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[`${key}Condition`] === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[`${key}Condition`] === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2">
                                {data[`${key}Condition`] === true && data[`${key}ConditionDetails`] && (
                                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                    {data[`${key}ConditionDetails`]}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPage>

      {/* Page 4 - Medical History and Declaration */}
      <FormPage showTitle={false} meta={meta}>
        <div className="space-y-4 text-sm w-full">
          <div className="w-full">
            <div className="border border-gray-300 rounded-lg p-6 w-full">
              <div className="space-y-6">
                {/* Body Parts Issues - First */}
                <div className="border border-black p-4 w-full">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Do you, or have you ever, had trouble with your:</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-black px-3 py-2 text-left text-sm font-medium text-gray-700">Body Part</th>
                          <th className="border border-black px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                          <th className="border border-black px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                          <th className="border border-black px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Back',
                          'Neck',
                          'Shoulders',
                          'Arms',
                          'Hands',
                          'Hips',
                          'Legs',
                          'Feet'
                        ].map((bodyPart, index) => {
                          const key = bodyPart.toLowerCase().replace(/[^a-z0-9]/g, '');
                          return (
                            <tr key={index}>
                              <td className="border border-black px-3 py-2 text-sm text-gray-900">{bodyPart}</td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[`${key}Issue`] === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2 text-center">
                                <div className="flex flex-col items-center justify-center h-full">
                                  <input
                                    type="checkbox"
                                    checked={data[`${key}Issue`] === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </td>
                              <td className="border border-black px-3 py-2">
                                {data[`${key}Issue`] === true && data[`${key}IssueDetails`] && (
                                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                    {data[`${key}IssueDetails`]}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Medical History - Workplace - Second */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Medical History - Workplace (to be completed by the applicant)</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700">Question</th>
                            <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Yes/No</th>
                            <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">Have you ever injured yourself at work or suffered an industrial disease?</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex justify-center gap-6">
                                <div className="flex flex-col items-center">
                                  <input
                                    type="checkbox"
                                    checked={data.workInjury === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <input
                                    type="checkbox"
                                    checked={data.workInjury === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2">
                              {data.workInjury === true && data.workInjuryDetails && (
                                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                  {data.workInjuryDetails}
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">Have you ever had difficulties wearing PPE?</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex justify-center gap-6">
                                <div className="flex flex-col items-center">
                                  <input
                                    type="checkbox"
                                    checked={data.ppeDifficulties === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <input
                                    type="checkbox"
                                    checked={data.ppeDifficulties === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2">
                              {data.ppeDifficulties === true && data.ppeDifficultiesDetails && (
                                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                  {data.ppeDifficultiesDetails}
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">Have you ever worked with hazardous materials?</td>
                            <td className="border border-gray-400 px-3 py-2 text-center">
                              <div className="flex justify-center gap-6">
                                <div className="flex flex-col items-center">
                                  <input
                                    type="checkbox"
                                    checked={data.hazardousMaterials === true}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">Yes</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <input
                                    type="checkbox"
                                    checked={data.hazardousMaterials === false}
                                    readOnly
                                    className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
                                  />
                                  <span className="text-xs mt-1 text-gray-700">No</span>
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray-400 px-3 py-2">
                              {data.hazardousMaterials === true && data.hazardousMaterialsDetails && (
                                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">
                                  {data.hazardousMaterialsDetails}
                                </div>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Declaration - Last */}
                <div>
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                    <h3 className="text-xl font-semibold">Declaration (to be completed by the applicant)</h3>
                  </div>
                  <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                    <div className="space-y-4">
                      <p className="text-gray-900 text-sm leading-relaxed">
                        I have not knowingly withheld any information relevant to the pre-employment medical examination. I declare that the information provided in this form is true and correct.
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-900">Applicant's Signature:</span>
                            <div className="flex-1 border-b-2 border-dashed border-gray-400"></div>
                          </div>
                          <div className="h-16">
                            {data.declarationSignature ? (
                              <img src={data.declarationSignature} alt="Declaration Signature" className="max-w-full max-h-full" />
                            ) : (
                              <div className="w-full h-16 border-b-2 border-dashed border-gray-400"></div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-900">Date:</span>
                            <div className="flex-1 border-b-2 border-dashed border-gray-400"></div>
                          </div>
                          <div className="h-16 flex items-center">
                            <span className="text-gray-900 text-sm">
                              {formatDateValue(data.declarationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormPage>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-700 mb-1">{label}:</div>
      <div className="border border-gray-400 h-8 rounded-sm px-2 flex items-center text-gray-900 bg-white">
        {value || ''}
      </div>
    </div>
  );
}

function ConsentCheckbox({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex gap-4 mt-1">
        <div className="flex flex-col items-center">
          <input
            type="checkbox"
            checked={value === true}
            readOnly
            className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
          />
          <span className="text-xs mt-1 text-gray-700">Yes</span>
        </div>
        <div className="flex flex-col items-center">
          <input
            type="checkbox"
            checked={value === false}
            readOnly
            className="w-5 h-5 x-mark rounded border-gray-300 cursor-default"
          />
          <span className="text-xs mt-1 text-gray-700">No</span>
        </div>
      </div>
      <span className="text-sm text-gray-900 flex-1">{label}</span>
    </div>
  );
}

function formatDateValue(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}
