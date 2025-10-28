import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// Define bullet-proof styles with proper margins
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 120, // Reserve header space (same as @page margin-top)
    paddingBottom: 80, // Reserve footer space (same as @page margin-bottom)
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 10,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 10,
    height: 80,
  },
  headerLogo: {
    width: 220,
    height: 70,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 10,
    height: 40,
  },
  footerText: {
    fontSize: 10,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: 25,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
    backgroundColor: '#e5e7eb',
    padding: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    gap: 10,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
  },
  longAnswer: {
    marginBottom: 10,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 9,
    color: '#374151',
  },
  longAnswerValue: {
    border: '1 solid #000000',
    borderRadius: 3,
    padding: 10,
    minHeight: 200, // Fixed minimum height for full container
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.4,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    backgroundColor: '#ffffff',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    marginBottom: 2,
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
  pageBreak: {
    breakBefore: 'page',
  },
});

interface ClientIntakePDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakev2_BULLETPROOF: React.FC<ClientIntakePDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  // Data mapping for common fields
  const commonFieldMapping: Record<string, string> = {
    clientName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  // Safe data extraction with fallbacks
  const getValue = (key: string): string => {
    try {
      let value = '';
      
      if (commonFieldMapping?.[key]) {
        value = commonFieldsData?.[commonFieldMapping[key]];
      } else {
        value = formData?.[key];
      }
      
      return value ? String(value) : '';
    } catch (error) {
      console.warn(`Error getting value for key ${key}:`, error);
      return '';
    }
  };

  // Safe date formatting
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return String(dateString);
      }
      return date.toLocaleDateString();
    } catch {
      return String(dateString);
    }
  };

  // Get report date with fallback
  const getReportDate = (): string => {
    const dateValue = settings?.review_date || settings?.reviewDate || settings?.report_date || settings?.reportDate;
    
    if (dateValue) {
      const formatted = formatDate(dateValue);
      if (formatted) {
        return formatted;
      }
    }
    
    return '';
  };

  // Get form ID from settings
  const getFormId = (): string => {
    const formId = settings?.client_intake_form_id || settings?.client_intake_form;
    return formId || '';
  };

  // Get email from settings
  const getEmail = (): string => {
    const email = settings?.from_email || settings?.email;
    return email || '';
  };

  // Render checkbox component
  const renderCheckbox = (isChecked: boolean) => (
    <View style={isChecked ? styles.checkboxChecked : styles.checkbox} />
  );

  // Render radio group
  const renderRadioGroup = (fieldName: string, options: string[]) => (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <View key={option} style={styles.radioItem}>
          {renderCheckbox(getValue(fieldName) === option)}
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  );

  // Helper function to render Yes/No with details
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
        <View style={[styles.longAnswerValue, { marginTop: 4, minHeight: 100 }]}>
          <Text>Details: {getValue(detailsField)}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Document>
      {/* PAGE 1: Personal Information */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header - Positioned absolutely to avoid overlap */}
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content - Starts after reserved header space */}
        <View style={styles.content}>
          {/* Section 1: Participant Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participant Details</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{getValue('date')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>NDIS Number:</Text>
              <Text style={styles.value}>{getValue('ndisNumber')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Given name(s):</Text>
              <Text style={styles.value}>{getValue('givenName')}</Text>
              <Text style={styles.label}>Surname:</Text>
              <Text style={styles.value}>{getValue('surname')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Sex:</Text>
              {renderRadioGroup('sex', ['Male', 'Female', 'Prefer not to say'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Pronoun:</Text>
              <Text style={styles.value}>{getValue('pronoun')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Are you an Aboriginal or Torres Strait Island descent?</Text>
              {renderRadioGroup('aboriginalTorres', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Preferred name:</Text>
              <Text style={styles.value}>{getValue('preferredName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{getValue('dateOfBirth')}</Text>
            </View>
          </View>

          {/* Section 2: Residential Address Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Residential Address Details</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Number / Street:</Text>
              <Text style={styles.value}>{getValue('addressNumberStreet')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>State:</Text>
              <Text style={styles.value}>{getValue('state')}</Text>
              <Text style={styles.label}>Postcode:</Text>
              <Text style={styles.value}>{getValue('postcode')}</Text>
            </View>
          </View>

          {/* Section 3: Participant Contact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participant Contact Details</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email address:</Text>
              <Text style={styles.value}>{getValue('email')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Home Phone No:</Text>
              <Text style={styles.value}>{getValue('homePhone')}</Text>
              <Text style={styles.label}>Mobile No:</Text>
              <Text style={styles.value}>{getValue('mobile')}</Text>
            </View>
          </View>

          {/* Section 4: Disability Conditions - FULL BOX CONTAINER */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disability Conditions/Disability type(s)</Text>
            <View style={styles.longAnswer}>
              <View style={styles.longAnswerValue}>
                <Text style={{ 
                  fontSize: 10, 
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {getValue('disabilityConditions') || ' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fixed Footer - Positioned absolutely to avoid overlap */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 2: Medical Contact & Support Coordinator */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          {/* Section 1: GP Medical Contact */}
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

          {/* Section 2: Support Coordinator */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Coordinator</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorName')}</Text>
              <Text style={styles.label}>Email Address:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorEmail')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Company:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorCompany')}</Text>
              <Text style={styles.label}>Contact number:</Text>
              <Text style={styles.value}>{getValue('supportCoordinatorContact')}</Text>
            </View>
          </View>

          {/* Section 3: Other Supports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What other supports including mainstream health services you receive at present</Text>
            <View style={styles.longAnswer}>
              <View style={styles.longAnswerValue}>
                <Text style={{ 
                  fontSize: 10, 
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {getValue('otherSupports') || ' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 3: All About Me */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All About Me</Text>
            <View style={styles.longAnswer}>
              <View style={styles.longAnswerValue}>
                <Text style={{ 
                  fontSize: 10, 
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {getValue('aboutMe') || ' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 4: Advocate Details */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advocate/representative details (if applicable)</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{getValue('advocateName')}</Text>
              <Text style={styles.label}>Relationship with the participant:</Text>
              <Text style={styles.value}>{getValue('advocateRelationship')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Phone No:</Text>
              <Text style={styles.value}>{getValue('advocatePhone')}</Text>
              <Text style={styles.label}>Mobile No:</Text>
              <Text style={styles.value}>{getValue('advocateMobile')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{getValue('advocateEmail')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Address Details:</Text>
              <Text style={styles.value}>{getValue('advocateAddress')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Postal Address Details:</Text>
              <Text style={styles.value}>{getValue('advocatePostalAddress')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Other Information:</Text>
              <View style={styles.longAnswerValue}>
                <Text style={{ 
                  fontSize: 10, 
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {getValue('advocateOtherInfo') || ' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 5: Personal Situation */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Situation</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?</Text>
              {renderRadioGroup('barriers', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Verbal communication or spoken language - Is an interpreter needed?</Text>
              {renderRadioGroup('interpreter', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Language:</Text>
              <Text style={styles.value}>{getValue('language')}</Text>
              <Text style={styles.label}>Country of birth:</Text>
              <Text style={styles.value}>{getValue('countryOfBirth')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Cultural values/ beliefs or assumptions:</Text>
              <Text style={styles.value}>{getValue('culturalValues')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Cultural behaviours:</Text>
              <Text style={styles.value}>{getValue('culturalBehaviours')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Written communication/literacy:</Text>
              <Text style={styles.value}>{getValue('writtenCommunication')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 6: Contact Details & Living Arrangements */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          {/* Primary Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Primary Contact</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact Name:</Text>
              <Text style={styles.value}>{getValue('primaryContactName')}</Text>
              <Text style={styles.label}>Relationship:</Text>
              <Text style={styles.value}>{getValue('primaryContactRelationship')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Home Phone No:</Text>
              <Text style={styles.value}>{getValue('primaryContactHomePhone')}</Text>
              <Text style={styles.label}>Mobile No:</Text>
              <Text style={styles.value}>{getValue('primaryContactMobile')}</Text>
            </View>
          </View>

          {/* Secondary Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Secondary Contact</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact Name:</Text>
              <Text style={styles.value}>{getValue('secondaryContactName')}</Text>
              <Text style={styles.label}>Relationship:</Text>
              <Text style={styles.value}>{getValue('secondaryContactRelationship')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Home Phone No:</Text>
              <Text style={styles.value}>{getValue('secondaryContactHomePhone')}</Text>
              <Text style={styles.label}>Mobile No:</Text>
              <Text style={styles.value}>{getValue('secondaryContactMobile')}</Text>
            </View>
          </View>

          {/* Living and support arrangements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Living and support arrangements</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>What is your current living arrangement? (Please tick the appropriate box)</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Options:</Text>
              <View style={styles.longAnswerValue}>
                <Text style={{ 
                  fontSize: 10, 
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  Live with Parent/Family/Support Person{'\n'}
                  Live in private rental arrangement with others{'\n'}
                  Live in private rental arrangement alone{'\n'}
                  Owns own home.{'\n'}
                  Aged Care Facility{'\n'}
                  Mental Health Facility{'\n'}
                  Lives in public housing{'\n'}
                  Short Term Crisis/Respite{'\n'}
                  Staff Supported Group Home{'\n'}
                  Hostel/SRS Private Accommodation{'\n'}
                  Other: {getValue('livingArrangementsOther')}
                </Text>
              </View>
            </View>
          </View>

          {/* Travel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>How do you travel to work or to your day service? (Please tick the appropriate box)</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Options:</Text>
              <View style={styles.longAnswerValue}>
                <Text style={{ 
                  fontSize: 10, 
                  lineHeight: 1.4,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  Taxi{'\n'}
                  Pick up/ drop off by Parent/Family/Support Person{'\n'}
                  Transport by a provider{'\n'}
                  Independently use Public Transport{'\n'}
                  Walk{'\n'}
                  Assisted Public Transport{'\n'}
                  Drive own car.{'\n'}
                  Other: {getValue('travelArrangementsOther')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 7: Medical Information */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medication Information/Diagnosis/Health Concerns</Text>
            
            {renderYesNoWithDetails('medicationChart', 'Does the Participant require a Medication Chart?', 'medicationChartOthers')}
            {renderYesNoWithDetails('mealtimeManagement', 'Does the Participant require Mealtime Management?')}
            {renderYesNoWithDetails('bowelCare', 'Does the participant require Bowel Care Management?', 'bowelCareOthers')}
            {renderYesNoWithDetails('menstrualIssues', 'Are there any issues with a menstrual cycle or is assistance needed with female hygiene', 'menstrualIssuesOthers')}
            {renderYesNoWithDetails('epilepsy', 'Does the Participant have Epilepsy?', 'epilepsyOthers')}
            {renderYesNoWithDetails('asthmatic', 'Is the Participant an Asthmatic?', 'asthmaticOthers')}
            {renderYesNoWithDetails('allergies', 'Does the Participant have any allergies?', 'allergiesOthers')}
            {renderYesNoWithDetails('anaphylactic', 'Is the Participant anaphylactic?', 'anaphylacticOthers')}
            {renderYesNoWithDetails('minorInjury', 'Do you give permission for our company\'s staff to administer band-aids in cases of a minor injury?')}
            {renderYesNoWithDetails('training', 'Does this participant require specific training?', 'trainingOthers')}
            {renderYesNoWithDetails('othermedical', 'Are there any other medication conditions that will be relevant to the care provided to this Participant?', 'othermedicalOthers')}
            {renderYesNoWithDetails('trigger', 'Is there any specific trigger for community activities?', 'triggerOthers')}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 8: Safety Considerations */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header}>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Considerations</Text>
            
            {renderYesNoWithDetails('absconding', 'Does the Participant show signs or a history of unexpectedly leaving (absconding)?', 'abscondingOthers')}
            {renderYesNoWithDetails('historyOfFalls', 'Is this participant prone to falls or have a history of falls?')}
            {renderYesNoWithDetails('behaviourConcern', 'Are there any behaviours of concern? E.g.: kicking, biting', 'behaviourConcernOthers')}
            {renderYesNoWithDetails('positiveBehaviour', 'Is there a current Positive Behaviour Support Plan in place', 'positiveBehaviourOthers')}
            {renderYesNoWithDetails('communicationAssistance', 'Does the participant require communication assistance?', 'communicationAssistanceOthers')}
            {renderYesNoWithDetails('physicalAssistance', 'Is there any physical assistance or physical assistance preference for this Participant?', 'physicalAssistanceOthers')}
            {renderYesNoWithDetails('languageConcern', 'Does the Participant have any expressive language concerns?', 'languageConcernOthers')}
            {renderYesNoWithDetails('personalGoals', 'Does this Participant have any personal preferences & personal goals?')}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2_BULLETPROOF;
