import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 10,
  },
  table: {
    marginBottom: 15,
    marginHorizontal: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    border: '1 solid #000',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    borderLeft: '1 solid #000',
    borderRight: '1 solid #000',
    paddingVertical: 3,
    paddingHorizontal: 2,
    minHeight: 20,
  },
  tableCell: {
    fontSize: 9,
    paddingHorizontal: 2,
  },
  col1: { width: '40%', borderRight: '1 solid #000' },
  col2: { width: '10%', textAlign: 'center', borderRight: '1 solid #000' },
  col3: { width: '15%', textAlign: 'center', borderRight: '1 solid #000' },
  col4: { width: '15%', textAlign: 'right', borderRight: '1 solid #000' },
  col5: { width: '20%', textAlign: 'right' },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  checkbox: {
    width: 11,
    height: 11,
    border: '1 solid #000',
    marginRight: 6,
    marginTop: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxX: {
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  signatureSection: {
    border: '1 solid #000',
    padding: 8,
    marginTop: 15,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    borderTop: '0.5 solid #666',
    paddingTop: 5,
    color: '#666',
  }
});

interface ScheduleOfSupportsProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl?: string;
}

export default function ScheduleOfSupports({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}: ScheduleOfSupportsProps) {

  // Auto-detect signatureRole if missing (for backward compatibility with old data)
  if (!formData?.signatureRole) {
    if (formData?.nomineeSignature) {
      formData = { ...formData, signatureRole: "Nominee" };
    } else if (formData?.participantSignature) {
      formData = { ...formData, signatureRole: "Participant" };
    }
  }

  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const date = new Date(value);
      return date.toLocaleDateString('en-GB');
    }
    return value || '';
  };

  const getCostNumber = (cost: string) => {
    const parsed = parseFloat(cost?.replace(/[^0-9.]/g, "") || "");
    return isNaN(parsed) ? 0 : parsed;
  };

  const isChecked = (key: string) => {
    const val = formData?.[key];
    if (val === true || val === 'true') return true;
    if (typeof val === 'string' && val.toLowerCase() === 'yes') return true;
    return false;
  };

  const tableRows = [
    { key: "row0", description: '01_049_0107_1_1 Establishment Fee', cost: '$702.30' },
    { key: "row1", description: '01_013_0107_1_1 Assistance with Self-care weekday daytime', cost: '$70.23' },
    { key: "row2", description: '01_015_0107_1_1 Assistance with Self-care weekday Evening', cost: '$77.38' },
    { key: "row3", description: '01_013_0107_1_1 Assistance with Self-care Saturday', cost: '$98.83' },
    { key: "row4", description: '01_014_0107_1_1 Assistance with Self-care Sunday', cost: '$127.43' },
    { key: "row5", description: '01_012_0107_1_1 Assistance with Self-care Public Holiday', cost: '$156.03' },
    { key: "row6", description: '01_016_0104_1_1 Specialised Home-based care for a child', cost: '$59.06' },
    { key: "row7", description: '01_400_0104_1_1 Assistance with Self-Care Activities - High Intensity - Weekday Daytime', cost: '$75.98' },
    { key: "row8", description: '04_104_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Daytime', cost: '$70.23' },
    { key: "row9", description: '04_103_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Evening', cost: '$77.38' },
    { key: "row10", description: '04_105_0125_6_1 Access community and Rec Saturday', cost: '$98.83' },
    { key: "row11", description: '04_106_0125_6_1 Access Community and Rec Sunday', cost: '$127.43' },
    { key: "row12", description: '04_102_0125_6_1 Access Community and Rec Public Holiday', cost: '$156.03' },
    { key: "row13", description: '09-009-0117-6-3 Skill Development and Training', cost: '$80.06' },
    { key: "row14", description: '15_037_0117_1_3 Skill Development and Training including Public Transport training', cost: '$70.23' },
    { key: "row15", description: '04-590-0125-6-1 Activity based Transport', cost: '$1 Per km', isPerKm: true },
    { key: "row16", description: '01-002-0107-1-1 Provider Travel', cost: '$17.55' },
    { key: "row17", description: '04-104-0125-6-1 Provider Travel', cost: '$17.55' },
    { key: "row18", description: '01_016_0104_1_1 Specialised Home-based care for a child', cost: '$59.06' }
  ];

  return (
    <Document>
      <Page size="A4" style={[styles.page, { paddingBottom: 60 }]}>
        {/* Header - Fixed to repeat */}
        <View style={styles.header} fixed>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
          <Text style={styles.title}>
            Schedule of Support for: {[commonFieldsData?.name, commonFieldsData?.surname].filter(Boolean).join(' ') || "________________"}
          </Text>
        </View>

        {/* Info Row - Fixed to repeat */}
        <View style={styles.infoRow} fixed>
          <Text>NDIS Number: {commonFieldsData?.ndis || ""}</Text>
          <Text>Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}</Text>
        </View>

        {/* Support Table Section */}
        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.tableCell, styles.col1, { fontWeight: 'bold' }]}>Support Item</Text>
            <Text style={[styles.tableCell, styles.col2, { fontWeight: 'bold' }]}>Weeks</Text>
            <Text style={[styles.tableCell, styles.col3, { fontWeight: 'bold' }]}>Total Hours</Text>
            <Text style={[styles.tableCell, styles.col4, { fontWeight: 'bold' }]}>Cost/hour</Text>
            <Text style={[styles.tableCell, styles.col5, { fontWeight: 'bold' }]}>Total Cost</Text>
          </View>

          {tableRows.map((item, index) => {
            const key = item.key;
            const weeks = formData?.[`${key}_weeks`] || "";
            const totalHours = formData?.[`${key}_totalHours`] || "";
            const totalKms = formData?.[`${key}_totalKms`] || "";

            let displayWeeks = weeks;
            let displayHours = totalHours;
            if (item.isPerKm) {
              displayWeeks = totalKms || "";
              displayHours = "-";
            }

            let totalCost = "";
            if (item.isPerKm) {
              const kms = parseFloat(totalKms);
              if (!isNaN(kms) && kms > 0) {
                totalCost = `$${(kms * getCostNumber(item.cost)).toFixed(2)}`;
              }
            } else {
              const costPerHour = getCostNumber(item.cost);
              const hoursNum = parseFloat(totalHours);
              if (!isNaN(hoursNum) && hoursNum > 0) {
                totalCost = `$${(hoursNum * costPerHour).toFixed(2)}`;
              }
            }

            return (
              <View key={key} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, styles.col1]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{displayWeeks}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{displayHours}</Text>
                <Text style={[styles.tableCell, styles.col4]}>{item.cost}</Text>
                <Text style={[styles.tableCell, styles.col5, { fontWeight: 'bold' }]}>{totalCost}</Text>
              </View>
            );
          })}

          {/* Dynamic Custom Rows */}
          {formData?.customSupportItems?.map((item: any, idx: number) => {
            const hours = parseFloat(item.totalHours || "0");
            const weeks = parseFloat(item.weeks || "0");
            const totalKms = parseFloat(item.totalKms || "0");
            const rate = parseFloat(item.rate || "0");
            const total = (hours || weeks || totalKms) * rate;

            return (
              <View key={`custom-${idx}`} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, styles.col1]}>{item.label || "Custom Support"}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{item.weeks || item.totalKms || ""}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{item.totalHours || ""}</Text>
                <Text style={[styles.tableCell, styles.col4]}>${rate.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col5, { fontWeight: 'bold' }]}>${total.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Transport Section */}
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>Transport Payments (not applicable client has own vehicle)</Text>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              {isChecked('transportOption1') && <Text style={styles.checkboxX}>X</Text>}
            </View>
            <Text style={[styles.paragraph, { flex: 1 }]}>
              Transport Services provided to the value of {formData?.transportValue1 || '______'}. Infinity Supports WA will claim payment from the NDIA using the Transport funding Budget. Anything over this amount will be: {formData?.transportOver1 || '______'}.
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              {isChecked('transportOption2') && <Text style={styles.checkboxX}>X</Text>}
            </View>
            <Text style={[styles.paragraph, { flex: 1 }]}>
              For Transport Services provided to the value of {formData?.transportValue2 || '______'}. Infinity Supports WA will claim payment from the NDIA using the Core support funding Budget. Anything over this amount will be: {formData?.transportOver2 || '______'}.
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              {isChecked('transportOption3') && <Text style={styles.checkboxX}>X</Text>}
            </View>
            <Text style={[styles.paragraph, { flex: 1 }]}>
              For any transport services provided. Infinity Supports WA will send the Individual/Plan Manager an invoice for those supports. The Individual/Plan Manager will pay the invoice within 14 days.
            </Text>
          </View>
        </View>

        {/* Establishment Fee Section */}
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>NDIS Establishment Fee</Text>
          <Text style={styles.paragraph}>
            This fee applies to all New NDIS Participants in their first plan where they receive at least 20 hours of personal care/ community access support per month.
          </Text>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              {isChecked('establishmentFeeAgreement') && <Text style={styles.checkboxX}>X</Text>}
            </View>
            <Text style={[styles.paragraph, { flex: 1 }]}>
              If you are a new participant to NDIS or Infinity Supports WA, you will be charged $702.30 as per the NDIS Price Guide.
            </Text>
          </View>
        </View>

        {/* Non-Face-to-Face Section */}
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>Non-Face-to-Face Support Provision</Text>
          <Text style={styles.paragraph}>
            Providers can only claim from a participant's plan for the Non-Face-to-Face delivery of a support item in line with NDIS Guidelines.
          </Text>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              {isChecked('agreeNonFaceToFace') && <Text style={styles.checkboxX}>X</Text>}
            </View>
            <Text style={[styles.paragraph, { flex: 1 }]}>
              By signing the Schedule of Supports you agree to Infinity Supports claiming the above Non-Face-to-Face charges in line with the NDIS Guidelines.
            </Text>
          </View>
        </View>

        {/* Provider Travel Section */}
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>Provider Travel</Text>
          <View style={styles.checkboxRow}>
            <View style={styles.checkbox}>
              {isChecked('providerTravelAgreement') && <Text style={styles.checkboxX}>X</Text>}
            </View>
            <Text style={[styles.paragraph, { flex: 1 }]}>
              I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.
            </Text>
          </View>
        </View>

        {/* Cancellation and Price Structure */}
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>Short Notice Cancelation & Price Structure</Text>
          <Text style={styles.paragraph}>
            A short notice cancellation is given less than 7 clear days' notice. Providers can claim up to 100%. Prices are set per NDIS Pricing Arrangements and change effective 1 July every year.
          </Text>
        </View>

        {/* Signatures Section */}
        <View wrap={false} style={{ marginTop: 10 }}>
          {formData?.signatureRole === "Participant" && (
            <View style={{ border: '1 solid #000', padding: 8, marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Participant Signature</Text>
              <View style={styles.signatureRow}>
                <View style={{ flex: 1 }}>
                  {formData?.participantSignature ? (
                    <Image src={formData.participantSignature} style={{ width: 180, height: 50, border: '1 solid #ccc' }} />
                  ) : <Text>________________________</Text>}
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text>Date: {formatDate(formData?.participantSignatureDate)}</Text>
                </View>
              </View>
              <Text style={{ marginTop: 5 }}>Name: {formData?.participantName || ''}</Text>
            </View>
          )}

          {formData?.signatureRole === "Nominee" && (
            <View style={{ border: '1 solid #000', padding: 8, marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Nominee Signature</Text>
              <View style={styles.signatureRow}>
                <View style={{ flex: 1 }}>
                  {formData?.nomineeSignature ? (
                    <Image src={formData.nomineeSignature} style={{ width: 180, height: 50, border: '1 solid #ccc' }} />
                  ) : <Text>________________________</Text>}
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text>Date: {formatDate(formData?.nomineeSignatureDate)}</Text>
                </View>
              </View>
              <Text style={{ marginTop: 5 }}>Name: {formData?.nomineeName || ''}</Text>
            </View>
          )}

          <View style={{ border: '1 solid #000', padding: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Provider Signature</Text>
            <View style={styles.signatureRow}>
              <View style={{ flex: 1 }}>
                {formData?.representativeSignature ? (
                  <Image src={formData.representativeSignature} style={{ width: 180, height: 50, border: '1 solid #ccc' }} />
                ) : <Text>________________________</Text>}
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text>Date: {formatDate(formData?.representativeSignatureDate)}</Text>
              </View>
            </View>
            <Text style={{ marginTop: 5 }}>Name: {formData?.representativeName || ''}</Text>
          </View>
        </View>

        {/* Repeating Footer */}
        <View style={styles.footer} fixed>
          <Text>Website: {settings?.company_website || ''}</Text>
          <Text>{settings?.schedule_of_supports || "Schedule of Support"}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>
    </Document>
  );
}
