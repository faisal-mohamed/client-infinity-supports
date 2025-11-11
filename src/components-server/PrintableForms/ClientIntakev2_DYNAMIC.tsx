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
    paddingTop: 90,      // ✅ Space for fixed header
    paddingBottom: 60,   // ✅ Space for fixed footer
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#ffffff',
  },
  headerLogo: {
    width: 200,
    height: 60,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
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
  content: {
    flexDirection: 'column',
  },
  section: {
    marginBottom: 15,
    breakInside: 'auto',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
    backgroundColor: '#e5e7eb',
    padding: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
    breakInside: 'auto',
  },
  label: {
    width: 140,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    paddingRight: 8,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    minHeight: 12,
  },
  longAnswer: {
    marginBottom: 12,
    breakInside: 'auto',
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 10,
    color: '#111827',
  },
  longAnswerValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.5,
    padding: 12,
    border: '1 solid #d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    minHeight: 50,
    maxHeight: 600,      // ✅ Prevent excessive height
    breakInside: 'auto', // ✅ Allow page breaks
    wrap: true,          // ✅ Enable text wrapping
  },
  // Compact header styles to match form view
  compactHeader: {
    backgroundColor: '#d1d5db', // Gray-300
    border: '1 solid #000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compactHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  compactContent: {
    border: '1 solid #000000',
    borderTop: 'none',
    padding: 12,
    backgroundColor: '#ffffff',
    minHeight: 120,
    fontSize: 9,
    lineHeight: 1.4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 6,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
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
  questionSpacing: {
    height: 15,
  },
  conditionalDetails: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#f0f9ff',
    border: '1 solid #bfdbfe',
    borderRadius: 4,
    breakInside: 'auto',
  },
  detailsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    wrap: true,          // ✅ Enable text wrapping
  },
});

