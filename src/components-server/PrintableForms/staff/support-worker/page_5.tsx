import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  fieldRow: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'normal',
    marginBottom: 6,
  },
  fieldBox: {
    border: '1 solid #9ca3af',
    minHeight: 28,
    padding: 6,
  },
  fieldValue: {
    fontSize: 11,
  },
  signatureRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  signatureBox: {
    border: '1 solid #9ca3af',
    minHeight: 120,
    height: 120,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureImage: {
    maxHeight: 100,
    maxWidth: '100%',
    objectFit: 'contain',
  },
});

interface Page5Props {
  data?: any;
  staff?: any;
  showBlankForm?: boolean;
}

const Page5: React.FC<Page5Props> = ({ data = {}, staff = {}, showBlankForm = false }) => {
  return (
    <View>
      {/* Employee Acknowledgement - Full page with lots of space */}
      <Text style={styles.sectionHeader}>Employee Acknowledgement</Text>
      
      {/* Name - Full width with more space */}
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>Name:</Text>
        <View style={styles.fieldBox}>
          <Text style={styles.fieldValue}>
            {!showBlankForm && staff?.firstName && staff?.surname 
              ? `${staff.firstName} ${staff.surname}` 
              : ''
            }
          </Text>
        </View>
      </View>

      {/* Signature and Date side by side with more space */}
      <View style={styles.signatureRow}>
        {/* Signature - Takes more space (2/3 width) */}
        <View style={{ flex: 2 }}>
          <Text style={styles.fieldLabel}>Signature:</Text>
          <View style={styles.signatureBox}>
            {!showBlankForm && data?.signature && (
              <Image src={data.signature} style={styles.signatureImage} />
            )}
          </View>
        </View>

        {/* Date - Takes less space (1/3 width) */}
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Date:</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>
              {!showBlankForm && data?.signatureDate 
                ? new Date(data.signatureDate).toLocaleDateString('en-AU')
                : ''
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Page5;

