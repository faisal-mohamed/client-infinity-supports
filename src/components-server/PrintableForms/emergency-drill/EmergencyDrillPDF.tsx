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
    padding: 50,
    paddingTop: 40,
    paddingBottom: 20,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
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
  titleSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 0,
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    marginLeft: 0,
    color: '#000000',
  },
  subtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    marginLeft: 0,
    color: '#333333',
  },
  section: {
    marginBottom: 25,
    breakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    breakInside: 'avoid',
    gap: 10,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
  },
  bulletLabel: {
    width: 250,
    fontSize: 10,
    color: '#1f2937',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
  },
  longAnswer: {
    marginBottom: 10,
    breakInside: 'avoid',
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 9,
    color: '#374151',
  },
  longAnswerValue: {
    border: '0.5 solid #d1d5db',
    borderRadius: 3,
    padding: 6,
    minHeight: 20,
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
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
  tickMark: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  signatureSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1 solid #e5e7eb',
    breakInside: 'avoid',
  },
  signatureBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
  },
  signatureItem: {
    flex: 1,
    breakInside: 'avoid',
  },
  signatureLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 9,
    color: '#374151',
  },
  signatureImage: {
    width: 150,
    height: 50,
    border: '1 solid #d1d5db',
    marginBottom: 6,
  },
  signatureDate: {
    fontSize: 8,
    color: '#666666',
  },
  pageBreak: {
    breakBefore: 'page',
  },
});

