import * as React from "react";
import { format, parseISO, isValid } from "date-fns";

const formatDate = (value: string) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, "dd-MM-yyyy");
    }
  }
  return value || "N/A";
};

export default function ParticipantRiskAssessmentPDF({
  formData,
  commonFieldsData,
  images,
  settings
}: any) {

  // Debug logs for Q11 fields (visible in server logs)
  try {
    // eslint-disable-next-line no-console
    console.log('[PRA PDF] Q11 debug', {
      familyBehavioralHistory: formData?.familyBehavioralHistory,
      familyBehavioralHistoryComment: formData?.familyBehavioralHistoryComment,
      behaviorPractitionerInvolved: formData?.behaviorPractitionerInvolved,
    });
  } catch { }

  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    familyName: "surname",
    address: "street",
    dob: "dob",
    disability: "disability",
    phoneNumber: "phone",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    homePhone: "phone",
    sex: "sex",
  };

  const getValue = (key: string) => {
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? "";
    }
    return formData?.[key] ?? "";
  };

  const isChecked = (fieldKey: string, value: string) => {
    const raw = formData?.[fieldKey];
    if (raw == null) return false;

    if (typeof raw === 'boolean') {
      return (value.toLowerCase() === 'yes' && raw) || (value.toLowerCase() === 'no' && !raw);
    }

    const normalized = (() => {
      const s = String(raw).trim().toLowerCase();
      if (["true", "1", "yes", "y"].includes(s)) return "yes";
      if (["false", "0", "no", "n"].includes(s)) return "no";
      return s;
    })();

    return normalized === value.toLowerCase();
  };

  const riskQuestions = [
    { questionNum: "1", key: "risk1", label: "Is the client able to open door?" },
    { questionNum: "2", key: "risk2", label: "Is there a safe evacuation point at your home?" },
    { questionNum: "3", key: "risk3", label: "Is the service to be provided at night or outside of normal working hours?" },
    { questionNum: "4", key: "risk4", label: "Are there the any expressive language concerns?" },
    { questionNum: "5", key: "risk5", label: "Has relevant medical history been communicated including potential risk situations?" },
    { questionNum: "6", key: "risk6", label: "Does the Participant have any road safety skills?" },
    { questionNum: "7", key: "risk7", label: "Can the participant travel in an unmodified vehicle?" },
    { questionNum: "8", key: "risk8", label: "Can the participant use public transport?" },
    { questionNum: "9", key: "risk9", label: "Is the client known to be affected by crowds?" },
    { questionNum: "10", key: "noiseSensitive", label: "Is the client affected by noises or sudden sounds?" },
    { questionNum: "11", key: "familyBehavioralHistory", label: "Is there a history of any family members with behavioural issues?" },
    { questionNum: "12", key: "mobilityIssues", label: "Does the client have mobility issues? (e.g., wheelchair or other?)" },
    { questionNum: "13", key: "showeringToiletingHazards", label: "Have hazards associated with showering, sponging and toileting been considered? (e.g., manual handling/ slips trips and falls/ biological hazards/ humidity, etc.)" },
    { questionNum: "14", key: "medicationRiskDepression", label: "Does the participant take any of the following medications that can cause Respiratory Depression? (Benzodiazepines, Opioids, Polypharmacy, Psychotropic polypharmacy, Combination of any of the above medications)" }
  ];

  const getFilledControlRows = () => {
    const filledRows = [] as any[];
    for (let i = 1; i <= 10; i++) {
      const issue = getValue(`issue${i}`);
      const score = getValue(`score${i}`);
      const control = getValue(`control${i}`);
      const personValue = formData?.[`person${i}`];
      let person = "";

      if (Array.isArray(personValue)) {
        const otherVal = getValue(`person${i}Other`);
        person = personValue
          .map((p: string) => (p === "Other" ? otherVal : p))
          .filter((p: string) => p && p !== "Other")
          .join(", ");
      } else {
        person = getValue(`person${i}`);
        if (person === "Other") {
          const otherPerson = getValue(`person${i}Other`);
          if (otherPerson) person = otherPerson;
        }
      }

      if (issue || score || control || person) {
        filledRows.push({ issue, score, control, person });
      }
    }
    if (filledRows.length === 0) {
      filledRows.push({ issue: "", score: "", control: "", person: "" });
    }
    return filledRows;
  };

  const getFilledMedicalRows = () => {
    const filledRows = [];
    for (let i = 1; i <= 10; i++) {
      const specify = getValue(`medicalSpecify${i}`);
      const effect = getValue(`medicalEffect${i}`);
      const treatment = getValue(`medicalTreatment${i}`);

      if (specify || effect || treatment) {
        filledRows.push({ specify, effect, treatment });
      }
    }
    if (filledRows.length === 0) {
      filledRows.push({ specify: "", effect: "", treatment: "" });
    }
    return filledRows;
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, border: '1px solid black' };
  const cellStyle = { border: '1px solid black', padding: '8px' };
  const headerStyle = { ...cellStyle, backgroundColor: '#d1d5db', fontWeight: 'bold' as const, textAlign: 'left' as const };

  return (
    <>
      <style>{`
        @page {
          size: A4;
        }
        
        body {
          margin: 0;
          padding: 5px 0 5px 0;
          font-family: 'Arial, sans-serif';
          font-size: 12px;
          line-height: 1.4;
          color: black;
          background-color: white;
        }
        
        /* Allow content to flow naturally with page breaks */
        table {
          page-break-inside: auto;
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        
        tr {
          page-break-inside: avoid;
        }
        
        thead tr {
          page-break-after: avoid;
        }
        
        .section {
          page-break-inside: avoid;
        }
      `}</style>

      {/* Title - First page only */}
      <div style={{ textAlign: 'center', marginBottom: '10px', marginTop: '0' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0' }}>
          Participant Risk Assessment and Disaster Management Plan
        </h1>
      </div>

      {/* Participant Details */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={3}>PARTICIPANT DETAILS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>NDIS Number:</td>
            <td style={cellStyle} colSpan={2}>{getValue("ndisNumber")}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Given name/s:</td>
            <td style={cellStyle}>{getValue("givenNames")}</td>
            <td style={cellStyle}><strong>Family name:</strong> {getValue("familyName")}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Preferred name:</td>
            <td style={cellStyle}>{getValue("preferredName")}</td>
            <td style={cellStyle}><strong>Date of birth:</strong> {getValue("dob")}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Address:</td>
            <td style={cellStyle}>{getValue("address")}</td>
            <td style={cellStyle}><strong>Phone No:</strong> {getValue("phoneNumber")}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Preferred contact method:</td>
            <td style={cellStyle}>{getValue("preferredContact")}</td>
            <td style={cellStyle}><strong>Email:</strong> {getValue("email")}</td>
          </tr>
        </tbody>
      </table>

      {/* Medical Conditions */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={3}>KNOWN MEDICAL CONDITIONS OR ALLERGIES</th>
          </tr>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th style={headerStyle}>Specify</th>
            <th style={headerStyle}>Effect</th>
            <th style={headerStyle}>Treatment</th>
          </tr>
        </thead>
        <tbody>
          {getFilledMedicalRows().map((row, index) => (
            <tr key={index}>
              <td style={cellStyle}>{row.specify}</td>
              <td style={cellStyle}>{row.effect}</td>
              <td style={cellStyle}>{row.treatment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Emergency Contacts */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={3}>EMERGENCY CONTACTS / CARER / GUARDIAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Name/s:</td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Phone:</td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Email:</td>
          </tr>
          <tr>
            <td style={cellStyle}>{getValue("emergencyContactName")}</td>
            <td style={cellStyle}>{getValue("emergencyContactPhone")}</td>
            <td style={cellStyle}>{getValue("emergencyContactEmail")}</td>
          </tr>
        </tbody>
      </table>

      {/* Persons Involved in Risk Assessment */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={3}>PERSONS INVOLVED IN RISK ASSESSMENT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Was the participant involved in the assessment?</td>
            <td style={cellStyle}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px' }}>
                  <input type="checkbox" checked={formData?.participantInvolved === "Yes"} readOnly style={{ marginRight: '4px' }} />
                  Yes
                </label>
                <label style={{ display: 'block' }}>
                  <input type="checkbox" checked={formData?.participantInvolved === "No"} readOnly style={{ marginRight: '4px' }} />
                  No
                </label>
              </div>
            </td>
            <td style={cellStyle}>
              <strong>Reason:</strong> {getValue("participantInvolved") === "No" ? getValue("participantInvolvedReason") : ""}
            </td>
          </tr>
          <tr>
            <td style={cellStyle} colSpan={3}><strong>Staff Involved:</strong> {getValue("staffInvolved")}</td>
          </tr>
          <tr>
            <td style={cellStyle} colSpan={3}><strong>Others Involved:</strong> {getValue("othersInvolved")}</td>
          </tr>
        </tbody>
      </table>

      {/* Risk Assessment Questions */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellStyle}></th>
            <th style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }} colSpan={4}>
              INDIVIDUAL RISK ASSESSMENTS
            </th>
          </tr>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle}>No.</th>
            <th style={headerStyle}>Item</th>
            <th style={{ ...headerStyle, textAlign: 'center' }}>Y/N</th>
            <th style={{ ...headerStyle, textAlign: 'center' }}>Risk Rating</th>
            <th style={headerStyle}>Comments/Controls</th>
          </tr>
        </thead>
        <tbody>
          {riskQuestions.map((question) => {
            const isQ11 = question.key === 'familyBehavioralHistory';
            return (
              <tr key={question.key}>
                <td style={cellStyle}>{question.questionNum}</td>
                <td style={cellStyle}>{question.label}</td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px' }}>
                      <input type="checkbox" checked={isChecked(question.key, 'yes')} readOnly style={{ marginRight: '4px' }} />
                      YES
                    </label>
                    <label style={{ display: 'block' }}>
                      <input type="checkbox" checked={isChecked(question.key, 'no')} readOnly style={{ marginRight: '4px' }} />
                      NO
                    </label>
                  </div>
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>{getValue(`${question.key}Rating`)}</td>
                <td style={cellStyle}>
                  {isQ11 ? (
                    <div>
                      {(() => {
                        const commentText = getValue(`${question.key}Comment`);
                        return commentText ? <div style={{ marginBottom: '6px' }}>{commentText}</div> : null;
                      })()}
                      {(() => {
                        const raw = (formData?.behaviorPractitionerInvolved || '').toString().trim().toLowerCase();
                        const yn = raw === 'yes' || raw === 'true' || raw === '1' || raw === 'y' ? 'Yes' : raw === 'no' || raw === 'false' || raw === '0' || raw === 'n' ? 'No' : '';
                        return (
                          <div style={{ marginBottom: '6px', fontWeight: 500 }}>
                            Behaviour practitioner involved: {yn || '—'}
                          </div>
                        );
                      })()}
                      <div style={{ marginBottom: '4px' }}>Is there a behaviour practitioner involved?</div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px' }}>
                          <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'yes')} readOnly style={{ marginRight: '4px' }} />
                          YES
                        </label>
                        <label style={{ display: 'block' }}>
                          <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'no')} readOnly style={{ marginRight: '4px' }} />
                          NO
                        </label>
                      </div>
                    </div>
                  ) : (
                    getValue(`${question.key}Comment`)
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Management of Medication */}
      <h2 style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', margin: '20px 0 10px', textTransform: 'uppercase' }}>MEDICATION</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#a9b9d9' }}>
            <th style={{ ...headerStyle, backgroundColor: '#a9b9d9' }}>Management of Medication</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>
              <p style={{ marginBottom: '10px' }}>
                Should any of the below be marked as <strong>YES</strong>, refer to <strong>Form 24. Management of Medication</strong>
              </p>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ marginBottom: '5px' }}>Prompt Medication Required</p>
                <label style={{ marginRight: '15px' }}>
                  <input type="checkbox" checked={isChecked('promptMedicationRequired', 'yes')} readOnly style={{ marginRight: '4px' }} />
                  YES
                </label>
                <label>
                  <input type="checkbox" checked={isChecked('promptMedicationRequired', 'no')} readOnly style={{ marginRight: '4px' }} />
                  NO
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ marginBottom: '5px' }}>Assistance of Medication Required</p>
                <label style={{ marginRight: '15px' }}>
                  <input type="checkbox" checked={isChecked('assistanceMedicationRequired', 'yes')} readOnly style={{ marginRight: '4px' }} />
                  YES
                </label>
                <label>
                  <input type="checkbox" checked={isChecked('assistanceMedicationRequired', 'no')} readOnly style={{ marginRight: '4px' }} />
                  NO
                </label>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ marginBottom: '5px' }}>Administration of Medication Required</p>
                <label style={{ marginRight: '15px' }}>
                  <input type="checkbox" checked={isChecked('adminMedicationRequired', 'yes')} readOnly style={{ marginRight: '4px' }} />
                  YES
                </label>
                <label>
                  <input type="checkbox" checked={isChecked('adminMedicationRequired', 'no')} readOnly style={{ marginRight: '4px' }} />
                  NO
                </label>
              </div>
              <div>
                <p style={{ marginBottom: '5px' }}>NO – This participant does not require medication management</p>
                <label style={{ marginRight: '15px' }}>
                  <input type="checkbox" checked={isChecked('noMedicationRequired', 'yes')} readOnly style={{ marginRight: '4px' }} />
                  YES
                </label>
                <label>
                  <input type="checkbox" checked={isChecked('noMedicationRequired', 'no')} readOnly style={{ marginRight: '4px' }} />
                  NO
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Participant Dependency */}
      <div style={{ fontSize: '11px', marginBottom: '15px', lineHeight: '1.6' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Participant Dependency and Health-Safety Risk Assessment Table</div>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Steps to Use the Extended Table:</div>
        <ol style={{ marginLeft: '20px', marginBottom: '8px' }}>
          <li><strong>Assessment:</strong> Evaluate both the level of reliance on your services and the potential impact on health and safety for each participant.</li>
          <li><strong>Categorisation:</strong> Assign the appropriate risk level based on the combined assessment of reliance and health-safety impact.</li>
          <li><strong>Mitigation:</strong> Develop strategies and contingency plans that address not only the level of reliance but also the specific health and safety concerns identified for each risk level.</li>
          <li><strong>Regular Review:</strong> Continuously review and update the risk assessment and mitigation strategies, considering any changes in participants' needs and potential risks.</li>
          <li><strong>Communication:</strong> Ensure that all stakeholders, including participants, families, and your team, understand the dual assessment of reliance and health-safety impact, as well as the corresponding mitigation plans.</li>
          <li><strong>Emergency Planning:</strong> For participants with higher risk levels, develop emergency plans that outline steps to be taken in case of service disruptions or unexpected events.</li>
        </ol>
        <p>By considering both the participants' level of reliance on the services and the potential consequences for their health and safety in case of disruptions, we can create a more comprehensive risk assessment framework that prioritises their well-being. Therefore, prioritising the health and safety of participants is a fundamental responsibility that promotes their well-being, respects their rights, and contributes to the overall success and sustainability of various activities and endeavours, and ultimately, the level of support the provider is required to provide the participant during their care.</p>
      </div>

      {/* Risk Level Selected */}
      {(() => {
        const getSelectedRiskLevel = () => {
          const levels = ['Low', 'Moderate', 'High', 'Critical'];
          for (const level of levels) {
            if (formData?.[`riskLevel${level}`] === true || formData?.[`riskLevel${level}`] === 'true') {
              return level;
            }
          }
          return null;
        };

        const selected = getSelectedRiskLevel();
        if (!selected) return null;

        const meta: Record<string, any> = {
          Low: {
            description: "Participants have a low reliance on provider services to meet daily living needs.",
            criteria: "Participants can independently perform most daily living activities without assistance. Any disruptions in services would have minimal impact on their overall well-being.",
            impact: "Disruptions in services would have minimal impact on participants' health and safety, as they can manage most activities independently.",
          },
          Moderate: {
            description: "Participants have a moderate reliance on provider services for certain daily living needs.",
            criteria: "Participants can perform some daily activities independently but rely on the provider for specific tasks such as transportation, meal preparation, or medication management. A disruption in services would moderately impact their well-being.",
            impact: "Disruptions in services could moderately impact participants' health and safety, particularly for tasks they rely on the provider for.",
          },
          High: {
            description: "Participants have a high reliance on provider services to meet essential daily living needs.",
            criteria: "Participants require significant assistance from the provider for activities of daily living, including personal care, mobility, meal preparation, and medication management. A disruption in services would have a significant impact on their overall well-being and quality of life.",
            impact: "Disruptions in services would significantly impact participants' health and safety, as they rely heavily on the provider for essential tasks.",
          },
          Critical: {
            description: "Participants have a critical reliance on provider services for all daily living needs.",
            criteria: "Participants are entirely dependent on the provider for all activities of daily living, including personal care, mobility, communication, medical support, and more.",
            impact: "Disruptions in services would pose a critical threat to participants' health and safety.",
          }
        };

        const m = meta[selected];
        return (
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>
                <th style={{ ...headerStyle, textAlign: 'center' }}>Selected Risk Level</th>
                <th style={headerStyle}>Description</th>
                <th style={headerStyle}>Criteria</th>
                <th style={headerStyle}>Impact on Health-Safety</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }}>{selected}</td>
                <td style={cellStyle}>{m.description}</td>
                <td style={cellStyle}>{m.criteria}</td>
                <td style={cellStyle}>{m.impact}</td>
              </tr>
            </tbody>
          </table>
        );
      })()}

      {/* Household Meeting Point */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={2}>Participant household safe meeting point in case of emergency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold', width: '30%' }}>Address:</td>
            <td style={cellStyle}>{getValue('householdSafeAddress') || 'N/A'}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Description:</td>
            <td style={cellStyle}>{getValue('householdSafeDesc') || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {/* Manager Notice */}
      <p style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', margin: '15px 0', textTransform: 'uppercase' }}>
        If risk is identified, please discuss with the manager
      </p>

      {/* Controls Table */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={4}>CONTROLS TABLE</th>
          </tr>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th style={headerStyle}>Issue</th>
            <th style={headerStyle}>Score</th>
            <th style={headerStyle}>Control</th>
            <th style={headerStyle}>Person Responsible</th>
          </tr>
        </thead>
        <tbody>
          {getFilledControlRows().map((row, index) => (
            <tr key={index}>
              <td style={cellStyle}>{row.issue}</td>
              <td style={{ ...cellStyle, textAlign: 'center' }}>{row.score}</td>
              <td style={cellStyle}>{row.control}</td>
              <td style={cellStyle}>{row.person}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Risk Assessment Matrix */}
      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '8px' }}>
          Risk Assessment Matrix
        </p>
        <img
          src={images?.riskAssessmentMatrix || "/home_risk_assessment.png"}
          alt="Risk Assessment Matrix"
          style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
        />
      </div>

      {/* Emergency Contact Numbers */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, backgroundColor: '#d1d5db' }} colSpan={3}>Emergency Contact Numbers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: '33%' }}>Police</td>
            <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'middle' }} colSpan={2} rowSpan={3}>
              <img src={images?.emergencyNo || "/participant_risk_assessment_emergency.png"} alt="000 Emergency" style={{ maxHeight: '60px', margin: '0 auto', display: 'block' }} />
            </td>
          </tr>
          <tr>
            <td style={cellStyle}>Fire</td>
          </tr>
          <tr>
            <td style={cellStyle}>Ambulance</td>
          </tr>
        </tbody>
      </table>

      {/* Utilities */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, backgroundColor: '#d1d5db' }} colSpan={3}>Utilities</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, width: '33%' }}>Electricity Authority</td>
            <td style={cellStyle}>Western Power</td>
            <td style={cellStyle}>13 13 51</td>
          </tr>
          <tr>
            <td style={cellStyle}>Water Authority</td>
            <td style={cellStyle}>Water Corp</td>
            <td style={cellStyle}>13 13 75</td>
          </tr>
          <tr>
            <td style={cellStyle}>Gas Authority</td>
            <td style={cellStyle}>ATCO Gas</td>
            <td style={cellStyle}>13 13 52</td>
          </tr>
          <tr>
            <td style={cellStyle}>State Emergency</td>
            <td style={cellStyle}>SES</td>
            <td style={cellStyle}>13 25 00</td>
          </tr>
        </tbody>
      </table>

      {/* Other Key Contacts */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, backgroundColor: '#d1d5db' }} colSpan={3}>Other Key Contacts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cellStyle}>Health Direct</td>
            <td style={cellStyle} colSpan={2}>1800 022 222</td>
          </tr>
          <tr>
            <td style={cellStyle}>Poisons Line</td>
            <td style={cellStyle} colSpan={2}>13 11 26</td>
          </tr>
          <tr>
            <td style={cellStyle}>Lifeline (24 hours crisis counselling)</td>
            <td style={cellStyle} colSpan={2}>13 11 14</td>
          </tr>
          <tr>
            <td style={cellStyle}>Beyond Blue</td>
            <td style={cellStyle} colSpan={2}>1300 22 4636</td>
          </tr>
          <tr>
            <td style={cellStyle}>Crisis Care</td>
            <td style={cellStyle} colSpan={2}>1800 199 008</td>
          </tr>
          <tr>
            <td style={cellStyle}>NDIS</td>
            <td style={cellStyle} colSpan={2}>1800 800 110</td>
          </tr>
          <tr>
            <td style={cellStyle}>Mental Health Emergency Response Line</td>
            <td style={cellStyle} colSpan={2}>1300 555 788 (Perth) / 1300 676 822 (Peel)</td>
          </tr>
        </tbody>
      </table>

      {/* Emergency/Disaster Support Plan */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db', fontWeight: 'bold' }}>
            <th style={cellStyle} colSpan={3}>Type of support to be put in place in the event of an emergency or disaster and how we will support the participant (based on the Service agreement)</th>
          </tr>
          <tr style={{ fontWeight: 'bold' }}>
            <th style={cellStyle}>Emergency</th>
            <th style={cellStyle} colSpan={2}>Support provided to the participants in the event of an emergency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>Infinity is unable to support for extended period</td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }} colSpan={2}>Infinity will assist the client/family to source alternative providers</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>Client taken ill during support.</td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }} colSpan={2}>Call 000, Call family, take to nearest ED</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>Closure of business</td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }} colSpan={2}>Infinity will assist the client/family to source alternative providers</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>Pandemic</td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }} colSpan={2}>Client will reside with family, have essential supports and daily phone check-ins</td>
          </tr>
        </tbody>
      </table>

      {/* What to do in an Emergency */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={2}>What to do in an Emergency</th>
          </tr>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th style={headerStyle}>Evacuation Procedures</th>
            <th style={headerStyle}>FIRE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                <li><strong>Upon hearing the alarm or when the situation requires the participant to leave the premises:</strong></li>
                <li>Prepare to evacuate</li>
                <li>Get your environment ready to be left unattended. Shut down electrical/electronic devices; turn off gas if safe to do so.</li>
                <li>For fire, close the doors as you go – do not lock them. In the case of a bomb threat, leave doors open.</li>
                <li>Assist participant in immediate danger</li>
                <li>Leave the building via the nearest safe route.</li>
                <li>Obey all directions from emergency services.</li>
                <li>Move calmly to assembly point</li>
                <li>Follow closely the instructions of emergency services personnel and campus wardens.</li>
                <li>Wait for the OK to re-enter the building</li>
              </ul>
            </td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                <li>Ring 000 and provide details of the fire then ring supervisor.</li>
                <li>Assist any person in immediate danger only if safe to do so.</li>
                <li>If safe to do so, close doors to minimise spread of fire.</li>
                <li>Attack the fire only if safe to do so.</li>
                <li>Contact the nearest warden and follow their instructions (if applicable)</li>
                <li>Assist with evacuation of participants with mobility issues.</li>
                <li>Move to the evacuation location in plan and stay there until all clear has been given.</li>
                <li>Follow closely the instructions of emergency services personnel and campus warden.</li>
              </ul>
            </td>
          </tr>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Medical Emergency</td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Civil Disturbance</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                <li><strong>Assess the situation:</strong></li>
                <li>Do not move a participant unless they are exposed to a life-threatening situation.</li>
                <li>In emergency situations contact the ambulance service by dialling 000 then ring supervisor.</li>
                <li>Arrange for the ambulance to be met.</li>
                <li>Remain with the participant and administer first aid as appropriate until assistance arrives.</li>
                <li>Follow closely the instructions of emergency services personnel.</li>
              </ul>
            </td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                <li>Keep well clear of the disturbance and do not say or do anything that may encourage irrational behaviour.</li>
                <li>Consider locking down the building to prevent unauthorised entry.</li>
                <li>Follow closely the instructions of emergency services personnel and campus wardens.</li>
                <li>Evacuate the building only if instructed to do so by emergency services personnel or campus warden</li>
              </ul>
            </td>
          </tr>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Extreme Weather</td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Personal Preparation</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                <li>Keep participant informed of situation</li>
                <li>Move away from windows and turn off electrical appliances to ensure safety</li>
                <li>Follow closely the instructions of emergency services personnel</li>
                <li>Evacuate the building only if instructed to do so by emergency services personnel</li>
                <li>Keep in contact with supervisor and follow their instructions</li>
              </ul>
            </td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                <li>Know the location of emergency exits in your building</li>
                <li>Plan an escape route from the premises to safe environment</li>
                <li>Identify and familiarise yourself evacuation point or a safe location</li>
                <li>Familiarise yourself with location of any break glass fire alarms</li>
                <li>Note location of fire extinguishers</li>
                <li>Familiarise yourself with the identity and location of the first aid kits</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Communication Modes */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={2}>Mode of Communication assessment for non-verbal participants (e.g., Sign language, pictures, body movement)</th>
          </tr>
          <tr style={{ backgroundColor: '#e5e7eb' }}>
            <th style={headerStyle}>Possible scenarios of concern</th>
            <th style={headerStyle}>Mode of communication</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>{getValue('scenario1')}</td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>{getValue('mode1')}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>{getValue('scenario2')}</td>
            <td style={{ ...cellStyle, verticalAlign: 'top' }}>{getValue('mode2')}</td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#d1d5db' }}>
            <th style={headerStyle} colSpan={4}>Authorisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Authorised by:</td>
            <td style={cellStyle}>{getValue('authorisedBy')}</td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Role:</td>
            <td style={cellStyle}>{getValue('role')}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Signature:</td>
            <td style={cellStyle}>
              {(() => {
                const sig = String(getValue('signature') || '');
                const isImg = sig.startsWith('data:image') || sig.startsWith('http');
                return isImg ? <img src={sig} alt="Signature" style={{ maxHeight: '40px', maxWidth: '100%' }} /> : sig;
              })()}
            </td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Date:</td>
            <td style={cellStyle}>{formatDate(getValue('signatureDate'))}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Participant / Guardian Signature:</td>
            <td style={cellStyle}>
              {(() => {
                const gsig = String(getValue('guardianSignature') || '');
                const isImg = gsig.startsWith('data:image') || gsig.startsWith('http');
                return isImg ? <img src={gsig} alt="Guardian Signature" style={{ maxHeight: '40px', maxWidth: '100%' }} /> : gsig;
              })()}
            </td>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Date:</td>
            <td style={cellStyle}>{formatDate(getValue('guardianDate'))}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold', verticalAlign: 'top' }}>Is a copy supplied to the participant?</td>
            <td style={cellStyle}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                <input type="checkbox" checked={isChecked('copySupplied', 'yes')} readOnly style={{ marginRight: '4px' }} />
                YES
              </label>
              <label style={{ display: 'block' }}>
                <input type="checkbox" checked={isChecked('copySupplied', 'no')} readOnly style={{ marginRight: '4px' }} />
                NO
              </label>
            </td>
            <td style={{ ...cellStyle, fontWeight: 'bold', verticalAlign: 'top' }}>Copy placed on file?</td>
            <td style={cellStyle}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                <input type="checkbox" checked={isChecked('copyOnFile', 'yes')} readOnly style={{ marginRight: '4px' }} />
                YES
              </label>
              <label style={{ display: 'block' }}>
                <input type="checkbox" checked={isChecked('copyOnFile', 'no')} readOnly style={{ marginRight: '4px' }} />
                NO
              </label>
            </td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 'bold' }}>Date for Review:</td>
            <td style={cellStyle} colSpan={3}>{formatDate(getValue('reviewDate'))}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}


