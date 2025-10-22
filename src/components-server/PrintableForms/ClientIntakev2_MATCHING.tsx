import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Matching PDF generation - matches ClientIntakeFormDynamic.tsx web view design
// Natural flow with automatic page breaks (no manual pagination)

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
    marginBottom: 8, // Compact spacing like web view
  },
  fieldHeader: {
    backgroundColor: '#d1d5db', // gray-300
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
});

interface ClientIntakeFormMatchingProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakev2Matching: React.FC<ClientIntakeFormMatchingProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  console.log('🔍 ClientIntakev2_MATCHING.tsx is being used for PDF generation');
  console.log('📊 Form data keys:', Object.keys(formData || {}));

  // Get field value helper function (matches web view logic)
  const getFieldValue = (key: string): string => {
    const value = formData?.[key] || commonFieldsData?.[key] || '';
    return value ? String(value) : '';
  };

  // All form fields in order (matches ClientIntakeFormDynamic.tsx)
  const allFields = [
    // Personal Information
    { key: 'ndisNumber', label: 'NDIS Number', type: 'text' },
    { key: 'givenName', label: 'Given Name', type: 'text' },
    { key: 'surname', label: 'Surname', type: 'text' },
    { key: 'preferredName', label: 'Preferred Name', type: 'text' },
    { key: 'dateOfBirth', label: 'Date of Birth', type: 'text' },
    { key: 'sex', label: 'Sex', type: 'text' },
    { key: 'pronoun', label: 'Pronoun', type: 'text' },
    { key: 'aboriginalTorres', label: 'Aboriginal or Torres Strait Islander?', type: 'text' },
    { key: 'addressNumberStreet', label: 'Address (Number/Street)', type: 'text' },
    { key: 'state', label: 'State', type: 'text' },
    { key: 'postcode', label: 'Postcode', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'homePhone', label: 'Home Phone', type: 'text' },
    { key: 'mobile', label: 'Mobile', type: 'text' },
    { key: 'disabilityConditions', label: 'Disability Conditions/Disability type(s)', type: 'longtext' },
    
    // Medical Contact
    { key: 'medicalCentreName', label: 'Medical Centre Name', type: 'text' },
    { key: 'medicalPhone', label: 'Medical Centre Phone', type: 'text' },
    
    // Support Coordinator
    { key: 'supportCoordinatorName', label: 'Support Coordinator Name', type: 'text' },
    { key: 'supportCoordinatorEmail', label: 'Support Coordinator Email', type: 'text' },
    { key: 'supportCoordinatorCompany', label: 'Support Coordinator Company', type: 'text' },
    { key: 'supportCoordinatorContact', label: 'Support Coordinator Contact', type: 'text' },
    { key: 'otherSupports', label: 'What other supports including mainstream health services you receive at present', type: 'longtext' },
    
    // About Me
    { key: 'aboutMe', label: 'All About Me', type: 'longtext' },
    
    // Advocate Details
    { key: 'advocateName', label: 'Advocate Name', type: 'text' },
    { key: 'advocateEmail', label: 'Advocate Email', type: 'text' },
    { key: 'advocatePhone', label: 'Advocate Phone', type: 'text' },
    { key: 'advocateMobile', label: 'Advocate Mobile', type: 'text' },
    { key: 'advocateAddress', label: 'Advocate Address', type: 'text' },
    { key: 'advocatePostalAddress', label: 'Advocate Postal Address', type: 'text' },
    { key: 'advocateOtherInfo', label: 'Advocate Additional Information', type: 'longtext' },
    { key: 'advocateRelationship', label: 'Advocate Relationship with Participant', type: 'text' },
    
    // Cultural Information
    { key: 'barriers', label: 'Are there any cultural, communication barriers or intimacy issues', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'interpreter', label: 'Is an interpreter needed?', type: 'text' },
    { key: 'countryOfBirth', label: 'Country of Birth', type: 'text' },
    { key: 'culturalValues', label: 'Cultural Values', type: 'longtext' },
    { key: 'culturalBehaviours', label: 'Cultural Behaviours', type: 'longtext' },
    { key: 'writtenCommunication', label: 'Written Communication / Literacy', type: 'longtext' },
    
    // Contact Details
    { key: 'primaryContactName', label: 'Primary Contact Name', type: 'text' },
    { key: 'primaryContactRelationship', label: 'Primary Contact Relationship', type: 'text' },
    { key: 'primaryContactHomePhone', label: 'Primary Contact Home Phone', type: 'text' },
    { key: 'primaryContactMobile', label: 'Primary Contact Mobile', type: 'text' },
    { key: 'secondaryContactName', label: 'Secondary Contact Name', type: 'text' },
    { key: 'secondaryContactRelationship', label: 'Secondary Contact Relationship', type: 'text' },
    { key: 'secondaryContactHomePhone', label: 'Secondary Contact Home Phone', type: 'text' },
    { key: 'secondaryContactMobile', label: 'Secondary Contact Mobile', type: 'text' },
    { key: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text' },
    { key: 'emergencyContactRelationship', label: 'Emergency Contact Relationship', type: 'text' },
    { key: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'text' },
    
    // Living Arrangements
    { key: 'livingArrangements', label: 'Living Arrangements', type: 'text' },
    { key: 'livingArrangementsOthers', label: 'Living Arrangements Details', type: 'longtext' },
    { key: 'travelArrangements', label: 'Travel Arrangements', type: 'text' },
    { key: 'travelArrangementsOthers', label: 'Travel Arrangements Details', type: 'longtext' },
    
    // Medical Information
    { key: 'medicationChart', label: 'Does the Participant require a Medication Chart?', type: 'text' },
    { key: 'medicationChartOthers', label: 'Medication Chart Details', type: 'longtext' },
    { key: 'mealtimeManagement', label: 'Does the Participant require Mealtime Management?', type: 'text' },
    { key: 'bowelCare', label: 'Does the participant require Bowel Care Management?', type: 'text' },
    { key: 'bowelCareOthers', label: 'Bowel Care Details', type: 'longtext' },
    { key: 'menstrualIssues', label: 'Are there any issues with a menstrual cycle or is assistance needed with female hygiene', type: 'text' },
    { key: 'menstrualIssuesOthers', label: 'Menstrual Issues Details', type: 'longtext' },
    { key: 'personalCare', label: 'Does the participant require Personal Care?', type: 'text' },
    { key: 'personalCareOthers', label: 'Personal Care Details', type: 'longtext' },
    { key: 'mobilityAids', label: 'Does the participant use any mobility aids?', type: 'text' },
    { key: 'mobilityAidsOthers', label: 'Mobility Aids Details', type: 'longtext' },
    { key: 'epilepsy', label: 'Does the Participant have Epilepsy?', type: 'text' },
    { key: 'epilepsyOthers', label: 'Epilepsy Details', type: 'longtext' },
    { key: 'asthmatic', label: 'Is the Participant an Asthmatic?', type: 'text' },
    { key: 'asthmaticOthers', label: 'Asthma Details', type: 'longtext' },
    { key: 'allergies', label: 'Does the Participant have any allergies?', type: 'text' },
    { key: 'allergiesOthers', label: 'Allergy Details', type: 'longtext' },
    { key: 'anaphylactic', label: 'Is the Participant anaphylactic?', type: 'text' },
    { key: 'anaphylacticOthers', label: 'Anaphylaxis Details', type: 'longtext' },
    { key: 'minorInjury', label: 'Do you give permission for our company\'s staff to administer band-aids in cases of a minor injury?', type: 'text' },
    { key: 'training', label: 'Does this participant require specific training?', type: 'text' },
    { key: 'trainingOthers', label: 'Training Details', type: 'longtext' },
    { key: 'othermedical', label: 'Are there any other medication conditions that will be relevant to the care provided to this Participant?', type: 'text' },
    { key: 'othermedicalOthers', label: 'Other Medical Details', type: 'longtext' },
    { key: 'trigger', label: 'Is there any specific trigger for community activities?', type: 'text' },
    { key: 'triggerOthers', label: 'Trigger Details', type: 'longtext' },
    
    // Safety Considerations
    { key: 'riskAssessment', label: 'Does this Participant require a Risk Assessment?', type: 'text' },
    { key: 'riskAssessmentOthers', label: 'Risk Assessment Details', type: 'longtext' },
    { key: 'behaviourSupport', label: 'Does this Participant require Behaviour Support?', type: 'text' },
    { key: 'behaviourSupportOthers', label: 'Behaviour Support Details', type: 'longtext' },
    { key: 'personalGoals', label: 'Does this Participant have any personal preferences & personal goals?', type: 'text' },
    { key: 'personalGoalsOthers', label: 'Personal Goals Details', type: 'longtext' },
    { key: 'absconding', label: 'Does the Participant show signs or a history of unexpectedly leaving (absconding)?', type: 'text' },
    { key: 'abscondingOthers', label: 'Absconding Details', type: 'longtext' },
    { key: 'historyOfFalls', label: 'Is this participant prone to falls or have a history of falls?', type: 'text' },
    { key: 'behaviourConcern', label: 'Are there any Behaviours of Concern? Eg: Kicking, biting', type: 'text' },
    { key: 'behaviourConcernOthers', label: 'Behaviour Concern Details', type: 'longtext' },
    { key: 'positiveBehaviour', label: 'Is there a current Positive Behaviour Support Plan in place?', type: 'text' },
    { key: 'positiveBehaviourOthers', label: 'Positive Behaviour Details', type: 'longtext' },
    { key: 'communicationAssistance', label: 'Does the participant require communication assistance?', type: 'text' },
    { key: 'communicationAssistanceOthers', label: 'Communication Assistance Details', type: 'longtext' },
    { key: 'physicalAssistance', label: 'Is there any physical assistance or physical assistance preference for this Participant?', type: 'text' },
    { key: 'physicalAssistanceOthers', label: 'Physical Assistance Details', type: 'longtext' },
    { key: 'languageConcern', label: 'Does the Participant have any expressive language concerns?', type: 'text' },
    { key: 'languageConcernOthers', label: 'Language Concern Details', type: 'longtext' },
  ];

  console.log('📋 Total fields to render:', allFields.length);
  console.log('🎯 Rendering ALL fields (filled and empty)');

  // Show ALL fields (filled and empty) - matches view page behavior
  const allFieldsToRender = allFields; // No filtering - show everything

  // Render field (matches web view appearance EXACTLY)
  const renderField = (field: any) => {
    const value = getFieldValue(field.key);
    const valueStr = value && value.trim() !== '' ? String(value) : 'No information provided';
    const isLongText = field.type === 'longtext';
    
    return (
      <View key={field.key} style={styles.fieldContainer} wrap={false}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
        </View>
        <View style={isLongText ? styles.fieldValueLong : styles.fieldValue}>
          <Text>{valueStr}</Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* Single Page - Natural flow with automatic page breaks */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header on all pages */}
        <View style={styles.header} fixed>
          <Image
            src={logoDataUrl}
            style={styles.headerLogo}
          />
          <Text style={styles.title}>Client Intake Form</Text>
        </View>

        {/* Content - flows naturally with automatic page breaks */}
        <View>
          {allFieldsToRender.map(field => renderField(field))}
        </View>

        {/* Fixed Footer on all pages */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Website: {settings?.company_website || 'https://www.infinitysupportswa.org'}
          </Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
          <Text style={styles.footerText}>
            {settings?.client_intake_form_id || 'CF001'}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2Matching;
