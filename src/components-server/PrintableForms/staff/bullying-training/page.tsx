import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

interface BullyingTrainingPDFProps {
  data?: any;
  settings?: any;
  images?: any;
  showBlankForm?: boolean;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 52,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 52,
    right: 52,
    alignItems: 'center',
  },
  headerLogo: {
    width: 120,
    height: 45,
    objectFit: 'contain',
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 18,
  },
  introText: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 14,
    color: '#111827',
  },
  acknowledgementBox: {
    backgroundColor: '#f9fafb',
    border: '1 solid #d1d5db',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  acknowledgementTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111827',
  },
  acknowledgementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  acknowledgementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
    marginTop: 5,
    marginRight: 8,
  },
  acknowledgementText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
    color: '#111827',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 110,
    marginRight: 8,
    color: '#111827',
  },
  fieldLine: {
    flex: 1,
    borderBottom: '1 dotted #4b5563',
    minHeight: 22,
    paddingBottom: 2,
  },
  fieldValue: {
    fontSize: 11,
    color: '#111827',
  },
  signatureField: {
    flex: 1,
    borderBottom: '1 dotted #4b5563',
    minHeight: 42,
    paddingBottom: 4,
    justifyContent: 'center',
  },
  signatureImage: {
    maxWidth: 160,
    maxHeight: 40,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 52,
    right: 52,
    paddingTop: 10,
    borderTop: '1 solid #e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#666666',
  },
  footerText: {
    fontSize: 9,
    color: '#666666',
  },
});

const BullyingTrainingPDF: React.FC<BullyingTrainingPDFProps> = ({
  data: rawData,
  settings,
  images,
  showBlankForm = false,
}) => {
  const payload = rawData || {};
  const formData = payload?.data || payload || {};
  const mergedSettings = settings || payload?.settings || {};
  // Use images prop like other forms (bullying-harassment-training, pre-employment-medical, etc.)
  const logoUrl = images?.infinityLogo || mergedSettings?.logoDataUrl || '';
  const footerWebsite = mergedSettings?.website || mergedSettings?.company_website;
  const footerId = mergedSettings?.bullying_training_form_id;
  const footerDate = mergedSettings?.bullying_training_review_date;
  const acknowledgementPoints = [
    'I have completed the Bullying Training session.',
    'I understand the concepts and procedures covered.',
    'I will apply this knowledge in my work environment.',
    'I am aware of the complaint procedures and support available.',
  ];
  const acknowledgerName = !showBlankForm && formData?.acknowledgerName ? formData.acknowledgerName : '';
  const hrFocusDate = !showBlankForm && formData?.hrFocusDate ? formData.hrFocusDate : '';
  const staffName = !showBlankForm && formData?.staffName ? formData.staffName : '';
  const staffSignature = !showBlankForm
    ? (formData?.staffSignature || payload?.staffSignature || '')
    : '';
  const staffDateRaw = !showBlankForm
    ? (formData?.date || formData?.staffSignedAt || payload?.staffSignedAt || '')
    : '';
  const managerName = !showBlankForm
    ? (formData?.managerName || payload?.managerName || '')
    : '';
  const managerSignature = !showBlankForm
    ? (formData?.managerSignature || payload?.managerSignature || '')
    : '';
  const managerSignedAtRaw = !showBlankForm
    ? (formData?.managerSignedAt || payload?.managerSignedAt || '')
    : '';

  const formatDate = (value: string) => {
    if (!value) return '';
    try {
      const dateObj = new Date(value);
      if (Number.isNaN(dateObj.getTime())) return value;
      return dateObj.toLocaleDateString('en-AU');
    } catch {
      return value;
    }
  };

  const staffDate = staffDateRaw ? formatDate(staffDateRaw) : '';
  const managerSignedDate = managerSignedAtRaw ? formatDate(managerSignedAtRaw) : '';

  // Render header with logo (same format as bullying-harassment-training)
  const renderHeader = () => {
    if (!logoUrl) return null;
    return (
      <View style={styles.header} fixed>
        <Image src={logoUrl} style={styles.headerLogo} />
      </View>
    );
  };

  // Render footer - using form settings API like other staff forms
  const renderFooter = () => {
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
      <Page size="A4" style={styles.page} wrap={false}>
        {renderHeader()}

        <View style={styles.content}>
          <Text style={styles.title}>Bullying Training Acknowledgment Form</Text>

          <Text style={styles.introText}>
            I {acknowledgerName || '_________________'} acknowledge that I completed{' '}
            <Text style={{ fontWeight: 'bold', color: '#b91c1c' }}>Bullying and harassment training</Text> conducted by
            Infinity Supports WA and HR Focus on {hrFocusDate || '__________'}. I also acknowledge that I have received
            training/study materials for the above-mentioned training.
          </Text>

          <View style={styles.acknowledgementBox}>
            <Text style={styles.acknowledgementTitle}>I acknowledge that:</Text>
            {acknowledgementPoints.map((point, index) => (
              <View key={index} style={styles.acknowledgementItem}>
                <View style={styles.acknowledgementBullet} />
                <Text style={styles.acknowledgementText}>{point}</Text>
              </View>
            ))}
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Staff Name</Text>
            <View style={styles.fieldLine}>
              {staffName ? <Text style={styles.fieldValue}>{staffName}</Text> : <Text />}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Staff Signature</Text>
            <View style={styles.signatureField}>
              {staffSignature ? (
                <Image src={staffSignature} style={styles.signatureImage} />
              ) : (
                <Text />
              )}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.fieldLine}>
              {staffDate ? <Text style={styles.fieldValue}>{staffDate}</Text> : <Text />}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Manager&apos;s Name</Text>
            <View style={styles.fieldLine}>
              {managerName ? <Text style={styles.fieldValue}>{managerName}</Text> : <Text />}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Manager&apos;s Signature</Text>
            <View style={styles.signatureField}>
              {managerSignature ? (
                <Image src={managerSignature} style={styles.signatureImage} />
              ) : (
                <Text />
              )}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Manager Signed Date</Text>
            <View style={styles.fieldLine}>
              {managerSignedDate ? <Text style={styles.fieldValue}>{managerSignedDate}</Text> : <Text />}
            </View>
          </View>
        </View>

        {renderFooter()}
      </Page>
    </Document>
  );
};

export default BullyingTrainingPDF;

