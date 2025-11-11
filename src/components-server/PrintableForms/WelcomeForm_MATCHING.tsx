import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { welcomeFormSchema, WelcomeSchemaBlock } from '../../app/components/forms/welcome-form/schema';
import path from 'path';



const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 120,
    paddingBottom: 50,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 80,
    paddingBottom: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 180,
    height: 70,
    objectFit: 'contain',
  },
  coverLogo: {
    width: 200,
    height: 80,
    objectFit: 'contain',
    marginBottom: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    borderTop: '1 solid #d1d5db',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
  },
  coverTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  coverSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 48,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 12,
    textAlign: 'justify',
  },
  centerParagraph: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 6,
    paddingLeft: 12,
  },
  valuesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    marginTop: 24,
  },
  valuesItem: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 24,
    textAlign: 'justify',
  },
  contactSection: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  acknowledgmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  acknowledgmentContent: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 24,
    textAlign: 'justify',
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 12,
    borderBottom: '1 solid #9ca3af',
    paddingBottom: 4,
    minHeight: 20,
  },
  signatureBox: {
    borderBottom: '1 solid #9ca3af',
    height: 60,
    marginBottom: 4,
  },
  signatureImage: {
    maxHeight: 60,
    objectFit: 'contain',
  },
  flagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 80,
  },
  flagImage: {
    width: 56,
    height: 40,
    objectFit: 'contain',
  },
  centerImage: {
    alignSelf: 'center',
    marginBottom: 16,
  },
});

interface WelcomeFormPDFProps {
  formData?: any;
  commonFieldsData?: any;
  settings?: any;
  images?: any; // Base64 encoded images from API
}

