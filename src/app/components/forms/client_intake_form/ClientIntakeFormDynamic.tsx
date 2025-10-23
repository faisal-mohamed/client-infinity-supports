"use client";

import React from "react";

// Dynamic PDF View - Multiple A4 pages with auto page breaks
const ClientIntakeFormDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings }) => {
  
  // Get field value helper function
  const getFieldValue = (key: string): string => {
    const value = formData?.[key] || commonFieldsData?.[key] || '';
    console.log(`Field ${key}:`, value);
    return value;
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
    { key: 'barriers', label: 'Are there any cultural, communication barriers or intimacy issues', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'interpreter', label: 'Is an interpreter needed?', type: 'text' },
    { key: 'countryOfBirth', label: 'Country of Birth', type: 'text' },
    { key: 'culturalValues', label: 'Cultural Values', type: 'longtext' },
    { key: 'culturalBehaviours', label: 'Cultural Behaviours', type: 'longtext' },
    { key: 'writtenCommunication', label: 'Written Communication / Literacy', type: 'longtext' },
    
    // Contact Details
    { key: 'primaryContactName', label: 'Primary Contact Name', type: 'text' },
    { key: 'primaryContactRelationship', label: 'Primary Contact Relationship', type: 'text' },
    { key: 'primaryContactPhone', label: 'Primary Contact Phone', type: 'text' },
    { key: 'primaryContactMobile', label: 'Primary Contact Mobile', type: 'text' },
    { key: 'secondaryContactName', label: 'Secondary Contact Name', type: 'text' },
    { key: 'secondaryContactRelationship', label: 'Secondary Contact Relationship', type: 'text' },
    { key: 'secondaryContactHomePhone', label: 'Secondary Contact Home Phone', type: 'text' },
    { key: 'secondaryContactMobile', label: 'Secondary Contact Mobile', type: 'text' },
    { key: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text' },
    { key: 'emergencyContactRelationship', label: 'Emergency Contact Relationship', type: 'text' },
    { key: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'text' },
    
    // Living Arrangements
    { key: 'livingArrangements', label: 'Living Arrangements', type: 'text' },
    { key: 'livingArrangementsOthers', label: 'Living Arrangements Details', type: 'longtext' },
    { key: 'travelArrangements', label: 'Travel Arrangements', type: 'text' },
    { key: 'travelArrangementsOthers', label: 'Travel Arrangements Details', type: 'longtext' },
    
    // Medical Information
    { key: 'medicationChart', label: 'Does the Participant require a Medication Chart?', type: 'text' },
    { key: 'medicationChartOthers', label: 'Medication Chart Details', type: 'longtext' },
    { key: 'mealtimeManagement', label: 'Does the Participant require Mealtime Management?', type: 'text' },
    { key: 'bowelCare', label: 'Does the participant require Bowel Care Management?', type: 'text' },
    { key: 'bowelCareOthers', label: 'Bowel Care Details', type: 'longtext' },
    { key: 'personalCare', label: 'Does the participant require Personal Care?', type: 'text' },
    { key: 'personalCareOthers', label: 'Personal Care Details', type: 'longtext' },
    { key: 'mobilityAids', label: 'Does the participant use any mobility aids?', type: 'text' },
    { key: 'mobilityAidsOthers', label: 'Mobility Aids Details', type: 'longtext' },
    { key: 'epilepsy', label: 'Epilepsy', type: 'text' },
    { key: 'epilepsyOthers', label: 'Epilepsy Details', type: 'longtext' },
    { key: 'asthma', label: 'Asthma', type: 'text' },
    { key: 'asthmaOthers', label: 'Asthma Details', type: 'longtext' },
    { key: 'allergies', label: 'Allergies', type: 'text' },
    { key: 'allergiesOthers', label: 'Allergy Details', type: 'longtext' },
    { key: 'anaphylaxis', label: 'Anaphylaxis', type: 'text' },
    { key: 'anaphylaxisOthers', label: 'Anaphylaxis Details', type: 'longtext' },
    { key: 'minorInjuryPermission', label: 'Minor Injury Permission', type: 'text' },
    { key: 'training', label: 'Training', type: 'text' },
    { key: 'trainingOthers', label: 'Training Details', type: 'longtext' },
    { key: 'otherMedical', label: 'Other Medical', type: 'text' },
    { key: 'otherMedicalOthers', label: 'Other Medical Details', type: 'longtext' },
    { key: 'trigger', label: 'Is there any specific trigger for community activities?', type: 'text' },
    { key: 'triggerOthers', label: 'Trigger Details', type: 'longtext' },
    
    // Safety Considerations
    { key: 'riskAssessment', label: 'Does this Participant require a Risk Assessment?', type: 'text' },
    { key: 'riskAssessmentOthers', label: 'Risk Assessment Details', type: 'longtext' },
    { key: 'behaviourSupport', label: 'Does this Participant require Behaviour Support?', type: 'text' },
    { key: 'behaviourSupportOthers', label: 'Behaviour Support Details', type: 'longtext' },
    { key: 'personalGoals', label: 'Does this Participant have any personal preferences & personal goals?', type: 'text' },
    { key: 'personalGoalsOthers', label: 'Personal Goals Details', type: 'longtext' },
    { key: 'absconding', label: 'Absconding', type: 'text' },
    { key: 'abscondingOthers', label: 'Absconding Details', type: 'longtext' },
    { key: 'historyOfFalls', label: 'History of Falls', type: 'text' },
    { key: 'behaviourConcerns', label: 'Behaviour Concerns', type: 'text' },
    { key: 'behaviourConcernOthers', label: 'Behaviour Concern Details', type: 'longtext' },
    { key: 'positiveBehaviourSupport', label: 'Positive Behaviour Support', type: 'text' },
    { key: 'positiveBehaviourOthers', label: 'Positive Behaviour Details', type: 'longtext' },
    { key: 'communicationAssistance', label: 'Communication Assistance', type: 'text' },
    { key: 'communicationAssistanceOthers', label: 'Communication Assistance Details', type: 'longtext' },
    { key: 'physicalAssistance', label: 'Physical Assistance', type: 'text' },
    { key: 'physicalAssistanceOthers', label: 'Physical Assistance Details', type: 'longtext' },
    { key: 'languageConcerns', label: 'Language Concerns', type: 'text' },
    { key: 'languageConcernOthers', label: 'Language Concern Details', type: 'longtext' }
  ];

  // Calculate field height based on content
  const calculateFieldHeight = (field: any) => {
    const value = getFieldValue(field.key);
    const valueStr = String(value || '');
    const isLongText = field.type === 'longtext';
    
    // Base height for header + borders + padding
    const baseHeight = 45; // Header (25px) + borders + padding
    
    // Calculate content height based on text length
    const charsPerLine = 80; // Approximate characters per line
    const lineHeight = 12; // Line height in pixels
    const lines = Math.max(1, Math.ceil(Math.max(1, valueStr.length) / charsPerLine));
    const contentHeight = lines * lineHeight;
    
    // Minimum heights
    const minContentHeight = isLongText ? 50 : 25;
    const actualContentHeight = Math.max(minContentHeight, contentHeight);
    
    return baseHeight + actualContentHeight;
  };

  // Group fields into pages based on height
  const groupFieldsByHeight = () => {
    const maxPageHeight = 900; // Available height per page (1123 - header - footer - margins)
    const pages: typeof allFields[] = [];
    let currentPage: typeof allFields = [];
    let currentHeight = 0;
    
    fieldsWithValues.forEach(field => {
      const fieldHeight = calculateFieldHeight(field);
      
      // If adding this field would exceed page height, start new page
      if (currentHeight + fieldHeight > maxPageHeight && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [field];
        currentHeight = fieldHeight;
      } else {
        currentPage.push(field);
        currentHeight += fieldHeight;
      }
    });
    
    // Add the last page if it has fields
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    return pages;
  };

  // Show all fields, not just ones with values
  const fieldsWithValues = allFields;

  // Group fields by height instead of fixed count
  const pages = groupFieldsByHeight();

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
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>{settings?.from_email || ''}</span>
        <span>{settings?.client_intake_form_id || 'CF001'}</span>
        <span>Review Date: {settings?.review_date ? new Date(settings.review_date).toLocaleDateString() : ''}</span>
      </div>
    </div>
  );

  // Render field with dynamic height
  const renderField = (field: any) => {
    const value = getFieldValue(field.key);
    const valueStr = String(value);
    const isLongText = field.type === 'longtext';
    
    // Calculate dynamic height
    const charsPerLine = 80;
    const lineHeight = 12;
    const lines = Math.max(1, Math.ceil(valueStr.length / charsPerLine));
    const contentHeight = lines * lineHeight;
    const minHeight = isLongText ? 50 : 25;
    const actualHeight = Math.max(minHeight, contentHeight);
    
    return (
      <div key={field.key} className="mb-3">
        <div className="bg-gray-300 border border-black px-2 py-1">
          <span className="font-bold text-xs">{field.label}</span>
        </div>
        <div 
          className="border border-black border-t-0 p-2 bg-white"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'visible',
            height: `${actualHeight}px`,
            fontSize: '10px',
            lineHeight: '12px'
          }}
        >
          {valueStr}
        </div>
      </div>
    );
  };

  return (
    <div className="print:p-0">
      {pages.map((pageFields, index) => (
        <A4Page key={index} pageNumber={index + 1}>
          {pageFields.map(field => renderField(field))}
        </A4Page>
      ))}
    </div>
  );
};

export default ClientIntakeFormDynamic;
