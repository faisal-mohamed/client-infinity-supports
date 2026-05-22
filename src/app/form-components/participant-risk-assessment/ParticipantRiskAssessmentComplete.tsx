"use client";

import React from "react";
import { format, parseISO, isValid } from "date-fns";
import A4PageWrapper from "./A4PageWrapper";
import dynamic from "next/dynamic";

const AnnexurePDFViewer = dynamic(() => import("./AnnexurePDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 w-[794px] min-h-[400px] bg-white rounded-3xl shadow-md border border-gray-100 print:hidden">
      <div className="w-10 h-10 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-medium text-gray-600">Loading document pages...</p>
    </div>
  ),
});

// Unified date formatter
const formatDate = (value: string) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = parseISO(value);
    if (isValid(parsed)) {
      return format(parsed, "dd-MM-yyyy");
    }
  }
  return value || "N/A";
};

// PRAFooter component, pulling from settings API with sensible fallbacks
const PRAFooter: React.FC<{ settings: any }> = ({ settings }) => {
  return (
    <div className="flex justify-between text-xs px-2">
      <div>Website: {settings?.company_website || settings?.website || ''}</div>
      <div>{settings?.participant_risk_assessment || settings?.client_intake_form_id || ''}</div>
      <div>Review Date: {formatDate(settings?.review_date)}</div>
    </div>
  );
};

// RiskTablePaginated component for dynamic table chunking
const RiskTablePaginated: React.FC<{
  rows: any[];
  renderHeader: () => React.ReactNode;
  renderRow: (row: any, index: number) => React.ReactNode;
  availableHeight: number;
  rowHeight: number;
  settings: any;
  images: any;
}> = ({ rows, renderHeader, renderRow, availableHeight, rowHeight, settings, images }) => {

  const pages: any[][] = [];
  let currentRows: any[] = [];
  let currentHeight = 60; // Header height

  rows.forEach((row, index) => {
    if (currentHeight + rowHeight > availableHeight && currentRows.length > 0) {
      pages.push([...currentRows]);
      currentRows = [row];
      currentHeight = 60 + rowHeight; // Header + first row
    } else {
      currentRows.push(row);
      currentHeight += rowHeight;
    }
  });

  if (currentRows.length > 0) {
    pages.push(currentRows);
  }

  return (
    <>
      {pages.map((pageRows, pageIndex) => (
        <A4PageWrapper
          key={pageIndex}
          footer={<PRAFooter settings={settings} />}
        >
          <div className="flex flex-col h-full text-xs font-sans">
            {/* Logo */}
            <div className="flex justify-center pt-6 pb-4">
              <img
                src={images?.infinityLogo || "/infinity_logo.png"}
                alt="Infinity Supports WA logo"
                className="h-[60px] w-[150px] object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <table className="w-full border border-black border-collapse text-xs" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                {renderHeader()}
                <tbody>
                  {pageRows.map((row, index) => renderRow(row, index))}
                </tbody>
              </table>
            </div>
          </div>
        </A4PageWrapper>
      ))}
    </>
  );
};

