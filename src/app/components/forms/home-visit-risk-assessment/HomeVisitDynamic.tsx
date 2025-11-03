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

    return rawValue ?? '';
  };

  // Schema definition
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

  // Filter filled risk rows
  const filledRiskRows = [1, 2, 3, 4, 5].filter(row => {
    const issue = getFieldValue(`issue${row}`);
    const riskScore = getFieldValue(`riskScore${row}`);
    const control = getFieldValue(`control${row}`);
    const responsible = getFieldValue(`responsible${row}`);
    return issue || riskScore || control || responsible;
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

  // Height estimation
  const calculateUnitHeight = (unit: ContentUnit): number => {
    if (unit.type === 'metadata') return 120;
    if (unit.type === 'qa_section') {
      const section = allQuestions[unit.sectionIndex];
      const headerHeight = section.title ? 35 : 0;
      const fieldsHeight = section.fields.length * 50; // Average per question
      return headerHeight + fieldsHeight + 10;
    }
    if (unit.type === 'risk_matrix') return 450;
    if (unit.type === 'risk_table') {
      const headerHeight = 35;
      const rowHeight = filledRiskRows.length * 60;
      return headerHeight + rowHeight + 20;
    }
    if (unit.type === 'signature') return 150;
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

  // Build pages
  const pages = useMemo(() => {
    const heights = measuredHeights ?? units.map(calculateUnitHeight);
    const out: number[][] = [];
    let current: number[] = [];
    let h = 0;

    heights.forEach((unitHeight, idx) => {
      const extra = current.length > 0 ? BLOCK_SPACING : 0;
      const next = unitHeight + extra;
      
      if (h + next + SAFETY_BUFFER > PAGE_BUDGET && current.length > 0) {
        out.push(current);
        current = [idx];
        h = next;
      } else {
        current.push(idx);
        h += next;
      }
    });
    
    if (current.length) out.push(current);
    
    console.log('[HomeVisitDynamic] Pagination:', out.length, 'pages');
    return out;
  }, [measuredHeights, units, PAGE_BUDGET]);

  // Measure actual heights after render
  useEffect(() => {
    const hs = units.map((_, i) => {
      const el = measureRefs.current[i];
      if (el) return Math.ceil(el.getBoundingClientRect().height);
      return calculateUnitHeight(units[i]);
    });
    if (hs.some((x) => x && x > 0)) setMeasuredHeights(hs);
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
      <div className="mb-4" key={`qa-${sectionIndex}`}>
        {section.title && (
          <div className="bg-gray-300 border border-black p-2 font-bold text-sm">
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
                  <tr key={field.key}>
                    <td className="border border-black p-2 align-top font-medium">{field.label}</td>
                    <td className="border border-black text-center align-top"></td>
                    <td className="border border-black text-center align-top"></td>
                    <td className="border border-black p-2 align-top">
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
                        {comments && <div className="mt-1 italic text-xs">{comments}</div>}
                      </div>
              </td>
            </tr>
                );
              }

              return (
                <tr key={field.key}>
                  <td className="border border-black p-2 align-top font-medium">{field.label}</td>
                  <td className="border border-black text-center align-top p-1">
                    {value?.toLowerCase() === "yes" ? "✔️" : ""}
              </td>
                  <td className="border border-black text-center align-top p-1">
                    {value?.toLowerCase() === "no" ? "✔️" : ""}
              </td>
                  <td className="border border-black p-2 align-top text-xs">
                    {comments}
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
    <div className="mb-4">
      <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-400">
            <th className="border border-black p-2 text-left font-bold text-black">Issue/Task</th>
            <th className="border border-black p-2 text-left font-bold text-black">Risk Score</th>
            <th className="border border-black p-2 text-left font-bold text-black">Control Measure</th>
            <th className="border border-black p-2 text-left font-bold text-black">Person Responsible</th>
              </tr>
            </thead>
            <tbody>
              {filledRiskRows.map((row) => (
                <tr key={row}>
                  <td className="border border-black p-2 align-top">
                {getFieldValue(`issue${row}`)}
                  </td>
                  <td className="border border-black p-2 align-top">
                {getFieldValue(`riskScore${row}`)}
                  </td>
                  <td className="border border-black p-2 align-top">
                {getFieldValue(`control${row}`)}
                  </td>
                  <td className="border border-black p-2 align-top">
                {getFieldValue(`responsible${row}`)}
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
        <span>{settings?.company_website ? `Website: ${settings.company_website}` : 'Website:'}</span>
        <span>{settings?.home_visit_form_id || ''}</span>
        <span>{settings?.review_date ? `Review Date: ${formatDate(settings.review_date)}` : 'Review Date:'}</span>
      </div>
    </div>
  );

  return (
    <div className="print:p-0">
      {/* Hidden measuring container */}
      <div style={{ position: 'absolute', left: -10000, top: 0, width: '734px', visibility: 'hidden' }} aria-hidden>
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
            <span>Website:</span>
            <span>ID</span>
            <span>Review Date:</span>
          </div>
        </div>

        {/* Measure actual unit heights */}
        {units.map((unit, i) => (
          <div key={`measure-${i}`} ref={(el) => (measureRefs.current[i] = el)} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
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
