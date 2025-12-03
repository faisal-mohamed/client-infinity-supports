import React from 'react';
import { View, Text, StyleSheet, Svg, Rect, Path } from '@react-pdf/renderer';
import BasePDFLayout, { PDFMeta } from '@/components-server/pdf/layout/BasePDFLayout';
import PDFSignatureBlock from '@/components-server/pdf/elements/PDFSignatureBlock';

interface PreEmploymentMedicalPDFProps {
  data: any;
}

type YesNoValue = 'yes' | 'no' | null;

type BooleanLike = boolean | string | null | undefined;

const consents = [
  {
    key: 'consentRecruitment',
    fallback: 'consent1',
    label:
      'I consent to Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for the position stated above.',
  },
  {
    key: 'consentFuturePositions',
    fallback: 'consent2',
    label:
      'I consent Infinity Supports WA using and disclosing my personal information for the purposes of recruitment and selection for ANY OTHER suitable positions that may arise in the future.',
  },
  {
    key: 'consentRefereeInquiries',
    fallback: 'consent3',
    label:
      'I consent to Infinity Supports WA making inquiries about me from my referees and any other person including colleagues on Linkedin.',
  },
  {
    key: 'consentPoliceCheck',
    fallback: 'consent4',
    label: 'I consent to Infinity Supports WA carrying out a police check.',
  },
];

const generalHealthQuestions = [
  'Are you being treated by any Doctor for any illness?',
  'Have you ever broken any bones?',
  'Are you taking regular medication?',
  'Have you ever been immunised against tetanus?',
  'Have you ever had any operations?',
];

const specificBodyParts = [
  { label: 'Wrist or elbow', key: 'wristElbow' },
  { label: 'Ankles or knees', key: 'anklesKnees' },
];

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

const troubleBodyParts = ['Back', 'Neck', 'Shoulders', 'Arms', 'Hands', 'Hips', 'Legs', 'Feet'];

const workplaceQuestions = [
  {
    key: 'workInjury',
    label: 'Have you ever injured yourself at work or suffered an industrial disease?',
  },
  {
    key: 'ppeDifficulties',
    label: 'Have you ever had difficulties wearing PPE?',
  },
  {
    key: 'hazardousMaterials',
    label: 'Have you ever worked with hazardous materials?',
  },
];

const PreEmploymentMedicalPDF: React.FC<PreEmploymentMedicalPDFProps> = ({ data }) => {
  const metaSource = (data?.data as any)?.meta || data?.meta;
  const meta: PDFMeta = {
    website: metaSource?.website || 'infinitysupportswa.org',
    version: metaSource?.formId || 'SF014',
    reviewDate: metaSource?.reviewDate || '01/03/2025',
  };

  const logoUrl = data?.logoDataUrl || '/infinity_logo.png';
  const formData = data?.data || {};
  const staff = data?.staff || {};
  const staffName = formData.fullName || `${staff.firstName || ''} ${staff.surname || ''}`.trim();
  const applicantSignature = formData.signature || data?.staffSignature;
  const applicantSignatureDate = formData.signatureDate || data?.staffSignedAt;
  const declarationSignature = formData.declarationSignature || applicantSignature;
  const declarationDate = formData.declarationDate || applicantSignatureDate;

  return (
    <BasePDFLayout title="Pre-Employment Medical Examination Consent Form" logo={logoUrl} meta={meta}>
      <View style={styles.container}>
        {renderApplicantDetails(formData, staffName)}
        {renderInformedConsent(formData)}
        {renderEducationalCheck(formData, applicantSignature, applicantSignatureDate)}
        {renderPreExistingInjury(formData)}
        {renderDisclosureAdvice(formData)}
        {renderGeneralHealth(formData)}
        {renderBodyPartConcerns(formData)}
        {renderMedicalHistoryWorkplace(formData)}
        {renderDeclaration(formData, declarationSignature, declarationDate)}
      </View>
    </BasePDFLayout>
  );
};

const renderApplicantDetails = (formData: any, staffName: string) => (
  <View style={styles.section} wrap={false}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>Applicant Details</Text>
    </View>
    <View style={styles.table}>
      {renderTableRow([
        { text: 'Full Name', bold: true, width: 0.5 },
        { text: staffName || '', width: 0.5 },
      ])}
      {renderTableRow([
        { text: 'Address', bold: true, width: 0.5 },
        { text: formData.address || '', width: 0.5 },
      ])}
      {renderTableRow([
        { text: 'Date of Birth', bold: true, width: 0.5 },
        { text: formData.dateOfBirth || '', width: 0.5 },
      ])}
      {renderTableRow([
        { text: 'Position Applied For', bold: true, width: 0.5 },
        { text: formData.positionApplied || '', width: 0.5 },
      ])}
    </View>
  </View>
);

