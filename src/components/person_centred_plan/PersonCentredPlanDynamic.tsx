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
    { key: 'name', label: 'Name', type: 'text', section: 'Personal Information' },
    { key: 'address', label: 'Address', type: 'text', section: 'Personal Information' },
    { key: 'dob', label: 'Date of Birth', type: 'text', section: 'Personal Information' },
    { key: 'guardian', label: 'Guardian', type: 'text', section: 'Personal Information' },
    { key: 'contactNumber', label: 'Contact Number', type: 'text', section: 'Personal Information' },
    { key: 'disability', label: 'Disability', type: 'text', section: 'Personal Information' },
    { key: 'ndisNumber', label: 'NDIS Number', type: 'text', section: 'Personal Information' },
    
    // About Me
    { key: 'myStory', label: 'My Story', type: 'longtext', section: 'About Me' },
    { key: 'strengths', label: 'My Strengths', type: 'longtext', section: 'About Me' },
    { key: 'allergies', label: 'Allergies', type: 'longtext', section: 'About Me' },
    { key: 'challenges', label: 'My Challenges', type: 'longtext', section: 'About Me' },
    
    // Health Information
    { key: 'respiratoryHistory', label: 'Respiratory History', type: 'longtext', section: 'Health Information' },
    { key: 'precautions', label: 'Precautions', type: 'longtext', section: 'Health Information' },
    { key: 'healthConditions', label: 'Health Conditions', type: 'longtext', section: 'Health Information' },
    { key: 'companionCard', label: 'Companion Card', type: 'text', section: 'Health Information' },
    { key: 'ambulanceCover', label: 'Ambulance Cover', type: 'text', section: 'Health Information' },
    { key: 'healthcarePrompt', label: 'Healthcare Prompt', type: 'text', section: 'Health Information' },
    
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
    const pages: any[] = [];
    let currentPage: any[] = [];
    let currentHeight = 0;
    
    // Calculate height for goal cards
    const goalsToAdd = activeGoals.map(num => ({ type: 'goal', number: num, estimatedHeight: 150 }));
    
    // Check if support information table has data
    const hasSupportInfo = [
      getFieldValue('pbsSupportPlanIncluded'),
      getFieldValue('restrictivePractices'),
      getFieldValue('organizationName'),
      getFieldValue('contactPersonOrg'),
      getFieldValue('contactNumberOrg')
    ].some(v => v && v.trim() !== '');
    
    // Check if informal supports table has data
    const hasInformalSupports = [1, 2, 3, 4, 5].some(i =>
      getFieldValue(`support${i}`) || getFieldValue(`informalSupport${i}`) || getFieldValue(`role${i}`) || getFieldValue(`frequency${i}`)
    );
    
    const tablesAndGoals = [
      ...goalsToAdd,
      ...(hasSupportInfo ? [{ type: 'support_info_table', estimatedHeight: 200 }] : []),
      ...(hasInformalSupports ? [{ type: 'informal_supports_table', estimatedHeight: 200 }] : [])
    ];
    
    const itemsToProcess = [
      ...otherFields.map(f => ({ type: 'field', field: f, estimatedHeight: calculateFieldHeight(f), showSection: false })),
      ...tablesAndGoals
    ];
    
    let lastSection: string | null = null;
    itemsToProcess.forEach((item: any, index: number) => {
      const itemHeight = item.estimatedHeight;
      
      // Check if this is a new section for field items
      const currentSection = item.type === 'field' ? item.field.section : null;
      const isNewSection = currentSection && currentSection !== lastSection;
      if (isNewSection) lastSection = currentSection as string;
      
      // Add showSection flag for first field of each section
      if (item.type === 'field' && isNewSection) {
        item.showSection = true;
      }
      
      if (currentHeight + itemHeight > maxPageHeight && currentPage.length > 0) {
        pages.push([...currentPage]);
        currentPage = [item];
        currentHeight = itemHeight;
        lastSection = currentSection as string | null; // Reset section tracking for new page
      } else {
        currentPage.push(item);
        currentHeight += itemHeight;
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

  // Separate goals from regular fields
  const goalsFields = fieldsWithValues.filter(f => 
    f.key.match(/^(goal|rating|actions|byWhom|byWhen|reviewDate)\d+/)
  );
  const otherFields = fieldsWithValues.filter(f => 
    !f.key.match(/^(goal|rating|actions|byWhom|byWhen|reviewDate)\d+/) &&
    !f.key.match(/^informal/) &&
    !f.key.match(/^(pbsSupportPlanIncluded|restrictivePractices|organizationName|contactPersonOrg|contactNumberOrg|role|frequency)/) &&
    !f.key.match(/^(supportInfo)/)
  );

  // Helper to get goal data
  const getGoalData = (goalNum: number) => {
    return {
      goal: getFieldValue(`goal${goalNum}`),
      rating: getFieldValue(`rating${goalNum}`),
      actions: getFieldValue(`actions${goalNum}`),
      byWhom: getFieldValue(`byWhom${goalNum}`),
      byWhen: getFieldValue(`byWhen${goalNum}`),
      reviewDate: getFieldValue(`reviewDate${goalNum}`)
    };
  };

  // Get active goals (1-5 for now)
  const activeGoals = [1, 2, 3, 4, 5].filter(num => {
    const goal = getGoalData(num);
    return goal.goal || goal.rating || goal.actions || goal.byWhom || goal.byWhen || goal.reviewDate;
  });

  // Render goal card
  const renderGoalCard = (goalNum: number) => {
    const goal = getGoalData(goalNum);
    return (
      <div key={`goal-${goalNum}`} className="border-2 border-gray-300 rounded-lg overflow-hidden mb-3">
        {/* Goal Header */}
        <div className="bg-gray-100 px-3 py-2 border-b-2 border-gray-300 flex items-center justify-between">
          <span className="font-bold text-sm text-gray-800">Goal {goalNum}</span>
          {goal.rating && (
            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
              {goal.rating}
            </span>
          )}
        </div>
        
        {/* Goal Content */}
        <div className="px-3 py-2 bg-white">
          {goal.goal && (
            <div className="mb-2">
              <p className="text-xs leading-tight whitespace-pre-wrap">{goal.goal}</p>
            </div>
          )}
          
          {goal.actions && (
            <div className="mb-2">
              <p className="text-xs leading-tight whitespace-pre-wrap">{goal.actions}</p>
            </div>
          )}
          
          {/* Footer with metadata */}
          {(goal.byWhom || goal.byWhen || goal.reviewDate) && (
            <div className="border-t border-gray-300 pt-1 mt-1 flex justify-between text-xs text-gray-600 gap-1">
              {goal.byWhom && <span><strong>By Whom:</strong> {goal.byWhom}</span>}
              {goal.byWhen && <span><strong>By When:</strong> {goal.byWhen}</span>}
              {goal.reviewDate && <span><strong>Review Date:</strong> {goal.reviewDate}</span>}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Support Information Table
  const renderSupportInformationTable = () => {
    const supportData = [
      { label: 'PBS Support Plan included?', value: getFieldValue('pbsSupportPlanIncluded') },
      { label: 'Any Restrictive Practices?', value: getFieldValue('restrictivePractices') },
      { label: 'Name of organization', value: getFieldValue('organizationName') },
      { label: 'Contact person', value: getFieldValue('contactPersonOrg') },
      { label: 'Contact number', value: getFieldValue('contactNumberOrg') }
    ].filter(item => item.value && item.value.trim() !== '');

    if (supportData.length === 0) return null;

    return (
      <div key="support-info-table" className="border border-gray-300 rounded-lg overflow-hidden mb-3">
        {/* Table Header */}
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
          <span className="font-bold text-sm text-gray-800">Support Information</span>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-bold">Label</th>
                <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-bold">Value</th>
              </tr>
            </thead>
            <tbody>
              {supportData.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 px-2 py-1 bg-white">{item.label}</td>
                  <td className="border border-gray-300 px-2 py-1 bg-white">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Informal Supports Table
  const renderInformalSupportsTable = () => {
    const informalSupports = [];
    for (let i = 1; i <= 5; i++) {
      // Try both field name variations - 'support' and 'informalSupport'
      const name = getFieldValue(`support${i}`) || getFieldValue(`informalSupport${i}`);
      const role = getFieldValue(`role${i}`);
      const frequency = getFieldValue(`frequency${i}`);
      
      if (name || role || frequency) {
        informalSupports.push({ name, role, frequency });
      }
    }

    if (informalSupports.length === 0) return null;

    return (
      <div key="informal-supports-table" className="border border-gray-300 rounded-lg overflow-hidden mb-3">
        {/* Table Header */}
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
          <span className="font-bold text-sm text-gray-800">Informal Supports</span>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-bold">Support Person</th>
                <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-bold">Role</th>
                <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-bold">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {informalSupports.map((support, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 px-2 py-1 bg-white">{support.name}</td>
                  <td className="border border-gray-300 px-2 py-1 bg-white">{support.role}</td>
                  <td className="border border-gray-300 px-2 py-1 bg-white">{support.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Group fields by height
  const pages = groupFieldsByHeight();

  // Update pages with new grouping
  const pagesGrouped = groupFieldsByHeight();

  // Render item (field or goal card)
  const renderItem = (item: any) => {
    if (item.type === 'goal') {
      return renderGoalCard(item.number);
    } else if (item.type === 'field') {
      return renderField(item.field, item.showSection, item.sectionNumber);
    } else if (item.type === 'support_info_table') {
      return renderSupportInformationTable();
    } else if (item.type === 'informal_supports_table') {
      return renderInformalSupportsTable();
    }
    return null;
  };

  // Render field with dynamic height
  const renderField = (field: any, showSection: boolean = false, sectionNumber: number = 0) => {
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
      <div key={field.key}>
        {/* Section Header - Plain text with numbering */}
        {showSection && field.section && (
          <div className="mb-3 mt-4">
            <span className="font-bold text-base text-gray-900">{sectionNumber}. {field.section}</span>
          </div>
        )}
        {/* Field Label */}
        <div className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-t">
          <span className="font-bold text-xs text-gray-800">{field.label}</span>
        </div>
        {/* Field Value */}
        <div
          className="border border-gray-300 border-t-0 p-2 bg-white rounded-b mb-3"
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

  return (
    <div className="print:p-0">
      {pagesGrouped.map((pageItems, index) => (
        <A4Page key={index} pageNumber={index + 1}>
          {pageItems.map(item => renderItem(item))}
        </A4Page>
      ))}
    </div>
  );
};

export default PersonCentredPlanDynamic;
