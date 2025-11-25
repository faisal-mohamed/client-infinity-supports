"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';

interface EmergencyDrillDynamicProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  images?: any;
}

const EmergencyDrillDynamic: React.FC<EmergencyDrillDynamicProps> = ({
  formData,
  commonFieldsData,
  settings,
  images
}) => {
  // Constants for pagination (inside component like SA Support Coordination)
  const PAGE_BUDGET = 1000; // Available height per page
  const BLOCK_SPACING = 16; // Space between blocks
  const SAFETY_BUFFER = 100; // Safety margin for header + footer

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

  const getFieldValue = (key: string) => {
    // For clientName field, combine first name and surname to show full name
    if (key === 'clientName') {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      if (fullName) {
        return fullName;
      }
      // Fallback to formData.clientName if it exists
      if (formData?.[key]) {
        return String(formData[key]);
      }
      // Last fallback: try to get just the first name from commonFieldsData
      if (firstName) {
        return firstName;
      }
      return '';
    }
    
    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping?.[key]] ?? '';
    }
    return formData?.[key] ?? '';
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, 'dd/MM/yyyy');
    } catch {
      return dateString || '';
    }
  };

  // Content Blocks - Granular like SA Support Coordination
  const contentBlocks = [
    // Block 1: Header & Title
    {
      type: 'header_title',
      height: 100,
      content: () => (
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-2">Emergency Drill Reporting Form</h1>
          <p className="text-sm italic text-gray-600">
            (For Disability Support Workers in a Client's Home)
          </p>
          <hr className="border-gray-400 mt-4" />
        </div>
      )
    },

    // Block 2: General Information Section
    {
      type: 'general_info',
      height: 200,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">1. General Information:</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Date of Drill:</span>
              <span className="border-b border-black flex-1 ml-2 text-xs">
                {formatDate(getFieldValue('drillDate'))}
              </span>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Time of Drill:</span>
              <span className="border-b border-black flex-1 ml-2 text-xs">
                {getFieldValue('drillTime')}
              </span>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Client's Name (if applicable):</span>
              <span className="border-b border-black flex-1 ml-2 text-xs">
                {getFieldValue('clientName')}
              </span>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Support Worker(s) Involved:</span>
              <span className="border-b border-black flex-1 ml-2 text-xs">
                {getFieldValue('supportWorkers')}
              </span>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Supervisor/Manager Notified:</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('supervisorNotified') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Supervisor Notified ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Block 3: Type of Emergency Drill
    {
      type: 'drill_type',
      height: 120,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">2. Type of Emergency Drill Conducted:</h3>
          <div className="flex items-start">
            <span className="min-w-[220px] font-medium text-xs">Selected Drill Type:</span>
            <span className="border-b border-black flex-1 ml-2 text-xs">
              {getFieldValue('selectedDrillType') || 'No selection made'}
            </span>
          </div>
          {getFieldValue('selectedDrillType') === 'Other (specify)' && (
            <div className="mt-3 flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Please specify:</span>
              <span className="border-b border-black flex-1 ml-2 text-xs">
                {getFieldValue('otherDrill')}
              </span>
            </div>
          )}
        </div>
      )
    },

    // Block 4: Drill Execution Details
    {
      type: 'execution_details',
      height: 250,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">3. Drill Execution Details:</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Was the emergency plan followed?</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('planFollowed') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Plan Followed ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Were all safety measures and protocols implemented?</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('safetyProtocols') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Safety Protocols ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Emergency services contacted? (if applicable)</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('servicesContacted') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Services Contacted ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">Client response and involvement:</span>
              <div className="border border-black p-2 min-h-[60px] text-xs bg-white">
                {getFieldValue('clientResponse')}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">Support worker actions:</span>
              <div className="border border-black p-2 min-h-[60px] text-xs bg-white">
                {getFieldValue('supportAction')}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Block 5: Observations & Challenges
    {
      type: 'observations',
      height: 180,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">4. Observations & Challenges:</h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">What went well?</span>
              <div className="border border-black p-2 min-h-[50px] text-xs bg-white">
                {getFieldValue('whatWentWell')}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">What difficulties or challenges were encountered?</span>
              <div className="border border-black p-2 min-h-[50px] text-xs bg-white">
                {getFieldValue('challenges')}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">Any unexpected issues?</span>
              <div className="border border-black p-2 min-h-[50px] text-xs bg-white">
                {getFieldValue('unexpectedIssues')}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Block 6: Recommendations & Improvements
    {
      type: 'recommendations',
      height: 200,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">5. Recommendations & Improvements:</h3>
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">Suggested changes to procedures:</span>
              <div className="border border-black p-2 min-h-[50px] text-xs bg-white">
                {getFieldValue('procedureChanges')}
              </div>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Additional training or support required?</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('additionalTrainingRequired') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Additional Training ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            {getFieldValue('additionalTrainingRequired') === 'Yes' && (
              <div className="flex flex-col">
                <span className="font-medium text-xs mb-1">If yes, specify:</span>
                <div className="border border-black p-2 min-h-[40px] text-xs bg-white">
                  {getFieldValue('trainingDetails')}
                </div>
              </div>
            )}
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Updates needed for the client's emergency plan?</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('planUpdateNeeded') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Plan Update Needed ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            {getFieldValue('planUpdateNeeded') === 'Yes' && (
              <div className="flex flex-col">
                <span className="font-medium text-xs mb-1">If yes, specify:</span>
                <div className="border border-black p-2 min-h-[40px] text-xs bg-white">
                  {getFieldValue('planUpdateDetails')}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },

    // Block 7: Follow-Up Actions
    {
      type: 'followup',
      height: 150,
      content: () => (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">6. Follow-Up Actions:</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Debrief conducted?</span>
              <div className="flex gap-4 ml-2">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center text-xs">
                    <input
                      type="radio"
                      checked={getFieldValue('debriefConducted') === opt}
                      readOnly
                      className="mr-1 w-4 h-4 accent-blue-600"
                      aria-label={`Debrief Conducted ${opt}`}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs mb-1">Supervisor/Manager Comments:</span>
              <div className="border border-black p-2 min-h-[50px] text-xs bg-white">
                {getFieldValue('supervisorComments')}
              </div>
            </div>
            <div className="flex items-start">
              <span className="min-w-[220px] font-medium text-xs">Date of Next Scheduled Drill:</span>
              <span className="border-b border-black flex-1 ml-2 text-xs">
                {formatDate(getFieldValue('nextDrillDate'))}
              </span>
            </div>
          </div>
        </div>
      )
    },

    // Block 8: Support Worker Signature
    {
      type: 'support_worker_signature',
      height: 130,
      content: () => {
        const signature = getFieldValue('supportWorkerSignature');
        if (!signature) return null;

        return (
          <div className="mb-6">
            <div className="border border-black p-3">
              <h4 className="font-bold text-sm mb-3">Support Worker Signature</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs mb-1">Signature:</p>
                  <div className="border border-gray-300 p-2 h-16 flex items-center justify-center bg-white">
                    <img
                      src={signature}
                      alt="Support Worker Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-1">Date:</p>
                  <div className="border-b border-black h-8 text-xs pt-1">
                    {formatDate(getFieldValue('supportWorkerSignatureDate'))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    },

    // Block 9: Supervisor Signature
    {
      type: 'supervisor_signature',
      height: 130,
      content: () => {
        const signature = getFieldValue('supervisorSignature');
        if (!signature) return null;

        return (
          <div className="mb-6">
            <div className="border border-black p-3">
              <h4 className="font-bold text-sm mb-3">Supervisor/Manager Signature</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs mb-1">Signature:</p>
                  <div className="border border-gray-300 p-2 h-16 flex items-center justify-center bg-white">
                    <img
                      src={signature}
                      alt="Supervisor Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-1">Date:</p>
                  <div className="border-b border-black h-8 text-xs pt-1">
                    {formatDate(getFieldValue('supervisorSignatureDate'))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  ];

  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);

  const effectivePageBudget = PAGE_BUDGET - SAFETY_BUFFER;

  // Build pages using measured heights
  const pages = useMemo(() => {
    const heights = measuredHeights ?? contentBlocks.map(block => block.height);
    
    const pageGroups: number[][] = [];
    let currentPage: number[] = [];
    let currentHeight = 0;

    contentBlocks.forEach((block, index) => {
      const blockHeight = heights[index] || block.height;
      const blockWithSpacing = blockHeight + BLOCK_SPACING;

      if (currentHeight + blockWithSpacing > effectivePageBudget && currentPage.length > 0) {
        pageGroups.push(currentPage);
        currentPage = [index];
        currentHeight = blockWithSpacing;
      } else {
        currentPage.push(index);
        currentHeight += blockWithSpacing;
      }
    });

    if (currentPage.length > 0) {
      pageGroups.push(currentPage);
    }

    return pageGroups;
  }, [measuredHeights, effectivePageBudget]);

  // Measure heights (run once)
  useEffect(() => {
    if (measuredHeights) return;

    const timer = setTimeout(() => {
      const heights = measureRefs.current.map((ref) => {
        if (!ref) return 0;
        return ref.scrollHeight || ref.offsetHeight || 0;
      });
      setMeasuredHeights(heights);
    }, 100);

    return () => clearTimeout(timer);
  }, [measuredHeights]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setMeasuredHeights(null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // A4Page Component
  const A4Page: React.FC<{ children: React.ReactNode; pageNumber: number; totalPages: number }> = ({ 
    children, 
    pageNumber, 
    totalPages 
  }) => (
    <div
      className="bg-white mx-auto shadow-md"
      style={{
        width: "794px",
        height: "1123px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        pageBreakAfter: pageNumber < totalPages ? "always" : "auto",
        boxSizing: 'border-box',
        padding: "30px",
        marginBottom: "20px",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header with Logo */}
      <div className="flex justify-center mb-0">
        <img
          alt="Infinity Logo"
          src={images?.infinityLogo || "/infinity_logo.png"}
          width={180}
          height={70}
          className="object-contain"
        />
      </div>
      
      {/* Fixed spacer after header */}
      <div style={{ height: '24px' }} />
      
      {/* Content Area - overflow hidden to prevent scrolling */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Fixed spacer before footer */}
      <div style={{ height: '24px' }} />
      
      {/* Footer - in normal flow like SA Support Coordination */}
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>Website: {settings?.company_website || ''}</span>
        <span>{settings?.emergency_drill || ''}</span>
        <span>Review Date: {settings?.review_date ? formatDate(settings.review_date) : ''}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      {/* Hidden measurement container */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '794px',
          padding: '30px',
          visibility: 'hidden'
        }}
      >
        {contentBlocks.map((block, index) => (
          <div
            key={index}
            ref={el => { measureRefs.current[index] = el; }}
          >
            {block.content()}
          </div>
        ))}
      </div>

      {/* Visible pages */}
      {pages.map((pageBlockIndices, pageIndex) => (
        <A4Page
          key={pageIndex}
          pageNumber={pageIndex + 1}
          totalPages={pages.length}
        >
          {pageBlockIndices.map(blockIndex => (
            <div key={blockIndex}>
              {contentBlocks[blockIndex].content()}
            </div>
          ))}
        </A4Page>
      ))}
    </div>
  );
};

export default EmergencyDrillDynamic;

