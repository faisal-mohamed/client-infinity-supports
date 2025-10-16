import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles for Person Centred Plan with beautiful cover page
const styles = StyleSheet.create({
  // Cover page styles
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  coverHeader: {
    position: 'absolute',
    top: 40,
    right: 60,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  coverHeaderLogo: {
    width: 200,
    height: 60,
  },
  coverVerticalLine: {
    position: 'absolute',
    left: 80,
    top: 100,
    width: 2,
    height: 200,
    backgroundColor: '#9ca3af',
  },
  coverMainCircle: {
    position: 'absolute',
    top: 200,
    left: 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#f97316', // Orange
    border: '2 solid #f97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
  },
  coverBlueCircle1: {
    position: 'absolute',
    top: 120,
    left: 100,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#3b82f6', // Blue
    opacity: 0.3,
  },
  coverBlueCircle2: {
    position: 'absolute',
    top: 280,
    left: 80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#3b82f6', // Blue
    opacity: 0.3,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 60,
    fontSize: 10,
  },
  coverFooterText: {
    fontSize: 10,
    color: '#000000',
  },
  
  // Regular page styles
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
    
    // Keep empty if no date found (no fallback)
    console.log('⚠️ Person Centred Plan - No date found in settings, keeping empty');
    return '';
  };

  // Get form ID from settings
  const getFormId = (): string => {
    const formId = settings?.person_centre_plan_form_id || settings?.person_centred_plan;
    console.log('🔍 Person Centred Plan - Form ID found:', formId);
    return formId || '';
  };

  // Get email from settings
  const getEmail = (): string => {
    const email = settings?.from_email || settings?.email;
    console.log('🔍 Person Centred Plan - Email found:', email);
    return email || '';
  };

  return (
    <Document>
      {/* Cover Page with Beautiful Design */}
      <Page size="A4" style={styles.coverPage}>
        {/* Header with Logo */}
        <View style={styles.coverHeader}>
          <Image src={logoDataUrl} style={styles.coverHeaderLogo} />
        </View>
        
        {/* Vertical Grey Line */}
        <View style={styles.coverVerticalLine} />
        
        {/* Blue Circles (Background) */}
        <View style={styles.coverBlueCircle1} />
        <View style={styles.coverBlueCircle2} />
        
        {/* Main Orange Circle with Title */}
        <View style={styles.coverMainCircle}>
          <Text style={styles.coverTitle}>PERSON{'\n'}CENTRED PLAN</Text>
        </View>
        
        {/* Footer */}
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>{getEmail()}</Text>
          <Text style={styles.coverFooterText}>{getFormId()}</Text>
          <Text style={styles.coverFooterText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 1: Personal Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
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
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
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
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 3: Health Information */}
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
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 4: Goals */}
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
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* Page 5: Support Information & Informal Supports */}
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
          <Text style={styles.footerText}>{getEmail()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;
