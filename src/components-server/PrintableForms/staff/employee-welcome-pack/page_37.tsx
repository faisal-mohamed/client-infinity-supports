import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

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
});

interface Page37Props {
  data?: any;
  staff?: any;
  showBlankForm?: boolean; // If true, shows empty form for staff to fill
}

const Page37: React.FC<Page37Props> = ({ data = {}, staff = {}, showBlankForm = false }) => {
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

