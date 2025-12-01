import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

interface Props {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl?: string;
  images?: any;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 120,
    paddingBottom: 70,
    fontFamily: 'Helvetica'
  },
  header: {
    position: 'absolute', top: 20, left: 0, right: 0,
    alignItems: 'center'
  },
  headerLogo: { width: 180, height: 70 },
  title: { textAlign: 'center', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textDecoration: 'underline' },
  sectionHeader: { fontSize: 10, fontWeight: 'bold', marginTop: 10, marginBottom: 6, textDecoration: 'underline' },
  label: { fontSize: 9, fontWeight: 'bold' },
  value: { fontSize: 9, lineHeight: 1.3 },
  row: { flexDirection: 'row' },
  cell: { border: '1 solid #000', padding: 6, flexGrow: 1 },
  inlineRow: { flexDirection: 'row', marginBottom: 4 },
  inlineLabel: { fontSize: 9, textDecoration: 'underline' },
  inlineValue: { fontSize: 9, marginLeft: 4 },
  grid: { border: '1 solid #000', marginBottom: 12 },
  gridRow: { flexDirection: 'row' },
  gridCell: { flexBasis: '50%', borderRight: '1 solid #000', borderBottom: '1 solid #000', padding: 6 },
  gridCellLast: { flexBasis: '50%', borderBottom: '1 solid #000', padding: 6 },
  gridCellFull: { flexBasis: '100%', borderBottom: '1 solid #000', padding: 6 },
  tableHeaderCell: { border: '1 solid #000', backgroundColor: '#f3f4f6', padding: 6, fontSize: 9, fontWeight: 'bold', flexGrow: 1, lineHeight: 1.2 },
  sectionBar: { backgroundColor: '#e5e7eb', border: '1 solid #000', padding: 6, fontSize: 9, fontWeight: 'bold', marginTop: 8 },
  footer: {
    position: 'absolute', bottom: 15, left: 30, right: 30,
    flexDirection: 'row', justifyContent: 'space-between', fontSize: 9,
    borderTop: '1 solid #d1d5db', paddingTop: 6, color: '#6b7280'
  }
});

const get = (obj: any, key: string, common?: any) => {
  // For personName field, combine first name and surname to show full name
  if (key === 'personName') {
    const firstName = common?.name || '';
    const surname = common?.surname || '';
    const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
    if (fullName) {
      return fullName;
    }
    // Fallback to form data if commonFieldsData doesn't have name
    const formValue = obj ? obj[key] : undefined;
    if (formValue !== undefined && formValue !== null && String(formValue).length > 0) {
      return formValue;
    }
    // Last fallback: try to get just the first name from commonFieldsData
    if (firstName) {
      return firstName;
    }
    return '';
  }
  
  // Prefer value from form data; fall back to mapped common fields
  const formValue = obj ? obj[key] : undefined;
  if (formValue !== undefined && formValue !== null && String(formValue).length > 0) return formValue;
  const map: Record<string, string> = { personName: 'name' };
  const commonKey = map[key] || key;
  return (common ? common[commonKey] : '') ?? '';
};

const formatDate = (value: string) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-');
    return `${d}-${m}-${y}`;
  }
  return value || '';
};

