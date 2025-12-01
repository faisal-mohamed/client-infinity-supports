"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import A4PageWrapper from "./A4PageWrapper";
import { format, parseISO, isValid } from "date-fns";

interface Props {
  formData: Record<string, any>;
  commonFieldsData: Record<string, any>;
  settings: {
    company_website: string;
    multi_disciplinary_meeting: string;
    review_date: string;
  };
}

const commonFieldMapping: Record<string, string> = {
  clientName: "name",
  address: "street",
  dob: "dob",
  disability: "disability",
  phoneNumber: "phone",
  ndisNumber: "ndis",
};

interface Section {
  key: string;
  label: string;
  value: string;
  isMeta?: boolean;
}

interface FormField {
  key: string;
  label: string;
  isMeta?: boolean;
  isDateWithTemplate?: boolean;
}

type Block =
  | {
      key: string;
      type: 'meta';
      estimatedHeight: number;
      items: Section[];
    }
  | {
      key: string;
      type: 'section';
      label: string;
      value: string;
      partIndex: number;
      totalParts: number;
      estimatedHeight: number;
    };

// Define form fields
const formFields: FormField[] = [
  { key: "clientName", label: "Client Name", isMeta: true },
  { key: "date", label: "Date", isMeta: true },
  { key: "inAttendance", label: "In Attendance", isMeta: true },
  { key: "apologies", label: "Apologies", isMeta: true },
  { key: "introduction", label: "Introduction" },
  { key: "physiotherapy", label: "Physiotherapy" },
  { key: "ot", label: "OT" },
  { key: "speech", label: "Speech" },
  { key: "pbs", label: "PBS" },
  { key: "serviceDelivery", label: "Service Delivery" },
  { key: "family", label: "Family" },
  { key: "recommendations", label: "Recommendations" },
  { key: "nextMeetingNote", label: "Meeting Close Note", isDateWithTemplate: true },
];

