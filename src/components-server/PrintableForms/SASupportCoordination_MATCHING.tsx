import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register DejaVuSans font for Unicode support (tick marks ✓)
Font.register({
  family: 'DejaVuSans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf', fontWeight: 'bold' },
  ]
});

// PDF generation - matches Model PDF structure exactly

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 120,
    paddingBottom: 50,
    fontFamily: 'DejaVuSans',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 180,
    height: 70,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666666',
    borderTop: '0.5 solid #cccccc',
    paddingTop: 8,
  },
  content: {
    flexDirection: 'column',
    fontSize: 10,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
    textDecoration: 'underline',
  },
  staticContent: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  staticTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1 solid #666',
    marginRight: 6,
    marginTop: 2,
  },
  checkedBox: {
    width: 12,
    height: 12,
    border: '1 solid #2563eb',
    backgroundColor: '#2563eb',
    marginRight: 6,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioContainer: {
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: '1 solid #666',
    marginRight: 4,
  },
  radioCircleSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: '1 solid #2563eb',
    backgroundColor: '#2563eb',
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureBox: {
    border: '0.5 solid #000000',
    padding: 10,
    minHeight: 50,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5 solid #000000',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    paddingHorizontal: 4,
  },
  inputField: {
    borderBottom: '1 solid #000000',
    minHeight: 12,
    paddingHorizontal: 2,
    fontSize: 9,
  },
  redText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
});

interface SASupportCoordinationProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl?: string;
}

