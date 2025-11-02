"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { welcomeFormSchema, WelcomeSchemaBlock, WELCOME_PAGE_BUDGET, WELCOME_BLOCK_SPACING, WELCOME_SAFETY_BUFFER } from "./schema";

// Dynamic Welcome Form View - Multiple A4 pages with auto page breaks
const WelcomeFormDynamic: React.FC<any> = ({ formData, commonFieldsData, settings, images }) => {
  
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }
    return value;
  };

  // Footer values (mirror settings API keys like SA Delivery)
  const footerWebsite = settings?.company_website || settings?.from_email || '';
  const footerId = settings?.welcome_form || '';
  const footerDate = formatDate(settings?.review_date || '');
  console.log('[View Welcome Footer]', { footerWebsite, footerId, footerDate, keys: Object.keys(settings || {}) });
  
  // Page layout constants (matching SA Delivery pattern)
  const PAGE_BUDGET = 1000; // Available content height per page
  const TOP_SPACER = 24; // Space after header
  const BOTTOM_SPACER = 24; // Space before footer
  const BLOCK_SPACING = 16; // Space between blocks
  const SAFETY_BUFFER = 100; // Extra buffer for footer

  const commonFieldMapping: Record<string, string> = {
    name: "name",
    ndisNumber: "ndis",
    dob: "dob",
    address: "street",
  };

  // Get field value helper function
  const getFieldValue = (key: string): string => {
    let rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      const parsed = parseISO(rawValue);
      if (isValid(parsed)) {
        return format(parsed, "dd-MM-yyyy");
      }
    }

    return rawValue ?? "";
  };

  // Measurement refs for accurate height calculation
  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const budgetRef = useRef<HTMLDivElement>(null);
  const [measuredHeights, setMeasuredHeights] = useState<number[] | null>(null);

  // Calculate block height estimates
  const calculateBlockHeight = (block: WelcomeSchemaBlock): number => {
    switch (block.type) {
      case 'cover_page': return 800;
      case 'section_header': return 40;
      case 'paragraph': return Math.max(60, Math.ceil((block.content?.length || 0) / 80) * 20 + 20);
      case 'list': return Math.max(80, (block.items?.length || 0) * 25 + 20);
      case 'image': return (block.image?.height || 100) + 40;
      case 'values_section': return 300;
      case 'contact_info': return 350;
      case 'acknowledgment_form': return 400;
      default: return block.estimatedHeight || 100;
    }
  };

  // Build pages using measured heights (fallback to estimates)
  const pages = useMemo(() => {
    const heights = measuredHeights ?? welcomeFormSchema.map(calculateBlockHeight);
    const pageList: Array<{ blocks: Array<{ block: WelcomeSchemaBlock; index: number }> }> = [];
    let currentPage: Array<{ block: WelcomeSchemaBlock; index: number }> = [];
    let currentHeight = 0;

    welcomeFormSchema.forEach((block, index) => {
      const blockHeight = heights[index] || calculateBlockHeight(block);
      const totalBlockHeight = blockHeight + BLOCK_SPACING;

      // Check if block fits on current page
      if (currentHeight + totalBlockHeight > PAGE_BUDGET - SAFETY_BUFFER) {
        // Start new page if current page has content
        if (currentPage.length > 0) {
          pageList.push({ blocks: currentPage });
          currentPage = [];
          currentHeight = 0;
        }
      }

      currentPage.push({ block, index });
      currentHeight += totalBlockHeight;
    });

    // Add final page if it has content
    if (currentPage.length > 0) {
      pageList.push({ blocks: currentPage });
    }

    return pageList;
  }, [measuredHeights]);

  // Measure actual heights after render
  useEffect(() => {
    const heights = welcomeFormSchema.map((block, i) => {
      const el = measureRefs.current[i];
      return el ? el.offsetHeight : calculateBlockHeight(block);
    });
    setMeasuredHeights(heights);
  }, [formData, commonFieldsData]);

  // A4 Page wrapper component
  const A4Page: React.FC<{ children: React.ReactNode; pageNumber: number }> = ({ children, pageNumber }) => (
    <div
      className="a4-page w-[210mm] h-[297mm] bg-white shadow-md border border-gray-300 mx-auto my-4 flex flex-col print:shadow-none print:border-none print:my-0"
      style={{
        width: '210mm',
        height: '297mm',
        minWidth: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        padding: '30px'
      }}
    >
      {/* Header with Logo (except cover page) */}
      {pageNumber > 1 && (
        <>
          <div className="flex justify-center mb-0">
            <img
              alt="Infinity Logo"
              src={images?.infinityLogo || "/infinity_logo.png"}
              width={180}
              height={70}
              className="object-contain"
            />
          </div>
          <div style={{ height: `${TOP_SPACER}px` }} />
        </>
      )}

      {/* Cover page special header */}
      {pageNumber === 1 && (
        <>
          <div className="flex justify-center mb-0">
            <img
              src="/infinity_logo.png"
              alt="Infinity Supports WA logo"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>
          <div style={{ height: '24px' }} />
        </>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      
      {/* Fixed spacer before footer */}
      <div style={{ height: `${BOTTOM_SPACER}px` }} />
      
      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-600 pt-2 border-t">
        <span>Website: {footerWebsite}</span>
        <span>{footerId}</span>
        <span>Review Date: {footerDate}</span>
      </div>
    </div>
  );

  // Render individual block
  const renderBlock = (block: WelcomeSchemaBlock, index: number) => {
    switch (block.type) {
      case 'cover_page':
        return (
          <div key={index} className="flex flex-col h-full items-center justify-center text-center">
            {/* Title */}
            <p className="font-bold text-sm mb-6">{block.label}</p>
            <p className="text-xs mb-12">{block.content}</p>

            {/* Main Image */}
            {block.image && (
              <img
                src={block.image.src}
                alt={block.image.alt}
                className="mb-20"
                width={block.image.width}
                height={block.image.height}
              />
            )}

            {/* Flag Images Row */}
            {block.images && (
              <div className="flex justify-center space-x-4">
                {block.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img.src}
                    alt={img.alt}
                    className={img.className || "object-contain"}
                    width={img.width}
                    height={img.height}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'section_header':
        return (
          <div key={index} className="mb-4">
            <p className="font-bold text-base text-center">{block.label}</p>
          </div>
        );

      case 'paragraph':
        const paragraphClass = block.meta?.className || "text-justify text-sm leading-relaxed mb-4";
        return (
          <div key={index} className={paragraphClass}>
            {block.content?.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < (block.content?.split('\n').length || 0) - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        );

      case 'list':
        return (
          <div key={index} className="mb-4">
            <ul className="list-disc list-inside space-y-2 text-sm">
              {block.items?.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'image':
        return (
          <div key={index} className="flex justify-center mb-4">
            {block.image && (
              <img
                src={block.image.src}
                alt={block.image.alt}
                className={block.image.className || "object-contain"}
                width={block.image.width}
                height={block.image.height}
              />
            )}
          </div>
        );

      case 'values_section':
        return (
          <div key={index} className="mb-6">
            <h1 className="text-4xl font-bold mb-12 text-center font-[Playfair_Display]" style={{ letterSpacing: '-0.02em' }}>
              {block.label}
            </h1>
            <section className="text-sm leading-relaxed max-w-2xl space-y-6 text-justify">
              {block.items?.map((item, itemIndex) => {
                const [boldPart, ...rest] = item.split(' – ');
                return (
                  <p key={itemIndex}>
                    <strong>{boldPart}</strong> – {rest.join(' – ')}
                  </p>
                );
              })}
            </section>
          </div>
        );

      case 'contact_info':
        return (
          <div key={index} className="mb-6">
            <p className="font-bold mb-4">{block.label}</p>
            <div className="space-y-4 text-sm leading-relaxed">
              {block.items?.map((item, itemIndex) => {
                const lines = item.split('\n');
                const [title, ...details] = lines;
                return (
                  <div key={itemIndex}>
                    <p className="font-bold">{title}</p>
                    {details.map((detail, detailIndex) => (
                      <p key={detailIndex}>{detail}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'acknowledgment_form':
        return (
          <div key={index} className="mb-6">
            <h2 className="text-center font-bold mb-6 text-sm">{block.label}</h2>
            
            {/* Static Content */}
            <div className="mb-6 text-sm">
              {block.content?.split('\n\n').map((paragraph, pIndex) => (
                <div key={pIndex} className="mb-4">{paragraph}</div>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {block.meta?.fields?.map((field: any) => (
                <div key={field.key} className="mb-4">
                  <p className="font-medium text-sm">{field.label}:</p>
                  <div className="mt-2">
                    {field.type === 'signature' ? (
                      getFieldValue(field.key)?.startsWith('data:image') ? (
                        <img
                          src={getFieldValue(field.key)}
                          alt="Signature"
                          className="h-[80px] border border-gray-300 rounded"
                        />
                      ) : (
                        <div className="border-b border-gray-400 h-[80px] w-full"></div>
                      )
                    ) : (
                      <div className="border-b border-gray-400 pb-1 text-sm">
                        {getFieldValue(field.key) || ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="welcome-form-dynamic">
      {/* Hidden measurement div (matching SA Delivery pattern) */}
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
          <div className="flex justify-between text-xs text-gray-600 pt-2 border-t">
            <span>Website:</span>
            <span>Welcome Form</span>
            <span>Review Date:</span>
          </div>
        </div>

        {/* Measure each block */}
        {welcomeFormSchema.map((block, index) => (
          <div key={`measure-${index}`} ref={(el) => (measureRefs.current[index] = el)} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
            {renderBlock(block, index)}
          </div>
        ))}
      </div>

      {/* Render paginated content */}
      {pages.map((page, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex + 1}>
          {page.blocks.map(({ block, index }) => (
            <div key={`page-${pageIndex}-block-${index}`} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
              {renderBlock(block, index)}
            </div>
          ))}
        </A4Page>
      ))}
    </div>
  );
};

export default WelcomeFormDynamic;
