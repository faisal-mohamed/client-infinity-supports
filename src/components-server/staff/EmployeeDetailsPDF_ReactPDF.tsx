import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import BasePDFLayout, { PDFMeta } from '@/components-server/pdf/layout/BasePDFLayout';
import PDFSection from '@/components-server/pdf/layout/PDFSection';
import { PDFField, PDFFieldFullWidth, PDFFieldRow } from '@/components-server/pdf/elements/PDFField';
import PDFParagraph from '@/components-server/pdf/elements/PDFParagraph';
import PDFCheckboxGroup, { CheckboxItem } from '@/components-server/pdf/elements/PDFCheckboxGroup';
import PDFPanel from '@/components-server/pdf/elements/PDFPanel';
import PDFSignatureBlock from '@/components-server/pdf/elements/PDFSignatureBlock';

interface EmployeeDetailsPDFProps {
  data: any;
}

const EmployeeDetailsPDF: React.FC<EmployeeDetailsPDFProps> = ({ data }) => {
  // Get meta from settings (passed via data.settings), no hardcoded defaults
  const settings = data?.settings || {};
  const meta: PDFMeta | undefined = (settings?.website || settings?.employee_details_form_id || settings?.employee_details_review_date) ? {
    website: settings?.website,
    version: settings?.employee_details_form_id,
    reviewDate: settings?.employee_details_review_date,
  } : undefined;

  const logoUrl = data?.logoDataUrl || '/infinity_logo.png';

  // Get value with fallback for field name variations
  const getValue = (key: string): string => {
    // Handle lastName/surname field name mismatch
    if (key === 'surname') {
      return data?.data?.surname || data?.data?.lastName || data?.lastName || '';
    }
    // Check both data.data and direct data for other fields
    return data?.data?.[key] || data?.[key] || '';
  };
  
  // Normalize checkbox values to ensure proper rendering
  const getCheckboxValue = (key: string) => {
    const value = data?.data?.[key];
    // Handle boolean values
    if (value === true || value === false) return value;
    // Handle string values
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      if (lower === 'true' || lower === 'yes' || lower === '1') return true;
      if (lower === 'false' || lower === 'no' || lower === '0') return false;
    }
    // Handle number values
    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }
    return value;
  };

  const employmentStatus = (getValue('employmentStatus') || '').toString().toLowerCase();

  return (
    <BasePDFLayout title="Employee Details Form" logo={logoUrl} meta={meta}>
      <View>
        <PDFSection title="Personal Information">
          <PDFFieldRow>
            <PDFField label="First Name" value={getValue('firstName')} />
            <PDFField label="Last Name" value={getValue('surname')} />
          </PDFFieldRow>
          <PDFFieldRow>
            <PDFField label="Start Date" value={formatDate(getValue('startDate'))} />
            <PDFField label="Position Title" value={getValue('positionTitle')} />
          </PDFFieldRow>
          <PDFFieldRow>
            <PDFField label="Gender" value={getValue('gender')} />
            <PDFField label="Date of Birth" value={formatDate(getValue('dateOfBirth'))} />
          </PDFFieldRow>
        </PDFSection>

        <PDFSection title="Contact Details">
          <PDFFieldFullWidth label="Address" value={getValue('address')} />
          <PDFFieldRow>
            <PDFField label="Suburb" value={getValue('suburb')} />
            <PDFField label="State" value={getValue('state')} />
          </PDFFieldRow>
          <PDFFieldRow>
            <PDFField label="Postcode" value={getValue('postcode')} />
            <PDFField label="Home Phone" value={getValue('homePhone')} />
          </PDFFieldRow>
          <PDFFieldRow>
            <PDFField label="Mobile" value={getValue('mobile')} />
            <PDFField label="Email Address" value={getValue('email')} />
          </PDFFieldRow>
        </PDFSection>

        <PDFSection title="Tax & Banking Information">
          <PDFFieldFullWidth label="Employee Tax File" value={getValue('employeeTaxFile')} />
          <PDFPanel title="Bank Details">
            <PDFFieldRow>
              <PDFField label="Bank Name" value={getValue('bankName')} />
              <PDFField label="Branch" value={getValue('bankBranch')} />
            </PDFFieldRow>
            <PDFFieldFullWidth label="Account Name" value={getValue('accountName')} />
            <PDFFieldRow>
              <PDFField label="BSB" value={getValue('bsb')} />
              <PDFField label="Account Number" value={getValue('accountNumber')} />
            </PDFFieldRow>
          </PDFPanel>
        </PDFSection>

        <PDFSection title="Residency & Work Rights" wrap={false}>
          <View style={styles.checkboxColumn}>
            <PDFCheckboxGroup
              label="Are you an Australian citizen?"
              value={getCheckboxValue('isAustralianCitizen')}
            />
            <PDFCheckboxGroup
              label="Are you a permanent resident?"
              value={getCheckboxValue('isPermanentResident')}
            />
            <PDFCheckboxGroup
              label="Do you have a Working Visa?"
              value={getCheckboxValue('hasWorkingVisa')}
            />
          </View>
          {getCheckboxValue('hasWorkingVisa') && getCheckboxValue('hasWorkingVisa').toString().toLowerCase() === 'true' && (
            <PDFField label="Visa Expiry Date" value={formatDate(getValue('visaExpiryDate'))} fullWidth />
          )}
          {getValue('workRestrictions') && (
            <PDFParagraph label="Any restrictions?" value={getValue('workRestrictions')} bordered={false} />
          )}
        </PDFSection>

        <PDFSection title="Next of Kin">
          <PDFFieldRow>
            <PDFField label="Next of Kin" value={getValue('nokName')} />
            <PDFField label="Relationship" value={getValue('nokRelationship')} />
          </PDFFieldRow>
          <PDFFieldFullWidth label="Address" value={getValue('nokAddress')} />
          <PDFFieldRow>
            <PDFField label="Suburb" value={getValue('nokSuburb')} />
            <PDFField label="State" value={getValue('nokState')} />
          </PDFFieldRow>
          <PDFFieldRow>
            <PDFField label="Postcode" value={getValue('nokPostcode')} />
            <PDFField label="Home Phone" value={getValue('nokHomePhone')} />
          </PDFFieldRow>
          <PDFFieldRow>
            <PDFField label="Mobile" value={getValue('nokMobile')} />
            <PDFField label="Work Phone" value={getValue('nokWorkPhone')} />
          </PDFFieldRow>
        </PDFSection>

        <PDFSignatureBlock
          label="Employee Signature"
          image={data?.staffSignature}
          date={data?.staffSignedAt}
        />

        <PDFSection title="Office Use Only" wrap={false}>
          <PDFPanel title="Employee Status">
            <View style={styles.officeRow}>
              <View style={styles.officeLeft}>
                <View style={styles.statusList}>
                  <View style={styles.statusItem}>
                    <CheckboxItem checked={employmentStatus === 'fulltime'} label="Full time" />
                  </View>
                  <View style={styles.statusItem}>
                    <CheckboxItem checked={employmentStatus === 'parttime'} label="Part time" />
                  </View>
                  <View style={styles.statusItem}>
                    <CheckboxItem checked={employmentStatus === 'casual'} label="Casual" />
                  </View>
                </View>
              </View>
              <View style={styles.officeRight}>
                <PDFFieldFullWidth label="Pay rate" value={getValue('payRate')} />
                <PDFFieldFullWidth label="SCHADS Level" value={getValue('schadsScore') || getValue('schadsLevel')} />
              </View>
            </View>
          </PDFPanel>
        </PDFSection>

        {/* Admin Signature - Only show if admin has signed */}
        {data?.adminSignature && (
          <PDFSignatureBlock
            label="Admin Signature"
            image={data?.adminSignature}
            date={data?.adminSignedAt}
          />
        )}
      </View>
    </BasePDFLayout>
  );
};

const formatDate = (value?: string) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-AU');
  } catch {
    return value;
  }
};

const styles = StyleSheet.create({
  checkboxColumn: {
    width: '100%',
    marginBottom: 6,
  },
  officeRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  officeLeft: {
    width: '45%',
    justifyContent: 'center',
    paddingRight: 12,
  },
  officeRight: {
    width: '55%',
  },
  statusList: {
    width: '100%',
  },
  statusItem: {
    marginBottom: 4,
  },
});

export default EmployeeDetailsPDF;