export default function SASupportCoordination({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}: SASupportCoordinationProps) {
  
  const formatDate = (value: string) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const date = new Date(value);
      return date.toLocaleDateString('en-GB');
    }
    return value || '';
  };

  const isChecked = (key: string) => {
    const value = formData?.[key];
    return value === true || value?.toString().toLowerCase() === 'yes';
  };
  const getValue = (key: string) => formData?.[key] || commonFieldsData?.[key] || '';

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.headerLogo} />}
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text>Website: {settings?.company_website || settings?.from_email || ''}</Text>
          <Text>{settings?.sa_support_coordination || ''}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          
          {/* Section 1: Participant Details */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>SERVICE AGREEMENT SUPPORT COORDINATION</Text>
            <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>SECTION 1</Text>
            <Text style={styles.staticContent}>Date: {formatDate(getValue('date'))}</Text>
            
            {/* Participant Details - Bordered Block */}
            <View style={{ border: '0.5 solid #000', marginTop: 8, marginBottom: 12 }}>
              {/* Grey Header */}
              <View style={{ backgroundColor: '#e5e7eb', borderBottom: '0.5 solid #000', padding: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Participant Details</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>NDIS Number: {commonFieldsData?.ndis || getValue('ndisNumber')}</Text>
              </View>
              
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Surname:</Text>
                <Text style={styles.tableCell}>{commonFieldsData?.surname || getValue('surname')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Given name(s):</Text>
                <Text style={styles.tableCell}>{commonFieldsData?.name || getValue('givenNames')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Sex:</Text>
                <Text style={styles.tableCell}>{commonFieldsData?.sex || getValue('sex')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Pronoun:</Text>
                <Text style={styles.tableCell}>{getValue('pronoun')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Indigenous descent:</Text>
                <Text style={styles.tableCell}>{getValue('indigenousDescent')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Preferred name:</Text>
                <Text style={styles.tableCell}>{getValue('preferredName')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Date of Birth:</Text>
                <Text style={styles.tableCell}>{formatDate(commonFieldsData?.dob || getValue('dob'))}</Text>
              </View>
            </View>

            {/* Residential Address Details - Separate Bordered Block */}
            <View style={{ border: '0.5 solid #000', marginTop: 8, marginBottom: 12 }}>
              <View style={{ backgroundColor: '#e5e7eb', borderBottom: '0.5 solid #000', padding: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Residential Address Details</Text>
              </View>
              <View style={{ borderBottom: '0.5 solid #000', padding: 6 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Number / Street:</Text>
                <Text style={{ fontSize: 9, borderBottom: '0.5 solid #000', paddingBottom: 4 }}>{commonFieldsData?.street || getValue('address')}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, borderRight: '0.5 solid #000', padding: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>State:</Text>
                  <Text style={{ fontSize: 9, borderBottom: '0.5 solid #000', paddingBottom: 4 }}>{commonFieldsData?.state || getValue('state') || 'WA'}</Text>
                </View>
                <View style={{ flex: 1, padding: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Postcode:</Text>
                  <Text style={{ fontSize: 9, borderBottom: '0.5 solid #000', paddingBottom: 4 }}>{commonFieldsData?.postCode || getValue('postcode')}</Text>
                </View>
              </View>
            </View>

            {/* Participant Contact Details - Separate Bordered Block */}
            <View style={{ border: '0.5 solid #000', marginTop: 8, marginBottom: 12 }}>
              <View style={{ backgroundColor: '#e5e7eb', borderBottom: '0.5 solid #000', padding: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Participant Contact Details</Text>
              </View>
              <View style={{ borderBottom: '0.5 solid #000', padding: 6 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Email address:</Text>
                <Text style={{ fontSize: 9, borderBottom: '0.5 solid #000', paddingBottom: 4 }}>{commonFieldsData?.email || getValue('email')}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, borderRight: '0.5 solid #000', padding: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Home Phone No:</Text>
                  <Text style={{ fontSize: 9, borderBottom: '0.5 solid #000', paddingBottom: 4 }}>{getValue('homePhone') || ''}</Text>
                </View>
                <View style={{ flex: 1, padding: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>Mobile No:</Text>
                  <Text style={{ fontSize: 9, borderBottom: '0.5 solid #000', paddingBottom: 4 }}>{getValue('mobile') || commonFieldsData?.phone || ''}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3 Checkboxes */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('noCopyRequested') ? styles.checkedBox : styles.checkbox}>
                {isChecked('noCopyRequested') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.
              </Text>
            </View>

            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('planAttached') ? styles.checkedBox : styles.checkbox}>
                {isChecked('planAttached') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                A copy of the Individual's plan is attached to this Service Agreement.
              </Text>
            </View>

            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('planNotAttached') ? styles.checkedBox : styles.checkbox}>
                {isChecked('planNotAttached') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Individual chooses not to attach their plan.
              </Text>
            </View>

            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              The Parties agree that this Service Agreement is made in line with the funding body which provides the Individual's funding, which aims to:
            </Text>
          </View>

          {/* Schedule of Support Section */}
          <View style={styles.section}>
            <Text style={styles.staticContent}>
              1. Support the independence and social and economic participation of people with disability and enable people with a disability to exercise choice and control in the pursuit of their goals and the planning and delivery of their supports.
            </Text>
            
            <Text style={[styles.staticTitle, { textDecoration: 'underline' }]}>SCHEDULE OF SUPPORT</Text>
            
            {/* Schedule Table - Bordered Block */}
            <View style={{ border: '0.5 solid #000', marginBottom: 12 }} wrap={false}>
              <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottom: '0.5 solid #000', paddingVertical: 6, paddingHorizontal: 6 }}>
                <Text style={{ flex: 2, fontSize: 9, fontWeight: 'bold' }}>Support Category</Text>
                <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>Weeks</Text>
                <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>Total Hours</Text>
                <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>Cost per hr</Text>
                <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>Total Cost</Text>
              </View>
              {['07_001_0106_8_3 Level 1 Support Connection', '07_002_0106_8_3 Level 2 Support Coordination', '07_101_0106_6_3 Psychosocial Recovery Coaching'].map((category, i) => (
                <View key={i} style={{ flexDirection: 'row', borderBottom: '0.5 solid #000', paddingVertical: 6, paddingHorizontal: 6 }}>
                  <Text style={{ flex: 2, fontSize: 9 }}>{category}</Text>
                  <Text style={{ flex: 1, fontSize: 9, textAlign: 'center' }}>{getValue(`row${i+1}_weeks`)}</Text>
                  <Text style={{ flex: 1, fontSize: 9, textAlign: 'center' }}>{getValue(`row${i+1}_totalHours`)}</Text>
                  <Text style={{ flex: 1, fontSize: 9, textAlign: 'center' }}>{['$74.63', '$100.14', '$98.30'][i]}</Text>
                  <Text style={{ flex: 1, fontSize: 9, textAlign: 'center' }}>{getValue(`row${i+1}_totalCost`) ? `$${getValue(`row${i+1}_totalCost`)}` : ''}</Text>
                </View>
              ))}
            </View>

            {/* Schedule of Supports Explanation */}
            <Text style={[styles.staticTitle, { textDecoration: 'underline', marginTop: 12 }]}>SCHEDULE OF SUPPORTS</Text>
            <Text style={styles.staticContent}>
              All figures quoted above are based on NDIS pricing. Infinity Supports WA agrees to provide the individual 
              named in Section 1 with the following Support Coordination. The supports and their prices are set out in 
              the Schedule of Supports above. All supports are as per the NDIS Price Guide and are GST inclusive 
              (if applicable) and include the cost of providing the supports. All figures quoted are based on NDIS 
              pricing and the individual's NDIS plan at the time of agreement. Prices, funding totals and hours will 
              be adjusted periodically to reflect changes to NDIS pricing and the individual's NDIS plan.
            </Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              If changes to the services or their delivery are required, the Parties agree to discuss and review this 
              Service Agreement. The Parties agree that any changes to this Service Agreement will be in writing, signed, 
              and dated by the Parties.
            </Text>

            {/* Conflict of Interest */}
            <Text style={[styles.staticTitle, { marginTop: 12, textDecoration: 'underline' }]}>CONFLICT OF INTEREST</Text>
            <Text style={[styles.staticContent, { marginTop: 6 }]}>
              I <Text style={{ borderBottom: '2 solid #000', paddingHorizontal: 4, fontWeight: 'bold' }}>{getValue('conflictDeclaration') || '____________________'}</Text> have discussed my Support Coordination requirements and have been given options and full choice and control over the provider I have chosen. I have been given information on the following companies.
            </Text>

            {/* Conflict providers - conditional */}
            {(getValue('conflictOption1') || getValue('conflictOption2') || getValue('conflictOption3')) && (
              <>
                <Text style={[styles.staticTitle, { marginTop: 12 }]}>Conflict of Interest - Providers Considered:</Text>
                
                {getValue('conflictOption1') && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>1. Providers Considered:</Text>
                    <View style={[styles.inputField, { minHeight: 40, marginBottom: 4, padding: 4, borderBottom: '0.5 solid #000' }]}>
                      <Text style={{ fontSize: 8 }}>{getValue('conflictOption1')}</Text>
                    </View>
            </View>
                )}
                
                {getValue('conflictOption2') && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>2. Providers Considered:</Text>
                    <View style={[styles.inputField, { minHeight: 40, marginBottom: 4, padding: 4, borderBottom: '0.5 solid #000' }]}>
                      <Text style={{ fontSize: 8 }}>{getValue('conflictOption2')}</Text>
                    </View>
              </View>
                )}
                
                {getValue('conflictOption3') && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>3. Providers Considered:</Text>
                    <View style={[styles.inputField, { minHeight: 40, marginBottom: 4, padding: 4, borderBottom: '0.5 solid #000' }]}>
                      <Text style={{ fontSize: 8 }}>{getValue('conflictOption3')}</Text>
                    </View>
                  </View>
                )}
              </>
            )}

            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              I request that Infinity Supports WA manage my Support Coordination as well as my Service Delivery. 
              My choice will be recorded on the Conflict-of-Interest Register.
            </Text>
          </View>

          {/* Signed/Print Name/Date Table - Bordered Block */}
          <View style={{ border: '0.5 solid #000', marginTop: 8, marginBottom: 12 }} wrap={false}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.3 }]}>Signed:</Text>
              <View style={[styles.tableCell, { alignItems: 'center', justifyContent: 'center', flex: 0.7 }]}>
                {getValue('signature') ? (
                  <Image src={getValue('signature')} style={{ width: 150, height: 50, objectFit: 'contain' }} />
                ) : (
                  <Text style={styles.inputField}></Text>
                )}
              </View>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.3 }]}>Print Name:</Text>
              <Text style={[styles.tableCell, styles.inputField, { flex: 0.7 }]}>{getValue('printName')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.3 }]}>Date:</Text>
              <Text style={[styles.tableCell, styles.inputField, { flex: 0.7 }]}>{formatDate(getValue('signDate'))}</Text>
            </View>
          </View>

          {/* ENDING THIS SERVICE AGREEMENT */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ENDING THIS SERVICE AGREEMENT</Text>
            <Text style={styles.staticContent}>
              Should either Party wishes to end this Service Agreement before the cease date they must give 2 weeks' notice in writing.
            </Text>
            <Text style={styles.staticContent}>
              If either Party seriously breaches this Service Agreement the requirement of notice will be waived.
            </Text>
          </View>

          {/* SERVICE PAYMENTS (NDIS) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SERVICE PAYMENTS (NDIS)</Text>

            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('selfManaged') ? styles.checkedBox : styles.checkbox}>
                {isChecked('selfManaged') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                The Individual has chosen to self-manage the funding for NDIS supports provided under this Service Agreement. After providing those supports, <Text style={styles.redText}>Infinity Supports WA</Text> will send the Individual an invoice for those supports for the Individual to pay. The Individual will pay the invoice within 7 days.
              </Text>
            </View>

            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('nomineeManaged') ? styles.checkedBox : styles.checkbox}>
                {isChecked('nomineeManaged') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                The Individual's Nominee manages the funding for supports provided under this Service Agreement. After providing those supports, <Text style={styles.redText}>Infinity Supports WA</Text> will send the Individual's Nominee an invoice for those supports for the Individual's Nominee to pay. The Individual's Nominee will pay the invoice within 7 days.
              </Text>
            </View>

            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('ndiaManaged') ? styles.checkedBox : styles.checkbox}>
                {isChecked('ndiaManaged') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                The Individual has nominated the NDIA to manage the funding for supports provided under this Service Agreement. After providing those supports, <Text style={styles.redText}>Infinity Supports WA</Text> will claim payment for those supports from the NDIA.
              </Text>
            </View>

            <View style={styles.checkboxContainer} wrap={false}>
              <View style={isChecked('planManagerManaged') ? styles.checkedBox : styles.checkbox}>
                {isChecked('planManagerManaged') && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
              </View>
              <Text style={[styles.staticContent, { flex: 1 }]}>
                The Individual has nominated the Plan Management Provider to manage the funding for NDIS supports provided under this Service Agreement. After providing those services, <Text style={styles.redText}>Infinity Supports WA</Text> will claim payment for those services from <Text style={{ textDecoration: 'underline' }}>Registered Plan Management Provider</Text>.
              </Text>
            </View>
          </View>

          {/* Plan Manager Details - Bordered Table */}
          <View style={{ border: '0.5 solid #000', marginBottom: 12 }} wrap={false}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.4 }]}>Plan Manager Name:</Text>
              <Text style={[styles.tableCell, styles.inputField, { flex: 0.6 }]}>{getValue('planManagerName')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold', flex: 0.4 }]}>Email:</Text>
              <Text style={[styles.tableCell, styles.inputField, { flex: 0.6 }]}>{getValue('planManagerEmail')}</Text>
            </View>
          </View>

          {/* GOODS AND SERVICES TAX (GST) / NDIS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GOODS AND SERVICES TAX (GST) / NDIS</Text>
            <Text style={styles.staticContent}>
              For the purposes of GST legislation, the Parties confirm that a supply of supports under this Service Agreement is a supply of one or more of the reasonable and necessary supports specified in the statement included, under subsection 33(2) of the National Disability Insurance Scheme Act 2013 (NDIS Act), in the Participant's NDIS plan currently in effect under section 37 of the NDIS Act.
            </Text>
          </View>

          {/* RESPONSIBILITIES OF INFINITY SUPPORTS WA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESPONSIBILITIES OF INFINITY SUPPORTS WA</Text>
            <Text style={styles.staticContent}>
              <Text style={styles.redText}>Infinity Supports WA</Text> agrees to:
            </Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Understand and use your NDIS plan to pursue your goals</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Review the provision of <Text style={{ textDecoration: 'underline' }}>supports</Text> with the Individual in line with the applicable requirements</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Connect you with providers, community, mainstream and the government services</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Source information regarding Allied Health professionals</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Build your confidence and skills to use and coordinate your supports</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Communicate openly and honestly in a timely manner</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Treat the Individual with courtesy and respect</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Consult the Individual on decisions about how supports are provided</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Give the Individual information about managing any complaints or disagreements and details of <Text style={styles.redText}>Infinity Supports WA</Text> cancellation policy (if relevant)</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Listen to the Individual's feedback and resolve problems in a timely manner</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Give the Individual the required notice if <Text style={styles.redText}>Infinity Supports WA</Text> needs to end the Service Agreement (see 'Ending this Service Agreement' below for more information)</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Protect the Individual's privacy and confidential information</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Provide <Text style={{ textDecoration: 'underline' }}>supports</Text> in a manner consistent with all relevant laws, including but not limited to, the National Disability Insurance Scheme Act 2013 and rules, and the Australian Consumer Law; keep accurate records on the supports provided to the Individuals</Text>
          </View>

          {/* RESPONSIBILITIES OF INDIVIDUAL */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESPONSIBILITIES OF INDIVIDUAL / INDIVIDUAL'S REPRESENTATIVE</Text>
            <Text style={styles.staticContent}>agrees to:</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Inform <Text style={styles.redText}>Infinity Supports WA</Text> about how they wish the services to be delivered to meet the Individual's needs</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Treat <Text style={styles.redText}>Infinity Supports WA</Text> with courtesy and respect</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Talk to <Text style={styles.redText}>Infinity Supports WA</Text> if the Individual has any concerns about the services being provided</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Give <Text style={styles.redText}>Infinity Supports WA</Text> the required notice if the Individual needs to end the Service Agreement (see 'Ending this Service Agreement' below for more information), and</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Let the <Text style={styles.redText}>Infinity Supports WA</Text> know immediately if the Individual's plan/funding is suspended or replaced by a new plan or the Individual's funding ceases</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• <Text style={{ textDecoration: 'underline' }}>Will update</Text> <Text style={styles.redText}>Infinity Supports WA</Text> of any changes in circumstances including any changes to living arrangements including addresses, medication, behaviour, contact details or health of the individual which may affect service provision</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• The Individual's plan is expected to remain in effect during the period the services are provided; and will immediately notify <Text style={styles.redText}>Infinity Supports WA</Text> if the Individual's Plan is replaced by a new plan or the Individual's funding ceases</Text>
          </View>

          {/* FEEDBACK, COMPLAINTS AND DISPUTES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FEEDBACK, COMPLAINTS AND DISPUTES</Text>
            <Text style={styles.staticContent}>
              If the Individual wishes to give <Text style={styles.redText}>Infinity Supports WA</Text> feedback OR If the Individual is not happy with the provision of supports and wishes to make a complaint, the Individual can talk to <Text style={{ textDecoration: 'underline' }}>Sharon Mays</Text> Director or <Text style={{ textDecoration: 'underline' }}>Anand Sekar</Text> Director 0493282661; Email: <Text style={{ textDecoration: 'underline' }}>admin@infinitysupportswa.org</Text>.
            </Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              If the <Text style={{ textDecoration: 'underline' }}>Individual</Text> is not satisfied or does not want to talk to this person, the Individual can contact the National Disability Insurance Agency by calling 1800 800 110, visiting one of their offices in person, or visiting <Text style={{ textDecoration: 'underline' }}>www.ndis.gov.au</Text> for further information. The Individual can contact Department of Communities, Disability Services on (08) 9426 9200, or visiting one of their offices, or visit <Text style={{ textDecoration: 'underline' }}>www.disability.wa.gov.au</Text>
            </Text>
          </View>

          {/* EMERGENCY PREPAREDNESS - Comprehensive */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EMERGENCY PREPAREDNESS</Text>
            
            <Text style={styles.staticContent}>
              <Text style={styles.redText}>Infinity Supports WA</Text>, will develop a to respond to any unplanned event that can cause:
            </Text>
            
            <Text style={[styles.staticContent, { marginLeft: 10, marginTop: 4 }]}>• Deaths; or</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Significant injuries to employees or occupants; and/or</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Shut down the business; and/or</Text>
            <Text style={[styles.staticContent, { marginLeft: 10 }]}>• Disruption to operations; and/or</Text>
            <Text style={[styles.staticContent, { marginLeft: 10, marginBottom: 8 }]}>• Physical or environmental damage</Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              For your peace of mind, all our support workers are trained on how to respond in case of an emergency, and they will receive a copy of your Individual Disaster Management Plan so that they are fully aware of your health condition and the required action plans in case of an emergency.
            </Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              Individual Disaster Management Plan and Risk Assessment will be developed and signed by <Text style={styles.redText}>Infinity Supports WA</Text> and the Individual and/or representative. Providers' Responsibility related to participants Individual Disaster Management Plan and Risk Assessment is subject to 73G requirements.
            </Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              It is the provider's responsibility to document the assessment of the participant's risk factors using Intake Form, Support Plan, and Participant, Home, and Community Risk Assessment forms.
            </Text>
            
            <Text style={[styles.staticContent, { marginLeft: 10, marginTop: 8 }]}>• A copy of the Individual Disaster Management Plan and Risk Assessment will be provided to the participant and another copy should be kept in their file.</Text>
            <Text style={[styles.staticContent, { marginLeft: 10, marginTop: 4 }]}>• The Individual Disaster Management Plan and Risk Assessment will be reviewed every year or when the participant's circumstances change. If there is any update on the Individual Disaster Management Plan and Risk Assessment, a copy of the new Individual Disaster Management Plan and Risk Assessment will be provided to the client and a copy will be kept in their folder.</Text>
            <Text style={[styles.staticContent, { marginLeft: 10, marginTop: 4 }]}>• It is the provider's responsibility to mention the rights and responsibilities of the participant and the provider on the service agreement.</Text>
            <Text style={[styles.staticContent, { marginLeft: 10, marginTop: 4 }]}>• Using the Human Resource Management process will assist the provider to ensure that the participant's support worker has been screened.</Text>
            <Text style={[styles.staticContent, { marginLeft: 10, marginTop: 4 }]}>• Participants who are subject to this requirement will be registered on the High-Risk Participant Register and some specific support workers will be delegated to those who are registered on this form.</Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              <Text style={styles.redText}>Infinity Supports WA PTY Ltd</Text> will be required to complete an audit with NDIS, as a participant you may be asked to provide comments and feedback regarding your service. This is an OPT IN or OUT option to be completed in the following section.
            </Text>
          </View>

          {/* Consent Section - Keep Together */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.staticTitle}>Consent</Text>
            
            {/* Consent 1: Media */}
            <View style={{ borderBottom: '0.5 solid #666', paddingVertical: 6, marginBottom: 8 }} wrap={false}>
              <Text style={{ fontSize: 9, marginBottom: 6 }}>
                Hereby give consent to Infinity Supports WA to obtain and use images and likeness of myself on media releases, including social media and promotion.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentMedia') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentMedia') === 'Yes' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 16 }]}>
                  <View style={getValue('consentMedia') === 'No' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentMedia') === 'No' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>No</Text>
                </View>
              </View>
            </View>

            {/* Consent 2: Photograph/Profile */}
            <View style={{ borderBottom: '0.5 solid #666', paddingVertical: 6, marginBottom: 8 }} wrap={false}>
              <Text style={{ fontSize: 9, marginBottom: 6 }}>
                Hereby give consent to Infinity Supports WA to obtain and use my photograph for the purpose of creating a client profile (and other internal documents).
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentProfile') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentProfile') === 'Yes' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 16 }]}>
                  <View style={getValue('consentProfile') === 'No' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentProfile') === 'No' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>No</Text>
                </View>
              </View>
            </View>

            {/* Consent 3: Information Sharing */}
            <View style={{ borderBottom: '0.5 solid #666', paddingVertical: 6, marginBottom: 8 }} wrap={false}>
              <Text style={{ fontSize: 9, marginBottom: 4 }}>
                Hereby give consent to Infinity Supports WA to obtain & share relevant documented information regarding my service. This may include but not limited to:
              </Text>
              <Text style={{ fontSize: 8, marginLeft: 12, marginBottom: 1 }}>• Legal Guardian/Next of Kin</Text>
              <Text style={{ fontSize: 8, marginLeft: 12, marginBottom: 1 }}>• GP/health care professional</Text>
              <Text style={{ fontSize: 8, marginLeft: 12, marginBottom: 1 }}>• Therapy providers</Text>
              <Text style={{ fontSize: 8, marginLeft: 12, marginBottom: 1 }}>• Plan Managers</Text>
              <Text style={{ fontSize: 8, marginLeft: 12, marginBottom: 4 }}>• Others: {getValue('consentInfoShareOthers')}</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentInfoShare') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentInfoShare') === 'Yes' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 16 }]}>
                  <View style={getValue('consentInfoShare') === 'No' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentInfoShare') === 'No' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>No</Text>
                </View>
              </View>
            </View>

            {/* Consent 4: NDIS Audit */}
            <View style={{ paddingVertical: 6, marginBottom: 8 }} wrap={false}>
              <Text style={{ fontSize: 9, marginBottom: 6 }}>
                I consent to take part in a NDIS audit and my documents be reviewed as required.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentAudit') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentAudit') === 'Yes' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 16 }]}>
                  <View style={getValue('consentAudit') === 'No' ? styles.radioCircleSelected : styles.radioCircle}>
                    {getValue('consentAudit') === 'No' && <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: 'bold', fontFamily: 'DejaVuSans' }}>✓</Text>}
                  </View>
                  <Text style={{ fontSize: 9, marginLeft: 4 }}>No</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.section}>
            {/* Participant Signature - CONDITIONAL (only if participant signed) */}
            {getValue('participantSignature') && !getValue('nomineeSignature') && (
              <View style={styles.signatureBox} wrap={false}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Participant Signature</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ width: '60%' }}>
                    <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature of participant:</Text>
                    <Image src={getValue('participantSignature')} style={{ width: 200, height: 60, border: '0.5 solid #ccc' }} />
                  </View>
                  <View style={{ width: '35%' }}>
                    <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                    <Text style={{ fontSize: 10 }}>{formatDate(getValue('participantSignatureDate'))}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 9 }}>Name: {getValue('participantName') || commonFieldsData?.name}</Text>
                <Text style={{ fontSize: 8, fontStyle: 'italic', marginTop: 6 }}>
                  I confirm that this agreement has been explained to the person receiving the services (participant) and that they agree to this.
                </Text>
              </View>
            )}

            {/* Nominee Signature - CONDITIONAL (only if nominee signed) */}
            {getValue('nomineeSignature') && (
              <View style={styles.signatureBox} wrap={false}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Nominee Signature</Text>
                <Text style={{ fontSize: 9, fontStyle: 'italic', marginBottom: 6 }}>
                  I confirm this agreement was explained and accepted by the participant. [if signed by a Nominee]
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ width: '60%' }}>
                    <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature of Nominee:</Text>
                    <Image src={getValue('nomineeSignature')} style={{ width: 200, height: 60, border: '0.5 solid #ccc' }} />
                  </View>
                  <View style={{ width: '35%' }}>
                    <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                    <Text style={{ fontSize: 10 }}>{formatDate(getValue('nomineeSignatureDate'))}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 9 }}>Name: {getValue('nomineeName')}</Text>
              </View>
            )}

            {/* Provider Signature */}
            <View style={styles.signatureBox} wrap={false}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Provider Signature</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ width: '60%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature on behalf of Infinity Supports WA:</Text>
                  {getValue('providerSignature') ? (
                    <Image src={getValue('providerSignature')} style={{ width: 200, height: 60, border: '0.5 solid #ccc' }} />
                  ) : (
                    <View style={{ borderBottom: '0.5 solid #000', height: 60, width: 200 }} />
                  )}
                </View>
                <View style={{ width: '35%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                  <Text style={{ fontSize: 10 }}>{formatDate(getValue('providerSignatureDate'))}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 9 }}>Name: {getValue('providerName')}</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
