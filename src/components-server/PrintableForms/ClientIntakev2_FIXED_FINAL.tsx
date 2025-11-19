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
    paddingTop: 80,
    paddingBottom: 50,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#ffffff',
  },
  headerLogo: {
    width: 180,
    height: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTop: '1 solid #e5e7eb',
    fontSize: 8,
    height: 30,
    backgroundColor: '#ffffff',
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 40,
    fontSize: 8,
    color: '#666666',
  },
  content: {
    flexDirection: 'column',
  },
  section: {
    marginBottom: 12,
    breakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
    backgroundColor: '#f3f4f6',
    padding: 5,
    textDecoration: 'underline',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
    breakInside: 'avoid',
  },
  label: {
    width: 130,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    paddingRight: 6,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    minHeight: 10,
  },
  questionContainer: {
    marginBottom: 10,
    breakInside: 'avoid',
  },
  questionLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 9,
    color: '#111827',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1 solid #000000',
    marginRight: 3,
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    width: 8,
    height: 8,
    border: '1 solid #000000',
    marginRight: 3,
    backgroundColor: '#000000',
  },
  conditionalDetails: {
    marginTop: 4,
    padding: 6,
    backgroundColor: '#f8fafc',
    border: '1 solid #cbd5e1',
    borderRadius: 2,
    breakInside: 'avoid',
  },
  detailsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  detailsValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
  },
  longTextContainer: {
    marginBottom: 8,
    breakInside: 'avoid',
  },
  longTextLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 9,
    color: '#111827',
  },
  longTextValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    padding: 8,
    border: '1 solid #d1d5db',
    borderRadius: 2,
    backgroundColor: '#f9fafb',
    minHeight: 30,
  },
  spacer: {
    height: 6,
  },
});

interface ClientIntakeFormPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakev2FixedFinal: React.FC<ClientIntakeFormPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  
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

  const getValue = (key: string): string => {
    if (commonFieldMapping[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] || formData?.[key] || '';
    }
    return formData?.[key] || '';
  };

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

  const getWebsite = (): string => settings?.company_website || '';
  const getFormId = (): string => settings?.client_intake_form_id || '';
  const getReportDate = (): string => {
    const dateValue = settings?.review_date;
    return dateValue ? formatDate(dateValue) : '';
  };

  const renderCheckbox = (isChecked: boolean) => (
    <View style={isChecked ? styles.checkboxChecked : styles.checkbox} />
  );

  // Clean and truncate text to prevent duplication
  const cleanText = (text: string): string => {
    if (!text) return '';
    
    // Remove duplicate phrases
    const cleaned = text
      .replace(/My advocate always My advocate/g, 'My advocate')
      .replace(/speakinthe the he asdfasdfadsfdsf helm/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Truncate if too long
    if (cleaned.length > 500) {
      return cleaned.substring(0, 497) + '...';
    }
    
    return cleaned;
  };

  const renderYesNoWithDetails = (fieldKey: string, label: string, detailsField?: string) => {
    const answer = getValue(fieldKey);
    const details = detailsField ? cleanText(getValue(detailsField)) : '';
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionLabel}>{label}</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioItem}>
            {renderCheckbox(answer === "Yes")}
            <Text>✓ Yes</Text>
          </View>
          <View style={styles.radioItem}>
            {renderCheckbox(answer === "No")}
            <Text>☐ No</Text>
          </View>
        </View>
        {answer === "Yes" && details && (
          <View style={styles.conditionalDetails}>
            <Text style={styles.detailsLabel}>Details:</Text>
            <Text style={styles.detailsValue}>{details}</Text>
          </View>
        )}
      </View>
    );
  };

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
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disability Conditions/Disability type(s)</Text>
            <View style={styles.longTextContainer}>
              <View style={styles.longTextValue}>
                <Text>{cleanText(getValue('disabilityConditions')) || 'Not specified'}</Text>
              </View>
            </View>
          </View>

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
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All About Me</Text>
            <View style={styles.longTextContainer}>
              <Text style={styles.longTextLabel}>Tell us about yourself:</Text>
              <View style={styles.longTextValue}>
                <Text>{cleanText(getValue('aboutMe')) || 'Not provided'}</Text>
              </View>
            </View>
          </View>

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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medication Information/Diagnosis/Health Concerns</Text>
            
            {medicalQuestions.map((question, index) => (
              <React.Fragment key={question.field}>
                {renderYesNoWithDetails(question.field, question.label, question.detailsField)}
                {index < medicalQuestions.length - 1 && <View style={styles.spacer} />}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety and Communication</Text>
            
            {safetyQuestions.map((question, index) => (
              <React.Fragment key={question.field}>
                {renderYesNoWithDetails(question.field, question.label, question.detailsField)}
                {index < safetyQuestions.length - 1 && <View style={styles.spacer} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()} Review Date: {getReportDate()}</Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => 
          `Page ${pageNumber} of ${totalPages}`
        } fixed />
      </Page>
    </Document>
  );
};

export default ClientIntakev2FixedFinal;