const ParticipantRiskAssessmentComplete: React.FC<any> = ({
  formData,
  commonFieldsData,
  images,
  settings
}) => {

  const [annexuresList, setAnnexuresList] = React.useState<Array<{ name: string; url: string }>>([]);

  React.useEffect(() => {
    const list = formData?.annexures || (formData?.annexurePdf ? [{ name: formData.annexurePdfName || "annexure.pdf", data: formData.annexurePdf }] : []);
    const createdUrls: string[] = [];
    
    const newAnnexures = list.map((annex: any, idx: number) => {
      if (!annex.data) return null;
      try {
        const base64Data = annex.data.split(",")[1] || annex.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        createdUrls.push(url);
        return { name: annex.name || `annexure_${idx + 1}.pdf`, url };
      } catch (error) {
        console.error("Error creating PDF object URL for annexure:", annex.name, error);
        return null;
      }
    }).filter(Boolean) as Array<{ name: string; url: string }>;

    setAnnexuresList(newAnnexures);

    return () => {
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [formData?.annexures, formData?.annexurePdf, formData?.annexurePdfName]);

  // Common field mapping
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
    // Always prioritize current client details from database
    const mapped = commonFieldMapping?.[key];
    if (mapped && commonFieldsData?.[mapped]) {
      return String(commonFieldsData[mapped]);
    }

    // Only fallback to saved form data if DB doesn't have the value
    return formData?.[key] ? String(formData[key]) : "";
  };

  const isChecked = (fieldKey: string, value: string) => {
    const raw = formData?.[fieldKey];
    if (raw == null) return false;

    // Booleans
    if (typeof raw === 'boolean') {
      return (value.toLowerCase() === 'yes' && raw) || (value.toLowerCase() === 'no' && !raw);
    }

    // Normalize common truthy/falsey string/number values and trim spaces
    const normalized = (() => {
      const s = String(raw).trim().toLowerCase();
      if (["true", "1", "yes", "y"].includes(s)) return "yes";
      if (["false", "0", "no", "n"].includes(s)) return "no";
      return s; // already like 'yes'/'no' or other text
    })();

    return normalized === value.toLowerCase();
  };

  const isMultiChecked = (fieldKey: string, option: string) => {
    const fieldValue = formData?.[fieldKey];
    if (!fieldValue) return false;
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(option);
    }
    // Handle string values that might be comma-separated
    const fieldString = String(fieldValue);
    const optionsList = fieldString.split(',').map(s => s.trim());
    return optionsList.includes(option) || optionsList.some(val => option.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(option.toLowerCase()));
  };
  // Compute selected risk level preferring single source of truth
  const getSelectedRiskLevel = (): "Low" | "Moderate" | "High" | "Critical" | "" => {
    const sel = String(formData?.selectedRiskLevel || "");
    if (["low", "moderate", "high", "critical"].includes(sel.toLowerCase())) {
      return sel.charAt(0).toUpperCase() + sel.slice(1).toLowerCase() as any;
    }
    // Fallback to legacy booleans
    if (isChecked('riskLevelLow', 'yes')) return "Low";
    if (isChecked('riskLevelModerate', 'yes')) return "Moderate";
    if (isChecked('riskLevelHigh', 'yes')) return "High";
    if (isChecked('riskLevelCritical', 'yes')) return "Critical";
    return "";
  };


  // Format date helper
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || "N/A";
  };

  // ALL FORM SECTIONS - COMPLETE LIST
  const allFormSections = [
    // 1. PARTICIPANT DETAILS
    {
      type: "participant-details",
      height: 120, // Reduced to prevent overflow
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>PARTICIPANT DETAILS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold">NDIS Number:</td>
              <td className="border border-black p-1" colSpan={2}>{getValue("ndisNumber")}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Given name/s:</td>
              <td className="border border-black p-1">{getValue("givenNames")}</td>
              <td className="border border-black p-1"><strong>Family name:</strong> {getValue("familyName")}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Preferred name:</td>
              <td className="border border-black p-1">{getValue("preferredName")}</td>
              <td className="border border-black p-1"><strong>Date of birth:</strong> {getValue("dob")}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Address:</td>
              <td className="border border-black p-1">{getValue("address")}</td>
              <td className="border border-black p-1"><strong>Phone No:</strong> {getValue("phoneNumber")}</td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Preferred contact method:</td>
              <td className="border border-black p-1">{getValue("preferredContact")}</td>
              <td className="border border-black p-1"><strong>Email:</strong> {getValue("email")}</td>
            </tr>
          </tbody>
        </table>
      )
    },

    // 2. MEDICAL CONDITIONS
    {
      type: "medical-conditions",
      height: (() => {
        // Calculate dynamic height based on number of filled medical condition rows
        let filledCount = 0;
        for (let i = 1; i <= 10; i++) {
          const specify = getValue(`medicalSpecify${i}`);
          const effect = getValue(`medicalEffect${i}`);
          const treatment = getValue(`medicalTreatment${i}`);
          if (specify || effect || treatment) filledCount++;
        }
        if (filledCount === 0) filledCount = 1; // At least one empty row
        // Header (60px) + rows (30px each) + spacing
        return 60 + (filledCount * 30);
      })(),
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>KNOWN MEDICAL CONDITIONS OR ALLERGIES</th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2 w-1/3">Specify</th>
              <th className="border border-black p-2 w-1/3">Effect</th>
              <th className="border border-black p-2 w-1/3">Treatment</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filledRows = [];
              for (let i = 1; i <= 10; i++) { // Check up to 10 possible rows
                const specify = getValue(`medicalSpecify${i}`);
                const effect = getValue(`medicalEffect${i}`);
                const treatment = getValue(`medicalTreatment${i}`);

                if (specify || effect || treatment) {
                  filledRows.push(
                    <tr key={i}>
                      <td className="border border-black p-1">{specify}</td>
                      <td className="border border-black p-1">{effect}</td>
                      <td className="border border-black p-1">{treatment}</td>
                    </tr>
                  );
                }
              }

              // If no rows have data, show at least one empty row for structure
              if (filledRows.length === 0) {
                filledRows.push(
                  <tr key="empty">
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                    <td className="border border-black p-1">&nbsp;</td>
                  </tr>
                );
              }

              return filledRows;
            })()}
          </tbody>
        </table>
      )
    },

    // 3. EMERGENCY CONTACTS
    {
      type: "emergency-contact",
      height: 50, // Reduced
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>EMERGENCY CONTACTS / CARER / GUARDIAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold w-1/3">Name/s:</td>
              <td className="border border-black p-1 font-bold w-1/3">Phone:</td>
              <td className="border border-black p-1 font-bold w-1/3">Email:</td>
            </tr>
            <tr>
              <td className="border border-black p-1">{getValue("emergencyContactName")}</td>
              <td className="border border-black p-1">{getValue("emergencyContactPhone")}</td>
              <td className="border border-black p-1">{getValue("emergencyContactEmail")}</td>
            </tr>
          </tbody>
        </table>
      )
    },

    // 4. PERSONS INVOLVED
    {
      type: "persons-involved",
      height: 60, // Reduced
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>PERSONS INVOLVED IN RISK ASSESSMENT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 font-bold">Was the participant involved in the assessment?</td>
              <td className="border border-black p-2">
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={formData?.participantInvolved === "Yes"} readOnly />
                    <span className="text-xs">Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={formData?.participantInvolved === "No"} readOnly />
                    <span className="text-xs">No</span>
                  </label>
                </div>
              </td>
              <td className="border border-black p-2">
                <strong>Reason:</strong> {getValue("participantInvolved") === "No" ? getValue("participantInvolvedReason") : ""}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}><strong>Staff Involved:</strong> {getValue("staffInvolved")}</td>
            </tr>
            <tr>
              <td className="border border-black p-2" colSpan={3}><strong>Others Involved:</strong> {getValue("othersInvolved")}</td>
            </tr>
          </tbody>
        </table>
      )
    }
  ];

  // Medication respiratory depression is now included in the INDIVIDUAL RISK ASSESSMENTS table as Question 14

  // 6. MEDICATION MANAGEMENT WITH INSTRUCTIONS
  allFormSections.push({
    type: "medication-management-detailed",
    height: 200, // Reduced from 300
    content: () => (
      <div>
        <h2 className="text-center text-lg font-semibold mb-4 leading-tight uppercase">MEDICATION</h2>
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-[#a9b9d9]">
              <th className="border border-black p-3 text-left font-semibold">
                Management of Medication
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-3">
                <p className="mb-4">
                  Should any of the below be marked as <strong>YES</strong>, refer to
                  <strong> Form 24. Management of Medication</strong>
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2">Prompt Medication Required</p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('promptMedicationRequired', 'yes')}
                          readOnly
                        />
                        <span>YES</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('promptMedicationRequired', 'no')}
                          readOnly
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2">Assistance of Medication Required</p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('assistanceMedicationRequired', 'yes')}
                          readOnly
                        />
                        <span>YES</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('assistanceMedicationRequired', 'no')}
                          readOnly
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2">Administration of Medication Required</p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('adminMedicationRequired', 'yes')}
                          readOnly
                        />
                        <span>YES</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('adminMedicationRequired', 'no')}
                          readOnly
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2">NO – This participant does not require medication management</p>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('noMedicationRequired', 'yes')}
                          readOnly
                        />
                        <span>YES</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox w-3 h-3"
                          checked={isChecked('noMedicationRequired', 'no')}
                          readOnly
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  });

  // Participant Dependency and Health-Safety Risk Assessment (informational)
  allFormSections.push({
    type: "participant-dependency-health-safety",
    height: 220,
    content: () => (
      <div className="text-xs">
        <div className="font-bold mb-2">Participant Dependency and Health-Safety Risk Assessment Table</div>
        <div className="font-semibold mb-1">Steps to Use the Extended Table:</div>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            <span className="font-semibold">Assessment:</span> Evaluate both the level of reliance on your services and the potential impact on health and safety for each participant.
          </li>
          <li>
            <span className="font-semibold">Categorisation:</span> Assign the appropriate risk level based on the combined assessment of reliance and health-safety impact.
          </li>
          <li>
            <span className="font-semibold">Mitigation:</span> Develop strategies and contingency plans that address not only the level of reliance but also the specific health and safety concerns identified for each risk level.
          </li>
          <li>
            <span className="font-semibold">Regular Review:</span> Continuously review and update the risk assessment and mitigation strategies, considering any changes in participants' needs and potential risks.
          </li>
          <li>
            <span className="font-semibold">Communication:</span> Ensure that all stakeholders, including participants, families, and your team, understand the dual assessment of reliance and health-safety impact, as well as the corresponding mitigation plans.
          </li>
          <li>
            <span className="font-semibold">Emergency Planning:</span> For participants with higher risk levels, develop emergency plans that outline steps to be taken in case of service disruptions or unexpected events.
          </li>
        </ol>
        <p className="mt-2">
          By considering both the participants' level of reliance on the services and the potential consequences for their health and safety in case of disruptions, we can create a more comprehensive risk assessment framework that prioritises their well-being. Therefore, prioritising the health and safety of participants is a fundamental responsibility that promotes their well-being, respects their rights, and contributes to the overall success and sustainability of various activities and endeavours, and ultimately, the level of support the provider is required to provide the participant during their care.
        </p>
      </div>
    )
  });

  // 7. RISK LEVEL - SHOW ONLY SELECTED LEVEL
  allFormSections.push({
    type: "risk-level-selected",
    height: 160,
    content: () => {
      const selected = getSelectedRiskLevel();
      if (!selected) return <div></div>;
      const level = selected;
      const meta: Record<string, any> = {
        Low: {
          titleClass: "text-green-600",
          description: "Participants have a low reliance on provider services to meet daily living needs.",
          criteria: "Participants can independently perform most daily living activities without assistance. Any disruptions in services would have minimal impact on their overall well-being.",
          impact: "Disruptions in services would have minimal impact on participants' health and safety, as they can manage most activities independently.",
        },
        Moderate: {
          titleClass: "text-blue-700",
          description: "Participants have a moderate reliance on provider services for certain daily living needs.",
          criteria: "Participants can perform some daily activities independently but rely on the provider for specific tasks such as transportation, meal preparation, or medication management. A disruption in services would moderately impact their well-being.",
          impact: "Disruptions in services could moderately impact participants' health and safety, particularly for tasks they rely on the provider for.",
        },
        High: {
          titleClass: "text-yellow-700",
          description: "Participants have a high reliance on provider services to meet essential daily living needs.",
          criteria: "Participants require significant assistance from the provider for activities of daily living, including personal care, mobility, meal preparation, and medication management. A disruption in services would have a significant impact on their overall well-being and quality of life.",
          impact: "Disruptions in services would significantly impact participants' health and safety, as they rely heavily on the provider for essential tasks.",
        },
        Critical: {
          titleClass: "text-red-600",
          description: "Participants have a critical reliance on provider services for all daily living needs.",
          criteria: "Participants are entirely dependent on the provider for all activities of daily living, including personal care, mobility, communication, medical support, and more.",
          impact: "Disruptions in services would pose a critical threat to participants' health and safety.",
        }
      };

      const m = meta[level];
      return (
        <table className="w-full border border-black border-collapse text-xs">
          <thead className="bg-gray-300 font-semibold">
            <tr>
              <th className="border border-black p-2 text-left w-20">Selected Risk Level</th>
              <th className="border border-black p-2 text-left">Description</th>
              <th className="border border-black p-2 text-left">Criteria</th>
              <th className="border border-black p-2 text-left">Impact on Health-Safety</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`border border-black p-2 font-semibold ${m.titleClass}`}>{level}</td>
              <td className="border border-black p-2">{m.description}</td>
              <td className="border border-black p-2">{m.criteria}</td>
              <td className="border border-black p-2">{m.impact}</td>
            </tr>
          </tbody>
        </table>
      );
    }
  });

  // 8. RISK ASSESSMENT MATRIX
  allFormSections.push({
    type: "risk-matrix",
    height: 400,
    content: () => (
      <div>
        <p className="text-xs uppercase tracking-wider text-black-700 font-semibold text-center mb-2">
          Risk Assessment Matrix
        </p>
        <div className="flex justify-center">
          <img
            src="/home_risk_assessment.png"
            alt="Risk Assessment Matrix"
            style={{
              width: '100%',
              maxHeight: '380px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    )
  });

  // 9a. EMERGENCY CONTACT NUMBERS
  allFormSections.push({
    type: "emergency-contact-numbers",
    height: 100,
    content: () => (
      <table className="w-full border border-black border-collapse text-xs">
        <thead>
          <tr>
            <th colSpan={3} className="border border-black px-2 py-1 text-left font-bold bg-gray-300">
              Emergency Contact Numbers
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 w-1/3">Police</td>
            <td className="border border-black px-2 py-1 text-center" colSpan={2} rowSpan={3}>
              <img src="/participant_risk_assessment_emergency.png" alt="000 Emergency" className="max-h-[60px] mx-auto" />
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Fire</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Ambulance</td>
          </tr>
        </tbody>
      </table>
    )
  });

  // 9b. UTILITIES
  allFormSections.push({
    type: "utilities",
    height: 120,
    content: () => (
      <table className="w-full border border-black border-collapse text-xs">
        <thead>
          <tr>
            <th colSpan={3} className="border border-black px-2 py-1 text-left font-bold bg-gray-300">
              Utilities
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 w-1/3">Electricity Authority</td>
            <td className="border border-black px-2 py-1">Western Power</td>
            <td className="border border-black px-2 py-1">13 13 51</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Water Authority</td>
            <td className="border border-black px-2 py-1">Water Corp</td>
            <td className="border border-black px-2 py-1">13 13 75</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Gas Authority</td>
            <td className="border border-black px-2 py-1">ATCO Gas</td>
            <td className="border border-black px-2 py-1">13 13 52</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">State Emergency</td>
            <td className="border border-black px-2 py-1">SES</td>
            <td className="border border-black px-2 py-1">13 25 00</td>
          </tr>
        </tbody>
      </table>
    )
  });

  // 10a. OTHER KEY CONTACTS
  allFormSections.push({
    type: "other-key-contacts",
    height: 300,
    content: () => (
      <table className="w-full border border-black border-collapse text-xs">
        <thead>
          <tr>
            <th colSpan={3} className="border border-black px-2 py-1 text-left font-bold bg-gray-300">
              Other Key Contacts
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="w-1/3 border border-black px-2 py-1">Health Direct</td>
            <td className="border border-black px-2 py-1" colSpan={2}>1800 022 222</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Poisons Line</td>
            <td className="border border-black px-2 py-1" colSpan={2}>13 11 26</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Lifeline (24 hours crisis counselling)</td>
            <td className="border border-black px-2 py-1" colSpan={2}>13 11 14</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Beyond Blue</td>
            <td className="border border-black px-2 py-1" colSpan={2}>1300 22 4636</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Crisis Care</td>
            <td className="border border-black px-2 py-1" colSpan={2}>1800 199 008</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">NDIS</td>
            <td className="border border-black px-2 py-1" colSpan={2}>1800 800 110</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">Mental Health Emergency Response Line</td>
            <td className="border border-black px-2 py-1" colSpan={2}>
              1300 555 788 (Perth)<br />1300 676 822 (Peel)
            </td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 align-top" rowSpan={5}>
              <div className="font-bold mb-1">Advocacy Services</div>
              <div className="italic text-[10px]">(Infinity Supports WA does not recommend any particular advocacy provider. You are free to choose any service that best suits your needs.)</div>
            </td>
            <td className="border border-black px-2 py-1" colSpan={2}>Advocare (Aged &amp; Disability Advocacy) : 1800 655 566</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1" colSpan={2}>People With Disabilities WA (PWdWA) : 1800 193 331</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1" colSpan={2}>Developmental Disability WA (DDWA) : (08) 9420 7203</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1" colSpan={2}>Advocacy WA : (08) 9474 6222</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1" colSpan={2}>Mental Health Advocacy Service : 1800 999 057</td>
          </tr>
        </tbody>
      </table>
    )
  });

  // 10b. TYPE OF SUPPORT PUT IN PLACE - INFINITY PROCESS
  allFormSections.push({
    type: "infinity-support-type",
    height: 150,
    content: () => (
      <table className="w-full border border-black border-collapse text-xs">
        <tbody>
          <tr className="bg-gray-300 font-bold text-xs">
            <td className="border border-black px-2 py-1" colSpan={3}>
              Type of support to be put in place in the event of an emergency or disaster and how we will support the participant (based on the Service agreement)
            </td>
          </tr>
          <tr className="font-semibold">
            <td className="w-1/3 border border-black px-2 py-1">Emergency</td>
            <td className="border border-black px-2 py-1" colSpan={2}>
              Support provided to the participants in the event of an emergency
            </td>
          </tr>
          <tr className="align-top">
            <td className="w-1/3 border border-black px-2 py-1">Infinity is unable to support for extended period</td>
            <td className="border border-black px-2 py-1" colSpan={2}>
              Infinity will assist the client/family to source alternative providers
            </td>
          </tr>
          <tr className="align-top">
            <td className="w-1/3 border border-black px-2 py-1">Client taken ill during support.</td>
            <td className="border border-black px-2 py-1" colSpan={2}>
              Call 000, Call family, take to nearest ED
            </td>
          </tr>
          <tr className="align-top">
            <td className="w-1/3 border border-black px-2 py-1">Closure of business</td>
            <td className="border border-black px-2 py-1" colSpan={2}>
              Infinity will assist the client/family to source alternative providers
            </td>
          </tr>
          <tr className="align-top">
            <td className="w-1/3 border border-black px-2 py-1">Pandemic</td>
            <td className="border border-black px-2 py-1" colSpan={2}>
              Client will reside with family, have essential supports and daily phone check-ins
            </td>
          </tr>
        </tbody>
      </table>
    )
  });

  // 10c. PARTICIPANT SPECIFIC
  allFormSections.push({
    type: "participant-specific-emergencies",
    height: 150,
    content: () => {
      const hasEmergencyPlans = Array.from({ length: 10 }, (_, i) => i + 1).some(
        (num) => getValue(`participantSpecificEmergencyScenario${num}`) || getValue(`participantSpecificEmergencySupport${num}`)
      );

      if (!hasEmergencyPlans) return <></>;

      return (
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            <tr className="bg-gray-300 font-bold text-xs">
              <td className="border border-black px-2 py-1" colSpan={3}>
                Participant Specific Emergencies
              </td>
            </tr>
            <tr className="font-semibold bg-gray-100">
              <td className="w-1/3 border border-black px-2 py-1">Emergency</td>
              <td className="border border-black px-2 py-1" colSpan={2}>
                Plan
              </td>
            </tr>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
              const scenario = getValue(`participantSpecificEmergencyScenario${num}`);
              const support = getValue(`participantSpecificEmergencySupport${num}`);
              if (!scenario && !support) return null;
              return (
                <tr key={num} className="align-top">
                  <td className="w-1/3 border border-black px-2 py-1 font-semibold">{scenario || "N/A"}</td>
                  <td className="border border-black px-2 py-1" colSpan={2}>{support || "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  });

  // Continue with more sections in next part...

  // Add all remaining sections
  const riskQuestions = [
    { key: "risk1", label: "Is the client able to open door?", questionNum: 1 },
    { key: "risk2", label: "Is there a safe evacuation point at your home?", questionNum: 2, commentLabel: "Location" },
    { key: "risk3", label: "Is the service to be provided at night or outside of normal working hours?", questionNum: 3 },
    { key: "risk4", label: "Are there the any expressive language concerns?", questionNum: 4 },
    { key: "risk5", label: "Has relevant medical history been communicated including potential risk situations?", questionNum: 5 },
    { key: "risk6", label: "Does the Participant have any road safety skills?", questionNum: 6 },
    { key: "risk7", label: "Can the participant travel in an unmodified vehicle?", questionNum: 7 },
    { key: "risk8", label: "Can the participant use public transport?", questionNum: 8 },
    { key: "risk9", label: "Is the client known to be affected by crowds?", questionNum: 9 },
    { key: "noiseSensitive", label: "Is the client affected by noises or sudden sounds?", questionNum: 10, commentKey: "noiseSensitiveComment" },
    { key: "familyBehavioralHistory", label: "Is there a history of any family members with behavioural issues?", questionNum: 11, commentKey: "familyBehavioralHistoryComment" },
    { key: "behaviorPractitionerInvolved", label: "Is there a behaviour practitioner involved?", questionNum: 12, commentKey: "behaviorPractitionerInvolvedComment" },
    { key: "mobilityIssues", label: "Does the client have mobility issues? (e.g., wheelchair or other?)", questionNum: 13, commentKey: "mobilityIssuesComment" },
    { key: "showeringToiletingHazards", label: "Have hazards associated with showering, sponging and toileting been considered? (e.g., manual handling/ slips trips and falls/ biological hazards/ humidity, etc.)", questionNum: 14, commentKey: "showeringToiletingHazardsComment" },
    { key: "medicationRiskDepression", label: "Does the participant take any of the following medications that can cause Respiratory Depression? (Benzodiazepines, Opioids, Polypharmacy, Psychotropic polypharmacy, Combination of any of the above medications)", questionNum: 15, commentKey: "medicationRiskDepressionComment", isSpecial: true }
  ];

  // Add risk table as single section - let measured pagination handle splitting naturally
  const riskTableSections = [{
    type: "risk-table",
    height: (riskQuestions.length * 50) + 80, // All 14 questions together
    questions: riskQuestions
  }];

  // Add remaining sections
  allFormSections.push(
    {
      type: "household-meeting-point",
      height: 100,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={2}>Participant household safe meeting point</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 font-bold w-1/4">Address:</td>
              <td className="border border-black p-2">{getValue("householdSafeAddress")}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Description:</td>
              <td className="border border-black p-2">{getValue("householdSafeDesc")}</td>
            </tr>
          </tbody>
        </table>
      )
    },
    {
      type: "risk-discussion-header",
      height: 50,
      content: () => (
        <p className="text-xs font-bold text-center mb-4 uppercase">
          If risk is identified, please discuss with the manager
        </p>
      )
    },
    {
      type: "controls-table",
      height: 240,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={4}>CONTROLS TABLE</th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2">Issue</th>
              <th className="border border-black p-2">Score</th>
              <th className="border border-black p-2">Control</th>
              <th className="border border-black p-2">Person Responsible</th>
            </tr>
          </thead>
          <tbody>
            {getFilledControlRows().map((row, index) => (
              <tr key={index}>
                <td className="border border-black p-2 align-top break-words" style={{ minHeight: '40px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <div className="whitespace-normal">{row.issue || '\u00A0'}</div>
                </td>
                <td className="border border-black p-2 align-top text-center">{row.score || '\u00A0'}</td>
                <td className="border border-black p-2 align-top break-words" style={{ minHeight: '40px', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <div className="whitespace-normal">{row.control || '\u00A0'}</div>
                </td>
                <td className="border border-black p-2 align-top">{row.person || '\u00A0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    {
      type: "communication-modes",
      height: 150,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={2}>Mode of Communication assessment for non-verbal participants (e.g., Sign language, pictures, body movement)</th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2">Possible scenarios of concern</th>
              <th className="border border-black p-2">Mode of communication</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((num) => (
              <tr key={num}>
                <td className="border border-black p-1 align-top">{getValue(`scenario${num}`)}</td>
                <td className="border border-black p-1 align-top">{getValue(`mode${num}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
  );

  // Get filled control rows for separate rendering
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
        filledRows.push({ issue, score, control, person, index: i });
      }
    }
    // Ensure at least some rows so the table height can be measured for pagination
    if (filledRows.length === 0) {
      for (let j = 0; j < 6; j++) filledRows.push({ issue: "", score: "", control: "", person: "" });
    }
    return filledRows;
  };

  const filledControlRows = getFilledControlRows();

  // Calculate dynamic height for each control row based on content
  const calculateControlRowHeight = (row: any) => {
    const issueLength = (row.issue || '').length;
    const controlLength = (row.control || '').length;

    // Base height for table cell (padding + borders) - more conservative
    const baseHeight = 60; // More padding to prevent clipping

    // Calculate lines needed based on content length - more conservative estimates
    const charsPerLine = 45; // Fewer chars per line (accounts for wrapping in narrow columns)
    const lineHeight = 20; // Larger line height for readability

    const issueLines = Math.max(1, Math.ceil(issueLength / charsPerLine));
    const controlLines = Math.max(1, Math.ceil(controlLength / charsPerLine));

    // Use the maximum lines from issue or control columns with margin
    const maxLines = Math.max(issueLines, controlLines) + 1; // Add buffer line
    const contentHeight = maxLines * lineHeight;

    return baseHeight + contentHeight;
  };

  // Split controls table rows into page chunks
  const controlsTablePages = React.useMemo(() => {
    const headerHeight = 80; // Table header height
    const maxPageHeight = 600; // Max content per page (700px - 100px for footer/logo)
    const pages: any[][] = [];
    let currentRows: any[] = [];
    let currentHeight = headerHeight;

    filledControlRows.forEach((row, index) => {
      const rowHeight = calculateControlRowHeight(row);

      // If adding this row would exceed page height and we have rows, start new page
      if (currentHeight + rowHeight > maxPageHeight && currentRows.length > 0) {
        pages.push([...currentRows]);
        currentRows = [row];
        currentHeight = headerHeight + rowHeight; // New page starts with header + first row
      } else {
        currentRows.push(row);
        currentHeight += rowHeight;
      }
    });

    // Add last page if it has rows
    if (currentRows.length > 0) {
      pages.push(currentRows);
    }

    return pages;
  }, [filledControlRows, calculateControlRowHeight]);

  // Render a controls table page with its rows
  const renderControlsTablePage = (rows: any[], isFirstPage: boolean) => (
    <table className="w-full border border-black border-collapse text-xs" style={{ tableLayout: 'fixed', width: '100%' }}>
      {/* Use colgroup to enforce fixed column widths across all rows */}
      <colgroup>
        <col style={{ width: '35%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '35%' }} />
        <col style={{ width: '20%' }} />
      </colgroup>
      {isFirstPage && (
        <>
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={4}>CONTROLS TABLE</th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2">Issue</th>
              <th className="border border-black p-2">Score</th>
              <th className="border border-black p-2">Control</th>
              <th className="border border-black p-2">Person Responsible</th>
            </tr>
          </thead>
        </>
      )}
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td className="border border-black p-2 align-top" style={{ wordWrap: 'break-word' }}>{row.issue || '\u00A0'}</td>
            <td className="border border-black p-2 align-top text-center">{row.score || '\u00A0'}</td>
            <td className="border border-black p-2 align-top" style={{ wordWrap: 'break-word' }}>{row.control || '\u00A0'}</td>
            <td className="border border-black p-2 align-top">{row.person || '\u00A0'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Convert controls table pages into sections
  const controlsTableSections = controlsTablePages.map((rows, index) => ({
    type: "controls-table-page",
    height: index === 0 ? 200 + calculateControlRowHeight(rows[0]) * rows.length : 100 + calculateControlRowHeight(rows[0]) * rows.length,
    rows,
    isFirstPage: index === 0
  }));

  // Compose final section order exactly as confirmed
  const byType = (t: string) => allFormSections.find(s => s.type === t);
  const sectionsOrdered: any[] = [
    byType('participant-details'),
    byType('medical-conditions'),
    byType('emergency-contact'),
    byType('persons-involved'),
    // Risk Assessment (Q1–14 including medication question) split across pages
    ...riskTableSections,
    byType('medication-management-detailed'),
    byType('participant-dependency-health-safety'),
    byType('risk-level-selected'),
    // Manager notice and Controls Table (split into pages) before the matrix
    byType('risk-discussion-header'),
    ...controlsTableSections,
    byType('risk-matrix'),
    // 1. What to do in an emergency
    {
      type: 'emergency-procedures',
      height: 360,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <tbody>
            <tr className="bg-gray-300 font-bold text-left">
              <td className="border border-black p-2 font-bold" colSpan={2}>What to do in an Emergency</td>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <td className="border border-black p-2 font-semibold">Evacuation Procedures</td>
              <td className="border border-black p-2 font-semibold">FIRE</td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>Upon hearing the alarm or when the situation requires the participant to leave the premises</li>
                  <li>Prepare to evacuate</li>
                  <li>Get your environment ready to be left unattended. Shut down electrical/electronic devices; turn off gas if safe to do so.</li>
                  <li>For fire, close the doors as you go – do not lock them. In the case of a bomb threat, leave doors open. </li>
                  <li>Assist participant in immediate danger.</li>
                  <li>Leave the building via the nearest safe route. </li>
                  <li>Obey all directions from emergency services.</li>
                  <li>Move calmly to assembly point
                  </li>
                  <li>Follow closely the instructions of emergency services personnel and campus wardens.</li>
                  <li>Wait for the OK to re-enter the building</li>
                </ul>
              </td>
              <td className="border border-black p-2 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ring 000 and provide details of the fire then ring supervisor.</li>
                  <li>Assist any person in immediate danger only if safe to do so.  </li>
                  <li>If safe to do so, close doors to minimise spread of fire. </li>
                  <li>Attack the fire only if safe to do so</li>
                  <li>Contact the nearest warden and follow their instructions (if applicable)</li>
                  <li>Assist with evacuation of participants with mobility issues </li>
                  <li>Move to the evacuation location in plan and stay there until all clear has been given. </li>
                  <li>Follow closely the instructions of emergency services personnel and campus warden.</li>
                </ul>
              </td>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <td className="border border-black p-2">Medical Emergency</td>
              <td className="border border-black p-2">Civil Disturbance</td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>Assess the situation</li>
                  <li>Do not move a participant unless they are exposed to a life-threatening situation.</li>
                  <li>In emergency situations contact the ambulance service by dialling 000 then ring supervisor.</li>
                  <li>Arrange for the ambulance to be met.</li>
                  <li>Remain with the participant and administer first aid as appropriate until assistance arrives</li>
                  <li>Follow closely the instructions of emergency services personnel.</li>
                </ul>
              </td>
              <td className="border border-black p-2 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep well clear of the disturbance and do not say or do anything that may encourage irrational behaviour.</li>
                  <li>Consider locking down the building to prevent unauthorised entry.</li>
                  <li>Follow closely the instructions of emergency services personnel and campus wardens.</li>
                  <li>Evacuate the building only if instructed to do so by emergency services personnel or campus warden</li>
                </ul>
              </td>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <td className="border border-black p-2">Extreme Weather</td>
              <td className="border border-black p-2">Personal Preparation</td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>Keep participant informed of situation</li>
                  <li>Move away from windows and turn off electrical appliances to ensure safety</li>
                  <li>Follow closely the instructions of emergency services personnel</li>
                  <li>Evacuate the building only if instructed to do so by emergency services personnel</li>
                  <li>Keep in contact with supervisor and follow their instructions</li>
                </ul>
              </td>
              <td className="border border-black p-2 align-top">
                <ul className="list-disc list-inside space-y-1">
                  <li>Know the location of emergency exits in your building.</li>
                  <li>Plan an escape route from the premises to safe environment. </li>
                  <li>Identify and familiarise yourself evacuation point or a safe location. </li>
                  <li>Familiarise yourself with location of any break glass fire alarms.</li>
                  <li>Note location of fire extinguishers. </li>
                  <li>Familiarise yourself with the identity and location of the first aid kits. </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      )
    },
    // 2. Emergency Contact Numbers
    byType('emergency-contact-numbers'),
    // 3. Utilities
    byType('utilities'),
    // 4. Other key contacts
    byType('other-key-contacts'),
    // 5. Type of support put in place - Infinity process
    byType('infinity-support-type'),
    // 6. Participant safe meeting point
    byType('household-meeting-point'),
    // 7. Mode of communication
    byType('communication-modes'),
    // 8. Participant Specific
    byType('participant-specific-emergencies'),
    // Signatures & Review
    {
      type: 'signatures-review',
      height: 300,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold">
              <th className="border border-black p-2" colSpan={4}>Authorisation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 w-1/4">Authorised by:</td>
              <td className="border border-black p-2 w-1/4">{getValue('authorisedBy')}</td>
              <td className="border border-black p-2 w-1/4">Role:</td>
              <td className="border border-black p-2 w-1/4">{getValue('role')}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Signature:</td>
              <td className="border border-black p-2">
                {(() => {
                  const sig = String(getValue('signature') || '');
                  const isImg = sig.startsWith('data:image') || sig.startsWith('http');
                  return isImg ? (
                    <img src={sig} alt="Signature" style={{ maxHeight: 56, maxWidth: '100%', objectFit: 'contain' }} />
                  ) : sig || ' ';
                })()}
              </td>
              <td className="border border-black p-2">Date:</td>
              <td className="border border-black p-2">{formatDate(getValue('signatureDate'))}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Participant / Guardian Signature:</td>
              <td className="border border-black p-2">
                {(() => {
                  const gsig = String(getValue('guardianSignature') || '');
                  const isImg = gsig.startsWith('data:image') || gsig.startsWith('http');
                  return isImg ? (
                    <img src={gsig} alt="Guardian Signature" style={{ maxHeight: 56, maxWidth: '100%', objectFit: 'contain' }} />
                  ) : gsig || ' ';
                })()}
              </td>
              <td className="border border-black p-2">Date:</td>
              <td className="border border-black p-2">{formatDate(getValue('guardianDate'))}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 align-top">Is a copy supplied to the participant?</td>
              <td className="border border-black p-2 align-top">
                <div className="flex flex-col items-start gap-1">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={isChecked('copySupplied', 'yes')} readOnly className="w-3 h-3" />YES</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={isChecked('copySupplied', 'no')} readOnly className="w-3 h-3" />NO</label>
                </div>
              </td>
              <td className="border border-black p-2 align-top">Copy placed on file?
                <div className="mt-1 flex flex-col items-start gap-1">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={isChecked('copyOnFile', 'yes')} readOnly className="w-3 h-3" />YES</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" checked={isChecked('copyOnFile', 'no')} readOnly className="w-3 h-3" />NO</label>
                </div>
              </td>
              <td className="border border-black p-2 align-top"><strong>Date for Review:</strong> {formatDate(getValue('reviewDate'))}</td>
            </tr>
          </tbody>
        </table>
      )
    }
    // Signatures & Review could be appended here if implemented
  ].filter(Boolean);

  const allSections = sectionsOrdered;

  // ---- Measured pagination (Client Intake style) ----
  const sectionRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = React.useState<number[] | null>(null);
  const [pages, setPages] = React.useState<any[][]>([]);

  // Render once offscreen to measure true heights
  React.useEffect(() => {
    const heights = sectionRefs.current.map((el) => (el ? el.getBoundingClientRect().height : 0));
    if (heights.length === allSections.length) {
      setMeasuredHeights(heights);
    }
  }, [allSections.length]);

  // Pack sections into A4 pages based on measured heights
  React.useEffect(() => {
    if (!measuredHeights) return;
    // Account for logo (60px) and spacing on each page
    const maxPageHeight = 950; // Available content height (1123px A4 - logo - padding - footer space)
    const finalPages: any[][] = [];
    let current: any[] = [];
    let used = 0;
    allSections.forEach((section, idx) => {
      const h = Math.ceil(measuredHeights[idx] || 0);
      if (used + h > maxPageHeight && current.length > 0) {
        finalPages.push(current);
        current = [section];
        used = h;
      } else {
        current.push(section);
        used += h;
      }
    });
    if (current.length > 0) finalPages.push(current);
    setPages(finalPages);
  }, [measuredHeights]);

  // Group sections into pages with proper height budget (like Client Intake Form)
  const groupSectionsByHeight = () => {
    const maxPageHeight = 700; // Standardized budget; header/footer already accounted
    const pages: any[] = [];
    let currentPage: any[] = [];
    let currentHeight = 0;

    allSections.forEach(section => {
      if (currentHeight + section.height > maxPageHeight && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [section];
        currentHeight = section.height;
      } else {
        currentPage.push(section);
        currentHeight += section.height;
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  // Don't calculate initialPages anymore - rely on measured pagination
  // const initialPages = groupSectionsByHeight();

  // Render risk table - render headers only once for first occurrence, then just data rows
  const renderRiskTable = (questions: any[], showHeader: boolean = true) => (
    <table className="w-full border border-black border-collapse text-xs">
      {showHeader && (
        <>
          <thead>
            <tr>
              <th className="border border-black w-[20%]"></th>
              <th className="border border-black text-center font-bold p-2" colSpan={4}>
                INDIVIDUAL RISK ASSESSMENTS
              </th>
            </tr>
            <tr className="bg-gray-300 font-semibold">
              <th className="border border-black p-2">No.</th>
              <th className="border border-black p-2">Item</th>
              <th className="border border-black p-2 w-[10%] text-center">Y/N</th>
              <th className="border border-black p-2 w-[7%] text-center">Risk Rating</th>
              <th className="border border-black p-2 w-[20%]">Comments/Controls</th>
            </tr>
          </thead>
        </>
      )}
      <tbody>
        {questions.map((question) => {
          // Special handling for medication question (Q14)
          if (question.isSpecial && question.key === 'medicationRiskDepression') {
            const medOptions = ["Benzodiazepines", "Opioids", "Polypharmacy", "Psychotropic polypharmacy", "Combination of any of the above medications"];
            const selectedMeds = medOptions.filter(med => isMultiChecked(question.key, med));
            return (
              <tr key={question.key}>
                <td className="border border-black p-2 align-top">{question.questionNum}</td>
                <td className="border border-black p-2 align-top">
                  {/* Show question with medications in brackets - no checkboxes */}
                  <div className="text-sm">
                    Does the participant take any of the following medications that can cause Respiratory Depression?
                    <span className="text-black"> ({medOptions.join(', ')})</span>
                  </div>
                </td>
                <td className="border border-black p-2 align-top text-center">
                  <div className="flex flex-col items-start gap-1">
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={getValue(question.key)?.toLowerCase() === 'yes'} readOnly className="w-3 h-3" />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center space-x-1">
                      <input type="checkbox" checked={getValue(question.key)?.toLowerCase() === 'no'} readOnly className="w-3 h-3" />
                      <span>NO</span>
                    </label>
                  </div>
                </td>
                <td className="border border-black p-2 align-top text-center">{getValue(`${question.ratingKey || `${question.key}Rating`}`)}</td>
                <td className="border border-black p-2 align-top">
                  {getValue(question.commentKey || `${question.key}Comment`) || '\u00A0'}
                </td>
              </tr>
            );
          }

          // Standard question rendering
          return (
            <tr key={question.key}>
              <td className="border border-black p-2 align-top">{question.questionNum}</td>
              <td className="border border-black p-2 align-top">{question.label}</td>
              <td className="border border-black p-2 align-top text-center">
                <div className="flex flex-col items-start gap-1">
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={isChecked(question.key, 'yes')} readOnly className="w-3 h-3" />
                    <span>YES</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input type="checkbox" checked={isChecked(question.key, 'no')} readOnly className="w-3 h-3" />
                    <span>NO</span>
                  </label>
                </div>
              </td>
              <td className="border border-black p-2 align-top text-center">{getValue(`${question.ratingKey || `${question.key}Rating`}`)}</td>
              <td className="border border-black p-2 align-top">
                {question.commentLabel ? `${question.commentLabel}: ` : ''}
                {getValue(`${question.commentKey || `${question.key}Comment`}`)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-12 bg-gray-100 py-8 flex flex-col items-center">
      {/* Offscreen measurement container */}
      <div style={{ position: 'absolute', visibility: 'hidden', top: -99999, left: -99999 }}>
        {allSections.map((section: any, i: number) => (
          <div key={`measure-${i}`} ref={(el) => { if (el) sectionRefs.current[i] = el; }} style={{ width: 794 }}>
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              {section.type === 'risk-table' ? renderRiskTable(section.questions || [], true)
                : section.type === 'controls-table-page' ? renderControlsTablePage(section.rows || [], section.isFirstPage || false)
                  : section.content?.()}
            </div>
          </div>
        ))}
      </div>

      {(pages.length > 0 ? pages : []).map((pageSections, index) => (
        <A4PageWrapper
          key={index}
          footer={<PRAFooter settings={settings} />}
          fixedHeight={false}
        >
          <div className="flex flex-col h-full text-xs font-sans">
            {/* Standardized Logo */}
            <div className="flex justify-center pt-6 pb-4">
              <img
                src={images?.infinityLogo || "/infinity_logo.png"}
                alt="Infinity Supports WA logo"
                className="h-[60px] w-[150px] object-contain"
              />
            </div>

            {/* Title (only on first page) */}
            {index === 0 && (
              <div className="text-center mb-4">
                <h2 className="text-center text-lg font-semibold mb-4 leading-tight uppercase">
                  Participant Risk Assessment and Disaster Management Plan
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col space-y-4" style={{ pageBreakInside: 'auto' }}>
              {pageSections.map((section: any, sectionIndex: number) => (
                <div
                  key={sectionIndex}
                  style={{
                    pageBreakInside: 'auto',
                    breakInside: 'avoid',
                    maxHeight: 'none',
                    overflow: 'visible'
                  }}
                >
                  {section.type === "risk-table" ? (
                    renderRiskTable(section.questions || [], true)
                  ) : section.type === "controls-table-page" ? (
                    renderControlsTablePage(section.rows || [], section.isFirstPage || false)
                  ) : (
                    section.content?.()
                  )}
                </div>
              ))}
            </div>
          </div>
        </A4PageWrapper>
      ))}

      {annexuresList.length > 0 && (
        <div className="w-full max-w-[794px] mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 animate-fade-in mt-6 print:hidden flex flex-col gap-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 border-b border-gray-100 pb-3">
            <span className="text-xl">📎</span> Attached Annexures / Appendices
          </h3>
          <div className="flex flex-col gap-4">
            {annexuresList.map((annex, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-indigo-50/20 rounded-2xl border border-indigo-100/50 hover:bg-indigo-50/40 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📄</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{annex.name || `annexure_${index + 1}.pdf`}</p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = annex.url;
                    link.download = annex.name || `annexure_${index + 1}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {annexuresList.map((annex, index) => (
        <AnnexurePDFViewer
          key={index}
          pdfUrl={annex.url}
          pdfName={annex.name}
          images={images}
          settings={settings}
        />
      ))}

      {/* Controls table is now part of the main pages with proper pagination */}

      <style jsx global>{`
         table {
           border-collapse: collapse;
           page-break-inside: auto;
         }
         table td {
           overflow: visible !important;
           white-space: normal !important;
           word-wrap: break-word !important;
           word-break: break-word !important;
           vertical-align: top !important;
           height: auto !important;
           min-height: 40px !important;
         }
         table tr {
           page-break-inside: avoid !important;
           page-break-after: auto;
           height: auto !important;
         }
         .space-y-4 > * {
           page-break-inside: auto;
         }
         table[style*="tableLayout: fixed"] td:nth-child(1),
         table[style*="tableLayout: fixed"] th:nth-child(1) {
           width: 35% !important;
           max-width: 35% !important;
           min-width: 35% !important;
         }
         table[style*="tableLayout: fixed"] td:nth-child(2),
         table[style*="tableLayout: fixed"] th:nth-child(2) {
           width: 10% !important;
           max-width: 10% !important;
           min-width: 10% !important;
         }
         table[style*="tableLayout: fixed"] td:nth-child(3),
         table[style*="tableLayout: fixed"] th:nth-child(3) {
           width: 35% !important;
           max-width: 35% !important;
           min-width: 35% !important;
         }
         table[style*="tableLayout: fixed"] td:nth-child(4),
         table[style*="tableLayout: fixed"] th:nth-child(4) {
           width: 20% !important;
           max-width: 20% !important;
           min-width: 20% !important;
         }
       `}</style>
    </div>
  );
};

export default ParticipantRiskAssessmentComplete;
