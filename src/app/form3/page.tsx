'use client';

import React from 'react';

const HealthAssessmentForm = () => {
  // Inline JSON data
  const healthConcerns = [
    {
      label: 'Does the Participant require a Medication Chart?',
      note:
        '(If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment)',
    },
    {
      label: 'Does the Participant require Mealtime Management?',
      note: 'If yes, refer to Mealtime Management Plan Form',
    },
    {
      label: 'Does the participant require Bowel Care Management?',
      note:
        'If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.',
    },
    {
      label:
        'Are there any issues with a menstrual cycle or is assistance needed with female hygiene',
      note: 'If yes, please specify:',
    },
    {
      label: 'Does the Participant have Epilepsy?',
      note: 'If yes, ensure Participant’s Doctor completes an Epilepsy Plan',
    },
    {
      label: 'Is the Participant an Asthmatic?',
      note: 'If yes, ensure Participant’s Doctor completes an Asthma Plan',
    },
    {
      label: 'Does the Participant have any allergies?',
      note: 'If yes, ensure to have an Allergy Plan from Participant’s Doctor',
    },
    {
      label: 'Is the Participant anaphylactic?',
      note:
        'If yes, ensure to have an anaphylaxis Plan from the Participant’s Doctor',
    },
  ];

  const trainingTriggers = [
    {
      label:
        'Do you give permission for our company’s staff to administer band-aids in cases of a minor injury?',
    },
    {
      label: 'Does this participant require specific training?',
      note:
        'If yes, ensure to provide information such as implementing a positive behaviour support plan.',
    },
    {
      label:
        'Are there any other medication conditions that will be relevant to the care provided to this Participant?',
      note: 'If yes, please specify.',
    },
    {
      label: 'Is there any specific trigger for community activities?',
      note:
        'If yes, please specify and complete the Risk assessment for participants.',
    },
  ];

  const safetyConsiderations = [
    {
      label:
        'Does the Participant show signs or a history of unexpectedly leaving (absconding)?',
      note: 'If yes, please specify.',
    },
    {
      label: 'Is this participant prone to falls or have a history of falls?',
    },
    {
      label: 'Are there any behaviours of concern? E.g.: kicking, biting.',
      note: 'If yes, please specify.',
    },
    {
      label: 'Is there a current Positive Behaviour Support Plan in place?',
      note: 'If yes, refer to High Risk Participant Register.',
    },
    {
      label: 'Does the participant require communication assistance?',
      note:
        'If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.',
    },
  ];

  const personalPreferences = [
    {
      label:
        'Is there any physical assistance or physical assistance preference for this Participant?',
      note: 'If yes, specify.',
    },
    {
      label: 'Does the Participant have any expressive language concerns?',
      note:
        'If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.',
    },
    {
      label: 'Does this Participant have any personal preferences & personal goals?',
      note: 'If yes, refer to form Support Plan',
    },
  ];

  // Reusable row component
  const YesNoRow = ({ label, note }: { label: string; note?: string }) => (
    <tr>
      <td className="border border-black p-1 align-top">{label}</td>
      <td className="border border-black p-1 align-top text-[11px]">
        <label className="inline-flex items-start space-x-1">
          <input type="checkbox" className="mt-1" />
          <span>Yes</span>
        </label>
        {note && <div className="mt-1 leading-tight">{note}</div>}
      </td>
      <td className="border border-black p-1 text-center align-top">
        <input type="checkbox" />
      </td>
    </tr>
  );

  return (
    <div className="bg-gray-100 py-6 flex justify-center font-sans">
      <div className="max-w-[720px] w-full bg-white p-6 space-y-12 text-xs">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://storage.googleapis.com/a1aa/image/9190d8d0-4133-41db-1cc6-1a07bdd4a03c.jpg"
            alt="Infinity Supports WA logo"
            className="w-[120px] h-[50px]"
          />
        </div>

        {/* Table 1: Health Concerns */}
        <table className="w-full border border-black border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black p-1 text-left font-semibold">Medication Information / Diagnosis / Health Concerns</th>
              <th className="border border-black p-1 w-[180px] text-left font-semibold"></th>
              <th className="border border-black p-1 w-[60px] text-center font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {healthConcerns.map((item, idx) => (
              <YesNoRow key={idx} label={item.label} note={item.note} />
            ))}
          </tbody>
        </table>

        {/* Table 2: Triggers + Safety */}
        <table className="w-full border border-black table-fixed text-[11px]">
          <tbody>
            {trainingTriggers.map((item, idx) => (
              <YesNoRow key={`trg-${idx}`} label={item.label} note={item.note} />
            ))}
            <tr>
              <td colSpan={3} className="border border-black p-2 font-bold bg-gray-200">
                Safety Considerations
              </td>
            </tr>
            {safetyConsiderations.map((item, idx) => (
              <YesNoRow key={`safety-${idx}`} label={item.label} note={item.note} />
            ))}
          </tbody>
        </table>

        {/* Table 3: Personal Preferences */}
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            {personalPreferences.map((item, idx) => (
              <YesNoRow key={`prefs-${idx}`} label={item.label} note={item.note} />
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <footer className="flex justify-between text-gray-600 text-[11px] px-1">
          <div>Website: infinitysupportswa.org</div>
          <div>CF001</div>
          <div>Review Date: 14/03/2026</div>
        </footer>
      </div>
    </div>
  );
};

export default HealthAssessmentForm;
