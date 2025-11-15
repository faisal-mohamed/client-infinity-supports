import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 48,
    paddingTop: 80,
    paddingBottom: 72,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    position: 'absolute',
    top: 24,
    left: 48,
    right: 48,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLogo: {
    width: 140,
    height: 45,
    objectFit: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 16,
    textAlign: 'left',
  },
  acknowledgementBox: {
    border: '1 solid #d1d5db',
    padding: 14,
    marginTop: 12,
    marginBottom: 28,
    backgroundColor: '#f9fafb',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1 solid #111827',
    marginRight: 8,
    marginTop: 2,
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    border: '1 solid #2563eb',
    backgroundColor: '#2563eb',
    marginRight: 8,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 1.5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  fieldLine: {
    borderBottom: '1 dotted #111827',
    minHeight: 24,
    paddingBottom: 4,
    paddingLeft: 4,
    justifyContent: 'flex-end',
  },
  fieldValue: {
    fontSize: 11,
  },
  signatureBox: {
    minHeight: 60,
    border: '1 dotted #111827',
    padding: 6,
    justifyContent: 'center',
  },
  signatureImage: {
    width: '100%',
    height: 50,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    color: '#6b7280',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
  },
});

interface FairworkInformationPDFProps {
  data?: any;
}

const formatDate = (value?: string) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.warn('[Fairwork PDF] Failed to format date:', value, error);
    return value;
  }
};

const FairworkInformationPDF: React.FC<FairworkInformationPDFProps> = ({ data = {} }) => {
  const logo =
    data?.settings?.logoDataUrl ||
    data?.logoDataUrl ||
    data?.data?.logoDataUrl ||
    '/infinity_logo.png';

  const formData = data?.data ?? {};
  const staff = formData.staff ?? data?.staff ?? {};

  const staffName =
    formData.staffName ||
    formData.employeeName ||
    `${staff.firstName || ''} ${staff.surname || ''}`.trim();

  const signature =
    formData.signature ||
    formData.staffSignature ||
    data?.staffSignature ||
    '';

  const dateValue =
    formData.date ||
    formData.acknowledgedAt ||
    formData.staffSignedAt ||
    formData.staffSignatureDate ||
    data?.staffSignedAt ||
    data?.date ||
    '';

  console.log('[Fairwork PDF] Data received:', {
    staffName,
    signaturePresent: !!signature,
    dateValue,
    rawDateFields: {
      formDate: formData.date,
      acknowledgedAt: formData.acknowledgedAt,
      staffSignedAt: formData.staffSignedAt,
      staffSignatureDate: formData.staffSignatureDate,
      dataStaffSignedAt: data?.staffSignedAt,
      dataDate: data?.date,
    },
  });

  const acknowledged =
    formData.acknowledged ??
    formData.readAcknowledgement ??
    formData.fairworkAcknowledged ??
    false;

  const footerLeft = formData.footerLeft || '';
  const footerCenter = formData.footerCenter || '';
  const footerRight = formData.footerRight || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {logo && (
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.headerLogo} />
          </View>
        )}

        <Text style={styles.title}>Fairwork Information Statements – Acknowledgement</Text>

        <Text style={styles.paragraph}>
          I confirm that I have received, read and understood the Fairwork Information Statements provided
          to me by Infinity Supports WA. I understand that these outline my minimum employment rights
          and that I can request additional clarification or copies at any time.
        </Text>

        <Text style={styles.paragraph}>
          I acknowledge that it is my responsibility to retain a copy for my records and to comply with the
          requirements set out in these statements.
        </Text>

        <View style={styles.acknowledgementBox}>
          <View style={styles.checkboxRow}>
            <View style={acknowledged ? styles.checkboxChecked : styles.checkbox}>
              {acknowledged && <Text style={{ fontSize: 8, color: '#ffffff', fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              <Text style={{ fontWeight: 'bold' }}>I acknowledge that:</Text>{'\n'}
              • I have received the Fairwork Information Statements from Infinity Supports WA{'\n'}
              • I have read and understood the content{'\n'}
              • I may request further clarification or copies at any time
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{staffName}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Signature</Text>
          <View style={styles.signatureBox}>
            {signature ? (
              <Image src={signature} style={styles.signatureImage} />
            ) : (
              <Text style={styles.fieldValue}> </Text>
            )}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{formatDate(dateValue)}</Text>
          </View>
        </View>

        {(footerLeft || footerCenter || footerRight) && (
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>{footerLeft}</Text>
            <Text style={styles.footerText}>{footerCenter}</Text>
            <Text style={styles.footerText}>{footerRight}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default FairworkInformationPDF;


