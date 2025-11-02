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
    let rawValue = commonFieldMapping[key]
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
        return (
          <View key={index} style={styles.list}>
            {block.items?.map((item, itemIndex) => (
              <Text key={itemIndex} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </View>
        );

      case 'image':
        return (
          <View key={index} style={{ alignItems: 'center', marginBottom: 16 }}>
            {block.image && (
              <Image 
                src={getImageSrc(block.image.src)} 
                style={[
                  styles.centerImage, 
                  { 
                    width: block.image.width || 200, 
                    height: block.image.height || 100 
                  }
                ]} 
              />
            )}
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

  // Footer values (mirror settings API keys like SA Delivery)
  const footerWebsite = settings?.company_website || settings?.from_email || '';
  const footerId = settings?.welcome_form || '';
  const footerDate = formatDate(settings?.review_date || '');
  console.log('[PDF Welcome Footer]', { footerWebsite, footerId, footerDate, keys: Object.keys(settings || {}) });

  return (
    <Document>
      {/* Cover Page */}
      {coverPageBlock && (
        <Page size="A4" style={styles.coverPage}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Image src={getImageSrc('/infinity_logo.png')} style={styles.coverLogo} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.coverTitle}>{coverPageBlock.label}</Text>
            <Text style={styles.coverSubtitle}>{coverPageBlock.content}</Text>

            {/* Main Image */}
            {coverPageBlock.image && (
              <Image 
                src={getImageSrc(coverPageBlock.image.src)} 
                style={[styles.centerImage, { width: 200, height: 100, marginBottom: 80 }]}
              />
            )}

            {/* Flag Images */}
            {coverPageBlock.images && (
              <View style={styles.flagsContainer}>
                {coverPageBlock.images.map((img, imgIndex) => (
                  <Image
                    key={imgIndex}
                    src={getImageSrc(img.src)}
                    style={styles.flagImage}
                  />
                ))}
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

      {/* Single Content Page with Fixed Footer - Like SA Delivery */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={getImageSrc('/infinity_logo.png')} style={styles.headerLogo} />
        </View>

        {/* Content - All blocks in one page with automatic page breaks */}
        <View>
          {contentBlocks.map((block, blockIndex) => {
            console.log(`🎨 [WelcomeForm_MATCHING] Rendering block ${blockIndex}: ${block.type}`);
            return renderBlockContent(block, blockIndex);
          })}
        </View>

        {/* Fixed Footer on all pages - Like SA Delivery */}
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
