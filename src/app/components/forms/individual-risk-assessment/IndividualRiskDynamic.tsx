"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { iraSchema, IRABlock } from './schema';

type Props = {
  formData: Record<string, any>;
  commonFieldsData?: Record<string, any>;
  settings?: Record<string, any>;
  images?: { infinityLogo?: string };
};

const TOP_SPACER = 24; // strict 2-line space under header
const BOTTOM_SPACER = 24; // strict 2-line space above footer
const BLOCK_SPACING = 8;
const SAFETY_BUFFER = 6; // generic small buffer used in estimates
const BOTTOM_GAP = 28; // enforce ~2 lines of space above the footer

const IndividualRiskDynamic: React.FC<Props> = ({ formData = {}, commonFieldsData = {}, settings = {}, images = {} }) => {
  const getValue = (key: string) => {
    const map: Record<string, string> = {
      personName: 'name',
      phoneNumber: 'phone',
      ndisNumber: 'ndis',
      postcode: 'postCode',
      email: 'email',
      street: 'street',
      state: 'state',
      dob: 'dob',
    };
    const raw = map[key] ? commonFieldsData?.[map[key]] : formData?.[key];
    if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const d = parseISO(raw);
      if (isValid(d)) return format(d, 'dd-MM-yyyy');
    }
    return raw ?? '';
  };

  const riskIndices = useMemo(() => {
    const set = new Set<number>();
    const fields = ['riskIdentified', 'likelihood', 'severity', 'controls'];
    Object.keys(formData || {}).forEach((k) => {
      for (const f of fields) {
        const m = k.match(new RegExp(`^${f}_(\\d+)$`));
        if (m) {
          const i = parseInt(m[1], 10);
          const v = (formData[k] || '').toString().trim();
          if (v) set.add(i);
        }
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [formData]);

  // Blocks to render
  const blocks: IRABlock[] = iraSchema;

  // Re-measure trigger (e.g., after images load)
  const [measureVersion, setMeasureVersion] = useState(0);
  const didKickMeasureRef = useRef(false);

  // Measurement setup with unit-splitting for Additional Information
  type Unit =
    | { kind: 'block'; index: number }
    | { kind: 'ai_header' }
    | { kind: 'ai_paragraph'; text: string; isFirst: boolean }
    | { kind: 'risk_header' }
    | { kind: 'risk_row'; i: number };

  const additionalSupportText = useMemo(() => (getValue('additionalSupport') || '').toString(), [formData]);

  const additionalSupportParas = useMemo(() => {
    const raw = additionalSupportText
      .split(/\n{2,}|\r?\n/)
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);
    // Further split very long paragraphs into sentence chunks to improve packing
    const expanded: string[] = [];
    raw.forEach((p: string) => {
      if (p.length > 400) {
        const parts = p.split(/(?<=[.!?])\s+/).map((s: string) => s.trim()).filter(Boolean);
        // Combine small sentences to avoid too many tiny blocks
        let buffer = '';
        parts.forEach((s: string) => {
          if ((buffer + ' ' + s).trim().length < 220) {
            buffer = (buffer ? buffer + ' ' : '') + s;
          } else {
            if (buffer) expanded.push(buffer);
            buffer = s;
          }
        });
        if (buffer) expanded.push(buffer);
      } else {
        expanded.push(p);
      }
    });
    return expanded.length ? expanded : [];
  }, [additionalSupportText]);

  const units: Unit[] = useMemo(() => {
    const out: Unit[] = [];
    blocks.forEach((b, i) => {
      if (b.type === 'risk_table') {
        out.push({ kind: 'risk_header' });
        riskIndices.forEach((ri) => out.push({ kind: 'risk_row', i: ri }));
      } else if (b.type === 'additional_info' && additionalSupportParas.length) {
        out.push({ kind: 'ai_header' });
        additionalSupportParas.forEach((p: string, idx: number) => out.push({ kind: 'ai_paragraph', text: p, isFirst: idx === 0 }));
      } else {
        out.push({ kind: 'block', index: i });
      }
    });
    return out;
  }, [blocks, additionalSupportParas]);
  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);
  const [pageBudget, setPageBudget] = useState<number | null>(null);
  const PAGE_BUDGET = (pageBudget ?? 980) - TOP_SPACER - BOTTOM_SPACER;
  const budgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (budgetRef.current) {
      const h = Math.floor(budgetRef.current.getBoundingClientRect().height);
      if (h > 0) setPageBudget(h);
    }
  }, [measureVersion]);

  // Ensure a second pass after first paint to capture late layout
  useEffect(() => {
    if (!didKickMeasureRef.current) {
      didKickMeasureRef.current = true;
      requestAnimationFrame(() => setMeasureVersion((v) => v + 1));
    }
  }, []);

  const estimateHeightForBlock = (b: IRABlock): number => {
    switch (b.type) {
      case 'title':
        return 40;
      case 'header_grid':
        return 140;
      case 'risk_matrix':
        return 430; // scaled image + legend
      case 'risk_table':
        return 0; // handled per-row via split units
      case 'additional_info':
        return 0; // handled via split units
      case 'review_and_signature':
        return 120;
      default:
        return 60;
    }
  };

  const estimateHeightForUnit = (u: Unit): number => {
    if (u.kind === 'block') return estimateHeightForBlock(blocks[u.index]);
    if (u.kind === 'ai_header') return 30; // section bar
    if (u.kind === 'risk_header') return 34; // table header
    if (u.kind === 'risk_row') return 60; // closer to actual single-row height
    // paragraph box approx height by characters
    const chars = u.text.length;
    const approxLines = Math.ceil(chars / 110);
    return 16 + approxLines * 14; // padding + lines (tighter)
  };

  useEffect(() => {
    const hs = units.map((u, idx) => {
      const el = measureRefs.current[idx];
      const est = estimateHeightForUnit(u);
      if (el) {
        const h = Math.ceil(el.getBoundingClientRect().height);
        if (h > 0) return h; // trust measurement for all units
      }
      return est;
    });
    if (hs.some((x) => x && x > 0)) setMeasuredHeights(hs);
  }, [units, measureVersion]);

  const pages = useMemo(() => {
    const hs = measuredHeights ?? units.map(() => 60);
    const out: number[][] = [];
    let cur: number[] = [];
    let h = 0;
    const MIN_SPACE_AFTER_TABLE = 90; // allow tighter packing after table
    hs.forEach((bh, idx) => {
      const next = (cur.length ? BLOCK_SPACING : 0) + bh;
      const prevIdx = cur.length ? cur[cur.length - 1] : null;
      const prevIsRiskTable = prevIdx !== null && units[prevIdx].kind === 'block' && blocks[(units[prevIdx] as any).index].type === 'risk_table';
      const remaining = PAGE_BUDGET - h;
      // If page would start with a risk row, we render the table header; include its height in the fit check
      const pageStartHeaderOverhead = cur.length === 0 && units[idx].kind === 'risk_row' ? 34 : 0;

      if (
        // Ensure a minimum bottom gap so we never collide with footer, and include any start-of-page overhead
        (h + next + pageStartHeaderOverhead + BOTTOM_GAP > PAGE_BUDGET && cur.length) ||
        (prevIsRiskTable && remaining < MIN_SPACE_AFTER_TABLE) ||
        (units[idx].kind === 'ai_header' && (() => {
          const headerH = 30; // section bar
          const firstPara = additionalSupportParas?.[0] || '';
          const approxLines = Math.ceil(firstPara.length / 110);
          const firstParaH = 16 + approxLines * 14; // padding + lines (tighter)
          const need = headerH + firstParaH + BOTTOM_GAP; // require bottom gap on page with AI header + first para
          return remaining < need;
        })())
      ) {
        out.push(cur);
        cur = [idx];
        h = bh;
      } else {
        cur.push(idx);
        h += next;
      }
    });
    if (cur.length) out.push(cur);
    try {
      console.groupCollapsed('[IRA Dynamic] Pagination');
      console.log('blocks:', blocks.length, 'units:', units.length, 'pageBudget:', PAGE_BUDGET);
      out.forEach((idxs, i) => {
        const pageHeight = idxs.reduce((sum, ui, k) => sum + hs[ui] + (k ? BLOCK_SPACING : 0), 0);
        console.log(`page ${i + 1}: units=${idxs.length}, height=${pageHeight}`);
      });
      console.groupEnd?.();
    } catch {}
    return out;
  }, [measuredHeights, units, PAGE_BUDGET]);

  const Title = () => (
    <div className="text-center mb-3">
      <h1 className="text-lg font-bold">Individual Activity Risk Assessment</h1>
    </div>
  );

  const HeaderGrid = () => (
    <div className="mb-4 text-xs">
      <div className="bg-gray-300 border border-black px-2 py-1 font-bold">General Information</div>
      <table className="w-full border border-black border-t-0 border-collapse text-xs">
        <tbody>
          <tr>
            <td className="w-[40%] border-r border-black p-2 font-bold">Person's Name:</td>
            <td className="p-2">{getValue('personName') || '____________________'}</td>
          </tr>
          <tr>
            <td className="w-[40%] border-t border-r border-black p-2 font-bold">Date:</td>
            <td className="border-t border-black p-2">{getValue('date') || '___/___/____'}</td>
          </tr>
          <tr>
            <td className="w-[40%] border-t border-r border-black p-2 font-bold">Activity:</td>
            <td className="border-t border-black p-2">{getValue('activity') || '____________________'}</td>
          </tr>
          <tr>
            <td className="w-[40%] border-t border-r border-black p-2 font-bold">Assessor's Name:</td>
            <td className="border-t border-black p-2">{getValue('assessorName') || '____________________'}</td>
          </tr>
          <tr>
            <td className="w-[40%] border-t border-r border-black p-2 font-bold">Location:</td>
            <td className="border-t border-black p-2">{getValue('location') || '____________________'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const riskMatrixMeasuredRef = useRef(false);
  const RiskMatrix = () => (
    <div className="mb-4">
      <img
        src="/individual-risk-assessment.png"
        alt="Risk Matrix"
        className="w-full h-auto max-h-[420px] object-contain"
        onLoad={() => {
          if (!riskMatrixMeasuredRef.current) {
            riskMatrixMeasuredRef.current = true;
            setMeasureVersion((v) => v + 1);
          }
        }}
      />
      <div className="mt-2 text-xs">
        <div className="font-bold underline text-green-700">LOW GREEN</div>
        <div className="mb-2">Visit acceptable. Ensure control options are followed.</div>
        <div className="font-bold underline text-yellow-600">MEDIUM YELLOW</div>
        <div className="mb-2">Visit should only proceed after consultation with manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk.</div>
        <div className="font-bold underline text-orange-700">MODERATE ORANGE</div>
        <div className="mb-2">Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.</div>
        <div className="font-bold underline text-red-700">HIGH RED</div>
        <div>Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.</div>
      </div>
    </div>
  );

  const RiskTable = () => (
    <div className="mb-4">
      {riskIndices.length > 0 && (
        <div className="bg-gray-300 border border-black px-2 py-1 text-xs font-bold">Risk Assessment</div>
      )}
      {riskIndices.length > 0 && (
        <table className="w-full border border-black text-xs border-collapse">
          <thead>
            <tr>
              <th className="border border-black p-2 text-left w-[35%]">Risk Identified</th>
              <th className="border border-black p-2 text-left w-[15%]">Likelihood</th>
              <th className="border border-black p-2 text-left w-[15%]">Severity</th>
              <th className="border border-black p-2 text-left w-[35%]">Control Measures</th>
            </tr>
          </thead>
          <tbody>
            {riskIndices.map((i) => (
              <tr key={i}>
                <td className="border border-black p-2 align-top">{getValue(`riskIdentified_${i}`)}</td>
                <td className="border border-black p-2 align-top">{getValue(`likelihood_${i}`)}</td>
                <td className="border border-black p-2 align-top">{getValue(`severity_${i}`)}</td>
            <td className="border border-black p-2 align-top whitespace-pre-wrap break-words">{getValue(`controls_${i}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const AdditionalInfo = () => (
    <div className="mb-6">
      <div className="bg-gray-300 border border-black px-2 py-1 text-xs font-bold">Additional Information</div>
      <div className="border border-black border-t-0 p-2 text-xs whitespace-pre-wrap min-h-[40px]">
        <div className="font-bold mb-1">Additional Support Requirements</div>
        <div>
          {getValue('additionalSupport') || 'No additional support requirements specified.'}
        </div>
      </div>
    </div>
  );

  const ReviewAndSignature = () => {
    const sig = (getValue('assessorSignature') as string) || '';
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center text-sm">
          <span className="font-bold mr-2">Assessment Review Date:</span>
          <span>{getValue('reviewDate') || '___/___/____'}</span>
        </div>
        <div>
          <div className="font-bold text-sm mb-1">Assessor's Signature</div>
          <div className="border border-black p-2 min-h-[40px] flex items-center">
            {sig ? <img src={sig} alt="Assessor Signature" className="h-10 object-contain" /> : <span>__________________</span>}
          </div>
        </div>
      </div>
    );
  };

  const renderBlock = (b: IRABlock) => {
    switch (b.type) {
      case 'title':
        return <Title />;
      case 'header_grid':
        return <HeaderGrid />;
      case 'risk_matrix':
        return <RiskMatrix />;
      case 'risk_table':
        return null; // handled via split units
      case 'additional_info':
        return null; // handled by split units
      case 'review_and_signature':
        return <ReviewAndSignature />;
      default:
        return null;
    }
  };

  const renderUnit = (u: Unit) => {
    if (u.kind === 'block') return renderBlock(blocks[u.index]);
    if (u.kind === 'ai_header') {
      return (
        <div className="mb-2 text-xs">
          <div className="bg-gray-300 border border-black px-2 py-1 font-bold">Additional Information</div>
        </div>
      );
    }
    if (u.kind === 'ai_paragraph') {
      return (
        <div className="text-xs whitespace-pre-wrap break-words mb-2">
          {u.isFirst && <div className="font-bold mb-1">Additional Support Requirements</div>}
          <div>{u.text}</div>
        </div>
      );
    }
    if (u.kind === 'risk_header') {
      return (
        <div className="mb-2">
          {riskIndices.length > 0 && (
            <>
              <div className="bg-gray-300 border border-black px-2 py-1 text-xs font-bold">Risk Assessment</div>
              <table className="w-full border border-black text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="border border-black p-2 text-left w-[35%]">Risk Identified</th>
                    <th className="border border-black p-2 text-left w-[15%]">Likelihood</th>
                    <th className="border border-black p-2 text-left w-[15%]">Severity</th>
                    <th className="border border-black p-2 text-left w-[35%]">Control Measures</th>
                  </tr>
                </thead>
              </table>
            </>
          )}
        </div>
      );
    }
    if (u.kind === 'risk_row') {
      const i = u.i;
      return (
        <table className="w-full border border-black text-xs border-collapse">
          <tbody>
            <tr>
              <td className="border border-black p-2 align-top w-[35%]">{getValue(`riskIdentified_${i}`)}</td>
              <td className="border border-black p-2 align-top w-[15%]">{getValue(`likelihood_${i}`)}</td>
              <td className="border border-black p-2 align-top w-[15%]">{getValue(`severity_${i}`)}</td>
              <td className="border border-black p-2 align-top w-[35%] whitespace-pre-wrap break-words">{getValue(`controls_${i}`)}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    return null;
  };

  const A4Page = ({ children, pageNumber }: { children: React.ReactNode; pageNumber: number }) => (
    <div
      className="bg-white mx-auto shadow-md"
      style={{
        width: '794px',
        height: '1123px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        pageBreakAfter: 'always',
        marginBottom: '20px',
      }}
    >
      <div className="flex justify-center">
        <img
          alt="Infinity Logo"
          src={images?.infinityLogo || '/infinity_logo.png'}
          width={180}
          height={70}
          className="object-contain"
        />
      </div>
      <div style={{ height: `${TOP_SPACER}px` }} />
      <div className="flex-1 overflow-hidden">{children}</div>
      <div style={{ height: `${BOTTOM_SPACER}px` }} />
      <div className="flex justify-between text-xs text-gray-600 mt-2 pt-2 border-t">
        <span>Website: {settings?.company_website || settings?.website || settings?.from_email || ''}</span>
        <span>{settings?.individual_risk_assessment || ''}</span>
        <span>
          Review Date:{' '}
          {settings?.review_date && /^\d{4}-\d{2}-\d{2}$/.test(settings.review_date)
            ? format(parseISO(settings.review_date), 'dd-MM-yyyy')
            : ''}
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hidden measuring container to capture real heights */}
      <div style={{ position: 'absolute', left: -10000, top: 0, width: '794px', visibility: 'hidden' }} aria-hidden>
        <div
          style={{ width: '794px', height: '1123px', boxSizing: 'border-box', padding: '30px', display: 'flex', flexDirection: 'column' }}
        >
          <div className="flex justify-center">
            <img alt="Infinity Logo" src={images?.infinityLogo || '/infinity_logo.png'} width={180} height={70} className="object-contain" />
          </div>
          <div style={{ height: `${TOP_SPACER}px` }} />
          <div ref={budgetRef} style={{ flex: 1 }} />
          <div style={{ height: `${BOTTOM_SPACER}px` }} />
          {/* Footer placeholder to ensure measurement includes footer height */}
          <div className="flex justify-between text-xs text-gray-600 mt-2 pt-2 border-t">
            <span>Website:</span>
            <span>IRA</span>
            <span>Review Date:</span>
          </div>
        </div>

        {units.map((u, i) => (
          <div key={`m-${i}`} ref={(el) => { measureRefs.current[i] = el; }} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
            {u.kind === 'block' ? renderBlock(blocks[(u as any).index]) : renderUnit(u)}
          </div>
        ))}
      </div>

      {pages.map((idxs, p) => (
        <A4Page key={p} pageNumber={p + 1}>
          {(() => {
            const rendered: React.ReactNode[] = [];
            if (idxs.length > 0) {
              const firstUnit = units[idxs[0]] as any;
              if (firstUnit?.kind === 'risk_row') {
                rendered.push(
                  <div key={`repeat-risk-header-${p}`} className="mb-2">
                    <div className="bg-gray-300 border border-black px-2 py-1 text-xs font-bold">Risk Assessment</div>
                    <table className="w-full border border-black text-xs border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-black p-2 text-left w-[35%]">Risk Identified</th>
                          <th className="border border-black p-2 text-left w-[15%]">Likelihood</th>
                          <th className="border border-black p-2 text-left w-[15%]">Severity</th>
                          <th className="border border-black p-2 text-left w-[35%]">Control Measures</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                );
              } else if (firstUnit?.kind === 'ai_paragraph') {
                rendered.push(
                  <div key={`repeat-ai-header-${p}`} className="mb-2 text-xs">
                    <div className="bg-gray-300 border border-black px-2 py-1 font-bold">Additional Information</div>
                  </div>
                );
              }
            }
            idxs.forEach((i, k) => {
              rendered.push(
                <div key={`u-${p}-${i}`} style={{ marginBottom: k ? `${BLOCK_SPACING}px` : 0 }}>
                  {renderUnit(units[i])}
                </div>
              );
            });
            return rendered;
          })()}
        </A4Page>
      ))}
    </div>
  );
};

export default IndividualRiskDynamic;


