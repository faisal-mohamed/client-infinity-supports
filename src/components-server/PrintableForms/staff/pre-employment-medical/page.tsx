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
    padding: 30,
    paddingTop: 110, // Space for fixed header (logo)
    paddingBottom: 50, // Space for fixed footer
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
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
    width: 140,
    height: 45,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1 solid #ddd',
    paddingTop: 8,
    fontSize: 9,
    color: '#666',
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
  },
  section: {
    marginBottom: 20, // Increased for better spacing between sections
    breakInside: 'auto', // Allow natural page breaks
  },
  sectionHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    breakInside: 'avoid', // Keep header with content
  },
  contentBox: {
    border: '1 solid #d1d5db',
    padding: 10,
    marginBottom: 12,
    breakInside: 'auto', // Allow breaking across pages
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    breakInside: 'auto', // Allow breaking if needed
  },
  fieldLabel: {
    width: 140,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    paddingRight: 8,
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    wrap: true,
  },
  fieldBox: {
    border: '1 solid #9ca3af',
    minHeight: 28,
    padding: 6,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#111827',
    wrap: true,
    breakInside: 'auto',
  },
  table: {
    width: '100%',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #d1d5db',
    minHeight: 24,
    breakInside: 'avoid', // Keep Yes/No together with question
    wrap: false, // Prevent row from splitting
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 9,
    padding: 6,
    border: '1 solid #d1d5db',
  },
  tableCellQuestion: {
    fontSize: 9,
    padding: 6,
    border: '1 solid #d1d5db',
    flex: 2.5,
    wrap: true,
  },
  tableCellYesNo: {
    fontSize: 9,
    padding: 4,
    border: '1 solid #d1d5db',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    wrap: false, // Keep checkbox and label together
  },
  tableCellDetails: {
    fontSize: 9,
    padding: 6,
    border: '1 solid #d1d5db',
    flex: 4,
    wrap: true,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1 solid #000000',
    marginRight: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: '1 solid #000000',
    marginRight: 4,
    backgroundColor: '#87ceeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    fontSize: 9,
    lineHeight: 1.5,
    padding: 8,
    border: '1 solid #d1d5db',
    backgroundColor: '#f9fafb',
    minHeight: 50,
    marginBottom: 10,
    marginTop: 6,
    breakInside: 'auto',
    wrap: true,
  },
  signatureRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    marginBottom: 35, // Increased gap after signature before next section
    breakInside: 'avoid', // Keep signature together
  },
  signatureBox: {
    border: '2 solid #000000', // Thick black border for maximum visibility
    minHeight: 90, // Increased height for better visibility
    height: 90, // Fixed height to ensure box is always visible
    padding: 12, // More padding for better spacing
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffffff', // White background
  },
  signatureImage: {
    maxHeight: 75, // Increased to fit better in larger box
    maxWidth: '90%', // Margin from edges
    objectFit: 'contain',
  },
  dateBox: {
    border: '2 solid #000000', // Thick black border for maximum visibility
    minHeight: 36, // Increased height
    height: 36, // Fixed height
    padding: 10, // More padding
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff', // White background
  },
  subHeadingRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #d1d5db',
    backgroundColor: '#f9fafb',
    padding: 6,
    breakInside: 'avoid',
  },
  subHeadingText: {
    fontSize: 9,
    fontWeight: 'bold',
    flex: 7,
  },
});

interface PreEmploymentMedicalPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
}

