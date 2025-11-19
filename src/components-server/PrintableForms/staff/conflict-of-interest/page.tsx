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
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  table: {
    width: '100%',
    border: '1 solid #d1d5db',
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #d1d5db',
    minHeight: 20,
  },
  tableCellLabel: {
    fontSize: 9,
    padding: 5,
    borderRight: '1 solid #d1d5db',
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    flex: 1,
    color: '#374151',
  },
  tableCellValue: {
    fontSize: 9,
    padding: 5,
    flex: 2,
    color: '#111827',
  },
  paragraph: {
    fontSize: 9,
    marginBottom: 6,
    color: '#374151',
    lineHeight: 1.4,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: '1 solid #9ca3af',
    marginRight: 4,
  },
  checkboxChecked: {
    width: 8,
    height: 8,
    border: '1 solid #2563eb',
    backgroundColor: '#2563eb',
    marginRight: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verticalCheckboxContainer: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  textarea: {
    fontSize: 8,
    padding: 4,
    border: '1 solid #d1d5db',
    minHeight: 30,
    marginTop: 4,
    color: '#111827',
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
});

interface ConflictOfInterestPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
}

const ConflictOfInterestPDF: React.FC<ConflictOfInterestPDFProps> = ({
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

  const getYesNo = (key: string): 'yes' | 'no' | '' => {
    const value = formData[key];
    if (value === 'yes' || value === true) return 'yes';
    if (value === 'no' || value === false) return 'no';
    return '';
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

  const renderCheckbox = (checked: boolean) => {
    return (
      <View style={checked ? styles.checkboxChecked : styles.checkbox}>
        {checked && <Text style={{ fontSize: 6, color: '#ffffff', fontWeight: 'bold' }}>✓</Text>}
      </View>
    );
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

  // Employee Information Section
  const renderEmployeeInformation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Employee Information</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Name</Text>
          </View>
          <View style={styles.tableCellValue}>
            <Text>{getValue('name')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Position</Text>
          </View>
          <View style={styles.tableCellValue}>
            <Text>{getValue('position')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Department</Text>
          </View>
          <View style={styles.tableCellValue}>
            <Text>{getValue('department')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Date</Text>
          </View>
          <View style={styles.tableCellValue}>
            <Text>{formatDate(getValue('date'))}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Section 1: Disclosure of Potential Conflict of Interest
  const renderSection1 = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Section 1: Disclosure of Potential Conflict of Interest</Text>
      <Text style={styles.paragraph}>
        Do you have any financial, personal, or professional interests that may conflict, or appear to conflict, with your duties at Infinity Supports WA Pty Ltd?
      </Text>
      <View style={styles.checkboxContainer}>
        {renderCheckbox(getYesNo('hasConflict') === 'yes')}
        <Text style={{ fontSize: 9 }}>Yes, I have a potential conflict to disclose. (Please provide details below.)</Text>
      </View>
      <View style={styles.checkboxContainer}>
        {renderCheckbox(getYesNo('hasConflict') === 'no')}
        <Text style={{ fontSize: 9 }}>No, I do not have any conflicts to disclose.</Text>
      </View>
      {(getYesNo('hasConflict') === 'yes' || getValue('conflictDescription')) && (
        <View style={styles.textarea}>
          <Text>{getValue('conflictDescription') || 'Not applicable - No conflict disclosed'}</Text>
        </View>
      )}
    </View>
  );

  // Section 2: Relationships with Vendors
  const renderSection2 = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Section 2: Relationships with Vendors, Clients, or Competitors</Text>
      <Text style={styles.paragraph}>
        Do you or any immediate family members have any financial interest, employment, or any other relationship with any vendors, clients, or competitors of Infinity Supports WA?
      </Text>
      <View style={styles.checkboxContainer}>
        {renderCheckbox(getYesNo('hasVendorRelationship') === 'yes')}
        <Text style={{ fontSize: 9 }}>Yes (If yes, please describe the relationship below.)</Text>
      </View>
      <View style={styles.checkboxContainer}>
        {renderCheckbox(getYesNo('hasVendorRelationship') === 'no')}
        <Text style={{ fontSize: 9 }}>No</Text>
      </View>
      {(getYesNo('hasVendorRelationship') === 'yes' || getValue('vendorDetails')) && (
        <View style={styles.textarea}>
          <Text>{getValue('vendorDetails') || 'Not applicable - No vendor relationship'}</Text>
        </View>
      )}
    </View>
  );

  // Section 3: Outside Employment
  const renderSection3 = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Section 3: Outside Employment or Business Activities</Text>
      <Text style={styles.paragraph}>
        Are you engaged in any outside employment, consulting, or business activities that may impact your role at Infinity Supports WA?
      </Text>
      <View style={styles.checkboxContainer}>
        {renderCheckbox(getYesNo('hasOutsideEmployment') === 'yes')}
        <Text style={{ fontSize: 9 }}>Yes (If yes, please describe below.)</Text>
      </View>
      <View style={styles.checkboxContainer}>
        {renderCheckbox(getYesNo('hasOutsideEmployment') === 'no')}
        <Text style={{ fontSize: 9 }}>No</Text>
      </View>
      {(getYesNo('hasOutsideEmployment') === 'yes' || getValue('employmentDetails')) && (
        <View style={styles.textarea}>
          <Text>{getValue('employmentDetails') || 'Not applicable - No outside employment'}</Text>
        </View>
      )}
    </View>
  );

  // Section 4: Acknowledgment
  const renderSection4 = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Section 4: Acknowledgment and Certification</Text>
      <Text style={styles.paragraph}>
        I certify that the information provided above is complete and accurate to the best of my knowledge. I understand that failure to disclose a potential conflict of interest may result in disciplinary action, up to and including termination of employment. If a potential conflict arises after signing this form, I will promptly notify Infinity Supports WA in writing.
      </Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Employee Signature</Text>
          </View>
          <View style={styles.tableCellValue}>
            {renderSignature(getValue('employeeSignature'))}
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLabel}>
            <Text>Date</Text>
          </View>
          <View style={styles.tableCellValue}>
            <Text>{formatDate(getValue('employeeDate'))}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // HR Section
  const renderHRSection = () => {
    const hrDecision = getValue('hrDecision');

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For HR/Management Use Only</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Reviewed by</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>{getValue('reviewedBy')}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Title</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>{getValue('reviewerTitle')}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Date</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>{formatDate(getValue('reviewDate'))}</Text>
            </View>
          </View>
          {getValue('actionTaken') && (
            <View style={styles.tableRow}>
              <View style={styles.tableCellLabel}>
                <Text>Action Taken (if applicable)</Text>
              </View>
              <View style={styles.tableCellValue}>
                <Text>{getValue('actionTaken')}</Text>
              </View>
            </View>
          )}
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>HR Decision</Text>
            </View>
            <View style={styles.tableCellValue}>
              <View style={styles.verticalCheckboxContainer}>
                <View style={styles.checkboxOption}>
                  {renderCheckbox(hrDecision === 'noConflict')}
                  <Text style={{ fontSize: 9 }}>No conflict found</Text>
                </View>
                <View style={styles.checkboxOption}>
                  {renderCheckbox(hrDecision === 'mitigation')}
                  <Text style={{ fontSize: 9 }}>Conflict identified and mitigation plan implemented</Text>
                </View>
                <View style={styles.checkboxOption}>
                  {renderCheckbox(hrDecision === 'furtherReview')}
                  <Text style={{ fontSize: 9 }}>Further review required</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Signature of Reviewer</Text>
            </View>
            <View style={styles.tableCellValue}>
              {renderSignature(getValue('reviewerSignature'))}
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCellLabel}>
              <Text>Date</Text>
            </View>
            <View style={styles.tableCellValue}>
              <Text>{formatDate(getValue('reviewerDate'))}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Conflict of Interest Disclosure Form</Text>
        {renderEmployeeInformation()}
        {renderSection1()}
        {renderSection2()}
        {renderSection3()}
      </Page>

      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Text style={styles.title}>Conflict of Interest Disclosure Form</Text>
        {renderSection4()}
        {renderHRSection()}
      </Page>
    </Document>
  );
};

export default ConflictOfInterestPDF;

