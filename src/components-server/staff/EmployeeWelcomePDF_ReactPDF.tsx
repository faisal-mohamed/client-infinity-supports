import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import BasePDFLayout, { PDFMeta } from '@/components-server/pdf/layout/BasePDFLayout';
import PDFSection from '@/components-server/pdf/layout/PDFSection';
import { CheckboxItem } from '@/components-server/pdf/elements/PDFCheckboxGroup';
import PDFPanel from '@/components-server/pdf/elements/PDFPanel';
import { PDFFieldFullWidth } from '@/components-server/pdf/elements/PDFField';
import PDFSignatureBlock from '@/components-server/pdf/elements/PDFSignatureBlock';

interface EmployeeWelcomePDFProps {
  data: any;
}

const EmployeeWelcomePDF: React.FC<EmployeeWelcomePDFProps> = ({ data }) => {
  const meta: PDFMeta = {
    website: 'infinitysupportswa.org',
    version: 'SF009',
    reviewDate: '2025-03-01',
  };

  const logoUrl = data?.logoDataUrl || '/infinity_logo.png';
  const formData = data?.data ?? {};
  const readAcknowledgement = normalizeBoolean(formData.readAcknowledgement);
  const fullName = formData.fullName || '';
  const signatureImage = data?.staffSignature || formData.signature;
  const signatureDate = data?.staffSignedAt || formData.date;

  return (
    <BasePDFLayout title="Employee Handbook Acknowledgement Form" logo={logoUrl} meta={meta}>
      <View style={styles.container}>
        <Text style={styles.heading}>Employee Handbook Acknowledgement Form</Text>

        <Text style={styles.bodyText}>
          I confirm I have received the Employee Handbook from Infinity Supports and have read and understood the content.
        </Text>
        <Text style={styles.bodyText}>
          A printed version of this handbook is also available. If you would like a printed version, please contact us.
        </Text>

        <PDFPanel>
          <View style={styles.ackRow}>
            <CheckboxItem checked={readAcknowledgement} label="I acknowledge that:" />
          </View>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• I have received the Employee Handbook from Infinity Supports</Text>
            <Text style={styles.bullet}>• I have read and understood the content</Text>
            <Text style={styles.bullet}>• I agree to comply with all policies and procedures outlined in the handbook</Text>
          </View>
        </PDFPanel>

        <View style={styles.fieldLine}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>{fullName}</Text>
        </View>

        <PDFSignatureBlock
          label="Signature"
          image={signatureImage}
          date={signatureDate}
        />
      </View>
    </BasePDFLayout>
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
  container: {
    width: '100%',
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  bodyText: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  ackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.5,
  },
  fieldLine: {
    marginTop: 18,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 10,
    borderBottom: '1 solid #1f2937',
    paddingBottom: 6,
    color: '#111827',
  },
});

export default EmployeeWelcomePDF;
