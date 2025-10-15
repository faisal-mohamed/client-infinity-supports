import React from 'react';
import EnhancedA4Page from './EnhancedA4Page';
import FullContentField from './FullContentField';

interface ContentAwarePaginationProps {
  schema: any;
  data: any;
  commonFieldsData: any;
  settings: any;
}

const ContentAwarePagination: React.FC<ContentAwarePaginationProps> = ({
  schema,
  data,
  commonFieldsData,
  settings
}) => {
  const getValue = (key: string) => {
    const commonFieldMapping: Record<string, string> = {
      clientName: 'name',
      address: 'street',
      dob: 'dob',
      disability: 'disability',
      phoneNumber: 'phone',
      ndisNumber: 'ndis',
      state: 'state',
      street: 'street',
      postcode: 'postCode',
      email: 'email',
      homePhone: 'phone',
      sex: 'sex'
    };

    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    
    const value = data?.[key] ?? '';
    
    
    return value;
  };

  const renderRadio = (key: string, options: string[]) => (
    <div className="mb-3">
      <div className="flex flex-wrap gap-4 ml-2 mt-1">
        {options?.map?.((opt) => (
          <div key={opt} className="flex items-center">
            <input
              type="radio"
              id={`${key}-${opt}`}
              name={key}
              value={opt}
              checked={getValue(key) === opt}
              readOnly
              className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <label htmlFor={`${key}-${opt}`} className="ml-2 text-sm text-gray-700">
            {opt}
          </label>
          </div>
        )) ?? null}
      </div>
    </div>
  );

  // Calculate content length for text fields
  const getContentLength = (field: string) => {
    const value = getValue(field);
    return value ? value.length : 0;
  };

  const textFields = [
    'otherDrill', 'clientResponse', 'supportAction', 'whatWentWell', 
    'challenges', 'unexpectedIssues', 'procedureChanges', 'trainingDetails', 
    'planUpdateDetails', 'supervisorComments'
  ];
  
  const totalTextLength = textFields.reduce((sum, field) => sum + getContentLength(field), 0);

  // Create dynamic pages based on content length
  const createDynamicPages = () => {
    const pages: any[] = [];
    let currentPage: any[] = [];
    let currentPageHeight = 0;
    
    // Conservative page height calculation to prevent any cutoff
    // Use much smaller height to ensure content never gets cut off
    const maxPageHeight = 600; // Very conservative height to prevent cutoff
    
    console.log(`📏 Using conservative page height: ${maxPageHeight}px to prevent content cutoff`);
    const sectionsWithTitleShown = new Set(); // Track which sections have shown their title
    
    // Define all sections in order
    const allSections = [
      { id: 'generalInfo', title: '1. General Information', sectionNumber: 1 },
      { id: 'drillTypes', title: '2. Type of Emergency Drill Conducted', sectionNumber: 2 },
      { id: 'executionDetails', title: '3. Drill Execution Details', sectionNumber: 3 },
      { id: 'observations', title: '4. Observations & Challenges', sectionNumber: 4 },
      { id: 'recommendations', title: '5. Recommendations & Improvements', sectionNumber: 5 },
      { id: 'followup', title: '6. Follow-Up Actions', sectionNumber: 6 },
      { id: 'signatures', title: '7. Signatures', sectionNumber: 7 }
    ];

    allSections.forEach((section) => {
      const sectionFields = schema[section.id];
      if (sectionFields) {
        // Special handling for drillTypes section - handle select structure
        if (section.id === 'drillTypes' && sectionFields.type === 'select') {
          const selectedDrillType = getValue(sectionFields.key);
          const estimatedHeight = 60; // Increased height for select field to prevent cutoff
          
          // If adding this section would exceed page height, create new page
          if (currentPageHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
            pages.push([...currentPage]);
            currentPage = [];
            currentPageHeight = 0;
          }
          
          // Add drillTypes section to current page
          currentPage.push({ 
            section, 
            field: sectionFields, 
            estimatedHeight, 
            showSectionTitle: !sectionsWithTitleShown.has(section.id),
            questionNumber: 1
          });
          currentPageHeight += estimatedHeight + 30; // Increased spacing after drillTypes
          
          // Mark section title as shown
          if (!sectionsWithTitleShown.has(section.id)) {
            sectionsWithTitleShown.add(section.id);
          }
          
          // Skip normal processing for this section
          return;
        }
        
        // Special handling for signatures section - keep it together
        if (section.id === 'signatures') {
          // Calculate total height needed for entire signature section
          let signatureSectionHeight = 60; // Section header height
          
          sectionFields.forEach((field: any) => {
            const content = getValue(field.key);
            let estimatedHeight = 60;
            
            if (field.type === 'radio') {
              estimatedHeight = 80;
            } else if (field.type === 'textarea' || field.type === 'text') {
              if (content && content.length > 0) {
                const lines = Math.max(1, content.split('\n').length);
                const estimatedLines = Math.max(lines, Math.ceil(content.length / 60));
                estimatedHeight = Math.max(100, estimatedLines * 25 + 40);
              } else {
                estimatedHeight = 80;
              }
            } else if (field.type === 'signature') {
              estimatedHeight = 100;
            }
            
            signatureSectionHeight += estimatedHeight;
          });
          
          // If signature section doesn't fit on current page, create new page
          if (currentPageHeight + signatureSectionHeight > maxPageHeight && currentPage.length > 0) {
            pages.push([...currentPage]);
            currentPage = [];
            currentPageHeight = 0;
          }
          
          // Add all signature fields to current page
          sectionFields.forEach((field: any) => {
            const content = getValue(field.key);
            let estimatedHeight = 60;
            
            if (field.type === 'radio') {
              estimatedHeight = 80;
            } else if (field.type === 'textarea' || field.type === 'text') {
              if (content && content.length > 0) {
                const lines = Math.max(1, content.split('\n').length);
                const estimatedLines = Math.max(lines, Math.ceil(content.length / 60));
                estimatedHeight = Math.max(100, estimatedLines * 25 + 40);
              } else {
                estimatedHeight = 80;
              }
            } else if (field.type === 'signature') {
              estimatedHeight = 100;
            }
            
            currentPage.push({ 
              section, 
              field, 
              estimatedHeight, 
              showSectionTitle: !sectionsWithTitleShown.has(section.id),
              questionNumber: sectionFields.indexOf(field) + 1
            });
            currentPageHeight += estimatedHeight;
            
            // Mark section title as shown after first field
            if (!sectionsWithTitleShown.has(section.id)) {
              sectionsWithTitleShown.add(section.id);
            }
          });
        } else {
          // Regular sections - normal field-by-field processing
          sectionFields.forEach((field: any) => {
            const content = getValue(field.key);
            // Very conservative height estimates to prevent cutoff
            let estimatedHeight = 50; // Increased base height for safety
            
            if (field.type === 'radio') {
              estimatedHeight = 70; // Increased radio field height
            } else if (field.type === 'textarea') {
              if (content && content.length > 0) {
                const lines = Math.max(1, content.split('\n').length);
                const estimatedLines = Math.max(lines, Math.ceil(content.length / 50)); // Fewer chars per line for safety
                estimatedHeight = Math.max(80, estimatedLines * 25 + 40); // Increased line height and padding
              } else {
                estimatedHeight = 80; // Increased empty textarea height
              }
            } else if (field.type === 'text') {
              estimatedHeight = 50; // Increased text field height
            } else if (field.type === 'signature') {
              estimatedHeight = 100; // Increased signature field height
            } else if (field.type === 'select') {
              estimatedHeight = 60; // Increased select field height
            }

            // If adding this field would exceed page height, create new page
            if (currentPageHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
              console.log(`📄 Creating new page for ${field.label}. Current height: ${currentPageHeight}, Field height: ${estimatedHeight}, Max: ${maxPageHeight}`);
              pages.push([...currentPage]);
              currentPage = [{ 
                section, 
                field, 
                estimatedHeight, 
                showSectionTitle: !sectionsWithTitleShown.has(section.id),
                questionNumber: sectionFields.indexOf(field) + 1
              }];
              currentPageHeight = estimatedHeight + 30; // Increased spacing for new page
            } else {
              currentPage.push({ 
                section, 
                field, 
                estimatedHeight, 
                showSectionTitle: !sectionsWithTitleShown.has(section.id),
                questionNumber: sectionFields.indexOf(field) + 1
              });
              currentPageHeight += estimatedHeight + 30; // Increased spacing between fields
            }
            
            // Mark section title as shown after first field
            if (!sectionsWithTitleShown.has(section.id)) {
              sectionsWithTitleShown.add(section.id);
            }
          });
        }
      }
    });

    // Add remaining fields to last page
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    console.log(`📊 Total pages created: ${pages.length}`);
    console.log(`📊 Page breakdown:`, pages.map((page, index) => `${index + 1}: ${page.length} fields`));

    return pages;
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
            showTitle={isFirstPage}
          >
        <div className="space-y-5">
              {pageFields.map((pageField: any, fieldIndex: number) => {
                const { section, field, showSectionTitle, questionNumber } = pageField;
                
                return (
                  <div key={`${field.key}-${pageIndex}-${fieldIndex}`}>
                    {/* Section Header - only show if this is the first field of the section */}
                    {showSectionTitle && (
                      <div className="mb-4 font-bold text-lg text-gray-900">
                        {section.title}:
                    </div>
                    )}

                    {/* Field Content */}
                    <div className="mb-4">
                      {field.type === 'select' ? (
                        <div>
                          <div className="font-bold mb-2 text-sm text-gray-800">
                            ({questionNumber}) {field.label}:
                          </div>
                          <div className="pl-2 border-l-4 border-l-gray-300 bg-gray-50 py-2 px-3 rounded-r">
                            <div className="mb-2">
                              <strong>Selected:</strong> {getValue(field.key) || 'No selection made'}
                            </div>
                            {/* Show "Other" field if "Other (specify)" is selected */}
                            {getValue(field.key) === 'Other (specify)' && field.otherField && (
                              <div className="mt-2">
                                <strong>{field.otherField.label}:</strong> {getValue(field.otherField.key)}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : field.type === 'radio' ? (
                        <div>
                          <div className="font-bold mb-2 text-sm text-gray-800">
                            ({questionNumber}) {field.label}:
                </div>
                          <div className="pl-2 border-l-4 border-l-gray-300 bg-gray-50 py-2 px-3 rounded-r">
                            {renderRadio(field.key, field.options ?? [])}
            </div>
                    </div>
                  ) : (
                    <FullContentField
                          label={`(${questionNumber}) ${field.label}`}
                          value={getValue(field.key)}
                          type={field.type}
                        />
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