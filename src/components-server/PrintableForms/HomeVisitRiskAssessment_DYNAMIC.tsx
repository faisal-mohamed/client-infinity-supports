import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register DejaVuSans font
Font.register({
  family: 'DejaVuSans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 85,
    paddingBottom: 40,
    fontFamily: 'DejaVuSans',
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
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  // Metadata table
  metadataTable: {
    border: '1 solid #000000',
    marginBottom: 6,
  },
  metadataRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
  },
  metadataCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1 solid #000000',
    flex: 1,
  },
  metadataCellLast: {
    padding: 5,
    fontSize: 8,
    flex: 1,
  },
  metadataCellFull: {
    padding: 5,
    fontSize: 8,
  },
  
  // Section header
  sectionHeader: {
    backgroundColor: '#d1d5db',
    border: '1 solid #000000',
    padding: 5,
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
  },
  
  // Table header row
  tableHeader: {
    border: '1 solid #000000',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #000000',
  },
  
  // Individual question row - EACH QUESTION IS SEPARATE
  questionRow: {
    flexDirection: 'row',
    border: '1 solid #000000',
    borderTop: 0,
    minHeight: 30,
  },
  questionCell: {
    width: '40%',
    padding: 5,
    fontSize: 7,
    fontWeight: 'bold',
    borderRight: '1 solid #000000',
  },
  yesCell: {
    width: '10%',
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    borderRight: '1 solid #000000',
    color: '#2563eb',
  },
  noCell: {
    width: '10%',
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    borderRight: '1 solid #000000',
    color: '#2563eb',
  },
  commentsCell: {
    width: '40%',
    padding: 5,
    fontSize: 7,
  },
  
  // Risk table
  riskTableHeader: {
    border: '1 solid #000000',
    backgroundColor: '#9ca3af',
    borderBottom: '1 solid #000000',
    marginTop: 6,
  },
  riskRow: {
    flexDirection: 'row',
    border: '1 solid #000000',
    borderTop: 0,
    minHeight: 30,
  },
  riskCell: {
    padding: 5,
    fontSize: 7,
    borderRight: '1 solid #000000',
  },
  riskCellLast: {
    padding: 5,
    fontSize: 7,
  },
  
  riskMatrix: {
    width: 500,
    height: 220,
    marginTop: 6,
    marginBottom: 6,
    objectFit: 'contain',
  },
  
  legendBlock: {
    marginBottom: 4,
  },
  legendTitle: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  legendText: {
    fontSize: 7,
  },
  
  // Signature
  signatureGrid: {
    flexDirection: 'row',
    marginTop: 12,
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureImage: {
    maxHeight: 35,
    maxWidth: 100,
    objectFit: 'contain',
  },
});

interface HomeVisitProps {
  formData?: any;
  commonFieldsData?: any;
  settings?: any;
  images?: any;
}

