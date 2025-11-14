import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

interface NdisCodeOfConductPDFProps {
  data?: any;
  settings?: any;
  showBlankForm?: boolean;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: '#ffffff',
  },
  headerBlock: {
    marginBottom: 8,
    border: '1 solid #111827',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #111827',
  },
  headerLeft: {
    flex: 1,
    borderRight: '1 solid #111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerLogo: {
    width: 160,
    height: 60,
    objectFit: 'contain',
  },
  headerRight: {
    flex: 1,
    backgroundColor: '#9333ea',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    marginTop: 20,
  },
  metaRow: {
    flexDirection: 'row',
    borderTopWidth: 0,
    borderBottom: '1 solid #9ca3af',
    borderLeft: '1 solid #9ca3af',
    borderRight: '1 solid #9ca3af',
    fontSize: 10,
  },
  metaCell: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRight: '1 solid #d1d5db',
    color: '#4b5563',
  },
  metaCellLast: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: '#4b5563',
  },
  metaLabel: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  introText: {
    marginBottom: 14,
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#111827',
  },
  numberedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  numberBadge: {
    width: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  paragraph: {
    marginBottom: 10,
    color: '#111827',
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
  },
  acknowledgement: {
    backgroundColor: '#f9fafb',
    border: '1 solid #e5e7eb',
    padding: 12,
    borderRadius: 4,
    marginTop: 18,
    marginBottom: 20,
  },
  acknowledgementText: {
    fontSize: 11,
    color: '#111827',
  },
  signaturePageContent: {
    marginTop: 32,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  fieldLabel: {
    width: 110,
    fontWeight: 'bold',
    color: '#111827',
  },
  fieldLine: {
    flex: 1,
    borderBottom: '1 dotted #4b5563',
    minHeight: 26,
    paddingBottom: 2,
  },
  signatureBox: {
    flex: 1,
    borderBottom: '1 dotted #4b5563',
    minHeight: 60,
    justifyContent: 'center',
  },
  signatureImage: {
    maxWidth: 280,
    maxHeight: 54,
    objectFit: 'contain',
    alignSelf: 'center',
  },
});

const conductPoints = [
  'Act with respect for individual rights for freedom of expression, self-determination and decision-making.',
  'Respect the privacy of people with disability.',
  'Provide supports and services safely, competently, with care and skill.',
  'Act with integrity, honesty and transparency.',
  'Raise and act on concerns about quality and safety of supports and services.',
  'Take reasonable steps to prevent and respond to all forms of violence, exploitation, neglect and abuse.',
  'Take reasonable steps to prevent and respond to sexual misconduct.',
];

const additionalExpectations = [
  'Avoid charging NDIS participants more than other customers for essentially the same product, support, or service without valid justification.',
  'Do not advertise or promote higher prices for the same supports or services for participants unless a valid justification is provided.',
];

const formatDate = (value?: string) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-AU');
  } catch {
    return value;
  }
};

const formatVersionDate = (value?: string) => {
  if (!value) return '10/01/2024';
  const parts = value.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return value;
};

const HeaderSection: React.FC<{ logoUrl: string; versionDate: string }> = ({ logoUrl, versionDate }) => (
  <View style={styles.headerBlock}>
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        {logoUrl ? <Image src={logoUrl} style={styles.headerLogo} /> : <Text>Infinity Supports WA</Text>}
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.headerTitle}>NDIS Code of Conduct</Text>
      </View>
    </View>
    <View style={styles.metaRow}>
      <View style={[styles.metaCell, { flex: 2 }]}>
        <Text>
          <Text style={styles.metaLabel}>Doc No:</Text>
          NDIS Manual
        </Text>
      </View>
      <View style={[styles.metaCell, { flex: 1 }]}>
        <Text>
          <Text style={styles.metaLabel}>Version No:</Text>
          01
        </Text>
      </View>
      <View style={[styles.metaCellLast, { flex: 1.2 }]}>
        <Text>
          <Text style={styles.metaLabel}>Version Date:</Text>
          {versionDate}
        </Text>
      </View>
    </View>
  </View>
);

const NdisCodeOfConductPDF: React.FC<NdisCodeOfConductPDFProps> = ({ data, showBlankForm = false }) => {
  const payload = data?.data || data || {};
  const staff = payload.staff || {};
  const staffName =
    (!showBlankForm && (payload.staffName || (staff.firstName ? `${staff.firstName} ${staff.surname || ''}`.trim() : ''))) || '';
  const position = !showBlankForm && payload.position ? payload.position : '';
  const signature =
    !showBlankForm && (payload.staffSignature || payload.signature) ? (payload.staffSignature || payload.signature) : '';
  const dateValue =
    !showBlankForm && (payload.date || payload.staffSignedAt) ? formatDate(payload.date || payload.staffSignedAt) : '';
  const versionDateValue = formatVersionDate(payload.versionDate);

  const logoUrl = data?.settings?.logoDataUrl || '/infinity_logo.png';

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        <HeaderSection logoUrl={logoUrl} versionDate={versionDateValue} />

        <View style={styles.content}>
          <Text style={styles.title}>NDIS Code of Conduct Acknowledgment</Text>

          <Text style={styles.introText}>
            <Text style={{ fontWeight: 'bold', color: '#b91c1c' }}>Infinity Supports WA</Text> and our workers are committed
            to following the National Disability Insurance Scheme (NDIS) Code of Conduct. The Code sets clear expectations
            for behaviour, integrity, and quality service delivery when providing supports to participants.
          </Text>

          <Text style={styles.sectionTitle}>I commit to:</Text>
          {conductPoints.map((item, index) => (
            <View key={index} style={styles.numberedRow}>
              <Text style={styles.numberBadge}>{index + 1}.</Text>
              <Text>{item}</Text>
            </View>
          ))}

          <Text style={styles.paragraph}>
            The NDIS Commission expects providers to demonstrate honesty, integrity, and transparency in all dealings. This
            includes providing clear justification for pricing decisions and complying with Australian Consumer Law, which
            prohibits misleading conduct, false statements, and unfair contract terms.
          </Text>

          <View style={styles.paragraph}>
            <Text style={{ fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>Price Differentiation:</Text>
            <Text>
              Charging NDIS participants more than other customers for the same supports or services without justification may
              be considered a ‘sharp practice’. Providers must avoid behaviours that disadvantage participants.
            </Text>
          </View>

          <View style={styles.bulletList}>
            {additionalExpectations.map((item, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.acknowledgement}>
            <Text style={styles.acknowledgementText}>
              I acknowledge that I have read, understood, and will comply with the NDIS Code of Conduct. I understand that
              breaches of the Code may lead to disciplinary action and reporting to the NDIS Commission.
            </Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <HeaderSection logoUrl={logoUrl} versionDate={versionDateValue} />

        <View style={[styles.content, styles.signaturePageContent]}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Staff Name</Text>
            <View style={styles.fieldLine}>{staffName ? <Text>{staffName}</Text> : <Text />}</View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Position / Title</Text>
            <View style={styles.fieldLine}>{position ? <Text>{position}</Text> : <Text />}</View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.fieldLine}>{dateValue ? <Text>{dateValue}</Text> : <Text />}</View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Signature</Text>
            <View style={styles.signatureBox}>
              {signature ? <Image src={signature} style={styles.signatureImage} /> : <Text />}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default NdisCodeOfConductPDF;

