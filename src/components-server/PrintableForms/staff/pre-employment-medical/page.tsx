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
    paddingTop: 75, // Space for fixed header
    paddingBottom: 65, // Increased to prevent content from overlapping with footer (footer is 40px + 20px bottom = 60px, so 65px padding ensures clearance)
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    position: 'absolute',
    top: 25,
    left: 40,
    right: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLogo: {
    width: 140,
    height: 45,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTop: '1 solid #e5e7eb',
    fontSize: 9,
    height: 40,
    backgroundColor: '#ffffff',
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
  },
  section: {
    marginBottom: 12,
    breakInside: 'auto', // Allow sections to break across pages to use space better
    minHeight: 0, // Don't force minimum height
  },
  sectionHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 6,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    breakInside: 'avoid', // Keep header with first row of content
    breakAfter: 'avoid',
  },
  declarationHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 6,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    breakInside: 'avoid', // Keep header with content
    breakAfter: 'avoid', // Keep header with content below
  },
  contentBox: {
    border: '1 solid #d1d5db',
    padding: 8,
    marginBottom: 10,
    breakInside: 'auto', // Allow content boxes to break across pages
    minHeight: 0, // Don't force minimum height - let content determine
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  fieldLabel: {
    width: 140,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    paddingRight: 8,
    marginBottom: 4, // Add spacing between label and box
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    minHeight: 12,
    wrap: true, // Allow text to wrap for longer content like addresses
  },
  fieldBox: {
    border: '1 solid #9ca3af',
    minHeight: 32, // Increased height for better visibility
    padding: 8, // Increased padding
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align text to top-left
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5, // Better readability like client forms
    marginBottom: 8, // Better spacing between paragraphs
    color: '#111827',
    breakInside: 'auto', // Allow paragraphs to break if needed
    wrap: true, // Allow text to wrap properly
    orphans: 2, // Keep at least 2 lines together at bottom of page
    widows: 2, // Keep at least 2 lines together at top of page
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #d1d5db',
    breakInside: 'auto', // Allow table rows to break if needed (but try to keep together)
    minHeight: 20, // Minimum row height
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 9,
    padding: 4,
    border: '1 solid #d1d5db',
  },
  tableCell: {
    fontSize: 9,
    padding: 6,
    border: '1 solid #d1d5db',
    flex: 1,
  },
  tableCellQuestion: {
    fontSize: 9,
    padding: 4,
    border: '1 solid #d1d5db',
    flex: 2.5,
    wrap: true, // Allow question text to wrap
  },
  tableCellYesNo: {
    fontSize: 9,
    padding: 2,
    border: '1 solid #d1d5db',
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellDetails: {
    fontSize: 9,
    padding: 4,
    border: '1 solid #d1d5db',
    flex: 4,
    wrap: true,
    minHeight: 15, // Allow text to wrap and use space
  },
  checkbox: {
    width: 10,
    height: 10,
    border: '1 solid #000000',
    marginRight: 4,
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    border: '1 solid #000000',
    marginRight: 4,
    backgroundColor: '#87ceeb',
  },
  textArea: {
    fontSize: 9,
    lineHeight: 1.5, // Better readability
    padding: 10, // More padding like client forms
    border: '1 solid #d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    minHeight: 60, // Better minimum height for visibility
    marginBottom: 10,
    marginTop: 4, // Space above text area
    breakInside: 'auto', // Allow text area to break across pages if needed
    wrap: true, // Allow text to wrap properly
  },
  declarationSection: {
    marginBottom: 15,
    breakInside: 'avoid', // Keep entire declaration section together - move to next page if not enough space
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
    minHeight: 0, // Don't force height
    // Force the entire section to stay together
    flexShrink: 0,
  },
  declarationContentBox: {
    // No border - removed outer box as requested
    padding: 0, // No padding needed without border
    marginBottom: 10,
    breakInside: 'avoid', // Keep declaration content box together
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
    minHeight: 0, // Don't force height
    flexShrink: 0, // Prevent shrinking
  },
  educationalQualificationsSection: {
    marginBottom: 15,
    breakInside: 'avoid', // Keep entire section together - move to next page if not enough space
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
    minHeight: 0,
    flexShrink: 0,
  },
  educationalQualificationsContentBox: {
    // No border - removed outer box as requested
    padding: 0, // No padding needed without border
    marginBottom: 10,
    breakInside: 'avoid', // Keep content box together
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
    minHeight: 0,
    flexShrink: 0,
  },
  declarationParagraph: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 12, // Increased margin for spacing after paragraph
    color: '#111827',
    breakInside: 'avoid', // Keep paragraph with signature section
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
    flexShrink: 0, // Prevent shrinking
  },
  declarationWrapper: {
    breakInside: 'avoid', // Wrapper to ensure everything stays together - CRITICAL
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
    minHeight: 0,
    flexShrink: 0,
    // Force page break before if not enough space
    breakBefore: 'auto', // Allow page break before if needed
  },
  signatureRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    breakInside: 'avoid', // Keep signature row together
    pageBreakInside: 'avoid', // Alternative syntax (like client forms)
  },
  signatureBox: {
    border: '1 solid #9ca3af',
    minHeight: 80,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  signatureImage: {
    maxHeight: 70,
    maxWidth: '100%',
    objectFit: 'contain',
  },
  dateBox: {
    border: '1 solid #9ca3af',
    minHeight: 28,
    padding: 6,
    flex: 1,
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
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  // Render header - using 'fixed' prop so it appears on all pages (including dynamically created ones)
  const renderHeader = () => {
    if (!images?.infinityLogo) return null;
    return (
      <View style={styles.header} fixed>
        <Image src={images.infinityLogo} style={styles.headerLogo} />
      </View>
    );
  };

  // Render footer - using 'fixed' prop so it appears on all pages (including dynamically created ones)
  const renderFooter = () => {
    const footerId = settings?.footerId || settings?.pre_employment_medical_form_id;
    const footerDate = settings?.footerDate || settings?.review_date;
    const footerWebsite = settings?.footerWebsite || settings?.company_website;

    if (!footerId && !footerDate && !footerWebsite) return null;

    return (
      <View style={styles.footer} fixed>
        {footerWebsite && <Text style={styles.footerText}>Website: {footerWebsite}</Text>}
        {footerId && <Text style={styles.footerText}>{footerId}</Text>}
        {footerDate && <Text style={styles.footerText}>Review Date: {footerDate}</Text>}
      </View>
    );
  };

  // Render checkbox
  const renderCheckbox = (checked: boolean | null) => {
    return (
      <View style={checked ? styles.checkboxChecked : styles.checkbox}>
        {checked && <Text style={{ fontSize: 8, color: '#000000' }}>✓</Text>}
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

  // Body Parts
  const bodyParts = [
    'Back',
    'Neck',
    'Shoulders',
    'Arms',
    'Hands',
    'Fingers',
    'Hips',
    'Legs',
    'Feet',
    'Joints',
  ];

  return (
    <Document>
      {/* PAGE 1: Applicant Details and Consent */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Applicant Details</Text>
          <View style={styles.contentBox}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Full Name:</Text>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldValue}>{getValue('fullName') || `${staff?.firstName || ''} ${staff?.surname || ''}`.trim()}</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Informed Consent (to be completed by the applicant)</Text>
          <View style={styles.contentBox}>
            <Text style={styles.paragraph}>
              I consent to Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for the position stated above.
            </Text>
            <Text style={styles.paragraph}>
              Infinity Supports WA is committed to privacy legislation and will maintain the confidentiality and security of your personal information. Your personal information will be used solely for the purpose of assessing your suitability for the position you have applied for.
            </Text>
            <Text style={styles.paragraph}>
              Your personal information may be disclosed to third parties (e.g., internal managers, referees) or as required by law, strictly for the purpose of assessing your application.
            </Text>
            <Text style={styles.paragraph}>
              Infinity Supports WA will retain your application information for 6 months after the selection process is completed. Your information may be used to consider your suitability for other positions that may arise.
            </Text>
            <Text style={styles.paragraph}>
              In accordance with the Corporations Act, Infinity Supports WA will seek information on past performance and employment history, including reference checks with previous employers, police checks, WWCC (Working With Children Check), and educational qualifications checks, prior to any offer of employment.
            </Text>
          </View>
        </View>

        {renderFooter()}
      </Page>

      {/* PAGE 2: Educational Qualifications Check and Pre-Existing Conditions - Allow flow if space available */}
      <Page size="A4" style={styles.page} wrap>
        {renderHeader()}

        <View style={styles.educationalQualificationsSection}>
          <Text style={styles.sectionHeader}>Educational Qualifications Check</Text>
          <View style={styles.educationalQualificationsContentBox}>
            {/* Consent text - no box around it */}
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.paragraph}>
                I consent to Infinity Supports WA carrying out an educational qualifications check.
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                {renderCheckbox(getBoolean('consentEducationalCheck') === true)}
                <Text style={styles.fieldValue}>Yes</Text>
                {renderCheckbox(getBoolean('consentEducationalCheck') === false)}
                <Text style={styles.fieldValue}>No</Text>
              </View>
            </View>
            {/* Signature and Date fields - each has its own box */}
            <View style={styles.signatureRow}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 10, width: 'auto' }]}>Applicant's Signature:</Text>
                <View style={styles.signatureBox}>
                  {(data?.signature || getValue('signature')) && (
                    <Image 
                      src={data?.signature || getValue('signature')} 
                      style={styles.signatureImage} 
                    />
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 10, width: 'auto' }]}>Date:</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.fieldValue}>
                    {formatDate(data?.signatureDate || getValue('signatureDate'))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pre-Existing Injury or Disease Disclosure Statement (to be completed by the applicant)</Text>
          {/* Paragraphs - no box around them, just plain text like client forms */}
          <View style={{ padding: 0, marginBottom: 10 }}>
            <Text style={styles.paragraph}>
              Infinity Supports WA is committed to providing a safe working environment for all employees. As part of this it is our objective to ensure potential employees are not required to work in duties that they are not able to perform safely. As part of the application process for employment with Infinity Supports WA, we request you to disclose any pre-existing injury or disease which may be adversely affected by the performance of the inherent requirements of the position you have applied for – as described in the attached Position Description.
            </Text>
            <Text style={styles.paragraph}>
              You are required to disclose to Infinity Supports WA any pre-existing injury or disease that you have suffered of which you are aware, and could reasonably be expected to foresee, could be affected by the nature of this proposed employment.
            </Text>
            <Text style={styles.paragraph}>
              Should any alteration, change or rearrangement be necessary to enable you to effectively carry out the inherent requirements of the position, we also request that you disclose these requirements.
            </Text>
            {/* Disclosure instruction */}
            <Text style={[styles.fieldLabel, { marginTop: 8, marginBottom: 6, width: 'auto' }]}>
              (Please disclose in the space below any pre-existing injuries or diseases that you suffer from, or have suffered from, which could be affected by the nature of your proposed employment with Infinity Supports WA):
            </Text>
            {/* Text area for disclosure - has its own box */}
            <View style={styles.textArea}>
              <Text style={styles.fieldValue}>{getValue('preExistingConditions')}</Text>
            </View>
          </View>
        </View>

        {/* Spacer to ensure content doesn't get too close to footer */}
        <View style={{ height: 10 }} />

        {renderFooter()}
      </Page>

      {/* PAGE 4: General Health and Medical Questions */}
      <Page size="A4" style={styles.page} wrap>
        {renderHeader()}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General Health Questions</Text>
          <View style={styles.contentBox}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                <Text style={[styles.tableHeader, { flex: 2.5 }]}>Question</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>Yes</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>No</Text>
                <Text style={[styles.tableHeader, { flex: 4 }]}>Details</Text>
              </View>
              {/* Table Rows */}
              {generalHealthQuestions.map((question, index) => {
                const key = `generalHealth${index}`;
                const value = getBoolean(key);
                const details = getValue(`${key}Details`);
                return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellQuestion}>{question}</Text>
                    <View style={styles.tableCellYesNo}>
                      {renderCheckbox(value === true)}
                    </View>
                    <View style={styles.tableCellYesNo}>
                      {renderCheckbox(value === false)}
                    </View>
                    <Text style={styles.tableCellDetails}>{details || ''}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>General Medical Questions</Text>
          <View style={styles.contentBox}>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                <Text style={[styles.tableHeader, { flex: 2.5 }]}>Question</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>Yes</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>No</Text>
                <Text style={[styles.tableHeader, { flex: 4 }]}>Details</Text>
              </View>
              {/* Wrist or elbow */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCellQuestion}>Wrist or elbow</Text>
                <View style={styles.tableCellYesNo}>
                  {renderCheckbox(getBoolean('wristElbow') === true)}
                </View>
                <View style={styles.tableCellYesNo}>
                  {renderCheckbox(getBoolean('wristElbow') === false)}
                </View>
                <Text style={styles.tableCellDetails}>{getValue('wristElbowDetails') || ''}</Text>
              </View>
              {/* Ankles or knees */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCellQuestion}>Ankles or knees</Text>
                <View style={styles.tableCellYesNo}>
                  {renderCheckbox(getBoolean('anklesKnees') === true)}
                </View>
                <View style={styles.tableCellYesNo}>
                  {renderCheckbox(getBoolean('anklesKnees') === false)}
                </View>
                <Text style={styles.tableCellDetails}>{getValue('anklesKneesDetails') || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {renderFooter()}
      </Page>

      {/* PAGE 5: Medical Conditions */}
      <Page size="A4" style={styles.page} wrap>
        {renderHeader()}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Medical Conditions</Text>
          <View style={styles.contentBox}>
            <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Do you, or have you ever, suffered from:</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                <Text style={[styles.tableHeader, { flex: 2.5 }]}>Condition</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>Yes</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>No</Text>
                <Text style={[styles.tableHeader, { flex: 4 }]}>Details</Text>
              </View>
              {/* Table Rows */}
              {medicalConditions.map((condition, index) => {
                const key = condition.toLowerCase().replace(/[^a-z0-9]/g, '') + 'Condition';
                const value = getBoolean(key);
                const details = getValue(`${key}Details`);
                return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellQuestion}>{condition}</Text>
                    <View style={styles.tableCellYesNo}>
                      {renderCheckbox(value === true)}
                    </View>
                    <View style={styles.tableCellYesNo}>
                      {renderCheckbox(value === false)}
                    </View>
                    <Text style={styles.tableCellDetails}>{details || ''}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {renderFooter()}
      </Page>

      {/* PAGE 6: Body Parts Issues */}
      <Page size="A4" style={styles.page} wrap>
        {renderHeader()}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Body Parts Issues</Text>
          <View style={styles.contentBox}>
            <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Do you, or have you ever, had trouble with your:</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, { backgroundColor: '#f3f4f6' }]}>
                <Text style={[styles.tableHeader, { flex: 2.5 }]}>Body Part</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>Yes</Text>
                <Text style={[styles.tableHeader, { flex: 0.5 }]}>No</Text>
                <Text style={[styles.tableHeader, { flex: 4 }]}>Details</Text>
              </View>
              {/* Table Rows */}
              {bodyParts.map((bodyPart, index) => {
                const key = bodyPart.toLowerCase().replace(/[^a-z0-9]/g, '') + 'Issue';
                const value = getBoolean(key);
                const details = getValue(`${key}Details`);
                return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCellQuestion}>{bodyPart}</Text>
                    <View style={styles.tableCellYesNo}>
                      {renderCheckbox(value === true)}
                    </View>
                    <View style={styles.tableCellYesNo}>
                      {renderCheckbox(value === false)}
                    </View>
                    <Text style={styles.tableCellDetails}>{details || ''}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {renderFooter()}
      </Page>

      {/* PAGE 7: Declaration - Separate page to ensure it stays together */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}

        {/* Declaration section - on its own page to prevent any breaking */}
        <View style={styles.declarationSection}>
          <Text style={styles.declarationHeader}>Declaration (to be completed by the applicant)</Text>
          <View style={styles.declarationContentBox}>
            {/* Paragraph text - no box around it */}
            <Text style={styles.declarationParagraph}>
              I have not knowingly withheld any information relevant to the pre-employment medical examination. I declare that the information provided in this form is true and correct.
            </Text>
            {/* Signature and Date fields - each has its own box */}
            <View style={styles.signatureRow}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 10, width: 'auto' }]}>Applicant's Signature:</Text>
                <View style={styles.signatureBox}>
                  {(data?.declarationSignature || getValue('declarationSignature')) && (
                    <Image 
                      src={data?.declarationSignature || getValue('declarationSignature')} 
                      style={styles.signatureImage} 
                    />
                  )}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { marginBottom: 10, width: 'auto' }]}>Date:</Text>
                <View style={styles.dateBox}>
                  <Text style={styles.fieldValue}>
                    {formatDate(data?.declarationDate || getValue('declarationDate'))}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {renderFooter()}
      </Page>
    </Document>
  );
};

export default PreEmploymentMedicalPDF;

