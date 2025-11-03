"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";

// Schema types
interface QuestionField {
  label: string;
  key: string;
  type?: 'checkbox' | 'checkboxGroup';
  options?: string[];
}

interface Section {
  title?: string;
  fields: QuestionField[];
}

// Dynamic Home Visit Risk Assessment View
const HomeVisitDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings }) => {
  
  // Log footer settings for debugging
  useEffect(() => {
    const footerWebsite = settings?.company_website || settings?.website || settings?.from_email || '';
    const footerId = settings?.home_visit_form_id || 'HV001';
    const footerDate = settings?.review_date || '';
    console.log('🦶 [Web Footer] Home Visit Dynamic:', { footerWebsite, footerId, footerDate, settingsKeys: Object.keys(settings || {}) });
  }, [settings]);
  
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
    let rawValue = mappedKey ? commonFieldsData?.[mappedKey] : formData?.[key];

    if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      return formatDate(rawValue);
    }

    // 🔧 FIX: Clean up repetitive/duplicated text
    if (typeof rawValue === 'string') {
      // Remove "start" and "end" markers that might be added accidentally
      rawValue = rawValue.replace(/^start\s*/i, '').replace(/\s*end$/i, '');
      
      // Remove duplicate consecutive text patterns
      // This regex finds patterns where text repeats multiple times consecutively
      const cleanedValue = deduplicateText(rawValue);
      return cleanedValue;
    }

    return rawValue ?? '';
  };

  // Helper function to remove duplicate consecutive text
  const deduplicateText = (text: string): string => {
    if (!text || text.length < 10) return text;
    
    // Remove patterns like "Comments: X Comments: X Comments: X"
    // by finding the shortest repeating unit
    const trimmed = text.trim();
    
    // Try to find if text is duplicated by looking for patterns
    for (let len = Math.floor(trimmed.length / 2); len >= 20; len--) {
      const pattern = trimmed.substring(0, len);
      const regex = new RegExp(`^(${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})+`, 'g');
      
      if (regex.test(trimmed)) {
        return pattern.trim();
      }
    }
    
    return trimmed;
  };

  // Schema definition - Each row is a BLOCK
  const page1Questions: Section[] = [
    {
      title: "CLIENT AND FAMILY",
      fields: [
        { label: "Will anyone else be present during the visit?", key: "visitCompany" },
        { label: "Any history of verbal or physical aggression from the client or family?", key: "aggressionHistory" },
        { label: "Any history of alcohol or drug use? (If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)", key: "drugUseHistory" },
        { label: "Is there an advanced care directive? (If yes, please add this information to risk assessment and care plan)", key: "careDirective" }
      ]
    },
    {
      title: "ENVIRONMENT",
      fields: [
        { label: "If there are any pets, has the client agreed to restrain them during the visit?", key: "petsRestrained" },
        { label: "Are there any weapons in the home? (If yes, please make sure they are stored appropriately during the visit.)", key: "weaponsInHome" }
      ]
    }
  ];

  const page2Questions: Section[] = [
    {
      fields: [
        { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", key: "smokingAgreement" },
        { label: "Are there smoke detectors present and in working condition?", key: "smokeDetectors" },
        { label: "Any apparent fire hazards?", key: "fireHazards" },
      ]
    },
    {
      title: "GEOGRAPHICAL LOCATION",
      fields: [
        { label: "Are there any difficulties locating the address/access to the building?", key: "accessDifficulties" },
        { label: "Is there parking available?", key: "parking" },
        {
          label: "Is entry via the front door? If no, which door is used for entry?",
          key: "entryPoint",
          type: "checkboxGroup",
          options: ["Left side", "Right Side", "Rear", "Front Door", "Other"]
        },
        { label: "Are there any issues with mobile phone reception?", key: "mobileReception" }
      ]
    }
  ];

  const allQuestions = [...page1Questions, ...page2Questions];
  
  // 🔧 BLOCK-BASED PAGINATION: Each row is an atomic unit that cannot be split

  // Filter filled risk rows with deduplication and validation
  const filledRiskRows = [1, 2, 3, 4, 5].filter((row, index, self) => {
    const issue = getFieldValue(`issue${row}`);
    const riskScore = getFieldValue(`riskScore${row}`);
    const control = getFieldValue(`control${row}`);
    const responsible = getFieldValue(`responsible${row}`);
    
    // Skip if row is empty
    if (!issue && !riskScore && !control && !responsible) {
      return false;
    }
    
    // Skip if essential data is missing (issue must exist)
    if (!issue || issue.trim() === '') {
      return false;
    }
    
    // 🔧 FIX: Check for duplicates - skip if same issue appears earlier
    const isDuplicate = self.slice(0, index).some(prevRow => {
      const prevIssue = getFieldValue(`issue${prevRow}`);
      return prevIssue && issue && prevIssue.toLowerCase().trim() === issue.toLowerCase().trim();
    });
    
    if (isDuplicate) {
      console.warn(`⚠️ Duplicate risk entry detected for row ${row}: "${issue}"`);
      return false;
    }
    
    return true;
  });

  // Content units for dynamic pagination
  type ContentUnit = 
    | { type: 'metadata' }
    | { type: 'qa_section'; sectionIndex: number }
    | { type: 'risk_matrix' }
    | { type: 'risk_table' }
    | { type: 'signature' };

  const units: ContentUnit[] = useMemo(() => {
    const acc: ContentUnit[] = [];
    acc.push({ type: 'metadata' });
    allQuestions.forEach((_, idx) => acc.push({ type: 'qa_section', sectionIndex: idx }));
    acc.push({ type: 'risk_matrix' });
    if (filledRiskRows.length > 0) {
      acc.push({ type: 'risk_table' });
    }
    acc.push({ type: 'signature' });
    return acc;
  }, [filledRiskRows.length]);

  // Enhanced height estimation with better accuracy
  const calculateUnitHeight = (unit: ContentUnit): number => {
    if (unit.type === 'metadata') return 140; // Increased for padding
    
    if (unit.type === 'qa_section') {
      const section = allQuestions[unit.sectionIndex];
      const headerHeight = section.title ? 40 : 0;
      
      // Calculate height based on actual content
      let fieldsHeight = 0;
      section.fields.forEach((field) => {
        const value = formData?.[field.key];
        const comments = formData?.[field.key + "_comments"] || "";
        
        // Base row height
        let rowHeight = 45;
        
        // Add extra height for comments (but cap it)
        if (comments && comments.length > 50) {
          const estimatedLines = Math.min(Math.ceil(comments.length / 80), 6); // Cap at 6 lines
          rowHeight += estimatedLines * 15;
        }
        
        // Checkbox groups need more space
        if (field.type === 'checkboxGroup' && Array.isArray(value)) {
          rowHeight += Math.min(value.length * 20, 100); // Cap at 100px
        }
        
        fieldsHeight += rowHeight;
      });
      
      return headerHeight + fieldsHeight + 15;
    }
    
    if (unit.type === 'risk_matrix') return 480; // Slightly increased
    
    if (unit.type === 'risk_table') {
      if (filledRiskRows.length === 0) return 0; // No height if no rows
      const headerHeight = 45;
      
      // Calculate based on actual content in rows - NO artificial limits!
      let totalRowHeight = 0;
      filledRiskRows.forEach((row) => {
        const issue = getFieldValue(`issue${row}`);
        const control = getFieldValue(`control${row}`);
        const responsible = getFieldValue(`responsible${row}`);
        
        // Base row height
        let rowHeight = 55;
        
        // Calculate height based on actual text length (no caps!)
        const issueLength = issue?.length || 0;
        const controlLength = control?.length || 0;
        const responsibleLength = responsible?.length || 0;
        
        // Estimate lines needed for each column (based on column widths)
        const issueLines = Math.ceil(issueLength / 40); // ~40 chars per line at 22%
        const controlLines = Math.ceil(controlLength / 85); // ~85 chars per line at 58%
        const responsibleLines = Math.ceil(responsibleLength / 16); // ~16 chars per line at 12%
        
        // Use the maximum lines needed across all columns
        const maxLines = Math.max(issueLines, controlLines, responsibleLines, 1);
        
        // Calculate row height (20px per line)
        rowHeight = 35 + (maxLines * 20);
        
        totalRowHeight += rowHeight;
      });
      
      return headerHeight + totalRowHeight + 30;
    }
    
    if (unit.type === 'signature') return 160;
    
    return 50;
  };

  // Pagination constants
  const TOP_SPACER = 16;
  const BOTTOM_SPACER = 20;
  const SAFETY_BUFFER = 10;
  const BLOCK_SPACING = 8;
  const APPROX_CONTENT_HEIGHT = 950;
  const [pageBudget, setPageBudget] = useState<number | null>(null);
  const PAGE_BUDGET = (pageBudget ?? APPROX_CONTENT_HEIGHT) - TOP_SPACER - BOTTOM_SPACER;

  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);

  // Build pages with improved logic
  const pages = useMemo(() => {
    const heights = measuredHeights ?? units.map(calculateUnitHeight);
    const out: number[][] = [];
    let current: number[] = [];
    let h = 0;

    heights.forEach((unitHeight, idx) => {
      // Skip units with 0 height (e.g., empty risk table)
      if (unitHeight === 0) {
        console.log('[HomeVisitDynamic] Skipping unit with 0 height at index', idx);
        return;
      }
      
      const extra = current.length > 0 ? BLOCK_SPACING : 0;
      const next = unitHeight + extra;
      
      // Check if adding this unit (BLOCK) would exceed the page budget
      const wouldExceed = h + next + SAFETY_BUFFER > PAGE_BUDGET;
      
      // 🔧 BLOCK-BASED LOGIC: If block doesn't fit, move entire block to next page
      if (wouldExceed && current.length > 0) {
        out.push(current);
        const unitType = units[idx]?.type || 'unknown';
        console.log(`[HomeVisitDynamic] ✂️ BLOCK moved to next page: Unit ${idx} (${unitType}), Height: ${unitHeight}px, Would exceed budget by: ${(h + next) - PAGE_BUDGET}px`);
        
        current = [idx];
        h = unitHeight; // Reset height to just this unit (no extra spacing for first item)
      } else {
        // Block fits on current page - add it
        current.push(idx);
        h += next;
        const unitType = units[idx]?.type || 'unknown';
        console.log(`[HomeVisitDynamic] ✅ BLOCK fits on page: Unit ${idx} (${unitType}), Height: ${unitHeight}px, Running total: ${h}px / ${PAGE_BUDGET}px`);
      }
    });
    
    // Add the last page if it has content
    if (current.length) {
      out.push(current);
    }
    
    console.log('[HomeVisitDynamic] Pagination complete:', {
      totalPages: out.length,
      totalUnits: units.length,
      pageBudget: PAGE_BUDGET,
      pagesBreakdown: out.map((page, i) => ({
        page: i + 1,
        units: page.length,
        unitIndices: page
      }))
    });
    
    return out;
  }, [measuredHeights, units, PAGE_BUDGET]);

  // Measure actual heights after render with retry logic
  useEffect(() => {
    // Wait for all content to render before measuring
    const measureHeights = () => {
      const hs = units.map((unit, i) => {
        const el = measureRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          const measured = Math.ceil(rect.height);
          
          // Fallback to calculated height if measured is 0 or unreasonably small
          if (measured === 0 || measured < 10) {
            const calculated = calculateUnitHeight(unit);
            console.warn(`[HomeVisitDynamic] Unit ${i} measured 0 or too small, using calculated height:`, calculated);
            return calculated;
          }
          
          return measured;
        }
        return calculateUnitHeight(unit);
      });
      
      // Only update if we have valid measurements
      const hasValidMeasurements = hs.some((x) => x && x > 0);
      if (hasValidMeasurements) {
        console.log('[HomeVisitDynamic] Heights measured:', hs);
        setMeasuredHeights(hs);
      } else {
        console.warn('[HomeVisitDynamic] No valid measurements, retrying...');
        // Retry after a short delay
        setTimeout(measureHeights, 100);
      }
    };
    
    // Initial measurement with small delay to ensure content is rendered
    const timeoutId = setTimeout(measureHeights, 50);
    
    return () => clearTimeout(timeoutId);
  }, [units]);

  // Measure page budget
  const budgetRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (budgetRef.current) {
      const h = Math.floor(budgetRef.current.getBoundingClientRect().height);
      if (h && h > 0) {
        setPageBudget(h);
        console.log('[HomeVisitDynamic] Page budget:', h);
      }
    }
  }, []);

  // Render functions
  const renderMetadata = () => (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-center mb-4">Home & Visit Risk Assessment</h2>
      <table className="w-full border border-black text-xs table-fixed">
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
              <span className="font-semibold">Date of completion of risk assessment:</span> {formatDate(formData?.completionDate)}
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  );

  const renderQASection = (sectionIndex: number) => {
    const section = allQuestions[sectionIndex];
    return (
      <div className="mb-4 page-break-inside-avoid" key={`qa-${sectionIndex}`}>
        {section.title && (
          <div className="bg-gray-300 border border-black p-2 font-bold text-sm page-break-after-avoid">
            {section.title}
          </div>
        )}
        <table className="w-full border-collapse border border-black text-sm">
          {sectionIndex === 0 && (
          <thead>
              <tr className="bg-gray-200">
                <th className="border border-black w-[40%] p-2 text-left">Question</th>
              <th className="border border-black w-[7%] text-center p-2">YES</th>
              <th className="border border-black w-[7%] text-center p-2">NO</th>
                <th className="border border-black w-[46%] p-2 text-left">COMMENTS</th>
            </tr>
          </thead>
          )}
          <tbody>
            {section.fields.map((field) => {
              const value = formData?.[field.key];
              const comments = formData?.[field.key + "_comments"] || "";

              if (field.type === 'checkboxGroup') {
                const selectedOptions = Array.isArray(value) ? value : [];
                return (
                  <tr key={field.key} className="page-break-inside-avoid">
                    <td className="border border-black p-2 align-top font-medium">{field.label}</td>
                    <td className="border border-black text-center align-top"></td>
                    <td className="border border-black text-center align-top"></td>
                    <td className="border border-black p-2 align-top max-h-[200px] overflow-hidden">
                      <div className="space-y-1">
                        {(field.options || []).map((opt) => (
                          <label key={opt} className="flex items-center text-xs">
                            <input
                              type="checkbox"
                              checked={selectedOptions.includes(opt)}
                              readOnly
                              className="mr-1 h-3 w-3"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                        {comments && <div className="mt-1 italic text-xs line-clamp-3">{comments}</div>}
                      </div>
              </td>
            </tr>
                );
              }

              return (
                <tr key={field.key} className="page-break-inside-avoid">
                  <td className="border border-black p-2 align-top font-medium">{field.label}</td>
                  <td className="border border-black text-center align-top p-1">
                    {value?.toLowerCase() === "yes" ? "✔️" : ""}
              </td>
                  <td className="border border-black text-center align-top p-1">
                    {value?.toLowerCase() === "no" ? "✔️" : ""}
              </td>
                  <td className="border border-black p-2 align-top text-xs max-h-[150px] overflow-hidden">
                    <div className="line-clamp-6">{comments}</div>
              </td>
            </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRiskMatrix = () => (
        <div className="mb-4">
      <div className="flex justify-center mb-3">
            <img
              src="/home_risk_assessment.png"
              alt="Risk Matrix"
          className="max-w-full h-auto"
          style={{ maxHeight: '300px' }}
            />
          </div>
      <div className="space-y-2 text-xs">
        <h3 className="text-sm font-semibold underline text-center mb-2">
              Risk Assessment Outcome – Proceed with Visit as follows:
            </h3>
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
  );

  const renderRiskTable = () => (
    <div className="mb-4 page-break-inside-avoid">
      {/* 🔧 BLOCK-BASED TABLE: Each row is atomic, height adjusts to content */}
      <table className="w-full border-collapse border border-black text-xs risk-table">
            <thead>
              <tr className="bg-gray-400 page-break-after-avoid">
            <th className="border border-black p-2 text-left font-bold text-black risk-col-issue">Issue/Task</th>
            <th className="border border-black p-2 text-left font-bold text-black risk-col-score">Risk Score</th>
            <th className="border border-black p-2 text-left font-bold text-black risk-col-control">Control Measure</th>
            <th className="border border-black p-2 text-left font-bold text-black risk-col-responsible">Person Responsible</th>
              </tr>
            </thead>
            <tbody>
              {filledRiskRows.map((row) => (
                <tr key={row} className="page-break-inside-avoid risk-row">
                  <td className="border border-black p-2 align-top risk-col-issue">
                    <div className="break-words whitespace-normal leading-relaxed">{getFieldValue(`issue${row}`)}</div>
                  </td>
                  <td className="border border-black p-2 align-top text-center risk-col-score">
                    <div className="break-words whitespace-normal">{getFieldValue(`riskScore${row}`)}</div>
                  </td>
                  <td className="border border-black p-2 align-top risk-col-control">
                    <div className="break-words whitespace-normal leading-relaxed">{getFieldValue(`control${row}`)}</div>
                  </td>
                  <td className="border border-black p-2 align-top risk-col-responsible">
                    <div className="break-words whitespace-normal leading-relaxed">{getFieldValue(`responsible${row}`)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  );

  const renderSignature = () => (
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
          <div className="border-b-2 border-black pb-1 min-h-[24px] font-bold">
            {formData?.designation ?? ""}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUnit = (unit: ContentUnit) => {
    switch (unit.type) {
      case 'metadata': return renderMetadata();
      case 'qa_section': return renderQASection(unit.sectionIndex);
      case 'risk_matrix': return renderRiskMatrix();
      case 'risk_table': return renderRiskTable();
      case 'signature': return renderSignature();
      default: return null;
    }
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
      <div className="flex justify-center mb-0">
        <img
          alt="Infinity Logo"
          src="/infinity_logo.png"
          width={150}
          height={60}
          className="object-contain"
        />
      </div>
      <div style={{ height: `${TOP_SPACER}px` }} />
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      <div style={{ height: `${BOTTOM_SPACER}px` }} />
      
      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-600 pt-2 border-t">
        <span>{(settings?.company_website || settings?.website || settings?.from_email) ? `Website: ${settings?.company_website || settings?.website || settings?.from_email}` : 'Website:'}</span>
        <span>{settings?.home_visit_form_id || 'HV001'}</span>
        <span>{settings?.review_date ? `Review Date: ${formatDate(settings.review_date)}` : 'Review Date:'}</span>
      </div>
    </div>
  );

  return (
    <div className="print:p-0">
      {/* Print-specific CSS + Block-based layout */}
      <style>{`
        /* 🔧 CONSISTENT COLUMN WIDTHS - Same across all rows */
        table.w-full {
          table-layout: fixed !important;
          width: 100% !important;
        }
        
        /* Keep column widths consistent for Q&A table */
        table.w-full th:nth-child(1),
        table.w-full td:nth-child(1) {
          width: 40% !important; /* Question column */
        }
        
        table.w-full th:nth-child(2),
        table.w-full td:nth-child(2) {
          width: 7% !important; /* YES column */
        }
        
        table.w-full th:nth-child(3),
        table.w-full td:nth-child(3) {
          width: 7% !important; /* NO column */
        }
        
        table.w-full th:nth-child(4),
        table.w-full td:nth-child(4) {
          width: 46% !important; /* COMMENTS column */
        }
        
        /* 🔧 RISK TABLE: Consistent column widths with proper space */
        table.risk-table {
          table-layout: fixed !important;
          width: 100% !important;
        }
        
        /* Risk table column widths - OPTIMIZED: More space for Control Measure */
        table.risk-table th.risk-col-issue,
        table.risk-table td.risk-col-issue {
          width: 22% !important; /* Issue/Task */
          min-width: 35% !important;
          max-width: 35% !important;
        }
        
        table.risk-table th.risk-col-score,
        table.risk-table td.risk-col-score {
          width: 8% !important; /* Risk Score - compact (just "low"/"high") */
          min-width: 12% !important;
          max-width: 12% !important;
        }
        
        table.risk-table th.risk-col-control,
        table.risk-table td.risk-col-control {
          width: 58% !important; /* Control Measure - MAXIMUM WIDTH for longer text */
          min-width: 35% !important;
          max-width: 35% !important;
        }
        
        table.risk-table th.risk-col-responsible,
        table.risk-table td.risk-col-responsible {
          width: 12% !important; /* Person Responsible - minimal for names only */
          min-width: 18% !important;
          max-width: 18% !important;
        }
        
        /* 🔧 ROW HEIGHT: Fully dynamic - expands to show ALL content */
        table.w-full tr,
        table.risk-table tr {
          height: auto !important; /* Dynamic height based on content */
          max-height: none !important; /* NO height limit! */
        }
        
        /* Ensure text wraps properly and is FULLY VISIBLE in all cells */
        table.w-full td,
        table.risk-table td {
          word-wrap: break-word !important;
          white-space: normal !important;
          overflow-wrap: break-word !important;
          word-break: normal !important; /* Don't break in middle of words */
          hyphens: none !important; /* No hyphenation */
          max-height: none !important; /* NO height limit! */
          overflow: visible !important; /* Show ALL text! */
        }
        
        /* Specific styling for control measure column to prevent awkward breaks */
        table.risk-table td.risk-col-control div,
        table.risk-table td.risk-col-control {
          word-break: normal !important;
          overflow-wrap: break-word !important;
          hyphens: none !important;
        }
        
        /* Remove any line-clamp restrictions */
        table.risk-table td div {
          display: block !important;
          -webkit-line-clamp: unset !important;
          -webkit-box-orient: unset !important;
          max-height: none !important;
          overflow: visible !important;
        }
        
        /* Line clamping for long text to prevent excessive height */
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* 🔧 BLOCK-BASED PAGINATION RULES */
        @media print {
          /* Treat each row as a SINGLE ATOMIC BLOCK - never split */
          table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: auto !important;
          }
          
          /* Risk table rows are also atomic blocks */
          table.risk-table tr.risk-row {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: auto !important;
          }
          
          /* If row doesn't fit, move entire row to next page */
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Keep section headers with their first row */
          .page-break-after-avoid {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          /* Force page break before certain elements */
          .page-break-before {
            page-break-before: always !important;
            break-before: always !important;
          }
          
          /* Allow tables to auto-paginate, but keep rows intact */
          table,
          table.risk-table {
            page-break-inside: auto !important;
          }
          
          /* Ensure text wraps and is FULLY VISIBLE in print - NO truncation! */
          table td,
          table.risk-table td {
            word-wrap: break-word !important;
            white-space: normal !important;
            overflow-wrap: break-word !important;
            word-break: normal !important; /* Don't break in middle of words */
            hyphens: none !important; /* No hyphenation */
            overflow: visible !important;
            max-height: none !important; /* NO height limit in print! */
          }
          
          /* Specific print styling for control measure to prevent awkward breaks */
          table.risk-table td.risk-col-control div,
          table.risk-table td.risk-col-control {
            word-break: normal !important;
            overflow-wrap: break-word !important;
            hyphens: none !important;
          }
          
          /* Remove line-clamp in print to show full text */
          table.risk-table td div {
            display: block !important;
            -webkit-line-clamp: unset !important;
            -webkit-box-orient: unset !important;
            max-height: none !important;
            overflow: visible !important;
          }
          
          /* Control orphans and widows within blocks */
          p, td, div {
            orphans: 3;
            widows: 3;
          }
          
          /* Hide measurement containers in print */
          [aria-hidden="true"] {
            display: none !important;
          }
          
          /* Ensure consistent column widths in print */
          table.w-full,
          table.risk-table {
            table-layout: fixed !important;
          }
          
          /* Risk table specific print widths - OPTIMIZED for Control Measure */
          table.risk-table th.risk-col-issue,
          table.risk-table td.risk-col-issue {
            width: 22% !important;
            min-width: 22% !important;
            max-width: 22% !important;
          }
          
          table.risk-table th.risk-col-score,
          table.risk-table td.risk-col-score {
            width: 8% !important;
            min-width: 8% !important;
            max-width: 8% !important;
          }
          
          table.risk-table th.risk-col-control,
          table.risk-table td.risk-col-control {
            width: 58% !important;
            min-width: 58% !important;
            max-width: 58% !important;
          }
          
          table.risk-table th.risk-col-responsible,
          table.risk-table td.risk-col-responsible {
            width: 12% !important;
            min-width: 12% !important;
            max-width: 12% !important;
          }
        }
        
        /* 🔧 Screen display: Keep blocks visible and well-spaced */
        @media screen {
          table tr {
            /* Rows are blocks that can grow based on content */
            min-height: 40px;
          }
        }
      `}</style>
      
      {/* Hidden measuring container */}
      <div style={{ position: 'absolute', left: -10000, top: 0, width: '734px', visibility: 'hidden' }} aria-hidden="true">
        {/* Budget measurement skeleton */}
        <div
          style={{
            width: '794px',
            height: '1123px',
            boxSizing: 'border-box',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="flex justify-center mb-0">
            <img alt="Infinity Logo" src="/infinity_logo.png" width={150} height={60} className="object-contain" />
          </div>
          <div style={{ height: `${TOP_SPACER}px` }} />
          <div ref={budgetRef} style={{ flex: 1 }} />
          <div style={{ height: `${BOTTOM_SPACER}px` }} />
          <div className="flex justify-between text-xs text-gray-600 pt-2 border-t">
            <span>{(settings?.company_website || settings?.website || settings?.from_email) ? `Website: ${settings?.company_website || settings?.website || settings?.from_email}` : 'Website:'}</span>
            <span>{settings?.home_visit_form_id || 'HV001'}</span>
            <span>{settings?.review_date ? `Review Date: ${formatDate(settings?.review_date)}` : 'Review Date:'}</span>
          </div>
        </div>

        {/* Measure actual unit heights */}
        {units.map((unit, i) => (
          <div key={`measure-${i}`} ref={(el) => { measureRefs.current[i] = el; }} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
            {renderUnit(unit)}
          </div>
        ))}
      </div>

      {/* Render paginated content */}
      {pages.map((unitIndices, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex + 1}>
          {unitIndices.map((unitIdx, i) => (
            <div key={`u-${unitIdx}`} style={{ marginBottom: i < unitIndices.length - 1 ? `${BLOCK_SPACING}px` : 0 }}>
              {renderUnit(units[unitIdx])}
            </div>
          ))}
    </A4Page>
      ))}
    </div>
  );
};

export default HomeVisitDynamic;
