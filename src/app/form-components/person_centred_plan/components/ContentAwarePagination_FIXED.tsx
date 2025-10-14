import React from 'react';
import EnhancedA4Page from './EnhancedA4Page';

interface ContentAwarePaginationProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  images?: any;
}

const ContentAwarePagination: React.FC<ContentAwarePaginationProps> = ({
  formData,
  commonFieldsData,
  settings,
  images
}) => {
  // Get value helper function
  const getValue = (key: string) => {
    return formData?.[key] || commonFieldsData?.[key] || '';
  };

  console.log('🔄 CREATING TRUE CONTENT SPLITTING PAGINATION');
  console.log('=============================================');
  console.log('Using JavaScript-based content splitting with MS Word-style page breaks');
  console.log('This prevents content cutoff by splitting content at the JavaScript level');
  console.log('');

  // Define all sections in order
  const allSections = [
    { id: 'cover', title: '', sectionNumber: 1 },
    { id: 'personalInfo', title: 'Personal Information', sectionNumber: 2 },
    { id: 'healthInfo', title: 'Health Information', sectionNumber: 3 },
    { id: 'goals', title: 'Goals & Actions', sectionNumber: 4 },
    { id: 'supportInfo', title: 'Support Information', sectionNumber: 5 }
  ];

  // Create all fields in logical order - let CSS handle pagination
  const allFields: Array<{
    section: any;
    field: any;
    showSectionTitle: boolean;
    questionNumber: number;
  }> = [];
  const sectionsWithTitleShown = new Set();
  
  allSections.forEach((section) => {
      // Special handling for cover page - only add cover, no other fields
      if (section.id === 'cover') {
        allFields.push({ 
          section, 
          field: { key: 'cover', type: 'cover' }, 
          showSectionTitle: false,
          questionNumber: 0
        });
        return;
      }

    // Get fields for this section
    let sectionFields: Array<{
      key: string;
      label: string;
      type: string;
    }> = [];
    
      if (section.id === 'personalInfo') {
        sectionFields = [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'address', label: 'Address', type: 'text' },
          { key: 'dob', label: 'Date of Birth', type: 'date' },
          { key: 'guardian', label: 'Parent/guardian', type: 'text' },
          { key: 'guardianAddress', label: 'Address', type: 'text' },
          { key: 'contactNumber', label: 'Contact Number', type: 'text' },
          { key: 'disability', label: 'Disability', type: 'text' },
          { key: 'ndisNumber', label: 'NDIS Number', type: 'text' },
          { key: 'myStory', label: 'My Story', type: 'textarea' },
          { key: 'strengths', label: 'Strengths', type: 'textarea' },
          { key: 'challenges', label: 'Challenges', type: 'text' },
          { key: 'allergies', label: 'Allergies', type: 'text' },
          { key: 'restrictivePractices', label: 'Any Restrictive Practices?', type: 'text' }
        ];
    } else if (section.id === 'healthInfo') {
      sectionFields = [
        { key: 'respiratoryHistory', label: 'History of Respiratory Depression', type: 'textarea' },
        { key: 'precautions', label: 'Precautions', type: 'textarea' },
        { key: 'healthConditions', label: 'Health Conditions', type: 'textarea' },
        { key: 'companionCard', label: 'Companion Card', type: 'text' },
        { key: 'ambulanceCover', label: 'Ambulance Cover', type: 'text' },
        { key: 'healthcarePrompt', label: 'Proactive & preventative healthcare prompts', type: 'checkbox' }
      ];
    } else if (section.id === 'goals') {
      // Goals table - add to all fields
      allFields.push({ 
        section, 
        field: { key: 'goals', type: 'goals_table' }, 
        showSectionTitle: !sectionsWithTitleShown.has(section.id),
        questionNumber: 0
      });
      
      // Mark section title as shown
      if (!sectionsWithTitleShown.has(section.id)) {
        sectionsWithTitleShown.add(section.id);
      }
      return;
    } else if (section.id === 'supportInfo') {
      sectionFields = [
        { key: 'pbsSupportPlanIncluded', label: 'PBS Support Plan included?', type: 'text' },
        { key: 'organizationName', label: 'Name of organization', type: 'text' },
        { key: 'contactPersonOrg', label: 'Contact person', type: 'text' },
        { key: 'contactNumberOrg', label: 'Contact number', type: 'text' },
        { key: 'informalSupports', label: 'My Informal Supports', type: 'informal_supports_table' }
      ];
    }

    // Process regular fields - add to allFields array
    sectionFields.forEach((field) => {
      allFields.push({
        section,
        field,
        showSectionTitle: !sectionsWithTitleShown.has(section.id),
        questionNumber: allFields.length + 1
      });
      
      // Mark section title as shown
      if (!sectionsWithTitleShown.has(section.id)) {
        sectionsWithTitleShown.add(section.id);
      }
    });
  });

  console.log(`📄 Total fields to render: ${allFields.length}`);
  console.log('🎯 CSS will handle page breaks automatically');
  console.log('');
  
  // Debug: Log all field data
  console.log('🔍 DEBUGGING FIELD DATA:');
  console.log('Form Data:', formData);
  console.log('Common Fields Data:', commonFieldsData);
  
  // Check if we have goal data
  for (let i = 1; i <= 5; i++) {
    const goal = getValue(`goal${i}`);
    if (goal) {
      console.log(`Goal ${i}:`, goal);
    }
  }
  console.log('');

  // Render checkbox helper
  const renderCheckbox = (key: string, options: string[]) => (
    <div className="flex flex-wrap gap-4">
      {options?.map?.((opt, index) => (
        <div key={`${key}-${opt}-${index}`} className="flex items-center">
          <input
            type="checkbox"
            id={`${key}-${opt}-${index}`}
            name={key}
            value={opt}
            checked={getValue(key) === opt}
            readOnly
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <label htmlFor={`${key}-${opt}-${index}`} className="ml-2 text-sm text-gray-700">
            {opt}
          </label>
        </div>
      )) ?? null}
    </div>
  );

  // Render goals table with proper pagination
  const renderGoalsTable = () => {
    const goals = [];
    for (let i = 1; i <= 5; i++) {
      const goal = getValue(`goal${i}`);
      const rating = getValue(`rating${i}`);
      const actions = getValue(`actions${i}`);
      const byWhom = getValue(`byWhom${i}`);
      const byWhen = getValue(`byWhen${i}`);
      const reviewDate = getValue(`reviewDate${i}`);
      
      if (goal || rating || actions || byWhom || byWhen || reviewDate) {
        goals.push({ goal, rating, actions, byWhom, byWhen, reviewDate });
      }
    }

    // Calculate estimated height for each goal row
    const estimateGoalHeight = (goal: any) => {
      const goalText = goal.goal || '';
      const actionsText = goal.actions || '';
      
      // Estimate based on text length
      const goalLines = Math.ceil(goalText.length / 50);
      const actionsLines = Math.ceil(actionsText.length / 50);
      
      const maxLines = Math.max(goalLines, actionsLines, 3); // Minimum 3 lines
      const lineHeight = 20;
      const padding = 16; // 8px top + 8px bottom
      const borderHeight = 2;
      
      return (maxLines * lineHeight) + padding + borderHeight;
    };

    // Split goals into pages based on available height
    const maxPageHeight = 600; // Available height per page
    const tableHeaderHeight = 50;
    const availableHeight = maxPageHeight - tableHeaderHeight;
    
    const goalPages: Array<Array<{
      goal: string;
      rating: string;
      actions: string;
      byWhom: string;
      byWhen: string;
      reviewDate: string;
    }>> = [];
    let currentPageGoals: Array<{
      goal: string;
      rating: string;
      actions: string;
      byWhom: string;
      byWhen: string;
      reviewDate: string;
    }> = [];
    let currentPageHeight = 0;

    goals.forEach((goal, index) => {
      const goalHeight = estimateGoalHeight(goal);
      
      // If adding this goal would exceed page height, start a new page
      if (currentPageHeight + goalHeight > availableHeight && currentPageGoals.length > 0) {
        goalPages.push([...currentPageGoals]);
        currentPageGoals = [goal];
        currentPageHeight = goalHeight;
      } else {
        currentPageGoals.push(goal);
        currentPageHeight += goalHeight;
      }
    });

    // Add remaining goals to the last page
    if (currentPageGoals.length > 0) {
      goalPages.push(currentPageGoals);
    }

    // Render table header
    const renderTableHeader = () => (
      <thead style={{ display: 'table-header-group' }}>
        <tr>
          <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '30%' }}>GOAL</th>
          <th className="border border-black bg-gray-100 p-2 text-center font-bold" style={{ width: '15%' }}>RATING</th>
          <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '25%' }}>Actions & Resources</th>
          <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '10%' }}>By Whom</th>
          <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '10%' }}>By When</th>
          <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '10%' }}>Review Date</th>
        </tr>
      </thead>
    );

    // Render goal row
    const renderGoalRow = (goal: any, index: number) => (
      <tr key={`goal-row-${index}`}>
        <td className="border border-black p-2 align-top" style={{ width: '30%' }}>
          <div
            className="text-sm leading-relaxed break-words whitespace-pre-wrap"
            style={{
              minHeight: '60px',
              maxHeight: 'none',
              overflow: 'visible',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {goal.goal || ''}
          </div>
        </td>
        <td className="border border-black p-2 text-center align-top" style={{ width: '15%' }}>
          <div className="text-sm">{goal.rating || ''}</div>
        </td>
        <td className="border border-black p-2 align-top" style={{ width: '25%' }}>
          <div
            className="text-sm leading-relaxed break-words whitespace-pre-wrap"
            style={{
              minHeight: '60px',
              maxHeight: 'none',
              overflow: 'visible',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {goal.actions || ''}
          </div>
        </td>
        <td className="border border-black p-2 align-top" style={{ width: '10%' }}>
          <div className="text-sm">{goal.byWhom || ''}</div>
        </td>
        <td className="border border-black p-2 align-top" style={{ width: '10%' }}>
          <div className="text-sm">{goal.byWhen || ''}</div>
        </td>
        <td className="border border-black p-2 align-top" style={{ width: '10%' }}>
          <div className="text-sm">{goal.reviewDate || ''}</div>
        </td>
      </tr>
    );

    return (
      <div className="space-y-4 w-full overflow-hidden">
        {goalPages.map((pageGoals, pageIndex) => (
          <div key={`goals-page-${pageIndex}`} className="goals-table-page w-full overflow-hidden" style={{ pageBreakAfter: pageIndex < goalPages.length - 1 ? 'page' as any : 'auto' as any }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-sm table-fixed min-w-full">
                {renderTableHeader()}
                <tbody>
                  {pageGoals.map((goal, index) => renderGoalRow(goal, index))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render informal supports table
  const renderInformalSupportsTable = () => {
    const supports = [];
    for (let i = 1; i <= 4; i++) {
      const support = getValue(`support${i}`);
      const role = getValue(`role${i}`);
      const frequency = getValue(`frequency${i}`);
      
      if (support || role || frequency) {
        supports.push({ support, role, frequency });
      }
    }

    return (
      <div className="space-y-4" style={{ pageBreakInside: 'auto' }}>
        <table className="w-full border-collapse border border-black text-sm" style={{ pageBreakInside: 'auto' }}>
          <thead>
            <tr>
              <th className="border border-black bg-gray-100 p-2 text-left font-bold">INFORMAL SUPPORT</th>
              <th className="border border-black bg-gray-100 p-2 text-left font-bold">ROLE</th>
              <th className="border border-black bg-gray-100 p-2 text-left font-bold">FREQUENCY</th>
            </tr>
          </thead>
          <tbody>
            {supports.map((support, index) => (
              <tr key={`support-row-${index}`} style={{ pageBreakInside: 'avoid' }}>
                <td className="border border-black p-2 align-top">
                  <div className="text-sm">{support.support || ''}</div>
                </td>
                <td className="border border-black p-2 align-top">
                  <div className="text-sm">{support.role || ''}</div>
                </td>
                <td className="border border-black p-2 align-top">
                  <div className="text-sm">{support.frequency || ''}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render field content in table format like the reference image
  const renderField = (field: any, customContent?: string, item?: any) => {
    const content = customContent || getValue(field.key);
    
    if (field.type === 'cover') {
      return (
        <div className="flex items-center justify-center h-full min-h-[600px]">
          <img
            src="/person_centred_plan_cover_image.png"
            alt="Person Centred Plan Cover"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }
    
    if (field.type === 'goals_table') {
      // Check if this is an individual goal row or the full table
      if (item?.goalData) {
        // Render individual goal row with table header if it's the first goal
        return (
          <div className="goals-table-page w-full overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-sm table-fixed min-w-full">
                {item.goalIndex === 0 && (
                  <thead>
                    <tr>
                      <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '30%' }}>GOAL</th>
                      <th className="border border-black bg-gray-100 p-2 text-center font-bold" style={{ width: '15%' }}>RATING</th>
                      <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '25%' }}>Actions & Resources</th>
                      <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '10%' }}>By Whom</th>
                      <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '10%' }}>By When</th>
                      <th className="border border-black bg-gray-100 p-2 text-left font-bold" style={{ width: '10%' }}>Review Date</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  <tr>
                    <td className="border border-black p-2 align-top" style={{ width: '30%' }}>
                      <div
                        className="text-sm leading-relaxed break-words whitespace-pre-wrap"
                        style={{
                          minHeight: '80px',
                          maxHeight: 'none',
                          overflow: 'visible',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {item.goalData.goal || ''}
                      </div>
                    </td>
                    <td className="border border-black p-2 text-center align-top" style={{ width: '15%' }}>
                      <div className="text-sm">{item.goalData.rating || ''}</div>
                    </td>
                    <td className="border border-black p-2 align-top" style={{ width: '25%' }}>
                      <div
                        className="text-sm leading-relaxed break-words whitespace-pre-wrap"
                        style={{
                          minHeight: '80px',
                          maxHeight: 'none',
                          overflow: 'visible',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {item.goalData.actions || ''}
                      </div>
                    </td>
                    <td className="border border-black p-2 align-top" style={{ width: '10%' }}>
                      <div className="text-sm">{item.goalData.byWhom || ''}</div>
                    </td>
                    <td className="border border-black p-2 align-top" style={{ width: '10%' }}>
                      <div className="text-sm">{item.goalData.byWhen || ''}</div>
                    </td>
                    <td className="border border-black p-2 align-top" style={{ width: '10%' }}>
                      <div className="text-sm">{item.goalData.reviewDate || ''}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      } else {
        // Fallback to original table rendering
        return renderGoalsTable();
      }
    }
    
    if (field.type === 'informal_supports_table') {
      return renderInformalSupportsTable();
    }
    
    if (field.type === 'checkbox') {
      return (
        <table className="w-full border-collapse border border-black">
          <tbody>
            <tr>
              <td className="border border-black bg-gray-100 p-2 font-medium text-sm" style={{ width: '30%' }}>
                {field.label}
              </td>
              <td className="border border-black p-2 bg-white">
                {renderCheckbox(field.key, field.options || [])}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    
    // Regular text/textarea fields in table format - let pagination handle splitting
    return (
      <table className="w-full border-collapse border border-black mb-2">
        <tbody>
          <tr>
            <td 
              className="border border-black bg-gray-100 p-2 font-medium text-sm align-top" 
              style={{ width: '30%' }}
            >
              {field.label}
            </td>
            <td 
              className="border border-black p-2 bg-white align-top"
              style={{
                minHeight: field.type === 'textarea' ? '120px' : '80px',
                maxHeight: 'none',
                overflow: 'visible'
              }}
            >
              <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {content || ''}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // Split long content across multiple pages with aggressive splitting
  const splitLongContent = (content: string, fieldType: string, fieldKey?: string) => {
    if (!content || content.trim().length === 0) {
      return [{ content: '', fieldType }];
    }

    // Special handling for fields that should never split - keep them on single page
    const noSplitFields = ['myStory', 'strengths', 'challenges', 'allergies', 'companionCard', 'ambulanceCover'];
    if (noSplitFields.includes(fieldKey || '')) {
      console.log(`📖 ${fieldKey} field - keeping on single page (${content.length} chars)`);
      return [{ content, fieldType }];
    }
    
    // For short content (< 500 chars), don't split unless absolutely necessary
    if (content.length < 500) {
      console.log(`📝 Short content field (${content.length} chars) - keeping on single page`);
      return [{ content, fieldType }];
    }

    // Calculate content height more conservatively
    const charactersPerLine = 40; // More conservative
    const lines = Math.ceil(content.length / charactersPerLine);
    const lineHeight = 24; // Increased line height
    const cellPadding = 20; // More padding
    const labelHeight = 50; // More label height
    const borderHeight = 6; // More border height
    const spacing = 30; // More spacing
    const totalHeight = (lines * lineHeight) + cellPadding + labelHeight + borderHeight + spacing;

    // Maximum height per page - use the same calculation as main pagination with STRICT footer space
    const maxPageHeight = 501; // Available content height from main pagination (with increased footer buffer)
    const maxContentHeight = maxPageHeight - 100; // Extra buffer for content splitting to ensure footer space (401px max)

    console.log(`📏 Content analysis: ${content.length} chars, ${lines} lines, ${totalHeight}px (max: ${maxContentHeight}px)`);

    // If content fits in one page, return as is
    if (totalHeight <= maxContentHeight) {
      console.log(`✅ Content fits in one page`);
      return [{ content, fieldType }];
    }

    // Split content across multiple pages more aggressively
    const words = content.trim().split(/\s+/);
    const wordsPerPage = Math.floor(words.length * (maxContentHeight / totalHeight));
    
    console.log(`📄 Splitting ${words.length} words into pages of ~${wordsPerPage} words each`);
    
    const contentPages = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageWords = words.slice(i, i + wordsPerPage);
      const pageContent = pageWords.join(' ');
      contentPages.push({ content: pageContent, fieldType });
      console.log(`📝 Page ${contentPages.length}: ${pageContent.length} chars, ~${pageWords.length} words`);
    }

    console.log(`📚 Split into ${contentPages.length} pages`);
    return contentPages;
  };

  // Create pages with proper page breaks
  const pages = (() => {
    const pages: Array<Array<{
      section: any;
      field: any;
      showSectionTitle: boolean;
      questionNumber: number;
      estimatedHeight?: number;
      content?: string;
      goalData?: any;
      goalIndex?: number;
    }>> = [];
    let currentPage: Array<{
      section: any;
      field: any;
      showSectionTitle: boolean;
      questionNumber: number;
      estimatedHeight?: number;
      content?: string;
      goalData?: any;
      goalIndex?: number;
    }> = [];
    let currentPageHeight = 0;
    
    // A4 page dimensions: 210mm x 297mm = 794px x 1123px (at 96 DPI)
    const pageWidth = 794;
    const pageHeight = 1123;
    
    // Margins: 20mm = 76px on all sides
    const marginTop = 76;
    const marginBottom = 76;
    const marginLeft = 76;
    const marginRight = 76;
    
    // Header and footer heights
    const headerHeight = 140; // Logo + spacing
    const footerHeight = 80; // Footer content
    
    // Available content height = total page - margins - header - footer - buffer for footer space
    const footerBuffer = 150; // Increased buffer to ensure footer always has space and proper separation
    const availableContentHeight = pageHeight - marginTop - marginBottom - headerHeight - footerHeight - footerBuffer; // 501px with increased footer buffer
    
    // Critical: Minimum space required before footer - if content would exceed this, move to next page
    const minimumSpaceBeforeFooter = 100; // Minimum 100px space before footer
    
    console.log(`📏 STRICT MS Word-style pagination with footer protection:`);
    console.log(`  Page: ${pageWidth}x${pageHeight}px`);
    console.log(`  Margins: ${marginTop}px top, ${marginBottom}px bottom`);
    console.log(`  Header: ${headerHeight}px, Footer: ${footerHeight}px`);
    console.log(`  Footer buffer: ${footerBuffer}px, Minimum space before footer: ${minimumSpaceBeforeFooter}px`);
    console.log(`  Available content: ${availableContentHeight}px`);
    console.log(`  MAX content before footer: ${availableContentHeight - minimumSpaceBeforeFooter}px`);
    
    allFields.forEach((item, index) => {
      console.log(`\n🔍 Processing field ${index + 1}/${allFields.length}:`, item.field.label, item.field.type);
      
      if (item.field.type === 'cover') {
        // Cover page takes full content area
        pages.push([{ ...item, estimatedHeight: availableContentHeight }]);
        return;
      }
      
      if (item.field.type === 'goals_table') {
        // Goals table - split each goal row individually across pages
        const goals = [];
        for (let i = 1; i <= 5; i++) {
          const goal = getValue(`goal${i}`);
          const rating = getValue(`rating${i}`);
          const actions = getValue(`actions${i}`);
          const byWhom = getValue(`byWhom${i}`);
          const byWhen = getValue(`byWhen${i}`);
          const reviewDate = getValue(`reviewDate${i}`);
          
          if (goal || rating || actions || byWhom || byWhen || reviewDate) {
            goals.push({ goal, rating, actions, byWhom, byWhen, reviewDate });
          }
        }
        
        console.log(`📊 Goals table: ${goals.length} goals to split individually`);
        
        // Split each goal row across pages
        goals.forEach((goal, goalIndex) => {
          const goalText = goal.goal || '';
          const actionsText = goal.actions || '';
          
          // Calculate height for this specific goal row
          const goalLines = Math.ceil(goalText.length / 45);
          const actionsLines = Math.ceil(actionsText.length / 45);
          const maxLines = Math.max(goalLines, actionsLines, 2);
          
          const rowHeight = Math.max(80, maxLines * 22) + 20; // Row height
          const tableHeaderHeight = goalIndex === 0 ? 60 : 0; // Only first goal gets header
          const estimatedHeight = rowHeight + tableHeaderHeight;
          
          console.log(`📊 Goal ${goalIndex + 1}: ${goalText.length} chars, ${actionsText.length} chars, ${estimatedHeight}px`);
          
          // Check if this goal row fits on current page - STRICT footer space checking
          const remainingHeight = availableContentHeight - currentPageHeight;
          const wouldExceedFooterSpace = (currentPageHeight + estimatedHeight) > (availableContentHeight - minimumSpaceBeforeFooter);
          
          if (wouldExceedFooterSpace && currentPage.length > 0) {
            console.log(`📄 STRICT Page break for goal ${goalIndex + 1}! Current: ${currentPageHeight}px, Adding: ${estimatedHeight}px, Would exceed footer space by ${(currentPageHeight + estimatedHeight) - (availableContentHeight - minimumSpaceBeforeFooter)}px - Moving to next page`);
            pages.push([...currentPage]);
            currentPage = [{ ...item, goalData: goal, goalIndex, estimatedHeight }];
            currentPageHeight = estimatedHeight;
          } else {
            currentPage.push({ ...item, goalData: goal, goalIndex, estimatedHeight });
            currentPageHeight += estimatedHeight;
          }
        });
        return;
      }
      
      if (item.field.type === 'informal_supports_table') {
        const estimatedHeight = 300;
        const wouldExceedFooterSpace = (currentPageHeight + estimatedHeight) > (availableContentHeight - minimumSpaceBeforeFooter);
        
        if (wouldExceedFooterSpace && currentPage.length > 0) {
          console.log(`📄 STRICT Page break for informal supports table! Current: ${currentPageHeight}px, Adding: ${estimatedHeight}px, Would exceed footer space by ${(currentPageHeight + estimatedHeight) - (availableContentHeight - minimumSpaceBeforeFooter)}px - Moving to next page`);
          pages.push([...currentPage]);
          currentPage = [{ ...item, estimatedHeight }];
          currentPageHeight = estimatedHeight;
        } else {
          currentPage.push({ ...item, estimatedHeight });
          currentPageHeight += estimatedHeight;
        }
        return;
      }
      
      // Handle text/textarea fields with content splitting
      if (item.field.type === 'textarea' || item.field.type === 'text') {
        const content = getValue(item.field.key);
        if (content && content.length > 0) {
          // Split long content across pages
          const contentPages = splitLongContent(content, item.field.type, item.field.key);
          
          contentPages.forEach((contentPage, pageIndex) => {
            // Calculate height for this content page
            const charactersPerLine = 45;
            const lines = Math.ceil(contentPage.content.length / charactersPerLine);
            const lineHeight = 22;
            const cellPadding = 16;
            const labelHeight = 40;
            const borderHeight = 4;
            const spacing = 20;
            const estimatedHeight = Math.max(80, (lines * lineHeight) + cellPadding + labelHeight + borderHeight + spacing);
            
            // No section title height needed since we removed section titles
            const finalHeight = estimatedHeight;
            
            console.log(`📝 ${item.field.type} page ${pageIndex + 1}: ${contentPage.content.length} chars, ${lines} lines, ${finalHeight}px`);
            
            // Check if this content page fits on current page - STRICT footer space checking
            const wouldExceedFooterSpace = (currentPageHeight + finalHeight) > (availableContentHeight - minimumSpaceBeforeFooter);
            
            // If this is a continuation of the same field and we're on the same page, combine them
            if (pageIndex > 0 && currentPage.length > 0) {
              const lastItem = currentPage[currentPage.length - 1];
              if (lastItem && lastItem.field.key === item.field.key && lastItem.content) {
                // Check if combining would exceed footer space
                const combinedHeight = Math.max(finalHeight, lastItem.estimatedHeight || 0);
                const wouldCombinedExceedFooterSpace = (currentPageHeight - (lastItem.estimatedHeight || 0) + combinedHeight) > (availableContentHeight - minimumSpaceBeforeFooter);
                
                if (wouldCombinedExceedFooterSpace) {
                  console.log(`📄 STRICT Page break for combined content! Would exceed footer space - Moving to next page`);
                  pages.push([...currentPage]);
                  currentPage = [{ ...item, content: contentPage.content, estimatedHeight: finalHeight }];
                  currentPageHeight = finalHeight;
                } else {
                  // Combine the content instead of splitting
                  const combinedContent = lastItem.content + ' ' + contentPage.content;
                  
                  console.log(`🔄 Combining content for ${item.field.key} instead of splitting (${combinedContent.length} chars)`);
                  
                  // Update the last item with combined content
                  currentPage[currentPage.length - 1] = {
                    ...lastItem,
                    content: combinedContent,
                    estimatedHeight: combinedHeight
                  };
                  currentPageHeight = currentPageHeight - (lastItem.estimatedHeight || 0) + combinedHeight;
                }
              } else {
                // Break to new page if content would exceed footer space
                if (wouldExceedFooterSpace && currentPage.length > 0) {
                  console.log(`📄 STRICT Page break for content! Current: ${currentPageHeight}px, Adding: ${finalHeight}px, Would exceed footer space by ${(currentPageHeight + finalHeight) - (availableContentHeight - minimumSpaceBeforeFooter)}px - Moving to next page`);
                  pages.push([...currentPage]);
                  currentPage = [{ ...item, content: contentPage.content, estimatedHeight: finalHeight }];
                  currentPageHeight = finalHeight;
                } else {
                  currentPage.push({ ...item, content: contentPage.content, estimatedHeight: finalHeight });
                  currentPageHeight += finalHeight;
                }
              }
            } else {
              // Break to new page if content would exceed footer space
              if (wouldExceedFooterSpace && currentPage.length > 0) {
                console.log(`📄 STRICT Page break for content! Current: ${currentPageHeight}px, Adding: ${finalHeight}px, Would exceed footer space by ${(currentPageHeight + finalHeight) - (availableContentHeight - minimumSpaceBeforeFooter)}px - Moving to next page`);
                pages.push([...currentPage]);
                currentPage = [{ ...item, content: contentPage.content, estimatedHeight: finalHeight }];
                currentPageHeight = finalHeight;
              } else {
                currentPage.push({ ...item, content: contentPage.content, estimatedHeight: finalHeight });
                currentPageHeight += finalHeight;
              }
            }
          });
        } else {
          // Empty content - add with base height using STRICT footer space checking
          const estimatedHeight = 80;
          const wouldExceedFooterSpace = (currentPageHeight + estimatedHeight) > (availableContentHeight - minimumSpaceBeforeFooter);
          
          if (wouldExceedFooterSpace && currentPage.length > 0) {
            console.log(`📄 STRICT Page break for empty content! Current: ${currentPageHeight}px, Adding: ${estimatedHeight}px, Would exceed footer space - Moving to next page`);
            pages.push([...currentPage]);
            currentPage = [{ ...item, estimatedHeight }];
            currentPageHeight = estimatedHeight;
          } else {
            currentPage.push({ ...item, estimatedHeight });
            currentPageHeight += estimatedHeight;
          }
        }
        return;
      }
      
      // Default case for other field types using STRICT footer space checking
      const estimatedHeight = 100;
      const wouldExceedFooterSpace = (currentPageHeight + estimatedHeight) > (availableContentHeight - minimumSpaceBeforeFooter);
      
      if (wouldExceedFooterSpace && currentPage.length > 0) {
        console.log(`📄 STRICT Page break for other field! Current: ${currentPageHeight}px, Adding: ${estimatedHeight}px, Would exceed footer space by ${(currentPageHeight + estimatedHeight) - (availableContentHeight - minimumSpaceBeforeFooter)}px - Moving to next page`);
        pages.push([...currentPage]);
        currentPage = [{ ...item, estimatedHeight }];
        currentPageHeight = estimatedHeight;
      } else {
        currentPage.push({ ...item, estimatedHeight });
        currentPageHeight += estimatedHeight;
      }
      
      console.log(`✅ Added to page. Current height: ${currentPageHeight}px / ${availableContentHeight}px`);
    });
    
    // Add remaining fields to last page with STRICT footer space validation
    if (currentPage.length > 0) {
      // STRICT Safety check: if the last page would exceed footer space, split it
      const wouldLastPageExceedFooterSpace = currentPageHeight > (availableContentHeight - minimumSpaceBeforeFooter);
      
      if (wouldLastPageExceedFooterSpace) {
        console.log(`⚠️ Last page would exceed footer space: ${currentPageHeight}px > ${availableContentHeight - minimumSpaceBeforeFooter}px, splitting...`);
        // Move the last item to a new page
        const lastItem = currentPage.pop();
        if (currentPage.length > 0) {
          pages.push(currentPage);
        }
        if (lastItem) {
          pages.push([lastItem]);
        }
      } else {
        pages.push(currentPage);
      }
    }
    
    return pages;
  })();
  
  console.log(`📄 Created ${pages.length} pages`);
  console.log('📋 PAGE BREAKDOWN:');
  pages.forEach((page, index) => {
    console.log(`  Page ${index + 1} (${page.length} fields):`);
    page.forEach(field => {
      console.log(`    - ${field.section.title}: ${field.field.label} (${field.field.type})`);
    });
  });
  console.log('');

  // Render pages with proper A4 structure and headers/footers
  return (
    <>
      {pages.map((pageFields, pageIndex) => (
        <div 
          key={pageIndex}
          className="w-[210mm] h-[297mm] mx-auto mb-8 bg-white shadow-lg border border-gray-300 flex flex-col print:shadow-none print:mb-0 print:border-none print:break-after-page"
          style={{
            width: '210mm',
            height: '297mm',
            minWidth: '210mm',
            minHeight: '297mm',
            maxWidth: '100%'
          }}
        >
          {/* Header */}
          <div className="pt-[12mm] px-[20mm]">
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                <img
                  src="/infinity_logo.png"
                  alt="Infinity Supports WA logo"
                  className="object-contain max-w-full max-h-full"
                  style={{ height: '80px', width: '200px' }}
                />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 px-[20mm] overflow-hidden">
            <div className="text-black leading-relaxed font-sans" style={{ fontSize: '12px' }}>
              <div className="space-y-3 w-full">
                {pageFields.map((item, index) => {
                  console.log(`Rendering field ${index}:`, item.section.title, item.field.label, item.field.type);
                  
                  // Skip cover page rendering as it's handled specially
                  if (item.field.type === 'cover') {
                    return (
                      <div key={`cover-${pageIndex}`}>
                        {renderField(item.field, item.content, item)}
                      </div>
                    );
                  }
                  
                  return (
                    <div key={`field-${pageIndex}-${index}-${item.field.key}`} className="field-container mb-2">
                      {renderField(item.field, item.content, item)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-auto pt-4 pb-[20mm] px-[20mm]" style={{ minHeight: '60px' }}>
            <div className="flex justify-between items-center text-xs text-gray-700 w-full max-w-full overflow-hidden">
              <div className="flex-shrink-0 max-w-[30%] overflow-hidden">
                <a className="text-blue-600 underline truncate block" href="https://www.infinitysupportswa.org" target="_blank" rel="noopener noreferrer">
                  www.infinitysupportswa.org
                </a>
              </div>
              <div className="text-center flex-shrink-0 px-2">
                <span>PCP-001</span>
              </div>
              <div className="text-right flex-shrink-0 max-w-[30%] overflow-hidden">
                <span className="truncate block">Date of Report: {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContentAwarePagination;
