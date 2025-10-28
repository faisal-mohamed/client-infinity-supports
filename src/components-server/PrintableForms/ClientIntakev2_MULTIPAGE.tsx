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
    height: 60,
  },
  headerLogo: {
    width: 180,
    height: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  section: {
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5,
    backgroundColor: '#e5e7eb',
    padding: 8,
    paddingTop: 10,
    paddingBottom: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    marginTop: 2,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    fontSize: 9,
  },
  value: {
    flex: 1,
    fontSize: 9,
  },
  questionContainer: {
    marginBottom: 12,
  },
  questionLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 9,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
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
  },
  checkboxChecked: {
    width: 8,
    height: 8,
    border: '1 solid #000000',
    marginRight: 3,
    backgroundColor: '#000000',
  },
  detailsContainer: {
    marginTop: 4,
    padding: 6,
    backgroundColor: '#f0f9ff',
    border: '1 solid #bfdbfe',
  },
  longText: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 12,
    marginTop: 5,
    padding: 15,
    border: '1 solid #d1d5db',
    backgroundColor: '#f9fafb',
    minHeight: 60,
    flexGrow: 1,
    flexShrink: 1,
    height: 'auto',
    breakInside: 'auto',
  },
  longTextTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111827',
  },
  textChunk: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 4,
  },
});

interface ClientIntakeFormPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakev2Multipage: React.FC<ClientIntakeFormPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  
  const getValue = (key: string): string => {
    return commonFieldsData?.[key] || formData?.[key] || '';
  };

  const cleanText = (text: string): string => {
    if (!text) return '';
    return text.replace(/My advocate always My advocate/g, 'My advocate').trim();
  };

  const renderCheckbox = (isChecked: boolean) => (
    <View style={isChecked ? styles.checkboxChecked : styles.checkbox} />
  );

  // Natural text flow - no artificial chunking
  // Let content flow naturally across pages like Person Centred Plan

  const renderLongTextField = (title: string, fieldKey: string) => {
    const text = cleanText(getValue(fieldKey));
    
    if (!text || text.trim() === '') {
      return (
        <View style={styles.section}>
          <Text style={styles.longTextTitle}>{title}</Text>
          <View style={styles.longText}>
            <Text>Not provided</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.longTextTitle}>{title}</Text>
        <View style={styles.longText}>
          <Text style={styles.textChunk}>{text}</Text>
        </View>
      </View>
    );
  };

  const renderQuestion = (fieldKey: string, label: string, detailsField?: string) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>{label}</Text>
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
        <View style={styles.detailsContainer}>
          <Text style={styles.longText}>{cleanText(getValue(detailsField))}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Document>
      {/* Single Page with Natural Flow - Like Person Centred Plan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

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
            <Text style={styles.value}>{getValue('dateOfBirth')}</Text>
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

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>

      {/* Dynamic Pages for About Me */}
      {aboutMeChunks.map((chunk, index) => (
        <Page key={`aboutme-${index}`} size="A4" style={styles.page}>
          <View style={styles.header} fixed>
            <Image src={logoDataUrl} style={styles.headerLogo} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              All About Me{aboutMeChunks.length > 1 ? ` (Part ${index + 1} of ${aboutMeChunks.length})` : ''}
            </Text>
            <View style={styles.longText}>
              <Text style={styles.textChunk}>{chunk || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>infinitysupport@wa.com</Text>
            <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
          </View>
        </Page>
      ))}

      {/* Page: Medical Questions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          {renderQuestion('medicationChart', 'Does the Participant require a Medication Chart?', 'medicationChartOthers')}
          {renderQuestion('mealtimeManagement', 'Does the Participant require Mealtime Management?')}
          {renderQuestion('epilepsy', 'Does the Participant have Epilepsy?', 'epilepsyOthers')}
          {renderQuestion('asthmatic', 'Is the Participant an Asthmatic?', 'asthmaticOthers')}
          {renderQuestion('allergies', 'Does the Participant have any allergies?', 'allergiesOthers')}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>

      {/* Page: Contact Details & Support Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Email:</Text>
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
          <Text style={styles.sectionTitle}>Disability Conditions</Text>
          <View style={styles.longText}>
            <Text style={styles.textChunk}>{getValue('disabilityConditions') || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>

      {/* Page: Medical & Support Coordinator */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
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
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{getValue('supportCoordinatorContact')}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>

      {/* Dynamic Pages for Other Supports */}
      {(() => {
        const otherSupportsText = cleanText(getValue('otherSupports'));
        const otherSupportsChunks = splitTextForPages(otherSupportsText, 800);
        
        return otherSupportsChunks.map((chunk, index) => (
          <Page key={`othersupports-${index}`} size="A4" style={styles.page}>
            <View style={styles.header} fixed>
              <Image src={logoDataUrl} style={styles.headerLogo} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                What other supports including mainstream health services you receive at present
                {otherSupportsChunks.length > 1 ? ` (Part ${index + 1} of ${otherSupportsChunks.length})` : ''}
              </Text>
              <View style={[styles.longText, { height: 'auto', minHeight: 'auto' }]}>
                <Text style={[styles.textChunk, { height: 'auto', minHeight: 'auto' }]}>{chunk || 'Not provided'}</Text>
              </View>
            </View>

            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>infinitysupport@wa.com</Text>
              <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
            </View>
          </Page>
        ));
      })()}

      {/* Page: Advocate Details */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advocate Details</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{getValue('advocateName')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{getValue('advocateEmail')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{getValue('advocatePhone')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{getValue('advocateMobile')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Relationship:</Text>
            <Text style={styles.value}>{getValue('advocateRelationship')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.longText}>
            <Text style={styles.textChunk}>{getValue('advocateOtherInfo') || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>

      {/* Page: Cultural & Communication */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural & Communication</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Language:</Text>
            <Text style={styles.value}>{getValue('language')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Country of Birth:</Text>
            <Text style={styles.value}>{getValue('countryOfBirth')}</Text>
          </View>
          {renderQuestion('barriers', 'Are there any cultural, communication barriers or intimacy issues?')}
          {renderQuestion('interpreter', 'Is an interpreter needed?')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural Values</Text>
          <View style={styles.longText}>
            <Text style={styles.textChunk}>{getValue('culturalValues') || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural Behaviours</Text>
          <View style={styles.longText}>
            <Text style={styles.textChunk}>{getValue('culturalBehaviours') || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Written Communication</Text>
          <View style={styles.longText}>
            <Text style={styles.textChunk}>{getValue('writtenCommunication') || 'Not provided'}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>

      {/* Page: Safety Questions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Considerations</Text>
          {renderQuestion('absconding', 'Does the Participant show signs of absconding?', 'abscondingOthers')}
          {renderQuestion('behaviourConcern', 'Are there any behaviours of concern?', 'behaviourConcernOthers')}
          {renderQuestion('communicationAssistance', 'Does the participant require communication assistance?', 'communicationAssistanceOthers')}
          {renderQuestion('historyOfFalls', 'Is this participant prone to falls or have a history of falls?')}
          {renderQuestion('positiveBehaviour', 'Is there a current Positive Behaviour Support Plan in place?', 'positiveBehaviourOthers')}
          {renderQuestion('physicalAssistance', 'Is there any physical assistance or physical assistance preference?', 'physicalAssistanceOthers')}
          {renderQuestion('languageConcern', 'Does the Participant have any expressive language concerns?', 'languageConcernOthers')}
          {renderQuestion('personalGoals', 'Does this Participant have any personal preferences & personal goals?')}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2Multipage;
