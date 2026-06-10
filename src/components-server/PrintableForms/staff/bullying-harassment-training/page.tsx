import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import PdfCheckbox from '../shared/PdfCheckbox';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingTop: 80,
    paddingBottom: 80,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLogo: {
    width: 140,
    height: 45,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTop: '1 solid #e5e7eb',
    fontSize: 9,
    color: '#666666',
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 16,
    textAlign: 'left',
  },
  acknowledgementBox: {
    border: '1 solid #d1d5db',
    padding: 12,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#f9fafb',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 12,
    height: 12,
    marginRight: 8,
    marginTop: 2,
  },
  checkboxText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 1.6,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'normal',
    width: 80,
  },
  fieldLine: {
    flex: 1,
    borderBottom: '1 dotted #000',
    minHeight: 20,
    paddingBottom: 4,
    paddingLeft: 8,
  },
  fieldValue: {
    fontSize: 11,
  },
  signatureFieldLine: {
    flex: 1,
    borderBottom: '1 dotted #000',
    minHeight: 60,
    paddingBottom: 4,
    paddingLeft: 8,
  },
  signatureImage: {
    maxHeight: 50,
    objectFit: 'contain',
  },
});

interface BullyingHarassmentTrainingPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
  showBlankForm?: boolean;
}

const BullyingHarassmentTrainingPDF: React.FC<BullyingHarassmentTrainingPDFProps> = ({
  data = {},
  staff = {},
  settings = {},
  images = {},
  showBlankForm = false,
}) => {
  console.log('🔍 [PDF] Bullying & Harassment Training - Generating acknowledgement PDF');

  // Helper to format date
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  // Render header
  const renderHeader = () => {
    if (!images?.infinityLogo) return null;
    return (
      <View style={styles.header} fixed>
        <Image src={images.infinityLogo} style={styles.headerLogo} />
      </View>
    );
  };

  // Render footer - using form settings API like other staff forms
  const renderFooter = () => {
    const footerWebsite = settings?.website || settings?.company_website;
    const footerId = settings?.bullying_harassment_training_form_id;
    // Only use form-specific review date, no fallback to general review_date
    const footerDate = settings?.bullying_harassment_training_review_date;

    // Only show footer if at least one value exists
    if (!footerWebsite && !footerId && !footerDate) return null;

    return (
      <View style={styles.footer} fixed>
        {footerWebsite && <Text style={styles.footerText}>Website: {footerWebsite}</Text>}
        {footerId && <Text style={styles.footerText}>{footerId}</Text>}
        {footerDate && <Text style={styles.footerText}>Review Date: {footerDate}</Text>}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        
        <Text style={styles.title}>Bullying & Harassment Training Acknowledgement Form</Text>
        
        <Text style={styles.paragraph}>
          I acknowledge that I have received, read, and understood the Bullying & Harassment Training materials provided to me.
        </Text>

        {/* Acknowledgement Checkbox */}
        <View style={styles.acknowledgementBox}>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              <PdfCheckbox checked={!showBlankForm && !!data?.readAcknowledgement} size={12} mark="X" />
            </View>
            <Text style={styles.checkboxText}>
              <Text style={{ fontWeight: 'bold' }}>I acknowledge that:</Text>{'\n'}
              • I have completed the Bullying & Harassment Training{'\n'}
              • I understand the key concepts and procedures covered in the training{'\n'}
              • I will apply this knowledge in my work environment{'\n'}
              • I am aware of the complaint procedures and support available
            </Text>
          </View>
        </View>

        {/* Name field with dotted line */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>
              {!showBlankForm && (data?.fullName || (staff?.firstName && staff?.surname 
                ? `${staff.firstName} ${staff.surname}` 
                : ''))}
            </Text>
          </View>
        </View>

        {/* Signature field with dotted line */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Signature</Text>
          <View style={styles.signatureFieldLine}>
            {!showBlankForm && (data?.signature || data?.staffSignature) && (
              <Image src={data?.signature || data?.staffSignature} style={styles.signatureImage} />
            )}
          </View>
        </View>

        {/* Date field with dotted line */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>
              {!showBlankForm && formatDate(data?.date || data?.staffSignedAt)}
            </Text>
          </View>
        </View>

        {renderFooter()}
      </Page>
    </Document>
  );
};

export default BullyingHarassmentTrainingPDF;