const renderInformedConsent = (formData: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>Informed Consent (to be completed by the applicant)</Text>
    </View>
    <View style={styles.sectionBody}>
      {informedConsentParagraphs.map((paragraph, index) => (
        <Text key={`consent-text-${index}`} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
      <View style={[styles.table, { marginTop: 8 }]}>
        {renderTableRow([
          { text: 'Consent Statement', bold: true, width: 0.7 },
          { text: 'Yes', bold: true, width: 0.15, align: 'center' },
          { text: 'No', bold: true, width: 0.15, align: 'center' },
        ], true)}
        {consents.map(({ key, fallback, label }) => {
          const value = getYesNoValue(formData[key], formData[fallback]);
          return renderTableRow([
            { text: label, width: 0.7 },
            { content: renderYesNoIndicator(value === 'yes'), width: 0.15, align: 'center' },
            { content: renderYesNoIndicator(value === 'no'), width: 0.15, align: 'center' },
          ]);
        })}
      </View>
    </View>
  </View>
);

const renderEducationalCheck = (formData: any, signature?: string | null, signatureDate?: string | null) => (
  <View style={styles.section}>
    <View style={styles.sectionHeaderLight}>
      <Text style={styles.sectionHeaderTextLight}>Educational Qualifications Check</Text>
    </View>
    <View style={styles.sectionBody}>
      <View style={styles.table}>
        {renderTableRow([
          { text: 'I consent to Infinity Supports WA carrying out an educational qualifications check.', width: 0.7 },
          { content: renderYesNoIndicator(getYesNoValue(formData.consentEducationalCheck, formData.educationalCheck) === 'yes'), width: 0.15, align: 'center' },
          { content: renderYesNoIndicator(getYesNoValue(formData.consentEducationalCheck, formData.educationalCheck) === 'no'), width: 0.15, align: 'center' },
        ], true)}
      </View>
      <PDFSignatureBlock label="Applicant's Signature" image={signature} date={signatureDate} />
    </View>
  </View>
);

const renderPreExistingInjury = (formData: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        Pre-Existing Injury or Disease Disclosure Statement (to be completed by the applicant)
      </Text>
    </View>
    <View style={styles.sectionBody}>
      {preExistingParagraphs.map((paragraph, index) => (
        <Text key={`pre-existing-${index}`} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
      <Text style={[styles.paragraph, { marginTop: 8 }]}>Please disclose any pre-existing injuries or diseases:</Text>
      <Text style={styles.multilineField}>{formData.preExistingConditions || ''}</Text>
    </View>
  </View>
);

const renderDisclosureAdvice = (formData: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeaderLight}>
      <Text style={styles.sectionHeaderTextLight}>Disclosure Advice (to be completed by the applicant)</Text>
    </View>
    <View style={styles.sectionBody}>
      <Text style={styles.paragraph}>
        I confirm that I have read and understood the content of the above information and state that I have disclosed all relevant
        information in relation to my health and physical ability to carry out the inherent requirements of this position.
      </Text>
      <PDFSignatureBlock label="Applicant's Signature" image={formData.declarationSignature} date={formData.declarationDate} />
    </View>
  </View>
);

const renderGeneralHealth = (formData: any) => (
  <View style={styles.section} wrap={true}>
    <View style={styles.sectionHeader} wrap={false}>
      <Text style={styles.sectionHeaderText}>General Health Questionnaire (to be completed by the applicant)</Text>
    </View>
    <View style={styles.sectionBody} wrap={true}>
      <View style={styles.table} wrap={true}>
        {renderTableRow([
          { text: 'Question', bold: true, width: 0.46 },
          { text: 'Yes', bold: true, width: 0.12, align: 'center' },
          { text: 'No', bold: true, width: 0.12, align: 'center' },
          { text: 'Details', bold: true, width: 0.3 },
        ], true)}
        {generalHealthQuestions.map((question, index) => {
          const key = `generalHealth${index}`;
          const value = getBooleanValue(formData[key], formData[`${key}`]);
          const details = formData[`${key}Details`] || '';
          return renderTableRow([
            { text: question, width: 0.46 },
            { content: renderYesNoIndicator(value === true), width: 0.12, align: 'center' },
            { content: renderYesNoIndicator(value === false), width: 0.12, align: 'center' },
            { text: value === true ? details : '', width: 0.3 },
          ]);
        })}
        {specificBodyParts.map(({ label, key }) => {
          const value = getBooleanValue(formData[key], formData[key]);
          const details = formData[`${key}Details`] || '';
          return renderTableRow([
            { text: label, width: 0.46 },
            { content: renderYesNoIndicator(value === true), width: 0.12, align: 'center' },
            { content: renderYesNoIndicator(value === false), width: 0.12, align: 'center' },
            { text: value === true ? details : '', width: 0.3 },
          ]);
        })}
        {renderTableRow([{ text: 'Do you, or have you ever, suffered from:', width: 1, bold: true }], false, styles.tableRowHighlight)}
        {medicalConditions.map((label) => {
          const key = label.toLowerCase().replace(/[^a-z0-9]/g, '');
          const value = getBooleanValue(formData[`${key}Condition`], formData[key]);
          const details = formData[`${key}ConditionDetails`] || formData[`${key}Details`] || '';
          return renderTableRow([
            { text: label, width: 0.46 },
            { content: renderYesNoIndicator(value === true), width: 0.12, align: 'center' },
            { content: renderYesNoIndicator(value === false), width: 0.12, align: 'center' },
            { text: value === true ? details : '', width: 0.3 },
          ]);
        })}
      </View>
    </View>
  </View>
);

const renderBodyPartConcerns = (formData: any) => (
  <View style={styles.section} wrap={true}>
    <View style={styles.sectionHeader} wrap={false}>
      <Text style={styles.sectionHeaderText}>Do you, or have you ever, had trouble with your:</Text>
    </View>
    <View style={styles.sectionBody} wrap={true}>
      <View style={styles.table} wrap={true}>
        {renderTableRow([
          { text: 'Body Part', bold: true, width: 0.46 },
          { text: 'Yes', bold: true, width: 0.12, align: 'center' },
          { text: 'No', bold: true, width: 0.12, align: 'center' },
          { text: 'Details', bold: true, width: 0.3 },
        ], true)}
        {troubleBodyParts.map((label) => {
          const key = `${label.toLowerCase().replace(/[^a-z0-9]/g, '')}Issue`;
          const value = getBooleanValue(formData[key], formData[label]);
          const details = formData[`${key}Details`] || formData[`${label}Details`] || '';
          return renderTableRow([
            { text: label, width: 0.46 },
            { content: renderYesNoIndicator(value === true), width: 0.12, align: 'center' },
            { content: renderYesNoIndicator(value === false), width: 0.12, align: 'center' },
            { text: value === true ? details : '', width: 0.3 },
          ]);
        })}
      </View>
    </View>
  </View>
);

const renderMedicalHistoryWorkplace = (formData: any) => (
  <View style={styles.section} wrap={true}>
    <View style={styles.sectionHeader} wrap={false}>
      <Text style={styles.sectionHeaderText}>Medical History - Workplace (to be completed by the applicant)</Text>
    </View>
    <View style={styles.sectionBody} wrap={true}>
      <View style={styles.table} wrap={true}>
        {renderTableRow([
          { text: 'Question', bold: true, width: 0.5 },
          { text: 'Yes', bold: true, width: 0.15, align: 'center' },
          { text: 'No', bold: true, width: 0.15, align: 'center' },
          { text: 'Details', bold: true, width: 0.2 },
        ], true)}
        {workplaceQuestions.map(({ key, label }) => {
          const value = getBooleanValue(formData[key], formData[key]);
          const details = formData[`${key}Details`] || '';
          return renderTableRow([
            { text: label, width: 0.5 },
            { content: renderYesNoIndicator(value === true), width: 0.15, align: 'center' },
            { content: renderYesNoIndicator(value === false), width: 0.15, align: 'center' },
            { text: value === true ? details : '', width: 0.2 },
          ]);
        })}
      </View>
    </View>
  </View>
);

const renderDeclaration = (formData: any, signature?: string | null, signedAt?: string | null) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>Declaration (to be completed by the applicant)</Text>
    </View>
    <View style={styles.sectionBody}>
      <Text style={styles.paragraph}>
        I have not knowingly withheld any information relevant to the pre-employment medical examination. I declare that the
        information provided in this form is true and correct.
      </Text>
      <PDFSignatureBlock label="Applicant's Signature" image={signature || formData.declarationSignature} date={signedAt || formData.declarationDate} />
    </View>
  </View>
);

// SVG-based tick mark for Yes/No indicators in table cells
const renderYesNoIndicator = (selected: boolean) => (
  <View style={styles.checkboxContainer}>
    <Svg width={12} height={12} style={styles.checkboxSvg}>
      <Rect
        x={0.5}
        y={0.5}
        width={11}
        height={11}
        rx={2}
        ry={2}
        stroke="#1d4ed8"
        strokeWidth={1}
        fill={selected ? '#1d4ed8' : '#ffffff'}
      />
      {selected && (
        <Path
          d="M3 6.3 L5.2 8.5 L9 3.8"
          stroke="#ffffff"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  </View>
);

const informedConsentParagraphs = [
  'All applicants for positions at Infinity Supports WA are asked to sign that they have read and understood the content of the following statement and that they give their consent to use and disclose their personal information for the purposes of recruitment and selection.',
  'In accordance with the Privacy legislation, Infinity Supports WA is committed to ensuring the confidentiality and security of your personal information. The information you supply during the recruitment and selection process will be used solely for the purposes of assessing your suitability for employment in the specified position.',
  'In order to assist Infinity Supports WA and the assessment of your application, it may be necessary for us to disclose your personal information to certain third parties such as internal managers, your referees etc. and as may be required by law. We will only disclose your personal information to third parties for this purpose.',
  'Infinity Supports WA has a policy of retaining information relating to all applicants for a period of 6 months after the selection process for the position has been completed. During this period if another position for which you may be suitable arises, we may use your information in considering your suitability for such a position.',
  'In addition, Infinity Supports WA will, in accordance with the Corporations Act, seek information in relation to past performance and employment history of all candidates prior to appointment to any position. Therefore, reference checks with previous employers, police checks, WWCC and educational qualifications checks may be carried out prior to any offer of employment.',
];

const preExistingParagraphs = [
  'Infinity Supports WA is committed to providing a safe working environment for all employees. As part of this it is our objective to ensure potential employees are not required to work in duties that they are not able to perform safely. As part of the application process for employment with Infinity Supports WA, we request you to disclose any pre-existing injury or disease which may be adversely affected by the performance of the inherent requirements of the position you have applied for – as described in the attached Position Description.',
  'You are required to disclose to Infinity Supports WA any pre-existing injury or disease that you have suffered of which you are aware, and could reasonably be expected to foresee, could be affected by the nature of this proposed employment.',
  'Should any alteration, change or rearrangement be necessary to enable you to effectively carry out the inherent requirements of the position, we also request that you disclose these requirements.',
];

interface TableCellConfig {
  text?: string;
  content?: React.ReactNode;
  width: number;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
}

const renderTableRow = (cells: TableCellConfig[], header = false, rowStyle?: any) => (
  <View style={[styles.tableRow, rowStyle]} wrap={false}>
    {cells.map((cell, index) => (
      <View
        key={index}
        style={[
          styles.tableCell,
          {
            flex: cell.width,
            justifyContent: cell.align === 'center' ? 'center' : 'flex-start',
            alignItems: cell.align === 'center' ? 'center' : 'flex-start',
          },
        ]}
      >
        {cell.content ? (
          cell.content
        ) : (
          <Text
            style={[
              styles.tableCellText,
              ...(header ? [styles.tableHeaderText] : []),
              ...(cell.bold ? [styles.bold] : []),
              ...(cell.align === 'center' ? [styles.textCenter] : []),
            ]}
          >
            {cell.text}
          </Text>
        )}
      </View>
    ))}
  </View>
);

const getYesNoValue = (primary: BooleanLike, fallback: BooleanLike): YesNoValue => {
  if (typeof primary === 'string') {
    if (primary.toLowerCase() === 'yes') return 'yes';
    if (primary.toLowerCase() === 'no') return 'no';
  }
  if (typeof primary === 'boolean') {
    return primary ? 'yes' : 'no';
  }
  if (typeof fallback === 'string') {
    if (fallback.toLowerCase() === 'yes') return 'yes';
    if (fallback.toLowerCase() === 'no') return 'no';
  }
  if (typeof fallback === 'boolean') {
    return fallback ? 'yes' : 'no';
  }
  return null;
};

const getBooleanValue = (primary: BooleanLike, fallback: BooleanLike): boolean | null => {
  if (typeof primary === 'boolean') return primary;
  if (typeof primary === 'string') {
    if (primary.toLowerCase() === 'yes') return true;
    if (primary.toLowerCase() === 'no') return false;
  }
  if (typeof fallback === 'boolean') return fallback;
  if (typeof fallback === 'string') {
    if (fallback.toLowerCase() === 'yes') return true;
    if (fallback.toLowerCase() === 'no') return false;
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  section: {
    border: '1 solid #d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sectionHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeaderLight: {
    backgroundColor: '#e5eefc',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sectionHeaderTextLight: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionBody: {
    padding: 12,
    gap: 6,
  },
  paragraph: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.5,
  },
  table: {
    width: '100%',
    borderTop: '1 solid #d1d5db',
    borderLeft: '1 solid #d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowHighlight: {
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    borderRight: '1 solid #d1d5db',
    borderBottom: '1 solid #d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    minHeight: 24,
  },
  tableCellText: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
  },
  multilineField: {
    minHeight: 60,
    border: '1 solid #d1d5db',
    borderRadius: 4,
    padding: 8,
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.4,
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSvg: {
    marginTop: 1,
  },
});

export default PreEmploymentMedicalPDF;