const WelcomeForm_MATCHING: React.FC<WelcomeFormPDFProps> = ({
  formData = {},
  commonFieldsData = {},
  settings = {},
  images = {} // Receive base64 images from API
}) => {

  // Use base64 images provided by API instead of file paths
  const getImageSrc = (relativePath: string): string => {
    // Handle case where images object is missing or empty
    if (!images || Object.keys(images).length === 0) {
      console.log(`🖼️ [BROWSER] No images provided by API, using fallback for: ${relativePath}`);
      return relativePath; // Fallback to original path
    }

    // Map web paths to API image keys
    const imageMap: Record<string, string> = {
      '/infinity_logo.png': 'infinityLogo',
      '/welcomeimg/p1-1.png': 'p1_1',
      '/welcomeimg/p1-2.png': 'p1_2', 
      '/welcomeimg/p1-3.png': 'p1_3',
      '/welcomeimg/p1-4.png': 'p1_4',
      '/welcomeimg/p1-5.png': 'p1_5',
      '/welcomeimg/p3-1.png': 'p3_1',
      '/welcomeimg/p3-2.png': 'p3_2',
      '/welcomeimg/p4-1.png': 'p4_1'
    };
    
    const imageKey = imageMap[relativePath];
    const base64Image = images[imageKey];
    
    console.log(`🖼️ [BROWSER] Image ${relativePath} -> key: ${imageKey} -> ${base64Image ? 'found' : 'missing'}`);
    
    return base64Image || relativePath; // Fallback to original path if not found
  };

  // Add comprehensive logging to BROWSER CONSOLE
  console.log('🔍 [BROWSER] WelcomeForm PDF Generation Started');
  console.log('📊 [BROWSER] Schema blocks:', welcomeFormSchema.length);
  console.log('📋 [BROWSER] Form data:', formData);
  console.log('🏢 [BROWSER] Settings:', settings);
  console.log('🖼️ [BROWSER] Images received:', Object.keys(images));
  
  // Test schema import
  if (!welcomeFormSchema || welcomeFormSchema.length === 0) {
    console.error('❌ [BROWSER] Schema is empty or not imported!');
    return (
      <Document>
        <Page size="A4">
          <Text style={{ fontSize: 16, margin: 50, color: 'red' }}>
            ERROR: Schema not found - {welcomeFormSchema?.length || 0} blocks loaded
          </Text>
        </Page>
      </Document>
    );
  }

  // Log each schema block to browser
  console.log('📝 [BROWSER] Schema blocks details:');
  welcomeFormSchema.forEach((block, index) => {
    console.log(`  Block ${index}:`, {
      type: block.type,
      label: block.label?.substring(0, 50),
      content: block.content?.substring(0, 100),
      hasItems: !!block.items,
      itemsCount: block.items?.length || 0,
      hasImage: !!block.image,
      hasImages: !!block.images
    });
  });

  // Create debug info for UI
  const debugInfo = {
    schemaBlocks: welcomeFormSchema.length,
    formDataKeys: Object.keys(formData),
    settingsKeys: Object.keys(settings),
    imagePaths: [] as string[]
  };

  // Test image path resolution - using base64 images from API
  const testImages = ['/infinity_logo.png', '/welcomeimg/p1-1.png', '/welcomeimg/p3-1.png'];
  testImages.forEach(img => {
    const resolved = getImageSrc(img);
    debugInfo.imagePaths.push(`${img} -> ${resolved.substring(0, 50)}...`);
  });
  
  // Log each schema block
  welcomeFormSchema.forEach((block, index) => {
    console.log(`📝 [WelcomeForm_MATCHING] Block ${index}:`, {
      type: block.type,
      label: block.label?.substring(0, 50),
      content: block.content?.substring(0, 100),
      hasItems: !!block.items,
      itemsCount: block.items?.length || 0
    });
  });

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

    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      try {
        const [year, month, day] = rawValue.split('-');
        return `${day}-${month}-${year}`;
      } catch {
        return rawValue;
      }
    }

    return rawValue ?? "";
  };

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      try {
        const [year, month, day] = value.split('-');
        return `${day}-${month}-${year}`;
      } catch {
        return value;
      }
    }
    return value;
  };

  // Render individual block content
  const renderBlockContent = (block: WelcomeSchemaBlock, index: number) => {
    console.log(`🎨 [BROWSER] Rendering block ${index}: ${block.type}`);
    
    switch (block.type) {
      case 'section_header':
        return (
          <Text key={index} style={styles.sectionHeader}>{block.label}</Text>
        );

      case 'paragraph':
        const isCenter = block.meta?.className?.includes('text-center');
        return (
          <Text key={index} style={isCenter ? styles.centerParagraph : styles.paragraph}>
            {block.content}
          </Text>
        );

      case 'list':
        // Check if this is an indented sublist (ml-8 class indicates nested items)
        const isIndented = block.meta?.className?.includes('ml-8');
        const listStyle = isIndented ? { ...styles.list, marginLeft: 20 } : styles.list;
        
        return (
          <View key={index} style={listStyle}>
            {block.items?.map((item, itemIndex) => (
              <Text key={itemIndex} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </View>
        );

      case 'image':
        const imageSrc = block.image ? getImageSrc(block.image.src) : '';
        // Skip rendering if image source is empty or invalid
        if (!imageSrc || imageSrc === '') {
          console.warn(`⚠️ [BROWSER] Skipping image block ${index} - invalid source`);
          return null;
        }
        return (
          <View key={index} style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image 
              src={imageSrc} 
              style={[
                styles.centerImage, 
                { 
                  width: block.image?.width || 200, 
                  height: block.image?.height || 100 
                }
              ]} 
            />
          </View>
        );

      case 'values_section':
        return (
          <View key={index}>
            <Text style={styles.valuesTitle}>{block.label}</Text>
            {block.items?.map((item, itemIndex) => {
              const [boldPart, ...rest] = item.split(' – ');
              return (
                <Text key={itemIndex} style={styles.valuesItem}>
                  <Text style={{ fontWeight: 'bold' }}>{boldPart}</Text> – {rest.join(' – ')}
                </Text>
              );
            })}
          </View>
        );

      case 'contact_info':
        return (
          <View key={index}>
            <Text style={[styles.contactTitle, { marginBottom: 16 }]}>{block.label}</Text>
            {block.items?.map((item, itemIndex) => {
              const lines = item.split('\n');
              const [title, ...details] = lines;
              return (
                <View key={itemIndex} style={styles.contactSection}>
                  <Text style={styles.contactTitle}>{title}</Text>
                  {details.map((detail, detailIndex) => (
                    <Text key={detailIndex} style={styles.contactText}>{detail}</Text>
                  ))}
                </View>
              );
            })}
          </View>
        );

      case 'checkmark_list':
        console.log(`✓ [PDF] Rendering checkmark_list at index ${index} with ${block.items?.length || 0} items`);
        return (
          <View key={index} style={styles.list}>
            {block.items?.map((item, itemIndex) => (
              <Text key={itemIndex} style={styles.listItem}>
                ✓ {item}
              </Text>
            ))}
          </View>
        );

      case 'table':
        console.log(`📊 [PDF] Rendering table at index ${index} with ${block.table?.rows.length || 0} rows`);
        return (
          <View key={index} style={{ marginBottom: 16 }}>
            {/* Table Header */}
            <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderTop: '1 solid #000', borderLeft: '1 solid #000', borderRight: '1 solid #000' }} wrap={false}>
              {block.table?.headers.map((header, hIndex) => (
                <View key={hIndex} style={{ flex: 1, padding: 8, borderRight: hIndex < (block.table?.headers.length || 0) - 1 ? '1 solid #000' : 'none' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{header}</Text>
                </View>
              ))}
            </View>
            {/* Table Rows - Each row is atomic (won't split across pages) */}
            {block.table?.rows.map((row, rIndex) => (
              <View key={rIndex} wrap={false} style={{ flexDirection: 'row', borderTop: '1 solid #000', borderLeft: '1 solid #000', borderRight: '1 solid #000', borderBottom: rIndex === (block.table?.rows.length || 0) - 1 ? '1 solid #000' : 'none' }}>
                {row.map((cell, cIndex) => (
                  <View key={cIndex} style={{ flex: 1, padding: 8, borderRight: cIndex < row.length - 1 ? '1 solid #000' : 'none' }}>
                    <Text style={{ fontSize: 8, fontWeight: cIndex === 1 ? 'bold' : 'normal', textAlign: cIndex === 1 ? 'center' : 'left' }}>
                      {cell}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );

      case 'contact_block':
        console.log(`📞 [PDF] Rendering contact_block at index ${index} with ${block.contacts?.length || 0} contacts`);
        return (
          <View key={index} style={{ marginBottom: 16 }}>
            {block.contacts?.map((contact, contactIndex) => (
              <View key={contactIndex} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }}>{contact.title}</Text>
                {contact.telephone && <Text style={{ fontSize: 9, marginBottom: 2 }}>Telephone: {contact.telephone}</Text>}
                {contact.email && <Text style={{ fontSize: 9, marginBottom: 2 }}>Email: {contact.email}</Text>}
                {contact.website && <Text style={{ fontSize: 9, marginBottom: 2 }}>Website: {contact.website}</Text>}
              </View>
            ))}
          </View>
        );

      case 'agency_list':
        console.log(`🏢 [PDF] Rendering agency_list at index ${index} with ${block.agencies?.length || 0} agencies`);
        return (
          <View key={index} style={{ marginBottom: 16 }}>
            {block.agencies?.map((agency, agencyIndex) => (
              <View key={agencyIndex} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, border: `2 solid ${agency.color}`, backgroundColor: '#ffffff', marginRight: 8 }}></View>
                <View style={{ backgroundColor: agency.color, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, flex: 1 }}>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: agency.color === '#fed7aa' ? '#1f2937' : '#ffffff' }}>
                    {agency.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );

      case 'data_category_bars':
        console.log(`🎨 [PDF] Rendering data_category_bars at index ${index} with ${block.dataCategories?.length || 0} categories`);
        return (
          <View key={index} style={{ marginBottom: 16 }}>
            {block.dataCategories?.map((category, catIndex) => (
              <View key={catIndex} style={{ marginBottom: 4 }}>
                <View style={{ backgroundColor: category.color, paddingHorizontal: 12, paddingVertical: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4, maxWidth: category.maxWidth || 500 }}>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#ffffff' }}>
                    {category.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );

      case 'acknowledgment_form':
        return (
          <View key={index}>
            <Text style={styles.acknowledgmentTitle}>{block.label}</Text>
            
            {/* Static Content */}
            {block.content?.split('\n\n').map((paragraph, pIndex) => (
              <Text key={pIndex} style={styles.acknowledgmentContent}>{paragraph}</Text>
            ))}

            {/* Form Fields */}
            {block.meta?.fields?.map((field: any) => (
              <View key={field.key} style={styles.formField}>
                <Text style={styles.fieldLabel}>{field.label}:</Text>
                {field.type === 'signature' ? (
                  <View style={styles.signatureBox}>
                    {getFieldValue(field.key)?.startsWith('data:image') && (
                      <Image
                        src={getFieldValue(field.key)}
                        style={styles.signatureImage}
                      />
                    )}
                  </View>
                ) : (
                  <Text style={styles.fieldValue}>
                    {getFieldValue(field.key) || ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        );

      default:
        console.warn(`[WelcomeForm_MATCHING] Unknown block type: ${block.type}`);
        return null;
    }
  };

  // Separate cover page and content blocks
  const coverPageBlock = welcomeFormSchema.find(block => block.type === 'cover_page');
  const contentBlocks = welcomeFormSchema.filter(block => block.type !== 'cover_page');

  console.log('📄 [BROWSER] Cover page found:', !!coverPageBlock);
  console.log('📝 [BROWSER] Content blocks:', contentBlocks.length);

  // Group content blocks into fewer pages with better space utilization
  const contentPages: WelcomeSchemaBlock[][] = [];
  let currentPage: WelcomeSchemaBlock[] = [];
  const blocksPerPage = 8; // More blocks per page to reduce empty space

  contentBlocks.forEach((block, index) => {
    // Start new page only when we have enough blocks
    if (currentPage.length >= blocksPerPage) {
      contentPages.push([...currentPage]);
      currentPage = [];
    }
    
    currentPage.push(block);
    console.log(`📄 [BROWSER] Block ${index} (${block.type}) added to page ${contentPages.length + 1}`);
  });

  // Add final page if it has content
  if (currentPage.length > 0) {
    contentPages.push(currentPage);
  }

  console.log(`📚 [BROWSER] Total content pages: ${contentPages.length}`);

  // Footer values - no fallback
  const footerWebsite = settings?.company_website || '';
  const footerId = settings?.welcome_form || '';
  const footerDate = formatDate(settings?.review_date || '');
  console.log('[PDF Welcome Footer]', { footerWebsite, footerId, footerDate, keys: Object.keys(settings || {}) });

  return (
    <Document>
      {/* Cover Page */}
      {coverPageBlock && (
        <Page size="A4" style={styles.coverPage}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            {getImageSrc('/infinity_logo.png') && (
              <Image src={getImageSrc('/infinity_logo.png')} style={styles.coverLogo} />
            )}
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.coverTitle}>{coverPageBlock.label}</Text>
            <Text style={styles.coverSubtitle}>{coverPageBlock.content}</Text>

            {/* Main Image */}
            {coverPageBlock.image && getImageSrc(coverPageBlock.image.src) && (
              <Image 
                src={getImageSrc(coverPageBlock.image.src)} 
                style={[styles.centerImage, { width: 200, height: 100, marginBottom: 80 }]}
              />
            )}

            {/* Flag Images */}
            {coverPageBlock.images && (
              <View style={styles.flagsContainer}>
                {coverPageBlock.images.map((img, imgIndex) => {
                  const imgSrc = getImageSrc(img.src);
                  return imgSrc ? (
                    <Image
                      key={imgIndex}
                      src={imgSrc}
                      style={styles.flagImage}
                    />
                  ) : null;
                })}
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Website: {footerWebsite}</Text>
            <Text style={styles.footerText}>{footerId}</Text>
            <Text style={styles.footerText}>Review Date: {footerDate}</Text>
          </View>
        </Page>
      )}

      {/* Single Content Page with Fixed Header & Footer - Like SA Delivery */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header on ALL pages */}
        <View style={styles.header} fixed>
          {(() => {
            const logoSrc = getImageSrc('/infinity_logo.png');
            console.log('🖼️ [PDF] Header logo source:', logoSrc ? 'VALID' : 'MISSING');
            return logoSrc ? <Image src={logoSrc} style={styles.headerLogo} /> : null;
          })()}
        </View>

        {/* Content - All blocks flow naturally with automatic page breaks */}
        <View>
          {contentBlocks.map((block, blockIndex) => {
            console.log(`🎨 [WelcomeForm_MATCHING] Rendering block ${blockIndex}: ${block.type}`);
            return renderBlockContent(block, blockIndex);
          })}
        </View>

        {/* Fixed Footer on ALL pages */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Website: {footerWebsite}</Text>
          <Text style={styles.footerText}>{footerId}</Text>
          <Text style={styles.footerText}>Review Date: {footerDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default WelcomeForm_MATCHING;
