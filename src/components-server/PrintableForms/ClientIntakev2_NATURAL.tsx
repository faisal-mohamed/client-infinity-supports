import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Natural flow PDF generation - like Person Centred Plan
// Single page component with natural content flow
// No artificial text chunking - lets content flow naturally across pages

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 80,
    paddingBottom: 50,
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
  longAnswer: {
    marginBottom: 12,
    position: 'relative',
    breakInside: 'auto', // Allow natural page breaks
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 11,
    color: '#111827',
  },
  longAnswerValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.5,
    padding: 15,
    paddingBottom: 50, // 2-line space between text and container border
    border: '1 solid #d1d5db',
    backgroundColor: '#f9fafb',
    minHeight: 60,
    position: 'relative',
    breakInside: 'auto', // Allow natural page breaks
  },
  questionContainer: {
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: '1 solid #000',
    marginRight: 8,
  },
  radioButtonChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: '1 solid #000',
    backgroundColor: '#000',
    marginRight: 8,
  },
  radioLabel: {
    fontSize: 9,
    marginRight: 20,
  },
  detailsContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
    border: '1 solid #d1d5db',
    borderRadius: 4,
  },
});

const ClientIntakev2Natural: React.FC<any> = ({ formData }) => {
  const getValue = (key: string) => formData?.[key] || '';

  const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/\n\s*\n/g, '\n').trim();
  };

  const renderLongAnswer = (label: string, value: string) => {
    if (!value || value.trim() === '') return null;
    
    return (
      <View style={styles.longAnswer}>
        <Text style={styles.longAnswerLabel}>{label}</Text>
        <Text style={styles.longAnswerValue}>{cleanText(value)}</Text>
      </View>
    );
  };

  const renderQuestion = (fieldKey: string, label: string, detailsField?: string) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>{label}</Text>
      <View style={styles.radioGroup}>
        <View style={getValue(fieldKey) === "Yes" ? styles.radioButtonChecked : styles.radioButton} />
        <Text style={styles.radioLabel}>Yes</Text>
        <View style={getValue(fieldKey) === "No" ? styles.radioButtonChecked : styles.radioButton} />
        <Text style={styles.radioLabel}>No</Text>
      </View>
      {getValue(fieldKey) === "Yes" && detailsField && getValue(detailsField) && (
        <View style={styles.detailsContainer}>
          <Text style={styles.value}>{cleanText(getValue(detailsField))}</Text>
        </View>
      )}
    </View>
  );

  // Base logo (placeholder)
  const logoDataUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiIGZpbGw9IiMzYjgyZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbmZpbml0eSBTdXBwb3J0czwvdGV4dD48L3N2Zz4=";

  return (
    <Document>
      {/* Single Page with Natural Flow - Like Person Centred Plan */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{getValue('firstName')} {getValue('lastName')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{getValue('dateOfBirth')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{getValue('address')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{getValue('phone')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{getValue('email')}</Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{getValue('emergencyContactName')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Relationship:</Text>
            <Text style={styles.value}>{getValue('emergencyContactRelationship')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{getValue('emergencyContactPhone')}</Text>
          </View>
        </View>

        {/* Contact Details & Support Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details & Support Information</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>GP Name:</Text>
            <Text style={styles.value}>{getValue('gpName')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>GP Phone:</Text>
            <Text style={styles.value}>{getValue('gpPhone')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Medical Centre:</Text>
            <Text style={styles.value}>{getValue('medicalCentre')}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Medical Centre Phone:</Text>
            <Text style={styles.value}>{getValue('medicalPhone')}</Text>
          </View>
        </View>

        {/* Medical & Support Coordinator */}
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

        {/* What other supports - Natural Flow */}
        {renderLongAnswer('What other supports including mainstream health services you receive at present', getValue('otherSupports'))}

        {/* About Me - Natural Flow */}
        {renderLongAnswer('All About Me', getValue('aboutMe'))}

        {/* Disability Conditions - Natural Flow */}
        {renderLongAnswer('Disability Conditions', getValue('disabilityConditions'))}

        {/* Medical Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          {renderQuestion('medicationChart', 'Medication Chart')}
          {renderQuestion('epilepsy', 'Epilepsy')}
          {renderQuestion('allergies', 'Allergies')}
          {renderQuestion('diabetes', 'Diabetes')}
          {renderQuestion('highBloodPressure', 'High Blood Pressure')}
          {renderQuestion('heartCondition', 'Heart Condition')}
          {renderQuestion('asthma', 'Asthma')}
          {renderQuestion('otherMedical', 'Other Medical Conditions')}
        </View>

        {/* Safety Considerations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Considerations</Text>
          {renderQuestion('absconding', 'Absconding')}
          {renderQuestion('historyOfFalls', 'History of Falls')}
          {renderQuestion('behaviourConcern', 'Behaviour Concern')}
          {renderQuestion('selfHarm', 'Self Harm')}
          {renderQuestion('substanceAbuse', 'Substance Abuse')}
          {renderQuestion('otherSafety', 'Other Safety Concerns')}
        </View>

        {/* Advocate Details */}
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
        </View>

        {/* Cultural & Communication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural & Communication</Text>
          {renderLongAnswer('Cultural Values', getValue('culturalValues'))}
          {renderLongAnswer('Cultural Behaviours', getValue('culturalBehaviours'))}
          {renderLongAnswer('Written Communication', getValue('writtenCommunication'))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>infinitysupport@wa.com</Text>
          <Text style={styles.footerText}>A003 Review Date: 07/10/2025</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ClientIntakev2Natural;
