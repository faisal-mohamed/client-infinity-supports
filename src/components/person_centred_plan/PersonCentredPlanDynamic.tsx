"use client";

import React from "react";

// Dynamic Person Centred Plan - Pages based on data content
const PersonCentredPlanDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings }) => {
  
  // Get field value helper function
  const getFieldValue = (key: string): string => {
    const value = formData?.[key] || commonFieldsData?.[key] || '';
    console.log(`PCP Field ${key}:`, value);
    return String(value);
  };

  // All Person Centred Plan fields with correct field names
  const allFields = [
    // Personal Information
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'dob', label: 'Date of Birth', type: 'text' },
    { key: 'guardian', label: 'Guardian', type: 'text' },
    { key: 'contactNumber', label: 'Contact Number', type: 'text' },
    { key: 'disability', label: 'Disability', type: 'text' },
    { key: 'ndisNumber', label: 'NDIS Number', type: 'text' },
    
    // About Me
    { key: 'myStory', label: 'My Story', type: 'longtext' },
    { key: 'strengths', label: 'My Strengths', type: 'longtext' },
    { key: 'allergies', label: 'Allergies', type: 'longtext' },
    { key: 'challenges', label: 'My Challenges', type: 'longtext' },
    
    // Health Information
    { key: 'respiratoryHistory', label: 'Respiratory History', type: 'longtext' },
    { key: 'precautions', label: 'Precautions', type: 'longtext' },
    { key: 'healthConditions', label: 'Health Conditions', type: 'longtext' },
    { key: 'companionCard', label: 'Companion Card', type: 'text' },
    { key: 'ambulanceCover', label: 'Ambulance Cover', type: 'text' },
    { key: 'healthcarePrompt', label: 'Healthcare Prompt', type: 'text' },
    
    // Goals (1-10) - correct field names
    { key: 'goal1', label: 'Goal 1', type: 'longtext' },
    { key: 'goal2', label: 'Goal 2', type: 'longtext' },
    { key: 'goal3', label: 'Goal 3', type: 'longtext' },
    { key: 'goal4', label: 'Goal 4', type: 'longtext' },
    { key: 'goal5', label: 'Goal 5', type: 'longtext' },
    { key: 'goal6', label: 'Goal 6', type: 'longtext' },
    { key: 'goal7', label: 'Goal 7', type: 'longtext' },
    { key: 'goal8', label: 'Goal 8', type: 'longtext' },
    { key: 'goal9', label: 'Goal 9', type: 'longtext' },
    { key: 'goal10', label: 'Goal 10', type: 'longtext' },
    
    // Goal ratings and actions
    { key: 'rating1', label: 'Goal 1 Rating', type: 'text' },
    { key: 'rating2', label: 'Goal 2 Rating', type: 'text' },
    { key: 'rating3', label: 'Goal 3 Rating', type: 'text' },
    { key: 'actions1', label: 'Goal 1 Actions', type: 'longtext' },
    { key: 'actions2', label: 'Goal 2 Actions', type: 'longtext' },
    { key: 'actions3', label: 'Goal 3 Actions', type: 'longtext' },
    { key: 'byWhom1', label: 'Goal 1 By Whom', type: 'text' },
    { key: 'byWhom2', label: 'Goal 2 By Whom', type: 'text' },
    { key: 'byWhom3', label: 'Goal 3 By Whom', type: 'text' },
    
    // Support Information
    { key: 'pbsSupportPlanIncluded', label: 'PBS Support Plan included?', type: 'text' },
    { key: 'restrictivePractices', label: 'Any Restrictive Practices?', type: 'text' },
    { key: 'organizationName', label: 'Name of organization', type: 'text' },
    { key: 'contactPersonOrg', label: 'Contact person', type: 'text' },
    { key: 'contactNumberOrg', label: 'Contact number', type: 'text' },
    
    // Informal Supports (1-10) - correct field names
    { key: 'informalSupport1', label: 'Informal Support 1', type: 'longtext' },
    { key: 'informalSupport2', label: 'Informal Support 2', type: 'longtext' },
    { key: 'informalSupport3', label: 'Informal Support 3', type: 'longtext' },
    { key: 'informalSupport4', label: 'Informal Support 4', type: 'longtext' },
    { key: 'informalSupport5', label: 'Informal Support 5', type: 'longtext' },
    { key: 'informalSupport6', label: 'Informal Support 6', type: 'longtext' },
    { key: 'informalSupport7', label: 'Informal Support 7', type: 'longtext' },
    { key: 'informalSupport8', label: 'Informal Support 8', type: 'longtext' },
    { key: 'informalSupport9', label: 'Informal Support 9', type: 'longtext' },
    { key: 'informalSupport10', label: 'Informal Support 10', type: 'longtext' },
    
    // Informal support details
    { key: 'role1', label: 'Support 1 Role', type: 'text' },
    { key: 'role2', label: 'Support 2 Role', type: 'text' },
    { key: 'role3', label: 'Support 3 Role', type: 'text' },
    { key: 'frequency1', label: 'Support 1 Frequency', type: 'text' },
    { key: 'frequency2', label: 'Support 2 Frequency', type: 'text' },
    { key: 'frequency3', label: 'Support 3 Frequency', type: 'text' }
  ];

  // Calculate field height based on content
  const calculateFieldHeight = (field: any) => {
    const value = getFieldValue(field.key);
    if (!value || value.trim() === '') return 0;
    
    const isLongText = field.type === 'longtext';
    const baseHeight = 45; // Header + borders + padding
    
    const charsPerLine = 80;
    const lineHeight = 12;
    const lines = Math.max(1, Math.ceil(value.length / charsPerLine));
    const contentHeight = lines * lineHeight;
    
    const minContentHeight = isLongText ? 60 : 30;
    const actualContentHeight = Math.max(minContentHeight, contentHeight);
    
    return baseHeight + actualContentHeight;
  };

  // Group fields by height for pages
  const groupFieldsByHeight = () => {
    const maxPageHeight = 900; // Available height per page
    const pages = [];
    let currentPage = [];
    let currentHeight = 0;
    
    fieldsWithValues.forEach(field => {
      const fieldHeight = calculateFieldHeight(field);
      
      if (currentHeight + fieldHeight > maxPageHeight && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [field];
        currentHeight = fieldHeight;
      } else {
        currentPage.push(field);
        currentHeight += fieldHeight;
      }
    });
    
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    return pages;
  };

  // Filter fields with values
  const fieldsWithValues = allFields.filter(field => {
    const value = getFieldValue(field.key);
    return value && String(value).trim() !== '';
  });

  // Group fields by height
  const pages = groupFieldsByHeight();

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
          width={180}
          height={70}
          className="object-contain"
        />
      </div>
      
      {/* Title (only on first page) */}
      {pageNumber === 1 && (
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">Person Centred Plan</h1>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}</span>
        <span>Page {pageNumber}</span>
        <span>{settings?.person_centred_plan_id || 'PCP001'}</span>
      </div>
    </div>
  );

  // Render field with dynamic height
  const renderField = (field: any) => {
    const value = getFieldValue(field.key);
    const isLongText = field.type === 'longtext';
    
    // Calculate dynamic height
    const charsPerLine = 80;
    const lineHeight = 12;
    const lines = Math.max(1, Math.ceil(value.length / charsPerLine));
    const contentHeight = lines * lineHeight;
    const minHeight = isLongText ? 60 : 30;
    const actualHeight = Math.max(minHeight, contentHeight);
    
    return (
      <div key={field.key} className="mb-3">
        <div className="bg-blue-100 border border-blue-300 px-2 py-1 rounded-t">
          <span className="font-bold text-xs text-blue-800">{field.label}</span>
        </div>
        <div 
          className="border border-blue-300 border-t-0 p-2 bg-white rounded-b"
          style={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'visible',
            height: `${actualHeight}px`,
            fontSize: '10px',
            lineHeight: '12px'
          }}
        >
          {value}
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

export default PersonCentredPlanDynamic;
