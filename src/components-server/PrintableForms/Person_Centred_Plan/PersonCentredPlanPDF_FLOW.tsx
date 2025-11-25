import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles optimized for proper page flow and content expansion
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingTop: 60, // Space for header
    paddingBottom: 40, // Space for footer
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.3,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1 solid #e5e7eb',
  },
  headerLogo: {
    width: 150,
    height: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    borderTop: '1 solid #e5e7eb',
    fontSize: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  section: {
    marginBottom: 15,
    breakInside: 'auto', // Allow natural page breaks
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
    breakAfter: 'avoid', // Keep title with first content
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
    breakInside: 'avoid', // Keep label and value together
    minHeight: 12,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
    flexShrink: 0,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.2,
  },
  longAnswer: {
    marginBottom: 10,
    breakInside: 'auto', // Allow natural page breaks for long content
  },
  longAnswerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
    breakAfter: 'avoid', // Keep label with content
  },
  longAnswerValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
    padding: 4,
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 2,
    breakInside: 'auto', // Allow content to flow across pages
  },
  pageBreak: {
    breakBefore: 'page', // Force new page
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
  // Simple getValue function
  const getValue = (key: string): string => {
    try {
      // For name field, combine first name and surname to show full name
      if (key === 'name') {
        const firstName = commonFieldsData?.name || '';
        const surname = commonFieldsData?.surname || '';
        const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
        if (fullName) {
          return fullName;
        }
        // Fallback to formData.name if it exists
        if (formData?.[key]) {
          return String(formData[key]);
        }
        // Last fallback: try to get just the first name from commonFieldsData
        if (firstName) {
          return firstName;
        }
        return '';
      }
      
      return formData?.[key] || commonFieldsData?.[key] || '';
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
      {/* Page 1: Cover + Personal Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          {/* Cover Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSON CENTRED PLAN</Text>
          </View>

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
              <Text style={styles.longAnswerValue}>{getValue('myStory')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Strengths:</Text>
              <Text style={styles.longAnswerValue}>{getValue('strengths')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>

      {/* Page 2: Continue Personal Story + Health Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          {/* Continue Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Personal Story & Background (continued):</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Challenges:</Text>
              <Text style={styles.longAnswerValue}>{getValue('challenges')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Allergies:</Text>
              <Text style={styles.longAnswerValue}>{getValue('allergies')}</Text>
            </View>
          </View>

          {/* Section 3: Health Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Health Information:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Respiratory History:</Text>
              <Text style={styles.longAnswerValue}>{getValue('respiratoryHistory')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Precautions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('precautions')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Health Conditions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('healthConditions')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Companion Card:</Text>
              <Text style={styles.value}>{getValue('companionCard')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Ambulance Cover:</Text>
              <Text style={styles.value}>{getValue('ambulanceCover')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>

      {/* Page 3: Goals + Support Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          {/* Section 4: Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Goals:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Goal 1:</Text>
              <Text style={styles.longAnswerValue}>{getValue('goal1')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Goal 2:</Text>
              <Text style={styles.longAnswerValue}>{getValue('goal2')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Goal 3:</Text>
              <Text style={styles.longAnswerValue}>{getValue('goal3')}</Text>
            </View>
          </View>

          {/* Section 5: Support Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Support Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>PBS Support Plan:</Text>
              <Text style={styles.value}>{getValue('pbsSupportPlanIncluded') || 'No'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Restrictive Practices:</Text>
              <Text style={styles.value}>{getValue('restrictivePractices') || 'No'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Organization:</Text>
              <Text style={styles.value}>{getValue('organizationName') || 'Not specified'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact Person:</Text>
              <Text style={styles.value}>{getValue('contactPersonOrg') || 'Not specified'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Contact Number:</Text>
              <Text style={styles.value}>{getValue('contactNumberOrg') || 'Not specified'}</Text>
            </View>
          </View>

          {/* Section 6: Informal Supports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Informal Supports:</Text>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support 1:</Text>
              <Text style={styles.longAnswerValue}>{getValue('support1')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support 2:</Text>
              <Text style={styles.longAnswerValue}>{getValue('support2')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Support 3:</Text>
              <Text style={styles.longAnswerValue}>{getValue('support3')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;