const MDTDynamic: React.FC<Props> = ({ formData, settings, commonFieldsData }) => {
  
  const getValue = (key: string): string => {
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
    
    const rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];

    // Format dates
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      try {
        const parsed = parseISO(rawValue);
        if (isValid(parsed)) {
          return format(parsed, "dd-MM-yyyy");
        }
      } catch (e) {
        console.error('Date format error:', e);
      }
    }

    return rawValue ?? "";
  };

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      try {
        const parsed = parseISO(value);
        if (isValid(parsed)) {
          return format(parsed, "dd-MM-yyyy");
        }
      } catch (e) {
        return 'N/A';
      }
    }
    return value || 'N/A';
  };

  // Build sections with values
  const allSections: Section[] = useMemo(() => {
    return formFields.map(field => {
      const value = getValue(field.key);
      
      // Special handling for nextMeetingNote - prepend template text
      const displayValue = field.isDateWithTemplate && value
        ? `Thank you all for attending and the updates. I will schedule the next meeting for ${value}`
        : value;
      
      return {
        key: field.key,
        label: field.label,
        value: displayValue,
        isMeta: field.isMeta
      };
    }).filter(section => section.value); // Only include sections with values
  }, [formData, commonFieldsData]);

  const PAGE_HEIGHT = 1123;
  const HEADER_HEIGHT = 140;
  const FOOTER_HEIGHT = 90;
  const CONTENT_PADDING = 60;
  const MAX_PAGE_CONTENT_HEIGHT =
    PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - CONTENT_PADDING;
  const LINE_HEIGHT = 20;
  const CHARS_PER_LINE = 75;

  const estimateTextHeight = (text: string): number => {
    if (!text) return 60;
    const lines = Math.max(2, Math.ceil(text.length / CHARS_PER_LINE));
    const base = 70;
    return base + lines * LINE_HEIGHT;
  };

  const estimateMetaBlockHeight = (items: Section[]) => {
    if (!items.length) return 0;
    const base = 24;
    const perRow = 24;
    return base + items.length * perRow;
  };

  const splitSectionContent = (section: Section) => {
    const text = section.value.trim();
    const estimatedHeight = estimateTextHeight(text);
    if (estimatedHeight <= MAX_PAGE_CONTENT_HEIGHT) {
      return [
        {
          key: section.key,
          label: section.label,
          value: text,
          partIndex: 0,
          totalParts: 1,
          estimatedHeight,
        },
      ];
    }

    const CHUNK_LINE_LIMIT = Math.max(
      8,
      Math.floor((MAX_PAGE_CONTENT_HEIGHT - 70) / LINE_HEIGHT)
    );
    const CHARS_PER_CHUNK = CHUNK_LINE_LIMIT * CHARS_PER_LINE;
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > CHARS_PER_CHUNK && current) {
        chunks.push(current.trim());
        current = word;
      } else if (candidate.length > CHARS_PER_CHUNK) {
        chunks.push(candidate.trim());
        current = "";
      } else {
        current = candidate;
      }
    });

    if (current.trim()) {
      chunks.push(current.trim());
    }

    return chunks.map((chunk, idx) => ({
      key: `${section.key}-${idx}`,
      label: section.label,
      value: chunk,
      partIndex: idx,
      totalParts: chunks.length,
      estimatedHeight: estimateTextHeight(chunk),
    }));
  };

  const metaBlock = useMemo(() => {
    const metaSections = allSections.filter((section) => section.isMeta);
    const filled = metaSections.filter((item) => item.value);
    if (!filled.length) return null;
    return {
      key: "meta-block",
      type: "meta" as const,
      estimatedHeight: Math.min(
        estimateMetaBlockHeight(filled),
        MAX_PAGE_CONTENT_HEIGHT
      ),
      items: filled,
    };
  }, [allSections, MAX_PAGE_CONTENT_HEIGHT]);

  const contentBlocks = useMemo(() => {
    const contentSections = allSections.filter(
      (section) => !section.isMeta && section.value
    );
    return contentSections.flatMap((section) => splitSectionContent(section));
  }, [allSections, MAX_PAGE_CONTENT_HEIGHT]);

  const blocks: Block[] = useMemo(() => {
    if (metaBlock) {
      return [
        metaBlock,
        ...contentBlocks.map((chunk) => ({ type: "section" as const, ...chunk })),
      ];
    }
    return contentBlocks.map((chunk) => ({ type: "section" as const, ...chunk }));
  }, [metaBlock, contentBlocks]);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});
  const [measureVersion, setMeasureVersion] = useState(0);

  useEffect(() => {
    const handleResize = () => setMeasureVersion((prev) => prev + 1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const pending: Record<string, number> = {};
    let changed = false;

    blocks.forEach((block) => {
      const el = blockRefs.current[block.key];
      if (!el) return;
      const height = el.scrollHeight || el.offsetHeight;
      if (!height) return;
      if (measuredHeights[block.key] !== height) {
        pending[block.key] = height;
        changed = true;
      }
    });

    if (changed) {
      setMeasuredHeights((prev) => ({ ...prev, ...pending }));
    }
  }, [blocks, measureVersion, measuredHeights]);

  const getBlockHeight = (block: Block) => {
    const measured = measuredHeights[block.key] ?? block.estimatedHeight;
    return Math.min(measured + 16, MAX_PAGE_CONTENT_HEIGHT);
  };

  const pages = useMemo(() => {
    const pageBuckets: Block[][] = [];
    let current: Block[] = [];
    let height = 0;

    blocks.forEach((block) => {
      const blockHeight = getBlockHeight(block);
      if (current.length > 0 && height + blockHeight > MAX_PAGE_CONTENT_HEIGHT) {
        pageBuckets.push(current);
        current = [block];
        height = blockHeight;
      } else {
        current.push(block);
        height += blockHeight;
      }
    });

    if (current.length) {
      pageBuckets.push(current);
    }

    return pageBuckets;
  }, [blocks, MAX_PAGE_CONTENT_HEIGHT, measuredHeights]);

  return (
    <div className="space-y-8 bg-gray-100 py-8 flex flex-col items-center">
      {pages.map((pageBlocks, pageIndex) => (
        <A4PageWrapper key={pageIndex}>
          <div className="h-full flex flex-col text-black font-sans p-6">
            {/* Logo */}
            <div className="flex justify-center mb-3">
              <img
                src="/infinity_logo.png"
                alt="Infinity Supports WA logo"
                className="w-[140px] h-[55px] object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-center font-bold text-[13px] mb-4 leading-tight">
              Multi-Disciplinary Meeting
            </h2>

            {/* Content Area */}
            <div className="flex-1 flex flex-col text-[11px] leading-[1.6] space-y-3 overflow-hidden">
              {pageBlocks.map((block, idx) => {
                if (block.type === "meta") {
                  return (
                    <div
                      key={`${pageIndex}-meta`}
                      className="space-y-1"
                      ref={(el) => {
                        if (el) {
                          blockRefs.current[block.key] = el;
                        } else {
                          delete blockRefs.current[block.key];
                        }
                      }}
                    >
                      {block.items.map((section, metaIdx) => (
                        <p key={metaIdx} className="text-[11px]">
                          <span className="font-bold">{section.label}:</span>{" "}
                          <span>{section.value}</span>
                        </p>
                      ))}
                    </div>
                  );
                }

                const continued =
                  block.totalParts > 1 && block.partIndex > 0
                    ? ` (continued ${block.partIndex + 1}/${block.totalParts})`
                    : "";

                return (
                  <div
                    key={`${block.key}-${idx}`}
                    className="mb-1"
                    ref={(el) => {
                      if (el) {
                        blockRefs.current[block.key] = el;
                      } else {
                        delete blockRefs.current[block.key];
                      }
                    }}
                  >
                    <p className="font-bold text-[12px] underline mb-1">
                      {block.label}
                      {continued}
                    </p>
                    <p className="whitespace-pre-wrap text-[11px] leading-[1.6] text-justify">
                      {block.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer - Always at bottom */}
            <div className="mt-auto pt-3 text-[9px] text-gray-500 flex justify-between border-t border-gray-300">
              <div>Website: {settings?.company_website || ""}</div>
              <div>{settings?.multi_disciplinary_meeting || ""}</div>
              <div>Review Date: {formatDate(settings?.review_date)}</div>
            </div>
          </div>
        </A4PageWrapper>
      ))}
    </div>
  );
};

export default MDTDynamic;