interface ClientIntakeFormPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakev2Dynamic: React.FC<ClientIntakeFormPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  
  // Common field mapping
  const commonFieldMapping: Record<string, string> = {
    name: 'name',
    givenName: 'name',
    surname: 'surname',
    dateOfBirth: 'dob',
    sex: 'sex',
    addressNumberStreet: 'street',
    state: 'state',
    postcode: 'postCode',
    email: 'email',
    phone: 'phone',
    disability: 'disability',
    ndisNumber: 'ndis',
  };

  // Get field value with fallback logic
  const getValue = (key: string): string => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] || formData?.[key] || '';
    }
    return formData?.[key] || '';
  };

  // Clean text to prevent duplication
  const cleanText = (text: string): string => {
    if (!text) return '';
    const cleaned = text
      .replace(/My advocate always My advocate/g, 'My advocate')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned; // Remove truncation to fix text cutoff
  };

  // Format date
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);
      return date.toLocaleDateString('en-AU');
    } catch {
      return String(dateString);
    }
  };

  // Get settings values
  const getEmail = (): string => settings?.from_email || '';
  const getFormId = (): string => settings?.client_intake_form_id || '';
  const getReportDate = (): string => {
    const dateValue = settings?.review_date;
    return dateValue ? formatDate(dateValue) : '';
  };

  // Render checkbox
  const renderCheckbox = (isChecked: boolean) => (
    <View style={isChecked ? styles.checkboxChecked : styles.checkbox} />
  );

  // Smart spacing logic
  const shouldAddSpacing = (currentIndex: number, totalItems: number): boolean => {
    return currentIndex < totalItems - 1;
  };

  const renderQuestionSpacing = (shouldAdd: boolean) => {
    if (!shouldAdd) return null;
    return <View style={styles.questionSpacing} />;
  };

  // Calculate dynamic height for text content
  const calculateTextHeight = (content: string): number => {
    if (!content || content.trim() === '') return 50;
    const words = content.trim().split(/\s+/).length;
    const lines = Math.ceil(words / 10); // ✅ Conservative estimate
    const height = Math.max(lines * 16, 50); // ✅ 16pt line height
    return Math.min(height, 400); // ✅ Max height to prevent footer overlap
  };

  // Render Yes/No with conditional details
  const renderYesNoWithDetails = (fieldKey: string, label: string, detailsField?: string) => (
    <View style={styles.longAnswer}>
      <Text style={styles.longAnswerLabel}>{label}</Text>
      <View style={styles.radioGroup}>
        <View style={styles.radioItem}>
          {renderCheckbox(getValue(fieldKey) === "Yes")}
          <Text>Yes</Text>
        </View>
        <View style={styles.radioItem}>
          {renderCheckbox(getValue(fieldKey) === "No")}
          <Text>No</Text>
        </View>
      </View>
      {getValue(fieldKey) === "Yes" && detailsField && getValue(detailsField) && (
        <View style={styles.conditionalDetails}>
          <Text style={styles.detailsLabel}>Details:</Text>
          <Text style={styles.detailsValue}>{cleanText(getValue(detailsField))}</Text>
        </View>
      )}
    </View>
  );

  // Medical questions configuration
  const medicalQuestions = [
    { field: 'medicationChart', label: 'Does the Participant require a Medication Chart?', detailsField: 'medicationChartOthers' },
    { field: 'mealtimeManagement', label: 'Does the Participant require Mealtime Management?' },
    { field: 'bowelCare', label: 'Does the participant require Bowel Care Management?', detailsField: 'bowelCareOthers' },
    { field: 'menstrualIssues', label: 'Are there any issues with a menstrual cycle or is assistance needed with female hygiene?', detailsField: 'menstrualIssuesOthers' },
    { field: 'epilepsy', label: 'Does the Participant have Epilepsy?', detailsField: 'epilepsyOthers' },
    { field: 'asthmatic', label: 'Is the Participant an Asthmatic?', detailsField: 'asthmaticOthers' },
    { field: 'allergies', label: 'Does the Participant have any allergies?', detailsField: 'allergiesOthers' },
    { field: 'anaphylactic', label: 'Is the Participant anaphylactic?', detailsField: 'anaphylacticOthers' },
    { field: 'minorInjury', label: 'Do you give permission for our company\'s staff to administer band-aids in cases of a minor injury?' },
    { field: 'training', label: 'Does this participant require specific training?', detailsField: 'trainingOthers' },
    { field: 'othermedical', label: 'Are there any other medication conditions that will be relevant to the care provided to this Participant?', detailsField: 'othermedicalOthers' },
    { field: 'trigger', label: 'Is there any specific trigger for community activities?', detailsField: 'triggerOthers' },
  ];

  // Safety questions configuration
  const safetyQuestions = [
    { field: 'absconding', label: 'Does the Participant show signs or a history of unexpectedly leaving (absconding)?', detailsField: 'abscondingOthers' },
    { field: 'historyOfFalls', label: 'Is this participant prone to falls or have a history of falls?' },
    { field: 'behaviourConcern', label: 'Are there any behaviours of concern? E.g.: kicking, biting', detailsField: 'behaviourConcernOthers' },
    { field: 'positiveBehaviour', label: 'Is there a current Positive Behaviour Support Plan in place?', detailsField: 'positiveBehaviourOthers' },
    { field: 'communicationAssistance', label: 'Does the participant require communication assistance?', detailsField: 'communicationAssistanceOthers' },
    { field: 'physicalAssistance', label: 'Is there any physical assistance or physical assistance preference for this Participant?', detailsField: 'physicalAssistanceOthers' },
    { field: 'languageConcern', label: 'Does the Participant have any expressive language concerns?', detailsField: 'languageConcernOthers' },
    { field: 'personalGoals', label: 'Does this Participant have any personal preferences & personal goals?' },
  ];

  return (
    <Document>
      {/* Single Page - Dynamic Content Flow */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          {/* Section 1: Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>NDIS Number:</Text>
              <Text style={styles.value}>{getValue('ndisNumber')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Given Name:</Text>
              <Text style={styles.value}>{getValue('givenName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Surname:</Text>
              <Text style={styles.value}>{getValue('surname')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{formatDate(getValue('dateOfBirth'))}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Sex:</Text>
              <Text style={styles.value}>{getValue('sex')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{getValue('addressNumberStreet')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>State:</Text>
              <Text style={styles.value}>{getValue('state')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Postcode:</Text>
              <Text style={styles.value}>{getValue('postcode')}</Text>
            </View>
          </View>

          {/* Section 2: Contact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participant Contact Details</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email Address:</Text>
              <Text style={styles.value}>{getValue('email')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Home Phone:</Text>
              <Text style={styles.value}>{getValue('homePhone')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Mobile:</Text>
              <Text style={styles.value}>{getValue('mobile')}</Text>
            </View>
          </View>

          {/* Section 3: Disability Conditions */}
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disability Conditions/Disability type(s)</Text>
            <View style={styles.longAnswer}>
              <View style={styles.longAnswerValue}>
                <Text wrap>{cleanText(getValue('disabilityConditions')) || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          {/* Section 4: Medical Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GP Medical Contact</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Medical Centre Name:</Text>
              <Text style={styles.value}>{getValue('medicalCentreName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{getValue('medicalPhone')}</Text>
            </View>
          </View>

          {/* Section 5: Support Coordinator */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Coordinator</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorEmail')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Company:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorCompany')}</Text>
            </View>
            
            {/* Other Supports Section - Matching Form View Layout */}
            <View style={styles.compactHeader}>
              <Text style={styles.compactHeaderText}>What other supports including mainstream health services you receive at present</Text>
            </View>
            <View style={styles.compactContent}>
              <Text wrap>{getValue('otherSupports') || ' '}</Text>
            </View>
          </View>

          {/* Section 6: All About Me - Matching Form View Layout */}
          <View style={styles.section}>
            {/* Compact Header Bar - Gray Background */}
            <View style={styles.compactHeader}>
              <Text style={styles.compactHeaderText}>All About Me</Text>
            </View>
            {/* Content Area */}
            <View style={styles.compactContent}>
              <Text wrap>{getValue('aboutMe') || ' '}</Text>
            </View>
          </View>

          {/* Section 7: Advocate Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advocate Details</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Advocate Name:</Text>
              <Text style={styles.value}>{getValue('advocateName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Advocate Phone:</Text>
              <Text style={styles.value}>{getValue('advocatePhone')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Relationship:</Text>
              <Text style={styles.value}>{getValue('advocateRelationship')}</Text>
            </View>
          </View>

          {/* Section 8: Personal Situation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Situation</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Living Arrangement:</Text>
              <Text style={styles.value}>{getValue('livingArrangement')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Employment Status:</Text>
              <Text style={styles.value}>{getValue('employmentStatus')}</Text>
            </View>
          </View>

          {/* Section 9: Medical Information - Dynamic Yes/No Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medication Information/Diagnosis/Health Concerns</Text>
            
            {medicalQuestions.map((question, index) => (
              <React.Fragment key={question.field}>
                {renderYesNoWithDetails(question.field, question.label, question.detailsField)}
                {renderQuestionSpacing(shouldAddSpacing(index, medicalQuestions.length))}
              </React.Fragment>
            ))}
          </View>

          {/* Section 10: Safety Considerations - Dynamic Yes/No Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Considerations</Text>
            
            {safetyQuestions.map((question, index) => (
              <React.Fragment key={question.field}>
                {renderYesNoWithDetails(question.field, question.label, question.detailsField)}
                {renderQuestionSpacing(shouldAddSpacing(index, safetyQuestions.length))}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2Dynamic;
