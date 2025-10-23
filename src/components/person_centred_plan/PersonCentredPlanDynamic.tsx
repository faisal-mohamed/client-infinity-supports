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
    { key: 'name', label: '1) Name', type: 'text', section: 'Personal Information' },
    { key: 'address', label: '2) Address', type: 'text', section: 'Personal Information' },
    { key: 'dob', label: '3) Date of Birth', type: 'text', section: 'Personal Information' },
    { key: 'guardian', label: '4) Guardian/Parent', type: 'text', section: 'Personal Information' },
    { key: 'contactNumber', label: '5) Contact Number', type: 'text', section: 'Personal Information' },
    { key: 'disability', label: '6) Disability', type: 'text', section: 'Personal Information' },
    { key: 'ndisNumber', label: '7) NDIS Number', type: 'text', section: 'Personal Information' },
    
    // About Me
    { key: 'myStory', label: '1) My Story', type: 'longtext', section: 'About Me' },
    { key: 'strengths', label: '2) My Strengths', type: 'longtext', section: 'About Me' },
    { key: 'allergies', label: '3) Allergies', type: 'longtext', section: 'About Me' },
    { key: 'challenges', label: '4) My Challenges', type: 'longtext', section: 'About Me' },
    
    // Health Information
    { key: 'respiratoryHistory', label: '1) History of Respiratory Depression', type: 'longtext', section: 'Health Information' },
    { key: 'precautions', label: '2) Precautions', type: 'longtext', section: 'Health Information' },
    { key: 'healthConditions', label: '3) Health Conditions', type: 'longtext', section: 'Health Information' },
    { key: 'companionCard', label: '4) Does the participant have a Companion Card?', type: 'text', section: 'Health Information' },
    { key: 'ambulanceCover', label: '5) Does the participant have Ambulance Cover?', type: 'text', section: 'Health Information' },
    { key: 'healthcarePrompt', label: '6) Does the participant require support to organize regular medical & dental check ups? (If yes, coordinator to set annual reminders to prompt and assist participant to organize annual health checks)', type: 'text', section: 'Health Information' },
    
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
    const goalsToAdd = activeGoals.map(num => ({ type: 'goal', number: num, estimatedHeight: 150, showSection: false, sectionNumber: 0 }));
    
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
      ...(hasSupportInfo ? [{ type: 'support_info_table', estimatedHeight: 200, showSection: false, sectionNumber: 0 }] : []),
      ...(hasInformalSupports ? [{ type: 'informal_supports_table', estimatedHeight: 200, showSection: false, sectionNumber: 0 }] : [])
    ];
    
    const itemsToProcess = [
      ...otherFields.map(f => ({ type: 'field', field: f, estimatedHeight: calculateFieldHeight(f), showSection: false, sectionNumber: 0 })),
      ...tablesAndGoals
    ];
    
    let lastSection: string | null = null;
    let sectionNumber = 0;
    itemsToProcess.forEach((item: any, index: number) => {
      const itemHeight = item.estimatedHeight;
      
      // Determine current section
      let currentSection: string | null = null;
      if (item.type === 'field') {
        currentSection = item.field.section;
      } else if (item.type === 'goal') {
        currentSection = 'Goals & Outcomes';
      } else if (item.type === 'support_info_table') {
        currentSection = 'Support Information';
      } else if (item.type === 'informal_supports_table') {
        currentSection = 'Informal Supports';
      }
      
      const isNewSection = currentSection && currentSection !== lastSection;
      if (isNewSection) {
        lastSection = currentSection as string;
        sectionNumber++;
      }
      
      // Add section number and showSection flag
      item.sectionNumber = sectionNumber;
      if ((item.type === 'field' || item.type === 'goal' || item.type === 'support_info_table' || item.type === 'informal_supports_table') && isNewSection) {
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
  const renderGoalCard = (goalNum: number, sectionNumber: number = 0, showSection: boolean = false) => {
    const goal = getGoalData(goalNum);
    return (
      <div key={`goal-${goalNum}`}>
        {/* Section Header - Show once at the beginning of goals */}
        {showSection && sectionNumber > 0 && (
          <div className="mb-3 mt-4">
            <span className="font-bold text-base text-gray-900">{sectionNumber}. Goals & Outcomes</span>
          </div>
        )}
        {/* Goal Card */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden mb-3">
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
      </div>
    );
  };

  // Render Support Information Table
  const renderSupportInformationTable = (sectionNumber: number = 0) => {
    const supportData = [
      { label: '1) Is a PBS Support Plan included?', value: getFieldValue('pbsSupportPlanIncluded') },
      { label: '2) Does the participant have any Restrictive Practices in their support plan?', value: getFieldValue('restrictivePractices') },
      { label: '3) Name of organization providing support', value: getFieldValue('organizationName') },
      { label: '4) Contact person from the organization', value: getFieldValue('contactPersonOrg') },
      { label: '5) Contact number for the organization', value: getFieldValue('contactNumberOrg') }
    ].filter(item => item.value && item.value.trim() !== '');

    if (supportData.length === 0) return null;

    return (
      <div key="support-info-table" className="mb-3">
        {/* Section Header - Plain text with numbering */}
        {sectionNumber > 0 && (
          <div className="mb-3 mt-4">
            <span className="font-bold text-base text-gray-900">{sectionNumber}. Support Information</span>
          </div>
        )}
        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
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
      </div>
    );
  };

  // Render Informal Supports Table
  const renderInformalSupportsTable = (sectionNumber: number = 0) => {
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
      <div key="informal-supports-table" className="mb-3">
        {/* Section Header - Plain text with numbering */}
        {sectionNumber > 0 && (
          <div className="mb-3 mt-4">
            <span className="font-bold text-base text-gray-900">{sectionNumber}. Informal Supports</span>
          </div>
        )}
        {/* Table */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
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
      return renderGoalCard(item.number, item.sectionNumber, item.showSection);
    } else if (item.type === 'field') {
      return renderField(item.field, item.showSection, item.sectionNumber);
    } else if (item.type === 'support_info_table') {
      return renderSupportInformationTable(item.sectionNumber);
    } else if (item.type === 'informal_supports_table') {
      return renderInformalSupportsTable(item.sectionNumber);
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
          {pageItems.map((item: any) => renderItem(item))}
        </A4Page>
      ))}
    </div>
  );
};

export default PersonCentredPlanDynamic;
