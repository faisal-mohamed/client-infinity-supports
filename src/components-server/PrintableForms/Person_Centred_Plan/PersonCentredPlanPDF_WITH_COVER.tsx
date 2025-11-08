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
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
  coverHeaderLogo: {
    width: 300,
    height: 90,
  },
  coverMainCircle: {
    position: 'absolute',
    top: 380,
    left: 200,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#f0ad7a', // Less bright orange
    border: '1 solidrgb(221, 163, 111)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  coverTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    lineHeight: 1.2,
  },
  coverBlueCircle1: {
    position: 'absolute',
    top: 300,
    left: 120,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#a8d8ea', // Less bright blue
    opacity: 0.7,
    zIndex: 3,
  },
  coverBlueCircle2: {
    position: 'absolute',
    top: 440,
    left: 100,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#a8d8ea', // Less bright blue
    opacity: 0.7,
    zIndex: 3,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
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
    width: 200,
    height: 55,
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
  
  // Goal Card Styles
  goalCard: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    border: '1 solid #e5e7eb',
    borderRadius: 6,
    breakInside: 'auto', // Allow card to break across pages
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
  },
  outcomeRating: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#10b981', // Green color
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  goalDescription: {
    marginBottom: 8,
  },
  goalDescriptionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
  },
  goalDescriptionValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    padding: 6,
    backgroundColor: '#ffffff',
    border: '1 solid #e5e7eb',
    borderRadius: 3,
  },
  goalActions: {
    marginBottom: 8,
  },
  goalActionsLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
  },
  goalActionsValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    padding: 6,
    backgroundColor: '#ffffff',
    border: '1 solid #e5e7eb',
    borderRadius: 3,
  },
  goalMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTop: '1 solid #e5e7eb',
  },
  goalMetadataItem: {
    fontSize: 8,
    color: '#6b7280',
  },
  
  // Table Styles
  table: {
    marginBottom: 15,
    border: '1 solid #e5e7eb',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #e5e7eb',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    color: '#111827',
    textAlign: 'left',
  },
  tableCellCenter: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    color: '#111827',
    textAlign: 'center',
  },
  
  // Support Information Table (2 columns)
  supportTable: {
    marginBottom: 15,
  },
  supportTableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    minHeight: 20,
  },
  supportTableLabel: {
    width: 200,
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    backgroundColor: '#f9fafb',
    borderRight: '1 solid #e5e7eb',
  },
  supportTableValue: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    color: '#111827',
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
  console.log('🔍 Person Centred Plan PDF - Form Data Keys:', Object.keys(formData || {}));
  console.log('🔍 Person Centred Plan PDF - Form Data Sample:', {
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
  console.log('🔍 Person Centred Plan PDF - All health fields same value?', allSame);
  console.log('🔍 Person Centred Plan PDF - Health field values:', healthValues);

  const getValue = (key: string): string => {
    try {
      const value = formData?.[key] || commonFieldsData?.[key] || '';
      console.log(`🔍 Person Centred Plan PDF - Getting value for ${key}:`, value);
      return value;
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
  const getWebsite = (): string => {
    const website = settings?.company_website;
    console.log('🔍 Person Centred Plan - Website found:', website);
    return website || '';
  };

  return (
    <Document>
      {/* Cover Page with Beautiful Design */}
      <Page size="A4" style={styles.coverPage}>
        {/* Header with Logo */}
        <View style={styles.coverHeader}>
          <Image src={logoDataUrl} style={styles.coverHeaderLogo} />
        </View>
        
        {/* Blue Circles (Background) */}
        <View style={styles.coverBlueCircle1} />
        <View style={styles.coverBlueCircle2} />
        
        {/* Main Orange Circle with Title */}
        <View style={styles.coverMainCircle}>
          <Text style={styles.coverTitle}>PERSON{'\n'}CENTRED PLAN</Text>
        </View>
        
        {/* Footer */}
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>{getWebsite()}</Text>
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
          <Text style={styles.footerText}>{getWebsite()}</Text>
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
          <Text style={styles.footerText}>{getWebsite()}</Text>
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
              <Text style={styles.longAnswerValue}>{getValue('respiratoryHistory') || 'No respiratory history recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Precautions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('precautions') || 'No precautions noted'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Health Conditions:</Text>
              <Text style={styles.longAnswerValue}>{getValue('healthConditions') || 'No health conditions recorded'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Companion Card:</Text>
              <Text style={styles.longAnswerValue}>{getValue('companionCard') || 'Not specified'}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Ambulance Cover:</Text>
              <Text style={styles.longAnswerValue}>{getValue('ambulanceCover') || 'Not specified'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
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
            
            {/* Goal 1 Card */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Goal 1</Text>
                <Text style={styles.outcomeRating}>New Goal</Text>
              </View>
              
              <View style={styles.goalDescription}>
                <Text style={styles.goalDescriptionLabel}>Goal Description:</Text>
                <Text style={styles.goalDescriptionValue}>{getValue('goal1') || 'No goal description provided'}</Text>
              </View>
              
              <View style={styles.goalActions}>
                <Text style={styles.goalActionsLabel}>Actions & Resources:</Text>
                <Text style={styles.goalActionsValue}>{getValue('actions1') || 'No actions specified'}</Text>
              </View>
              
              <View style={styles.goalMetadata}>
                <Text style={styles.goalMetadataItem}>By Whom: {getValue('byWhom1') || 'Not specified'}</Text>
                <Text style={styles.goalMetadataItem}>By When: {formatDate(getValue('byWhen1')) || 'Not specified'}</Text>
                <Text style={styles.goalMetadataItem}>Review Date: {formatDate(getValue('reviewDate1')) || 'Not specified'}</Text>
              </View>
            </View>
            
            {/* Goal 2 Card */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Goal 2</Text>
                <Text style={styles.outcomeRating}>Not Achieved</Text>
              </View>
              
              <View style={styles.goalDescription}>
                <Text style={styles.goalDescriptionLabel}>Goal Description:</Text>
                <Text style={styles.goalDescriptionValue}>{getValue('goal2') || 'No goal description provided'}</Text>
              </View>
              
              <View style={styles.goalActions}>
                <Text style={styles.goalActionsLabel}>Actions & Resources:</Text>
                <Text style={styles.goalActionsValue}>{getValue('actions2') || 'No actions specified'}</Text>
              </View>
              
              <View style={styles.goalMetadata}>
                <Text style={styles.goalMetadataItem}>By Whom: {getValue('byWhom2') || 'Not specified'}</Text>
                <Text style={styles.goalMetadataItem}>By When: {formatDate(getValue('byWhen2')) || 'Not specified'}</Text>
                <Text style={styles.goalMetadataItem}>Review Date: {formatDate(getValue('reviewDate2')) || 'Not specified'}</Text>
              </View>
            </View>
            
            {/* Goal 3 Card */}
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Goal 3</Text>
                <Text style={styles.outcomeRating}>Partly Achieved</Text>
              </View>
              
              <View style={styles.goalDescription}>
                <Text style={styles.goalDescriptionLabel}>Goal Description:</Text>
                <Text style={styles.goalDescriptionValue}>{getValue('goal3') || 'No goal description provided'}</Text>
              </View>
              
              <View style={styles.goalActions}>
                <Text style={styles.goalActionsLabel}>Actions & Resources:</Text>
                <Text style={styles.goalActionsValue}>{getValue('actions3') || 'No actions specified'}</Text>
              </View>
              
              <View style={styles.goalMetadata}>
                <Text style={styles.goalMetadataItem}>By Whom: {getValue('byWhom3') || 'Not specified'}</Text>
                <Text style={styles.goalMetadataItem}>By When: {formatDate(getValue('byWhen3')) || 'Not specified'}</Text>
                <Text style={styles.goalMetadataItem}>Review Date: {formatDate(getValue('reviewDate3')) || 'Not specified'}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
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
            
            <View style={styles.supportTable}>
              <View style={styles.supportTableRow}>
                <Text style={styles.supportTableLabel}>PBS Support Plan included?</Text>
                <Text style={styles.supportTableValue}>{getValue('pbsSupportPlanIncluded') || 'No'}</Text>
              </View>
              
              <View style={styles.supportTableRow}>
                <Text style={styles.supportTableLabel}>Any Restrictive Practices?</Text>
                <Text style={styles.supportTableValue}>{getValue('restrictivePractices') || 'No'}</Text>
              </View>
              
              <View style={styles.supportTableRow}>
                <Text style={styles.supportTableLabel}>Name of organization:</Text>
                <Text style={styles.supportTableValue}>{getValue('organizationName') || 'Not specified'}</Text>
              </View>
              
              <View style={styles.supportTableRow}>
                <Text style={styles.supportTableLabel}>Contact person:</Text>
                <Text style={styles.supportTableValue}>{getValue('contactPersonOrg') || 'Not specified'}</Text>
              </View>
              
              <View style={styles.supportTableRow}>
                <Text style={styles.supportTableLabel}>Contact number:</Text>
                <Text style={styles.supportTableValue}>{getValue('contactNumberOrg') || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Informal Supports:</Text>
            
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Informal Support</Text>
                <Text style={styles.tableHeaderCell}>Role</Text>
                <Text style={styles.tableHeaderCell}>Frequency</Text>
              </View>
              
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{getValue('support1') || 'Not specified'}</Text>
                <Text style={styles.tableCell}>{getValue('role1') || 'Not specified'}</Text>
                <Text style={styles.tableCell}>{getValue('frequency1') || 'Not specified'}</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{getValue('support2') || 'Not specified'}</Text>
                <Text style={styles.tableCell}>{getValue('role2') || 'Not specified'}</Text>
                <Text style={styles.tableCell}>{getValue('frequency2') || 'Not specified'}</Text>
              </View>
              
              <View style={styles.tableRowLast}>
                <Text style={styles.tableCell}>{getValue('support3') || 'Not specified'}</Text>
                <Text style={styles.tableCell}>{getValue('role3') || 'Not specified'}</Text>
                <Text style={styles.tableCell}>{getValue('frequency3') || 'Not specified'}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{getWebsite()}</Text>
          <Text style={styles.footerText}>{getFormId()}</Text>
          <Text style={styles.footerText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;
