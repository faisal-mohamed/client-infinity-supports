"use client";

import React from "react";
import { format, parseISO, isValid } from "date-fns";

interface ContentBlock {
  type: string;
  height: number;
  content: () => React.ReactElement;
  questionKey?: string;
  riskRow?: any;
}

const HomeVisitDynamic: React.FC<any> = ({ formData, commonFieldsData, settings }) => {
  
  const formatDate = (value: string | undefined | null): string => {
    if (!value || typeof value !== 'string') return '';
    
    try {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, 'dd-MM-yyyy');
      }
    } catch (e) {}
    
    const matchISO = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (matchISO) {
      const [, yyyy, mm, dd] = matchISO;
      return `${dd}-${mm}-${yyyy}`;
    }
    
    return value;
  };

  const getFieldValue = (key: string): string => {
    const commonFieldMap: Record<string, string> = {
      name: 'name',
      ndisNumber: 'ndis',
      dob: 'dob',
      address: 'street',
    };
    
    const mappedKey = commonFieldMap[key];
    const rawValue = mappedKey ? commonFieldsData?.[mappedKey] : formData?.[key];

    if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      return formatDate(rawValue);
    }

    return rawValue ?? '';
  };

  // Simple question sections
  const questionSections = [
    {
      title: "CLIENT AND FAMILY",
      questions: [
        { label: "Will anyone else be present during the visit?", key: "visitCompany" },
        { label: "Any history of verbal or physical aggression from the client or family?", key: "aggressionHistory" },
        { label: "Any history of alcohol or drug use? (If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)", key: "drugUseHistory" },
        { label: "Is there an advanced care directive? (If yes, please add this information to risk assessment and care plan)", key: "careDirective" }
      ]
    },
    {
      title: "ENVIRONMENT",
      questions: [
        { label: "If there are any pets, has the client agreed to restrain them during the visit?", key: "petsRestrained" },
        { label: "Are there any weapons in the home? (If yes, please make sure they are stored appropriately during the visit.)", key: "weaponsInHome" },
        { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", key: "smokingAgreement" },
        { label: "Are there smoke detectors present and in working condition?", key: "smokeDetectors" },
        { label: "Any apparent fire hazards?", key: "fireHazards" }
      ]
    },
    {
      title: "GEOGRAPHICAL LOCATION",
      questions: [
        { label: "Are there any difficulties locating the address/access to the building?", key: "accessDifficulties" },
        { label: "Is there parking available? Street? paid ?", key: "parking" },
        { label: "Is entry via the front door? If no, which door is used for entry?", key: "entryPoint" },
        { label: "Are there any issues with mobile phone reception?", key: "mobileReception" }
      ]
    }
  ];

  // Get filled risk rows
  const filledRiskRows = [1, 2, 3, 4, 5].filter(row => {
    const issue = getFieldValue(`issue${row}`);
    return issue && issue.trim() !== '';
  });

  // Content blocks for pagination - each question is a separate block
  const contentBlocks: ContentBlock[] = [
    {
      type: 'metadata',
      height: 120,
      content: () => (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center mb-4">Home & Visit Risk Assessment</h2>
          <table className="w-full border border-black text-sm">
            <tbody>
              <tr>
                <td className="border border-black p-2 w-1/3">
                  <span className="font-semibold">Name:</span> {getFieldValue('name')}
                </td>
                <td className="border border-black p-2 w-1/3">
                  <span className="font-semibold">NDIS Number:</span> {getFieldValue('ndisNumber')}
                </td>
                <td className="border border-black p-2 w-1/3">
                  <span className="font-semibold">DOB:</span> {getFieldValue('dob')}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2" colSpan={3}>
                  <span className="font-semibold">Address:</span> {getFieldValue('address')}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2" colSpan={3}>
                  <span className="font-semibold">Date of completion:</span> {formatDate(formData?.completionDate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }
  ];

  // Add table header once
  let headerAdded = false;

  // Add each question as individual block
  questionSections.forEach((section) => {
    // Add section header if it exists
    if (section.title) {
      contentBlocks.push({
        type: 'section_header',
        height: 40,
        content: () => (
          <div className="bg-gray-300 border border-black p-2 font-bold text-sm mb-0">
            {section.title}
          </div>
        )
      });
    }

    // Add table header only once
    if (!headerAdded) {
      contentBlocks.push({
        type: 'table_header',
        height: 50,
        content: () => (
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-black p-2 question-col">Question</th>
                <th className="border border-black p-2 yes-col">YES</th>
                <th className="border border-black p-2 no-col">NO</th>
                <th className="border border-black p-2 comments-col">COMMENTS</th>
              </tr>
            </thead>
          </table>
        )
      });
      headerAdded = true;
    }

    // Add each question as individual block
    section.questions.forEach((question) => {
      const value = formData?.[question.key];
      const comments = formData?.[question.key + "_comments"] || "";

      contentBlocks.push({
        type: 'question',
        questionKey: question.key, // Add this for height calculation
        height: 60, // Base height, will be recalculated
        content: () => (
          <div className="w-full border-collapse text-sm" style={{ display: 'table', width: '100%', borderCollapse: 'collapse' }}>
            <div style={{ display: 'table-row' }}>
              {question.key === 'entryPoint' ? (
                <>
                  <div className="border border-black p-2 question-col font-medium" style={{ display: 'table-cell' }}>{question.label}</div>
                  <div className="border border-black yes-col" style={{ display: 'table-cell' }}></div>
                  <div className="border border-black no-col" style={{ display: 'table-cell' }}></div>
                  <div className="border border-black p-2 comments-col" style={{ display: 'table-cell' }}>
                    <div className="space-y-1">
                      {["Left side", "Right Side", "Rear", "Front Door", "Other"].map((opt) => (
                        <label key={opt} className="flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={Array.isArray(value) ? value.includes(opt) : false}
                            readOnly
                            className="mr-1 h-3 w-3"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                      {comments && (
                        <div className="mt-1 italic text-xs" style={{ 
                          wordWrap: 'break-word', 
                          whiteSpace: 'normal',
                          lineHeight: '1.4'
                        }}>
                          {comments}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border border-black p-2 question-col font-medium" style={{ display: 'table-cell' }}>{question.label}</div>
                  <div className="border border-black yes-col" style={{ display: 'table-cell' }}>
                    {value?.toLowerCase() === "yes" ? "✔️" : ""}
                  </div>
                  <div className="border border-black no-col" style={{ display: 'table-cell' }}>
                    {value?.toLowerCase() === "no" ? "✔️" : ""}
                  </div>
                  <div className="border border-black p-2 comments-col text-xs" style={{ 
                    display: 'table-cell',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    lineHeight: '1.4',
                    verticalAlign: 'top'
                  }}>
                    {comments}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      });
    });
  });

  // Add risk matrix
  contentBlocks.push({
    type: 'risk_matrix',
    height: 400,
    content: () => (
      <div className="mb-4">
        <div className="flex justify-center mb-3">
          <img src="/home_risk_assessment.png" alt="Risk Matrix" className="max-w-full h-auto" style={{ maxHeight: '300px' }} />
        </div>
        <div className="space-y-2 text-xs">
          <h3 className="text-sm font-semibold underline text-center mb-2">Risk Assessment Outcome – Proceed with Visit as follows:</h3>
          {[
            { title: "LOW GREEN", color: "green", text: "Visit acceptable. Ensure control options are followed." },
            { title: "MEDIUM YELLOW", color: "yellow", text: "Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk." },
            { title: "MODERATE ORANGE", color: "orange", text: "Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk." },
            { title: "HIGH RED", color: "red", text: "Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered." }
          ].map((block) => (
            <div key={block.title} className="border-l-4 border-gray-300 pl-2 mb-2">
              <h4 className="font-bold text-xs">
                <span>{block.title.split(" ")[0]} </span>
                <span className={`text-${block.color}-600`}>{block.title.split(" ")[1]}</span>
              </h4>
              <p className="text-xs leading-relaxed text-gray-700">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  });

  // Add risk table header and individual rows if there are filled rows
  if (filledRiskRows.length > 0) {
    // Add risk table header
    contentBlocks.push({
      type: 'risk_table_header',
      height: 50,
      content: () => (
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-400">
              <th className="border border-black p-2 risk-issue-col font-bold text-black">Issue/Task</th>
              <th className="border border-black p-2 risk-score-col font-bold text-black">Risk Score</th>
              <th className="border border-black p-2 risk-control-col font-bold text-black">Control Measure</th>
              <th className="border border-black p-2 risk-responsible-col font-bold text-black">Person Responsible</th>
            </tr>
          </thead>
        </table>
      )
    });

    // Add each risk row as individual block
    filledRiskRows.forEach((row) => {
      const issue = getFieldValue(`issue${row}`);
      const control = getFieldValue(`control${row}`);
      
      // Calculate height based on content length
      let rowHeight = 50; // Base height
      if (issue && issue.length > 50) {
        rowHeight += Math.ceil(issue.length / 50) * 16;
      }
      if (control && control.length > 100) {
        rowHeight += Math.ceil(control.length / 100) * 16;
      }

      contentBlocks.push({
        type: 'risk_row',
        riskRow: row,
        height: Math.max(rowHeight, 60), // Minimum 60px
        content: () => (
          <table className="w-full border-collapse border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black p-2 risk-issue-col">{getFieldValue(`issue${row}`)}</td>
                <td className="border border-black p-2 risk-score-col">{getFieldValue(`riskScore${row}`)}</td>
                <td className="border border-black p-2 risk-control-col">{getFieldValue(`control${row}`)}</td>
                <td className="border border-black p-2 risk-responsible-col">{getFieldValue(`responsible${row}`)}</td>
              </tr>
            </tbody>
          </table>
        )
      });
    });
  }

  // Add signature block
  contentBlocks.push({
    type: 'signature',
    height: 120,
    content: () => (
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="font-semibold mb-2">Name:</div>
            <div className="border-b-2 border-black pb-1 min-h-[24px] font-bold">
              {getFieldValue('authorName') || getFieldValue('name')}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-2">Signature:</div>
            <div className="border-b-2 border-black pb-1 min-h-[24px] flex justify-center items-center">
              {formData?.assessorSignature ? (
                <img src={formData.assessorSignature} alt="Signature" className="max-h-[50px] object-contain" />
              ) : (
                <span className="text-gray-400 italic">No signature</span>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold mb-2">Designation:</div>
            <div className="border-b-2 border-black pb-1 min-h-[24px] font-bold">{formData?.designation ?? ""}</div>
          </div>
        </div>
      </div>
    )
  });

  // Better height calculation for content
  const calculateContentHeight = (block: any): number => {
    switch (block.type) {
      case 'metadata':
        return 120;
      case 'section_header':
        return 40;
      case 'table_header':
        return 50;
      case 'question':
        const value = formData?.[block.questionKey];
        const comments = formData?.[block.questionKey + "_comments"] || "";
        let height = 50; // Base row height
        
        // Add height for long comments
        if (comments && comments.length > 0) {
          const lines = Math.ceil(comments.length / 50); // ~50 chars per line
          height += lines * 16; // 16px per line
        }
        
        // Extra height for entry point checkboxes
        if (block.questionKey === 'entryPoint') {
          height += 80;
        }
        
        return Math.max(height, 60); // Minimum 60px
      case 'risk_matrix':
        return 400;
      case 'risk_table_header':
        return 50;
      case 'risk_row':
        const issue = getFieldValue(`issue${block.riskRow}`);
        const control = getFieldValue(`control${block.riskRow}`);
        let rowHeight = 50; // Base height
        
        if (issue && issue.length > 50) {
          rowHeight += Math.ceil(issue.length / 50) * 16;
        }
        if (control && control.length > 100) {
          rowHeight += Math.ceil(control.length / 100) * 16;
        }
        
        return Math.max(rowHeight, 60); // Minimum 60px
      case 'signature':
        return 120;
      default:
        return 50;
    }
  };

  // Improved pagination with better space management
  const PAGE_HEIGHT = 800; // Conservative page height
  const BLOCK_SPACING = 10;

  const pages: number[][] = [];
  let currentPage: number[] = [];
  let currentHeight = 0;

  contentBlocks.forEach((block, index) => {
    const blockHeight = calculateContentHeight(block);
    const totalHeight = blockHeight + (currentPage.length > 0 ? BLOCK_SPACING : 0);
    
    // Check if this block would exceed page height
    const wouldExceed = currentHeight + totalHeight > PAGE_HEIGHT;
    
    console.log(`Block ${index} (${block.type}): height=${blockHeight}, total=${totalHeight}, current=${currentHeight}, wouldExceed=${wouldExceed}`);
    
    // If block doesn't fit and we have content on current page, start new page
    if (wouldExceed && currentPage.length > 0) {
      console.log(`Moving block ${index} to new page`);
      pages.push([...currentPage]);
      currentPage = [index];
      currentHeight = blockHeight;
    } else {
      currentPage.push(index);
      currentHeight += totalHeight;
    }
  });

  // Add the last page
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  console.log(`Final pagination: ${pages.length} pages`, pages.map((page, i) => ({
    page: i + 1,
    blocks: page.length,
    blockTypes: page.map(blockIndex => contentBlocks[blockIndex]?.type)
  })));

  // A4 Page Component matching Emergency Drill approach
  const A4Page = ({ children, pageNumber }: { children: React.ReactNode; pageNumber: number }) => (
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
      <div className="flex justify-center mb-0">
        <img
          alt="Infinity Logo"
          src="/infinity_logo.png"
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
      
      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>Website: {settings?.company_website || settings?.website || settings?.from_email || ''}</span>
        <span>{settings?.home_visit_form_id || ''}</span>
        <span>Review Date: {formatDate(settings?.review_date)}</span>
      </div>
    </div>
  );

  return (
    <div className="print:p-0">
      <style>{`
        * { box-sizing: border-box; }
        table { 
          table-layout: fixed !important; 
          width: 100% !important;
          border-collapse: collapse !important;
          margin-bottom: 8px !important;
        }
        td, th { 
          word-wrap: break-word !important; 
          white-space: normal !important; 
          overflow: visible !important;
          vertical-align: top !important;
          padding: 6px !important;
          border: 1px solid #000 !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
        }
        th {
          background-color: #e5e7eb !important;
          font-weight: bold !important;
          text-align: center !important;
        }
        .question-col { width: 40% !important; text-align: left !important; }
        .yes-col { width: 10% !important; text-align: center !important; }
        .no-col { width: 10% !important; text-align: center !important; }
        .comments-col { 
          width: 40% !important; 
          text-align: left !important;
        }
        .risk-issue-col { width: 22% !important; }
        .risk-score-col { width: 12% !important; text-align: center !important; }
        .risk-control-col { 
          width: 50% !important;
        }
        .risk-responsible-col { width: 16% !important; }
        
        /* Proper text wrapping without scrollbars */
        .comments-col, .risk-control-col {
          word-break: break-word !important;
          hyphens: auto !important;
          overflow-wrap: break-word !important;
        }
        
        @media print {
          .a4-page { page-break-after: always; }
          table tr { page-break-inside: avoid; }
        }
      `}</style>

      {pages.map((pageBlocks, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex + 1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${BLOCK_SPACING}px` }}>
            {pageBlocks.map((blockIndex) => (
              <div key={blockIndex}>
                {contentBlocks[blockIndex].content()}
              </div>
            ))}
          </div>
        </A4Page>
      ))}
    </div>
  );
};

export default HomeVisitDynamic;
