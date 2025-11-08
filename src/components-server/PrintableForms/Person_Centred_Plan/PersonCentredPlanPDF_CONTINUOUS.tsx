import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles optimized for continuous content flow across pages
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingTop: 60,
    paddingBottom: 40,
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
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
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
  },
  longAnswerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
  },
  longAnswerValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
    padding: 4,
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 2,
  },
  continuousContent: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
    padding: 4,
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 2,
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
  const getValue = (key: string): string => {
    try {
      return formData?.[key] || commonFieldsData?.[key] || '';
    } catch {
      return '';
    }
  };

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
    
    console.log('🔍 Person Centred Plan - Settings keys:', Object.keys(settings || {}));
    console.log('🔍 Person Centred Plan - Date value found:', dateValue);
    
    if (dateValue) {
      const formatted = formatDate(dateValue);
      if (formatted) {
        console.log('✅ Person Centred Plan - Using settings date:', formatted);
        return formatted;
      }
    }
    
    // Fallback to current date
    const fallbackDate = new Date().toLocaleDateString();
    console.log('⚠️ Person Centred Plan - Using fallback date:', fallbackDate);
    return fallbackDate;
  };

  return (
    <Document>
      {/* Page 1: Cover + Personal Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSON CENTRED PLAN</Text>
          </View>

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
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 2: Personal Story & Background */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
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
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Challenges:</Text>
              <Text style={styles.longAnswerValue}>{getValue('challenges')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Allergies:</Text>
              <Text style={styles.longAnswerValue}>{getValue('allergies')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 3: Health Information - Start */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
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
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 4: Health Information - Continue */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Health Information (continued):</Text>
            
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
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 5: Goals */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
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
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings?.company_website || ''}</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || ''}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 6: Support Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
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
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;

