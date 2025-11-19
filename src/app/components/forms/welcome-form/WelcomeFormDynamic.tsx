"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { welcomeFormSchema, WelcomeSchemaBlock, WELCOME_PAGE_BUDGET, WELCOME_BLOCK_SPACING, WELCOME_SAFETY_BUFFER } from "./schema";

// Dynamic Welcome Form View - Multiple A4 pages with auto page breaks
const WelcomeFormDynamic: React.FC<any> = ({ formData, commonFieldsData, settings, images }) => {
  
  // 🔍 DEBUG LOGS - Welcome Form Dynamic (Schema-based)
  console.log('🎯 [Welcome Form Dynamic] Rendering schema-based form with:', {
    formDataKeys: Object.keys(formData || {}),
    commonFieldsKeys: Object.keys(commonFieldsData || {}),
    settingsKeys: Object.keys(settings || {}),
    imagesKeys: Object.keys(images || {}),
    totalBlocks: welcomeFormSchema.length,
  });
  
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
  const footerWebsite = settings?.company_website || '';
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
    const rawValue = commonFieldMapping[key]
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
      case 'checkmark_list': return Math.max(80, (block.items?.length || 0) * 30 + 20);
      case 'table': return Math.max(150, (block.table?.rows.length || 0) * 50 + 60);
      case 'contact_block': return Math.max(100, (block.contacts?.length || 0) * 80 + 20);
      case 'agency_list': return Math.max(120, (block.agencies?.length || 0) * 28 + 20);
      case 'data_category_bars': return Math.max(100, (block.dataCategories?.length || 0) * 30 + 20);
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
        const listClassName = block.meta?.className || '';
        return (
          <div key={index} className="mb-4">
            <ul className={`list-disc list-inside space-y-2 text-sm ${listClassName}`}>
              {block.items?.map((item, itemIndex) => {
                // Check if item contains email or website that should be hyperlinked
                const emailMatch = item.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                const websiteMatch = item.match(/((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/);
                
                if (emailMatch || websiteMatch) {
                  const parts = item.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/);
                  return (
                    <li key={itemIndex}>
                      {parts.map((part, partIndex) => {
                        if (part.includes('@')) {
                          return <a key={partIndex} href={`mailto:${part}`} className="text-blue-700 underline">{part}</a>;
                        } else if (part.match(/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/)) {
                          const url = part.startsWith('http') ? part : `https://${part}`;
                          return <a key={partIndex} href={url} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">{part}</a>;
                        }
                        return <span key={partIndex}>{part}</span>;
                      })}
                    </li>
                  );
                }
                
                return <li key={itemIndex}>{item}</li>;
              })}
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

      case 'table':
        console.log(`📊 [Welcome Form] Rendering table at index ${index} with ${block.table?.rows.length || 0} rows`);
        const isComplaintTable = block.table?.headers.includes('Method');
        return (
          <div key={index} className="mb-6">
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-200">
                  {block.table?.headers.map((header, hIndex) => (
                    <th key={hIndex} className="border border-black p-2 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.table?.rows.map((row, rIndex) => (
                  <tr key={rIndex}>
                    {row.map((cell, cIndex) => (
                      <td key={cIndex} className={`border border-black p-2 align-top ${cIndex === 0 && isComplaintTable ? 'w-[110px] font-semibold' : ''} ${cIndex === 1 && !isComplaintTable ? 'font-bold text-center w-40' : ''}`}>
                        {cell.split('\n').map((line, lineIndex) => (
                          <React.Fragment key={lineIndex}>
                            {line}
                            {lineIndex < cell.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'checkmark_list':
        return (
          <div key={index} className="mb-4">
            <ul className="space-y-3">
              {block.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="mr-2 mt-1 text-black font-bold">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'contact_block':
        return (
          <div key={index} className="mb-6 space-y-4">
            {block.contacts?.map((contact, contactIndex) => (
              <div key={contactIndex} className="mb-6">
                <p className="font-bold text-sm mb-2">{contact.title}</p>
                <div className="text-sm space-y-1">
                  {contact.telephone && (
                    <p>
                      <span className="inline-block w-[90px]">Telephone:</span> {contact.telephone}
                    </p>
                  )}
                  {contact.email && (
                    <p>
                      <span className="inline-block w-[90px]">Email:</span> {contact.email}
                    </p>
                  )}
                  {contact.website && (
                    <p>
                      <span className="inline-block w-[90px]">Website:</span> 
                      <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} 
                         className="text-blue-700 underline" 
                         target="_blank" 
                         rel="noopener noreferrer">
                        {contact.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'agency_list':
        return (
          <div key={index} className="mb-6 max-w-[400px]">
            <div className="relative space-y-1">
              {/* Connecting line through all circles */}
              <div className="absolute left-[10px] top-[10px] bottom-[10px] w-[2px] bg-gray-300" style={{ height: `calc(100% - 20px)` }}></div>
              
              {block.agencies?.map((agency, agencyIndex) => {
                // Determine text color based on background - light backgrounds need dark text
                const isLightBackground = agency.color === '#fed7aa';
                const textColor = isLightBackground ? '#1f2937' : '#ffffff';
                
                return (
                  <div key={agencyIndex} className="relative flex items-center space-x-2">
                    {/* Circle */}
                    <div 
                      className="w-5 h-5 rounded-full flex-shrink-0 bg-white z-10 relative"
                      style={{ 
                        border: `2px solid ${agency.color}`,
                      }}
                    ></div>
                    {/* Colored bar with agency name */}
                    <div 
                      className="text-[10px] font-semibold px-3 py-1 rounded w-full"
                      style={{ 
                        backgroundColor: agency.color,
                        color: textColor,
                      }}
                    >
                      {agency.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'data_category_bars':
        return (
          <div key={index} className="mb-6">
            <div className="space-y-1">
              {block.dataCategories?.map((category, catIndex) => (
                <div key={catIndex}>
                  <div
                    className="text-white text-xs font-semibold px-3 py-1 rounded-r-md"
                    style={{
                      backgroundColor: category.color,
                      maxWidth: category.maxWidth ? `${category.maxWidth}px` : '100%'
                    }}
                  >
                    {category.text}
                  </div>
                </div>
              ))}
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
          <div key={`measure-${index}`} ref={(el) => { measureRefs.current[index] = el; }} style={{ marginBottom: `${BLOCK_SPACING}px` }}>
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
