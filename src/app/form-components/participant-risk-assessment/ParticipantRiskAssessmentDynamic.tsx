"use client";

import React from "react";
import { format, parseISO, isValid } from "date-fns";

const ParticipantRiskAssessmentDynamic: React.FC<any> = ({ 
  formData, 
  commonFieldsData, 
  images, 
  settings 
}) => {
  
  // Common field mapping
  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
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

  const isChecked = (fieldKey: string, value: string) =>
    formData?.[fieldKey]?.toLowerCase() === value.toLowerCase();

  const isMultiChecked = (fieldKey: string, option: string) =>
    Array.isArray(formData?.[fieldKey]) && formData[fieldKey].includes(option);

  // Helper to check if section has content - ALWAYS SHOW ALL SECTIONS
  const hasContent = (sectionType: string) => {
    // For risk levels, only show if a risk level is selected
    if (sectionType === "risk-levels-detailed") {
      return isChecked('riskLevelLow', 'yes') || 
             isChecked('riskLevelModerate', 'yes') || 
             isChecked('riskLevelHigh', 'yes') || 
             isChecked('riskLevelCritical', 'yes');
    }
    // Always return true to show all other sections like the original
    return true;
  };

  // Define all form sections with their table structures
  const formSections = [
    {
      type: "participant-details",
      title: "PARTICIPANT DETAILS",
      height: 200, // Reduced from 280 for better accuracy
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2 w-[40%]">PARTICIPANT DETAILS</th>
              <th className="border border-black p-2" colSpan={2}>
                NDIS Number: {getValue("ndisNumber")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1 font-bold">Given name/s:</td>
              <td className="border border-black p-1">{getValue("givenNames")}</td>
              <td className="border border-black p-1">
                <strong>Family name:</strong> {getValue("familyName")}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Preferred name:</td>
              <td className="border border-black p-1">{getValue("preferredName")}</td>
              <td className="border border-black p-1">
                <strong>Date of birth:</strong> {getValue("dob")}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Address:</td>
              <td className="border border-black p-1">{getValue("address")}</td>
              <td className="border border-black p-1">
                <strong>Phone No:</strong> {getValue("phoneNumber")}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 font-bold">Preferred contact method:</td>
              <td className="border border-black p-1">{getValue("preferredContact")}</td>
              <td className="border border-black p-1">
                <strong>Email:</strong> {getValue("email")}
              </td>
            </tr>
          </tbody>
        </table>
      )
    },
    {
      type: "medical-conditions",
      title: "KNOWN MEDICAL CONDITIONS OR ALLERGIES",
      height: 150, // Reduced from 180
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>
                KNOWN MEDICAL CONDITIONS OR ALLERGIES
              </th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2 w-1/3">Specify</th>
              <th className="border border-black p-2 w-1/3">Effect</th>
              <th className="border border-black p-2 w-1/3">Treatment</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((num) => (
              <tr key={num}>
                <td className="border border-black p-1">{getValue(`medicalSpecify${num}`)}</td>
                <td className="border border-black p-1">{getValue(`medicalEffect${num}`)}</td>
                <td className="border border-black p-1">{getValue(`medicalTreatment${num}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    {
      type: "emergency-contact",
      title: "EMERGENCY CONTACTS / CARER / GUARDIAN",
      height: 100, // Reduced from 120
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={3}>
                EMERGENCY CONTACTS / CARER / GUARDIAN
              </th>
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
    {
      type: "persons-involved",
      title: "PERSONS INVOLVED IN COMPLETING THIS ASSESSMENT",
      height: 80, // Reduced from 100
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={2}>
                PERSONS INVOLVED IN COMPLETING THIS ASSESSMENT
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-1">
                <strong>Was participant involved?</strong>
                <div className="flex gap-4 mt-1">
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={isChecked('participantInvolved', 'yes')} readOnly className="mr-1" />
                    YES
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={isChecked('participantInvolved', 'no')} readOnly className="mr-1" />
                    NO
                  </label>
                </div>
                {getValue("participantInvolvedReason") && (
                  <div className="mt-1"><strong>Reason:</strong> {getValue("participantInvolvedReason")}</div>
                )}
              </td>
              <td className="border border-black p-1">
                <div><strong>Staff involved:</strong> {getValue("staffInvolved")}</div>
                <div className="mt-1"><strong>Others involved:</strong> {getValue("othersInvolved")}</div>
              </td>
            </tr>
          </tbody>
        </table>
      )
    },
    {
      type: "medication",
      title: "MEDICATION",
      height: 200,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={4}>MEDICATION</th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2">Medication Name</th>
              <th className="border border-black p-2">Dosage</th>
              <th className="border border-black p-2">Frequency</th>
              <th className="border border-black p-2">Administration</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((num) => (
              <tr key={num}>
                <td className="border border-black p-1">{getValue(`medicationName${num}`)}</td>
                <td className="border border-black p-1">{getValue(`medicationDosage${num}`)}</td>
                <td className="border border-black p-1">{getValue(`medicationFrequency${num}`)}</td>
                <td className="border border-black p-1">{getValue(`medicationAdmin${num}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    {
      type: "controls-table",
      title: "CONTROLS TABLE",
      height: 300,
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <tr key={num}>
                <td className="border border-black p-1">{getValue(`issue${num}`)}</td>
                <td className="border border-black p-1">{getValue(`score${num}`)}</td>
                <td className="border border-black p-1">{getValue(`control${num}`)}</td>
                <td className="border border-black p-1">{getValue(`person${num}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    {
      type: "communication-modes",
      title: "MODE OF COMMUNICATION",
      height: 150,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={2}>MODE OF COMMUNICATION</th>
            </tr>
            <tr className="bg-gray-200 font-semibold text-left">
              <th className="border border-black p-2">Scenario</th>
              <th className="border border-black p-2">Mode of Communication</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((num) => (
              <tr key={num}>
                <td className="border border-black p-1">{getValue(`scenario${num}`)}</td>
                <td className="border border-black p-1">{getValue(`mode${num}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
    {
      type: "emergency-procedures",
      title: "EMERGENCY PROCEDURES",
      height: 400,
      content: () => (
        <div className="border border-black">
          <div className="bg-gray-300 font-bold text-center p-2 border-b border-black">
            EMERGENCY PROCEDURES
          </div>
          
          {/* Fire Emergency */}
          <div className="border-b border-black">
            <div className="bg-gray-200 font-semibold p-2 border-b border-black">Fire Emergency</div>
            <div className="grid grid-cols-2">
              <div className="p-2 border-r border-black">
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Leave the building via the nearest safe route.</li>
                  <li>Obey all directions from emergency services.</li>
                  <li>Move calmly to assembly point</li>
                  <li>Follow closely the instructions of emergency services personnel and campus wardens.</li>
                  <li>Wait for the OK to re-enter the building.</li>
                </ul>
              </div>
              <div className="p-2">
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Move to the evacuation location in plan and stay there until all clear has been given.</li>
                  <li>Follow closely the instructions of emergency services personnel and campus warden.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Medical Emergency & Civil Disturbance */}
          <div className="grid grid-cols-2 border-b border-black">
            <div className="border-r border-black">
              <div className="bg-gray-200 font-semibold p-2 border-b border-black">Medical Emergency</div>
              <div className="p-2">
                <p className="text-xs mb-2">Assess the situation:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Do not move a participant unless they are exposed to a life-threatening situation.</li>
                  <li>In emergency situations contact the ambulance service by dialling 000 then ring supervisor.</li>
                  <li>Arrange for the ambulance to be met.</li>
                  <li>Remain with the participant and administer first aid as appropriate until assistance arrives.</li>
                  <li>Follow closely the instructions of emergency services personnel.</li>
                </ul>
              </div>
            </div>
            <div>
              <div className="bg-gray-200 font-semibold p-2 border-b border-black">Civil Disturbance</div>
              <div className="p-2">
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Keep well clear of the disturbance and do not say or do anything that may encourage irrational behaviour.</li>
                  <li>Consider locking down the building to prevent unauthorised entry.</li>
                  <li>Follow closely the instructions of emergency services personnel and campus wardens.</li>
                  <li>Evacuate the building only if instructed to do so by emergency services personnel or campus warden</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: "risk-levels-detailed",
      title: "RISK LEVELS",
      height: 400,
      content: () => {
        const selectedRiskLevel = 
          isChecked('riskLevelLow', 'yes') ? 'low' :
          isChecked('riskLevelModerate', 'yes') ? 'moderate' :
          isChecked('riskLevelHigh', 'yes') ? 'high' :
          isChecked('riskLevelCritical', 'yes') ? 'critical' : null;

        if (!selectedRiskLevel) return null;

        const riskLevels = {
          low: {
            level: "Low",
            color: "text-green-600",
            description: "Participants have a low reliance on provider services to meet daily living needs.",
            criteria: "Participants can independently perform most daily living activities without assistance. Any disruptions in services would have minimal impact on their overall well-being.",
            impact: "Disruptions in services would have minimal impact on participants' health and safety, as they can manage most activities independently."
          },
          moderate: {
            level: "Moderate", 
            color: "text-blue-700",
            description: "Participants have a moderate reliance on provider services for certain daily living needs.",
            criteria: "Participants can perform some daily activities independently but rely on the provider for specific tasks such as transportation, meal preparation, or medication management. A disruption in services would moderately impact their well-being.",
            impact: "Disruptions in services could moderately impact participants' health and safety, particularly for tasks they rely on the provider for."
          },
          high: {
            level: "High",
            color: "text-yellow-700", 
            description: "Participants have a high reliance on provider services to meet essential daily living needs.",
            criteria: "Participants require significant assistance from the provider for activities of daily living, including personal care, mobility, meal preparation, and medication management. A disruption in services would have a significant impact on their overall well-being and quality of life.",
            impact: "Disruptions in services would significantly impact participants' health and safety, as they rely heavily on the provider for essential tasks. There could be risks related to personal care, medical needs, and more."
          },
          critical: {
            level: "Critical",
            color: "text-red-600",
            description: "Participants have a critical reliance on provider services for all daily living needs.", 
            criteria: "Participants are entirely dependent on the provider for all activities of daily living, including personal care, mobility, communication, medical support, and more. Any disruption in services would pose a severe and immediate threat to their health and well-being.",
            impact: "Disruptions in services would pose a critical threat to participants' health and safety. Their complete dependency on the provider means that any interruption could lead to life-threatening situations."
          }
        };

        const selected = riskLevels[selectedRiskLevel];

        return (
          <div>
            <h2 className="text-center font-semibold mb-3 text-xs">
              Selected Risk Level Assessment
            </h2>
            <div className="p-2 bg-yellow-100 border border-yellow-400 rounded text-xs mb-4">
              <strong>Selected Risk Level: </strong>
              <span className={`font-bold ${selected.color}`}>{selected.level}</span>
            </div>
            <table className="w-full border border-black border-collapse text-xs">
              <thead className="bg-gray-300 font-semibold">
                <tr>
                  <th className="border border-black p-2 text-left w-20">Risk Level</th>
                  <th className="border border-black p-2 text-left">Description</th>
                  <th className="border border-black p-2 text-left">Criteria</th>
                  <th className="border border-black p-2 text-left">Impact on Health-Safety</th>
                </tr>
              </thead>
              <tbody>
                <tr className={selectedRiskLevel === 'high' ? 'bg-gray-100' : ''}>
                  <td className={`border border-black p-2 font-semibold ${selected.color}`}>
                    {selected.level}
                  </td>
                  <td className="border border-black p-2">{selected.description}</td>
                  <td className="border border-black p-2">{selected.criteria}</td>
                  <td className="border border-black p-2">{selected.impact}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
    },
    {
      type: "authorization",
      title: "AUTHORIZATION", 
      height: 200,
      content: () => (
        <table className="w-full border border-black border-collapse text-xs">
          <thead>
            <tr className="bg-gray-300 font-bold text-left">
              <th className="border border-black p-2" colSpan={2}>AUTHORIZATION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 font-bold">Authorised by:</td>
              <td className="border border-black p-2">{getValue("authorisedBy")}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Role:</td>
              <td className="border border-black p-2">{getValue("role")}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Signature:</td>
              <td className="border border-black p-2">{getValue("signature")}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Date:</td>
              <td className="border border-black p-2">{formatDate(getValue("signatureDate"))}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Guardian Signature:</td>
              <td className="border border-black p-2">{getValue("guardianSignature")}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Guardian Date:</td>
              <td className="border border-black p-2">{formatDate(getValue("guardianDate"))}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Copy supplied to participant:</td>
              <td className="border border-black p-2">
                <label className="inline-flex items-center mr-4">
                  <input type="checkbox" checked={isChecked('copySupplied', 'yes')} readOnly className="mr-1" />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={isChecked('copySupplied', 'no')} readOnly className="mr-1" />
                  No
                </label>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Copy on file:</td>
              <td className="border border-black p-2">
                <label className="inline-flex items-center mr-4">
                  <input type="checkbox" checked={isChecked('copyOnFile', 'yes')} readOnly className="mr-1" />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={isChecked('copyOnFile', 'no')} readOnly className="mr-1" />
                  No
                </label>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 font-bold">Review Date:</td>
              <td className="border border-black p-2">{formatDate(getValue("reviewDate"))}</td>
            </tr>
          </tbody>
        </table>
      )
    }
  ];

  // Filter sections to only show those with content
  const sectionsWithContent = formSections.filter(section => hasContent(section.type));

  // Risk assessment questions
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
    { key: "noiseSensitive", label: "Is the client affected by noises or sudden sounds?", questionNum: 10 },
    { key: "familyBehavioralHistory", label: "Is there a history of any family members with behavioural issues?", questionNum: 11 },
    { key: "mobilityIssues", label: "Does the client have mobility issues? (e.g., wheelchair or other?)", questionNum: 12 },
    { key: "showeringToiletingHazards", label: "Have hazards associated with showering, sponging and toileting been considered? (e.g., manual handling/ slips trips and falls/ biological hazards/ humidity, etc.)", questionNum: 13 }
  ];

  // Filter risk questions to only show answered ones - SHOW ALL QUESTIONS
  const answeredRiskQuestions = riskQuestions; // Show all questions like original

  // Create risk table sections
  const riskTableSections: any[] = [];
  let currentQuestions: any[] = [];
  let currentHeight = 0;
  const maxSectionHeight = 350; // Reduced from 400 for better page distribution
  const questionHeight = 50; // Reduced from 60 for more accurate calculation

  answeredRiskQuestions.forEach((question, index) => {
    if (currentHeight + questionHeight > maxSectionHeight && currentQuestions.length > 0) {
      riskTableSections.push({
        type: "risk-table",
        title: "RISK ASSESSMENT",
        height: currentHeight + 80, // Reduced overhead from 100 to 80
        questions: [...currentQuestions]
      });
      currentQuestions = [question];
      currentHeight = questionHeight;
    } else {
      currentQuestions.push(question);
      currentHeight += questionHeight;
    }
  });

  if (currentQuestions.length > 0) {
    riskTableSections.push({
      type: "risk-table",
      title: "RISK ASSESSMENT",
      height: currentHeight + 80, // Consistent with above
      questions: currentQuestions
    });
  }

  // Combine all sections (only those with content)
  const allSections = [...sectionsWithContent, ...riskTableSections];

  // Group sections into pages
  const groupSectionsByHeight = () => {
    const maxPageHeight = 900; // Available height after header/footer/margins (same as CIF)
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

  const pages = groupSectionsByHeight();

  // Format date helper (matching PRAFooter exactly)
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value || "N/A";
  };

  // A4 Page Component
  const A4Page = ({ children, pageNumber }: any) => (
    <div
      className="bg-white mx-auto shadow-md"
      style={{
        width: "794px",
        height: "1123px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: "always",
        boxSizing: 'border-box',
        padding: "30px",
        marginBottom: "20px",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header with Logo */}
      <div className="flex justify-center mb-4">
        <img
          alt="Infinity Logo"
          src={images?.infinityLogo || "/infinity_logo.png"}
          width={150}
          height={60}
          className="object-contain"
        />
      </div>
      
      {/* Title (only on first page) */}
      {pageNumber === 1 && (
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold uppercase">
            Participant Risk Assessment and Disaster Management Plan
          </h1>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: "800px" }}>
        {children}
      </div>
      
      {/* Footer - matching PRAFooter component exactly */}
      <div className="pt-4 mt-auto">
        <div className="flex justify-between text-xs px-2 border-t border-gray-300 pt-2">
          <div>Website: {settings?.company_website || settings?.from_email || ''}</div>
          <div>{settings?.participant_risk_assessment || ''}</div>
          <div>Review Date: {formatDate(settings?.review_date)}</div>
        </div>
      </div>
    </div>
  );

  // Render risk table
  const renderRiskTable = (questions: any[]) => (
    <table className="w-full border border-black border-collapse text-xs">
      <thead>
        <tr className="bg-gray-300 font-bold text-left">
          <th className="border border-black p-2 w-[40px]">No.</th>
          <th className="border border-black p-2">Question</th>
          <th className="border border-black p-2 w-[90px]">Yes/No</th>
          <th className="border border-black p-2 w-[40px]">Rating</th>
          <th className="border border-black p-2 w-[120px]">Comments</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => {
          const isQ11 = question.key === 'familyBehavioralHistory';
          return (
            <tr key={question.key}>
              <td className="border border-black px-2 py-2 text-center align-top">
                {question.questionNum}
              </td>
              <td className="border border-black px-2 py-2 align-top">
                {question.label}
              </td>
              <td className="border border-black px-2 py-2 align-top">
                <div className="flex flex-col gap-1">
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={isChecked(question.key, 'yes')}
                      readOnly
                      className="w-3 h-3"
                    />
                    <span>YES</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={isChecked(question.key, 'no')}
                      readOnly
                      className="w-3 h-3"
                    />
                    <span>NO</span>
                  </label>
                </div>
              </td>
              <td className="border border-black px-1 py-2 text-center">
                {getValue(`${question.key}Rating`)}
              </td>
              <td className="border border-black px-2 py-2 align-top">
                {isQ11 ? (
                  <div>
                    {(() => {
                      const commentText = getValue(`${question.key}Comment`);
                      return commentText ? (
                        <div className="mb-2">{commentText}</div>
                      ) : null;
                    })()}
                    <div className="mb-1">Is there a behaviour practitioner involved?</div>
                    <div className="flex flex-col gap-1">
                      <label className="inline-flex items-center space-x-1">
                        <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'yes')} readOnly className="w-3 h-3" />
                        <span>YES</span>
                      </label>
                      <label className="inline-flex items-center space-x-1">
                        <input type="checkbox" checked={isChecked('behaviorPractitionerInvolved', 'no')} readOnly className="w-3 h-3" />
                        <span>NO</span>
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
  );

  return (
    <div className="print:p-0">
      {pages.map((pageSections, index) => (
        <A4Page key={index} pageNumber={index + 1}>
          <div className="space-y-4">
            {pageSections.map((section: any, sectionIndex: number) => (
              <div key={sectionIndex}>
                {section.type === "risk-table" ? (
                  renderRiskTable(section.questions)
                ) : (
                  section.content()
                )}
              </div>
            ))}
          </div>
        </A4Page>
      ))}
    </div>
  );
};

export default ParticipantRiskAssessmentDynamic;