const PreEmploymentMedicalPDF: React.FC<PreEmploymentMedicalPDFProps> = ({
  data = {},
  staff = {},
  settings = {},
  images = {},
}) => {
  console.log('🔍 [PDF] Pre-Employment Medical - Generating dynamic PDF');

  // Helper to get field value
  const getValue = (key: string): string => {
    return data?.[key] || staff?.[key] || '';
  };

  // Helper to get boolean value
  const getBoolean = (key: string): boolean | null => {
    const value = data?.[key];
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return null;
  };

  // Helper to format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  // Render checkbox with Yes/No label
  const renderCheckboxWithLabel = (checked: boolean | null, label: string) => {
    return (
      <View style={styles.tableCellYesNo}>
        <View style={checked ? styles.checkboxChecked : styles.checkbox}>
          {checked && <Text style={{ fontSize: 7 }}>✓</Text>}
      </View>
        <Text style={{ fontSize: 8, marginLeft: 2 }}>{label}</Text>
      </View>
    );
  };

  // General Health Questions
  const generalHealthQuestions = [
    'Are you being treated by any Doctor for any illness?',
    'Have you ever broken any bones?',
    'Are you taking regular medication?',
    'Have you ever been immunised against tetanus?',
    'Have you ever had any operations?',
  ];

  // Medical Conditions
  const medicalConditions = [
    'Tuberculosis',
    'Wheezing/Bronchitis/Asthma',
    'Diabetes',
    'Blood pressure or heart disease',
    'Stomach pains or ulcers',
    'Excessive noise exposure or loss of hearing',
    'Skin disorders or dermatitis',
    'Chronic ear infections',
    'Fits, black-outs or dizziness',
    'Head injury or concussion',
    'Hernia',
    'Allergies',
    'Anxieties or depressive illness',
    'Hepatitis B',
    'Severe headaches',
    'Colour blindness',
  ];

  // Get footer values from settings only (no hardcoded fallbacks)
  const footerWebsite = settings?.footerWebsite || '';
  const footerId = settings?.footerId || '';
  const footerDate = settings?.footerDate || '';

  return (
    <Document>
      {/* Single Page with natural flow - like Emergency Drill */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header - appears on all pages */}
        {images?.infinityLogo && (
          <View style={styles.header} fixed>
            <Image src={images.infinityLogo} style={styles.headerLogo} />
          </View>
        )}

        {/* Content flows naturally with automatic page breaks */}
        <View>
          {/* Section 1: Pre-Employment Medical Examination Consent Form */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pre-Employment Medical Examination Consent Form</Text>
          <View style={styles.contentBox}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Full Name:</Text>
              <View style={styles.fieldBox}>
                  <Text style={styles.fieldValue}>
                    {getValue('fullName') || `${staff?.firstName || ''} ${staff?.surname || ''}`.trim()}
                  </Text>
                </View>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Address:</Text>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldValue}>{getValue('address')}</Text>
              </View>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Date of Birth:</Text>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldValue}>{formatDate(getValue('dateOfBirth'))}</Text>
              </View>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Position Applied For:</Text>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldValue}>{getValue('positionApplied')}</Text>
              </View>
            </View>
          </View>
        </View>

          {/* Section 2: Informed Consent */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Informed Consent (to be completed by the applicant)</Text>
          <View style={styles.contentBox}>
            <Text style={styles.paragraph}>
              All applicants for positions at Infinity Supports WA are asked to sign that they have read and understood the content of the following statement and that they give their consent to use and disclose their personal information for the purposes of recruitment and selection.
            </Text>
            <Text style={styles.paragraph}>
                In accordance with the Privacy legislation, Infinity Supports WA is committed to ensuring the confidentiality and security of your personal information. The information you supply during the recruitment and selection process will be used solely for the purposes of assessing your suitability for employment in the specified position.
            </Text>
            <Text style={styles.paragraph}>
              In order to assist Infinity Supports WA and the assessment of your application, it may be necessary for us to disclose your personal information to certain third parties such as internal managers, your referees etc. and as may be required by law. We will only disclose your personal information to third parties for this purpose.
            </Text>
            <Text style={styles.paragraph}>
                Infinity Supports WA has a policy of retaining information relating to all applicants for a period of 6 months after the selection process for the position has been completed. During this period if another position for which you may be suitable arises, we may use your information in considering your suitability for such a position.
            </Text>
            <Text style={styles.paragraph}>
              In addition, Infinity Supports WA will, in accordance with the Corporations Act, seek information in relation to past performance and employment history of all candidates prior to appointment to any position. Therefore, reference checks with previous employers, police checks, WWCC and educational qualifications checks may be carried out prior to any offer of employment.
            </Text>
              
              {/* Consent Table */}
              <View style={styles.table}>
                {[
                  {
                    label: 'I consent to Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for the position stated above.',
                    key: 'consentRecruitment'
                  },
                  {
                    label: 'I consent Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for ANY OTHER suitable positions that may arise in the future.',
                    key: 'consentFuturePositions'
                  },
                  {
                    label: 'I consent to Infinity Supports WA making inquiries about me from my referees and any other person including colleagues on LinkedIn.',
                    key: 'consentRefereeInquiries'
                  },
                  {
                    label: 'I consent to Infinity Supports WA carrying out a police check.',
                    key: 'consentPoliceCheck'
                  },
                  {
                    label: 'I consent to Infinity Supports WA carrying out an educational qualifications check.',
                    key: 'consentEducationalCheck'
                  }
                ].map((item, index) => {
                  const value = getBoolean(item.key);
                  return (
                    <View key={index} style={styles.tableRow} wrap={false}>
                      <Text style={styles.tableCellQuestion}>{item.label}</Text>
                      {renderCheckboxWithLabel(value === true, 'Yes')}
                      {renderCheckboxWithLabel(value === false, 'No')}
        </View>
                  );
                })}
              </View>
            </View>

            {/* Signature - Outside contentBox for full width */}
            <View style={styles.signatureRow} wrap={false}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 8, width: 'auto' }]}>Applicant's Signature:</Text>
                <View style={styles.signatureBox}>
                  {(data?.signature || getValue('signature')) ? (
                    <Image 
                      src={data?.signature || getValue('signature')} 
                      style={styles.signatureImage} 
                    />
                  ) : (
                    <Text style={{ fontSize: 9, color: '#9ca3af' }}> </Text>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 8, width: 'auto' }]}>Date:</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.fieldValue}>
                    {formatDate(data?.signatureDate || getValue('signatureDate')) || ' '}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Spacer after signature for better separation */}
            <View style={{ height: 30, marginBottom: 15 }} />
        </View>

          {/* Section 3: Pre-Existing Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pre-Existing Injury or Disease Disclosure Statement (to be completed by the applicant)</Text>
            <View>
            <Text style={styles.paragraph}>
              Infinity Supports WA is committed to providing a safe working environment for all employees. As part of this it is our objective to ensure potential employees are not required to work in duties that they are not able to perform safely. As part of the application process for employment with Infinity Supports WA, we request you to disclose any pre-existing injury or disease which may be adversely affected by the performance of the inherent requirements of the position you have applied for – as described in the attached Position Description.
            </Text>
            <Text style={styles.paragraph}>
              You are required to disclose to Infinity Supports WA any pre-existing injury or disease that you have suffered of which you are aware, and could reasonably be expected to foresee, could be affected by the nature of this proposed employment.
            </Text>
            <Text style={styles.paragraph}>
              Should any alteration, change or rearrangement be necessary to enable you to effectively carry out the inherent requirements of the position, we also request that you disclose these requirements.
            </Text>
            <Text style={[styles.fieldLabel, { marginTop: 8, marginBottom: 6, width: 'auto' }]}>
              Please disclose in the space below any pre-existing injuries or diseases that you suffer from, or have suffered from, which could be affected by the nature of your proposed employment with Infinity Supports WA (attach a separate page if necessary).
            </Text>
            <View style={styles.textArea}>
              <Text style={styles.fieldValue}>{getValue('preExistingConditions')}</Text>
            </View>
          </View>
        </View>

          {/* Section 4: Disclosure Advice */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Disclosure Advice (to be completed by the applicant)</Text>
          <View style={styles.contentBox}>
            <Text style={styles.paragraph}>
              I confirm that I have read and understood the contents of the above information and state that I have disclosed all relevant information in relation to my health and physical ability to carry out the inherent requirements of this position.
            </Text>
            </View>
            
            {/* Signature - Outside contentBox for full width */}
            <View style={styles.signatureRow} wrap={false}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 8, width: 'auto' }]}>Applicant's Signature:</Text>
                <View style={styles.signatureBox}>
                  {(data?.disclosureAdviceSignature || getValue('disclosureAdviceSignature')) ? (
                    <Image 
                      src={data?.disclosureAdviceSignature || getValue('disclosureAdviceSignature')} 
                      style={styles.signatureImage} 
                    />
                  ) : (
                    <Text style={{ fontSize: 9, color: '#9ca3af' }}> </Text>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 8, width: 'auto' }]}>Date:</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.fieldValue}>
                    {formatDate(data?.disclosureAdviceDate || getValue('disclosureAdviceDate')) || ' '}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Spacer after signature for better separation */}
            <View style={{ height: 30, marginBottom: 15 }} />
        </View>

          {/* Section 5: General Health Questionnaire */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General Health Questionnaire (to be completed by the applicant)</Text>
          <View style={styles.contentBox}>
            <View style={styles.table}>
              {/* Table Header */}
                <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} wrap={false}>
                <Text style={[styles.tableHeader, { flex: 2.5 }]}>Question</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>Yes</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>No</Text>
                <Text style={[styles.tableHeader, { flex: 4 }]}>Details</Text>
              </View>
                
                {/* General Health Questions */}
              {generalHealthQuestions.map((question, index) => {
                const key = `generalHealth${index}`;
                const value = getBoolean(key);
                const details = getValue(`${key}Details`);
                return (
                    <View key={index} style={styles.tableRow} wrap={false}>
                    <Text style={styles.tableCellQuestion}>{question}</Text>
                      {renderCheckboxWithLabel(value === true, '')}
                      {renderCheckboxWithLabel(value === false, '')}
                      <Text style={styles.tableCellDetails}>{details || ''}</Text>
                  </View>
                );
              })}
                
                {/* Sub-heading */}
                <View style={styles.subHeadingRow} wrap={false}>
                  <Text style={styles.subHeadingText}>Do you, or have you ever, suffered from:</Text>
              </View>
                
                {/* Medical Conditions */}
              {medicalConditions.map((condition, index) => {
                const key = condition.toLowerCase().replace(/[^a-z0-9]/g, '') + 'Condition';
                const value = getBoolean(key);
                const details = getValue(`${key}Details`);
                return (
                    <View key={index} style={styles.tableRow} wrap={false}>
                    <Text style={styles.tableCellQuestion}>{condition}</Text>
                      {renderCheckboxWithLabel(value === true, '')}
                      {renderCheckboxWithLabel(value === false, '')}
                      <Text style={styles.tableCellDetails}>{details || ''}</Text>
                  </View>
                );
              })}
                
                {/* Sub-heading */}
                <View style={styles.subHeadingRow} wrap={false}>
                  <Text style={styles.subHeadingText}>Do you, or have you ever, had trouble with your:</Text>
                </View>
                
                {/* Body Parts */}
                {[
                  { key: 'backNeck', label: 'Back or neck' },
                  { key: 'wristElbow', label: 'Wrist or elbow' },
                  { key: 'anklesKnees', label: 'Ankles or knees' }
                ].map((item) => {
                  const value = getBoolean(item.key);
                  const details = getValue(`${item.key}Details`);
                  return (
                    <View key={item.key} style={styles.tableRow} wrap={false}>
                      <Text style={styles.tableCellQuestion}>{item.label}</Text>
                      {renderCheckboxWithLabel(value === true, '')}
                      {renderCheckboxWithLabel(value === false, '')}
                      <Text style={styles.tableCellDetails}>{details || ''}</Text>
                </View>
                  );
                })}
            </View>
          </View>
        </View>

          {/* Section 6: Medical History - Workplace */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Medical History - Workplace (to be completed by the applicant)</Text>
          <View style={styles.contentBox}>
            <View style={styles.table}>
              {/* Table Header */}
                <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]} wrap={false}>
                <Text style={[styles.tableHeader, { flex: 2.5 }]}>Question</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>Yes</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>No</Text>
                <Text style={[styles.tableHeader, { flex: 4 }]}>Details</Text>
              </View>
                
                {/* Workplace Questions */}
                {[
                  { key: 'workInjury', question: 'Have you ever injured yourself at work or suffered an industrial disease?' },
                  { key: 'ppeDifficulties', question: 'Have you ever had difficulties wearing PPE?' },
                  { key: 'hazardousMaterials', question: 'Have you ever worked with hazardous materials?' }
                ].map((item) => {
                  const value = getBoolean(item.key);
                  const details = getValue(`${item.key}Details`);
                  return (
                    <View key={item.key} style={styles.tableRow} wrap={false}>
                      <Text style={styles.tableCellQuestion}>{item.question}</Text>
                      {renderCheckboxWithLabel(value === true, '')}
                      {renderCheckboxWithLabel(value === false, '')}
                      <Text style={styles.tableCellDetails}>{details || ''}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>

          {/* Section 7: Declaration */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionHeader}>Declaration (to be completed by the applicant)</Text>
            <View>
              <Text style={styles.paragraph}>
              I have not knowingly withheld any information relevant to the pre-employment medical examination. I declare that the information provided in this form is true and correct.
            </Text>
              <View style={styles.signatureRow} wrap={false}>
              <View style={{ flex: 2 }}>
                  <Text style={[styles.fieldLabel, { marginBottom: 8, width: 'auto' }]}>Applicant's Signature:</Text>
                <View style={styles.signatureBox}>
                    {(data?.declarationSignature || getValue('declarationSignature')) ? (
                    <Image 
                      src={data?.declarationSignature || getValue('declarationSignature')} 
                      style={styles.signatureImage} 
                    />
                    ) : (
                      <Text style={{ fontSize: 9, color: '#9ca3af' }}> </Text>
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { marginBottom: 8, width: 'auto' }]}>Date:</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.fieldValue}>
                      {formatDate(data?.declarationDate || getValue('declarationDate')) || ' '}
                  </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Fixed Footer - appears on all pages */}
        {(footerWebsite || footerId || footerDate) && (
          <View style={styles.footer} fixed>
            {footerWebsite && <Text style={styles.footerText}>Website: {footerWebsite}</Text>}
            {footerId && <Text style={styles.footerText}>{footerId}</Text>}
            {footerDate && <Text style={styles.footerText}>Review Date: {footerDate}</Text>}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PreEmploymentMedicalPDF;
