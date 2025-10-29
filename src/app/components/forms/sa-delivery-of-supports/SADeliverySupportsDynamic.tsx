"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { saDeliverySchema, SchemaBlock } from "./schema";

// Dynamic SA Delivery of Supports View - Multiple A4 pages with auto page breaks
const SADeliverySupportsDynamic: React.FC<any> = ({ formData, commonFieldsData, images, settings }) => {
  
  const commonFieldMapping: Record<string, string> = {
    givenNames: "name",
    address: "street",
    dob: "dob",
    disability: "disability",
    ndisNumber: "ndis",
    state: "state",
    street: "street",
    postcode: "postCode",
    email: "email",
    phone: "phone",
    homePhone: "phone",
    sex: "sex",
  };

  // Get field value helper function
  const getFieldValue = (key: string): string => {
    let rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];

    // Fallbacks for legacy keys
    if ((rawValue === undefined || rawValue === null || rawValue === "") && key === 'phone') {
      rawValue = formData?.mobilePhone; // some submissions use mobilePhone
    }

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? "";
  };

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  // -------------------------
  // Section 1 Table (special)
  // -------------------------
  const renderSection1 = () => {
    return (
      <div key="section1" className="mb-6">
        {/* Section 1 Header */}
        <div className="mb-4">
          <p className="font-bold underline text-sm mb-3">Section 1</p>
        </div>

        {/* Main Form Table */}
        <div className="mb-4">
          <table className="w-full border border-black border-collapse text-xs">
            <tbody>
              {/* Date Row */}
              <tr>
                <td className="border border-black px-2 py-2 font-bold align-top w-1/5">
                  Date:
                </td>
                <td className="border border-black px-2 py-2 align-top" colSpan={3}>
                  <div className="text-xs">{getFieldValue('agreementDate') || ''}</div>
                </td>
              </tr>
              
              {/* Participant Details Header */}
              <tr className="bg-gray-300">
                <td className="border border-black px-2 py-2 font-bold align-top" colSpan={3}>
                  Participant Details
                </td>
                <td className="border border-black px-2 py-2 font-bold text-right align-top">
                  NDIS Number: <span className="font-normal">{getFieldValue('ndisNumber') || ''}</span>
                </td>
              </tr>
              
              {/* Name and Sex Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top">
                  <div className="font-bold text-xs">Surname:</div>
                  <div className="text-xs">{getFieldValue('surname') || ''}</div>
                </td>
                <td className="border border-black px-2 py-2 align-top">
                  <div className="font-bold text-xs">Given name(s):</div>
                  <div className="text-xs">{getFieldValue('givenNames') || ''}</div>
                </td>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs mb-2">Sex:</div>
                  <div className="space-y-1">
                    {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
                      <label key={option} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          readOnly
                          checked={getFieldValue('sex') === option}
                          className="w-3 h-3"
                          aria-label={`Sex - ${option}`}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              
              {/* Pronoun Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={4}>
                  <div className="font-bold text-xs">Pronoun:</div>
                  <div className="text-xs">{getFieldValue('pronoun') || ''}</div>
                </td>
              </tr>
              
              {/* Indigenous Status Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={3}>
                  <div className="font-bold text-xs">Are you an Aboriginal or Torres Strait Islander descent?</div>
                </td>
                <td className="border border-black px-2 py-2 align-top">
                  <div className="space-y-1">
                    {['Yes', 'No'].map(option => (
                      <label key={option} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          readOnly
                          checked={getFieldValue('indigenousStatus') === option}
                          className="w-3 h-3"
                          aria-label={`Indigenous Status - ${option}`}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
              
              {/* Preferred Name and DOB Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs">Preferred name:</div>
                  <div className="text-xs">{getFieldValue('preferredName') || ''}</div>
                </td>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs">Date of Birth:</div>
                  <div className="text-xs">{getFieldValue('dob') || ''}</div>
                </td>
              </tr>
              
              {/* Address Header */}
              <tr className="bg-gray-300">
                <td className="border border-black px-2 py-2 font-bold align-top" colSpan={4}>
                  Residential Address Details
                </td>
              </tr>
              
              {/* Street Address Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={4}>
                  <div className="font-bold text-xs">Number / Street:</div>
                  <div className="text-xs">{getFieldValue('street') || ''}</div>
                </td>
              </tr>
              
              {/* State and Postcode Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs">State:</div>
                  <div className="text-xs">{getFieldValue('state') || ''}</div>
                </td>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs">Postcode:</div>
                  <div className="text-xs">{getFieldValue('postcode') || ''}</div>
                </td>
              </tr>
              
              {/* Contact Details Header */}
              <tr className="bg-gray-300">
                <td className="border border-black px-2 py-2 font-bold align-top" colSpan={4}>
                  Participant Contact Details
                </td>
              </tr>
              
              {/* Email Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={4}>
                  <div className="font-bold text-xs">Email address:</div>
                  <div className="text-xs">{getFieldValue('email') || ''}</div>
                </td>
              </tr>
              
              {/* Phone Numbers Row */}
              <tr>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs">Home Phone No:</div>
                  <div className="text-xs">{getFieldValue('homePhone') || ''}</div>
                </td>
                <td className="border border-black px-2 py-2 align-top" colSpan={2}>
                  <div className="font-bold text-xs">Mobile No:</div>
                  <div className="text-xs">{getFieldValue('phone') || ''}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

            {/* Bottom Text - Immediately after table */}
            <div>
              <p className="text-xs leading-loose text-justify">
                All figures quoted are based on the NDIS Price Guide. This Service Agreement is made for the purpose of
                providing supports in accordance with the Individual&apos;s plan. It outlines the key responsibilities required to
                enable <span className="text-red-600 font-semibold">Infinity Supports WA</span> to deliver quality support to individuals
                with disabilities. This agreement is of an ongoing nature and will remain in place unless either party chooses to
                terminate by giving appropriate notice as mentioned in the &quot;Ending this Service Agreement&quot; section.
              </p>
            </div>
      </div>
    );
  };

  // -------------------------
  // Render Consent Table
  // -------------------------
  const renderConsentTableRows = (block: SchemaBlock, startRow = 0, endRowExclusive?: number) => {
    if (!block.items || block.items.length === 0) return null;
    const rows = (block.items as any[]).slice(startRow, endRowExclusive ?? block.items.length);

    return (
      <div key="consent_table" className="mb-6">
        <table className="w-full border border-black text-sm">
          <thead>
            <tr>
              <th className="border border-black text-left p-3 font-semibold leading-loose">Consent</th>
              <th className="border border-black w-32 p-3 font-semibold leading-loose">Response</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((consentItem: any, idx: number) => {
              const value = getFieldValue(consentItem.key);
              return (
                <tr key={startRow + idx}>
                  <td className="border border-black p-3 align-top leading-loose">
                    <div>
                      <p className="text-sm leading-loose">{consentItem.label}</p>
                      {consentItem.subItems && (
                        <ul className="list-disc ml-4 mt-2 text-sm leading-loose">
                          {consentItem.subItems.map((item: string, subIdx: number) => (
                            <li key={subIdx}>
                              {item === 'Others' ? (
                                <>Others: {getFieldValue('othersInfoSharingConsent') || '__________________________'}</>
                              ) : (
                                item
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-3 align-top">
                    <div className="space-y-2">
                      {(consentItem.items || []).map((opt: string) => (
                        <label key={opt} className="flex items-center" style={{ fontSize: '13px' }}>
                          <input
                            type="radio"
                            checked={value === opt}
                            readOnly
                            className="mr-2"
                            style={{ transform: 'scale(0.8)' }}
                            aria-label={`${consentItem.label} - ${opt}`}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  const renderConsentTable = (block: SchemaBlock) => renderConsentTableRows(block);

  // -------------------------
  // Render Signature Group (table format)
  // -------------------------
  const renderSignatureGroup = (block: SchemaBlock) => {
    const meta = block.meta || {};
    const sigValue = getFieldValue(meta.signatureKey || '');
    const dateValue = getFieldValue(meta.dateKey || '');
    const nameValue = getFieldValue(meta.nameKey || '');

    return (
      <div key={meta.title || 'signature'} className="mb-4">
        {meta.title && (
          <div className="mb-2">
            <h4 className="font-bold text-sm">{meta.title}</h4>
            {meta.titleNote && (
              <p className="text-sm leading-loose mb-2">{meta.titleNote}</p>
            )}
          </div>
        )}
        <table className="w-full border border-black" style={{ fontSize: '13px' }}>
          <tbody>
            <tr>
              <td className="border border-black p-4 leading-loose">
                <div className="flex">
                  <div className="w-1/3">
                    <strong>{meta.signatureLabel || 'Signature'}:</strong><br />
                    {sigValue?.startsWith('data:image') ? (
                      <img src={sigValue} alt="Signature" className="h-10 mt-1" />
                    ) : (
                      '__________________'
                    )}
                  </div>
                  <div className="w-1/3">
                    <strong>Date:</strong><br />
                    {dateValue || '___/___/____'}
                  </div>
                  <div className="w-1/3">
                    <strong>Name:</strong><br />
                    {nameValue || '____________________'}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // -------------------------
  // Generic renderers for blocks
  // -------------------------
  const renderBlock = (block: SchemaBlock) => {
    switch (block.type) {
      case 'section1_table':
        return renderSection1();
      
      case 'consent_table':
        return renderConsentTable(block);
      
      case 'signature_group':
        return renderSignatureGroup(block);
      
      case 'section_header':
        return (
          <div key={block.label} className="mb-3">
            <p className="font-bold underline text-sm">{block.label}</p>
          </div>
        );
      
      case 'section_with_list':
        return (
          <div key={block.label} className="mb-4">
            <p className="font-bold underline text-sm mb-2">{block.label}</p>
            {block.content && (
              <p className="text-sm leading-loose mb-2">{block.content}</p>
            )}
            <ul className="list-disc list-inside space-y-2 text-sm leading-loose">
              {(block.items || [])
                .filter((it): it is string => typeof it === 'string')
                .map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
            </ul>
          </div>
        );
      
      case 'paragraph':
        const content = block.content || '';
        return (
          <p key={content.substring(0, 50)} className="mb-2 text-sm leading-loose" style={{ fontSize: '14px' }}>
            {content.includes('Infinity Supports WA') ? (
              <>
                {content.split('Infinity Supports WA').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="text-red-600 font-semibold">Infinity Supports WA</span>}
                  </React.Fragment>
                ))}
              </>
            ) : (
              content
            )}
          </p>
        );
      
      case 'list':
        return (
          <ul key={(block.items || []).filter((it): it is string => typeof it === 'string').join('|').substring(0, 50)} className="list-disc list-inside space-y-2 text-sm leading-loose mb-4">
            {(block.items || [])
              .filter((it): it is string => typeof it === 'string')
              .map((item, idx) => (
                <li key={idx}>
                  {item.includes('Infinity Supports WA') ? (
                    <>
                      {item.split('Infinity Supports WA').map((part, i, arr) => (
                        <React.Fragment key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-red-600 font-semibold">Infinity Supports WA</span>}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
          </ul>
        );
      case 'checkbox': {
        const value = getFieldValue(block.key || '');
        return (
          <div key={block.key} className="mb-3 flex items-start">
            <input
              type="checkbox"
              checked={!!value}
              readOnly
              className="mr-2 mt-1"
              style={{ transform: 'scale(0.8)' }}
              aria-label={block.label}
            />
            <span className="text-sm leading-loose">{block.label}</span>
          </div>
        );
      }
      case 'radio': {
        const value = getFieldValue(block.key || '');
        const options = ((block.items || []).filter((it) => typeof it === 'string')) as string[];
        return (
          <div key={block.key} className="mb-3">
            <div className="text-sm font-semibold mb-2">{block.label}</div>
            <div className="space-y-1">
              {options.map((opt) => (
                <label key={opt} className="flex items-center text-sm">
                  <input
                    type="radio"
                    checked={value === opt}
                    readOnly
                    className="mr-2"
                    style={{ transform: 'scale(0.8)' }}
                    aria-label={`${block.label} - ${opt}`}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      }
      case 'signature': {
        const sigValue = getFieldValue(block.key || '');
        return (
          <div key={block.key} className="mb-3">
            <div className="text-sm font-semibold mb-1">{block.label}</div>
            <div className="border border-black p-2" style={{ minHeight: '40px' }}>
              {sigValue?.startsWith('data:image') ? (
                <img src={sigValue} alt="Signature" className="h-10" />
              ) : (
                '__________________'
              )}
            </div>
          </div>
        );
      }
      case 'text': {
        const displayValue = getFieldValue(block.key || '');
        return (
          <div key={block.key} className="mb-3">
            <div className="bg-gray-300 border border-black px-2 py-1">
              <span className="font-bold text-xs">{block.label}:</span>
            </div>
            <div className="border border-black border-t-0 p-2 bg-white text-xs">
              {displayValue || '__________________'}
            </div>
          </div>
        );
      }
      case 'date': {
        const displayValue = getFieldValue(block.key || '');
        return (
          <div key={block.key} className="mb-3">
            <div className="bg-gray-300 border border-black px-2 py-1">
              <span className="font-bold text-xs">{block.label}:</span>
            </div>
            <div className="border border-black border-t-0 p-2 bg-white text-xs">
              {displayValue || '___/___/____'}
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  // -------------------------
  // Pagination (measured height-based)
  // -------------------------
  const calculateBlockHeight = (block: SchemaBlock) => {
    // Reasonable approximations tuned to our typography
    if (block.type === 'section1_table') return 620; // table + bottom text
    if (block.type === 'section_header') return 38;
    if (block.type === 'paragraph') {
      const len = (block.content || '').length;
      const lines = Math.max(1, Math.ceil(len / 90));
      return 26 + lines * 18; // title padding + content
    }
    if (block.type === 'list') {
      const n = (block.items || []).filter((it): it is string => typeof it === 'string').length;
      return 22 + n * 22 + 10; // header + items + spacing
    }
    if (block.type === 'section_with_list') {
      const n = (block.items || []).filter((it): it is string => typeof it === 'string').length;
      const contentLen = (block.content || '').length;
      const contentLines = Math.ceil(contentLen / 90);
      return 34 + contentLines * 18 + n * 22 + 10;
    }
    if (block.type === 'checkbox') return 32;
    if (block.type === 'radio') return 28 + ((block.items || []).length * 20);
    if (block.type === 'text' || block.type === 'date') return 58;
    if (block.type === 'signature') return 120;
    if (block.type === 'consent_table') {
      // Header + 4 consent rows + info sharing sub-list + extra spacing
      const consentItems = (block.items || []).length;
      // Each consent row ~ 70px, header row ~ 30px
      let h = 30 + consentItems * 70;
      // Estimate subItems for infoSharing entry if present
      const info = (block.items || []).find((it: any) => typeof it !== 'string' && it && it.key === 'infoSharingConsent') as any;
      if (info && Array.isArray(info.subItems)) h += info.subItems.length * 16 + 10;
      return h + 20;
    }
    if (block.type === 'signature_group') return 150;
    return 44;
  };
  
  // Measurement pass: measure real rendered heights to avoid clipping/gaps
  const TOP_SPACER = 16;           // ~2 lines after icon (slightly tighter)
  const BOTTOM_SPACER = 20;        // ~2 lines before footer
  const SAFETY_BUFFER = 6;         // minimal early-break to maximize space usage
  const BLOCK_SPACING = 6;         // tighter inter-block spacing
  const APPROX_CONTENT_HEIGHT = 980; // fallback content area height when not measured
  const [pageBudget, setPageBudget] = useState<number | null>(null);
  const PAGE_BUDGET = (pageBudget ?? APPROX_CONTENT_HEIGHT) - TOP_SPACER - BOTTOM_SPACER;

  type RenderUnit =
    | { kind: 'block'; blockIndex: number }
    | { kind: 'paragraph_part'; blockIndex: number; partIndex: number }
    | { kind: 'list_header'; blockIndex: number }
    | { kind: 'list_item'; blockIndex: number; itemIndex: number };

  const paragraphPartsMap = useMemo(() => {
    const map = new Map<number, string[]>();
    saDeliverySchema.forEach((b, bi) => {
      if (b.type === 'paragraph' && typeof b.content === 'string' && b.content.length > 450) {
        const sentences = b.content.split(/(?<=[.!?])\s+/);
        const parts: string[] = [];
        let cur = '';
        sentences.forEach((s) => {
          const candidate = cur ? cur + ' ' + s : s;
          if (candidate.length > 320) {
            if (cur) parts.push(cur);
            cur = s;
          } else {
            cur = candidate;
          }
        });
        if (cur) parts.push(cur);
        if (parts.length > 1) map.set(bi, parts);
      }
    });
    return map;
  }, []);

  const units: RenderUnit[] = useMemo(() => {
    const acc: RenderUnit[] = [];
    saDeliverySchema.forEach((b, bi) => {
      const parts = paragraphPartsMap.get(bi);
      if (parts && parts.length > 1) {
        parts.forEach((_, pi) => acc.push({ kind: 'paragraph_part', blockIndex: bi, partIndex: pi }));
      } else if (b.type === 'section_with_list') {
        acc.push({ kind: 'list_header', blockIndex: bi });
        (b.items || [])
          .filter((it): it is string => typeof it === 'string')
          .forEach((_, ii) => acc.push({ kind: 'list_item', blockIndex: bi, itemIndex: ii }));
      } else {
        acc.push({ kind: 'block', blockIndex: bi });
      }
    });
    return acc;
  }, [paragraphPartsMap]);

  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);

  // Build pages using measured heights (fallback to estimates if not measured yet)
  const pages = useMemo(() => {
    const heights = measuredHeights ?? units.map((u) => {
      if (u.kind === 'paragraph_part') {
        // rough estimate when not yet measured
        const part = paragraphPartsMap.get(u.blockIndex)?.[u.partIndex] || '';
        const lines = Math.max(1, Math.ceil(part.length / 90));
        return 26 + lines * 18;
      } else if (u.kind === 'list_header') {
        const b = saDeliverySchema[u.blockIndex];
        const contentLen = (b.content || '').length;
        const contentLines = Math.ceil(contentLen / 90);
        return 28 + contentLines * 18; // header + optional intro content
      } else if (u.kind === 'list_item') {
        const b = saDeliverySchema[u.blockIndex];
        const item = ((b.items || []) as string[])[u.itemIndex] || '';
        const lines = Math.max(1, Math.ceil(item.length / 90));
        return 18 + lines * 18;
      }
      return calculateBlockHeight(saDeliverySchema[u.blockIndex]);
    });
    const out: number[][] = [];
    let current: number[] = [];
    let h = 0;
    const getExtraSpacing = (prevUnitIdx: number | null, currUnitIdx: number) => {
      if (prevUnitIdx === null) return 0;
      const prev = units[prevUnitIdx];
      const curr = units[currUnitIdx];
      // No inter-item spacing for consecutive list items from same block
      if (prev.kind === 'list_item' && curr.kind === 'list_item' && prev.blockIndex === curr.blockIndex) return 0;
      // No extra spacing between paragraph parts from same block
      if (prev.kind === 'paragraph_part' && curr.kind === 'paragraph_part' && prev.blockIndex === curr.blockIndex) return 0;
      // No spacing between list header and first list item (header already has margin)
      if (prev.kind === 'list_header' && curr.kind === 'list_item' && prev.blockIndex === curr.blockIndex) return 0;
      return BLOCK_SPACING;
    };

    heights.forEach((bh, idx) => {
      const extra = getExtraSpacing(current.length ? current[current.length - 1] : null, idx);
      const next = bh + extra;
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

    // Debug
    try {
      console.groupCollapsed('[SADeliverySupportsDynamic] Pagination');
      console.log('Total units:', units.length);
      console.log('Budget per page (px):', PAGE_BUDGET, 'Top spacer:', TOP_SPACER, 'Bottom spacer:', BOTTOM_SPACER);
      out.forEach((idxs, i) => {
        let sum = 0;
        idxs.forEach((bi, k) => {
          const prev = k ? idxs[k - 1] : null;
          const extra = prev === null ? 0 : getExtraSpacing(prev, bi);
          sum += heights[bi] + extra;
        });
        console.log(`[SADeliverySupportsDynamic] page ${i + 1} height`, sum, 'blocks', idxs.length);
      });
      console.groupEnd?.();
    } catch {}

    return out;
  }, [measuredHeights, units]);

  useEffect(() => {
    // After first paint, read actual heights
    const hs = units.map((u, i) => {
      const el = measureRefs.current[i];
      if (el) return Math.ceil(el.getBoundingClientRect().height);
      if (u.kind === 'paragraph_part') {
        const part = paragraphPartsMap.get(u.blockIndex)?.[u.partIndex] || '';
        const lines = Math.max(1, Math.ceil(part.length / 90));
        return 26 + lines * 18;
      } else if (u.kind === 'list_header') {
        const b = saDeliverySchema[u.blockIndex];
        const contentLen = (b.content || '').length;
        const contentLines = Math.ceil(contentLen / 90);
        return 28 + contentLines * 18;
      } else if (u.kind === 'list_item') {
        const b = saDeliverySchema[u.blockIndex];
        const item = ((b.items || []) as string[])[u.itemIndex] || '';
        const lines = Math.max(1, Math.ceil(item.length / 90));
        return 18 + lines * 18;
      }
      return calculateBlockHeight(saDeliverySchema[u.blockIndex]);
    });
    if (hs.some((x) => x && x > 0)) setMeasuredHeights(hs);
  }, [units]);

  // Measure page content budget using a hidden A4 skeleton (exact available height)
  const budgetRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (budgetRef.current) {
      const h = Math.floor(budgetRef.current.getBoundingClientRect().height);
      if (h && h > 0) {
        setPageBudget(h);
        try { console.log('[SADeliverySupportsDynamic] measured page budget =', h); } catch {}
      }
    }
  }, []);

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
          src={images?.infinityLogo || "/infinity_logo.png"}
          width={180}
          height={70}
          className="object-contain"
        />
      </div>
      {/* Fixed 2-line spacer after header */}
      <div style={{ height: '24px' }} />
      
      {/* Title (only on first page) */}
      {pageNumber === 1 && (
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold underline">SERVICE AGREEMENT FOR SERVICE DELIVERY</h1>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      {/* Fixed 2-line spacer before footer */}
      <div style={{ height: '24px' }} />
      
      {/* Footer - matches Client Intake Form pattern with settings API */}
      <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
        <span>Website: {settings?.company_website || settings?.website || settings?.from_email || ''}</span>
        <span>{settings?.sa_delivery_of_supports || ''}</span>
        <span>Review Date: {settings?.review_date ? formatDate(settings.review_date) : ''}</span>
      </div>
    </div>
  );

  return (
    <div className="print:p-0">
      {/* Hidden measuring container (same content width as page content: 794 - 2*30 = 734) */}
      <div style={{ position: 'absolute', left: -10000, top: 0, width: '734px', visibility: 'hidden' }} aria-hidden>
        {/* A4 skeleton to measure exact content area height */}
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
            <img alt="Infinity Logo" src={images?.infinityLogo || '/infinity_logo.png'} width={180} height={70} className="object-contain" />
          </div>
          <div style={{ height: `${TOP_SPACER}px` }} />
          <div ref={budgetRef} style={{ flex: 1 }} />
          <div style={{ height: `${BOTTOM_SPACER}px` }} />
          <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t">
            <span>Website:</span>
            <span>SA1234</span>
            <span>Review Date:</span>
          </div>
        </div>

        {units.map((u, i) => (
          <div key={`measure-${i}`} ref={(el) => (measureRefs.current[i] = el)} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
            {u.kind === 'paragraph_part' ? (
              <p className="mb-2 text-sm leading-loose" style={{ fontSize: '14px' }}>
                {paragraphPartsMap.get(u.blockIndex)?.[u.partIndex] || ''}
              </p>
            ) : u.kind === 'list_header' ? (
              <div>
                <p className="font-bold underline text-sm mb-2">{saDeliverySchema[u.blockIndex].label}</p>
                {saDeliverySchema[u.blockIndex].content && (
                  <p className="text-sm leading-loose mb-2">{saDeliverySchema[u.blockIndex].content}</p>
                )}
              </div>
            ) : u.kind === 'list_item' ? (
              <ul className="list-disc list-inside text-sm leading-loose">
                <li>{(((saDeliverySchema[u.blockIndex].items || []) as string[])[u.itemIndex]) || ''}</li>
              </ul>
            ) : (
              renderBlock(saDeliverySchema[u.blockIndex])
            )}
          </div>
        ))}
      </div>

      {/* Render paginated content */}
      {pages.map((idxs, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex + 1}>
          {(() => {
            const nodes: React.ReactNode[] = [];
            let i = 0;
            while (i < idxs.length) {
              const unitIdx = idxs[i];
              const u = units[unitIdx];
              if (u.kind === 'paragraph_part') {
                nodes.push(
                  <div key={`u-${unitIdx}`} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
                    <p className="mb-2 text-sm leading-loose" style={{ fontSize: '14px' }}>
                      {paragraphPartsMap.get(u.blockIndex)?.[u.partIndex] || ''}
                    </p>
                  </div>
                );
                i += 1;
                continue;
              }
              if (u.kind === 'list_header') {
                const blockIndex = u.blockIndex;
                nodes.push(
                  <div key={`hdr-${unitIdx}`} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
                    <p className="font-bold underline text-sm mb-2">{saDeliverySchema[blockIndex].label}</p>
                    {saDeliverySchema[blockIndex].content && (
                      <p className="text-sm leading-loose mb-2">{saDeliverySchema[blockIndex].content}</p>
                    )}
                  </div>
                );
                i += 1;
                continue;
              }
              if (u.kind === 'list_item') {
                const blockIndex = u.blockIndex;
                const it = ((saDeliverySchema[blockIndex].items || []) as string[])[(u as any).itemIndex] || '';
                nodes.push(
                  <div key={`li-${unitIdx}`} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
                    <ul className="list-disc list-inside text-sm leading-loose"><li>{it}</li></ul>
                  </div>
                );
                i += 1;
                continue;
              }
              // default whole block
              nodes.push(
                <div key={`u-${unitIdx}`} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
                  {renderBlock(saDeliverySchema[u.blockIndex])}
                </div>
              );
              i += 1;
            }
            return nodes;
          })()}
        </A4Page>
      ))}
    </div>
  );
};

export default SADeliverySupportsDynamic;

