import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet
} from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 110,
    paddingBottom: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
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
  subtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  fieldLabel: {
    width: 180,
    fontSize: 9,
    fontWeight: 'bold',
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
    paddingBottom: 2,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    border: '0.5 solid #000',
    marginRight: 4,
    backgroundColor: '#fff',
  },
  radioCircleSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    border: '0.5 solid #000',
    marginRight: 4,
    backgroundColor: '#000000',
  },
  radioLabel: {
    fontSize: 9,
  },
  textAreaField: {
    marginBottom: 10,
  },
  textAreaLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  textAreaValue: {
    padding: 8,
    minHeight: 50,
    fontSize: 9,
  },
  signatureBox: {
    border: '0.5 solid #000',
    padding: 12,
    marginBottom: 16,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  signatureGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  signatureItem: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 4,
  },
  signatureImageContainer: {
    border: '0.5 solid #ccc',
    padding: 8,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  signatureImage: {
    maxHeight: 50,
    maxWidth: 200,
    objectFit: 'contain',
  },
  signatureDate: {
    borderBottom: '0.5 solid #000',
    height: 24,
    fontSize: 9,
    paddingTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1 solid #ddd',
    paddingTop: 8,
    fontSize: 9,
    color: '#666',
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

  const getValue = (key: string): string => {
    // For clientName field, combine first name and surname to show full name
    if (key === 'clientName') {
      const firstName = commonFieldsData?.name || '';
      const surname = commonFieldsData?.surname || '';
      const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
      if (fullName) {
        return fullName;
      }
      // Fallback to formData.clientName if it exists
      if (formData?.[key]) {
        return String(formData[key]);
      }
      // Last fallback: try to get just the first name from commonFieldsData
      if (firstName) {
        return firstName;
      }
      return '';
    }

    if (commonFieldMapping?.[key]) {
      return commonFieldsData?.[commonFieldMapping[key]] ?? '';
    }
    return formData?.[key] ?? '';
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, 'dd/MM/yyyy');
    } catch {
      return dateString || '';
    }
  };

  const renderRadioGroup = (fieldName: string, options: string[]) => (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <View key={option} style={styles.radioItem}>
          <View
            style={
              getValue(fieldName) === option
                ? styles.radioCircleSelected
                : styles.radioCircle
            }
          />
          <Text style={styles.radioLabel}>{option}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header - appears on all pages (logo only) */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content - flows naturally with automatic page breaks */}
        <View>
          {/* Title - appears only on first page */}
          <Text style={styles.title}>Emergency Drill Reporting Form</Text>
          <Text style={styles.subtitle}>
            (For Disability Support Workers in a Client's Home)
          </Text>
          <View style={{ borderBottom: '0.5 solid #999', marginBottom: 16, marginTop: 12 }} />

          {/* Section 1: General Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. General Information:</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Date of Drill:</Text>
              <Text style={styles.fieldValue}>{formatDate(getValue('drillDate'))}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Time of Drill:</Text>
              <Text style={styles.fieldValue}>{getValue('drillTime')}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Client's Name (if applicable):</Text>
              <Text style={styles.fieldValue}>{getValue('clientName')}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Support Worker(s) Involved:</Text>
              <Text style={styles.fieldValue}>{getValue('supportWorkers')}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Supervisor/Manager Notified:</Text>
              {renderRadioGroup('supervisorNotified', ['Yes', 'No'])}
            </View>
          </View>

          {/* Section 2: Type of Emergency Drill */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Type of Emergency Drill Conducted:</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Selected Drill Type:</Text>
              <Text style={styles.fieldValue}>
                {getValue('selectedDrillType') || 'No selection made'}
              </Text>
            </View>

            {getValue('selectedDrillType') === 'Other (specify)' && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Please specify:</Text>
                <Text style={styles.fieldValue}>{getValue('otherDrill')}</Text>
              </View>
            )}
          </View>

          {/* Section 3: Drill Execution Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Drill Execution Details:</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Was the emergency plan followed?</Text>
              {renderRadioGroup('planFollowed', ['Yes', 'No'])}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Were all safety measures and protocols implemented?
              </Text>
              {renderRadioGroup('safetyProtocols', ['Yes', 'No'])}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Emergency services contacted? (if applicable)
              </Text>
              {renderRadioGroup('servicesContacted', ['Yes', 'No'])}
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>Client response and involvement:</Text>
              <Text style={styles.textAreaValue}>{getValue('clientResponse')}</Text>
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>Support worker actions:</Text>
              <Text style={styles.textAreaValue}>{getValue('supportAction')}</Text>
            </View>
          </View>

          {/* Section 4: Observations & Challenges */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Observations & Challenges:</Text>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>What went well?</Text>
              <Text style={styles.textAreaValue}>{getValue('whatWentWell')}</Text>
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>
                What difficulties or challenges were encountered?
              </Text>
              <Text style={styles.textAreaValue}>{getValue('challenges')}</Text>
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>Any unexpected issues?</Text>
              <Text style={styles.textAreaValue}>{getValue('unexpectedIssues')}</Text>
            </View>
          </View>

          {/* Section 5: Recommendations & Improvements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Recommendations & Improvements:</Text>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>Suggested changes to procedures:</Text>
              <Text style={styles.textAreaValue}>{getValue('procedureChanges')}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Additional training or support required?
              </Text>
              {renderRadioGroup('additionalTrainingRequired', ['Yes', 'No'])}
            </View>

            {getValue('additionalTrainingRequired') === 'Yes' && (
              <View style={styles.textAreaField}>
                <Text style={styles.textAreaLabel}>If yes, specify:</Text>
                <Text style={styles.textAreaValue}>{getValue('trainingDetails')}</Text>
              </View>
            )}

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>
                Updates needed for the client's emergency plan?
              </Text>
              {renderRadioGroup('planUpdateNeeded', ['Yes', 'No'])}
            </View>

            {getValue('planUpdateNeeded') === 'Yes' && (
              <View style={styles.textAreaField}>
                <Text style={styles.textAreaLabel}>If yes, specify:</Text>
                <Text style={styles.textAreaValue}>{getValue('planUpdateDetails')}</Text>
              </View>
            )}
          </View>

          {/* Section 6: Follow-Up Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Follow-Up Actions:</Text>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Debrief conducted?</Text>
              {renderRadioGroup('debriefConducted', ['Yes', 'No'])}
            </View>

            <View style={styles.textAreaField}>
              <Text style={styles.textAreaLabel}>Supervisor/Manager Comments:</Text>
              <Text style={styles.textAreaValue}>{getValue('supervisorComments')}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Date of Next Scheduled Drill:</Text>
              <Text style={styles.fieldValue}>{formatDate(getValue('nextDrillDate'))}</Text>
            </View>
          </View>
        </View>

        {/* Section 7: Signatures - Support Worker (wrap={false} to prevent splitting) */}
        {getValue('supportWorkerSignature') && (
          <View style={styles.signatureBox} wrap={false}>
            <Text style={styles.signatureTitle}>Support Worker Signature</Text>
            <View style={styles.signatureGrid}>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureImageContainer}>
                  <Image
                    src={getValue('supportWorkerSignature')}
                    style={styles.signatureImage}
                  />
                </View>
              </View>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Date:</Text>
                <Text style={styles.signatureDate}>
                  {formatDate(getValue('supportWorkerSignatureDate'))}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Section 7: Signatures - Supervisor (wrap={false} to prevent splitting) */}
        {getValue('supervisorSignature') && (
          <View style={styles.signatureBox} wrap={false}>
            <Text style={styles.signatureTitle}>Supervisor/Manager Signature</Text>
            <View style={styles.signatureGrid}>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <View style={styles.signatureImageContainer}>
                  <Image
                    src={getValue('supervisorSignature')}
                    style={styles.signatureImage}
                  />
                </View>
              </View>
              <View style={styles.signatureItem}>
                <Text style={styles.signatureLabel}>Date:</Text>
                <Text style={styles.signatureDate}>
                  {formatDate(getValue('supervisorSignatureDate'))}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Website: {settings?.company_website || ''}</Text>
          <Text>{settings?.emergency_drill || ''}</Text>
          <Text>Review Date: {settings?.review_date ? formatDate(settings.review_date) : ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EmergencyDrillPDF;
