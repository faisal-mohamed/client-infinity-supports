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
    borderBottom: '1 solid #000',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    paddingVertical: 3,
    paddingHorizontal: 2,
    minHeight: 20,
  },
  tableCell: {
    fontSize: 9,
    paddingHorizontal: 2,
  },
  col1: { width: '40%' },
  col2: { width: '10%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'center' },
  col4: { width: '15%', textAlign: 'right' },
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
    width: 8,
    height: 8,
    border: '1 solid #666',
    marginRight: 6,
    marginTop: 2,
  },
  checkedBox: {
    width: 8,
    height: 8,
    border: '1 solidrgb(0, 0, 0)',
    backgroundColor: '#0066cc',
    marginRight: 6,
    marginTop: 2,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    marginTop: 'auto',
    paddingTop: 10,
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

  const isChecked = (key: string) => formData?.[key]?.toString().toLowerCase() === 'yes';

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
    { key: "row17", description: '04-104-0125-6-1 Provider Travel', cost: '$17.55' }
  ];

  return (
    <Document>
      {/* Page 1 - Support Schedule Table */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
          <Text style={styles.title}>
            Schedule of Support for: {commonFieldsData?.name || "________________"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text>NDIS number: {commonFieldsData?.ndis || ""}</Text>
          <Text>Plan dates from: {formatDate(formData?.planDatesFrom)} - {formatDate(formData?.planDatesTo)}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.col1, { fontWeight: 'bold' }]}>Support Item</Text>
            <Text style={[styles.tableCell, styles.col2, { fontWeight: 'bold' }]}>Weeks</Text>
            <Text style={[styles.tableCell, styles.col3, { fontWeight: 'bold' }]}>Total Hours</Text>
            <Text style={[styles.tableCell, styles.col4, { fontWeight: 'bold' }]}>Cost per hr</Text>
            <Text style={[styles.tableCell, styles.col5, { fontWeight: 'bold' }]}>Total Cost</Text>
          </View>
          
          {tableRows.map((item, index) => {
            const key = item.key;
            const weeks = formData?.[`${key}_weeks`] || "";
            const totalHours = formData?.[`${key}_totalHours`] || "";
            const totalKms = formData?.[`${key}_totalKms`] || "";

            // For per-km items, show km data in the Weeks column, not Total Hours
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
              } else {
                totalCost = "";
              }
            } else {
              const costPerHour = getCostNumber(item.cost);
              const hoursNum = parseFloat(totalHours);
              if (!isNaN(hoursNum) && hoursNum > 0) {
                totalCost = `$${(hoursNum * costPerHour).toFixed(2)}`;
              }
            }

            return (
              <View key={key} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{displayWeeks}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{displayHours}</Text>
                <Text style={[styles.tableCell, styles.col4]}>{item.cost}</Text>
                <Text style={[styles.tableCell, styles.col5]}>{totalCost}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text>Website: {settings?.company_website || settings?.from_email || ''}</Text>
          <Text>{settings?.schedule_of_supports}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>

      {/* Page 2 - Transport & Fees */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transport Payments (not applicable client has own vehicle)</Text>
          
          <View style={styles.checkboxRow}>
            <View style={isChecked('transportOption1') ? styles.checkedBox : styles.checkbox} />
            <Text style={[styles.paragraph, { flex: 1 }]}>
              Transport Services provided to the value of {formData?.transportValue1 || '__________________'}. 
              Infinity Supports WA will claim payment for those supports from the NDIA using the Transport funding Budget. 
              Anything over this amount will be: {formData?.transportOver1 || '__________________'}.
            </Text>
          </View>

          <View style={styles.checkboxRow}>
            <View style={isChecked('transportOption2') ? styles.checkedBox : styles.checkbox} />
            <Text style={[styles.paragraph, { flex: 1 }]}>
              For Transport Services provided to the value of {formData?.transportValue2 || '____________'}. 
              Infinity Supports WA will claim payment for those supports from the NDIA using the Core support funding Budget. 
              Anything over this amount will be: {formData?.transportOver2 || '__________________'}.
            </Text>
          </View>

          <View style={styles.checkboxRow}>
            <View style={isChecked('transportOption3') ? styles.checkedBox : styles.checkbox} />
            <Text style={[styles.paragraph, { flex: 1 }]}>
              For any transport services provided. Infinity Supports WA will send the Individual/Plan Manager an invoice 
              for those supports for the Individual/Plan Manager to pay. The Individual/Plan Manager will pay the invoice within 14 days.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NDIS Establishment Fee</Text>
          <Text style={styles.paragraph}>
            This fee applies to all New NDIS Participants in their first plan where they receive at least 20 hours of 
            personal care/ community access support per month. This payment is to cover non-ongoing costs for providers 
            establishing arrangements and assisting participants in implementing their plan.
          </Text>
          
          <View style={styles.checkboxRow}>
            <View style={isChecked('establishmentFeeAgreement') ? styles.checkedBox : styles.checkbox} />
            <Text style={[styles.paragraph, { flex: 1 }]}>
              If you are a new participant to NDIS or Infinity Supports WA, you will be charged $702.30 as per the NDIS Price Guide.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Non-Face-to-Face Support Provision</Text>
          <Text style={styles.paragraph}>
            Providers can only claim from a participant's plan for the Non-Face-to-Face delivery of a support item for example 
            writing reports for co-workers and other providers about your progress, engaging in Multi-Disciplinary Meetings or 
            meetings requested by yourself regarding your supports or engaging in additional tasks as requested by yourself outside 
            of your normal rostered supports.
          </Text>
          <Text style={styles.paragraph}>
            Non-Face-to-Face support cannot be charged for doing general administration i.e., Service Agreements, rostering, 
            Claiming payments, Initial Onboarding meetings.
          </Text>
          <Text style={styles.paragraph}>
            By signing the Schedule of Supports you agree to Infinity Supports claiming the above Non-Face-to-Face charges 
            in line with the NDIS Guidelines.
          </Text>
          <Text style={styles.paragraph}>
            X I agree to Infinity Supports Non-Face-to-Face charges as above.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Website: {settings?.company_website || settings?.from_email || ''}</Text>
          <Text>{settings?.schedule_of_supports}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>

      {/* Page 3 - Signatures */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Provider Travel</Text>
          <View style={styles.checkboxRow}>
            <View style={isChecked('providerTravelAgreement') ? styles.checkedBox : styles.checkbox} />
            <Text style={[styles.paragraph, { flex: 1 }]}>
              I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Short Notice Cancelation Charges</Text>
          <Text style={styles.paragraph}>
            A short notice cancellation is defined by the NDIS Pricing Arrangements and Price Limits as: Has given less than 
            seven (7) clear days' notice for a support. When claiming a cancellation, providers can request a claim of up to 
            100 per cent of the price.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule of Support price structure</Text>
          <Text style={styles.paragraph}>
            The prices for Service Delivery are set in accordance with NDIS pricing guide and can change in response to the 
            Annual Price Review conducted by NDIS with the new prices outlined by NDIA, effective 1 July every year. NDIA 
            Increases the participants funding supports to accommodate for this price change and hence should not impact on 
            the level support received.
          </Text>
        </View>

        <View style={{ marginTop: 15 }}>
          {formData?.signatureRole === "Participant" && (
            <View style={{ border: '1 solid #000', padding: 10, marginBottom: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>Participant Signature</Text>
              <View style={styles.signatureRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature of participant:</Text>
                  {formData?.participantSignature ? (
                    <Image 
                      src={formData.participantSignature} 
                      style={{ width: 200, height: 60, border: '1 solid #ccc', marginTop: 4 }} 
                    />
                  ) : (
                    <Text>________________________</Text>
                  )}
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                  <Text style={{ fontSize: 10 }}>{formatDate(formData?.participantSignatureDate)}</Text>
                </View>
              </View>
              <Text style={{ marginTop: 8 }}>Name: {formData?.participantName || ''}</Text>
              <Text style={{ marginTop: 10, fontSize: 9, fontStyle: 'italic' }}>
                I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this.
              </Text>
            </View>
          )}

          {formData?.signatureRole === "Nominee" && (
            <View style={{ border: '1 solid #000', padding: 10, marginBottom: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>Nominee Signature</Text>
              <View style={styles.signatureRow}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature of Nominee:</Text>
                  {formData?.nomineeSignature ? (
                    <Image 
                      src={formData.nomineeSignature} 
                      style={{ width: 200, height: 60, border: '1 solid #ccc', marginTop: 4 }} 
                    />
                  ) : (
                    <Text>________________________</Text>
                  )}
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                  <Text style={{ fontSize: 10 }}>{formatDate(formData?.nomineeSignatureDate)}</Text>
                </View>
              </View>
              <Text style={{ marginTop: 8 }}>Name: {formData?.nomineeName || ''}</Text>
              <Text style={{ marginTop: 10, fontSize: 9, fontStyle: 'italic' }}>
                I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this: [If signed by a Nominee:]
              </Text>
            </View>
          )}

          <View style={{ border: '1 solid #000', padding: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>Provider Signature</Text>
            <View style={styles.signatureRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature on behalf of Infinity Support WA:</Text>
                {formData?.representativeSignature ? (
                  <Image 
                    src={formData.representativeSignature} 
                    style={{ width: 200, height: 60, border: '1 solid #ccc', marginTop: 4 }} 
                  />
                ) : (
                  <Text>________________________</Text>
                )}
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                <Text style={{ fontSize: 10 }}>{formatDate(formData?.representativeSignatureDate)}</Text>
              </View>
            </View>
            <Text style={{ marginTop: 8 }}>Name: {formData?.represenativeName || ''}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Website: {settings?.company_website || settings?.from_email || ''}</Text>
          <Text>{settings?.schedule_of_supports}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>
      </Page>
    </Document>
  );
}
