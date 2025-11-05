import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Rect,
  Path,
} from '@react-pdf/renderer';

interface EmployeeDetailsPDFProps {
  data: any;
}

/**
 * Employee Details PDF using @react-pdf/renderer
 * - Dynamic pages based on content
 * - Automatic pagination
 * - No browser needed!
 * - Logo and footer on EVERY page
 */
const EmployeeDetailsPDF: React.FC<EmployeeDetailsPDFProps> = ({ data }) => {
  const meta = {
    website: 'infinitysupportswa.org',
    version: 'SF004',
    reviewDate: '2025-03-01'
  };

  // Logo - passed from API route as base64
  const logoUrl = data?.logoDataUrl || '/infinity_logo.png';

  const getValue = (key: string): string => {
    return data?.data?.[key] || '';
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fixed Header with Logo - appears on ALL pages */}
        <View style={styles.header} fixed>
          <View style={styles.headerContent}>
            <Image src={logoUrl} style={styles.logo} />
            <Text style={styles.headerText}>Employee Details Form</Text>
          </View>
        </View>

        {/* Content - flows automatically across pages */}
        <View style={styles.content}>
          {/* Section 1: Personal Information */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.fieldGrid}>
              <Field label="First Name" value={getValue('firstName')} />
              <Field label="Last Name" value={getValue('lastName')} />
              <Field label="Start Date" value={getValue('startDate')} />
              <Field label="Position Title" value={getValue('positionTitle')} />
              <Field label="Gender" value={getValue('gender')} />
              <Field label="Date of Birth" value={getValue('dateOfBirth')} />
            </View>
          </View>

          {/* Section 2: Contact Details */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <View style={styles.fieldGrid}>
              <FieldFullWidth label="Address" value={getValue('address')} />
              <Field label="Suburb" value={getValue('suburb')} />
              <Field label="State" value={getValue('state')} />
              <Field label="Postcode" value={getValue('postcode')} />
              <Field label="Home Phone" value={getValue('homePhone')} />
              <Field label="Mobile" value={getValue('mobile')} />
              <Field label="Work Phone" value={getValue('workPhone')} />
              <FieldFullWidth label="Email Address" value={getValue('email')} />
            </View>
          </View>

          {/* Section 3: Tax & Banking */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Tax & Banking Information</Text>
            <FieldFullWidth label="Employee Tax File" value={getValue('employeeTaxFile')} />
            
            <View style={styles.bankDetailsBox}>
              <Text style={styles.bankDetailsTitle}>Bank Details</Text>
              <View style={styles.fieldGrid}>
                <Field label="Bank Name" value={getValue('bankName')} />
                <Field label="Branch" value={getValue('bankBranch')} />
                <FieldFullWidth label="Account Name" value={getValue('accountName')} />
                <Field label="BSB" value={getValue('bsb')} />
                <Field label="Account Number" value={getValue('accountNumber')} />
              </View>
            </View>
          </View>

          {/* Section 4: Residency & Work Rights */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Residency & Work Rights</Text>
            <View style={styles.checkboxColumn}>
              <CheckboxField 
                label="Are you an Australian citizen?" 
                value={getValue('isAustralianCitizen')} 
              />
              <CheckboxField 
                label="Are you a permanent resident?" 
                value={getValue('isPermanentResident')} 
              />
              <CheckboxField 
                label="Do you have a Working Visa?" 
                value={getValue('hasWorkingVisa')} 
              />
            </View>
            {getValue('hasWorkingVisa') === 'true' && (
              <Field label="Visa Expiry Date" value={getValue('visaExpiryDate')} />
            )}
            {getValue('workRestrictions') && (
              <LongTextField label="Any restrictions?" value={getValue('workRestrictions')} plain />
            )}
          </View>

          {/* Section 5: Next of Kin */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next of Kin</Text>
            <View style={styles.fieldGrid}>
              <Field label="Next of Kin" value={getValue('nokName')} />
              <Field label="Relationship" value={getValue('nokRelationship')} />
              <FieldFullWidth label="Address" value={getValue('nokAddress')} />
              <Field label="Suburb" value={getValue('nokSuburb')} />
              <Field label="State" value={getValue('nokState')} />
              <Field label="Postcode" value={getValue('nokPostcode')} />
              <Field label="Home Phone" value={getValue('nokHomePhone')} />
              <Field label="Mobile" value={getValue('nokMobile')} />
              <Field label="Work Phone" value={getValue('nokWorkPhone')} />
            </View>
          </View>

          {/* Section 6: Signatures - Keep together */}
          <View style={styles.signatureSection} wrap={false}>
            <Text style={styles.sectionTitle}>Signatures</Text>
            <View style={styles.signatureContainer}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLabel}>Employee Signature:</Text>
                {data?.staffSignature ? (
                  <View style={styles.signatureImageContainer}>
                    <Image 
                      src={data.staffSignature} 
                      style={styles.signatureImage}
                    />
                  </View>
                ) : (
                  <View style={styles.signatureImageContainer}>
                    <Text style={styles.noSignature}>No signature</Text>
                  </View>
                )}
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureLabel}>Date:</Text>
                <Text style={styles.signatureDate}>
                  {formatDate(data?.staffSignedAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Section 7: Office Use Only - Keep together */}
          <View style={styles.officeSection} wrap={false}>
            <Text style={styles.sectionTitle}>Office Use Only</Text>
            <View style={styles.officeBox}>
              <Text style={styles.officeSubtitle}>Employee Status:</Text>
              <View style={styles.officeContent}>
                <View style={styles.officeLeft}>
                  <Text style={styles.officeLabel}>Status:</Text>
                  <CheckboxItem 
                    checked={getValue('employmentStatus') === 'FullTime'} 
                    label="Full time" 
                  />
                  <CheckboxItem 
                    checked={getValue('employmentStatus') === 'PartTime'} 
                    label="Part time" 
                  />
                  <CheckboxItem 
                    checked={getValue('employmentStatus') === 'Casual'} 
                    label="Casual" 
                  />
                </View>
                <View style={styles.officeRight}>
                  <Field label="Pay rate" value={getValue('payRate')} />
                  <Field label="SCHADS Level" value={getValue('schadsScore')} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Fixed Footer - appears on ALL pages */}
        <View style={styles.footer} fixed>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>Website: {meta.website}</Text>
            <Text style={styles.footerText}>{meta.version}</Text>
            <Text style={styles.footerText}>Review Date: {meta.reviewDate}</Text>
          </View>
          <Text 
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => (
              `Page ${pageNumber} of ${totalPages}`
            )}
          />
        </View>
      </Page>
    </Document>
  );
};

