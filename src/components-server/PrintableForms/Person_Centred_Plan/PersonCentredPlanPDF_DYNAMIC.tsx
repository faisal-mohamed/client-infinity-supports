import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// ✅ TRULY DYNAMIC PDF GENERATION
// - Single Page component with natural content flow
// - Dynamically renders 1-10 goals (based on formData)
// - Dynamically renders 1-10 informal supports (based on formData)
// - Creates N pages automatically based on content length
// - No empty pages or gaps

const styles = StyleSheet.create({
  // Cover page styles
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  kvTable: {
    border: '1 solid #000000',
    marginBottom: 10,
  },
  kvRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
  },
  kvCellLabel: {
    width: 170,
    padding: 4,
    backgroundColor: '#e5e7eb',
    borderRight: '1 solid #000000',
    fontSize: 9,
    fontWeight: 'bold',
  },
  kvCellValue: {
    flex: 1,
    padding: 4,
    fontSize: 9,
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
    backgroundColor: '#f0ad7a',
    border: '1 solid rgb(221, 163, 111)',
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
    backgroundColor: '#a8d8ea',
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
    backgroundColor: '#a8d8ea',
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
    padding: 30, // Reduced from 40 to 30 to give more content space
    paddingTop: 20, // Reduced from 60 to 20 to give more space for content
    paddingBottom: 30, // Reduced from 50 to 30 to give more content space
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10, // Reduced from 15 to 10
    marginBottom: 15, // Reduced from 20 to 15
    // Removed borderBottom to eliminate line below logo
  },
  headerLogo: {
    width: 200,
    height: 60,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTop: '1 solid #e5e7eb',
    fontSize: 9,
    marginTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 15, // Reduced from 20 to 15 to give more content space
  },
  // ✅ Question Spacing Rule styles
  questionSpacing: {
    height: 18, // Reduced from 24 to 18 - still 2 lines but more compact
  },
  questionBlock: {
    marginBottom: 8, // Normal spacing between question parts
  },
  questionBlockWithSpacing: {
    marginBottom: 32, // Normal spacing + 2-line spacing (8 + 24 = 32pt)
  },
  
  // ✅ Uniform Box Layout for Health Information
  healthQuestionContainer: {
    border: '1.5 solid #3b82f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  healthQuestionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    borderBottom: '1 solid #dbeafe',
    paddingBottom: 4,
  },
  healthQuestionValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
    padding: 8,
    backgroundColor: '#ffffff',
    border: '1 solid #e5e7eb',
    borderRadius: 4,
    minHeight: 20,
  },
  healthFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  healthFieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    marginRight: 8,
    borderBottom: '1 solid #dbeafe',
    paddingBottom: 2,
  },
  healthFieldValue: {
    fontSize: 9,
    color: '#111827',
    backgroundColor: '#ffffff',
    border: '1 solid #e5e7eb',
    borderRadius: 4,
    padding: 6,
    minWidth: 60,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
    backgroundColor: '#f3f4f6',
    border: '1 solid #d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  fullPageSection: {
    breakInside: 'avoid', // Keep section together on one page
    marginBottom: 15,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 140,
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
    marginBottom: 12, // Reduced from 16 to 12 to give more content space
    position: 'relative', // Enable positioning for border continuity
    breakInside: 'auto', // Allow natural page breaks to prevent overflow
  },
  longAnswerLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 12,
    color: '#111827',
  },
  longAnswerValue: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    padding: 15, // Increased padding to prevent text cutoff
    paddingBottom: 50, // 2-line space between text and container border (13.5pt × 2 = 27pt + 23pt buffer = 50pt)
    border: '1 solid #d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    minHeight: 60, // Increased minimum height for better visibility
    position: 'relative', // Enable positioning for border continuity
    breakInside: 'auto', // Allow natural page breaks to prevent overflow
  },
  
  // Container continuity styles for page breaks - maintaining rounded rectangle shape
  longAnswerValueContinuous: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    padding: 15,
    paddingBottom: 50, // 2-line space between text and container border
    border: '1 solid #d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    minHeight: 60,
    position: 'relative',
    breakInside: 'auto', // Allow natural page breaks
  },
  
  // Style for My Story without container box
  longAnswerValueNoBox: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    padding: 0, // No padding since no box
    paddingBottom: 30, // 2-line space after text
    breakInside: 'auto', // Allow natural page breaks
  },
  
  // Enhanced container styles with better page break handling - maintaining rounded rectangle shape
  longAnswerValueWithBottomBorder: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    padding: 15,
    paddingBottom: 50, // 2-line space between text and container border
    border: '1 solid #d1d5db',
    borderRadius: 4, // Base radius
    borderTopLeftRadius: 4, // Maintain top-left radius
    borderTopRightRadius: 4, // Maintain top-right radius
    borderBottomLeftRadius: 0, // No bottom-left radius for page break
    borderBottomRightRadius: 0, // No bottom-right radius for page break
    backgroundColor: '#f9fafb',
    minHeight: 60,
    position: 'relative',
    breakInside: 'auto', // Allow natural page breaks to prevent overflow
    marginBottom: 24, // 2-line spacing before next content
  },
  
  // Container that ends on page - with proper closing
  longAnswerValueEnding: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    padding: 15,
    paddingBottom: 50, // 2-line space between text and container border
    border: '1 solid #d1d5db',
    borderRadius: 4, // Full rounded corners for ending container
    backgroundColor: '#f9fafb',
    minHeight: 60,
    position: 'relative',
    breakInside: 'auto', // Allow natural page breaks to prevent overflow
    marginBottom: 24, // 2-line spacing after container ends
  },
  
  // Goal card styles - DYNAMIC
  goalCard: {
    marginBottom: 15,
    padding: 12,
    border: '1.5 solid #3b82f6',
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: '1 solid #3b82f6',
  },
  goalTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  outcomeRating: {
    fontSize: 8,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  goalDescription: {
    marginBottom: 8,
  },
  goalDescriptionLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3,
  },
  goalDescriptionValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
  },
  goalActions: {
    marginBottom: 8,
  },
  goalActionsLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3,
  },
  goalActionsValue: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.4,
  },
  goalMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  goalMetadataItem: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  
  // Support table styles
  supportTable: {
    marginBottom: 15,
    border: '1 solid #d1d5db',
    borderRadius: 4,
  },
  supportTableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
  },
  supportTableLabel: {
    width: '45%',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    backgroundColor: '#f9fafb',
  },
  supportTableValue: {
    width: '55%',
    padding: 8,
    fontSize: 9,
    color: '#111827',
  },
  
  // Informal supports table - DYNAMIC
  table: {
    marginTop: 10,
    border: '1 solid #d1d5db',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    borderBottom: '1.5 solid #2563eb',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
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
    textAlign: 'center',
  },
  
  // Checkbox styles
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
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
    backgroundColor: '#3b82f6',
  },
  checkboxLabel: {
    fontSize: 9,
    color: '#374151',
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
  // Common field mapping
  const commonFieldMapping: Record<string, string> = {
    name: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    ndisNumber: 'ndis',
  };

  // Get value helper
  const getValue = (key: string): string => {
    try {
      let result = '';
      if (commonFieldMapping[key]) {
        result = commonFieldsData?.[commonFieldMapping[key]] || '';
        console.log(`🔍 DEBUG - getValue('${key}') from commonFields:`, {
          mappedKey: commonFieldMapping[key],
          result: result,
          isEmpty: !result || result.trim() === ''
        });
      } else {
        result = formData?.[key] || '';
        console.log(`🔍 DEBUG - getValue('${key}') from formData:`, {
          originalValue: formData?.[key],
          result: result,
          isEmpty: !result || result.trim() === ''
        });
      }
      return result;
    } catch (error) {
      console.error(`❌ ERROR - getValue('${key}') failed:`, error);
      return '';
    }
  };

  // Safe date formatting
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);
      return date.toLocaleDateString('en-AU', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch {
      return String(dateString);
    }
  };

  // Get report date - no fallback
  const getReportDate = (): string => {
    const dateValue = settings?.review_date;
    return dateValue ? formatDate(dateValue) : '';
  };

  // Get form ID - no fallback
  const getFormId = (): string => {
    return settings?.person_centre_plan_form_id || '';
  };

  // Get website - no fallback
  const getWebsite = (): string => {
    return settings?.company_website || '';
  };

  // ✅ QUESTION SPACING RULE IMPLEMENTATION
  // Smart spacing logic to add 2-line gaps between questions
  // Only adds spacing if next question fits on same page
  
  // Helper function to estimate content height
  const estimateContentHeight = (text: string, baseHeight: number = 20): number => {
    if (!text) return 0;
    const lines = Math.ceil(text.length / 60); // Approximate characters per line
    return baseHeight + (lines * 12); // 12pt line height
  };

  // Helper function to determine if spacing should be added
  const shouldAddSpacing = (currentIndex: number, totalItems: number): boolean => {
    // Always add spacing between questions (not after the last one)
    return currentIndex < totalItems - 1;
  };

  // Helper function to render question spacing
  const renderQuestionSpacing = (shouldAdd: boolean) => {
    if (!shouldAdd) return null;
    return <View style={styles.questionSpacing} />;
  };

  // Helper function to render long answer with container continuity
  const renderLongAnswerWithContinuity = (label: string, value: string, isContinuation: boolean = false, hasPageBreak: boolean = false, isEnding: boolean = false) => {
    let valueStyle = styles.longAnswerValue;
    
    if (isContinuation) {
      valueStyle = styles.longAnswerValueContinuous;
    } else if (hasPageBreak) {
      valueStyle = styles.longAnswerValueWithBottomBorder;
    } else if (isEnding) {
      valueStyle = styles.longAnswerValueEnding;
    }
    
    return (
      <View style={styles.longAnswer}>
        <Text style={styles.longAnswerLabel}>{label}</Text>
        <Text style={valueStyle}>
          {value || 'No information provided'}
        </Text>
      </View>
    );
  };

  // Helper function to render container with natural page break
  const renderContainerWithPageBreak = (label: string, value: string, shouldSplit: boolean = false, questionNumber?: number) => {
    // Add question numbering if provided
    const displayLabel = questionNumber ? `(${questionNumber}) ${label}` : label;
    
    // For sections without container boxes - just label and text
    const noBoxSections = [
      'My Story:',
      'Strengths:',
      'Challenges:',
      'Allergies:',
      'Health Conditions:',
      'Precautions:',
      'History of Respiratory Depression:',
      'Companion Card:',
      'Ambulance Cover:',
      'Proactive & preventative healthcare prompts:'
    ];
    
    if (noBoxSections.includes(label)) {
      return (
        <View style={styles.longAnswer}>
          <Text style={styles.longAnswerLabel}>{displayLabel}</Text>
          <Text style={styles.longAnswerValueNoBox}>
            {value || 'No information provided'}
          </Text>
        </View>
      );
    }
    
    // For other sections - use container box (like Goals)
    return (
      <View style={styles.longAnswer}>
        <Text style={styles.longAnswerLabel}>{displayLabel}</Text>
        <Text style={styles.longAnswerValueContinuous}>
          {value || 'No information provided'}
        </Text>
      </View>
    );
  };

  // Helper function to render sections that should fit fully on one page
  const renderFullPageSection = (content: React.ReactNode) => {
    return (
      <View style={styles.fullPageSection}>
        {content}
      </View>
    );
  };

  // ✅ DYNAMIC GOAL EXTRACTION (1-10 goals)
  const extractGoals = () => {
    const goals = [];
    for (let i = 1; i <= 10; i++) {
      const goalKey = `goal${i}`;
      if (formData?.[goalKey] && formData[goalKey].trim()) {
        goals.push({
          number: i,
          goal: formData[goalKey] || '',
          rating: formData[`rating${i}`] || 'Not specified',
          actions: formData[`actions${i}`] || 'Not specified',
          byWhom: formData[`byWhom${i}`] || 'Not specified',
          byWhen: formData[`byWhen${i}`] || '',
          reviewDate: formData[`reviewDate${i}`] || ''
        });
      }
    }
    console.log(`✅ DYNAMIC GOALS: Found ${goals.length} goals in formData`);
    return goals;
  };

  // ✅ DYNAMIC INFORMAL SUPPORTS EXTRACTION (1-10 supports)
  const extractInformalSupports = () => {
    const supports = [];
    for (let i = 1; i <= 10; i++) {
      const supportKey = `support${i}`;
      if (formData?.[supportKey] && formData[supportKey].trim()) {
        supports.push({
          number: i,
          support: formData[supportKey] || 'Not specified',
          role: formData[`role${i}`] || 'Not specified',
          frequency: formData[`frequency${i}`] || 'Not specified'
        });
      }
    }
    console.log(`✅ DYNAMIC SUPPORTS: Found ${supports.length} informal supports in formData`);
    return supports;
  };

  const goals = extractGoals();
  const informalSupports = extractInformalSupports();

  // Render checkbox
  const renderCheckbox = (isChecked: boolean) => (
    <View style={isChecked ? styles.checkboxChecked : styles.checkbox} />
  );

  return (
    <Document>
      {/* ========================================
          COVER PAGE (Always 1 page)
      ======================================== */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverHeader}>
          <Image src={logoDataUrl} style={styles.coverHeaderLogo} />
        </View>
        
        <View style={styles.coverBlueCircle1} />
        <View style={styles.coverBlueCircle2} />
        
        <View style={styles.coverMainCircle}>
          <Text style={styles.coverTitle}>PERSON{'\n'}CENTRED PLAN</Text>
        </View>
        
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>{getWebsite()}</Text>
          <Text style={styles.coverFooterText}>{getFormId()}</Text>
          <Text style={styles.coverFooterText}>Date of Report: {getReportDate()}</Text>
        </View>
      </Page>

      {/* ========================================
          CONTENT PAGES (Dynamic - creates N pages)
          ✅ Single Page component
          ✅ Content flows naturally
          ✅ Creates pages as needed
      ======================================== */}
      <Page size="A4" style={styles.page}>
        {/* Fixed header on all content pages */}
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          {/* ========================================
              SECTION 1: PERSONAL INFORMATION
          ======================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Personal Information</Text>
            <View style={styles.kvTable}>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Name</Text>
                <Text style={styles.kvCellValue}>{getValue('name')}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Address</Text>
                <Text style={styles.kvCellValue}>{getValue('address')}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Date of Birth</Text>
                <Text style={styles.kvCellValue}>{formatDate(getValue('dob'))}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Guardian</Text>
                <Text style={styles.kvCellValue}>{getValue('guardian')}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Guardian Address</Text>
                <Text style={styles.kvCellValue}>{getValue('guardianAddress')}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Contact Number</Text>
                <Text style={styles.kvCellValue}>{getValue('contactNumber')}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>Disability</Text>
                <Text style={styles.kvCellValue}>{getValue('disability')}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kvCellLabel}>NDIS Number</Text>
                <Text style={styles.kvCellValue}>{getValue('ndisNumber')}</Text>
              </View>
            </View>
          </View>

          {/* ========================================
              SECTION 2: ABOUT ME
          ======================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. About Me</Text>
            
            {renderContainerWithPageBreak('My Story:', getValue('myStory'), true, 1)}
            {renderQuestionSpacing(true)}
            
            {renderContainerWithPageBreak('Strengths:', getValue('strengths') || 'No information provided', false, 2)}
            {renderQuestionSpacing(true)}
            
            {renderContainerWithPageBreak('Challenges:', getValue('challenges') || 'No information provided', false, 3)}
            {renderQuestionSpacing(true)}
            
            {renderContainerWithPageBreak('Allergies:', getValue('allergies') || 'No information provided', false, 4)}
          </View>

          {/* ========================================
              SECTION 3: HEALTH INFORMATION
              ✅ UNIFORM BOX LAYOUT + QUESTION SPACING RULE
          ======================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Health Information</Text>
            
            {/* Question 1: History of Respiratory Depression */}
            {renderContainerWithPageBreak('History of Respiratory Depression:', getValue('respiratoryHistory') || 'None specified', false, 1)}
            {renderQuestionSpacing(true)}
            
            {/* Question 2: Precautions */}
            {renderContainerWithPageBreak('Precautions:', getValue('precautions') || 'None specified', false, 2)}
            {renderQuestionSpacing(true)}
            
            {/* Question 3: Health Conditions */}
            {renderContainerWithPageBreak('Health Conditions:', getValue('healthConditions') || 'None specified', false, 3)}
            {renderQuestionSpacing(true)}
            
            {/* Question 4: Companion Card */}
            {renderContainerWithPageBreak('Companion Card:', getValue('companionCard') || 'No', false, 4)}
            {renderQuestionSpacing(true)}
            
            {/* Question 5: Ambulance Cover */}
            {renderContainerWithPageBreak('Ambulance Cover:', getValue('ambulanceCover') || 'No', false, 5)}
            {renderQuestionSpacing(true)}
            
            {/* Question 6: Proactive & preventative healthcare prompts (Last question - no spacing after) */}
            {renderContainerWithPageBreak('Proactive & preventative healthcare prompts:', getValue('healthcarePrompt') || 'No', false, 6)}
          </View>

          {/* ========================================
              SECTION 4: GOALS (DYNAMIC 1-10 GOALS)
              ✅ Renders N goal cards based on formData
              ✅ Each goal card uses breakInside: 'avoid'
              ✅ Content flows across pages naturally
              ✅ IMPLEMENTING QUESTION SPACING RULE
          ======================================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Goals</Text>
            
            {goals.length > 0 ? (
              goals.map((goal, index) => (
                <React.Fragment key={index}>
                  {/* Goal Card */}
                  <View style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalTitle}>Goal {goal.number}</Text>
                      <Text style={styles.outcomeRating}>OUTCOME RATING: {goal.rating}</Text>
                    </View>
                    
                    <View style={styles.goalDescription}>
                      <Text style={styles.goalDescriptionLabel}>Goal Description:</Text>
                      <Text style={styles.goalDescriptionValue}>{goal.goal}</Text>
                    </View>
                    
                    <View style={styles.goalActions}>
                      <Text style={styles.goalActionsLabel}>Actions & Resources:</Text>
                      <Text style={styles.goalActionsValue}>{goal.actions}</Text>
                    </View>
                    
                    <View style={styles.goalMetadata}>
                      <Text style={styles.goalMetadataItem}>By Whom: {goal.byWhom}</Text>
                      <Text style={styles.goalMetadataItem}>
                        By When: {formatDate(goal.byWhen) || 'Not specified'}
                      </Text>
                      <Text style={styles.goalMetadataItem}>
                        Review Date: {formatDate(goal.reviewDate) || 'Not specified'}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Question Spacing - Add 2-line spacing between goals (not after last one) */}
                  {renderQuestionSpacing(shouldAddSpacing(index, goals.length))}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.longAnswer}>
                <Text style={styles.longAnswerValue}>No goals have been set yet.</Text>
              </View>
            )}
          </View>

          {/* ========================================
              SECTION 5: SUPPORT INFORMATION
              ✅ FULL PAGE SECTION - Only show if fits on one page
          ======================================== */}
          {renderFullPageSection(
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>5. Support Information</Text>
              
              <View style={styles.supportTable}>
                <View style={styles.supportTableRow}>
                  <Text style={styles.supportTableLabel}>1) Is a PBS Support Plan included?</Text>
                  <Text style={styles.supportTableValue}>
                    {getValue('pbsSupportPlanIncluded') || 'No'}
                  </Text>
                </View>
                
                <View style={styles.supportTableRow}>
                  <Text style={styles.supportTableLabel}>2) Does the participant have any Restrictive Practices in their support plan?</Text>
                  <Text style={styles.supportTableValue}>
                    {getValue('restrictivePractices') || 'No'}
                  </Text>
                </View>
                
                <View style={styles.supportTableRow}>
                  <Text style={styles.supportTableLabel}>3) Name of organization providing support?</Text>
                  <Text style={styles.supportTableValue}>
                    {getValue('organizationName') || 'Not specified'}
                  </Text>
                </View>
                
                <View style={styles.supportTableRow}>
                  <Text style={styles.supportTableLabel}>4) Contact person from the organization?</Text>
                  <Text style={styles.supportTableValue}>
                    {getValue('contactPersonOrg') || 'Not specified'}
                  </Text>
                </View>
                
                <View style={styles.supportTableRow}>
                  <Text style={styles.supportTableLabel}>5) Contact number for the organization?</Text>
                  <Text style={styles.supportTableValue}>
                    {getValue('contactNumberOrg') || 'Not specified'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ========================================
              SECTION 6: INFORMAL SUPPORTS (DYNAMIC 1-10 ROWS)
              ✅ FULL PAGE SECTION - Only show if fits on one page
              ✅ Renders N table rows based on formData
              ✅ Each row uses breakInside: 'avoid'
              ✅ Content flows across pages naturally
              ✅ IMPLEMENTING QUESTION SPACING RULE
          ======================================== */}
          {renderFullPageSection(
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>6. Informal Supports</Text>
              
              {informalSupports.length > 0 ? (
                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Informal Support</Text>
                    <Text style={styles.tableHeaderCell}>Role</Text>
                    <Text style={styles.tableHeaderCell}>Frequency</Text>
                  </View>
                  
                  {/* Dynamic Table Rows with Question Spacing */}
                  {informalSupports.map((support, index) => (
                    <React.Fragment key={index}>
                      {/* Support Row */}
                      <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{support.support}</Text>
                        <Text style={styles.tableCell}>{support.role}</Text>
                        <Text style={styles.tableCell}>{support.frequency}</Text>
                      </View>
                      
                      {/* Question Spacing - Add 2-line spacing between support rows (not after last one) */}
                      {renderQuestionSpacing(shouldAddSpacing(index, informalSupports.length))}
                    </React.Fragment>
                  ))}
                </View>
              ) : (
                <View style={styles.longAnswer}>
                  <Text style={styles.longAnswerValue}>No informal supports have been added yet.</Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Fixed footer on all content pages */}
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

