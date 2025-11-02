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

// Matching PDF generation - matches WelcomeFormDynamic.tsx web view design
// Natural flow with automatic page breaks

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
    borderTop: '1 solid #d1d5db',
    paddingTop: 12,
    fontSize: 10,
    color: '#6b7280',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
  missionImage: {
    alignSelf: 'center',
    marginBottom: 24,
  },
});

interface WelcomeFormPDFProps {
  formData?: any;
  commonFieldsData?: any;
  settings?: any;
}

const WelcomeForm_MATCHING: React.FC<WelcomeFormPDFProps> = ({
  formData = {},
  commonFieldsData = {},
  settings = {}
}) => {

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

  // Render individual block
  const renderBlock = (block: WelcomeSchemaBlock, index: number) => {
    switch (block.type) {
      case 'cover_page':
        return (
          <Page key={index} size="A4" style={styles.coverPage}>
            {/* Cover Logo */}
            <View style={{ alignItems: 'center', marginBottom: 40 }}>
              <Image src="/infinity_logo.png" style={styles.coverLogo} />
            </View>

            {/* Cover Content */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.coverTitle}>{block.label}</Text>
              <Text style={styles.coverSubtitle}>{block.content}</Text>

              {/* Main Image */}
              {block.image && (
                <Image 
                  src={block.image.src} 
                  style={[styles.centerImage, { width: 200, height: 100, marginBottom: 80 }]} 
                />
              )}

              {/* Flag Images */}
              {block.images && (
                <View style={styles.flagsContainer}>
                  {block.images.map((img, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={img.src}
                      style={styles.flagImage}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text>Website: {settings?.company_website || ''}</Text>
              <Text>{settings?.welcome_form || ''}</Text>
              <Text>Review Date: {formatDate(settings?.review_date || '')}</Text>
            </View>
          </Page>
        );

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
                src={block.image.src} 
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

  return (
    <Document>
      {/* Process schema blocks and create pages */}
      {welcomeFormSchema.map((block, index) => {
        if (block.type === 'cover_page') {
          return renderBlock(block, index);
        }
        return null;
      })}

      {/* Regular content pages */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/infinity_logo.png" style={styles.headerLogo} />
        </View>

        {/* Content */}
        <View>
          {welcomeFormSchema
            .filter(block => block.type !== 'cover_page')
            .map((block, index) => renderBlock(block, index + 1))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Website: {settings?.company_website || ''}</Text>
          <Text>{settings?.welcome_form || ''}</Text>
          <Text>Review Date: {formatDate(settings?.review_date || '')}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default WelcomeForm_MATCHING;