/* ==================== Helper Components ==================== */

const Field: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <Text style={styles.fieldValue}>{value || ''}</Text>
  </View>
);

const FieldFullWidth: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.fieldFullWidth}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <Text style={styles.fieldValue}>{value || ''}</Text>
  </View>
);

const LongTextField: React.FC<{ label: string; value?: string; plain?: boolean }> = ({ label, value, plain = false }) => (
  <View style={styles.longTextField}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {plain ? (
      <Text style={styles.paragraphText}>{value || 'Not provided'}</Text>
    ) : (
      <Text style={styles.longTextValue}>{value || 'Not provided'}</Text>
    )}
  </View>
);

const CheckboxField: React.FC<{ label: string; value?: string | boolean }> = ({ label, value }) => {
  const normalized = typeof value === 'string'
    ? value.toLowerCase()
    : value === true
      ? 'true'
      : value === false
        ? 'false'
        : '';
  const isTrue = normalized === 'true';
  const isFalse = normalized === 'false';

  return (
    <View style={styles.checkboxField}>
      <Text style={styles.checkboxLabel}>{label}</Text>
      <View style={styles.checkboxOptions}>
        <CheckboxItem checked={isTrue} label="Yes" />
        <CheckboxItem checked={isFalse} label="No" />
      </View>
    </View>
  );
};

const CheckboxItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
  <View style={styles.checkboxItem}>
    <Svg width={12} height={12} style={styles.checkboxSvg}>
      <Rect
        x={0.5}
        y={0.5}
        width={11}
        height={11}
        rx={2}
        ry={2}
        stroke="#1d4ed8"
        strokeWidth={1}
        fill={checked ? '#1d4ed8' : '#ffffff'}
      />
      {checked && (
        <Path
          d="M3 6.3 L5.2 8.5 L9 3.8"
          stroke="#ffffff"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
    <Text style={styles.checkboxItemLabel}>{label}</Text>
  </View>
);

/* ==================== Styles ==================== */

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 110,
    paddingBottom: 70,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  
  // Fixed Header with Logo
  header: {
    position: 'absolute',
    top: 15,
    left: 30,
    right: 30,
    borderBottom: '2 solid #333',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 180,
    height: 60,
    objectFit: 'contain',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  
  // Content Area
  content: {
    flex: 1,
  },
  
  // Sections
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderBottom: '1 solid #d1d5db',
  },
  
  // Fields
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  field: {
    width: '48%',
    marginBottom: 6,
  },
  fieldFullWidth: {
    width: '100%',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 9,
    color: '#111827',
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 3,
    paddingLeft: 4,
  },
  
  // Long text fields
  longTextField: {
    marginBottom: 10,
  },
  longTextValue: {
    fontSize: 9,
    color: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 8,
    border: '1 solid #d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
    minHeight: 36,
    lineHeight: 1.4,
  },
  paragraphText: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.6,
    marginTop: 4,
  },
  
  // Checkbox fields
  checkboxGrid: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 6,
  },
  checkboxField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  checkboxColumn: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 6,
  },
  checkboxLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    flexShrink: 0,
  },
  checkboxOptions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkboxSvg: {
    marginTop: 1,
  },
  checkboxItemLabel: {
    fontSize: 9,
    color: '#0f172a',
  },
  
  // Bank Details Box
  bankDetailsBox: {
    border: '1 solid #d1d5db',
    borderRadius: 4,
    padding: 10,
    marginTop: 8,
  },
  bankDetailsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  
  // Signature Section
  signatureSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  signatureContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  signatureBox: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  signatureImageContainer: {
    border: '1 solid #d1d5db',
    padding: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  signatureImage: {
    maxHeight: 50,
    maxWidth: 150,
    objectFit: 'contain',
  },
  noSignature: {
    fontSize: 8,
    color: '#999',
    fontStyle: 'italic',
  },
  signatureDate: {
    fontSize: 9,
    marginTop: 6,
  },
  
  // Office Use Only
  officeSection: {
    marginTop: 18,
  },
  officeBox: {
    border: '1 solid #d1d5db',
    borderRadius: 4,
    padding: 12,
  },
  officeSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  officeContent: {
    flexDirection: 'row',
    gap: 20,
  },
  officeLeft: {
    flex: 1,
  },
  officeRight: {
    flex: 1,
  },
  officeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  
  // Fixed Footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    borderTop: '2 solid #333',
    paddingTop: 8,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#4b5563',
  },
  pageNumber: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
    fontWeight: 'bold',
  },
});

export default EmployeeDetailsPDF;

