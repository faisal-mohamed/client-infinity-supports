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

export default forwardRef<PreEmploymentMedicalFormRef, { token: string; onValidityChange?: (v: boolean) => void; isSignatureLink?: boolean }>(
  function PreEmploymentMedicalForm({ token, onValidityChange, isSignatureLink = false }, ref) {
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [staffInfo, setStaffInfo] = useState<any>({});
    const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());

    useEffect(() => {
      // Load saved data if any
      const loadData = async () => {
        try {
          const apiEndpoint = isSignatureLink
            ? `/api/staff/signature/${token}/forms/pre_employment_medical`
            : `/api/staff/onboard/${token}`;
          
          const response = await fetch(apiEndpoint);
          if (response.ok) {
            const result = await response.json();
            let s: any = {};
            let saved: any = {};
            
            if (isSignatureLink) {
              s = result.staff || {};
              saved = result.formSubmission?.data || {};
              // Merge signature fields
              if (result.formSubmission?.staffSignature) {
                saved.signature = result.formSubmission.staffSignature;
              }
              if (result.formSubmission?.staffSignedAt) {
                saved.signatureDate = new Date(result.formSubmission.staffSignedAt).toISOString().split('T')[0];
              }
            } else {
              s = result.staff || {};
              saved = (result.submissions && result.submissions['pre_employment_medical']) || {};
            }
            
            setStaffInfo(s);
            setData((d: any) => ({
              ...d,
              ...saved,
              signature: saved.signature || '',
              signatureDate: saved.signatureDate || '',
              fullName: saved.fullName || `${s.firstName || ''} ${s.surname || ''}`.trim()
            }));
          }
        } catch (e) {
          // ignore prefill errors
        }
      };
      loadData();
    }, [token, isSignatureLink]);

    useEffect(() => {
      // Check validity whenever data changes
      if (onValidityChange) {
        const isValid = validate();
        onValidityChange(isValid);
      }
    }, [data, onValidityChange]);


    const validate = (): boolean => {
      // Check if required fields are filled
      if (!data.fullName) return false;
      if (!data.address) return false;
      if (!data.dateOfBirth) return false;
      if (!data.positionApplied) return false;
      if (data.consentRecruitment !== true && data.consentRecruitment !== false) return false;
      if (data.consentFuturePositions !== true && data.consentFuturePositions !== false) return false;
      if (data.consentRefereeInquiries !== true && data.consentRefereeInquiries !== false) return false;
      if (data.consentPoliceCheck !== true && data.consentPoliceCheck !== false) return false;
      if (data.consentEducationalCheck !== true && data.consentEducationalCheck !== false) return false;
      if (!data.signature) return false;
      if (!data.signatureDate) return false;
      
      // Check all general health questions are answered
      for (let i = 0; i < 5; i++) {
        const key = `generalHealth${i}`;
        if (data[key] !== true && data[key] !== false) return false;
      }
      
      // Check all medical conditions are answered
      const medicalConditions = [
        'tuberculosis', 'wheezingbronchitisasthma', 'diabetes', 'bloodpressureorheartdisease',
        'stomachpainsorulcers', 'excessivenoiseexposureorlossofhearing', 'skindisordersordermatitis',
        'chronicearinfections', 'fitsblackoutsordizziness', 'headinjuryorconcussion',
        'hernia', 'allergies', 'anxietiesordepressiveillness', 'hepatitisb',
        'severeheadaches', 'colourblindness'
      ];
      for (const condition of medicalConditions) {
        const key = `${condition}Condition`;
        if (data[key] !== true && data[key] !== false) return false;
      }
      
      // Check body parts are answered
      if (data.backNeck !== true && data.backNeck !== false) return false;
      if (data.wristElbow !== true && data.wristElbow !== false) return false;
      if (data.anklesKnees !== true && data.anklesKnees !== false) return false;
      
      // Check workplace questions are answered
      if (data.workInjury !== true && data.workInjury !== false) return false;
      if (data.ppeDifficulties !== true && data.ppeDifficulties !== false) return false;
      if (data.hazardousMaterials !== true && data.hazardousMaterials !== false) return false;
      
      // Check mandatory details when Yes is selected
      if (data.workInjury === true && !data.workInjuryDetails) return false;
      if (data.ppeDifficulties === true && !data.ppeDifficultiesDetails) return false;
      if (data.hazardousMaterials === true && !data.hazardousMaterialsDetails) return false;
      
      // Check disclosure advice
      if (!data.disclosureAdviceSignature) return false;
      if (!data.disclosureAdviceDate) return false;
      
      // Check declaration
      if (!data.declarationSignature) return false;
      if (!data.declarationDate) return false;
      
      return true;
    };

    const validateDetailed = () => {
      const errorsBySection: Record<string, string[]> = {};
      const invalid: string[] = [];
      const errorFields = new Set<string>();

      // Applicant Details Section
      const applicantDetailsMissing: string[] = [];
      if (!data.fullName) {
        applicantDetailsMissing.push('Full Name');
        errorFields.add('fullName');
      }
      if (!data.address) {
        applicantDetailsMissing.push('Address');
        errorFields.add('address');
      }
      if (!data.dateOfBirth) {
        applicantDetailsMissing.push('Date of Birth');
        errorFields.add('dateOfBirth');
      }
      if (!data.positionApplied) {
        applicantDetailsMissing.push('Position Applied For');
        errorFields.add('positionApplied');
      }
      if (applicantDetailsMissing.length > 0) {
        errorsBySection['Applicant Details'] = applicantDetailsMissing;
      }
      
      // Informed Consent Section
      const consentMissing: string[] = [];
      if (data.consentRecruitment !== true && data.consentRecruitment !== false) {
        consentMissing.push('Consent #1');
        errorFields.add('consentRecruitment');
      }
      if (data.consentFuturePositions !== true && data.consentFuturePositions !== false) {
        consentMissing.push('Consent #2');
        errorFields.add('consentFuturePositions');
      }
      if (data.consentRefereeInquiries !== true && data.consentRefereeInquiries !== false) {
        consentMissing.push('Consent #3');
        errorFields.add('consentRefereeInquiries');
      }
      if (data.consentPoliceCheck !== true && data.consentPoliceCheck !== false) {
        consentMissing.push('Consent #4');
        errorFields.add('consentPoliceCheck');
      }
      if (data.consentEducationalCheck !== true && data.consentEducationalCheck !== false) {
        consentMissing.push('Consent #5');
        errorFields.add('consentEducationalCheck');
      }
      if (!data.signature) {
        consentMissing.push('Signature');
        errorFields.add('signature');
      }
      if (!data.signatureDate) {
        consentMissing.push('Date');
        errorFields.add('signatureDate');
      }
      if (consentMissing.length > 0) {
        errorsBySection['Informed Consent'] = consentMissing;
      }
      
      // General Health Questionnaire Section
      const healthQuestionMissing: string[] = [];
      for (let i = 0; i < 5; i++) {
        const key = `generalHealth${i}`;
        if (data[key] !== true && data[key] !== false) {
          healthQuestionMissing.push(`Question ${i + 1}`);
          errorFields.add(key);
        }
      }
      
      // Medical Conditions
      const medicalConditions = [
        'Tuberculosis', 'Wheezing/Bronchitis/Asthma', 'Diabetes', 'Blood pressure or heart disease',
        'Stomach pains or ulcers', 'Excessive noise exposure or loss of hearing', 'Skin disorders or dermatitis',
        'Chronic ear infections', 'Fits, black-outs or dizziness', 'Head injury or concussion',
        'Hernia', 'Allergies', 'Anxieties or depressive illness', 'Hepatitis B',
        'Severe headaches', 'Colour blindness'
      ];
      medicalConditions.forEach((condition, index) => {
        const key = condition.toLowerCase().replace(/[^a-z0-9]/g, '') + 'Condition';
        if (data[key] !== true && data[key] !== false) {
          healthQuestionMissing.push(`Condition ${index + 1}`);
          errorFields.add(key);
        }
      });
      
      // Body Parts - use exact keys that match the form
      const bodyParts = [
        { label: 'Back or neck', key: 'backNeck' },
        { label: 'Wrist or elbow', key: 'wristElbow' },
        { label: 'Ankles or knees', key: 'anklesKnees' }
      ];
      bodyParts.forEach((item, index) => {
        if (data[item.key] !== true && data[item.key] !== false) {
          healthQuestionMissing.push(`Body Part ${index + 1}`);
          errorFields.add(item.key);
        }
      });
      
      if (healthQuestionMissing.length > 0) {
        errorsBySection['General Health Questionnaire'] = healthQuestionMissing;
      }
      
      // Medical History - Workplace Section
      const workplaceMissing: string[] = [];
      if (data.workInjury !== true && data.workInjury !== false) {
        workplaceMissing.push('Question 1');
        errorFields.add('workInjury');
      }
      if (data.ppeDifficulties !== true && data.ppeDifficulties !== false) {
        workplaceMissing.push('Question 2');
        errorFields.add('ppeDifficulties');
      }
      if (data.hazardousMaterials !== true && data.hazardousMaterials !== false) {
        workplaceMissing.push('Question 3');
        errorFields.add('hazardousMaterials');
      }
      
      // Mandatory details when Yes is selected (only for Workplace section)
      if (data.workInjury === true && !data.workInjuryDetails) {
        workplaceMissing.push('Question 1 Details');
        errorFields.add('workInjuryDetails');
      }
      if (data.ppeDifficulties === true && !data.ppeDifficultiesDetails) {
        workplaceMissing.push('Question 2 Details');
        errorFields.add('ppeDifficultiesDetails');
      }
      if (data.hazardousMaterials === true && !data.hazardousMaterialsDetails) {
        workplaceMissing.push('Question 3 Details');
        errorFields.add('hazardousMaterialsDetails');
      }
      
      if (workplaceMissing.length > 0) {
        errorsBySection['Medical History - Workplace'] = workplaceMissing;
      }
      
      // Disclosure Advice Section
      const disclosureMissing: string[] = [];
      if (!data.disclosureAdviceSignature) {
        disclosureMissing.push('Signature');
        errorFields.add('disclosureAdviceSignature');
      }
      if (!data.disclosureAdviceDate) {
        disclosureMissing.push('Date');
        errorFields.add('disclosureAdviceDate');
      }
      if (disclosureMissing.length > 0) {
        errorsBySection['Disclosure Advice'] = disclosureMissing;
      }
      
      // Declaration Section
      const declarationMissing: string[] = [];
      if (!data.declarationSignature) {
        declarationMissing.push('Signature');
        errorFields.add('declarationSignature');
      }
      if (!data.declarationDate) {
        declarationMissing.push('Date');
        errorFields.add('declarationDate');
      }
      if (declarationMissing.length > 0) {
        errorsBySection['Declaration'] = declarationMissing;
      }

      // Check if dates are valid
      if (data.signatureDate && isNaN(Date.parse(data.signatureDate))) {
        invalid.push('Informed Consent Date (invalid format)');
      }
      if (data.disclosureAdviceDate && isNaN(Date.parse(data.disclosureAdviceDate))) {
        invalid.push('Disclosure Advice Date (invalid format)');
      }
      if (data.declarationDate && isNaN(Date.parse(data.declarationDate))) {
        invalid.push('Declaration Date (invalid format)');
      }

      // Format error messages by section
      const formattedErrors: string[] = [];
      Object.entries(errorsBySection).forEach(([section, fields]) => {
        if (fields.length === 1) {
          formattedErrors.push(`${section}: ${fields[0]}`);
        } else if (fields.length === 2) {
          formattedErrors.push(`${section}: ${fields[0]}, ${fields[1]}`);
        } else {
          formattedErrors.push(`${section}: ${fields[0]}, ${fields[1]} and ${fields.length - 2} more`);
        }
      });

      // Update validation errors state
      setValidationErrors(errorFields);

      return {
        isValid: formattedErrors.length === 0 && invalid.length === 0,
        missing: formattedErrors.length > 0 ? formattedErrors : undefined,
        invalid: invalid.length > 0 ? invalid : undefined
      };
    };

    const save = async (submit: boolean = false): Promise<boolean> => {
      setLoading(true);
      try {
        const apiEndpoint = isSignatureLink
          ? `/api/staff/signature/${token}/forms/pre_employment_medical`
          : `/api/staff/onboard/${token}`;
        
        const response = await fetch(apiEndpoint, {
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
      // Clear error for this field when user starts typing/selecting
      if (validationErrors.has(key)) {
        setValidationErrors((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };

    const hasError = (key: string) => validationErrors.has(key);

    return (
      <div className="bg-gray-100 py-8">
        {/* Page 1 - Consent Form */}
        <FormPage showTitle={false} meta={{ website: '', version: '', reviewDate: '' }}>
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
                        <Field label="Full Name" value={data.fullName} onChange={(v) => handleChange('fullName', v)} required hasError={hasError('fullName')} />
                        <Field label="Address" value={data.address} onChange={(v) => handleChange('address', v)} required hasError={hasError('address')} />
                        <Field label="Date of Birth" type="date" value={data.dateOfBirth} onChange={(v) => handleChange('dateOfBirth', v)} required hasError={hasError('dateOfBirth')} />
                        <Field label="Position Applied For" value={data.positionApplied} onChange={(v) => handleChange('positionApplied', v)} required hasError={hasError('positionApplied')} />
                      </div>
                    </div>
                  </div>

                  {/* Informed Consent */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Informed Consent (to be completed by the applicant)</h3>
                    </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-3 text-gray-900 text-sm leading-relaxed mb-4">
                        <p>
                          All applicants for positions at Infinity Supports WA are asked to sign that they have read and understood the content of the following statement and that they give their consent to use and disclose their personal information for the purposes of recruitment and selection.
                        </p>
                        <p>
                          In accordance with the Privacy legislation, Infinity Supports WA is committed to ensuring the confidentiality and security of your personal information.  The information you supply during the recruitment and selection process will be used solely for the purposes of assessing your suitability for employment in the specified position.
                        </p>
                        <p>
                          In order to assist Infinity Supports WA and the assessment of your application, it may be necessary for us to disclose your personal information to certain third parties such as internal managers, your referees etc. and as may be required by law. We will only disclose your personal information to third parties for this purpose.
                        </p>
                        <p>
                          Infinity Supports WA has a policy of retaining information relating to all applicants for a period of 6 months after the selection process for the position has been completed.  During this period if another position for which you may be suitable arises, we may use your information in considering your suitability for such a position.
                        </p>
                        <p>
                          In addition, Infinity Supports WA will, in accordance with the Corporations Act, seek information in relation to past performance and employment history of all candidates prior to appointment to any position. Therefore, reference checks with previous employers, police checks, WWCC and educational qualifications checks may be carried out prior to any offer of employment.
                        </p>
                      </div>
                      <div className="mt-4">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-400">
                            <tbody>
                              {[
                                {
                                  label: 'I consent to Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for the position stated above.',
                                  key: 'consentRecruitment'
                                },
                                {
                                  label: 'I consent Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for ANY OTHER suitable positions that may arise in the future.',
                                  key: 'consentFuturePositions'
                                },
                                {
                                  label: 'I consent to Infinity Supports WA making inquiries about me from my referees and any other person including colleagues on LinkedIn.',
                                  key: 'consentRefereeInquiries'
                                },
                                {
                                  label: 'I consent to Infinity Supports WA carrying out a police check.',
                                  key: 'consentPoliceCheck'
                                },
                                {
                                  label: 'I consent to Infinity Supports WA carrying out an educational qualifications check.',
                                  key: 'consentEducationalCheck'
                                }
                              ].map((item, index) => {
                                const fieldHasError = hasError(item.key);
                                return (
                                  <tr key={index} className={`border-b border-gray-300 ${fieldHasError ? 'bg-red-50' : ''}`}>
                                    <td className={`border px-3 py-2 text-sm text-gray-900 align-top ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`} style={{ width: '70%' }}>
                                      <span className="text-red-500 mr-1">*</span>{item.label}
                                    </td>
                                    <td className={`border px-3 py-2 text-center align-top ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`} style={{ width: '15%' }}>
                                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                        checked={data[item.key] === true}
                                        onChange={() => handleChange(item.key, true)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        title={`${item.label} - Yes`}
                              />
                                      <span className="text-sm text-gray-700">Yes</span>
                            </label>
                                    </td>
                                    <td className={`border px-3 py-2 text-center align-top ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`} style={{ width: '15%' }}>
                                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                        checked={data[item.key] === false}
                                        onChange={() => handleChange(item.key, false)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        title={`${item.label} - No`}
                              />
                                      <span className="text-sm text-gray-700">No</span>
                            </label>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          </div>
                        </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Applicant's Signature: <span className="text-red-500">*</span>
                            </label>
                            <SignatureCanvas
                              existingSignature={data.signature}
                              onSignatureEnd={(sig) => handleChange('signature', sig)}
                              onSignatureClear={() => handleChange('signature', '')}
                              width={400}
                              height={120}
                              className={`bg-white border rounded-sm ${hasError('signature') ? 'border-red-500 border-2' : 'border-gray-400'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date: <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="signatureDate"
                              title="Signature Date"
                              type="date"
                              value={data.signatureDate || ''}
                              onChange={(e) => handleChange('signatureDate', e.target.value)}
                              className={`w-full border h-8 rounded-sm px-2 text-gray-900 bg-white ${hasError('signatureDate') ? 'border-red-500 border-2' : 'border-gray-400'}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                      </div>
                    </div>
                  </div>
        </FormPage>

        {/* Page 2 - Pre-Existing Injury and Disclosure Advice */}
        <FormPage showTitle={false} meta={{ website: '', version: '', reviewDate: '' }}>
          <div className="space-y-4 text-sm w-full">
            <div className="w-full">
              <div className="border border-gray-300 rounded-lg p-6 w-full">
                <div className="space-y-6">
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
                          Please disclose in the space below any pre-existing injuries or diseases that you suffer from, or have suffered from, which could be affected by the nature of your proposed employment with Infinity Supports WA (attach a separate page if necessary).
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

                  {/* Disclosure Advice */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">Disclosure Advice (to be completed by the applicant)</h3>
                </div>
                    <div className="border border-gray-300 rounded-b-lg p-4 w-full mt-3">
                      <div className="space-y-4">
                        <p className="text-gray-900 text-sm leading-relaxed">
                          I confirm that I have read and understood the contents of the above information and state that I have disclosed all relevant information in relation to my health and physical ability to carry out the inherent requirements of this position.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Applicant's Signature: <span className="text-red-500">*</span>
                            </label>
                            <SignatureCanvas
                              existingSignature={data.disclosureAdviceSignature}
                              onSignatureEnd={(sig) => handleChange('disclosureAdviceSignature', sig)}
                              onSignatureClear={() => handleChange('disclosureAdviceSignature', '')}
                              width={400}
                              height={120}
                              className={`bg-white border rounded-sm ${hasError('disclosureAdviceSignature') ? 'border-red-500 border-2' : 'border-gray-400'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date: <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="disclosureAdviceDate"
                              title="Disclosure Advice Date"
                              type="date"
                              value={data.disclosureAdviceDate || ''}
                              onChange={(e) => handleChange('disclosureAdviceDate', e.target.value)}
                              className={`w-full border h-8 rounded-sm px-2 text-gray-900 bg-white ${hasError('disclosureAdviceDate') ? 'border-red-500 border-2' : 'border-gray-400'}`}
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

        {/* Page 3 - General Health Questionnaire and Medical History */}
        <FormPage showTitle={false} meta={{ website: '', version: '', reviewDate: '' }}>
          <div className="space-y-4 text-sm w-full">
            <div className="w-full">
              <div className="border border-gray-300 rounded-lg p-6 w-full">
                <div className="space-y-6">
                  {/* General Health Questionnaire - All in One Section */}
                  <div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg">
                      <h3 className="text-xl font-semibold">General Health Questionnaire (to be completed by the applicant)</h3>
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
                            {/* First 5 General Health Questions */}
                            {[
                              'Are you being treated by any Doctor for any illness?',
                              'Have you ever broken any bones?',
                              'Are you taking regular medication?',
                              'Have you ever been immunised against tetanus?',
                              'Have you ever had any operations?'
                            ].map((question, index) => {
                              const key = `generalHealth${index}`;
                              const fieldHasError = hasError(key);
                              return (
                                <tr key={index} className={fieldHasError ? 'bg-red-50' : ''}>
                                  <td className={`border px-3 py-2 text-sm text-gray-900 ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <span className="text-red-500 mr-1">*</span>{question}
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                      checked={data[key] === true}
                                      onChange={() => handleChange(key, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${question} - Yes`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                      checked={data[key] === false}
                                      onChange={() => handleChange(key, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${question} - No`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
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
                            
                            {/* Sub-heading row for "Do you, or have you ever, suffered from:" */}
                            <tr>
                              <td colSpan={4} className="border border-gray-400 px-3 py-2 text-sm font-bold text-gray-900 bg-gray-50">
                                Do you, or have you ever, suffered from:
                              </td>
                            </tr>
                            
                            {/* 16 Medical Conditions */}
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
                              const key = condition.toLowerCase().replace(/[^a-z0-9]/g, '') + 'Condition';
                              const fieldHasError = hasError(key);
                              return (
                                <tr key={`condition-${index}`} className={fieldHasError ? 'bg-red-50' : ''}>
                                  <td className={`border px-3 py-2 text-sm text-gray-900 ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <span className="text-red-500 mr-1">*</span>{condition}
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                      checked={data[key] === true}
                                      onChange={() => handleChange(key, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${condition} - Yes`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                      checked={data[key] === false}
                                      onChange={() => handleChange(key, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${condition} - No`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
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
                            
                            {/* Sub-heading row for "Do you, or have you ever, had trouble with your:" */}
                            <tr>
                              <td colSpan={4} className="border border-gray-400 px-3 py-2 text-sm font-bold text-gray-900 bg-gray-50">
                                Do you, or have you ever, had trouble with your:
                              </td>
                            </tr>
                            
                            {/* 3 Body Parts */}
                            {[
                              { label: 'Back or neck', key: 'backNeck' },
                              { label: 'Wrist or elbow', key: 'wristElbow' },
                              { label: 'Ankles or knees', key: 'anklesKnees' }
                            ].map((item, index) => {
                              const fieldHasError = hasError(item.key);
                              return (
                                <tr key={`body-${index}`} className={fieldHasError ? 'bg-red-50' : ''}>
                                  <td className={`border px-3 py-2 text-sm text-gray-900 ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <span className="text-red-500 mr-1">*</span>{item.label}
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                      checked={data[item.key] === true}
                                      onChange={() => handleChange(item.key, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${item.label} - Yes`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                      checked={data[item.key] === false}
                                      onChange={() => handleChange(item.key, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      title={`${item.label} - No`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 ${fieldHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    {data[item.key] === true && (
                                      <textarea
                                        value={data[`${item.key}Details`] || ''}
                                        onChange={(e) => handleChange(`${item.key}Details`, e.target.value)}
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

                  {/* Medical History - Workplace */}
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
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Yes</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">No</th>
                              <th className="border border-gray-400 px-3 py-2 text-center text-sm font-medium text-gray-700">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { question: 'Have you ever injured yourself at work or suffered an industrial disease?', key: 'workInjury' },
                              { question: 'Have you ever had difficulties wearing PPE?', key: 'ppeDifficulties' },
                              { question: 'Have you ever worked with hazardous materials?', key: 'hazardousMaterials' }
                            ].map((item, index) => {
                              const questionHasError = hasError(item.key);
                              const detailsHasError = hasError(`${item.key}Details`);
                              return (
                                <tr key={index} className={questionHasError ? 'bg-red-50' : ''}>
                                <td className={`border px-3 py-2 text-sm text-gray-900 ${questionHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                  <span className="text-red-500 mr-1">*</span>{item.question}
                                </td>
                                  <td className={`border px-3 py-2 text-center ${questionHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                    checked={data[item.key] === true}
                                    onChange={() => handleChange(item.key, true)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    title={`${item.question} - Yes`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 text-center ${questionHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                    <input
                                      type="checkbox"
                                    checked={data[item.key] === false}
                                    onChange={() => handleChange(item.key, false)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    title={`${item.question} - No`}
                                    />
                                  </td>
                                  <td className={`border px-3 py-2 ${detailsHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}>
                                  {data[item.key] === true && (
                                      <div>
                                      <textarea
                                        value={data[`${item.key}Details`] || ''}
                                        onChange={(e) => handleChange(`${item.key}Details`, e.target.value)}
                                        rows={2}
                                        className={`w-full border rounded-sm px-2 py-1 text-gray-900 bg-white text-xs ${detailsHasError ? 'border-red-500 border-2' : 'border-gray-400'}`}
                                        placeholder="If yes, please provide details below:"
                                        required={data[item.key] === true}
                                      />
                                        <span className="text-red-500 text-xs">* Required when Yes is selected</span>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Applicant's Signature: <span className="text-red-500">*</span>
                            </label>
                            <SignatureCanvas
                              existingSignature={data.declarationSignature}
                              onSignatureEnd={(sig) => handleChange('declarationSignature', sig)}
                              onSignatureClear={() => handleChange('declarationSignature', '')}
                              width={400}
                              height={120}
                              className={`bg-white border rounded-sm ${hasError('declarationSignature') ? 'border-red-500 border-2' : 'border-gray-400'}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date: <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="declarationDate"
                              title="Declaration Date"
                              type="date"
                              value={data.declarationDate || ''}
                              onChange={(e) => handleChange('declarationDate', e.target.value)}
                              className={`w-full border h-8 rounded-sm px-2 text-gray-900 bg-white ${hasError('declarationDate') ? 'border-red-500 border-2' : 'border-gray-400'}`}
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

function Field({ label, value, onChange, type = 'text', required = false, hasError = false }: { label: string; value: any; onChange: (v: any) => void; type?: string; required?: boolean; hasError?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}
        title={label}
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border h-8 rounded-sm px-2 text-gray-900 bg-white ${hasError ? 'border-red-500 border-2' : 'border-gray-400'}`}
        required={required}
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
