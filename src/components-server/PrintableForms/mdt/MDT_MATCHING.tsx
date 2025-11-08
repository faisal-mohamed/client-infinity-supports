import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { format, parseISO, isValid } from 'date-fns';

// Register DejaVuSans font for Unicode support
Font.register({
  family: 'DejaVuSans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 100,      // Space for fixed header
    paddingBottom: 50,    // Space for fixed footer
    fontFamily: 'DejaVuSans',
    fontSize: 10,
    lineHeight: 1.5,      // Consistent line height
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 150,
    height: 60,
    objectFit: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666666',
    borderTop: '0.5 solid #cccccc',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  metaSection: {
    marginBottom: 16,
    flexDirection: 'column',
  },
  metaField: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  metaLabel: {
    fontWeight: 'bold',
    fontSize: 10,
    width: '30%',
    flexShrink: 0,
  },
  metaValue: {
    fontSize: 10,
    width: '70%',
    flexShrink: 1,
  },
  sectionContainer: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 8,
    textDecoration: 'underline',
  },
  sectionContent: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'justify',
  },
});

interface MDTMatchingProps {
  formData: Record<string, any>;
  commonFieldsData?: Record<string, any>;
  settings?: Record<string, any>;
  logoDataUrl?: string;
  images?: any;
}

const commonFieldMapping: Record<string, string> = {
  clientName: "name",
  address: "street",
  dob: "dob",
  disability: "disability",
  phoneNumber: "phone",
  ndisNumber: "ndis",
};

const MDTMatching: React.FC<MDTMatchingProps> = ({
  formData,
  commonFieldsData = {},
  settings = {},
  logoDataUrl,
  images,
}) => {
  
  // Helper function to get field value
  const getValue = (key: string): string => {
    const rawValue = commonFieldMapping[key]
      ? commonFieldsData?.[commonFieldMapping[key]]
      : formData?.[key];
    
    // Format dates
    if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
      try {
        const parsed = parseISO(rawValue);
        if (isValid(parsed)) {
          return format(parsed, "dd-MM-yyyy");
        }
      } catch (e) {
        console.error('Date parse error:', e);
      }
    }
    
    return rawValue ?? '';
  };

  // Format review date
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      try {
        const parsed = parseISO(value);
        if (isValid(parsed)) {
          return format(parsed, "dd-MM-yyyy");
        }
      } catch (e) {
        console.error('Date format error:', e);
      }
    }
    return value || 'N/A';
  };

  const footerDate = formatDate(settings?.review_date || '');
  const footerWebsite = settings?.company_website || settings?.website || settings?.from_email || '';
  const footerId = settings?.multi_disciplinary_meeting || '';
  
  // Debug footer values
  console.log('🔍 [MDT PDF DEBUG] Footer values:', {
    company_website: settings?.company_website,
    from_email: settings?.from_email,
    footerWebsite,
    footerId,
    footerDate
  });

  // Define form sections
  interface FormSection {
    key: string;
    label: string;
    isMeta?: boolean;
    isSection?: boolean;
    isDateWithTemplate?: boolean;
  }
  
  const formSections: FormSection[] = [
    { key: 'clientName', label: 'Client Name', isMeta: true },
    { key: 'date', label: 'Date', isMeta: true },
    { key: 'inAttendance', label: 'In Attendance', isMeta: true },
    { key: 'apologies', label: 'Apologies', isMeta: true },
    { key: 'introduction', label: 'Introduction', isSection: true },
    { key: 'physiotherapy', label: 'Physiotherapy', isSection: true },
    { key: 'ot', label: 'OT', isSection: true },
    { key: 'speech', label: 'Speech', isSection: true },
    { key: 'pbs', label: 'PBS', isSection: true },
    { key: 'serviceDelivery', label: 'Service Delivery', isSection: true },
    { key: 'family', label: 'Family', isSection: true },
    { key: 'recommendations', label: 'Recommendations', isSection: true },
    { key: 'nextMeetingNote', label: 'Meeting Close Note', isSection: true, isDateWithTemplate: true },
  ];

  // Debug logging
  console.log('🔍 [MDT PDF DEBUG] Generating MDT PDF');
  console.log('🔍 [MDT PDF DEBUG] Settings:', settings);
  console.log('🔍 [MDT PDF DEBUG] FormData keys:', Object.keys(formData || {}));
  console.log('🔍 [MDT PDF DEBUG] Footer - Website:', footerWebsite, 'ID:', footerId, 'Date:', footerDate);
  
  const metaFields = formSections.filter(section => section.isMeta);
  const contentSections = formSections.filter(section => section.isSection);
  
  console.log('🔍 [MDT PDF DEBUG] Meta fields count:', metaFields.length);
  console.log('🔍 [MDT PDF DEBUG] Content sections count:', contentSections.length);

  return (
    <Document>
      {/* SINGLE PAGE - React PDF handles all pagination automatically */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header on all pages */}
        <View style={styles.header} fixed>
          {(logoDataUrl || images?.infinityLogo) && (
            <Image
              src={logoDataUrl || images?.infinityLogo}
              style={styles.headerLogo}
            />
          )}
          <Text style={styles.title}>Multi-Disciplinary Meeting</Text>
        </View>

        {/* Fixed Footer on all pages */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Website: {footerWebsite}</Text>
          <Text style={styles.footerText}>{footerId}</Text>
          <Text style={styles.footerText}>Review Date: {footerDate}</Text>
        </View>

        {/* All content in single wrapper - React PDF auto-paginates */}
        <View>
          {/* Meeting Metadata */}
          <View style={styles.metaSection}>
            {metaFields.map((section, idx) => {
              const value = getValue(section.key);
              if (!value) return null;
              return (
                <View key={idx} style={styles.metaField}>
                  <Text style={styles.metaLabel}>{section.label}:</Text>
                  <Text style={styles.metaValue}>{value}</Text>
                </View>
              );
            })}
          </View>

          {/* Discussion Sections - Content flows naturally across pages */}
          {contentSections.map((section, idx) => {
            const value = getValue(section.key);
            if (!value) {
              console.log(`🔍 [MDT PDF DEBUG] Section "${section.label}" has no value, skipping`);
              return null;
            }
            
            console.log(`🔍 [MDT PDF DEBUG] Rendering section "${section.label}" (${value.length} chars)`);
            
            // Special handling for nextMeetingNote - show full sentence with date
            const displayValue = section.isDateWithTemplate 
              ? `Thank you all for attending and the updates. I will schedule the next meeting for ${value}`
              : value;
            
            return (
              <View key={idx} style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>{section.label}</Text>
                <Text style={styles.sectionContent}>{displayValue}</Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default MDTMatching;
