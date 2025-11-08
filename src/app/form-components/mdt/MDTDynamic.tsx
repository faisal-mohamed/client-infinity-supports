"use client";

import React, { useMemo } from "react";
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

  // Paginate content based on estimated character capacity
  const pages = useMemo(() => {
    const pagesArray: { meta: Section[]; content: Section[] }[] = [];
    
    // Page capacity estimation
    const HEADER_HEIGHT = 120; // Logo + title + margins
    const FOOTER_HEIGHT = 50;  // Footer with border
    const PAGE_HEIGHT = 1123;  // A4 page height in px
    const AVAILABLE_HEIGHT = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT; // ~953px
    
    // Character estimates (rough but effective)
    const CHARS_PER_LINE = 80;
    const LINE_HEIGHT = 20; // px
    const META_CHARS_PER_PAGE = 400; // Meta section is compact
    const SECTION_HEADER_HEIGHT = 25;
    
    const metaSections = allSections.filter(s => s.isMeta);
    const contentSections = allSections.filter(s => !s.isMeta);
    
    let currentPage: Section[] = [];
    let currentHeight = 0;
    
    // First page includes metadata
    const metaHeight = metaSections.length * 22; // Each meta field ~22px
    currentHeight += metaHeight + 30; // Add spacing
    
    console.log('🔍 [MDT View DEBUG] Starting pagination calculation');
    console.log('🔍 [MDT View DEBUG] Available height per page:', AVAILABLE_HEIGHT);
    console.log('🔍 [MDT View DEBUG] Meta sections:', metaSections.length);
    console.log('🔍 [MDT View DEBUG] Content sections:', contentSections.length);
    
    // Distribute content sections across pages
    contentSections.forEach((section, idx) => {
      const charCount = section.value.length;
      const lines = Math.ceil(charCount / CHARS_PER_LINE);
      const sectionHeight = SECTION_HEADER_HEIGHT + (lines * LINE_HEIGHT) + 15; // +15 for margins
      
      console.log(`🔍 [MDT View DEBUG] Section "${section.label}": ${charCount} chars, ~${lines} lines, ~${sectionHeight}px`);
      
      // If adding this section would exceed page height, start new page
      if (currentHeight + sectionHeight > AVAILABLE_HEIGHT && currentPage.length > 0) {
        console.log(`🔍 [MDT View DEBUG] Page ${pagesArray.length + 1} full (${currentHeight}px), starting new page`);
        pagesArray.push({
          meta: pagesArray.length === 0 ? metaSections : [],
          content: [...currentPage]
        });
        currentPage = [section];
        currentHeight = sectionHeight;
      } else {
        currentPage.push(section);
        currentHeight += sectionHeight;
      }
    });
    
    // Add last page
    if (currentPage.length > 0 || pagesArray.length === 0) {
      pagesArray.push({
        meta: pagesArray.length === 0 ? metaSections : [],
        content: currentPage
      });
    }
    
    console.log(`🔍 [MDT View DEBUG] Total pages created: ${pagesArray.length}`);
    pagesArray.forEach((page, idx) => {
      console.log(`🔍 [MDT View DEBUG] Page ${idx + 1}: ${page.meta.length} meta + ${page.content.length} sections`);
    });
    
    return pagesArray;
  }, [allSections]);

  return (
    <div className="space-y-8 bg-gray-100 py-8 flex flex-col items-center">
      {pages.map((page, pageIndex) => (
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

            {/* Content Area - Uses flex-1 to fill available space */}
            <div className="flex-1 flex flex-col text-[11px] leading-[1.6] space-y-2 overflow-hidden">
              {/* Meta fields on first page only */}
              {page.meta.length > 0 && (
                <div className="mb-3 space-y-1">
                  {page.meta.map((section, idx) => (
                    <p key={idx} className="text-[11px]">
                      <span className="font-bold">{section.label}:</span>{" "}
                      <span>{section.value}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Section fields */}
              {page.content.map((section, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-bold text-[12px] underline mb-1">{section.label}</p>
                  <p className="whitespace-pre-wrap text-[11px] leading-[1.6] text-justify">{section.value}</p>
                </div>
              ))}
            </div>

            {/* Footer - Always at bottom */}
            <div className="mt-auto pt-3 text-[9px] text-gray-500 flex justify-between border-t border-gray-300">
              <div>Website: {settings?.company_website || settings?.from_email || ''}</div>
              <div>{settings?.multi_disciplinary_meeting || ''}</div>
              <div>Review Date: {formatDate(settings?.review_date)}</div>
            </div>
          </div>
        </A4PageWrapper>
      ))}
    </div>
  );
};

export default MDTDynamic;
