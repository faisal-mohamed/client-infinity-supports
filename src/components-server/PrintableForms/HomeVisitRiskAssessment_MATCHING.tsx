import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { homeVisitSchema, HomeVisitSchemaBlock } from '../../app/components/forms/home-visit-risk-assessment/schema';

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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  coverSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 1.5,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 4,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 10,
    borderBottom: '1 solid #9ca3af',
    paddingBottom: 4,
    minHeight: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  radioCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    border: '1 solid #374151',
  },
  radioSelected: {
    backgroundColor: '#374151',
  },
  radioText: {
    fontSize: 10,
  },
  textareaValue: {
    fontSize: 10,
    border: '1 solid #d1d5db',
    padding: 8,
    minHeight: 40,
    backgroundColor: '#f9fafb',
  },
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #d1d5db',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    borderRight: '1 solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    borderRight: '1 solid #e5e7eb',
    minHeight: 32,
  },
  signatureSection: {
    marginTop: 24,
  },
  signatureGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  signatureField: {
    flex: 1,
  },
  signatureBox: {
    border: '1 solid #d1d5db',
    height: 60,
    marginBottom: 4,
    backgroundColor: '#f9fafb',
  },
  signatureImage: {
    maxHeight: 60,
    objectFit: 'contain',
  },
  coverInfo: {
    marginTop: 32,
  },
  coverInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  coverInfoField: {
    width: '45%',
    marginBottom: 16,
  },
  coverInfoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coverInfoValue: {
    fontSize: 10,
    borderBottom: '1 solid #9ca3af',
    paddingBottom: 4,
    minHeight: 16,
  },
});

interface HomeVisitFormPDFProps {
  formData?: any;
  commonFieldsData?: any;
  settings?: any;
  images?: any;
}

