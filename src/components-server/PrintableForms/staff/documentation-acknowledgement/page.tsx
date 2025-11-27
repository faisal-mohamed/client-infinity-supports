import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 70,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.3,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  headerLogo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  section: {
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 9,
    marginBottom: 6,
    color: '#374151',
    lineHeight: 1.4,
  },
  bulletList: {
    marginBottom: 8,
    paddingLeft: 15,
  },
  bulletItem: {
    fontSize: 9,
    marginBottom: 4,
    color: '#374151',
    lineHeight: 1.4,
  },
  signatureSection: {
    marginTop: 30,
    borderTop: '1 solid #d1d5db',
    paddingTop: 15,
  },
  signatureField: {
    marginBottom: 12,
  },
  signatureLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#374151',
  },
  signatureValue: {
    fontSize: 9,
    color: '#111827',
    minHeight: 18,
  },
  signatureBox: {
    border: '1 solid #d1d5db',
    minHeight: 40,
    marginTop: 4,
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureImage: {
    maxHeight: 35,
    maxWidth: '100%',
    objectFit: 'contain',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
  employeeDetailsSection: {
    marginBottom: 15,
    borderTop: '1 solid #000000',
    paddingTop: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: 100,
    color: '#111827',
    marginRight: 8,
  },
  fieldBox: {
    flex: 1,
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 2,
    minHeight: 16,
  },
  fieldValue: {
    fontSize: 9,
    color: '#111827',
  },
});

interface DocumentationAcknowledgementPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
}

const DocumentationAcknowledgementPDF: React.FC<DocumentationAcknowledgementPDFProps> = ({
  data = {},
  staff = {},
  settings = {},
  images = {},
}) => {
  const formData = data?.data || data || {};

  // Helper functions
  const getValue = (key: string): string => {
    return formData[key] || '';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-AU');
    } catch {
      return dateStr;
    }
  };

  const renderHeader = () => {
    if (!images?.infinityLogo) return null;
    return (
      <View style={styles.header} fixed>
        <Image src={images.infinityLogo} style={styles.headerLogo} />
      </View>
    );
  };

  const renderSignature = (signature: string) => {
    if (!signature) {
      return (
        <View style={styles.signatureBox}>
          <Text style={{ fontSize: 8, color: '#9ca3af' }}>No signature</Text>
        </View>
      );
    }
    return (
      <View style={styles.signatureBox}>
        <Image src={signature} style={styles.signatureImage} />
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Documentation Acknowledgement</Text>

        {/* Employee Details Section */}
        <View style={styles.employeeDetailsSection}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabel}>
              <Text style={{ fontWeight: 'bold', fontSize: 9, color: '#111827' }}>First Name:</Text>
            </View>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValue}>{staff?.firstName || ''}</Text>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabel}>
              <Text style={{ fontWeight: 'bold', fontSize: 9, color: '#111827' }}>Surname:</Text>
            </View>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValue}>{staff?.surname || ''}</Text>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabel}>
              <Text style={{ fontWeight: 'bold', fontSize: 9, color: '#111827' }}>Email:</Text>
            </View>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValue}>{staff?.email || ''}</Text>
            </View>
          </View>
        </View>

        {/* Document Receipt Confirmation Section */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            I confirm I have received copies of the following documents from Infinity Supports WA.
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• First aid policy</Text>
            <Text style={styles.bulletItem}>• Vehicle safety policy</Text>
            <Text style={styles.bulletItem}>• Vehicle safety inspection checklist</Text>
            <Text style={styles.bulletItem}>• Training on bullying and harassment</Text>
          </View>
          <Text style={styles.paragraph}>
            Copies of the same documents are available on www.infinitysupportswa.org and could also be requested via email. I have read and understood the contents of these documents.
          </Text>
        </View>

        {/* Commitments Section */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>I also confirm that,</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • I will conduct vehicle safety inspection as per the checklist provided by Infinity Supports WA at the start of each working day.
            </Text>
            <Text style={styles.bulletItem}>
              • I will ensure that my driving license is valid, vehicle used for work purposes is registered, comprehensively insured and mechanically sound.
            </Text>
            <Text style={styles.bulletItem}>
              • I understand that I will be provided with a first aid kit to be always kept in my vehicle and the onus is on me to inform management should any contents of the first aid kits expire.
            </Text>
            <Text style={styles.bulletItem}>
              • I will work in compliance with NDIS code of conduct.
            </Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureField}>
            <Text style={styles.signatureLabel}>Staff Name:</Text>
            <Text style={styles.signatureValue}>{getValue('staffName')}</Text>
          </View>

          <View style={styles.signatureField}>
            <Text style={styles.signatureLabel}>Signature:</Text>
            {renderSignature(getValue('signature'))}
          </View>

          <View style={styles.signatureField}>
            <Text style={styles.signatureLabel}>Date:</Text>
            <Text style={styles.signatureValue}>{formatDate(getValue('date'))}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DocumentationAcknowledgementPDF;

