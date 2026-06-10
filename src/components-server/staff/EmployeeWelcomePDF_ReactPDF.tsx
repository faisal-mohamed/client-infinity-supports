import React from 'react';
import { View, Text, StyleSheet, Image, Document, Page } from '@react-pdf/renderer';
import PdfCheckbox from '../PrintableForms/staff/shared/PdfCheckbox';

interface EmployeeWelcomePDFProps {
  data: any;
}

const EmployeeWelcomePDF: React.FC<EmployeeWelcomePDFProps> = ({ data }) => {
  // Extract data - matching the view component structure
  const formData = data?.data ?? {};
  const settings = data?.settings ?? {};
  const staff = formData?.staff || data?.staff || {};
  
  // Get meta data from settings (matching view component logic)
  const website = settings?.company_website || 'infinitysupportswa.org';
  const formId = settings?.employee_welcome_form_id || 'SF009';
  const reviewDate = settings?.review_date || new Date().toISOString().slice(0, 10);
  
  // Get logo from data - already encoded by the route
  const logoDataUrl = data?.logoDataUrl || '';
  
  // Extract form values - matching view component
  const readAcknowledgement = normalizeBoolean(formData?.readAcknowledgement);
  const staffName = staff?.firstName && staff?.surname 
    ? `${staff.firstName} ${staff.surname}`.trim() 
    : formData?.staffName || formData?.fullName || '';
  const signatureImage = data?.staffSignature || formData?.staffSignature || formData?.signature;
  const staffSignedAt = data?.staffSignedAt || formData?.staffSignedAt;
  const signatureDate = staffSignedAt 
    ? new Date(staffSignedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric', year: 'numeric' })
    : '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo - matching view component */}
        <View style={styles.headerLogoContainer}>
          {logoDataUrl ? (
            <Image src={logoDataUrl} style={styles.logo} />
          ) : (
            <Text style={styles.logoPlaceholder}>Logo</Text>
          )}
        </View>

        {/* Title - matching view component */}
        <Text style={styles.heading}>Employee Handbook Acknowledgement Form</Text>

        {/* Body paragraphs - matching view component */}
        <Text style={styles.bodyText}>
          I confirm I have received the Employee handbook from Infinity Supports and have read and
          understood the content.
        </Text>
        <Text style={styles.bodyText}>
          A printed version of this handbook is also available. If you would like a printed version,
          please contact us.
        </Text>

        {/* Acknowledgement checkbox section - matching view component */}
        <View style={styles.ackContainer}>
          <View style={styles.ackRow}>
            <View style={styles.checkboxWrapper}>
              <PdfCheckbox checked={readAcknowledgement} size={20} mark="X" />
            </View>
            <Text style={styles.ackLabel}>
              <Text style={styles.ackBold}>I acknowledge that:</Text>
              {'\n'}• I have received the Employee Handbook from Infinity Supports
              {'\n'}• I have read and understood the content
              {'\n'}• I agree to comply with all policies and procedures outlined in the handbook
            </Text>
          </View>
        </View>

        {/* Name field - matching view component */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.underline}>
            <Text style={styles.fieldValue}>{staffName || '—'}</Text>
          </View>
        </View>

        {/* Signature section - matching view component */}
        <View style={styles.signatureContainer}>
          <Text style={styles.fieldLabel}>Signature</Text>
          {signatureImage ? (
            <Image src={signatureImage} style={styles.signatureImage} />
          ) : (
            <Text style={styles.noSignature}>No signature provided</Text>
          )}
        </View>

        {/* Date field - matching view component */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.underline}>
            <Text style={styles.fieldValue}>{signatureDate || '—'}</Text>
          </View>
        </View>

        {/* Footer - matching view component */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Website: {website}</Text>
          <Text style={styles.footerText}>{formId}</Text>
          <Text style={styles.footerText}>Review Date: {reviewDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

const normalizeBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
  }
  return false;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 96, // Matching view: px-[96px]
    paddingTop: 48, // Matching view: pt-12 (12 * 4px = 48px)
    paddingBottom: 112, // Matching view: pb-[112px]
    fontFamily: 'Helvetica',
    fontSize: 12, // Matching view: text-[12pt]
    minHeight: 1123, // Matching view: min-h-[1123px] (A4 height in points)
  },
  headerLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8, // Matching view: mt-2 (2 * 4px = 8px)
    marginBottom: 24, // Matching view: mb-6 (6 * 4px = 24px)
  },
  logo: {
    height: 64, // Matching view: h-16 (16 * 4px = 64px)
    objectFit: 'contain',
  },
  logoPlaceholder: {
    fontSize: 12,
    color: '#9ca3af',
  },
  heading: {
    fontSize: 12, // Matching view: text-[12pt]
    fontWeight: 600, // Matching view: font-semibold
    textAlign: 'center',
    marginBottom: 24, // Matching view: mb-6
    color: '#1a1a1a',
  },
  bodyText: {
    fontSize: 12, // Matching view: text-[12pt]
    color: '#1f2937',
    lineHeight: 1.5,
    marginBottom: 16, // Matching view: mb-4
  },
  ackContainer: {
    marginTop: 24, // Matching view: space-y-6 (6 * 4px = 24px)
    marginBottom: 24,
    padding: 16, // Matching view: p-4
    borderWidth: 1,
    borderColor: '#d1d5db', // Matching view: border-gray-300
    borderRadius: 8, // Matching view: rounded-lg
    backgroundColor: '#f9fafb', // Matching view: bg-gray-50
  },
  ackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12, // Matching view: gap-3 (3 * 4px = 12px)
  },
  checkboxWrapper: {
    marginTop: 4, // Matching view: mt-1
    width: 20, // Matching view: w-5 (5 * 4px = 20px)
    height: 20, // Matching view: h-5
  },
  ackLabel: {
    fontSize: 12, // Matching view: text-[12pt]
    lineHeight: 1.5, // Matching view: leading-relaxed
    color: '#1f2937',
    flex: 1,
  },
  ackBold: {
    fontWeight: 700, // bold
  },
  fieldContainer: {
    marginTop: 24, // Matching view: space-y-6
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 12, // Matching view: text-[12pt]
    marginBottom: 4, // Matching view: mb-1
    color: '#1f2937',
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.6)', // Matching view: border-black/60
    paddingLeft: 4, // Matching view: px-1
    paddingRight: 4,
    paddingTop: 8, // Matching view: py-2
    paddingBottom: 8,
  },
  fieldValue: {
    fontSize: 12,
    color: '#1f2937', // Matching view: text-gray-800
  },
  signatureContainer: {
    marginTop: 24,
    marginBottom: 32, // Matching view: mb-8
  },
  signatureImage: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    maxHeight: 80, // Matching view: max-h-20 (20 * 4px = 80px)
    backgroundColor: '#ffffff',
    objectFit: 'contain',
    marginTop: 8, // Matching view: mb-2 (converted to mt)
  },
  noSignature: {
    fontSize: 12,
    color: '#9ca3af', // Matching view: text-gray-400
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 24, // Matching view: bottom-6 (6 * 4px = 24px)
    left: 96, // Matching view: left-[96px]
    right: 96, // Matching view: right-[96px]
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10, // Matching view: text-[10pt]
    color: '#4b5563', // Matching view: text-gray-600
  },
  footerText: {
    fontSize: 10,
    color: '#4b5563',
  },
});

export default EmployeeWelcomePDF;
