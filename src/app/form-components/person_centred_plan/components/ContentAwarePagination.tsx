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

  // Create dynamic pages based on content length
  const createDynamicPages = () => {
    const pages = [];
    let currentPage = [];
    let currentPageHeight = 0;
    const maxPageHeight = 800; // Maximum height per page
    const sectionsWithTitleShown = new Set(); // Track which sections have shown their title
    
    // Define all sections in order
    const allSections = [
      { id: 'cover', title: '', sectionNumber: 1 },
      { id: 'personalInfo', title: 'Personal Information', sectionNumber: 2 },
      { id: 'healthInfo', title: 'Health Information', sectionNumber: 3 },
      { id: 'goals', title: 'Goals & Actions', sectionNumber: 4 },
      { id: 'supportInfo', title: 'Support Information', sectionNumber: 5 }
    ];

    allSections.forEach((section) => {
      // Special handling for cover page
      if (section.id === 'cover') {
        const coverHeight = 600; // Cover page height
        
        if (currentPageHeight + coverHeight > maxPageHeight && currentPage.length > 0) {
          pages.push([...currentPage]);
          currentPage = [];
          currentPageHeight = 0;
        }
        
        currentPage.push({ 
          section, 
          field: { key: 'cover', type: 'cover' }, 
          estimatedHeight: coverHeight, 
          showSectionTitle: false,
          questionNumber: 0
        });
        currentPageHeight += coverHeight;
        
        // Always create new page after cover
        pages.push([...currentPage]);
        currentPage = [];
        currentPageHeight = 0;
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
        // Goals table - special handling
        const goalsHeight = 400; // Estimated height for goals table
        
        if (currentPageHeight + goalsHeight > maxPageHeight && currentPage.length > 0) {
          pages.push([...currentPage]);
          currentPage = [];
          currentPageHeight = 0;
        }
        
        currentPage.push({ 
          section, 
          field: { key: 'goals', type: 'goals_table' }, 
          estimatedHeight: goalsHeight, 
          showSectionTitle: !sectionsWithTitleShown.has(section.id),
          questionNumber: 0
        });
        currentPageHeight += goalsHeight;
        
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
            const estimatedLines = Math.max(lines, Math.ceil(content.length / 60));
            estimatedHeight = Math.max(100, estimatedLines * 25 + 40);
          } else {
            estimatedHeight = 80;
          }
        } else if (field.type === 'goals_table') {
          estimatedHeight = 400;
        } else if (field.type === 'informal_supports_table') {
          estimatedHeight = 300;
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
        } else {
          currentPage.push({ 
            section, 
            field, 
            estimatedHeight, 
            showSectionTitle: !sectionsWithTitleShown.has(section.id),
            questionNumber: sectionFields.indexOf(field) + 1
          });
          currentPageHeight += estimatedHeight;
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
          <table className="w-full border-collapse border border-black text-sm">
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
                <tr key={index}>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {goal.goal || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {goal.rating || ''}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
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