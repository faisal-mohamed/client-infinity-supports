import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import PdfCheckbox from '../shared/PdfCheckbox';

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 16,
    textAlign: 'left',
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
  ackContainer: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  ackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxWrapper: {
    marginTop: 4,
    width: 20,
    height: 20,
  },
  ackLabel: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1f2937',
    flex: 1,
  },
  ackBold: {
    fontWeight: 700,
  },
});

interface Page37Props {
  data?: any;
  staff?: any;
  showBlankForm?: boolean; // If true, shows empty form for staff to fill
}

const Page37: React.FC<Page37Props> = ({ data = {}, staff = {}, showBlankForm = false }) => {
  // Extract readAcknowledgement value - handle various formats and nested data structures
  const formData = data?.data || data || {};
  const readAcknowledgement = (() => {
    // Check both data.readAcknowledgement and data.data.readAcknowledgement
    const value = data.readAcknowledgement || formData.readAcknowledgement;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
    }
    return false;
  })();
  
  console.log('[Page37] Data received:', {
    hasData: !!data,
    dataKeys: Object.keys(data || {}),
    readAcknowledgement,
    formDataKeys: Object.keys(formData || {}),
  });

  return (
    <View>
      <Text style={styles.title}>Employee Handbook Acknowledgement Form</Text>
      
      <Text style={styles.paragraph}>
        I confirm I have received the Employee handbook from Infinity Supports and have read and 
        understood the content.
      </Text>
      
      <Text style={styles.paragraph}>
        A printed version of this handbook is also available. If you would like a printed version, 
        please contact us.
      </Text>

      {/* Acknowledgement checkbox section - Always show when not blank form */}
      {!showBlankForm && (
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
      )}

      {/* Name field with dotted line */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Name</Text>
        <View style={styles.fieldLine}>
          <Text style={styles.fieldValue}>
            {/* Show empty if blank form, otherwise show staff name */}
            {!showBlankForm && staff?.firstName && staff?.surname 
              ? `${staff.firstName} ${staff.surname}` 
              : ''
            }
          </Text>
        </View>
      </View>

      {/* Signature field with dotted line */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Signature</Text>
        <View style={styles.signatureFieldLine}>
          {/* Show signature only if not blank form and signature exists */}
          {!showBlankForm && data?.staffSignature && (
            <Image src={data.staffSignature} style={styles.signatureImage} />
          )}
        </View>
      </View>

      {/* Date field with dotted line */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Date</Text>
        <View style={styles.fieldLine}>
          <Text style={styles.fieldValue}>
            {/* Show date only if not blank form */}
            {!showBlankForm && data?.staffSignedAt 
              ? new Date(data.staffSignedAt).toLocaleDateString('en-AU') 
              : ''
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Page37;

