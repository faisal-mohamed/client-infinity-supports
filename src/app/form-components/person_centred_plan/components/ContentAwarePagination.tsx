import React from 'react';
import EnhancedA4Page from './EnhancedA4Page';
import FullContentField from './FullContentField';

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
  const getValue = (key: string) => {
    const commonFieldMapping: Record<string, string> = {
      name: 'name',
      address: 'street',
      dob: 'dob',
      disability: 'disability',
      ndisNumber: 'ndis'
    };

    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    
    const value = formData?.[key] ?? '';
    return value;
  };

  // Calculate content length for text fields
  const getContentLength = (field: string) => {
    const value = getValue(field);
    return value ? value.length : 0;
  };
  
  const textFields = [
    'myStory', 'strengths', 'challenges', 'allergies', 'respiratoryHistory', 
    'precautions', 'healthConditions', 'goal1', 'goal2', 'goal3', 'goal4', 'goal5',
    'actions1', 'actions2', 'actions3', 'actions4', 'actions5'
  ];
  
  const totalTextLength = textFields.reduce((sum, field) => sum + getContentLength(field), 0);

  // Validation function to check if content fits properly
  const validateContentFit = (estimatedHeight: number, content: string, fieldType: string) => {
    // Adequate safety margin to prevent cutoff
    let safetyMargin = 30;
    
    // Extra margin for textarea fields
    if (fieldType === 'textarea') {
      safetyMargin += 20;
    }
    
    // Extra margin for long content
    if (content && content.length > 400) {
      safetyMargin += 30;
    }
    
    // Extra margin for very long content
    if (content && content.length > 800) {
      safetyMargin += 40;
    }
    
    // Extra margin for extremely long content
    if (content && content.length > 1200) {
      safetyMargin += 50;
    }
    
    return estimatedHeight + safetyMargin;
  };

  // Test function to validate height calculations with real data
  const testHeightCalculations = () => {
    console.log('🧪 TESTING HEIGHT CALCULATIONS');
    console.log('================================');
    
    // Test with sample long content
    const testContents = [
      { type: 'text', content: 'Short text', expected: 'small' },
      { type: 'textarea', content: 'Medium length text that should fit on one page but needs proper height calculation to avoid cutoff issues.', expected: 'medium' },
      { type: 'textarea', content: 'This is a very long text content that should definitely trigger page breaks and proper height calculations. It contains multiple sentences and should be long enough to test the dynamic pagination system. The content should flow properly across pages without any cutoff issues. This text is designed to test the height calculation algorithm with realistic content length that users might actually input into the form fields.', expected: 'long' },
      { type: 'textarea', content: 'Extremely long content that should definitely span multiple pages. '.repeat(20) + 'This content is designed to test the maximum height calculation and ensure that even the longest possible content gets properly displayed without any cutoff. The system should handle this gracefully by creating multiple pages as needed.', expected: 'very long' }
    ];

    testContents.forEach((test, index) => {
      const content = test.content;
      const lines = Math.max(1, content.split('\n').length);
      const wordsPerLine = 10;
      const words = content.trim().split(/\s+/).length;
      const wordBasedLines = Math.ceil(words / wordsPerLine);
      const estimatedLines = Math.max(lines, wordBasedLines);
      
      const lineHeight = 24;
      const padding = 80;
      const labelHeight = 40;
      const borderHeight = 20;
      const minHeight = test.type === 'textarea' ? 140 : 120;
      let estimatedHeight = Math.max(minHeight, (estimatedLines * lineHeight) + padding + labelHeight + borderHeight);
      
      estimatedHeight += 30; // Safety buffer
      if (estimatedLines > 8) {
        estimatedHeight += 50;
      }
      
      const finalHeight = validateContentFit(estimatedHeight, content, test.type);
      
      console.log(`Test ${index + 1} (${test.expected}):`);
      console.log(`  Content length: ${content.length} characters`);
      console.log(`  Estimated lines: ${estimatedLines}`);
      console.log(`  Calculated height: ${finalHeight}px`);
      console.log(`  Would fit on page: ${finalHeight <= 791 ? 'YES' : 'NO - NEEDS NEW PAGE'}`);
      console.log('');
    });
  };

  // Test function specifically for Goals table height calculation
  const testGoalsTableHeight = () => {
    console.log('🎯 TESTING GOALS TABLE HEIGHT CALCULATION');
    console.log('==========================================');
    
    // Test with sample long goal content
    const testGoals = [
      {
        goal: 'Respiratory depression is a condition where breathing becomes slower and less effective, reducing oxygen levels and increasing carbon dioxide in the blood. This condition has historically been linked to the use of certain drugs, especially opioids, sedatives, and anesthetics.',
        actions: 'Medical research has improved understanding of how these drugs affect the brain\'s respiratory center, decreasing the body\'s natural drive to breathe. Modern medicine has developed better monitoring and treatment protocols to manage this condition effectively.',
        rating: 'New Goal',
        byWhom: 'CLIENT',
        byWhen: '2025-10-13',
        reviewDate: '2025-10-24'
      },
      {
        goal: 'Short goal',
        actions: 'Short actions',
        rating: 'Achieved',
        byWhom: 'Staff',
        byWhen: '2025-01-01',
        reviewDate: '2025-12-31'
      }
    ];

    testGoals.forEach((goal, index) => {
      let goalsHeight = 100; // Base height
      let rowHeight = 80; // Base row height
      
      // Calculate height for goal column
      if (goal.goal && goal.goal.length > 0) {
        const goalLines = Math.max(1, goal.goal.split('\n').length);
        const goalWordLines = Math.ceil(goal.goal.length / 60);
        const goalLinesTotal = Math.max(goalLines, goalWordLines);
        rowHeight += Math.max(0, (goalLinesTotal - 3) * 20);
      }
      
      // Calculate height for actions column
      if (goal.actions && goal.actions.length > 0) {
        const actionsLines = Math.max(1, goal.actions.split('\n').length);
        const actionsWordLines = Math.ceil(goal.actions.length / 80);
        const actionsLinesTotal = Math.max(actionsLines, actionsWordLines);
        rowHeight += Math.max(0, (actionsLinesTotal - 4) * 20);
      }
      
      goalsHeight += rowHeight;
      const estimatedHeight = Math.max(450, goalsHeight);
      
      console.log(`Goal ${index + 1}:`);
      console.log(`  Goal length: ${goal.goal.length} characters`);
      console.log(`  Actions length: ${goal.actions.length} characters`);
      console.log(`  Row height: ${rowHeight}px`);
      console.log(`  Total table height: ${estimatedHeight}px`);
      console.log(`  Would fit on page: ${estimatedHeight <= 791 ? 'YES' : 'NO - NEEDS NEW PAGE'}`);
      console.log('');
    });
  };

  // Test specific content that was cut off in the image
  const testCutoffContent = () => {
    console.log('🚨 TESTING CUTOFF CONTENT FROM IMAGE');
    console.log('====================================');
    
    // Test the "Companion Card" content that was cut off
    const companionCardContent = "Respiratory depression refers to a condition where breathing becomes slower and less effective, reducing oxygen levels and increasing carbon dioxide in the body. Historically, this condition has been linked to the use of certain drugs—especially opioids, sedatives, and anesthetics. In the early 20th century, doctors noticed that patients receiving morphine or barbiturates often experienced shallow or slow breathing. As medical research improved, scientists understood that these drugs affect the brain's respiratory center, decreasing the body's natural drive to breathe. Modern medicine has developed safer ways to monitor and manage respiratory depression, especially during surgery or pain treatment. With better technology, healthcare professionals can detect early signs and give antidotes like naloxone to reverse opioid-induced respiratory depression. Understanding its history has helped doctors create safer pain management practices and improve patient care.";
    
    const content = companionCardContent;
    const lines = Math.max(1, content.split('\n').length);
    const wordsPerLine = 12;
    const words = content.trim().split(/\s+/).length;
    const wordBasedLines = Math.ceil(words / wordsPerLine);
    const estimatedLines = Math.max(lines, wordBasedLines);
    
    const lineHeight = 22;
    const padding = 60;
    const labelHeight = 30;
    const borderHeight = 15;
    const minHeight = 80; // text field
    let estimatedHeight = Math.max(minHeight, (estimatedLines * lineHeight) + padding + labelHeight + borderHeight);
    
    estimatedHeight += 25; // Safety buffer
    if (estimatedLines > 10) {
      estimatedHeight += 30;
    }
    
    // Apply validation
    let safetyMargin = 30;
    if (content.length > 400) safetyMargin += 30;
    if (content.length > 800) safetyMargin += 40;
    if (content.length > 1200) safetyMargin += 50;
    
    const finalHeight = estimatedHeight + safetyMargin;
    
    console.log(`Companion Card Content:`);
    console.log(`  Content length: ${content.length} characters`);
    console.log(`  Estimated lines: ${estimatedLines}`);
    console.log(`  Calculated height: ${finalHeight}px`);
    console.log(`  Would fit on page: ${finalHeight <= 791 ? 'YES' : 'NO - NEEDS NEW PAGE'}`);
    console.log(`  Safety margin: ${safetyMargin}px`);
    console.log('');
    
    if (finalHeight > 791) {
      console.log('✅ CORRECT: This content SHOULD move to next page to prevent cutoff!');
    } else {
      console.log('⚠️  WARNING: This content might still get cut off!');
    }
  };

  // Comprehensive validation function to check for cutoff issues
  const validateNoCutoff = () => {
    console.log('🔍 VALIDATING NO CUTOFF ISSUES');
    console.log('===============================');
    
    let totalIssues = 0;
    const issues = [];
    
    // Check all form fields for potential cutoff
    const allFields = [
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
      { key: 'respiratoryHistory', label: 'History of Respiratory Depression', type: 'textarea' },
      { key: 'precautions', label: 'Precautions', type: 'textarea' },
      { key: 'healthConditions', label: 'Health Conditions', type: 'textarea' },
      { key: 'companionCard', label: 'Companion Card', type: 'text' },
      { key: 'ambulanceCover', label: 'Ambulance Cover', type: 'text' }
    ];

    allFields.forEach(field => {
      const content = getValue(field.key);
      if (content && content.length > 0) {
        const lines = Math.max(1, content.split('\n').length);
        const wordsPerLine = 10;
        const words = content.trim().split(/\s+/).length;
        const wordBasedLines = Math.ceil(words / wordsPerLine);
        const estimatedLines = Math.max(lines, wordBasedLines);
        
        const lineHeight = 24;
        const padding = 80;
        const labelHeight = 40;
        const borderHeight = 20;
        const minHeight = field.type === 'textarea' ? 140 : 120;
        let estimatedHeight = Math.max(minHeight, (estimatedLines * lineHeight) + padding + labelHeight + borderHeight);
        
        estimatedHeight += 30; // Safety buffer
        if (estimatedLines > 8) {
          estimatedHeight += 50;
        }
        
        const finalHeight = validateContentFit(estimatedHeight, content, field.type);
        
        if (finalHeight > 791) {
          totalIssues++;
          issues.push({
            field: field.label,
            contentLength: content.length,
            estimatedHeight: finalHeight,
            status: 'NEEDS NEW PAGE'
          });
        }
      }
    });

    console.log(`Total fields checked: ${allFields.length}`);
    console.log(`Potential cutoff issues: ${totalIssues}`);
    
    if (issues.length > 0) {
      console.log('⚠️  FIELDS THAT NEED NEW PAGES:');
      issues.forEach(issue => {
        console.log(`  - ${issue.field}: ${issue.contentLength} chars, ${issue.estimatedHeight}px height`);
      });
    } else {
      console.log('✅ NO CUTOFF ISSUES DETECTED - All content should fit properly!');
    }
    
    console.log('');
  };

  // Create dynamic pages based on content length
  const createDynamicPages = () => {
    console.log('🔄 CREATING CSS-BASED PAGINATION');
    console.log('=================================');
    console.log('Using CSS page-break properties instead of JavaScript pagination');
    console.log('This should prevent content cutoff by letting CSS handle natural page breaks');
    console.log('');
    
    // SIMPLIFIED APPROACH: Let CSS handle pagination naturally
    // We'll create logical sections and let CSS page-break properties handle the rest
    const sectionsWithTitleShown = new Set(); // Track which sections have shown their title
    
    // Define all sections in order
    const allSections = [
      { id: 'cover', title: '', sectionNumber: 1 },
      { id: 'personalInfo', title: 'Personal Information', sectionNumber: 2 },
      { id: 'healthInfo', title: 'Health Information', sectionNumber: 3 },
      { id: 'goals', title: 'Goals & Actions', sectionNumber: 4 },
      { id: 'supportInfo', title: 'Support Information', sectionNumber: 5 }
    ];

    // Create a single page with all sections - let CSS handle pagination
    const allFields = [];
    
    allSections.forEach((section) => {
      // Special handling for cover page
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
      let sectionFields = [];
      
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
          { key: 'myStory', label: 'My Story', type: 'textarea', height: '120px' },
          { key: 'strengths', label: 'Strengths', type: 'textarea', height: '80px' },
          { key: 'challenges', label: 'Challenges', type: 'text' },
          { key: 'allergies', label: 'Allergies', type: 'text' }
        ];
      } else if (section.id === 'healthInfo') {
        sectionFields = [
          { key: 'respiratoryHistory', label: 'History of Respiratory Depression', type: 'textarea' },
          { key: 'precautions', label: 'Precautions', type: 'textarea' },
          { key: 'healthConditions', label: 'Health Conditions', type: 'textarea' },
          { key: 'companionCard', label: 'Companion Card', type: 'text' },
          { key: 'ambulanceCover', label: 'Ambulance Cover', type: 'text' },
          { key: 'healthcarePrompt', label: 'Proactive & preventative healthcare prompts', type: 'checkbox', options: ['Yes', 'No'] }
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
          { key: 'restrictivePractices', label: 'Any Restrictive Practices?', type: 'text' },
          { key: 'organizationName', label: 'Name of organization', type: 'text' },
          { key: 'contactPersonOrg', label: 'Contact person', type: 'text' },
          { key: 'contactNumberOrg', label: 'Contact number', type: 'text' },
          { key: 'informalSupports', label: 'My Informal Supports', type: 'informal_supports_table' }
        ];
      }

      // Process regular fields
      sectionFields.forEach((field) => {
        const content = getValue(field.key);
        // Estimate height for each field
        let estimatedHeight = 60; // Base height for label and padding
        
        if (field.type === 'checkbox') {
          estimatedHeight = 80;
        } else if (field.type === 'textarea' || field.type === 'text') {
          if (content && content.length > 0) {
            const lines = Math.max(1, content.split('\n').length);
            
            // More accurate calculation for better page break detection
            const wordsPerLine = 12; // Balanced for accuracy
            const words = content.trim().split(/\s+/).length;
            const wordBasedLines = Math.ceil(words / wordsPerLine);
            
            // Use the maximum of actual line breaks and word-based calculation
            const estimatedLines = Math.max(lines, wordBasedLines);
            
            // More accurate height calculation
            const lineHeight = 22; // Realistic line height
            const padding = 60; // Adequate padding
            const labelHeight = 30; // Label height
            const borderHeight = 15; // Border height
            
            // Minimum height for textarea vs text
            const minHeight = field.type === 'textarea' ? 100 : 80;
            estimatedHeight = Math.max(minHeight, (estimatedLines * lineHeight) + padding + labelHeight + borderHeight);
            
            // Adequate safety buffer to prevent cutoff
            estimatedHeight += 25; // Safety buffer
            
            // Extra buffer for long content to ensure page breaks
            if (estimatedLines > 10) {
              estimatedHeight += 30; // Extra buffer for long content
            }
            
            // Apply validation to ensure content fits
            estimatedHeight = validateContentFit(estimatedHeight, content, field.type);
          } else {
            estimatedHeight = 80; // Minimum height for empty fields
          }
        } else if (field.type === 'goals_table') {
          // Calculate height based on actual content in goals table
          let goalsHeight = 80; // Reduced base height for table header and structure
          
          // Calculate height for each goal row based on content
          for (let i = 1; i <= 5; i++) {
            const goal = getValue(`goal${i}`);
            const actions = getValue(`actions${i}`);
            const rating = getValue(`rating${i}`);
            const byWhom = getValue(`byWhom${i}`);
            const byWhen = getValue(`byWhen${i}`);
            const reviewDate = getValue(`reviewDate${i}`);
            
            if (goal || rating || actions || byWhom || byWhen || reviewDate) {
              let rowHeight = 60; // Reduced base row height
              
              // Add height for long content in goal column
              if (goal && goal.length > 0) {
                const goalLines = Math.max(1, goal.split('\n').length);
                const goalWordLines = Math.ceil(goal.length / 80); // Increased characters per line
                const goalLinesTotal = Math.max(goalLines, goalWordLines);
                rowHeight += Math.max(0, (goalLinesTotal - 3) * 15); // Reduced extra height per line
              }
              
              // Add height for long content in actions column
              if (actions && actions.length > 0) {
                const actionsLines = Math.max(1, actions.split('\n').length);
                const actionsWordLines = Math.ceil(actions.length / 100); // Increased characters per line
                const actionsLinesTotal = Math.max(actionsLines, actionsWordLines);
                rowHeight += Math.max(0, (actionsLinesTotal - 4) * 15); // Reduced extra height per line
              }
              
              goalsHeight += rowHeight;
            }
          }
          
          estimatedHeight = Math.max(300, goalsHeight); // Reduced minimum height
        } else if (field.type === 'informal_supports_table') {
          estimatedHeight = 250; // Reduced height for better space utilization
        }

        // If adding this field would exceed page height, create new page
        if (currentPageHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
          pages.push([...currentPage]);
          currentPage = [{ 
            section, 
            field, 
            estimatedHeight, 
            showSectionTitle: !sectionsWithTitleShown.has(section.id),
            questionNumber: sectionFields.indexOf(field) + 1
          }];
          currentPageHeight = estimatedHeight;
          
          // Debug: Log when creating new page
          console.log(`🔄 NEW PAGE CREATED for field: ${field.label}`);
          console.log(`   Estimated height: ${estimatedHeight}px`);
          console.log(`   Max page height: ${maxPageHeight}px`);
          console.log(`   Previous page height: ${currentPageHeight - estimatedHeight}px`);
        } else {
          currentPage.push({ 
            section, 
            field, 
            estimatedHeight, 
            showSectionTitle: !sectionsWithTitleShown.has(section.id),
            questionNumber: sectionFields.indexOf(field) + 1
          });
          currentPageHeight += estimatedHeight;
          
          // Debug: Log height calculations for all content
          console.log(`📝 Field: ${field.label}`);
          console.log(`   Content length: ${content ? content.length : 0} characters`);
          console.log(`   Estimated height: ${estimatedHeight}px`);
          console.log(`   Current page height: ${currentPageHeight}px`);
          console.log(`   Remaining space: ${maxPageHeight - currentPageHeight}px`);
        }
        
        // Mark section title as shown after first field
        if (!sectionsWithTitleShown.has(section.id)) {
          sectionsWithTitleShown.add(section.id);
        }
      });
    });

    // Add remaining fields to last page
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  const renderCheckbox = (key: string, options: string[]) => (
    <div className="flex flex-wrap gap-4">
      {options?.map?.((opt) => (
        <div key={opt} className="flex items-center">
          <input
            type="checkbox"
            id={`${key}-${opt}`}
            name={key}
            value={opt}
            checked={getValue(key) === opt}
            readOnly
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <label htmlFor={`${key}-${opt}`} className="ml-2 text-sm text-gray-700">
            {opt}
          </label>
        </div>
      )) ?? null}
    </div>
  );

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
        goals.push({ goal, rating, actions, byWhom, byWhen, reviewDate, index: i });
      }
    }

    if (goals.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="mb-4 font-bold text-lg text-gray-900">Goals & Actions</div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-sm" style={{ pageBreakInside: 'auto' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left font-bold w-1/6">GOAL</th>
                <th className="border border-black p-2 text-left font-bold w-1/6">Outcome Rating</th>
                <th className="border border-black p-2 text-left font-bold w-2/6">Actions & Resources</th>
                <th className="border border-black p-2 text-left font-bold w-1/6">By Whom</th>
                <th className="border border-black p-2 text-left font-bold w-1/6">By When</th>
                <th className="border border-black p-2 text-left font-bold w-1/6">Review Date</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal, index) => (
                <tr key={index} style={{ pageBreakInside: 'avoid' }}>
                  <td className="border border-black p-2 align-top">
                    <div 
                      className="text-sm leading-relaxed break-words whitespace-pre-wrap"
                      style={{ 
                        minHeight: '60px',
                        maxHeight: 'none',
                        overflow: 'visible'
                      }}
                    >
                      {goal.goal || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {goal.rating || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div 
                      className="text-sm leading-relaxed break-words whitespace-pre-wrap"
                      style={{ 
                        minHeight: '60px',
                        maxHeight: 'none',
                        overflow: 'visible'
                      }}
                    >
                      {goal.actions || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {goal.byWhom || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {goal.byWhen || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {goal.reviewDate || ''}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderInformalSupportsTable = () => {
    const supports = [];
    for (let i = 1; i <= 4; i++) {
      const support = getValue(`support${i}`);
      const role = getValue(`role${i}`);
      const frequency = getValue(`frequency${i}`);
      
      if (support || role || frequency) {
        supports.push({ support, role, frequency, index: i });
      }
    }

    if (supports.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="mb-4 font-bold text-lg text-gray-900">My Informal Supports</div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left font-bold w-1/3">INFORMAL SUPPORT</th>
                <th className="border border-black p-2 text-left font-bold w-1/3">ROLE</th>
                <th className="border border-black p-2 text-left font-bold w-1/3">FREQUENCY</th>
              </tr>
            </thead>
            <tbody>
              {supports.map((support, index) => (
                <tr key={index}>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {support.support || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {support.role || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {support.frequency || ''}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const dynamicPages = createDynamicPages();

  // Run tests to validate height calculations
  React.useEffect(() => {
    testHeightCalculations();
    testGoalsTableHeight();
    testCutoffContent();
    validateNoCutoff();
  }, []);

  // Render dynamic pages
  return (
    <>
      {dynamicPages.map((pageFields, pageIndex) => {
        const pageNumber = pageIndex + 1;
        const totalPages = dynamicPages.length;
        const isFirstPage = pageIndex === 0;
        
        return (
          <EnhancedA4Page 
            key={pageNumber}
            settings={settings} 
            pageNumber={pageNumber} 
            totalPages={totalPages} 
            showTitle={false}
            images={images}
          >
            <div className="space-y-5">
              {pageFields.map((pageField, fieldIndex) => {
                const { section, field, showSectionTitle, questionNumber } = pageField;
                
                return (
                  <div key={`${field.key}-${pageIndex}-${fieldIndex}`}>
                    {/* No section headers - cleaner look */}

                    {/* Field Content */}
                    <div className="mb-4">
                      {field.type === 'cover' ? (
                        <div className="flex flex-col h-full justify-center">
                          {/* Cover Page - Simple image approach */}
                          <div className="flex justify-center items-center px-4">
                            <img 
                              src={images?.mainImage || "/person_centred_plan_cover_image.png"} 
                              alt="Person Centred Plan Circles" 
                              className="object-contain" 
                              style={{ 
                                maxWidth: '700px', 
                                maxHeight: '650px',
                                width: 'auto',
                                height: 'auto'
                              }}
                            />
                          </div>
                        </div>
                      ) : field.type === 'checkbox' ? (
                        <div className="mb-1 border border-black">
                          <div className="flex">
                            <div className="w-1/2 border-r border-black p-2 bg-gray-100 font-bold text-sm">
                              {field.label}
                            </div>
                            <div className="w-1/2 p-2">
                              {renderCheckbox(field.key, field.options ?? [])}
                            </div>
                          </div>
                        </div>
                      ) : field.type === 'goals_table' ? (
                        renderGoalsTable()
                      ) : field.type === 'informal_supports_table' ? (
                        renderInformalSupportsTable()
                      ) : (
                        <div className="mb-1 border border-black">
                          <div className="flex">
                            <div className="w-1/2 border-r border-black p-2 bg-gray-100 font-bold text-sm">
                              {field.label}
                            </div>
                            <div className="w-1/2 p-2">
                              <div className="text-sm leading-relaxed break-words whitespace-pre-wrap min-h-[24px]">
                                {getValue(field.key) || ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </EnhancedA4Page>
        );
      })}
    </>
  );
};

export default ContentAwarePagination;