const HomeVisitRiskAssessment_MATCHING: React.FC<HomeVisitFormPDFProps> = ({
  formData = {},
  commonFieldsData = {},
  settings = {},
  images = {}
}) => {

  // Use base64 images provided by API instead of file paths
  const getImageSrc = (relativePath: string): string => {
    if (!images || Object.keys(images).length === 0) {
      console.log(`🖼️ [BROWSER] No images provided by API, using fallback for: ${relativePath}`);
      return relativePath;
    }

    const imageMap: Record<string, string> = {
      '/infinity_logo.png': 'infinityLogo',
    };
    
    const imageKey = imageMap[relativePath];
    const base64Image = images[imageKey];
    
    console.log(`🖼️ [BROWSER] Image ${relativePath} -> key: ${imageKey} -> ${base64Image ? 'found' : 'missing'}`);
    
    return base64Image || relativePath;
  };

  console.log('🔍 [BROWSER] HomeVisit PDF Generation Started');
  console.log('📊 [BROWSER] Schema blocks:', homeVisitSchema.length);
  console.log('📋 [BROWSER] Form data:', formData);
  console.log('🏢 [BROWSER] Settings:', settings);
  console.log('🖼️ [BROWSER] Images received:', Object.keys(images));

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

  // Footer values (mirror settings API keys like SA Delivery)
  const footerWebsite = settings?.company_website || settings?.from_email || '';
  const footerId = settings?.home_visit_form_id || '';
  const footerDate = formatDate(settings?.review_date || '');
  console.log('[PDF HomeVisit Footer]', { footerWebsite, footerId, footerDate, keys: Object.keys(settings || {}) });

  // Filter filled risk assessment rows
  const filledRiskRows = [1, 2, 3, 4, 5].filter(row => {
    const issue = getFieldValue(`issue${row}`);
    const riskScore = getFieldValue(`riskScore${row}`);
    const control = getFieldValue(`control${row}`);
    const responsible = getFieldValue(`responsible${row}`);
    return issue || riskScore || control || responsible;
  });

  // Render individual block content
  const renderBlockContent = (block: HomeVisitSchemaBlock, index: number) => {
    console.log(`🎨 [BROWSER] Rendering block ${index}: ${block.type}`);
    
    switch (block.type) {
      case 'section_header':
        return (
          <Text key={index} style={styles.sectionHeader}>{block.label}</Text>
        );

      case 'form_field':
        return (
          <View key={index}>
            {block.fields?.map((field, fieldIndex) => (
              <View key={fieldIndex} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  {field.label}
                  {field.required && <Text style={{ color: '#ef4444' }}> *</Text>}
                </Text>
                {field.type === 'radio' ? (
                  <View style={styles.radioContainer}>
                    {field.options?.map((option, optIndex) => (
                      <View key={optIndex} style={styles.radioOption}>
                        <View style={[
                          styles.radioCircle,
                          getFieldValue(field.key) === option && styles.radioSelected
                        ]} />
                        <Text style={styles.radioText}>{option}</Text>
                      </View>
                    ))}
                  </View>
                ) : field.type === 'textarea' ? (
                  <Text style={styles.textareaValue}>
                    {getFieldValue(field.key) || ''}
                  </Text>
                ) : field.type === 'signature' ? (
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

      case 'table':
        return (
          <View key={index} style={styles.table}>
            <View style={styles.tableHeader}>
              {block.table?.headers.map((header, headerIndex) => (
                <Text key={headerIndex} style={styles.tableHeaderCell}>
                  {header}
                </Text>
              ))}
            </View>
            {block.table?.rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.fields.map((field, fieldIndex) => (
                  <Text key={fieldIndex} style={styles.tableCell}>
                    {getFieldValue(field.key) || ''}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        );

      case 'signature_section':
        return (
          <View key={index} style={styles.signatureSection}>
            <Text style={styles.sectionHeader}>{block.label}</Text>
            <View style={styles.signatureGrid}>
              {block.fields?.map((field, fieldIndex) => (
                <View key={fieldIndex} style={styles.signatureField}>
                  <Text style={styles.fieldLabel}>
                    {field.label}
                    {field.required && <Text style={{ color: '#ef4444' }}> *</Text>}
                  </Text>
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
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      {/* Single Content Page with Fixed Footer - Like SA Delivery */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <Image src={getImageSrc('/infinity_logo.png')} style={styles.headerLogo} />
        </View>

        {/* All Content in Single Flow - Like SA Delivery */}
        <View>
          <Text style={styles.title}>HOME & COMMUNITY VISIT RISK ASSESSMENT</Text>
          
          {/* Metadata Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '33%' }]}>
                Name: {getFieldValue('name')}
              </Text>
              <Text style={[styles.tableCell, { width: '33%' }]}>
                NDIS Number: {getFieldValue('ndisNumber')}
              </Text>
              <Text style={[styles.tableCell, { width: '34%' }]}>
                DOB: {getFieldValue('dob')}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '100%' }]}>
                Address: {getFieldValue('address')}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '100%' }]}>
                Date of completion of risk assessment: {getFieldValue('completionDate')}
              </Text>
            </View>
          </View>

          {/* Main Q&A Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '40%' }]}></Text>
              <Text style={[styles.tableHeaderCell, { width: '7%' }]}>YES</Text>
              <Text style={[styles.tableHeaderCell, { width: '7%' }]}>NO</Text>
              <Text style={[styles.tableHeaderCell, { width: '46%' }]}>COMMENTS</Text>
            </View>

            {/* CLIENT AND FAMILY Section */}
            <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
              <Text style={[styles.tableCell, { width: '100%', fontWeight: 'bold' }]}>
                CLIENT AND FAMILY
              </Text>
            </View>
            
            {/* All Q&A Rows */}
            {[
              { key: 'visitCompany', label: 'Will anyone else be present during the visit?' },
              { key: 'aggressionHistory', label: 'Any history of verbal or physical aggression from the client or family?' },
              { key: 'drugUseHistory', label: 'Any history of alcohol or drug use? (If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)' },
              { key: 'careDirective', label: 'Is there an advanced care directive? (If yes, please add this information to risk assessment and care plan)' }
            ].map((field, index) => (
              <View key={field.key} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '40%' }]}>{field.label}</Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]}>
                  {getFieldValue(field.key)?.toLowerCase?.() === 'yes' ? '✔️' : ''}
                </Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]}>
                  {getFieldValue(field.key)?.toLowerCase?.() === 'no' ? '✔️' : ''}
                </Text>
                <Text style={[styles.tableCell, { width: '46%' }]}>
                  {getFieldValue(field.key + '_comments') || ''}
                </Text>
              </View>
            ))}

            {/* ENVIRONMENT Section */}
            <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
              <Text style={[styles.tableCell, { width: '100%', fontWeight: 'bold' }]}>
                ENVIRONMENT
              </Text>
            </View>
            
            {[
              { key: 'petsRestrained', label: 'If there are any pets, has the client agreed to restrain them during the visit?' },
              { key: 'weaponsInHome', label: 'Are there any weapons in the home? (If yes, please make sure they are stored appropriately during the visit.)' },
              { key: 'smokingAgreement', label: 'If there are any smokers, have they agreed to refrain from smoking during the visit?' },
              { key: 'smokeDetectors', label: 'Are there smoke detectors present and in working condition?' },
              { key: 'fireHazards', label: 'Any apparent fire hazards?' }
            ].map((field, index) => (
              <View key={field.key} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '40%' }]}>{field.label}</Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]}>
                  {getFieldValue(field.key)?.toLowerCase?.() === 'yes' ? '✔️' : ''}
                </Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]}>
                  {getFieldValue(field.key)?.toLowerCase?.() === 'no' ? '✔️' : ''}
                </Text>
                <Text style={[styles.tableCell, { width: '46%' }]}>
                  {getFieldValue(field.key + '_comments') || ''}
                </Text>
              </View>
            ))}

            {/* GEOGRAPHICAL LOCATION Section */}
            <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
              <Text style={[styles.tableCell, { width: '100%', fontWeight: 'bold' }]}>
                GEOGRAPHICAL LOCATION
              </Text>
            </View>
            
            {[
              { key: 'accessDifficulties', label: 'Are there any difficulties locating the address/access to the building?' },
              { key: 'parking', label: 'Is there parking available?' },
              { key: 'entryPoint', label: 'Is entry via the front door? If no, which door is used for entry?' },
              { key: 'mobileReception', label: 'Are there any issues with mobile phone reception?' }
            ].map((field, index) => (
              <View key={field.key} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '40%' }]}>{field.label}</Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]}>
                  {getFieldValue(field.key)?.toLowerCase?.() === 'yes' ? '✔️' : ''}
                </Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]}>
                  {getFieldValue(field.key)?.toLowerCase?.() === 'no' ? '✔️' : ''}
                </Text>
                <Text style={[styles.tableCell, { width: '46%' }]}>
                  {getFieldValue(field.key + '_comments') || ''}
                </Text>
              </View>
            ))}
          </View>

          {/* Risk Assessment Descriptions */}
          <Text style={[styles.sectionHeader, { textAlign: 'center', textDecoration: 'underline' }]}>
            Risk Assessment Outcome – Proceed with Visit as follows:
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.fieldLabel}>LOW GREEN</Text>
            <Text style={styles.textareaValue}>Visit acceptable. Ensure control options are followed.</Text>
            
            <Text style={styles.fieldLabel}>MEDIUM YELLOW</Text>
            <Text style={styles.textareaValue}>Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk.</Text>
            
            <Text style={styles.fieldLabel}>MODERATE ORANGE</Text>
            <Text style={styles.textareaValue}>Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.</Text>
            
            <Text style={styles.fieldLabel}>HIGH RED</Text>
            <Text style={styles.textareaValue}>Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.</Text>
          </View>

          {/* Risk Assessment Table - Only if has data */}
          {filledRiskRows.length > 0 && (
            <View style={styles.table}>
              <View style={[styles.tableHeader, { backgroundColor: '#9ca3af' }]}>
                <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Issue/Task</Text>
                <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Risk Score</Text>
                <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Control Measure</Text>
                <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Person Responsible</Text>
              </View>
              {filledRiskRows.map((row) => (
                <View key={row} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {getFieldValue(`issue${row}`) || ''}
                  </Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {getFieldValue(`riskScore${row}`) || ''}
                  </Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {getFieldValue(`control${row}`) || ''}
                  </Text>
                  <Text style={[styles.tableCell, { width: '25%' }]}>
                    {getFieldValue(`responsible${row}`) || ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
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

export default HomeVisitRiskAssessment_MATCHING;
