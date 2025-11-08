import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { saDeliverySchema, SchemaBlock } from '../../app/components/forms/sa-delivery-of-supports/schema';

// Matching PDF generation - matches SADeliverySupportsDynamic.tsx web view design
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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    textDecoration: 'underline',
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
  fieldContainer: {
    marginBottom: 8,
  },
  fieldHeader: {
    backgroundColor: '#d1d5db',
    border: '1 solid #000000',
    borderBottom: 0,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  fieldValue: {
    border: '1 solid #000000',
    borderTop: 0,
    padding: 6,
    backgroundColor: '#ffffff',
    fontSize: 8,
    lineHeight: 1.3,
    minHeight: 20,
  },
  fieldValueLong: {
    border: '1 solid #000000',
    borderTop: 0,
    padding: 6,
    backgroundColor: '#ffffff',
    fontSize: 8,
    lineHeight: 1.3,
    minHeight: 40,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    textDecoration: 'underline',
  },
  staticContent: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  staticTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1 solid #000000',
    marginRight: 6,
    marginTop: 2,
  },
  radioContainer: {
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  radioCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    border: '1 solid #000000',
    marginRight: 4,
  },
  signatureBox: {
    border: '1 solid #000000',
    padding: 6,
    minHeight: 30,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    border: '1 solid #000000',
    borderTop: 0,
  },
  tableCell: {
    padding: 4,
    borderRight: '1 solid #000000',
  },
  tableCellLast: {
    padding: 4,
  },
  tableCellHeader: {
    backgroundColor: '#d1d5db',
    padding: 4,
    borderRight: '1 solid #000000',
  },
  tableCellHeaderLast: {
    backgroundColor: '#d1d5db',
    padding: 4,
  },
});

