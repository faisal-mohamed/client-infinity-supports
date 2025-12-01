import React from 'react';
import PdfPageLayout from '../pdf/PdfPageLayout';

const EmergencyDrillStrictForm: React.FC<any> = ({ formData, commonFieldsData, settings, logoDataUrl }) => {
  // Debug logging for view form
  console.log('🔍 Emergency Drill VIEW - Settings received:', settings);
  console.log('🔍 Emergency Drill VIEW - Website:', settings?.company_website);
  console.log('🔍 Emergency Drill VIEW - Form ID:', settings?.emergency_drill);
  console.log('🔍 Emergency Drill VIEW - Date:', settings?.review_date);
  const commonFieldMapping: Record<string, string> = {
    clientName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  // Sanitizer to remove footer/title echoes from user content
  const FOOTER_PATTERNS = [
    /www\.infinitysupportswa\.org/gi,
    /\bED-001\b/gi,
    /Date of Report\s*:\s*\d{1,2}\/\d{1,2}\/\d{4}/gi,
    /Emergency Drill Reporting Form/gi,
    /\(For Disability Support Workers in a Client's Home\)/gi
  ];

  const stripFooterEchoes = (text: string): string => {
    if (!text) return '';
    return FOOTER_PATTERNS.reduce((acc, re) => acc.replace(re, ''), text);
  };

  const getValue = (key: string) => {
    let value = '';
    // For clientName field, combine first name and surname to show full name
    if (key === 'clientName') {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      if (fullName) {
        value = fullName;
      } else if (formData?.[key]) {
        value = String(formData[key]);
      } else if (firstName) {
        value = firstName;
      }
    } else if (commonFieldMapping?.[key]) {
      value = commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    } else {
      value = formData?.[key] ?? '';
    }
    // Sanitize user content to remove footer/title echoes
    return stripFooterEchoes(value);
  };

  const renderRadioGroup = (key: string, options: string[]) => (
    <div className="radio-group">
      {options?.map((opt) => (
        <label key={opt} className="radio-item">
          <input type="checkbox" checked={getValue(key) === opt} readOnly />
          {opt}
        </label>
      ))}
    </div>
  );

  return (
    <PdfPageLayout
      logoDataUrl={logoDataUrl || '/infinity_logo.png'}
      footerData={{
        website: settings?.company_website || '',
        formId: settings?.emergency_drill || '',
        date: settings?.review_date || ''
      }}
    >
        {/* Section 1: General Information */}
        <section>
          <h2>1. General Information:</h2>
          
          <div className="field-row">
            <label>Date of Drill:</label>
            <p>{getValue('drillDate')}</p>
          </div>
          
          <div className="field-row">
            <label>Time of Drill:</label>
            <p>{getValue('drillTime')}</p>
          </div>
          
          <div className="field-row">
            <label>Client's Name (if applicable):</label>
            <p>{getValue('clientName')}</p>
          </div>
          
          <div className="field-row">
            <label>Support Worker(s) Involved:</label>
            <p>{getValue('supportWorkers')}</p>
          </div>
          
          <div className="field-row">
            <label>Supervisor/Manager Notified:</label>
            {renderRadioGroup('supervisorNotified', ['Yes', 'No'])}
          </div>
        </section>

        {/* Section 2: Type of Emergency Drill */}
        <section>
          <h2>2. Type of Emergency Drill Conducted:</h2>
          
          <div className="field-row">
            <label>Type:</label>
            <p>{getValue('selectedDrillType') || 'No selection made'}</p>
          </div>
          
          {getValue('selectedDrillType') === 'Other (specify)' && (
            <div className="field-row">
              <label>Please specify other drill type:</label>
              <p>{getValue('otherDrill')}</p>
            </div>
          )}
        </section>

        {/* Section 3: Drill Execution Details */}
        <section>
          <h2>3. Drill Execution Details:</h2>
          
          <div className="field-row">
            <label>Was the emergency plan followed?</label>
            {renderRadioGroup('planFollowed', ['Yes', 'No'])}
          </div>
          
          <div className="field-row">
            <label>Were all safety measures and protocols implemented?</label>
            {renderRadioGroup('safetyProtocols', ['Yes', 'No'])}
          </div>
          
          <div className="field-row">
            <label>Emergency services contacted? (if applicable)</label>
            {renderRadioGroup('servicesContacted', ['Yes', 'No'])}
          </div>
          
          <div className="long-answer">
            <label>Client response and involvement:</label>
            <p>{getValue('clientResponse')}</p>
          </div>
          
          <div className="long-answer">
            <label>Support worker actions:</label>
            <p>{getValue('supportAction')}</p>
          </div>
        </section>

        {/* Section 4: Observations & Challenges */}
        <section>
          <h2>4. Observations & Challenges:</h2>
          
          <div className="long-answer">
            <label>What went well?</label>
            <p>{getValue('whatWentWell')}</p>
          </div>
          
          <div className="long-answer">
            <label>What difficulties or challenges were encountered?</label>
            <p>{getValue('challenges')}</p>
          </div>
          
          <div className="long-answer">
            <label>Any unexpected issues?</label>
            <p>{getValue('unexpectedIssues')}</p>
          </div>
        </section>

        {/* Section 5: Recommendations & Improvements */}
        <section>
          <h2>5. Recommendations & Improvements:</h2>
          
          <div className="long-answer">
            <label>Suggested changes to procedures:</label>
            <p>{getValue('procedureChanges')}</p>
          </div>
          
          <div className="field-row">
            <label>Additional training or support required?</label>
            {renderRadioGroup('additionalTrainingRequired', ['Yes', 'No'])}
          </div>
          
          {getValue('additionalTrainingRequired') === 'Yes' && (
            <div className="long-answer">
              <label>If yes, specify:</label>
              <p>{getValue('trainingDetails')}</p>
            </div>
          )}
          
          <div className="field-row">
            <label>Updates needed for the client's emergency plan?</label>
            {renderRadioGroup('planUpdateNeeded', ['Yes', 'No'])}
          </div>
          
          {getValue('planUpdateNeeded') === 'Yes' && (
            <div className="long-answer">
              <label>If yes, specify:</label>
              <p>{getValue('planUpdateDetails')}</p>
            </div>
          )}
        </section>

        {/* Section 6: Follow-Up Actions */}
        <section>
          <h2>6. Follow-Up Actions:</h2>
          
          <div className="field-row">
            <label>Debrief conducted?</label>
            {renderRadioGroup('debriefConducted', ['Yes', 'No'])}
          </div>
          
          <div className="long-answer">
            <label>Supervisor/Manager Comments:</label>
            <p>{getValue('supervisorComments')}</p>
          </div>
          
          <div className="field-row">
            <label>Date of Next Scheduled Drill:</label>
            <p>{getValue('nextDrillDate')}</p>
          </div>
        </section>

        {/* Section 7: Signatures */}
        <section>
          <h2>7. Signatures:</h2>
          
          <div className="signature-block">
            <div className="signature-section">
              <label>Support Worker:</label>
              {getValue('supportWorkerSignature') ? (
                <img
                  src={getValue('supportWorkerSignature')}
                  alt={`Signature of ${getValue('supportWorkers') || 'Support Worker'}`}
                  className="signature-img"
                />
              ) : (
                <p>Not signed</p>
              )}
              <p className="signature-date">
                Date: {getValue('supportWorkerSignatureDate') || "—"}
              </p>
            </div>

            <div className="signature-section">
              <label>Supervisor/Manager:</label>
              {getValue('supervisorSignature') ? (
                <img
                  src={getValue('supervisorSignature')}
                  alt="Signature of Supervisor/Manager"
                  className="signature-img"
                />
              ) : (
                <p>Not signed</p>
              )}
              <p className="signature-date">
                Date: {getValue('supervisorSignatureDate') || "—"}
              </p>
            </div>
          </div>
        </section>
    </PdfPageLayout>
  );
};

export default EmergencyDrillStrictForm;
