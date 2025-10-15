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
    padding: 0,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1 solid #e5e7eb',
  },
  headerLogo: {
    width: 60,
    height: 'auto',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderTop: '1 solid #e5e7eb',
    fontSize: 7,
  },
  footerText: {
    fontSize: 7,
    color: '#666666',
  },
  content: {
    marginTop: 50,
    marginBottom: 35,
    paddingHorizontal: 20,
    paddingTop: 15,
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
    marginBottom: 12,
    breakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  label: {
    width: 140,
    fontWeight: 'bold',
    fontSize: 8,
    color: '#374151',
  },
  value: {
    flex: 1,
    fontSize: 8,
    color: '#111827',
    marginLeft: 8,
  },
  longAnswer: {
    marginBottom: 8,
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 3,
    fontSize: 8,
    color: '#374151',
  },
  longAnswerValue: {
    border: '0.5 solid #d1d5db',
    borderRadius: 2,
    padding: 4,
    minHeight: 15,
    fontSize: 8,
    color: '#111827',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 8,
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
  signatureSection: {
    marginTop: 15,
    paddingTop: 10,
    borderTop: '1 solid #e5e7eb',
  },
  signatureBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  signatureItem: {
    flex: 1,
  },
  signatureLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 8,
  },
  signatureImage: {
    width: 120,
    height: 40,
    border: '1 solid #d1d5db',
    marginBottom: 4,
  },
  signatureDate: {
    fontSize: 7,
    color: '#666666',
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
      {/* Page 1: Title and General Information */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>{settings?.emergency_drill || 'ED-001'}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
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
        </View>
      </Page>

      {/* Page 2: Observations and Recommendations */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>{settings?.emergency_drill || 'ED-001'}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Section 4: Observations */}
          <View style={styles.section}>
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
        </View>
      </Page>

      {/* Page 3: Signatures */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>{settings?.emergency_drill || 'ED-001'}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
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
      </Page>
    </Document>
  );
};

export default EmergencyDrillPDF;