const HomeVisitRiskAssessment_DYNAMIC: React.FC<HomeVisitProps> = ({
  formData = {},
  commonFieldsData = {},
  settings = {},
  images = {}
}) => {
  
  const formatDate = (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-');
      return `${d}-${m}-${y}`;
    }
    return value;
  };

  const getFieldValue = (key: string): string => {
    const commonFieldMap: Record<string, string> = {
      name: 'name',
      ndisNumber: 'ndis',
      dob: 'dob',
      address: 'street',
    };
    
    const mappedKey = commonFieldMap[key];
    const rawValue = mappedKey ? commonFieldsData?.[mappedKey] : formData?.[key];
    
    if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      return formatDate(rawValue);
    }
    
    return rawValue ?? '';
  };

  const logoSrc = images?.infinityLogo || '/infinity_logo.png';
  const riskMatrixSrc = images?.riskMatrix || '/home_risk_assessment.png';
  
  const footerWebsite = settings?.company_website || '';
  const footerId = settings?.home_visit_form_id || '';
  const footerDate = formatDate(settings?.review_date || '');

  // Question sections matching web view
  const questionSections = [
    {
      title: "CLIENT AND FAMILY",
      questions: [
        { label: "Will anyone else be present during the visit?", key: "visitCompany" },
        { label: "Any history of verbal or physical aggression from the client or family?", key: "aggressionHistory" },
        { label: "Any history of alcohol or drug use? (If yes, there can be no use of alcohol or use of drugs whilst the staff member is in home)", key: "drugUseHistory" },
        { label: "Is there an advanced care directive? (If yes, please add this information to risk assessment and care plan)", key: "careDirective" }
      ]
    },
    {
      title: "ENVIRONMENT",
      questions: [
        { label: "If there are any pets, has the client agreed to restrain them during the visit?", key: "petsRestrained" },
        { label: "Are there any weapons in the home? (If yes, please make sure they are stored appropriately during the visit.)", key: "weaponsInHome" },
        { label: "If there are any smokers, have they agreed to refrain from smoking during the visit?", key: "smokingAgreement" },
        { label: "Are there smoke detectors present and in working condition?", key: "smokeDetectors" },
        { label: "Any apparent fire hazards?", key: "fireHazards" }
      ]
    },
    {
      title: "GEOGRAPHICAL LOCATION",
      questions: [
        { label: "Are there any difficulties locating the address/access to the building?", key: "accessDifficulties" },
        { label: "Is there parking available? Street? Paid?", key: "parking" },
        { label: "Is entry via the front door? If no, which door is used for entry?", key: "entryPoint" },
        { label: "Are there any issues with mobile phone reception?", key: "mobileReception" }
      ]
    }
  ];

  const filledRiskRows = [1, 2, 3, 4, 5].filter(row => {
    const issue = getFieldValue(`issue${row}`);
    return issue && issue.trim() !== '';
  });

  // Render individual question row (matching web view approach)
  const renderQuestionRow = (question: any) => {
    const value = formData?.[question.key];
    const comments = formData?.[question.key + "_comments"] || "";
    
    // Safely check if value is string before using toLowerCase
    const normalizedValue = typeof value === 'string' ? value.toLowerCase() : '';
    const isYes = normalizedValue === 'yes';
    const isNo = normalizedValue === 'no';
    
    if (question.key === 'entryPoint') {
      const entryOptions = ['Left side', 'Right Side', 'Rear', 'Front Door', 'Other'];
      const selectedOptions = Array.isArray(value) ? value : [];
      
      return (
        <View style={styles.questionRow} key={question.key} wrap={false}>
          <View style={styles.questionCell}>
            <Text>{question.label}</Text>
          </View>
          <View style={styles.yesCell}></View>
          <View style={styles.noCell}></View>
          <View style={styles.commentsCell}>
            {entryOptions.map((opt) => (
              <Text key={opt} style={{ fontSize: 7, marginBottom: 2 }}>
                {selectedOptions.includes(opt) ? '☑' : '☐'} {opt}
              </Text>
            ))}
            {comments && <Text style={{ fontSize: 7, marginTop: 4, fontStyle: 'italic' }}>{comments}</Text>}
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.questionRow} key={question.key} wrap={false}>
        <View style={styles.questionCell}>
          <Text>{question.label}</Text>
        </View>
        <View style={styles.yesCell}>
          {isYes && <Text>✓</Text>}
        </View>
        <View style={styles.noCell}>
          {isNo && <Text>✓</Text>}
        </View>
        <View style={styles.commentsCell}>
          <Text>{comments}</Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          <Image src={logoSrc} style={styles.headerLogo} />
        </View>

        {/* Content */}
        <View>
          <Text style={styles.title}>Home & Visit Risk Assessment</Text>

          {/* Metadata */}
          <View style={styles.metadataTable}>
            <View style={[styles.metadataRow, { borderBottom: '1 solid #000000' }]}>
              <View style={styles.metadataCell}>
                <Text><Text style={{ fontWeight: 'bold' }}>Name: </Text>{getFieldValue('name')}</Text>
              </View>
              <View style={styles.metadataCell}>
                <Text><Text style={{ fontWeight: 'bold' }}>NDIS Number: </Text>{getFieldValue('ndisNumber')}</Text>
              </View>
              <View style={styles.metadataCellLast}>
                <Text><Text style={{ fontWeight: 'bold' }}>DOB: </Text>{getFieldValue('dob')}</Text>
              </View>
            </View>
            <View style={[styles.metadataRow, { borderBottom: '1 solid #000000' }]}>
              <View style={styles.metadataCellFull}>
                <Text><Text style={{ fontWeight: 'bold' }}>Address: </Text>{getFieldValue('address')}</Text>
              </View>
            </View>
            <View style={styles.metadataRow}>
              <View style={styles.metadataCellFull}>
                <Text><Text style={{ fontWeight: 'bold' }}>Date of completion: </Text>{formatDate(formData?.completionDate)}</Text>
              </View>
            </View>
          </View>

          {/* Table Header - Only once */}
          <View style={styles.tableHeader}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[styles.questionCell, { backgroundColor: '#f3f4f6' }]}>
                <Text style={{ fontWeight: 'bold' }}>Question</Text>
              </View>
              <View style={[styles.yesCell, { backgroundColor: '#f3f4f6' }]}>
                <Text style={{ fontWeight: 'bold' }}>YES</Text>
              </View>
              <View style={[styles.noCell, { backgroundColor: '#f3f4f6' }]}>
                <Text style={{ fontWeight: 'bold' }}>NO</Text>
              </View>
              <View style={[styles.commentsCell, { backgroundColor: '#f3f4f6' }]}>
                <Text style={{ fontWeight: 'bold' }}>COMMENTS</Text>
              </View>
            </View>
          </View>

          {/* Questions - Each as separate block */}
          {questionSections.map((section) => (
            <React.Fragment key={section.title}>
              <View style={styles.sectionHeader} wrap={false}>
                <Text>{section.title}</Text>
              </View>
              {section.questions.map(renderQuestionRow)}
            </React.Fragment>
          ))}

          {/* Risk Matrix */}
          <Image src={riskMatrixSrc} style={styles.riskMatrix} />

          {/* Legend */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, textDecoration: 'underline' }}>
              Risk Assessment Outcome – Proceed with Visit as follows:
            </Text>
            {[
              { title: 'LOW GREEN', color: '#065f46', text: 'Visit acceptable. Ensure control options are followed.' },
              { title: 'MEDIUM YELLOW', color: '#92400e', text: 'Visit should only proceed after consultation with Manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as Moderate Risk.' },
              { title: 'MODERATE ORANGE', color: '#b45309', text: 'Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re-classify as High Risk.' },
              { title: 'HIGH RED', color: '#991b1b', text: 'Visit must only proceed with Director approval. The risks associated with the visit must be re-assessed & other options considered.' }
            ].map((block) => (
              <View key={block.title} style={styles.legendBlock}>
                <Text style={[styles.legendTitle, { color: block.color }]}>{block.title}</Text>
                <Text style={styles.legendText}>{block.text}</Text>
              </View>
            ))}
          </View>

          {/* Risk Assessment Table */}
          {filledRiskRows.length > 0 && (
            <>
              <View style={styles.riskTableHeader}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.riskCell, { width: '22%' }]}>
                    <Text style={{ fontWeight: 'bold' }}>Issue/Task</Text>
                  </View>
                  <View style={[styles.riskCell, { width: '12%' }]}>
                    <Text style={{ fontWeight: 'bold' }}>Risk Score</Text>
                  </View>
                  <View style={[styles.riskCell, { width: '50%' }]}>
                    <Text style={{ fontWeight: 'bold' }}>Control Measure</Text>
                  </View>
                  <View style={[styles.riskCellLast, { width: '16%' }]}>
                    <Text style={{ fontWeight: 'bold' }}>Person Responsible</Text>
                  </View>
                </View>
              </View>
              {filledRiskRows.map((row) => (
                <View style={styles.riskRow} key={row} wrap={false}>
                  <View style={[styles.riskCell, { width: '22%' }]}>
                    <Text>{getFieldValue(`issue${row}`)}</Text>
                  </View>
                  <View style={[styles.riskCell, { width: '12%' }]}>
                    <Text>{getFieldValue(`riskScore${row}`)}</Text>
                  </View>
                  <View style={[styles.riskCell, { width: '50%' }]}>
                    <Text>{getFieldValue(`control${row}`)}</Text>
                  </View>
                  <View style={[styles.riskCellLast, { width: '16%' }]}>
                    <Text>{getFieldValue(`responsible${row}`)}</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Signature */}
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
                {formData?.assessorSignature?.startsWith('data:image') && (
                  <Image src={formData.assessorSignature} style={styles.signatureImage} />
                )}
              </View>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Designation:</Text>
              <View style={styles.signatureBox}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formData?.designation || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text>Website: {footerWebsite}</Text>
          <Text>{footerId}</Text>
          <Text>Review Date: {footerDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default HomeVisitRiskAssessment_DYNAMIC;

