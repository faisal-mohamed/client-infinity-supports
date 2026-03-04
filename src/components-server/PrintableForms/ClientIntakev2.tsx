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

// Define styles with proper @react-pdf/renderer syntax
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 10, // Gap between pages
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 10,
    marginBottom: 15,
    height: 40,
  },
  headerLogo: {
    width: 220,
    height: 70,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    paddingTop: 10,
    fontSize: 10,
    height: 30,
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
    breakInside: 'avoid', // Prevents sections from breaking across pages
    pageBreakInside: 'avoid', // Alternative syntax
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000', // Changed to black
    backgroundColor: '#e5e7eb',
    padding: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    gap: 8,
    paddingVertical: 4,
  },
  label: {
    width: 140,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    paddingRight: 8,
  },
  fullWidthLabel: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    paddingRight: 8,
  },
  singleBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    border: '1 solid #000000',
    backgroundColor: '#ffffff',
  },
  questionText: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    flex: 1,
    marginRight: 10,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    paddingRight: 16,
    borderBottom: '1 solid #000000',
    paddingBottom: 4,
    minHeight: 16,
  },
  longAnswer: {
    marginBottom: 10,
    breakInside: 'avoid', // Prevents breaking inside the answer box
    pageBreakInside: 'avoid', // Alternative syntax for some versions
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 9,
    color: '#374151',
  },
  longAnswerValue: {
    border: '1 solid #000000',
    padding: 8,
    minHeight: 20, // Minimal height for border visibility
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.4,
    breakInside: 'auto',
    pageBreakInside: 'auto',
    backgroundColor: '#ffffff',
    flexGrow: 1,
    flexShrink: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  verticalRadioGroup: {
    flexDirection: 'column',
    gap: 5,
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
    backgroundColor: '#000000',
  },
  tickMark: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pageBreak: {
    breakBefore: 'page',
  },
  pageGap: {
    marginBottom: 20,
    height: 20,
  },
});

