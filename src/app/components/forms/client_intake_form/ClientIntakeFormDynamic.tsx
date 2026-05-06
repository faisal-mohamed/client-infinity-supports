"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";

// Dynamic PDF View - Multiple A4 pages with auto page breaks
const ClientIntakeFormDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings }) => {
  
  // Add comprehensive logging
  console.log('🔍 Client Intake Dynamic - Data received:');
  console.log('📋 formData:', formData);
  console.log('👤 commonFieldsData:', commonFieldsData);
  console.log('📊 NDIS from commonFieldsData:', commonFieldsData?.ndis);
  console.log('📊 NDIS from formData:', formData?.ndisNumber);
  
  // Get field value helper function
  const getFieldValue = (key: string): string => {
    console.log(`🔍 Getting Client Intake field: ${key}`);
    
    // Map common fields correctly
    const commonFieldMapping: Record<string, string> = {
      ndisNumber: 'ndis',
      givenName: 'name',
      surname: 'surname',
      dateOfBirth: 'dob',
      sex: 'sex',
      addressNumberStreet: 'street',
      state: 'state',
      postcode: 'postCode',
      email: 'email',
      mobile: 'phone',
      // homePhone: not mapped - uses form data only
      disabilityConditions: 'disability'
    };
    
    // Always prioritize current client details from database
    const mapped = commonFieldMapping[key];
    if (mapped && commonFieldsData?.[mapped]) {
      console.log(`✅ Client Intake Field ${key} (from commonFields.${mapped}):`, commonFieldsData[mapped]);
      return String(commonFieldsData[mapped]);
    }
    
    // Only fallback to saved form data if DB doesn't have the value
    if (formData?.[key]) {
      console.log(`⚠️ Client Intake Field ${key} (from formData):`, formData[key]);
      return String(formData[key]);
    }
    
    console.log(`❌ Client Intake Field ${key}: No value found`);
    return '';
  };

  // All form fields in order
  const allFields = [
    // Personal Information
    { key: 'ndisNumber', label: 'NDIS Number', type: 'text' },
    { key: 'givenName', label: 'Given Name', type: 'text' },
    { key: 'surname', label: 'Surname', type: 'text' },
    { key: 'preferredName', label: 'Preferred Name', type: 'text' },
    { key: 'dateOfBirth', label: 'Date of Birth', type: 'text' },
    { key: 'sex', label: 'Sex', type: 'text' },
    { key: 'pronoun', label: 'Pronoun', type: 'text' },
    { key: 'aboriginalTorres', label: 'Aboriginal or Torres Strait Islander?', type: 'text' },
    { key: 'addressNumberStreet', label: 'Address (Number/Street)', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'postcode', label: 'Postcode', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'homePhone', label: 'Home Phone', type: 'text' },
    { key: 'mobile', label: 'Mobile', type: 'text' },
    { key: 'disabilityConditions', label: 'Disability Conditions/Disability type(s)', type: 'longtext' },
    
    // Medical Contact
    { key: 'medicalCentreName', label: 'Medical Centre Name', type: 'text' },
    { key: 'medicalPhone', label: 'Medical Centre Phone', type: 'text' },
    
    // Support Coordinator
    { key: 'supportCoordinatorName', label: 'Support Coordinator Name', type: 'text' },
    { key: 'supportCoordinatorEmail', label: 'Support Coordinator Email', type: 'text' },
    { key: 'supportCoordinatorCompany', label: 'Support Coordinator Company', type: 'text' },
    { key: 'supportCoordinatorContact', label: 'Support Coordinator Contact', type: 'text' },
    { key: 'otherSupports', label: 'What other supports including mainstream health services you receive at present', type: 'longtext' },
    
    // About Me
    { key: 'aboutMe', label: 'All About Me', type: 'longtext' },
    
    // Advocate Details
    { key: 'advocateName', label: 'Advocate Name', type: 'text' },
    { key: 'advocateEmail', label: 'Advocate Email', type: 'text' },
    { key: 'advocatePhone', label: 'Advocate Phone', type: 'text' },
    { key: 'advocateMobile', label: 'Advocate Mobile', type: 'text' },
    { key: 'advocateAddress', label: 'Advocate Address', type: 'text' },
    { key: 'advocatePostalAddress', label: 'Advocate Postal Address', type: 'text' },
    { key: 'advocateOtherInfo', label: 'Advocate Additional Information', type: 'longtext' },
    { key: 'advocateRelationship', label: 'Advocate Relationship with Participant', type: 'text' },
    
    // Cultural Information
    { key: 'barriers', label: 'Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'interpreter', label: 'Verbal communication or spoken language - Is an interpreter needed?', type: 'text' },
    { key: 'countryOfBirth', label: 'Country of Birth', type: 'text' },
    { key: 'culturalValues', label: 'Cultural Values', type: 'longtext' },
    { key: 'culturalBehaviours', label: 'Cultural Behaviours', type: 'longtext' },
    { key: 'writtenCommunication', label: 'Written Communication / Literacy', type: 'longtext' },
    
    // Contact Details
    { key: 'primaryContactName', label: 'Primary Contact Name', type: 'text' },
    { key: 'primaryContactRelationship', label: 'Primary Contact Relationship', type: 'text' },
    { key: 'primaryContactHomePhone', label: 'Primary Contact Home Phone', type: 'text' },
    { key: 'primaryContactMobile', label: 'Primary Contact Mobile', type: 'text' },
    { key: 'secondaryContactName', label: 'Secondary Contact Name', type: 'text' },
    { key: 'secondaryContactRelationship', label: 'Secondary Contact Relationship', type: 'text' },
    { key: 'secondaryContactHomePhone', label: 'Secondary Contact Home Phone', type: 'text' },
    { key: 'secondaryContactMobile', label: 'Secondary Contact Mobile', type: 'text' },
    // Emergency contact fields removed from view per requirements
    
    // Living Arrangements
    { key: 'livingArrangements', label: 'Living Arrangements', type: 'text' },
    { key: 'livingArrangementsOther', label: 'Please specify other living arrangement', type: 'longtext' },
    { key: 'travelArrangements', label: 'Travel Arrangements', type: 'text' },
    { key: 'travelArrangementsOther', label: 'Please specify other travel arrangement', type: 'longtext' },
    
    // Medical Information
    { key: 'medicationChart', label: 'Does the Participant require a Medication Chart?', type: 'text' },
    { key: 'medicationChartOthers', label: 'Medication Chart Details', type: 'longtext' },
    { key: 'mealtimeManagement', label: 'Does the Participant require Mealtime Management?', type: 'text' },
    { key: 'bowelCare', label: 'Does the participant require Bowel Care Management?', type: 'text' },
    { key: 'bowelCareOthers', label: 'If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.', type: 'longtext' },
    { key: 'menstrualIssues', label: 'Are there any issues with a menstrual cycle or is assistance needed with female hygiene', type: 'text' },
    { key: 'menstrualIssuesOthers', label: 'If yes, Please specify', type: 'longtext' },
    // Removed from view per requirements (not present in edit)
    { key: 'epilepsy', label: 'Does the Participant have Epilepsy?', type: 'text' },
    { key: 'epilepsyOthers', label: "If yes, ensure Participant's Doctor completes an Epilepsy Plan", type: 'longtext' },
    { key: 'asthmatic', label: 'Is the Participant an Asthmatic?', type: 'text' },
    { key: 'asthmaticOthers', label: "If yes ,ensure Participant's Doctor completes an Asthma Plan", type: 'longtext' },
    { key: 'allergies', label: 'Does the Participant have any allergies?', type: 'text' },
    { key: 'allergiesOthers', label: 'If yes, ensure to have an Allergy Plan from Participant\'s Doctor', type: 'longtext' },
    { key: 'anaphylactic', label: 'Is the Participant anaphylactic?', type: 'text' },
    { key: 'anaphylacticOthers', label: 'If yes, ensure to have an anaphylaxis Plan from the Participant\'s Doctor', type: 'longtext' },
    { key: 'minorInjury', label: "Do you give permission for our company's staff to administer band-aids in cases of a minor injury?", type: 'text' },
    { key: 'training', label: 'Does this participant require specific training?', type: 'text' },
    { key: 'trainingOthers', label: 'If yes, ensure to provide information such as implementing a positive behaviour support plan.', type: 'longtext' },
    { key: 'othermedical', label: 'Are there any other medication conditions that will be relevant to the care provided to this Participant?', type: 'text' },
    { key: 'othermedicalOthers', label: 'If yes, please specify.', type: 'longtext' },
    { key: 'trigger', label: 'Is there any specific trigger for community activities?', type: 'text' },
    { key: 'triggerOthers', label: 'If yes, please specify and complete the Risk assessment for participants.', type: 'longtext' },
    
    // Safety Considerations
    // Removed from view (not present in edit form): Risk Assessment and Behaviour Support
    { key: 'personalGoals', label: 'Does this Participant have any personal preferences & personal goals?', type: 'text' },
    { key: 'personalGoalsOthers', label: 'If yes, refer to form Support Plan', type: 'longtext' },
    { key: 'absconding', label: 'Does the Participant show signs or a history of unexpectedly leaving (absconding)?', type: 'text' },
    { key: 'abscondingOthers', label: 'If yes, please specify.', type: 'longtext' },
    { key: 'historyOfFalls', label: 'Is this participant prone to falls or have a history of falls?', type: 'text' },
    { key: 'behaviourConcern', label: 'Are there any Behaviours of Concern? Eg: Kicking, biting', type: 'text' },
    { key: 'behaviourConcernOthers', label: 'If yes, please specify.', type: 'longtext' },
    { key: 'positiveBehaviour', label: 'Is there a current Positive Behaviour Support Plan in place?', type: 'text' },
    { key: 'positiveBehaviourOthers', label: 'If yes, refer to High Risk Participant Register.', type: 'longtext' },
    { key: 'communicationAssistance', label: 'Does the participant require communication assistance?', type: 'text' },
    { key: 'communicationAssistanceOthers', label: 'If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.', type: 'longtext' },
    { key: 'physicalAssistance', label: 'Is there any physical assistance or physical assistance preference for this Participant?', type: 'text' },
    { key: 'physicalAssistanceOthers', label: 'If yes, specify.', type: 'longtext' },
    { key: 'languageConcern', label: 'Does the Participant have any expressive language concerns?', type: 'text' },
    { key: 'languageConcernOthers', label: 'If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.', type: 'longtext' }
  ];
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  const dependentMap: Record<string, string> = {
    medicationChartOthers: 'medicationChart',
    bowelCareOthers: 'bowelCare',
    menstrualIssuesOthers: 'menstrualIssues',
    epilepsyOthers: 'epilepsy',
    asthmaticOthers: 'asthmatic',
    allergiesOthers: 'allergies',
     anaphylacticOthers: 'anaphylactic',
     trainingOthers: 'training',
     othermedicalOthers: 'othermedical',
    triggerOthers: 'trigger',
    abscondingOthers: 'absconding',
     behaviourConcernOthers: 'behaviourConcern',
     positiveBehaviourOthers: 'positiveBehaviour',
    communicationAssistanceOthers: 'communicationAssistance',
    physicalAssistanceOthers: 'physicalAssistance',
     languageConcernOthers: 'languageConcern',
    personalGoalsOthers: 'personalGoals'
  };

  const shouldIncludeField = (fieldKey: string) => {
    const parentKey = dependentMap[fieldKey];
    if (!parentKey) return true;
    const parentValue = getFieldValue(parentKey);
    const detailValue = getFieldValue(fieldKey);
    return parentValue === 'Yes' && !!detailValue;
  };

  const visibleFields = allFields.filter(f => shouldIncludeField(f.key));

  // Measurement-based pagination
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});
  const pageContentMaxHeight = 1000; // tighter budget to avoid boundary clipping
  const safetyGap = 10; // larger buffer at page bottom
  const fieldMarginBottomPx = 12; // Tailwind mb-3 ≈ 12px, not included in offsetHeight
  const [measureVersion, setMeasureVersion] = useState(0);

  // Re-measure on window resize or device pixel ratio changes
  useEffect(() => {
    const handle = () => setMeasureVersion((v) => v + 1);
    window.addEventListener('resize', handle);
    // Listen to DPR changes
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const dprListener = () => handle();
    if (mq && mq.addEventListener) mq.addEventListener('change', dprListener);
    return () => {
      window.removeEventListener('resize', handle);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', dprListener);
    };
  }, []);

  useLayoutEffect(() => {
    const updates: Record<string, number> = {};
    let changed = false;
    visibleFields.forEach((f) => {
      const el = measureRefs.current[f.key];
      if (!el) return;
      const h = el.offsetHeight;
      if (measuredHeights[f.key] !== h) {
        updates[f.key] = h;
        changed = true;
      }
    });
    if (changed) {
      setMeasuredHeights((prev) => ({ ...prev, ...updates }));
    }
  }, [visibleFields, measureVersion]);

  const estimateHeight = (field: any) => {
    const base = 55;
    const v = String(getFieldValue(field.key) || '');
    const lines = Math.ceil(v.length / 100);
    return base + lines * 10;
  };

  const pages = useMemo(() => {
    const pgs: typeof allFields[] = [];
    let current: typeof allFields = [];
    let height = 0;
    visibleFields.forEach((f) => {
      const base = measuredHeights[f.key] ?? estimateHeight(f);
      const h = base + fieldMarginBottomPx + safetyGap;
      if (height + h > pageContentMaxHeight && current.length > 0) {
        pgs.push(current);
        current = [f];
        height = h;
      } else {
        current.push(f);
        height += h;
      }
    });
    if (current.length) pgs.push(current);
    return pgs;
  }, [visibleFields, measuredHeights, measureVersion]);

  // A4 Page Component
  const A4Page = ({ children, pageNumber }: any) => (
    <div
      className="bg-white mx-auto shadow-md"
      style={{
        width: "794px",
        height: "1123px", // Fixed A4 height
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
          width={180}
          height={70}
          className="object-contain"
        />
      </div>
      
      {/* Title (only on first page) */}
      {pageNumber === 1 && (
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">Client Intake Form</h1>
        </div>
      )}
      
      {/* Content Area: fixed-height; prevent pushing footer to next page */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between text-[10px] text-azure-500 mt-4 pt-2 border-t border-azure-200">
        <span>Website: {settings?.company_website || ''}</span>
        <span className="font-medium">{settings?.client_intake_form_id || ''}</span>
        <span>Review Date: {settings?.review_date ? format(new Date(settings.review_date), 'dd/MM/yyyy') : ''}</span>
      </div>
    </div>
  );

  // Render field with dynamic height
  const renderField = (field: any) => {
    const value = getFieldValue(field.key);
    let valueStr = Array.isArray(value) ? value.join(', ') : String(value || '');
    const isLongText = field.type === 'longtext';
    
    // Special bullet rendering for multi-select lists
    const isBulletList = field.key === 'livingArrangements' || field.key === 'travelArrangements';
    const items = isBulletList
      ? (Array.isArray(value)
          ? value
          : String(value || '')
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0))
      : [];
    
    // Calculate dynamic height
    const charsPerLine = 80;
    const lineHeight = 12;
    const lines = Math.max(1, Math.ceil(valueStr.length / charsPerLine));
    const contentHeight = isBulletList ? Math.max(18 * items.length, 25) : lines * lineHeight;
    const minHeight = isLongText ? 50 : 25;
    const actualHeight = Math.max(minHeight, contentHeight);

    // Inline yes-only guidance messages (no input) for certain Yes/No questions
    // Inline note next to Yes for select questions
    const yesInlineNoteMap: Record<string, string> = {
      mealtimeManagement: 'refer to Mealtime Management Plan Form',
      personalGoals: 'refer to form Support Plan',
    };
    if (yesInlineNoteMap[field.key] && value === 'Yes') {
      valueStr = `Yes (${yesInlineNoteMap[field.key]})`;
    }
    
    return (
      <div key={field.key} className="mb-3">
        <div className="bg-azure-200 border border-black px-2 py-1">
          <span className="font-bold text-xs">{field.label}</span>
        </div>
        <div 
          className="border border-black border-t-0 p-2 bg-white"
          style={{
            whiteSpace: isBulletList ? 'normal' : 'pre-wrap',
            wordWrap: 'break-word',
            // Allow content to expand if height estimation is short; avoids hiding bottom lines
            overflow: 'visible',
            minHeight: `${actualHeight}px`,
            fontSize: '10px',
            lineHeight: '12px'
          }}
        >
          {isBulletList ? (
            <ul className="list-disc pl-5">
              {items.length > 0 ? (
                items.map((opt: string, idx: number) => (
                  <li key={idx}>{opt}</li>
                ))
              ) : (
                <li style={{ listStyleType: 'none' }}>&nbsp;</li>
              )}
            </ul>
          ) : (
            valueStr
          )}
        </div>
      </div>
    );
  };

  // Hidden measurement container to capture actual heights with identical markup/styles
  const renderMeasurementContainer = () => (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
        top: -9999,
        left: -9999,
        width: "794px",
        boxSizing: 'border-box',
        padding: "30px"
      }}
    >
      {visibleFields.map((field) => (
        <div key={`m-${field.key}`} ref={(el) => { (measureRefs.current as any)[field.key] = el; }}>
          {renderField(field)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="print:p-0">
      {renderMeasurementContainer()}
      {pages.map((pageFields, index) => (
        <A4Page key={index} pageNumber={index + 1}>
          {pageFields.map(field => renderField(field))}
        </A4Page>
      ))}
    </div>
  );
};

export default ClientIntakeFormDynamic;
