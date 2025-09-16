"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import FormPage from '@/components/ui/FormPage';
import SignatureCanvas from '@/components/ui/SignatureCanvas';
import { fetchFormSpecificSettings } from '@/lib/settings';

export interface PreEmploymentMedicalFormRef {
  save: (submit?: boolean) => Promise<boolean>;
  validate: () => boolean;
  validateDetailed: () => { isValid: boolean; missing?: string[]; invalid?: string[] } | null;
  getData: () => any;
}

export default forwardRef<PreEmploymentMedicalFormRef, { token: string; onValidityChange?: (v: boolean) => void }>(
  function PreEmploymentMedicalForm({ token, onValidityChange }, ref) {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [staffInfo, setStaffInfo] = useState<any>({});
    const [meta, setMeta] = useState<{ website: string; formId: string; reviewDate: string }>({
      website: 'infinitysupportswa.org',
      formId: 'SF014',
      reviewDate: '01/03/2025'
    });

    useEffect(() => {
      // Load saved data if any
      const loadData = async () => {
        try {
          const response = await fetch(`/api/staff/onboard/${token}`);
          if (response.ok) {
            const result = await response.json();
            const s = result.staff || {};
            const saved = (result.submissions && result.submissions['pre_employment_medical']) || {};
            setStaffInfo(s);
            setData((d: any) => ({
              ...d,
              ...saved,
              // Handle signature data from new fields
              signature: saved.signature || '',
              signatureDate: saved.signatureDate || '',
              // Set name from staff info if not already set
              fullName: saved.fullName || `${s.firstName || ''} ${s.surname || ''}`.trim()
            }));
          }
        } catch (e) {
          // ignore prefill errors
        }
      };
      loadData();
    }, [token]);

    useEffect(() => {
      // Check validity whenever data changes
      if (onValidityChange) {
        const isValid = validate();
        onValidityChange(isValid);
      }
    }, [data, onValidityChange]);

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

    const validate = (): boolean => {
      // Check if required fields are filled
      return !!(
        data.fullName &&
        data.consentRecruitment &&
        data.consentFuturePositions &&
        data.consentRefereeInquiries &&
        data.consentPoliceCheck &&
        data.consentEducationalCheck &&
        data.signature &&
        data.signatureDate
      );
    };

    const validateDetailed = () => {
      const missing: string[] = [];
      const invalid: string[] = [];

      if (!data.fullName) missing.push('Full Name');
      if (!data.consentRecruitment) missing.push('Recruitment Consent');
      if (!data.consentFuturePositions) missing.push('Future Positions Consent');
      if (!data.consentRefereeInquiries) missing.push('Referee Inquiries Consent');
      if (!data.consentPoliceCheck) missing.push('Police Check Consent');
      if (!data.consentEducationalCheck) missing.push('Educational Check Consent');
      if (!data.signature) missing.push('Signature');
      if (!data.signatureDate) missing.push('Date');

      // Check if date is valid
      if (data.signatureDate && isNaN(Date.parse(data.signatureDate))) {
        invalid.push('Date (invalid format)');
      }

      return {
        isValid: missing.length === 0 && invalid.length === 0,
        missing: missing.length > 0 ? missing : undefined,
        invalid: invalid.length > 0 ? invalid : undefined
      };
    };

    const save = async (submit: boolean = false): Promise<boolean> => {
      setLoading(true);
      try {
        const response = await fetch(`/api/staff/onboard/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formKey: 'pre_employment_medical',
            data: { ...data, submit }
          })
        });

        if (response.ok) {
          return true;
        }
        return false;
      } catch (e) {
        console.error('Save failed:', e);
        return false;
      } finally {
        setLoading(false);
      }
    };

    const getData = () => data;

    useImperativeHandle(ref, () => ({
      save,
      validate,
      validateDetailed,
      getData
    }));

    const handleChange = (key: string, value: any) => {
      setData((prev: any) => ({ ...prev, [key]: value }));
    };

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
                      <h3 className="text-xl font-semibold">Applicant Details</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Full Name" value={data.fullName} onChange={(v) => handleChange('fullName', v)} />
                        <Field label="Address" value={data.address} onChange={(v) => handleChange('address', v)} />
                        <Field label="Date of Birth" type="date" value={data.dateOfBirth} onChange={(v) => handleChange('dateOfBirth', v)} />
                        <Field label="Position Applied For" value={data.positionApplied} onChange={(v) => handleChange('positionApplied', v)} />
                      </div>
                    </div>
                  </div>

                  {/* Informed Consent */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Informed Consent (to be completed by the applicant)</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-3 text-gray-900 text-sm leading-relaxed">
                        <p>
                          I consent to Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for the position stated above.
                        </p>
                        <p>
                          Infinity Supports WA is committed to privacy legislation and will maintain the confidentiality and security of your personal information. Your personal information will be used solely for the purpose of assessing your suitability for the position you have applied for.
                        </p>
                        <p>
                          Your personal information may be disclosed to third parties (e.g., internal managers, referees) or as required by law, strictly for the purpose of assessing your application.
                        </p>
                        <p>
                          Infinity Supports WA will retain your application information for 6 months after the selection process is completed. Your information may be used to consider your suitability for other positions that may arise.
                        </p>
                        <p>
                          In accordance with the Corporations Act, Infinity Supports WA will seek information on past performance and employment history, including reference checks with previous employers, police checks, WWCC (Working With Children Check), and educational qualifications checks, prior to any offer of employment.
                        </p>
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
                  {/* Educational Qualifications Check */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Educational Qualifications Check</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">I consent to Infinity Supports WA carrying out an educational qualifications check.</span>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={data.consentEducationalCheck === true}
                                onChange={() => handleChange('consentEducationalCheck', true)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              Yes
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={data.consentEducationalCheck === false}
                                onChange={() => handleChange('consentEducationalCheck', false)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              No
                            </label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Applicant's Signature:</label>
                            <SignatureCanvas
                              existingSignature={data.signature}
                              onSignatureEnd={(sig) => handleChange('signature', sig)}
                              onSignatureClear={() => handleChange('signature', '')}
                              width={400}
                              height={120}
                              className="bg-white border border-gray-400 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date:</label>
                            <input
                              id="signatureDate"
                              title="Signature Date"
                              type="date"
                              value={data.signatureDate || ''}
                              onChange={(e) => handleChange('signatureDate', e.target.value)}
                              className="w-full border border-gray-400 h-8 rounded-sm px-2 text-gray-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pre-Existing Injury or Disease Disclosure */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Pre-Existing Injury or Disease Disclosure Statement (to be completed by the applicant)</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
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
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Please disclose in the space below any pre-existing injuries or diseases that you suffer from, or have suffered from, which could be affected by the nature of your proposed employment with Infinity Supports WA (attach a separate page if necessary):
                        </label>
                        <textarea
                          id="preExistingConditions"
                          title="Pre-existing conditions disclosure"
                          value={data.preExistingConditions || ''}
                          onChange={(e) => handleChange('preExistingConditions', e.target.value)}
                          rows={8}
                          className="w-full border border-gray-400 rounded-sm px-3 py-2 text-gray-900 bg-white"
                          placeholder="Please provide details of any pre-existing conditions..."
                        />
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
                  {/* General Health Questions */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">General Health Questions</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700">Question</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                            </tr>
                          </thead>
                          <tbody>
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
                                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{question}</td>
                                  <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={data[key] === true}
                                      onChange={() => handleChange(key, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${question} - Yes`}
                                    />
                                  </td>
                                  <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={data[key] === false}
                                      onChange={() => handleChange(key, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${question} - No`}
                                    />
                                  </td>
                                  <td className="border border-gray-400 px-3 py-2">
                                    {data[key] === true && (
                                      <textarea
                                        value={data[`${key}Details`] || ''}
                                        onChange={(e) => handleChange(`${key}Details`, e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-400 rounded-sm px-2 py-1 text-gray-900 bg-white text-xs"
                                        placeholder="Details..."
                                      />
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

                  {/* General Medical Questions */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">General Medical Questions</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700">Question</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">Wrist or elbow</td>
                              <td className="border border-gray-400 px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={data.wristElbow === true}
                                  onChange={() => handleChange('wristElbow', true)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  title="Wrist or elbow - Yes"
                                />
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={data.wristElbow === false}
                                  onChange={() => handleChange('wristElbow', false)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  title="Wrist or elbow - No"
                                />
                              </td>
                              <td className="border border-gray-400 px-3 py-2">
                                {data.wristElbow === true && (
                                  <textarea
                                    value={data.wristElbowDetails || ''}
                                    onChange={(e) => handleChange('wristElbowDetails', e.target.value)}
                                    rows={2}
                                    className="w-full border border-gray-400 rounded-sm px-2 py-1 text-gray-900 bg-white text-xs"
                                    placeholder="Details..."
                                  />
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">Ankles or knees</td>
                              <td className="border border-gray-400 px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={data.anklesKnees === true}
                                  onChange={() => handleChange('anklesKnees', true)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  title="Ankles or knees - Yes"
                                />
                              </td>
                              <td className="border border-gray-400 px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={data.anklesKnees === false}
                                  onChange={() => handleChange('anklesKnees', false)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  title="Ankles or knees - No"
                                />
                              </td>
                              <td className="border border-gray-400 px-3 py-2">
                                {data.anklesKnees === true && (
                                  <textarea
                                    value={data.anklesKneesDetails || ''}
                                    onChange={(e) => handleChange('anklesKneesDetails', e.target.value)}
                                    rows={2}
                                    className="w-full border border-gray-400 rounded-sm px-2 py-1 text-gray-900 bg-white text-xs"
                                    placeholder="Details..."
                                  />
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Medical Conditions Section */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Medical Conditions</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-800 mb-3">Do you, or have you ever, suffered from:</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700">Condition</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                            </tr>
                          </thead>
                          <tbody>
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
                                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{condition}</td>
                                  <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={data[`${key}Condition`] === true}
                                      onChange={() => handleChange(`${key}Condition`, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${condition} - Yes`}
                                    />
                                  </td>
                                  <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={data[`${key}Condition`] === false}
                                      onChange={() => handleChange(`${key}Condition`, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${condition} - No`}
                                    />
                                  </td>
                                  <td className="border border-gray-400 px-3 py-2">
                                    {data[`${key}Condition`] === true && (
                                      <textarea
                                        value={data[`${key}ConditionDetails`] || ''}
                                        onChange={(e) => handleChange(`${key}ConditionDetails`, e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-400 rounded-sm px-2 py-1 text-gray-900 bg-white text-xs"
                                        placeholder="Details..."
                                      />
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

                  {/* Body Parts Section */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Body Parts Issues</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-800 mb-3">Do you, or have you ever, had trouble with your:</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700">Body Part</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              'Back',
                              'Neck',
                              'Shoulders',
                              'Arms',
                              'Hands',
                              'Fingers',
                              'Hips',
                              'Legs',
                              'Feet',
                              'Joints'
                            ].map((bodyPart, index) => {
                              const key = bodyPart.toLowerCase().replace(/[^a-z0-9]/g, '');
                              return (
                                <tr key={index}>
                                  <td className="border border-gray-400 px-3 py-2 text-sm text-gray-900">{bodyPart}</td>
                                  <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={data[`${key}Issue`] === true}
                                      onChange={() => handleChange(`${key}Issue`, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${bodyPart} - Yes`}
                                    />
                                  </td>
                                  <td className="border border-gray-400 px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={data[`${key}Issue`] === false}
                                      onChange={() => handleChange(`${key}Issue`, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${bodyPart} - No`}
                                    />
                                  </td>
                                  <td className="border border-gray-400 px-3 py-2">
                                    {data[`${key}Issue`] === true && (
                                      <textarea
                                        value={data[`${key}IssueDetails`] || ''}
                                        onChange={(e) => handleChange(`${key}IssueDetails`, e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-400 rounded-sm px-2 py-1 text-gray-900 bg-white text-xs"
                                        placeholder="Details..."
                                      />
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

                  {/* Declaration */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Declaration (to be completed by the applicant)</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-4">
                        <p className="text-gray-900 text-sm leading-relaxed">
                          I have not knowingly withheld any information relevant to the pre-employment medical examination. I declare that the information provided in this form is true and correct.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Applicant's Signature:</label>
                            <SignatureCanvas
                              existingSignature={data.declarationSignature}
                              onSignatureEnd={(sig) => handleChange('declarationSignature', sig)}
                              onSignatureClear={() => handleChange('declarationSignature', '')}
                              width={400}
                              height={120}
                              className="bg-white border border-gray-400 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date:</label>
                            <input
                              id="declarationDate"
                              title="Declaration Date"
                              type="date"
                              value={data.declarationDate || ''}
                              onChange={(e) => handleChange('declarationDate', e.target.value)}
                              className="w-full border border-gray-400 h-8 rounded-sm px-2 text-gray-900 bg-white"
                            />
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
);

function Field({ label, value, onChange, type = 'text' }: { label: string; value: any; onChange: (v: any) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}:</label>
      <input
        id={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}
        title={label}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-400 h-8 rounded-sm px-2 text-gray-900 bg-white"
      />
    </div>
  );
}

function ConsentCheckbox({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean | null) => void }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex gap-4 mt-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value === true}
            onChange={() => onChange(true)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          Yes
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value === false}
            onChange={() => onChange(false)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          No
        </label>
      </div>
      <span className="text-sm text-gray-900 flex-1">{label}</span>
    </div>
  );
}