interface ClientIntakePDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakev2: React.FC<ClientIntakePDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  console.log('🔍 ClientIntakev2.tsx (@react-pdf/renderer) is being used for PDF generation');
  console.log('📊 Form data keys:', Object.keys(formData || {}));
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

  // Get report date - no fallback
  const getReportDate = (): string => {
    const dateValue = settings?.review_date;

    if (dateValue) {
      const formatted = formatDate(dateValue);
      if (formatted) {
        return formatted;
      }
    }

    return '';
  };

  // Get form ID - no fallback
  const getFormId = (): string => {
    const formId = settings?.client_intake_form_id;
    return formId || '';
  };

  // Get website - no fallback
  const getWebsite = (): string => {
    const website = settings?.company_website;
    return website || '';
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

  // Helper function to calculate dynamic height for long text
  const calculateTextHeight = (text: string, maxHeight: number = 200): number => {
    if (!text) return 50;

    const lines = text.split('\n').length;
    const estimatedHeight = Math.max(50, lines * 12 + 20); // 12px per line + padding

    return Math.min(estimatedHeight, maxHeight); // Cap at maxHeight
  };

  // Helper function to calculate dynamic height for "All About Me" based on content length
  const calculateDynamicAboutMeHeight = (content: string, maxWords: number = 1000): number => {
    if (!content || content.trim() === '') return 100; // Minimum height for empty content

    const wordCount = content.trim().split(/\s+/).length;
    const characterCount = content.length;

    // Base height for minimum content
    const baseHeight = 120;

    // Calculate height based on content length (up to maxWords)
    const contentRatio = Math.min(wordCount / maxWords, 1); // Cap at 1.0 for maxWords
    const maxHeight = 800; // Maximum height for 1000 words
    const minHeight = 120;  // Minimum height

    // Calculate dynamic height based on both word count and character count
    const wordBasedHeight = minHeight + (contentRatio * (maxHeight - minHeight));
    const characterBasedHeight = Math.max(120, (characterCount / 50) * 20); // ~20px per 50 characters

    // Use the larger of the two calculations to ensure content fits
    const dynamicHeight = Math.max(wordBasedHeight, characterBasedHeight);

    // Ensure minimum height for any content
    return Math.max(dynamicHeight, baseHeight);
  };

  // Helper function to calculate dynamic height for "otherSupports" (500 words)
  const calculateOtherSupportsHeight = (content: string, maxWords: number = 500): number => {
    if (!content || content.trim() === '') return 40; // Very small height for empty content

    const wordCount = content.trim().split(/\s+/).length;
    const characterCount = content.length;

    // Base height for minimum content - very small for truly empty content
    const baseHeight = 40;

    // Calculate height based on content length (up to maxWords)
    const contentRatio = Math.min(wordCount / maxWords, 1); // Cap at 1.0 for maxWords
    const maxHeight = 400; // Maximum height for 500 words
    const minHeight = 40;  // Very small minimum height

    // Calculate dynamic height based on both word count and character count
    const wordBasedHeight = minHeight + (contentRatio * (maxHeight - minHeight));
    const characterBasedHeight = Math.max(40, (characterCount / 50) * 20); // ~20px per 50 characters, minimum 40px

    // Use the larger of the two calculations to ensure content fits
    const dynamicHeight = Math.max(wordBasedHeight, characterBasedHeight);

    // Ensure minimum height for any content
    return Math.max(dynamicHeight, baseHeight);
  };

  // Helper function to get content stats for "All About Me"
  const getAboutMeStats = (content: string) => {
    if (!content || content.trim() === '') return { words: 0, characters: 0, percentage: 0 };

    const words = content.trim().split(/\s+/).length;
    const characters = content.trim().length;
    const percentage = Math.min((words / 1000) * 100, 100);

    return { words, characters, percentage };
  };

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
        <View style={[styles.longAnswerValue, {
          marginTop: 4,
          flexGrow: 1,
          flexShrink: 1
        }]}>
          <Text>Details: {getValue(detailsField)}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Document>
      {/* PAGE 1: Personal Information */}
      <Page size="A4" style={styles.page}>
        {/* Header - Fixed at top of every page */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Section 1: Participant Details - Matching Image Structure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participant Details</Text>

            {/* Date - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{getValue('date') || ' '}</Text>
            </View>

            {/* NDIS Number - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>NDIS Number:</Text>
              <Text style={styles.value}>{getValue('ndisNumber') || ' '}</Text>
            </View>

            {/* Given Names - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Given name(s):</Text>
              <Text style={styles.value}>{getValue('givenName') || ' '}</Text>
            </View>

            {/* Surname - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Surname:</Text>
              <Text style={styles.value}>{getValue('surname') || ' '}</Text>
            </View>

            {/* Sex Field - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Sex:</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioItem}>
                  {renderCheckbox(getValue('sex') === 'Male')}
                  <Text>Male</Text>
                </View>
                <View style={styles.radioItem}>
                  {renderCheckbox(getValue('sex') === 'Female')}
                  <Text>Female</Text>
                </View>
                <View style={styles.radioItem}>
                  {renderCheckbox(getValue('sex') === 'Prefer not to say')}
                  <Text>Prefer not to say</Text>
                </View>
              </View>
            </View>

            {/* Pronoun Field - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Pronoun:</Text>
              <Text style={styles.value}>{getValue('pronoun') || ' '}</Text>
            </View>

            {/* Aboriginal/Torres Strait Island - Single Box with Horizontal Checkboxes */}
            <View style={styles.fieldRow}>
              <View style={styles.singleBox}>
                <Text style={styles.questionText}>Are you an Aboriginal or Torres Strait Island descent?</Text>
                <View style={styles.radioGroup}>
                  <View style={styles.radioItem}>
                    {renderCheckbox(getValue('aboriginalTorres') === 'Yes')}
                    <Text>Yes</Text>
                  </View>
                  <View style={styles.radioItem}>
                    {renderCheckbox(getValue('aboriginalTorres') === 'No')}
                    <Text>No</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Preferred Name - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Preferred name:</Text>
              <Text style={styles.value}>{getValue('preferredName') || ' '}</Text>
            </View>

            {/* Date of Birth - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{getValue('dateOfBirth') || ' '}</Text>
            </View>
          </View>

          {/* Section 2: Residential Address Details - Matching Image Structure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Residential Address Details</Text>

            {/* Number / Street - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Number / Street:</Text>
              <Text style={styles.value}>{getValue('addressNumberStreet') || ' '}</Text>
            </View>

            {/* State - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>State:</Text>
              <Text style={styles.value}>{getValue('state') || ' '}</Text>
            </View>

            {/* Postcode - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Postcode:</Text>
              <Text style={styles.value}>{getValue('postcode') || ' '}</Text>
            </View>
          </View>

          {/* Section 3: Participant Contact Details - Matching Image Structure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participant Contact Details</Text>

            {/* Email Address - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email address:</Text>
              <Text style={styles.value}>{getValue('email') || ' '}</Text>
            </View>

            {/* Home Phone No - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Home Phone No:</Text>
              <Text style={styles.value}>{getValue('homePhone') || ' '}</Text>
            </View>

            {/* Mobile No - Single Row */}
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Mobile No:</Text>
              <Text style={styles.value}>{getValue('mobile') || ' '}</Text>
            </View>
          </View>

          {/* Section 4: Disability Conditions - FULL BOX CONTAINER */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disability Conditions/Disability type(s)</Text>
            <View style={[styles.longAnswer, {
              minHeight: 200 // Ensure full container size
            }]}>
              <View style={[styles.longAnswerValue, {
                width: '100%', // Full width container
                border: '1 solid #000000', // Clear border
                backgroundColor: '#ffffff', // White background
                padding: 10, // More padding for better appearance
                flexGrow: 1,
                flexShrink: 1
              }]}>
                <Text style={{
                  fontSize: 10,
                  lineHeight: 1.4,


                }}>
                  {getValue('disabilityConditions') || ' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer - Fixed at bottom of every page */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 2: Medical Contact & Support Coordinator */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          {/* Section 1: GP Medical Contact - Compact Design */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { padding: 0, fontSize: 8, height: 5 }]}>GP Medical Contact</Text>

            {/* Medical Centre Name - Ultra Compact */}
            <View style={[styles.fieldRow, { height: 5, marginBottom: 1 }]}>
              <Text style={[styles.label, { fontSize: 8 }]}>Medical Centre Name:</Text>
              <Text style={[styles.value, { fontSize: 8, minHeight: 5 }]}>{getValue('medicalCentreName')}</Text>
            </View>

            {/* Phone - Ultra Compact */}
            <View style={[styles.fieldRow, { height: 5, marginBottom: 1 }]}>
              <Text style={[styles.label, { fontSize: 8 }]}>Phone:</Text>
              <Text style={[styles.value, { fontSize: 8, minHeight: 5 }]}>{getValue('medicalPhone')}</Text>
            </View>
          </View>

          {/* Section 2: Support Coordinator - Compact Design */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { padding: 0, fontSize: 8, height: 5 }]}>Support Coordinator</Text>

            {/* Name - Ultra Compact */}
            <View style={[styles.fieldRow, { height: 5, marginBottom: 1 }]}>
              <Text style={[styles.label, { fontSize: 8 }]}>Name:</Text>
              <Text style={[styles.value, { fontSize: 8, minHeight: 5 }]}>{getValue('supportCoordinatorName')}</Text>
            </View>

            {/* Email Address - Ultra Compact */}
            <View style={[styles.fieldRow, { height: 5, marginBottom: 1 }]}>
              <Text style={[styles.label, { fontSize: 8 }]}>Email Address:</Text>
              <Text style={[styles.value, { fontSize: 8, minHeight: 5 }]}>{getValue('supportCoordinatorEmail')}</Text>
            </View>

            {/* Company - Ultra Compact */}
            <View style={[styles.fieldRow, { height: 5, marginBottom: 1 }]}>
              <Text style={[styles.label, { fontSize: 8 }]}>Company:</Text>
              <Text style={[styles.value, { fontSize: 8, minHeight: 5 }]}>{getValue('supportCoordinatorCompany')}</Text>
            </View>

            {/* Contact Number - Ultra Compact */}
            <View style={[styles.fieldRow, { height: 5, marginBottom: 1 }]}>
              <Text style={[styles.label, { fontSize: 8 }]}>Contact number:</Text>
              <Text style={[styles.value, { fontSize: 8, minHeight: 5 }]}>{getValue('supportCoordinatorContact')}</Text>
            </View>
          </View>

          {/* Section 3: Other Supports - Simplified Structure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What other supports including mainstream health services you receive at present</Text>
            <View style={[styles.longAnswerValue, {
              minHeight: 20, // Minimal height - just enough for border visibility
              border: '1 solid #000000',
              padding: 8,
              backgroundColor: '#ffffff',
              fontSize: 10,
              color: '#111827',
              lineHeight: 1.4,
              breakInside: 'auto',
              pageBreakInside: 'auto',
              flexGrow: 1,
              flexShrink: 1
            }]}>
              <Text style={{
                fontSize: 10,
                lineHeight: 1.4,


                flexShrink: 1
              }}>
                {getValue('otherSupports') || ' '}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 3: All About Me - Dynamic Sizing */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All About Me</Text>
            <View style={styles.longAnswer}>
              <View style={[styles.longAnswerValue, {
                minHeight: 120, // Minimum height for any content
                flexGrow: 1,
                flexShrink: 1
              }]}>
                <Text style={{
                  fontSize: 10,
                  lineHeight: 1.4,


                }}>
                  {getValue('aboutMe') || ' '}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 4: Advocate Details */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
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
                <Text>{getValue('advocateOtherInfo')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 5: Personal Situation */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
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

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 6: Contact Details & Living Arrangements */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
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
                <Text>Live with Parent/Family/Support Person</Text>
                <Text>Live in private rental arrangement with others</Text>
                <Text>Live in private rental arrangement alone</Text>
                <Text>Owns own home.</Text>
                <Text>Aged Care Facility</Text>
                <Text>Mental Health Facility</Text>
                <Text>Lives in public housing</Text>
                <Text>Short Term Crisis/Respite</Text>
                <Text>Staff Supported Group Home</Text>
                <Text>Hostel/SRS Private Accommodation</Text>
                <Text>Other: {getValue('livingArrangementsOther')}</Text>
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
                <Text>Taxi</Text>
                <Text>Pick up/ drop off by Parent/Family/Support Person</Text>
                <Text>Transport by a provider</Text>
                <Text>Independently use Public Transport</Text>
                <Text>Walk</Text>
                <Text>Assisted Public Transport</Text>
                <Text>Drive own car.</Text>
                <Text>Other: {getValue('travelArrangementsOther')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 7: Medical Information */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
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

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>

      {/* PAGE 8: Safety Considerations */}
      <Page size="A4" style={[styles.page, styles.pageBreak]}>
        <View style={styles.header} fixed>
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

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Review Date: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2;