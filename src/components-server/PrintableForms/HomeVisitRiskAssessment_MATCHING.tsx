import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 85,
    paddingBottom: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 150,
    height: 60,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    borderTop: '1 solid #d1d5db',
    paddingTop: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  // Metadata table styles
  metadataTable: {
    border: '1 solid #000000',
    marginBottom: 6,
  },
  metadataRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
  },
  metadataCell: {
    padding: 4,
    fontSize: 8,
    borderRight: '1 solid #000000',
    flex: 1,
  },
  metadataCellLast: {
    padding: 4,
    fontSize: 8,
    flex: 1,
  },
  metadataCellFull: {
    padding: 4,
    fontSize: 8,
  },
  labelText: {
    fontWeight: 'bold',
  },
  // Q&A table styles
  qaTable: {
    border: '1 solid #000000',
    marginTop: 4,
  },
  qaHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #000000',
  },
  qaHeaderCell: {
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
    borderRight: '1 solid #000000',
  },
  qaHeaderCellLast: {
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  qaSectionRow: {
    flexDirection: 'row',
    backgroundColor: '#d1d5db',
    borderBottom: '1 solid #000000',
  },
  qaSectionCell: {
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
  },
  qaRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
  },
  qaQuestionCell: {
    width: '40%',
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    borderRight: '1 solid #000000',
  },
  qaYesCell: {
    width: '7%',
    padding: 4,
    fontSize: 7,
    textAlign: 'center',
    borderRight: '1 solid #000000',
  },
  qaNoCell: {
    width: '7%',
    padding: 4,
    fontSize: 7,
    textAlign: 'center',
    borderRight: '1 solid #000000',
  },
  qaCommentsCell: {
    width: '46%',
    padding: 4,
    fontSize: 7,
  },
  // Risk assessment table
  riskTable: {
    border: '1 solid #000000',
    marginTop: 6,
  },
  riskHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#9ca3af',
    borderBottom: '1 solid #000000',
  },
  riskHeaderCell: {
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    borderRight: '1 solid #000000',
    flex: 1,
  },
  riskHeaderCellLast: {
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    flex: 1,
  },
  riskRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
  },
  riskCell: {
    padding: 5,
    fontSize: 7,
    borderRight: '1 solid #000000',
    flex: 1,
    minHeight: 30,
  },
  riskCellLast: {
    padding: 5,
    fontSize: 7,
    flex: 1,
    minHeight: 30,
  },
  // Risk matrix and legend
  riskMatrix: {
    width: 500,
    height: 220,
    marginTop: 6,
    marginBottom: 8,
    objectFit: 'contain',
  },
  legendTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  legendBlock: {
    marginBottom: 4,
  },
  legendBlockTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  legendBlockText: {
    fontSize: 7,
    lineHeight: 1.3,
  },
  // Signature section
  signatureGrid: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  signatureField: {
    flex: 1,
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  signatureBox: {
    borderBottom: '2 solid #000000',
    width: '100%',
    minHeight: 40,
    marginBottom: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureImage: {
    maxHeight: 35,
    maxWidth: 100,
    objectFit: 'contain',
  },
  checkboxGroup: {
    flexDirection: 'column',
    gap: 1,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  checkbox: {
    width: 7,
    height: 7,
    border: '1 solid #000000',
    marginRight: 3,
  },
  checkboxChecked: {
    backgroundColor: '#000000',
  },
  checkboxText: {
    fontSize: 7,
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

  console.log('🔍 [PDF] HomeVisit PDF Generation Started');
  console.log('📋 [PDF] Form data keys:', Object.keys(formData));
  console.log('🏢 [PDF] Settings:', settings);
  console.log('🏢 [PDF] Settings keys:', Object.keys(settings || {}));
  console.log('🖼️ [PDF] Images received:', Object.keys(images));
  console.log('🔧 [PDF] Common fields:', commonFieldsData);

  // Get field value helper - FIXED to match web view field mapping
  const getFieldValue = (key: string): string => {
    // Common field mappings - match web view exactly
    const commonFieldMap: Record<string, string> = {
      name: 'name',
      ndisNumber: 'ndis',        // Web view uses 'ndis'
      dob: 'dob',
      address: 'street',          // Web view uses 'street'
  };

    // Try form data first, then common fields with proper mapping
    let rawValue = formData?.[key];
    
    if (!rawValue && commonFieldMap[key]) {
      rawValue = commonFieldsData?.[commonFieldMap[key]];
    }

    // Format dates
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

  // Footer values - match web view exactly
  const footerWebsite = settings?.company_website || settings?.website || settings?.from_email || '';
  const footerId = settings?.home_visit_form_id || 'HV001';
  const footerDate = formatDate(settings?.review_date || '');
  
  console.log('🦶 [PDF Footer]', { footerWebsite, footerId, footerDate });

  const logoSrc = images?.infinityLogo || '/infinity_logo.png';
  const riskMatrixSrc = images?.riskMatrix || '/home_risk_assessment.png';

  // Page 1 & 2 Questions (CLIENT AND FAMILY, ENVIRONMENT, GEOGRAPHICAL LOCATION)
  const page1Questions = [
    { section: 'CLIENT AND FAMILY' },
    { label: 'Will anyone else be present during the visit?', key: 'visitCompany' },
    { label: 'Any history of verbal or physical aggression from the client or family?', key: 'aggressionHistory' },
    { label: 'Any history of alcohol or drug use? (If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)', key: 'drugUseHistory' },
    { label: 'Is there an advanced care directive? (If yes, please add this information to risk assessment and care plan)', key: 'careDirective' },
    { section: 'ENVIRONMENT' },
    { label: 'If there are any pets, has the client agreed to restrain them during the visit?', key: 'petsRestrained' },
    { label: 'Are there any weapons in the home? (If yes, please make sure they are stored appropriately during the visit.)', key: 'weaponsInHome' },
  ];

  const page2Questions = [
    { label: 'If there are any smokers, have they agreed to refrain from smoking during the visit?', key: 'smokingAgreement' },
    { label: 'Are there smoke detectors present and in working condition?', key: 'smokeDetectors' },
    { label: 'Any apparent fire hazards?', key: 'fireHazards' },
    { section: 'GEOGRAPHICAL LOCATION' },
    { label: 'Are there any difficulties locating the address/access to the building?', key: 'accessDifficulties' },
    { label: 'Is there parking available?', key: 'parking' },
    { label: 'Is entry via the front door? If no, which door is used for entry?', key: 'entryPoint', type: 'checkbox' },
    { label: 'Are there any issues with mobile phone reception?', key: 'mobileReception' },
  ];

  // Render Q&A Row
  const renderQARow = (q: any) => {
    if (q.section) {
      return (
        <View style={styles.qaSectionRow} key={q.section}>
          <Text style={styles.qaSectionCell}>{q.section}</Text>
        </View>
      );
    }

    const value = getFieldValue(q.key);
    const comments = getFieldValue(`${q.key}_comments`);

    // Handle checkbox type (entry point)
    if (q.type === 'checkbox') {
      const entryOptions: string[] = ['Left side', 'Right Side', 'Rear', 'Front Door', 'Other'];
      const rawValue = formData?.[q.key];
      const selectedOptions: string[] = Array.isArray(rawValue) ? rawValue : [];
      
      return (
        <View style={styles.qaRow} key={q.key}>
          <View style={styles.qaQuestionCell}>
            <Text>{q.label}</Text>
          </View>
          <View style={styles.qaYesCell}></View>
          <View style={styles.qaNoCell}></View>
          <View style={styles.qaCommentsCell}>
            <View style={styles.checkboxGroup}>
              {entryOptions.map((opt: string) => (
                <View style={styles.checkboxOption} key={opt}>
                  <View style={selectedOptions.includes(opt) ? [styles.checkbox, styles.checkboxChecked] : styles.checkbox} />
                  <Text style={styles.checkboxText}>{opt}</Text>
                </View>
              ))}
            </View>
            {comments && <Text style={{ fontSize: 8, marginTop: 4, fontStyle: 'italic' }}>{comments}</Text>}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.qaRow} key={q.key}>
        <View style={styles.qaQuestionCell}>
          <Text>{q.label}</Text>
        </View>
        <View style={styles.qaYesCell}>
          <Text>{value?.toLowerCase() === 'yes' ? '✔' : ''}</Text>
        </View>
        <View style={styles.qaNoCell}>
          <Text>{value?.toLowerCase() === 'no' ? '✔' : ''}</Text>
        </View>
        <View style={styles.qaCommentsCell}>
          <Text>{comments || ''}</Text>
        </View>
      </View>
    );
  };

  // Combine all questions for continuous flow
  const allQuestions = [...page1Questions, ...page2Questions];

  // Filter filled risk assessment rows - only show rows with data
  const filledRiskRows = [1, 2, 3, 4, 5].filter(row => {
    const issue = getFieldValue(`issue${row}`);
    const riskScore = getFieldValue(`riskScore${row}`);
    const control = getFieldValue(`control${row}`);
    const responsible = getFieldValue(`responsible${row}`);
    return issue || riskScore || control || responsible;
  });

  return (
    <Document>
      {/* SINGLE PAGE with dynamic flow - React-PDF will auto-paginate */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header on all pages */}
        <View style={styles.header} fixed>
          <Image src={logoSrc} style={styles.headerLogo} />
        </View>

        {/* Content - flows naturally with automatic page breaks */}
        <View>
          <Text style={styles.title}>Home & Visit Risk Assessment</Text>

          {/* Metadata Table */}
          <View style={styles.metadataTable}>
            <View style={[styles.metadataRow, { borderBottom: '1 solid #000000' }]}>
              <View style={styles.metadataCell}>
                <Text style={styles.labelText}>Name: </Text>
                <Text>{getFieldValue('name')}</Text>
              </View>
              <View style={styles.metadataCell}>
                <Text style={styles.labelText}>NDIS Number: </Text>
                <Text>{getFieldValue('ndisNumber')}</Text>
              </View>
              <View style={styles.metadataCellLast}>
                <Text style={styles.labelText}>DOB: </Text>
                <Text>{getFieldValue('dob')}</Text>
              </View>
                      </View>
            <View style={[styles.metadataRow, { borderBottom: '1 solid #000000' }]}>
              <View style={styles.metadataCellFull}>
                <Text style={styles.labelText}>Address: </Text>
                <Text>{getFieldValue('address')}</Text>
                  </View>
                  </View>
            <View style={styles.metadataRow}>
              <View style={styles.metadataCellFull}>
                <Text style={styles.labelText}>Date of completion of risk assessment: </Text>
                <Text>{formatDate(getFieldValue('completionDate'))}</Text>
              </View>
            </View>
          </View>

          {/* Q&A Table - All questions in continuous flow */}
          <View style={styles.qaTable}>
            <View style={styles.qaHeaderRow}>
              <View style={[styles.qaHeaderCell, { width: '40%' }]}><Text>Question</Text></View>
              <View style={[styles.qaHeaderCell, { width: '7%' }]}><Text>YES</Text></View>
              <View style={[styles.qaHeaderCell, { width: '7%' }]}><Text>NO</Text></View>
              <View style={[styles.qaHeaderCellLast, { width: '46%' }]}><Text>COMMENTS</Text></View>
            </View>
            {allQuestions.map(renderQARow)}
          </View>

          {/* Risk Matrix Image */}
          <Image src={riskMatrixSrc} style={styles.riskMatrix} />

          {/* Legend */}
          <Text style={styles.legendTitle}>Risk Assessment Outcome – Proceed with Visit as follows:</Text>

          <View style={styles.legendBlock}>
            <Text style={[styles.legendBlockTitle, { color: '#065f46' }]}>LOW GREEN</Text>
            <Text style={styles.legendBlockText}>
              Visit acceptable. Ensure control options are followed.
            </Text>
          </View>

          <View style={styles.legendBlock}>
            <Text style={[styles.legendBlockTitle, { color: '#92400e' }]}>MEDIUM YELLOW</Text>
            <Text style={styles.legendBlockText}>
              Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk.
            </Text>
          </View>

          <View style={styles.legendBlock}>
            <Text style={[styles.legendBlockTitle, { color: '#b45309' }]}>MODERATE ORANGE</Text>
            <Text style={styles.legendBlockText}>
              Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.
            </Text>
          </View>

          <View style={styles.legendBlock}>
            <Text style={[styles.legendBlockTitle, { color: '#991b1b' }]}>HIGH RED</Text>
            <Text style={styles.legendBlockText}>
              Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.
                </Text>
          </View>

          {/* Risk Assessment Table - Only show if there are filled rows */}
          {filledRiskRows.length > 0 && (
            <View style={styles.riskTable}>
              <View style={styles.riskHeaderRow}>
                <View style={styles.riskHeaderCell}><Text>Issue/Task</Text></View>
                <View style={styles.riskHeaderCell}><Text>Risk Score</Text></View>
                <View style={styles.riskHeaderCell}><Text>Control Measure</Text></View>
                <View style={styles.riskHeaderCellLast}><Text>Person Responsible</Text></View>
              </View>
              {filledRiskRows.map((row) => (
                <View style={styles.riskRow} key={row}>
                  <View style={styles.riskCell}>
                    <Text>{getFieldValue(`issue${row}`)}</Text>
                  </View>
                  <View style={styles.riskCell}>
                    <Text>{getFieldValue(`riskScore${row}`)}</Text>
                  </View>
                  <View style={styles.riskCell}>
                    <Text>{getFieldValue(`control${row}`)}</Text>
                  </View>
                  <View style={styles.riskCellLast}>
                    <Text>{getFieldValue(`responsible${row}`)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Signature Section */}
          <View style={styles.signatureGrid}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Name:</Text>
              <View style={styles.signatureBox}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{getFieldValue('authorName') || getFieldValue('name')}</Text>
              </View>
            </View>

            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Signature:</Text>
              <View style={styles.signatureBox}>
                {getFieldValue('assessorSignature')?.startsWith('data:image') && (
                  <Image src={getFieldValue('assessorSignature')} style={styles.signatureImage} />
                )}
              </View>
            </View>

            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Designation:</Text>
              <View style={styles.signatureBox}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{getFieldValue('designation')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fixed Footer on all pages */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerWebsite ? `Website: ${footerWebsite}` : 'Website:'}</Text>
          <Text style={styles.footerText}>{footerId}</Text>
          <Text style={styles.footerText}>{footerDate ? `Review Date: ${footerDate}` : 'Review Date:'}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default HomeVisitRiskAssessment_MATCHING;