interface SADeliverySupportsProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const SADeliverySupportsMatching: React.FC<SADeliverySupportsProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  console.log('🔍 SADeliverySupports_MATCHING.tsx is being used for PDF generation');
  console.log('📊 Form data keys:', Object.keys(formData || {}));

  const commonFieldMapping: Record<string, string> = {
    givenNames: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    sex: 'sex',
  };

  // Get field value helper function
  const getFieldValue = (key: string): string => {
    let rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];

    // Fallback for mobilePhone: use commonFields.phone if mobilePhone is empty
    if ((rawValue === undefined || rawValue === null || String(rawValue) === '') && key === 'mobilePhone') {
      rawValue = commonFieldsData?.phone;
    }

    // Convert YYYY-MM-DD to DD-MM-YYYY if valid
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      try {
        const date = new Date(rawValue);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        }
      } catch (e) {
        // Ignore
      }
    }

    return rawValue ? String(rawValue) : '';
  };

  const formatDate = (value: string) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-');
      return `${d}-${m}-${y}`; // avoid timezone shifts
    }
    return value || '';
  };

  // Use schema from schema.ts instead of hardcoded fields

  // Render Section 1 with table layout (matching original design)
  // Note: Table can wrap to next page if needed
  const renderSection1 = () => {
    return (
      <View key="section1" style={styles.fieldContainer}>
        {/* Section 1 Header */}
        <Text style={styles.sectionHeader}>Section 1</Text>
        
        {/* Main Form Table - Using table structure */}
        <View style={{ marginBottom: 8, border: '1 solid #000000' }}>
          {/* Date Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '20%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Date:</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '80%' }]}>
              <Text style={{ fontSize: 8 }}>{getFieldValue('agreementDate') || ''}</Text>
            </View>
          </View>
          
          {/* Participant Details Header */}
          <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
            <View style={[styles.tableCellHeader, { width: '60%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Participant Details</Text>
            </View>
            <View style={[styles.tableCellHeaderLast, { width: '40%', alignItems: 'flex-end' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>
                NDIS Number: <Text style={{ fontWeight: 'normal' }}>{getFieldValue('ndisNumber') || ''}</Text>
              </Text>
            </View>
          </View>
          
          {/* Name and Sex Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '25%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Surname:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('surname') || ''}</Text>
            </View>
            <View style={[styles.tableCell, { width: '25%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Given name(s):</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('givenNames') || ''}</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 2 }}>Sex:</Text>
              {['Male', 'Female', 'Prefer not to say', 'Others'].map(option => (
                <View key={option} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                  <View style={[styles.radioCircle, { backgroundColor: getFieldValue('sex') === option ? '#000000' : 'transparent' }]} />
                  <Text style={{ fontSize: 8, marginLeft: 4 }}>{option}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Pronoun Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCellLast}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Pronoun:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('pronoun') || ''}</Text>
            </View>
          </View>
          
          {/* Indigenous Status Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '75%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Are you an Aboriginal or Torres Strait Islander descent?</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '25%' }]}>
              {['Yes', 'No'].map(option => (
                <View key={option} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                  <View style={[styles.radioCircle, { backgroundColor: getFieldValue('indigenousStatus') === option ? '#000000' : 'transparent' }]} />
                  <Text style={{ fontSize: 8, marginLeft: 4 }}>{option}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Preferred Name and DOB Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Preferred name:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('preferredName') || ''}</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Date of Birth:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('dob') || ''}</Text>
            </View>
          </View>
          
          {/* Address Header */}
          <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
            <View style={styles.tableCellHeaderLast}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Residential Address Details</Text>
            </View>
          </View>
          
          {/* Street Address Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCellLast}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Number / Street:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('street') || ''}</Text>
            </View>
          </View>
          
          {/* State and Postcode Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>State:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('state') || ''}</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Postcode:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('postcode') || ''}</Text>
            </View>
          </View>
          
          {/* Contact Details Header */}
          <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
            <View style={styles.tableCellHeaderLast}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Participant Contact Details</Text>
            </View>
          </View>
          
          {/* Email Row */}
          <View style={styles.tableRow}>
            <View style={styles.tableCellLast}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Email address:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('email') || ''}</Text>
            </View>
          </View>
          
          {/* Phone Numbers Row */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Home Phone No:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('homePhone') || ''}</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '50%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Mobile No:</Text>
              <Text style={{ fontSize: 8 }}>{getFieldValue('mobilePhone') || ''}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Text */}
        <View style={{ marginTop: 8 }}>
          <Text style={styles.staticContent}>
            All figures quoted are based on the NDIS Price Guide. This Service Agreement is made for the purpose of
            providing supports in accordance with the Individual's plan. It outlines the key responsibilities required to
            enable Infinity Supports WA to deliver quality support to individuals with disabilities. This agreement is of an
            ongoing nature and will remain in place unless either party chooses to terminate by giving appropriate notice as
            mentioned in the "Ending this Service Agreement" section.
          </Text>
        </View>
      </View>
    );
  };

  // Render Consent Table (PDF version)
  // Note: Table can wrap to next page if needed
  const renderConsentTable = (block: SchemaBlock) => {
    if (!block.items || (block.items as any[]).length === 0) return null;

    return (
      <View key="consent_table" style={styles.fieldContainer}>
        {/* Consent Header */}
        <Text style={styles.sectionHeader}>Consent</Text>
        
        {/* Table structure using Views */}
        <View style={{ marginBottom: 8 }}>
          {/* Header Row */}
          <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
            <View style={[styles.tableCellHeader, { width: '75%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Consent</Text>
            </View>
            <View style={[styles.tableCellHeaderLast, { width: '25%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>Response</Text>
            </View>
          </View>
          
          {/* Consent Rows */}
          {(block.items as any[]).map((consentItem: any, idx: number) => {
            const value = getFieldValue(consentItem.key);
            return (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '75%', padding: 6 }]}>
                  <Text style={{ fontSize: 8, lineHeight: 1.4 }}>{consentItem.label}</Text>
                  {consentItem.subItems && (
                    <View style={{ marginTop: 4, marginLeft: 10 }}>
                      {consentItem.subItems.map((item: string, subIdx: number) => (
                        <Text key={subIdx} style={{ fontSize: 7, lineHeight: 1.3 }}>
                          • {item === 'Others' 
                            ? `Others: ${getFieldValue('othersInfoSharingConsent') || '__________________________'}` 
                            : item}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                <View style={[styles.tableCellLast, { width: '25%', padding: 6 }]}>
                  {(consentItem.items || []).map((opt: string) => (
                    <View key={opt} style={styles.radioOption}>
                      <View style={[styles.radioCircle, { backgroundColor: value === opt ? '#000000' : 'transparent' }]} />
                      <Text style={{ fontSize: 8, marginLeft: 4 }}>{opt}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Render Signature Group (table format with 3 columns)
  // Note: Can wrap to next page if needed
  const renderSignatureGroup = (block: SchemaBlock) => {
    const meta = block.meta || {};
    const sigValue = getFieldValue(meta.signatureKey || '');
    const dateValue = getFieldValue(meta.dateKey || '');
    const nameValue = getFieldValue(meta.nameKey || '');
    const role = getFieldValue('signatureRole');
    const key: string = (meta.signatureKey || '') as string;
    if (key.startsWith('participant') && role !== 'Participant') return null;
    if (key.startsWith('nominee') && role !== 'Nominee') return null;

    return (
      <View key={meta.title || 'signature'} style={styles.fieldContainer}>
        {meta.title && (
          <View style={{ marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 2 }}>{meta.title}</Text>
            {meta.titleNote && (
              <Text style={{ fontSize: 8, lineHeight: 1.4, marginBottom: 4 }}>{meta.titleNote}</Text>
            )}
          </View>
        )}
        <View style={{ border: '1 solid #000000' }}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: '33%', padding: 8 }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>{meta.signatureLabel || 'Signature'}:</Text>
              {sigValue?.startsWith('data:image') ? (
                <Image src={sigValue} style={{ width: 120, height: 35 }} />
              ) : (
                <Text style={{ fontSize: 8 }}>__________________</Text>
              )}
            </View>
            <View style={[styles.tableCell, { width: '33%', padding: 8 }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>Date:</Text>
              <Text style={{ fontSize: 8 }}>{dateValue || '___/___/____'}</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '34%', padding: 8 }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>Name:</Text>
              <Text style={{ fontSize: 8 }}>{nameValue || '____________________'}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render block from schema
  const renderBlock = (block: SchemaBlock) => {
    switch (block.type) {
      case 'section1_table':
        return renderSection1();
      
      case 'consent_table':
        return renderConsentTable(block);
      
      case 'signature_group':
        return renderSignatureGroup(block);
      
      case 'section_header':
        const headerLabelPDF = block.label || '';
        const hasRedInHeaderPDF = headerLabelPDF.includes('<red>');
        
        return (
          <View key={block.label} style={styles.fieldContainer}>
            <Text style={styles.sectionHeader}>
              {hasRedInHeaderPDF ? (
                <>
                  {headerLabelPDF.split(/<red>|<\/red>/).map((part, i) => {
                    if (i % 2 === 1) {
                      return <Text key={i} style={{ color: '#DC2626' }}>{part}</Text>;
                    }
                    return part;
                  })}
                </>
              ) : (
                headerLabelPDF
              )}
            </Text>
          </View>
        );
      
      case 'section_with_list':
        const listLabelPDF = block.label || '';
        const listContentPDF = block.content || '';
        const hasRedInLabelPDF = listLabelPDF.includes('<red>');
        const hasRedInContentPDF = listContentPDF.includes('<red>');
        
        return (
          <View key={block.label} style={styles.fieldContainer}>
            <Text style={styles.staticTitle}>
              {hasRedInLabelPDF ? (
                <>
                  {listLabelPDF.split(/<red>|<\/red>/).map((part, i) => {
                    if (i % 2 === 1) {
                      return <Text key={i} style={{ color: '#DC2626', fontWeight: 'bold' }}>{part}</Text>;
                    }
                    return part;
                  })}
                </>
              ) : (
                listLabelPDF
              )}
            </Text>
            {block.content && (
              <Text style={[styles.staticContent, { marginBottom: 4 }]}>
                {hasRedInContentPDF ? (
                  <>
                    {listContentPDF.split(/<red>|<\/red>/).map((part, i) => {
                      if (i % 2 === 1) {
                        return <Text key={i} style={{ color: '#DC2626', fontWeight: 'bold' }}>{part}</Text>;
                      }
                      return part;
                    })}
                  </>
                ) : (
                  listContentPDF
                )}
              </Text>
            )}
            {(block.items || []).map((item, idx) => {
              const itemText = typeof item === 'string' ? item : '';
              return itemText ? (
                <Text key={idx} style={[styles.staticContent, { marginLeft: 10 }]}>• {itemText}</Text>
              ) : null;
            })}
          </View>
        );
      
      case 'paragraph':
        const content = block.content || '';
        return (
          <View key={content.substring(0, 50)} style={styles.fieldContainer}>
            <Text style={styles.staticContent}>{content}</Text>
          </View>
        );
      
      case 'styled_paragraph':
        const styledContent = block.content || '';
        // Parse styled content for PDF with tags: <red>, <underline>, <link>
        const parseStyledTextPDF = (text: string) => {
          const parts: any[] = [];
          let remaining = text;
          
          while (remaining.length > 0) {
            const redMatch = remaining.match(/<red>(.*?)<\/red>/);
            const underlineMatch = remaining.match(/<underline>(.*?)<\/underline>/);
            const linkMatch = remaining.match(/<link>(.*?)<\/link>/);
            
            const matches = [
              redMatch ? { match: redMatch, type: 'red', index: remaining.indexOf(redMatch[0]) } : null,
              underlineMatch ? { match: underlineMatch, type: 'underline', index: remaining.indexOf(underlineMatch[0]) } : null,
              linkMatch ? { match: linkMatch, type: 'link', index: remaining.indexOf(linkMatch[0]) } : null
            ].filter(Boolean).sort((a, b) => a!.index - b!.index);
            
            if (matches.length === 0) {
              parts.push({ text: remaining, style: 'normal' });
              break;
            }
            
            const firstMatch = matches[0]!;
            
            if (firstMatch.index > 0) {
              parts.push({ text: remaining.substring(0, firstMatch.index), style: 'normal' });
            }
            
            const innerText = firstMatch.match[1];
            parts.push({ text: innerText, style: firstMatch.type });
            
            remaining = remaining.substring(firstMatch.index + firstMatch.match[0].length);
          }
          
          return parts;
        };
        
        const parsedParts = parseStyledTextPDF(styledContent);
        
        return (
          <View key={styledContent.substring(0, 50)} style={styles.fieldContainer}>
            <Text style={styles.staticContent}>
              {parsedParts.map((part, idx) => {
                if (part.style === 'red') {
                  return (
                    <Text key={idx} style={{ color: '#DC2626', fontWeight: 'bold' }}>
                      {part.text}
                    </Text>
                  );
                } else if (part.style === 'underline') {
                  return (
                    <Text key={idx} style={{ textDecoration: 'underline' }}>
                      {part.text}
                    </Text>
                  );
                } else if (part.style === 'link') {
                  return (
                    <Text key={idx} style={{ color: '#2563EB', textDecoration: 'underline' }}>
                      {part.text}
                    </Text>
                  );
                } else {
                  return <Text key={idx}>{part.text}</Text>;
                }
              })}
            </Text>
          </View>
        );
      
      case 'list':
        return (
          <View key={(block.items || []).filter(i => typeof i === 'string').join('|').substring(0, 50)} style={styles.fieldContainer}>
            {(block.items || []).map((item, idx) => {
              const itemText = typeof item === 'string' ? item : '';
              return itemText ? (
                <Text key={idx} style={[styles.staticContent, { marginLeft: 10 }]}>• {itemText}</Text>
              ) : null;
            })}
          </View>
        );
      
      case 'checkbox': {
        const isChecked = !!getFieldValue(block.key || '');
        return (
          <View key={block.key} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, { backgroundColor: isChecked ? '#000000' : 'transparent' }]} />
            <Text style={styles.staticContent}>{block.label}</Text>
          </View>
        );
      }
      
      case 'radio': {
        const value = getFieldValue(block.key || '');
        // Only render string items (filter out consent table objects)
        const radioOptions = (block.items || []).filter(item => typeof item === 'string') as string[];
        return (
          <View key={block.key} style={styles.radioContainer}>
            <Text style={styles.radioLabel}>{block.label}</Text>
            {block.subItems && (
              <View style={{ marginLeft: 10, marginBottom: 4 }}>
                {block.subItems.map((item, idx) => (
                  <Text key={idx} style={styles.staticContent}>
                    • {item === 'Others' 
                      ? `Others: ${getFieldValue('othersInfoSharingConsent') || '__________________________'}` 
                      : item}
                  </Text>
                ))}
              </View>
            )}
            {radioOptions.map((opt) => (
              <View key={opt} style={styles.radioOption}>
                <View style={[styles.radioCircle, { backgroundColor: value === opt ? '#000000' : 'transparent' }]} />
                <Text style={styles.staticContent}>{opt}</Text>
              </View>
            ))}
          </View>
        );
      }
      
      case 'signature': {
        const sigValue = getFieldValue(block.key || '');
        return (
          <View key={block.key} style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>{block.label}</Text>
            </View>
            <View style={styles.signatureBox}>
              {sigValue?.startsWith('data:image') ? (
                <Image src={sigValue} style={{ width: 150, height: 40 }} />
              ) : (
                <Text>__________________</Text>
              )}
            </View>
          </View>
        );
      }
      
      case 'text': {
        const value = getFieldValue(block.key || '');
        const valueStr = value && String(value).trim() !== '' ? String(value) : 'No information provided';
        const isLongText = valueStr.length > 100;
        // Hide plan manager details unless enabled and at least one value is present
        if (block.key === 'planManagerName' || block.key === 'fundingSource') {
          const enabled = !!getFieldValue('planManagerManaged');
          const nameVal = getFieldValue('planManagerName');
          const emailVal = getFieldValue('fundingSource');
          if (!enabled || (!nameVal && !emailVal)) return null;
        }
        // Remove wrap={false} to allow content to break across pages
        return (
          <View key={block.key} style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>{block.label}</Text>
            </View>
            <View style={isLongText ? styles.fieldValueLong : styles.fieldValue}>
              <Text>{valueStr}</Text>
            </View>
          </View>
        );
      }
      
      case 'date': {
        const value = getFieldValue(block.key || '');
        return (
          <View key={block.key} style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>{block.label}</Text>
            </View>
            <View style={styles.fieldValue}>
              <Text>{value || '___/___/____'}</Text>
            </View>
          </View>
        );
      }
      
      default:
        return null;
    }
  };

  // Footer values (mirror settings API keys)
  const footerWebsite = settings?.company_website || settings?.from_email || '';
  const footerId = settings?.sa_delivery_of_supports || '';
  const footerDate = formatDate(settings?.review_date || '');
  try { console.log('[PDF SA Footer]', { footerWebsite, footerId, footerDate, keys: Object.keys(settings || {}) }); } catch {}

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header on all pages */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content - flows naturally with automatic page breaks */}
        {/* Render all blocks from schema */}
        <View>
          {/* Title only once at the start of content (not in fixed header) */}
          <Text style={styles.title}>SERVICE AGREEMENT FOR SERVICE DELIVERY</Text>
          {(() => { try { console.log('PDF SADelivery: blocks', saDeliverySchema.length); } catch (e) {} return null; })()}
          {saDeliverySchema.map((block, idx) => renderBlock(block))}
        </View>

        {/* Fixed Footer on all pages - matches Client Intake Form pattern */}
       <View style={styles.footer} fixed>
         <Text style={styles.footerText}>Website: {footerWebsite}</Text>
         <Text style={styles.footerText}>{footerId}</Text>
         <Text style={styles.footerText}>Review Date: {footerDate}</Text>
       </View>
      </Page>
    </Document>
  );
};

export default SADeliverySupportsMatching;

