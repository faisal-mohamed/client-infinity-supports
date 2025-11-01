import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Matching PDF generation - matches SA Support Coordination web view design
// Natural flow with automatic page breaks

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 120,
    paddingBottom: 50,
    fontFamily: 'Helvetica',
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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    textDecoration: 'underline',
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
    width: 10,
    height: 10,
    border: '1 solid #666',
    marginRight: 6,
    marginTop: 2,
  },
  checkedBox: {
    width: 10,
    height: 10,
    border: '1 solid #0066cc',
    backgroundColor: '#0066cc',
    marginRight: 6,
    marginTop: 2,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    border: '1 solid #000000',
    marginRight: 4,
  },
  radioCircleSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    border: '1 solid #0066cc',
    backgroundColor: '#0066cc',
    marginRight: 4,
  },
  signatureBox: {
    border: '1 solid #000000',
    padding: 10,
    minHeight: 50,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000000',
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

  const isChecked = (key: string) => formData?.[key]?.toString().toLowerCase() === 'yes';
  const getValue = (key: string) => formData?.[key] || '';

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed Header */}
        <View style={styles.header} fixed>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.headerLogo} />}
          <Text style={styles.title}>Service Agreement Support Co-Ordination</Text>
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text>Website: {settings?.company_website || settings?.from_email || ''}</Text>
          <Text>{settings?.sa_support_coordination || ''}</Text>
          <Text>Review Date: {formatDate(settings?.review_date)}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          
          {/* Section 1: Participant Details - Full form structure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SECTION 1</Text>
            <Text style={styles.staticContent}>Date: {formatDate(getValue('date'))}</Text>
            
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginTop: 8, marginBottom: 4 }}>Participant Details - NDIS Number: {commonFieldsData?.ndis || getValue('ndisNumber')}</Text>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Surname:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.surname || getValue('surname')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Given name(s):</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.name || getValue('givenNames')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Sex:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.sex || getValue('sex')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Pronoun:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('pronoun')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Indigenous descent:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('indigenousDescent')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Preferred name:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('preferredName')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Date of Birth:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{formatDate(commonFieldsData?.dob || getValue('dob'))}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Address:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.street || getValue('address')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>State:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.state || getValue('state') || 'WA'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Postcode:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.postCode || getValue('postcode')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Email:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.email || getValue('email')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Home Phone:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.phone || getValue('homePhone')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Mobile:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{commonFieldsData?.phone || getValue('mobile')}</Text>
            </View>
          </View>

          {/* Missing checkboxes from reference PDF */}
          <View style={styles.section}>
            <View style={styles.checkboxContainer}>
              <View style={isChecked('noCopyRequested') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Participant may wish not to receive a copy of this agreement. In this case, they shall tick the dedicated tick box at the end of the service agreement and sign the document.
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={isChecked('planAttached') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                A copy of the Individual's plan is attached to this Service Agreement.
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={isChecked('planNotAttached') ? styles.checkedBox : styles.checkbox} />
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
            
            {/* Schedule Table */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderBottom: '1 solid #000', paddingVertical: 4, paddingHorizontal: 4 }}>
                <Text style={{ flex: 2, fontSize: 8, fontWeight: 'bold' }}>Support Category</Text>
                <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>Weeks</Text>
                <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>Total Hours</Text>
                <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>Cost per hr</Text>
                <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', textAlign: 'center' }}>Total Cost</Text>
              </View>
              {['07_001_0106_8_3 Level 1 Support Connection', '07_002_0106_8_3 Level 2 Support Coordination', '07_101_0106_6_3 Psychosocial Recovery Coaching'].map((category, i) => (
                <View key={i} style={{ flexDirection: 'row', borderBottom: '1 solid #000', paddingVertical: 4, paddingHorizontal: 4 }}>
                  <Text style={{ flex: 2, fontSize: 8 }}>{category}</Text>
                  <Text style={{ flex: 1, fontSize: 8, textAlign: 'center' }}>{getValue(`weeks${i+1}`)}</Text>
                  <Text style={{ flex: 1, fontSize: 8, textAlign: 'center' }}>{getValue(`totalHours${i+1}`)}</Text>
                  <Text style={{ flex: 1, fontSize: 8, textAlign: 'center' }}>{['$74.63', '$100.14', '$98.30'][i]}</Text>
                  <Text style={{ flex: 1, fontSize: 8, textAlign: 'center' }}>${getValue(`totalCost${i+1}`)}</Text>
                </View>
              ))}
            </View>

            {/* Schedule of Supports Explanation */}
            <Text style={[styles.staticTitle, { textDecoration: 'underline', marginTop: 12 }]}>SCHEDULE OF SUPPORTS</Text>
            <Text style={styles.staticContent}>
              All figures quoted below! Should read all figures quoted above are based on NDIS. 
              Infinity Supports WA agrees to provide the individual named in Section 1 with the following Support Coordination. 
              The supports and their prices are set out in the Schedule of Supports below (if NDIS). All supports are as per 
              the NDIS Price Guide and are GST inclusive (if applicable) and include the cost of providing the supports. 
              All figures quoted below are based on NDIS pricing and the individual's NDIS plan at the time of agreement. 
              Prices, funding totals and hours will be adjusted periodically to reflect changes to NDIS pricing and the 
              individual's NDIS plan.
            </Text>
            
            <Text style={[styles.staticContent, { marginTop: 8 }]}>
              If changes to the services or their delivery are required, the Parties agree to discuss and review this 
              Service Agreement. The Parties agree that any changes to this Service Agreement will be in writing, signed, 
              and dated by the Parties.
            </Text>

            {/* Conflict of Interest sections */}
            <Text style={[styles.staticTitle, { marginTop: 12 }]}>CONFLICT OF INTEREST</Text>
            <Text style={[styles.staticTitle, { marginTop: 6 }]}>Conflict of Interest Declaration:</Text>
            <View style={[styles.inputField, { minHeight: 60 }]}>
              <Text style={{ fontSize: 8 }}>{getValue('conflictDeclaration')}</Text>
            </View>

            {/* Conflict providers - only show if ANY have data */}
            {(getValue('conflictOption1') || getValue('conflictOption2') || getValue('conflictOption3')) && (
              <>
                <Text style={[styles.staticTitle, { marginTop: 12 }]}>Conflict of Interest - Providers Considered:</Text>
                
                {getValue('conflictOption1') && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>1. Providers Considered:</Text>
                    <View style={[styles.inputField, { minHeight: 40, marginBottom: 4 }]}>
                      <Text style={{ fontSize: 8 }}>{getValue('conflictOption1')}</Text>
                    </View>
                  </View>
                )}
                
                {getValue('conflictOption2') && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>2. Providers Considered:</Text>
                    <View style={[styles.inputField, { minHeight: 40, marginBottom: 4 }]}>
                      <Text style={{ fontSize: 8 }}>{getValue('conflictOption2')}</Text>
                    </View>
                  </View>
                )}
                
                {getValue('conflictOption3') && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 4 }}>3. Providers Considered:</Text>
                    <View style={[styles.inputField, { minHeight: 40, marginBottom: 4 }]}>
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

          {/* Support Coordination Services Include */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Support Coordination Services Include:</Text>
            
            <View style={styles.checkboxContainer}>
              <View style={isChecked('supportCoordinationGeneral') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                General support coordination to help you understand and implement your NDIS plan
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={isChecked('providerLiaison') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Liaison with service providers to ensure quality service delivery
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={isChecked('planReview') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Assistance with plan reviews and goal setting
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={isChecked('crisisSupport') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Crisis support and problem-solving assistance
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={isChecked('capacityBuilding') ? styles.checkedBox : styles.checkbox} />
              <Text style={[styles.staticContent, { flex: 1 }]}>
                Capacity building to help you become more independent
              </Text>
            </View>
          </View>

          {/* Service Delivery */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Service Delivery</Text>
            <Text style={styles.staticContent}>
              All services will be delivered in accordance with NDIS Practice Standards and Quality Indicators. 
              We are committed to providing safe, effective, and person-centered support coordination services 
              that meet your individual needs and goals.
            </Text>
          </View>

          {/* Frequency and Duration */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Frequency and Duration</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Frequency of support coordination sessions:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('frequency')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Expected duration of engagement:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('duration')}</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Pricing</Text>
            <Text style={styles.staticContent}>
              All support coordination is charged in accordance with the current NDIS Price Guide. 
              Prices are subject to change in line with NDIS pricing updates. We will notify you of 
              any price changes that may affect your service agreement.
            </Text>
          </View>

          {/* Participant Rights and Responsibilities */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Participant Rights and Responsibilities</Text>
            <Text style={styles.staticContent}>
              You have the right to receive services that are safe, respectful, and of high quality. 
              You also have responsibilities including treating staff with respect, providing accurate 
              information, and giving reasonable notice for cancellations.
            </Text>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Cancellation Policy</Text>
            <Text style={styles.staticContent}>
              We require at least 2 business days notice for cancellations. Cancellations made with 
              less notice may be charged in accordance with NDIS guidelines.
            </Text>
          </View>

          {/* Complaints and Feedback */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Complaints and Feedback</Text>
            <Text style={styles.staticContent}>
              We welcome feedback and take all complaints seriously. You can raise concerns with your 
              support coordinator, our management team, or external bodies such as the NDIS Quality and 
              Safeguards Commission.
            </Text>
          </View>

          {/* Privacy and Confidentiality */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Privacy and Confidentiality</Text>
            <Text style={styles.staticContent}>
              We are committed to protecting your privacy and maintaining confidentiality of your personal 
              information in accordance with privacy legislation and NDIS requirements. Information will 
              only be shared with your consent or as required by law.
            </Text>
          </View>

          {/* Funding Management */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Funding Management</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Signed:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('signature')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Print Name:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{getValue('printName')}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Date:</Text>
              <Text style={[styles.tableCell, styles.inputField]}>{formatDate(getValue('signDate'))}</Text>
            </View>

            <View style={{ marginTop: 8 }}>
              <View style={styles.checkboxContainer}>
                <View style={isChecked('selfManaged') ? styles.checkedBox : styles.checkbox} />
                <Text style={[styles.staticContent, { flex: 1 }]}>Self-managed funding</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={isChecked('nomineeManaged') ? styles.checkedBox : styles.checkbox} />
                <Text style={[styles.staticContent, { flex: 1 }]}>Nominee managed funding</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={isChecked('ndiaManaged') ? styles.checkedBox : styles.checkbox} />
                <Text style={[styles.staticContent, { flex: 1 }]}>NDIA managed funding</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={isChecked('planManagerManaged') ? styles.checkedBox : styles.checkbox} />
                <Text style={[styles.staticContent, { flex: 1 }]}>Plan Manager managed funding</Text>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Plan Manager Name:</Text>
                <Text style={[styles.tableCell, styles.inputField]}>{getValue('planManagerName')}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Email:</Text>
                <Text style={[styles.tableCell, styles.inputField]}>{getValue('planManagerEmail')}</Text>
              </View>
            </View>
          </View>

          {/* Consent Section */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Consent</Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 9, marginBottom: 4 }}>
                Hereby give consent to Infinity Supports WA to obtain and use images and likeness of myself on media releases, including social media and promotion.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentMedia') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle} />
                  <Text style={{ fontSize: 9 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 12 }]}>
                  <View style={getValue('consentMedia') === 'No' ? styles.radioCircleSelected : styles.radioCircle} />
                  <Text style={{ fontSize: 9 }}>No</Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 9, marginBottom: 4 }}>
                Hereby give consent to Infinity Supports WA to obtain and share relevant documented information with other service providers and professionals involved in my care.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentInfoShare') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle} />
                  <Text style={{ fontSize: 9 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 12 }]}>
                  <View style={getValue('consentInfoShare') === 'No' ? styles.radioCircleSelected : styles.radioCircle} />
                  <Text style={{ fontSize: 9 }}>No</Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 9, marginBottom: 4 }}>
                Hereby give consent to take part in an NDIS audit and document review if required.
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.radioOption}>
                  <View style={getValue('consentAudit') === 'Yes' ? styles.radioCircleSelected : styles.radioCircle} />
                  <Text style={{ fontSize: 9 }}>Yes</Text>
                </View>
                <View style={[styles.radioOption, { marginLeft: 12 }]}>
                  <View style={getValue('consentAudit') === 'No' ? styles.radioCircleSelected : styles.radioCircle} />
                  <Text style={{ fontSize: 9 }}>No</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.section}>
            <Text style={styles.staticTitle}>Signatures</Text>
            
            {/* Participant Signature */}
            <View style={styles.signatureBox}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Participant Signature</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ width: '60%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature of participant:</Text>
                  {getValue('participantSignature') ? (
                    <Image src={getValue('participantSignature')} style={{ width: 200, height: 60, border: '1 solid #ccc' }} />
                  ) : (
                    <View style={{ borderBottom: '1 solid #000', height: 60, width: 200 }} />
                  )}
                </View>
                <View style={{ width: '35%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                  <Text style={{ fontSize: 10 }}>{formatDate(getValue('participantSignatureDate'))}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 9 }}>Name: {getValue('participantName') || commonFieldsData?.name}</Text>
            </View>

            {/* Nominee Signature Section */}
            <View style={styles.signatureBox}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Nominee Signature</Text>
              <Text style={{ fontSize: 9, fontStyle: 'italic', marginBottom: 6 }}>
                I confirm this agreement was explained and accepted by the participant. [if signed by a Nominee]
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ width: '60%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature of Nominee:</Text>
                  {getValue('nomineeSignature') ? (
                    <Image src={getValue('nomineeSignature')} style={{ width: 200, height: 60, border: '1 solid #ccc' }} />
                  ) : (
                    <View style={{ borderBottom: '1 solid #000', height: 60, width: 200 }} />
                  )}
                </View>
                <View style={{ width: '35%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Date:</Text>
                  <Text style={{ fontSize: 10 }}>{formatDate(getValue('nomineeSignatureDate'))}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 9 }}>Name: {getValue('nomineeName')}</Text>
            </View>

            {/* Provider Signature */}
            <View style={styles.signatureBox}>
              <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>Provider Signature</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ width: '60%' }}>
                  <Text style={{ fontSize: 9, marginBottom: 4 }}>Signature on behalf of Infinity Supports WA:</Text>
                  {getValue('providerSignature') ? (
                    <Image src={getValue('providerSignature')} style={{ width: 200, height: 60, border: '1 solid #ccc' }} />
                  ) : (
                    <View style={{ borderBottom: '1 solid #000', height: 60, width: 200 }} />
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
