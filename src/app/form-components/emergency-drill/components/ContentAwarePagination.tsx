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
    return data?.[key] ?? '';
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
    const pages = [];
    let currentPage = [];
    let currentPageHeight = 0;
    const maxPageHeight = 800; // Maximum height per page
    
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
        sectionFields.forEach((field) => {
          const content = getValue(field.key);
          // Estimate height for each field
          let estimatedHeight = 60; // Base height for label and padding
          
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

          // If adding this field would exceed page height, create new page
          if (currentPageHeight + estimatedHeight > maxPageHeight && currentPage.length > 0) {
            pages.push([...currentPage]);
            currentPage = [{ section, field, estimatedHeight }];
            currentPageHeight = estimatedHeight;
          } else {
            currentPage.push({ section, field, estimatedHeight });
            currentPageHeight += estimatedHeight;
          }
        });
      }
    });

    // Add remaining fields to last page
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

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
              {pageFields.map((pageField, fieldIndex) => {
                const { section, field } = pageField;
                const isFirstInSection = fieldIndex === 0 || 
                  pageFields[fieldIndex - 1].section.id !== section.id;
                
                return (
                  <div key={`${field.key}-${pageIndex}-${fieldIndex}`}>
                    {/* Section Header */}
                    {isFirstInSection && (
                      <div className="mb-4 font-semibold text-base">{section.title}:</div>
                    )}

                    {/* Field Content */}
                    <div className="mb-4">
                      {field.type === 'radio' ? (
                        <div>
                          <div className="font-medium mb-2 text-sm">{field.label}:</div>
                          {renderRadio(field.key, field.options ?? [])}
                        </div>
                      ) : (
                        <FullContentField
                          label={field.label}
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