const IndividualRiskAssessment_MATCHING: React.FC<Props> = ({ formData = {}, commonFieldsData = {}, settings = {}, logoDataUrl, images = {} }) => {
  const website = settings?.company_website || '';
  const id = settings?.individual_risk_assessment || '';
  const review = formatDate(settings?.review_date || '');

  const headerField = (label: string, key: string) => (
    <View style={styles.inlineRow}>
      <Text style={styles.inlineLabel}>{label}:</Text>
      <Text style={styles.inlineValue}>{get(formData, key, commonFieldsData)}</Text>
    </View>
  );

  const riskRow = (n: number) => (
    <View key={n} style={styles.row}>
      <View style={[styles.cell, { flexBasis: '35%' }]}>
        <Text style={styles.value}>{get(formData, `riskIdentified_${n}`)}</Text>
      </View>
      <View style={[styles.cell, { flexBasis: '15%' }]}>
        <Text style={styles.value}>{get(formData, `likelihood_${n}`)}</Text>
      </View>
      <View style={[styles.cell, { flexBasis: '15%' }]}>
        <Text style={styles.value}>{get(formData, `severity_${n}`)}</Text>
      </View>
      <View style={[styles.cell, { flexBasis: '35%' }]}>
        <Text style={styles.value}>{get(formData, `controls_${n}`)}</Text>
      </View>
    </View>
  );

  const riskIndices = (() => {
    const idxSet = new Set<number>();
    const fields = ['riskIdentified', 'likelihood', 'severity', 'controls'];
    Object.keys(formData || {}).forEach((k) => {
      for (const f of fields) {
        const m = k.match(new RegExp(`^${f}_(\\d+)$`));
        if (m) {
          const i = parseInt(m[1], 10);
          const v = (formData[k] || '').toString().trim();
          if (v) idxSet.add(i);
        }
      }
    });
    return Array.from(idxSet).sort((a, b) => a - b);
  })();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl || '/infinity_logo.png'} style={styles.headerLogo} />
        </View>

        <Text style={styles.title}>Individual Activity Risk Assessment</Text>

        {/* General Information (labels left column, values right column) */}
        <Text style={styles.sectionBar}>General Information</Text>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}><Text style={styles.inlineLabel}>Person's Name:</Text></View>
            <View style={styles.gridCellLast}><Text style={styles.inlineValue}>{get(formData, 'personName', commonFieldsData)}</Text></View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}><Text style={styles.inlineLabel}>Date:</Text></View>
            <View style={styles.gridCellLast}><Text style={styles.inlineValue}>{formatDate(get(formData, 'date', commonFieldsData))}</Text></View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}><Text style={styles.inlineLabel}>Activity:</Text></View>
            <View style={styles.gridCellLast}><Text style={styles.inlineValue}>{get(formData, 'activity', commonFieldsData)}</Text></View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}><Text style={styles.inlineLabel}>Assessor's Name:</Text></View>
            <View style={styles.gridCellLast}><Text style={styles.inlineValue}>{get(formData, 'assessorName', commonFieldsData)}</Text></View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}><Text style={styles.inlineLabel}>Location:</Text></View>
            <View style={styles.gridCellLast}><Text style={styles.inlineValue}>{get(formData, 'location', commonFieldsData)}</Text></View>
          </View>
        </View>

        {/* Risk Matrix (render only if image available) */}
        {images?.riskMatrix ? (
          <Image src={images.riskMatrix} style={{ width: 520, height: 240, marginTop: 8, marginBottom: 10, objectFit: 'contain' }} />
        ) : null}

        {/* Colour legend / notes */}
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#065f46', textDecoration: 'underline' }}>LOW GREEN</Text>
        <Text style={{ fontSize: 9, marginBottom: 3 }}>Visit acceptable. Ensure control options are followed.</Text>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#92400e', textDecoration: 'underline' }}>MEDIUM YELLOW</Text>
        <Text style={{ fontSize: 9, marginBottom: 3 }}>Visit should only proceed after consultation with manager. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re‑classify as Moderate Risk.</Text>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#b45309', textDecoration: 'underline' }}>MODERATE ORANGE</Text>
        <Text style={{ fontSize: 9, marginBottom: 3 }}>Visit should only proceed after consultation with Director. The risks should be reviewed to consider all the hazards involved. The risks must be reduced prior to the visit – if in doubt, re‑classify as High Risk.</Text>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#991b1b', textDecoration: 'underline' }}>HIGH RED</Text>
        <Text style={{ fontSize: 9, marginBottom: 5 }}>Visit must only proceed with Director approval. The risks associated with the visit must be re‑assessed & other options considered.</Text>

        {/* Start the Risk Assessment on a new page */}
        <View break />
        <Text style={styles.sectionBar}>POTENTIAL RISK & CONTROL MEASURES</Text>
        {riskIndices.length > 0 && (
          <View style={styles.row}>
            <Text style={[styles.tableHeaderCell, { flexBasis: '35%' }]}>Risk Identified</Text>
            <Text style={[styles.tableHeaderCell, { flexBasis: '15%' }]}>Likelihood</Text>
            <Text style={[styles.tableHeaderCell, { flexBasis: '15%' }]}>Severity</Text>
            <Text style={[styles.tableHeaderCell, { flexBasis: '35%' }]}>Control Measures</Text>
          </View>
        )}
        {riskIndices.map(riskRow)}

        <Text style={styles.sectionBar}>Additional Information</Text>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>Additional Support Requirements</Text>
          <Text style={styles.value}>{get(formData, 'additionalSupport')}</Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, { flexBasis: '50%' }]}>
            <Text style={styles.label}>Assessment Review Date</Text>
            <Text style={styles.value}>{get(formData, 'reviewDate')}</Text>
          </View>
          <View style={[styles.cell, { flexBasis: '50%', alignItems: 'flex-start' }]}>
            <Text style={styles.label}>Assessor's Signature</Text>
            {String(get(formData, 'assessorSignature')).startsWith('data:image') ? (
              <Image src={get(formData, 'assessorSignature')} style={{ width: 120, height: 40, marginTop: 6 }} />
            ) : (
              <Text style={styles.value}>{get(formData, 'assessorSignature')}</Text>
            )}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>Website: {website}</Text>
          <Text>{id}</Text>
          <Text>Review Date: {review}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default IndividualRiskAssessment_MATCHING;


