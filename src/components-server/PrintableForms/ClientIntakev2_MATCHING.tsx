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
    console.log(`🔍 Client Intake PDF Matching - Getting field: ${key}`);
    
    // Map common fields correctly
    const commonFieldMapping: Record<string, string> = {
      ndisNumber: 'ndis',
      givenName: 'name',
      surname: 'surname',
      dateOfBirth: 'dob',
      sex: 'sex',
      addressNumberStreet: 'street',
      state: 'state',
      postcode: 'postCode',
      email: 'email',
      mobile: 'phone',
      // homePhone: not mapped - uses form data only
      disabilityConditions: 'disability'
    };
    
    // Always prioritize current client details from database
    const mapped = commonFieldMapping[key];
    if (mapped && commonFieldsData?.[mapped]) {
      console.log(`✅ Client Intake PDF ${key} (from commonFieldsData.${mapped}):`, commonFieldsData[mapped]);
      return String(commonFieldsData[mapped]);
    }
    
    // Only fallback to saved form data if DB doesn't have the value
    if (formData?.[key]) {
      console.log(`⚠️ Client Intake PDF ${key} (from formData):`, formData[key]);
      return String(formData[key]);
    }
    
    console.log(`❌ Client Intake PDF ${key}: No value found`);
    return '';
  };

  // Helper to decide if a dependent detail should render
  const shouldShowDetail = (parentKey: string, detailKey: string) => {
    return getFieldValue(parentKey) === 'Yes' && !!getFieldValue(detailKey);
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
    { key: 'barriers', label: 'Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services', type: 'text' },
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'interpreter', label: 'Verbal communication or spoken language - Is an interpreter needed?', type: 'text' },
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
    // Emergency contact fields removed from view per requirements
    
    // Living Arrangements
    { key: 'livingArrangements', label: 'Living Arrangements', type: 'text' },
    { key: 'livingArrangementsOther', label: 'Please specify other living arrangement', type: 'longtext' },
    { key: 'travelArrangements', label: 'Travel Arrangements', type: 'text' },
    { key: 'travelArrangementsOther', label: 'Please specify other travel arrangement', type: 'longtext' },
    
    // Medical Information
    { key: 'medicationChart', label: 'Does the Participant require a Medication Chart?', type: 'text' },
    { key: 'medicationChartOthers', label: 'Medication Chart Details', type: 'longtext' },
    { key: 'mealtimeManagement', label: 'Does the Participant require Mealtime Management?', type: 'text' },
    { key: 'bowelCare', label: 'Does the participant require Bowel Care Management?', type: 'text' },
    { key: 'bowelCareOthers', label: 'If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.', type: 'longtext' },
    { key: 'menstrualIssues', label: 'Are there any issues with a menstrual cycle or is assistance needed with female hygiene', type: 'text' },
    { key: 'menstrualIssuesOthers', label: 'If yes, Please specify', type: 'longtext' },
    // Removed from view per requirements (not in edit form)
    { key: 'epilepsy', label: 'Does the Participant have Epilepsy?', type: 'text' },
    { key: 'epilepsyOthers', label: "If yes, ensure Participant's Doctor completes an Epilepsy Plan", type: 'longtext' },
    { key: 'asthmatic', label: 'Is the Participant an Asthmatic?', type: 'text' },
    { key: 'asthmaticOthers', label: "If yes ,ensure Participant's Doctor completes an Asthma Plan", type: 'longtext' },
    { key: 'allergies', label: 'Does the Participant have any allergies?', type: 'text' },
    { key: 'allergiesOthers', label: "If yes, ensure to have an Allergy Plan from Participant's Doctor", type: 'longtext' },
    { key: 'anaphylactic', label: 'Is the Participant anaphylactic?', type: 'text' },
    { key: 'anaphylacticOthers', label: "If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor", type: 'longtext' },
    { key: 'minorInjury', label: 'Do you give permission for our company\'s staff to administer band-aids in cases of a minor injury?', type: 'text' },
    { key: 'training', label: 'Does this participant require specific training?', type: 'text' },
    { key: 'trainingOthers', label: 'If yes, ensure to provide information such as implementing a positive behaviour support plan.', type: 'longtext' },
    { key: 'othermedical', label: 'Are there any other medication conditions that will be relevant to the care provided to this Participant?', type: 'text' },
    { key: 'othermedicalOthers', label: 'If yes, please specify.', type: 'longtext' },
    { key: 'trigger', label: 'Is there any specific trigger for community activities?', type: 'text' },
    { key: 'triggerOthers', label: 'If yes, please specify and complete the Risk assessment for participants.', type: 'longtext' },
    
    // Safety Considerations (align with view; remove Risk Assessment & Behaviour Support)
    { key: 'personalGoals', label: 'Does this Participant have any personal preferences & personal goals?', type: 'text' },
    { key: 'personalGoalsOthers', label: 'If yes, refer to form Support Plan', type: 'longtext' },
    { key: 'absconding', label: 'Does the Participant show signs or a history of unexpectedly leaving (absconding)?', type: 'text' },
    { key: 'abscondingOthers', label: 'If yes, please specify.', type: 'longtext' },
    { key: 'historyOfFalls', label: 'Is this participant prone to falls or have a history of falls?', type: 'text' },
    { key: 'behaviourConcern', label: 'Are there any Behaviours of Concern? Eg: Kicking, biting', type: 'text' },
    { key: 'behaviourConcernOthers', label: 'If yes, please specify.', type: 'longtext' },
    { key: 'positiveBehaviour', label: 'Is there a current Positive Behaviour Support Plan in place?', type: 'text' },
    { key: 'positiveBehaviourOthers', label: 'If yes, refer to High Risk Participant Register.', type: 'longtext' },
    { key: 'communicationAssistance', label: 'Does the participant require communication assistance?', type: 'text' },
    { key: 'communicationAssistanceOthers', label: 'If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.', type: 'longtext' },
    { key: 'physicalAssistance', label: 'Is there any physical assistance or physical assistance preference for this Participant?', type: 'text' },
    { key: 'physicalAssistanceOthers', label: 'If yes, specify.', type: 'longtext' },
    { key: 'languageConcern', label: 'Does the Participant have any expressive language concerns?', type: 'text' },
    { key: 'languageConcernOthers', label: 'If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.', type: 'longtext' },
  ];

  console.log('📋 Total fields to render:', allFields.length);
  console.log('🎯 Rendering ALL fields (filled and empty)');

  // Show ALL fields (filled and empty) - matches view page behavior
  const allFieldsToRender = allFields; // No filtering - show everything

  // Render field (matches web view appearance EXACTLY)
  const renderField = (field: any) => {
    const value = getFieldValue(field.key);
    const isListField = field.key === 'livingArrangements' || field.key === 'travelArrangements';
    const valueStr = isListField
      ? ''
      : (value && String(value).trim() !== '' ? String(value) : 'No information provided');
    const isLongText = field.type === 'longtext';

    // Filter longtext "If yes" detail fields if parent is not Yes
    const yesNoPairs: Record<string, string> = {
      medicationChartOthers: 'medicationChart',
      bowelCareOthers: 'bowelCare',
      menstrualIssuesOthers: 'menstrualIssues',
      epilepsyOthers: 'epilepsy',
      asthmaticOthers: 'asthmatic',
      allergiesOthers: 'allergies',
      anaphylacticOthers: 'anaphylactic',
      trainingOthers: 'training',
      othermedicalOthers: 'othermedical',
      triggerOthers: 'trigger',
      abscondingOthers: 'absconding',
      behaviourConcernOthers: 'behaviourConcern',
      positiveBehaviourOthers: 'positiveBehaviour',
      personalGoalsOthers: 'personalGoals',
      communicationAssistanceOthers: 'communicationAssistance',
      physicalAssistanceOthers: 'physicalAssistance',
      languageConcernOthers: 'languageConcern',
    };

    if (field.key in yesNoPairs) {
      const parent = yesNoPairs[field.key];
      if (!shouldShowDetail(parent, field.key)) {
        return null;
      }
    }
    
    return (
      <View key={field.key} style={styles.fieldContainer} wrap={false}>
        <View style={styles.fieldHeader}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
        </View>
        <View style={isLongText ? styles.fieldValueLong : styles.fieldValue}>
          {isListField ? (
            <>
              {(() => {
                const arr = Array.isArray(value)
                  ? value
                  : String(value || '')
                      .split(',')
                      .map((s: string) => s.trim())
                      .filter((s: string) => s.length > 0);
                return arr.length > 0 ? (
                  <View>
                    {arr.map((item: string, idx: number) => (
                      <Text key={idx}>• {item}</Text>
                    ))}
                  </View>
                ) : (
                  <Text> </Text>
                );
              })()}
            </>
          ) : (
            <Text>
              {field.key === 'mealtimeManagement' && getFieldValue('mealtimeManagement') === 'Yes'
                ? 'Yes (refer to Mealtime Management Plan Form)'
                : valueStr}
            </Text>
          )}
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
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.client_intake_form_id || ''}</Text>
          <Text style={styles.footerText}>Review Date: {settings?.review_date || ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2Matching;