interface EmergencyDrillPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const EmergencyDrillPDF: React.FC<EmergencyDrillPDFProps> = ({
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

  // Get report date with fallback to current date
  const getReportDate = (): string => {
    // Try multiple possible settings keys
    const dateValue = settings?.review_date || settings?.reviewDate || settings?.report_date || settings?.reportDate;
    
    console.log('🔍 Emergency Drill - Settings keys:', Object.keys(settings || {}));
    console.log('🔍 Emergency Drill - Date value found:', dateValue);
    
    if (dateValue) {
      const formatted = formatDate(dateValue);
      if (formatted) {
        console.log('✅ Emergency Drill - Using settings date:', formatted);
        return formatted;
      }
    }
    
    // Keep empty if no date found (no fallback)
    console.log('⚠️ Emergency Drill - No date found in settings, keeping empty');
    return '';
  };

  // Get form ID from settings
  const getFormId = (): string => {
    const formId = settings?.emergency_drill || settings?.emergency_drill_form_id;
    console.log('🔍 Emergency Drill - Form ID found:', formId);
    return formId || '';
  };

  // Get email from settings
  const getEmail = (): string => {
    const email = settings?.from_email || settings?.email;
    console.log('🔍 Emergency Drill - Email found:', email);
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Fixed at top of every page */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Section 1: General Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. General Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(1) Date of Drill:</Text>
              <Text style={styles.value}>{getValue('drillDate')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(2) Time of Drill:</Text>
              <Text style={styles.value}>{getValue('drillTime')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(3) Client's Name (if applicable):</Text>
              <Text style={styles.value}>{getValue('clientName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(4) Support Worker(s) Involved:</Text>
              <Text style={styles.value}>{getValue('supportWorkers')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(5) Supervisor/Manager Notified:</Text>
              {renderRadioGroup('supervisorNotified', ['Yes', 'No'])}
            </View>
          </View>

          {/* Section 2: Drill Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Type of Emergency Drill Conducted:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(1) Type:</Text>
              <Text style={styles.value}>{getValue('selectedDrillType') || 'Not specified'}</Text>
            </View>
            
            {getValue('selectedDrillType') === 'Other (specify)' && (
              <View style={styles.fieldRow}>
                <Text style={styles.bulletLabel}>(2) Please specify other drill type:</Text>
                <Text style={styles.value}>{getValue('otherDrill')}</Text>
              </View>
            )}
          </View>

          {/* Section 3: Execution Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Drill Execution Details:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(1) Was the emergency plan followed?</Text>
              {renderRadioGroup('planFollowed', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(2) Were all safety measures and protocols implemented?</Text>
              {renderRadioGroup('safetyProtocols', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(3) Emergency services contacted? (if applicable)</Text>
              {renderRadioGroup('servicesContacted', ['Yes', 'No'])}
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Client response and involvement:</Text>
              <Text style={styles.longAnswerValue}>{getValue('clientResponse')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support worker actions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('supportAction')}</Text>
            </View>
          </View>

          {/* Section 4: Observations - Force page break */}
          <View style={[styles.section, styles.pageBreak]}>
            <Text style={styles.sectionTitle}>4. Observations & Challenges:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>What went well?</Text>
              <Text style={styles.longAnswerValue}>{getValue('whatWentWell')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>What difficulties or challenges were encountered?</Text>
              <Text style={styles.longAnswerValue}>{getValue('challenges')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Any unexpected issues?</Text>
              <Text style={styles.longAnswerValue}>{getValue('unexpectedIssues')}</Text>
            </View>
          </View>

          {/* Section 5: Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Recommendations & Improvements:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Suggested changes to procedures:</Text>
              <Text style={styles.longAnswerValue}>{getValue('procedureChanges')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(1) Additional training or support required?</Text>
              {renderRadioGroup('additionalTrainingRequired', ['Yes', 'No'])}
            </View>
            
            {getValue('additionalTrainingRequired') === 'Yes' && (
              <View style={styles.longAnswer}>
                <Text style={styles.longAnswerLabel}>If yes, specify:</Text>
                <Text style={styles.longAnswerValue}>{getValue('trainingDetails')}</Text>
              </View>
            )}
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(2) Updates needed for the client's emergency plan?</Text>
              {renderRadioGroup('planUpdateNeeded', ['Yes', 'No'])}
            </View>
            
            {getValue('planUpdateNeeded') === 'Yes' && (
              <View style={styles.longAnswer}>
                <Text style={styles.longAnswerLabel}>If yes, specify:</Text>
                <Text style={styles.longAnswerValue}>{getValue('planUpdateDetails')}</Text>
              </View>
            )}
          </View>

          {/* Section 6: Follow-up */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Follow-Up Actions:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(1) Debrief conducted?</Text>
              {renderRadioGroup('debriefConducted', ['Yes', 'No'])}
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Supervisor/Manager Comments:</Text>
              <Text style={styles.longAnswerValue}>{getValue('supervisorComments')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(2) Date of Next Scheduled Drill:</Text>
              <Text style={styles.value}>{getValue('nextDrillDate')}</Text>
            </View>
          </View>

          {/* Section 7: Signatures */}
          <View style={styles.signatureSection}>
            <Text style={styles.sectionTitle}>7. Signatures:</Text>
            
            {/* Debug: Log signature date values */}
            {(() => {
              console.log('=== SIGNATURE DATES DEBUG ===');
              console.log('supportWorkerSignatureDate:', getValue('supportWorkerSignatureDate'));
              console.log('supervisorSignatureDate:', getValue('supervisorSignatureDate'));
              console.log('Formatted supportWorkerDate:', formatDate(getValue('supportWorkerSignatureDate')));
              console.log('Formatted supervisorDate:', formatDate(getValue('supervisorSignatureDate')));
              return null;
            })()}
            
            <View style={styles.signatureBlock}>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Support Worker:</Text>
                {getValue('supportWorkerSignature') ? (
                  <Image src={getValue('supportWorkerSignature')} style={styles.signatureImage} />
                ) : (
                  <View style={styles.signatureImage} />
                )}
                <Text style={styles.signatureDate}>
                  Date: {formatDate(getValue('supportWorkerSignatureDate'))}
                </Text>
              </View>

              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Supervisor/Manager:</Text>
                {getValue('supervisorSignature') ? (
                  <Image src={getValue('supervisorSignature')} style={styles.signatureImage} />
                ) : (
                  <View style={styles.signatureImage} />
                )}
                <Text style={styles.signatureDate}>
                  Date: {formatDate(getValue('supervisorSignatureDate'))}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer - Fixed at bottom of every page */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EmergencyDrillPDF;