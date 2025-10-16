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
    padding: 50,
    paddingTop: 40,
    paddingBottom: 20,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 20,
    marginBottom: 30,
    height: 80,
  },
  headerLogo: {
    width: 250,
    height: 80,
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
  coverFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    paddingTop: 10,
    fontSize: 10,
    height: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  section: {
    marginBottom: 25,
    breakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
    breakInside: 'avoid',
    gap: 10,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
  },
  bulletLabel: {
    width: 250,
    fontSize: 11,
    color: '#000000',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
  },
  longAnswer: {
    marginBottom: 10,
    breakInside: 'avoid',
  },
  longAnswerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
  },
  longAnswerValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.3,
    minHeight: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
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
    backgroundColor: '#87ceeb',
  },
  checkboxLabel: {
    fontSize: 9,
    color: '#111827',
  },
  table: {
    marginBottom: 10,
    breakInside: 'avoid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #d1d5db',
    paddingVertical: 6,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 8,
    minHeight: 40,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    color: '#111827',
    paddingHorizontal: 4,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  tableCellGoal: {
    flex: 2,
    fontSize: 8,
    color: '#111827',
    paddingHorizontal: 4,
    textAlign: 'left',
    lineHeight: 1.3,
    minHeight: 30,
  },
  tableCellActions: {
    flex: 2,
    fontSize: 8,
    color: '#111827',
    paddingHorizontal: 4,
    textAlign: 'left',
    lineHeight: 1.3,
    minHeight: 30,
  },
  supportTable: {
    marginBottom: 10,
    border: '1 solid #000000',
  },
  supportRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
    minHeight: 30,
  },
  supportLabel: {
    width: 200,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRight: '1 solid #000000',
  },
  supportValue: {
    flex: 1,
    fontSize: 9,
    color: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  goalsContainer: {
    marginBottom: 25,
  },
  goalCard: {
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    breakInside: 'avoid',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: '1 solid #d1d5db',
  },
  goalNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  goalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalRatingLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginRight: 4,
  },
  goalRatingValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#059669',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  goalCardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
    marginTop: 8,
  },
  goalCardText: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    marginBottom: 6,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #e5e7eb',
  },
  goalDetailItem: {
    flex: 1,
    marginRight: 8,
  },
  goalDetailLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 2,
  },
  goalDetailValue: {
    fontSize: 9,
    color: '#111827',
  },
  signatureSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1 solid #e5e7eb',
    breakInside: 'avoid',
  },
  signatureRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  signatureField: {
    flex: 1,
    marginRight: 10,
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
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
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 50,
    paddingTop: 60,
    paddingBottom: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    justifyContent: 'space-between',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circlesContainer: {
    position: 'relative',
    width: 500,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeBlueCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#e0f2fe',
    opacity: 0.8,
    top: 60,
    left: 40,
  },
  largeOrangeCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#fed7aa',
    opacity: 0.9,
    border: '3 solid #fb923c',
    bottom: 60,
    right: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  smallBlueCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#e0f2fe',
    opacity: 0.7,
    bottom: 40,
    left: 60,
  },
  coverTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Times-Roman',
  },
  coverTitlePlan: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
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
  logoDataUrl
}) => {
  // Data mapping for common fields
  const commonFieldMapping: Record<string, string> = {
    name: 'name',
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
      if (commonFieldMapping[key]) {
        value = commonFieldsData?.[commonFieldMapping[key]];
      } else {
        value = formData?.[key];
      }
      return value ? String(value) : '';
    } catch (error) {
      console.warn(`Error getting value for ${key}:`, error);
      return '';
    }
  };

  // Debug function to log all available data
  const debugData = () => {
    console.log('=== PERSON CENTRED PLAN DEBUG ===');
    console.log('Form Data Keys:', Object.keys(formData || {}));
    console.log('Common Fields Keys:', Object.keys(commonFieldsData || {}));
    console.log('Settings Keys:', Object.keys(settings || {}));
    
    // Log ALL form data for debugging
    console.log('=== ALL FORM DATA ===');
    Object.keys(formData || {}).forEach(key => {
      console.log(`${key}:`, formData[key]);
    });
    
    // Check for goals-related fields
    const goalsKeys = Object.keys(formData || {}).filter(key => 
      key.toLowerCase().includes('goal') || 
      key.toLowerCase().includes('outcome') ||
      key.toLowerCase().includes('action') ||
      key.toLowerCase().includes('bywhom') ||
      key.toLowerCase().includes('bywhen') ||
      key.toLowerCase().includes('review')
    );
    console.log('Goals-related keys:', goalsKeys);
    
    // Check for support-related fields
    const supportKeys = Object.keys(formData || {}).filter(key => 
      key.toLowerCase().includes('support') ||
      key.toLowerCase().includes('informal') ||
      key.toLowerCase().includes('role') ||
      key.toLowerCase().includes('frequency')
    );
    console.log('Support-related keys:', supportKeys);
    
    // Log specific values
    [...goalsKeys, ...supportKeys].forEach(key => {
      console.log(`${key}:`, formData[key]);
    });
    console.log('================================');
  };

  // Call debug function
  debugData();

  // Safe date formatting
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return String(dateString); // Return original string if invalid date
      }
      return date.toLocaleDateString();
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
          <Text style={styles.checkboxLabel}>{option}</Text>
        </View>
      ))}
    </View>
  );

  // Render goals table
  const renderGoalsList = () => {
    console.log('=== RENDERING GOALS LIST ===');
    console.log('All formData keys:', Object.keys(formData || {}));
    
    let goals = [];
    
    // First, try to find individual goal fields (goal1, goal2, etc.)
    const individualGoals = [];
    for (let i = 1; i <= 10; i++) {
      const goalKey = `goal${i}`;
      
      if (formData?.[goalKey] && formData[goalKey].trim()) {
        individualGoals.push({
          goal: formData[goalKey] || '',
          rating: formData[`rating${i}`] || 'Not specified',
          actions: formData[`actions${i}`] || 'Not specified',
          byWhom: formData[`byWhom${i}`] || 'Not specified',
          byWhen: formData[`byWhen${i}`] || '',
          reviewDate: formData[`reviewDate${i}`] || ''
        });
        console.log(`Found individual goal ${i}:`, formData[goalKey]);
      }
    }
    
    // If we found individual goals, use them
    if (individualGoals.length > 0) {
      console.log(`Found ${individualGoals.length} individual goals:`, individualGoals);
      goals = individualGoals;
    } else {
      // Try different possible field names for goals data
      const goalsData = getValue('goals') || getValue('goalsData') || getValue('myGoals') || getValue('goalData');
      
      if (goalsData) {
        try {
          if (typeof goalsData === 'string') {
            goals = JSON.parse(goalsData);
          } else if (Array.isArray(goalsData)) {
            goals = goalsData;
          }
        } catch (error) {
          console.warn('Error parsing goals data:', error);
          goals = [];
        }
      }
    }
    
    if (!goals || goals.length === 0) {
      return (
        <View style={styles.goalCard}>
          <Text style={styles.goalCardTitle}>No goals recorded</Text>
          <Text style={styles.goalCardText}>No personal goals have been set at this time.</Text>
        </View>
      );
    }

    return (
      <View style={styles.goalsContainer}>
        {goals.map((goal: any, index: number) => (
          <View key={index} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalNumber}>Goal {index + 1}</Text>
              <View style={styles.goalRating}>
                <Text style={styles.goalRatingLabel}>Outcome Rating:</Text>
                <Text style={styles.goalRatingValue}>{goal.rating || goal.outcomeRating || 'Not specified'}</Text>
              </View>
            </View>
            
            <Text style={styles.goalCardTitle}>Goal Description:</Text>
            <Text style={styles.goalCardText}>{goal.goal || goal.goalText || goal.description || 'No goal specified'}</Text>
            
            <Text style={styles.goalCardTitle}>Actions & Resources:</Text>
            <Text style={styles.goalCardText}>{goal.actions || goal.actionsAndResources || goal.resources || 'Not specified'}</Text>
            
            <View style={styles.goalDetails}>
              <View style={styles.goalDetailItem}>
                <Text style={styles.goalDetailLabel}>By Whom:</Text>
                <Text style={styles.goalDetailValue}>{goal.byWhom || goal.responsible || 'Not specified'}</Text>
              </View>
              <View style={styles.goalDetailItem}>
                <Text style={styles.goalDetailLabel}>By When:</Text>
                <Text style={styles.goalDetailValue}>{formatDate(goal.byWhen || goal.targetDate || goal.deadline)}</Text>
              </View>
              <View style={styles.goalDetailItem}>
                <Text style={styles.goalDetailLabel}>Review Date:</Text>
                <Text style={styles.goalDetailValue}>{formatDate(goal.reviewDate || goal.nextReview)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Render informal supports table
  const renderInformalSupportsTable = () => {
    console.log('=== RENDERING INFORMAL SUPPORTS TABLE ===');
    console.log('All formData keys:', Object.keys(formData || {}));
    
    let supports = [];
    
    // First, try to find individual informal support fields (support1, support2, etc.)
    const individualSupports = [];
    for (let i = 1; i <= 10; i++) {
      const supportKey = `support${i}` || `informalSupport${i}` || `supportPerson${i}`;
      const roleKey = `supportRole${i}` || `role${i}`;
      const frequencyKey = `supportFrequency${i}` || `frequency${i}`;
      
      if (formData?.[`support${i}`] && formData[`support${i}`].trim()) {
        individualSupports.push({
          support: formData[`support${i}`] || '',
          role: formData[`role${i}`] || 'Not specified',
          frequency: formData[`frequency${i}`] || 'Not specified'
        });
        console.log(`Found individual support ${i}:`, formData[`support${i}`]);
        console.log(`Support ${i} details:`, {
          support: formData[`support${i}`],
          role: formData[`role${i}`],
          frequency: formData[`frequency${i}`]
        });
      }
    }
    
    // If we found individual supports, use them
    if (individualSupports.length > 0) {
      console.log(`Found ${individualSupports.length} individual supports:`, individualSupports);
      supports = individualSupports;
    } else {
      // Try different possible field names for informal supports data
      const supportsData = getValue('informalSupports') || getValue('informalSupport') || getValue('myInformalSupports') || getValue('supportData');
      
      if (supportsData) {
        try {
          if (typeof supportsData === 'string') {
            supports = JSON.parse(supportsData);
          } else if (Array.isArray(supportsData)) {
            supports = supportsData;
          }
        } catch (error) {
          console.warn('Error parsing informal supports data:', error);
          supports = [];
        }
      }
      
      // Debug: Log the supports data to see what we're getting
      console.log('Informal supports data:', supportsData);
      console.log('Parsed supports:', supports);
    }
    
    if (!supports || supports.length === 0) {
      return (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Informal Support</Text>
            <Text style={styles.tableHeaderCell}>Role</Text>
            <Text style={styles.tableHeaderCell}>Frequency</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>No informal supports recorded</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Informal Support</Text>
          <Text style={styles.tableHeaderCell}>Role</Text>
          <Text style={styles.tableHeaderCell}>Frequency</Text>
        </View>
        {supports.map((support: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{support.support || support.name || support.supportName || '-'}</Text>
            <Text style={styles.tableCell}>{support.role || support.roleDescription || support.description || '-'}</Text>
            <Text style={styles.tableCell}>{support.frequency || support.howOften || support.times || '-'}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        {/* Header - Fixed at top of every page */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Cover Page Content */}
        <View style={styles.coverContent}>
          {/* Circular Design Elements */}
          <View style={styles.circlesContainer}>
            <View style={styles.largeBlueCircle} />
            <View style={styles.largeOrangeCircle}>
              <Text style={styles.coverTitle}>PERSON CENTRED</Text>
              <Text style={styles.coverTitlePlan}>PLAN</Text>
            </View>
            <View style={styles.smallBlueCircle} />
          </View>
        </View>

        {/* Footer - Fixed at bottom of cover page */}
        <View style={styles.coverFooter} fixed>
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || 'PCP-001'}</Text>
          <Text style={styles.footerText}>Date of Report: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page}>
        {/* Header - Fixed at top of every page */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Person Centred Plan</Text>

          {/* Section 1: Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Personal Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(1) Name:</Text>
              <Text style={styles.value}>{getValue('name')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(2) Address:</Text>
              <Text style={styles.value}>{getValue('address')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(3) Date of Birth:</Text>
              <Text style={styles.value}>{formatDate(getValue('dob'))}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(4) Parent/Guardian:</Text>
              <Text style={styles.value}>{getValue('guardian')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(5) Guardian Address:</Text>
              <Text style={styles.value}>{getValue('guardianAddress')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(6) Contact Number:</Text>
              <Text style={styles.value}>{getValue('contactNumber')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(7) Disability:</Text>
              <Text style={styles.value}>{getValue('disability')}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.bulletLabel}>(8) NDIS Number:</Text>
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
              <Text style={styles.longAnswerLabel}>History of Respiratory Depression:</Text>
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
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Companion Card:</Text>
              <Text style={styles.longAnswerValue}>{getValue('companionCard')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Ambulance Cover:</Text>
              <Text style={styles.longAnswerValue}>{getValue('ambulanceCover')}</Text>
            </View>
            
            <View style={styles.longAnswer}>
              <Text style={styles.longAnswerLabel}>Does the participant require support to organize regular medical & dental check ups?</Text>
              <Text style={styles.longAnswerValue}>{getValue('healthcarePrompt')}</Text>
              <Text style={styles.longAnswerValue}>(If yes, coordinator to set annual reminders to prompt and assist participant to organize annual health checks)</Text>
            </View>
          </View>

          {/* Section 4: Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Goals:</Text>
            {renderGoalsList()}
          </View>

          {/* Section 5: Support Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Support Information:</Text>
            
            {/* Debug: Log support information data */}
            {(() => {
              console.log('=== SUPPORT INFORMATION DEBUG ===');
              console.log('pbsSupportPlanIncluded:', getValue('pbsSupportPlanIncluded'));
              console.log('restrictivePractices:', getValue('restrictivePractices'));
              console.log('organizationName:', getValue('organizationName'));
              console.log('contactPersonOrg:', getValue('contactPersonOrg'));
              console.log('contactNumberOrg:', getValue('contactNumberOrg'));
              return null;
            })()}
            
            <View style={styles.supportTable}>
              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>PBS Support Plan included?</Text>
                <Text style={styles.supportValue}>{getValue('pbsSupportPlanIncluded') || 'No'}</Text>
              </View>
              
              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Any Restrictive Practices?</Text>
                <Text style={styles.supportValue}>{getValue('restrictivePractices') || 'No'}</Text>
              </View>
              
              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Name of organization:</Text>
                <Text style={styles.supportValue}>{getValue('organizationName') || 'Not specified'}</Text>
              </View>
              
              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Contact person:</Text>
                <Text style={styles.supportValue}>{getValue('contactPersonOrg') || 'Not specified'}</Text>
              </View>
              
              <View style={styles.supportRow}>
                <Text style={styles.supportLabel}>Contact number:</Text>
                <Text style={styles.supportValue}>{getValue('contactNumberOrg') || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          {/* Section 6: Informal Supports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Informal Supports:</Text>
            {renderInformalSupportsTable()}
          </View>

        </View>

        {/* Footer - Fixed at bottom of every page */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>{settings?.person_centred_plan || 'PCP-001'}</Text>
          <Text style={styles.footerText}>Date of Report: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PersonCentredPlanPDF;
