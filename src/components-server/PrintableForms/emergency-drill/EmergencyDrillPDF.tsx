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
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 10,
    marginBottom: 15,
    height: 40,
  },
  headerLogo: {
    width: 80,
    height: 'auto',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
    fontSize: 8,
    height: 30,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
    breakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 3,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
    breakInside: 'avoid',
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
    marginLeft: 10,
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
    marginLeft: 10,
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
    backgroundColor: '#000000',
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
    if (!dateString) return new Date().toLocaleDateString();
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return String(dateString);
    }
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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Emergency Drill Reporting Form</Text>
            <Text style={styles.subtitle}>(For Disability Support Workers in a Client's Home)</Text>
          </View>

          {/* Section 1: General Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. General Information</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date of Drill:</Text>
              <Text style={styles.value}>{getValue('drillDate')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Time of Drill:</Text>
              <Text style={styles.value}>{getValue('drillTime')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Client's Name:</Text>
              <Text style={styles.value}>{getValue('clientName')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Support Workers:</Text>
              <Text style={styles.value}>{getValue('supportWorkers')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Supervisor Notified:</Text>
              {renderRadioGroup('supervisorNotified', ['Yes', 'No'])}
            </View>
          </View>

          {/* Section 2: Drill Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Type of Emergency Drill</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Drill Type:</Text>
              <Text style={styles.value}>{getValue('selectedDrillType') || 'Not specified'}</Text>
            </View>
            
            {getValue('selectedDrillType') === 'Other (specify)' && (
              <View style={styles.fieldRow}>
                <Text style={styles.label}>Other Type:</Text>
                <Text style={styles.value}>{getValue('otherDrill')}</Text>
              </View>
            )}
          </View>

          {/* Section 3: Execution Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Drill Execution Details</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Plan Followed:</Text>
              {renderRadioGroup('planFollowed', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Safety Protocols:</Text>
              {renderRadioGroup('safetyProtocols', ['Yes', 'No'])}
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Services Contacted:</Text>
              {renderRadioGroup('servicesContacted', ['Yes', 'No'])}
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Client Response:</Text>
              <Text style={styles.longAnswerValue}>{getValue('clientResponse')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support Worker Actions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('supportAction')}</Text>
            </View>
          </View>

          {/* Section 4: Observations - Force page break */}
          <View style={[styles.section, styles.pageBreak]}>
            <Text style={styles.sectionTitle}>4. Observations & Challenges</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>What went well:</Text>
              <Text style={styles.longAnswerValue}>{getValue('whatWentWell')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Challenges encountered:</Text>
              <Text style={styles.longAnswerValue}>{getValue('challenges')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Unexpected issues:</Text>
              <Text style={styles.longAnswerValue}>{getValue('unexpectedIssues')}</Text>
            </View>
          </View>

          {/* Section 5: Recommendations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Recommendations & Improvements</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Procedure changes:</Text>
              <Text style={styles.longAnswerValue}>{getValue('procedureChanges')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Additional training needed:</Text>
              {renderRadioGroup('additionalTrainingRequired', ['Yes', 'No'])}
            </View>
            
            {getValue('additionalTrainingRequired') === 'Yes' && (
              <View style={styles.longAnswer}>
                <Text style={styles.longAnswerLabel}>Training details:</Text>
                <Text style={styles.longAnswerValue}>{getValue('trainingDetails')}</Text>
              </View>
            )}
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Plan updates needed:</Text>
              {renderRadioGroup('planUpdateNeeded', ['Yes', 'No'])}
            </View>
            
            {getValue('planUpdateNeeded') === 'Yes' && (
              <View style={styles.longAnswer}>
                <Text style={styles.longAnswerLabel}>Update details:</Text>
                <Text style={styles.longAnswerValue}>{getValue('planUpdateDetails')}</Text>
              </View>
            )}
          </View>

          {/* Section 6: Follow-up */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Follow-Up Actions</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Debrief conducted:</Text>
              {renderRadioGroup('debriefConducted', ['Yes', 'No'])}
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Supervisor comments:</Text>
              <Text style={styles.longAnswerValue}>{getValue('supervisorComments')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Next drill date:</Text>
              <Text style={styles.value}>{getValue('nextDrillDate')}</Text>
            </View>
          </View>

          {/* Section 7: Signatures */}
          <View style={styles.signatureSection}>
            <Text style={styles.sectionTitle}>7. Signatures</Text>
            
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
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>{settings?.emergency_drill || 'ED-001'}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EmergencyDrillPDF;