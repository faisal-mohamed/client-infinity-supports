import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Define styles with proper @react-pdf/renderer syntax
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingTop: 60,
    paddingBottom: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 30,
    marginBottom: 40,
    height: 100,
  },
  headerLogo: {
    width: 180,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
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
    breakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    breakInside: 'avoid',
    gap: 15,
  },
  label: {
    width: 160,
    fontWeight: 'bold',
    fontSize: 10,
    color: '#374151',
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#111827',
  },
  longAnswer: {
    marginBottom: 18,
    breakInside: 'avoid',
  },
  longAnswerLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  longAnswerValue: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    minHeight: 40,
    padding: 12,
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 6,
  },
});

interface PersonCentredPlanPDFProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const PersonCentredPlanPDF: React.FC<PersonCentredPlanPDFProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}) => {
  // Debug logging to see what data we're getting
  console.log('🔍 Person Centred Plan SIMPLE PDF - Form Data Keys:', Object.keys(formData || {}));
  console.log('🔍 Person Centred Plan SIMPLE PDF - Form Data Sample:', {
    respiratoryHistory: formData?.respiratoryHistory,
    precautions: formData?.precautions,
    companionCard: formData?.companionCard,
    ambulanceCover: formData?.ambulanceCover,
    healthConditions: formData?.healthConditions,
  });
  
  // Check if all health fields have the same value
  const healthFields = ['respiratoryHistory', 'precautions', 'companionCard', 'ambulanceCover', 'healthConditions'];
  const healthValues = healthFields.map(field => formData?.[field]);
  const allSame = healthValues.every(val => val === healthValues[0]);
  console.log('🔍 Person Centred Plan SIMPLE PDF - All health fields same value?', allSame);
  console.log('🔍 Person Centred Plan SIMPLE PDF - Health field values:', healthValues);

  // Simple getValue function
  const getValue = (key: string): string => {
    try {
      const value = formData?.[key] || commonFieldsData?.[key] || '';
      console.log(`🔍 Person Centred Plan SIMPLE PDF - Getting value for ${key}:`, value);
      return value;
    } catch {
      return '';
    }
  };

  // Simple formatDate function
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

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>Person Centred Plan</Text>
          
          {/* Section 1: Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Personal Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{getValue('name')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{getValue('address')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{formatDate(getValue('dob'))}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Guardian:</Text>
              <Text style={styles.value}>{getValue('guardian')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact Number:</Text>
              <Text style={styles.value}>{getValue('contactNumber')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Disability:</Text>
              <Text style={styles.value}>{getValue('disability')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>NDIS Number:</Text>
              <Text style={styles.value}>{getValue('ndisNumber')}</Text>
            </View>
          </View>

          {/* Section 2: Personal Story & Background */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Personal Story & Background:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>My Story:</Text>
              <Text style={styles.longAnswerValue}>{getValue('myStory') || 'No story provided'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Strengths:</Text>
              <Text style={styles.longAnswerValue}>{getValue('strengths') || 'No strengths recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Challenges:</Text>
              <Text style={styles.longAnswerValue}>{getValue('challenges') || 'No challenges recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Allergies:</Text>
              <Text style={styles.longAnswerValue}>{getValue('allergies') || 'No known allergies'}</Text>
            </View>
          </View>

          {/* Section 3: Health Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Health Information:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Respiratory History:</Text>
              <Text style={styles.longAnswerValue}>{getValue('respiratoryHistory') || 'No respiratory history recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Precautions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('precautions') || 'No precautions recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Health Conditions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('healthConditions') || 'No health conditions recorded'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Companion Card:</Text>
              <Text style={styles.value}>{getValue('companionCard') || 'No'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Ambulance Cover:</Text>
              <Text style={styles.value}>{getValue('ambulanceCover') || 'No'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Proactive & preventative healthcare prompts:</Text>
              <Text style={styles.value}>{getValue('healthcarePrompt') || 'No'}</Text>
            </View>
          </View>

          {/* Section 4: Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Goals:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Goal 1:</Text>
              <Text style={styles.longAnswerValue}>{getValue('goal1') || 'No goals recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Goal 2:</Text>
              <Text style={styles.longAnswerValue}>{getValue('goal2') || ''}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Goal 3:</Text>
              <Text style={styles.longAnswerValue}>{getValue('goal3') || ''}</Text>
            </View>
          </View>

          {/* Section 5: Support Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Support Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>PBS Support Plan included?</Text>
              <Text style={styles.value}>{getValue('pbsSupportPlanIncluded') || 'No'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Any Restrictive Practices?</Text>
              <Text style={styles.value}>{getValue('restrictivePractices') || 'No'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Name of organization:</Text>
              <Text style={styles.value}>{getValue('organizationName') || 'Not specified'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact person:</Text>
              <Text style={styles.value}>{getValue('contactPersonOrg') || 'Not specified'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact number:</Text>
              <Text style={styles.value}>{getValue('contactNumberOrg') || 'Not specified'}</Text>
            </View>
          </View>

          {/* Section 6: Informal Supports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Informal Supports:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support 1:</Text>
              <Text style={styles.longAnswerValue}>{getValue('support1') || 'No informal supports recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support 2:</Text>
              <Text style={styles.longAnswerValue}>{getValue('support2') || ''}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support 3:</Text>
              <Text style={styles.longAnswerValue}>{getValue('support3') || ''}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centre_plan_form_id || ''}</Text>
          <Text style={styles.footerText}>Date of Report: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;
