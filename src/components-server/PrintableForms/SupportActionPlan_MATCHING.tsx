import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { supportActionPlanSchema, SchemaBlock } from '../../app/components/forms/support-action-plan/schema';
import { NDISCheckbox } from './common/NDIS_Common';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#ffffff', padding: 30, paddingTop: 120, paddingBottom: 50, fontFamily: 'Helvetica' },
  header: { position: 'absolute', top: 20, left: 0, right: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  headerLogo: { width: 180, height: 70, objectFit: 'contain' },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 8, marginBottom: 4, textDecoration: 'underline' },
  footer: { position: 'absolute', bottom: 15, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, borderTop: '1 solid #d1d5db', paddingTop: 6 },
  footerText: { fontSize: 9, color: '#6b7280' },
  fieldContainer: { marginBottom: 8 },
  fieldHeader: { backgroundColor: '#d1d5db', border: '1 solid #000000', borderBottom: 0, paddingVertical: 3, paddingHorizontal: 6 },
  fieldLabel: { fontWeight: 'bold', fontSize: 9 },
  fieldValue: { border: '1 solid #000000', borderTop: 0, padding: 6, backgroundColor: '#ffffff', fontSize: 8, lineHeight: 1.3, minHeight: 20 },
  tableRow: { flexDirection: 'row', border: '1 solid #000000', borderTop: 0 },
  tableCell: { padding: 4, borderRight: '1 solid #000000' },
  tableCellLast: { padding: 4 },
  sectionHeader: { fontSize: 10, fontWeight: 'bold', marginBottom: 8, textDecoration: 'underline' },
  checkboxBox: { width: 8, height: 8, border: '1 solidrgb(111, 213, 218)', marginRight: 6 },
  noteText: { fontSize: 8, lineHeight: 1.4 },
  smallText: { fontSize: 7, lineHeight: 1.3 },
  tickBox: { width: 10, height: 10, border: '1 solid #000000', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  tick: { color: '#2563eb', fontSize: 10, fontWeight: 'bold', lineHeight: 1 },
});

interface Props { formData: any; commonFieldsData: any; settings: any; logoDataUrl: string; }

const commonFieldMapping: Record<string, string> = {
  participantName: 'name', ndisNumber: 'ndis', dob: 'dob', gender: 'sex', address: 'street', state: 'state', postcode: 'postCode', email: 'email', phone: 'phone'
};

const getFieldValue = (formData: any, commonFieldsData: any, key: string): string => {
  // For participantName field, combine first name and surname to show full name
  if (key === 'participantName') {
    const firstName = commonFieldsData?.name || '';
    const surname = commonFieldsData?.surname || '';
    const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
    if (fullName) {
      return fullName;
    }
    // Fallback to form data if commonFieldsData doesn't have name
    return formData?.[key] ? String(formData[key]) : '';
  }

  const mapped = commonFieldMapping[key];
  // Always prioritize current client details from database
  const raw = (mapped && commonFieldsData?.[mapped])
    ? commonFieldsData[mapped]
    : formData?.[key];
  return raw ? String(raw) : '';
};

const renderParticipantTable = (formData: any, commonFieldsData: any) => (
  <View style={styles.fieldContainer}>
    <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
      <View style={[styles.tableCell, { width: '66%' }]}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Participant Details</Text></View>
      <View style={[styles.tableCellLast, { width: '34%', alignItems: 'flex-end' }]}>
        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>NDIS Number: <Text style={{ fontWeight: 'normal' }}>{getFieldValue(formData, commonFieldsData, 'ndisNumber') || ''}</Text></Text>
      </View>
    </View>
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { width: '50%' }]}>
        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Name:</Text>
        <Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'participantName') || ''}</Text>
      </View>
      <View style={[styles.tableCell, { width: '25%' }]}>
        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>DOB:</Text>
        <Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'dob') || ''}</Text>
      </View>
      <View style={[styles.tableCellLast, { width: '25%' }]}>
        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Gender:</Text>
        <Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'gender') || ''}</Text>
      </View>
    </View>
    <View style={styles.tableRow}><View style={styles.tableCellLast}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Address:</Text><Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'address') || ''}</Text></View></View>
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { width: '33%' }]}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>State:</Text><Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'state') || ''}</Text></View>
      <View style={[styles.tableCell, { width: '33%' }]}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Postcode:</Text><Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'postcode') || ''}</Text></View>
      <View style={[styles.tableCellLast, { width: '34%' }]}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Phone:</Text><Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'phone') || ''}</Text></View>
    </View>
    <View style={styles.tableRow}><View style={styles.tableCellLast}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Email address:</Text><Text style={{ fontSize: 8 }}>{getFieldValue(formData, commonFieldsData, 'email') || ''}</Text></View></View>
    {/* Extra legacy rows */}
    {(!!formData?.planStartDate || !!formData?.planEndDate) && (
      <View style={styles.tableRow}>
        <View style={styles.tableCellLast}>
          <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Plan Dates:</Text>
          <Text style={{ fontSize: 8 }}>
            {formData?.planStartDate && formData?.planEndDate
              ? `${formatDateForPDF(formData.planStartDate)} - ${formatDateForPDF(formData.planEndDate)}`
              : formData?.planStartDate
                ? `From: ${formatDateForPDF(formData.planStartDate)}`
                : formData?.planEndDate
                  ? `To: ${formatDateForPDF(formData.planEndDate)}`
                  : ''}
          </Text>
        </View>
      </View>
    )}
    {!!formData?.preferredContactPerson && (
      <View style={styles.tableRow}>
        <View style={styles.tableCellLast}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Preferred Contact Person:</Text><Text style={{ fontSize: 8 }}>{String(formData.preferredContactPerson)}</Text></View>
      </View>
    )}
    {!!formData?.communicationConsiderations && (
      <View style={styles.tableRow}>
        <View style={styles.tableCellLast}><Text style={{ fontSize: 8, fontWeight: 'bold' }}>Communication considerations:</Text><Text style={{ fontSize: 8 }}>{String(formData.communicationConsiderations)}</Text></View>
      </View>
    )}
  </View>
);

// REUSED NDISCheckbox from common, styled to match blue theme
const BlueTick = ({ checked }: { checked: boolean }) => {
  return (
    <NDISCheckbox
      checked={checked}
      color="#2563eb" // Blue to match the form theme
      size={10}      // 10x10 sizing
    />
  );
};

// Helper: Check if field has value (strict check - handles whitespace, null, undefined, empty strings)
const hasValue = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed !== '' && trimmed !== 'null' && trimmed !== 'undefined';
};

// Helper: Conditionally render field in PDF
const ConditionalText = ({ label, value, required = false }: { label?: string; value: string; required?: boolean }) => {
  if (!hasValue(value) && !required) return null;
  if (label) {
    return (
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 8 }}>{label}</Text>
        {hasValue(value) && <Text style={styles.noteText}>{value}</Text>}
      </View>
    );
  }
  return hasValue(value) ? <Text style={styles.noteText}>{value}</Text> : null;
};

// Helper: Conditionally render numbered provider
const ConditionalProvider = ({ num, value }: { num: number; value: string }) => {
  if (!hasValue(value)) return null;
  return <Text style={styles.noteText}>{num}. {value}</Text>;
};

// Helper: Yes/No row showing both options - FIXED to prevent splitting across pages/lines
const YesNoRow = ({ label, k, formData }: { label: string; k: string; formData: any }) => {
  const isYes = formData?.[k] === 'Yes';
  return (
    <View style={{ marginBottom: 4, flexDirection: 'row', alignItems: 'flex-start' }} wrap={false}>
      <Text style={{ fontWeight: 'bold', fontSize: 8, marginRight: 8, flex: 1 }}>{label} </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BlueTick checked={isYes} />
          <Text style={{ fontSize: 8, marginLeft: 4 }}>Yes</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BlueTick checked={!isYes} />
          <Text style={{ fontSize: 8, marginLeft: 4 }}>No</Text>
        </View>
      </View>
    </View>
  );
};

// Preferred Contact section (Plan Nominee / Family Member) – legacy-style grid
const renderPreferredContact = (formData: any) => {
  const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
  const yesNo = (keys: string[]) => keys.some(k => !!formData?.[k]);
  const fundingOptions = [
    { key: 'Plan managed', label: 'Plan managed' },
    { key: 'Self-managed', label: 'Self-managed' },
    { key: 'NDIA managed', label: 'NDIA managed' },
    { key: 'Other', label: 'Other' },
  ];
  const fundingArray: string[] = Array.isArray(formData?.funding)
    ? formData.funding
    : typeof formData?.funding === 'string'
      ? formData.funding.split(',').map((s: string) => s.trim())
      : [];
  const fundingFlags = {
    plan: !!(formData?.funding_plan_managed || fundingArray.includes('Plan managed')),
    self: !!(formData?.funding_self_managed || fundingArray.includes('Self-managed')),
    ndia: !!(formData?.funding_ndia_managed || fundingArray.includes('NDIA managed')),
    other: !!(formData?.funding_other || fundingArray.includes('Other')),
  };
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.sectionHeader}>2. Preferred Contact (Plan Nominee / Family Member)</Text>
      <View style={{ border: '1 solid #000000' }}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '50%' }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Name:</Text>
            <Text style={{ fontSize: 8 }}>{get('contactName')}</Text>
          </View>
          <View style={[styles.tableCellLast, { width: '50%' }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Relationship to participant:</Text>
            <Text style={{ fontSize: 8 }}>{get('relationship')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLast}>
            <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Address:</Text>
            <Text style={{ fontSize: 8 }}>{get('contactAddress')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '50%' }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Contact phone number:</Text>
            <Text style={{ fontSize: 8 }}>{get('contactPhone')}</Text>
          </View>
          <View style={[styles.tableCellLast, { width: '50%' }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 8 }}>Email Address:</Text>
            <Text style={{ fontSize: 8 }}>{get('contactEmail')}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCellLast}>
            <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>Funding:</Text>
            {[
              { label: 'Plan managed', checked: fundingFlags.plan },
              { label: 'Self-managed', checked: fundingFlags.self },
              { label: 'NDIA managed', checked: fundingFlags.ndia },
              { label: 'Other', checked: fundingFlags.other },
            ].map(({ label, checked }) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <BlueTick checked={checked} />
                <Text style={{ fontSize: 8, marginLeft: 4 }}>{label}</Text>
              </View>
            ))}
            {fundingFlags.other && hasValue(get('fundingOther')) && (
              <View style={{ marginTop: 6 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 2 }}>Other (please specify):</Text>
                <Text style={{ fontSize: 8, lineHeight: 1.4 }}>{get('fundingOther')}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// Goals section (NDIS Participant's Goals) – legacy layout
const renderGoalsSection = (formData: any) => {
  const mk = (k: string) => (formData?.[k] ? String(formData[k]) : '');
  const goalKeys = ['goal1', 'goal2', 'goal3', 'goal4', 'goal5', 'goal6', 'goal7'];
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.sectionHeader}>3. NDIS Participant's Goals</Text>
      <View style={{ border: '1 solid #000000' }}>
        {goalKeys.map((gk, i) => (
          <View key={gk} style={i === 0 ? { flexDirection: 'row' } : [styles.tableRow, { borderTop: '1 solid #000000' }]}>
            <View style={[styles.tableCell, { width: '20%' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 8 }}>{`Goal ${i + 1}`}</Text>
            </View>
            <View style={[styles.tableCellLast, { width: '80%' }]}>
              <Text style={{ fontSize: 8 }}>{mk(gk)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Support Requirements Question (page 2 start)
const renderSupportRequirementsQuestion = () => (
  <View style={styles.fieldContainer}>
    <View style={[styles.tableRow, { backgroundColor: '#a9c1e0' }]}>
      <View style={styles.tableCellLast}>
        <Text style={{ fontWeight: 'bold', fontSize: 9 }}>
          4. Consider, what support is required to assist you to achieve your goals? Are there any barriers preventing you from achieving your goals?
        </Text>
      </View>
    </View>
  </View>
);

// Support Requirements – CORE and CAPACITY BUILDING blocks
const renderSupportRequirements = (formData: any) => {
  const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');

  const Section = ({ title, items }: { title: string; items: React.ReactNode }) => (
    <View style={{ marginBottom: 8 }}>
      <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
        <View style={styles.tableCellLast}><Text style={{ fontWeight: 'bold', fontSize: 9 }}>{title}</Text></View>
      </View>
      <View style={{ borderLeft: '1 solid #000000', borderRight: '1 solid #000000', borderBottom: '1 solid #000000', padding: 6 }}>
        {items}
      </View>
    </View>
  );

  return (
    <View style={styles.fieldContainer}>
      <Section
        title="CORE SUPPORTS"
        items={(
          <View>
            <ConditionalText label="Support Required" value={get('coreSupportText')} />
            <ConditionalText label="Preferred provider" value={get('corePreferredProviders')} />
            <ConditionalText label="Alternative provider" value={get('coreAlternativeProviders')} />
            <YesNoRow label="Service Agreement developed/signed?" k="coreAgreementSigned" formData={formData} />
            <ConditionalText label="Support Co-ordinator Action" value={get('coreSupportsCommenced')} />
            <YesNoRow label="Discussion held with Plan Manager and budget approved?" k="coreBudgetApproved" formData={formData} />
          </View>
        )}
      />
      <Section
        title="CAPACITY BUILDING"
        items={(
          <View>
            <ConditionalText label="Support Required" value={get('capacitySupportText')} />
            <ConditionalText label="Preferred provider" value={get('capacityPreferredProviders')} />
            <ConditionalText label="Alternative provider" value={get('capacityAlternativeProviders')} />
            <YesNoRow label="Service Agreement developed/signed?" k="capacityAgreementSigned" formData={formData} />
            <ConditionalText label="Supports in place at start of plan" value={get('capacitySupportsInPlace')} />
            <YesNoRow label="Are additional assessments required to access this support type?" k="capacityAssessmentRequired" formData={formData} />
            {get('capacityAssessmentRequired') === 'Yes' && <ConditionalText label="If Yes - Actions" value={get('capacityActions')} />}
            <YesNoRow label="Discussion held with Plan Manager and budget approved?" k="capacityBudgetApproved" formData={formData} />
          </View>
        )}
      />
    </View>
  );
};

// Capital Supports section
const renderCapitalSupports = (formData: any) => {
  const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
  return (
    <View style={styles.fieldContainer}>
      <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
        <View style={styles.tableCellLast}><Text style={{ fontWeight: 'bold', fontSize: 9 }}>CAPITAL</Text></View>
      </View>
      <View style={{ borderLeft: '1 solid #000000', borderRight: '1 solid #000000', borderBottom: '1 solid #000000', padding: 6 }}>
        <ConditionalText label="Support Required" value={get('supportRequired1')} />
        <ConditionalText label="Preferred provider" value={get('preferredProviders1')} />
        <ConditionalText label="Alternative provider" value={get('alternativeProviders1')} />
        <YesNoRow label="Service Agreement developed/signed?" k="serviceAgreement1" formData={formData} />
        <YesNoRow label="Are additional assessments required to access this support type?" k="additionalAssessment1" formData={formData} />
        {get('additionalAssessment1') === 'Yes' && <ConditionalText label="If Yes - Actions" value={get('assessmentActions1')} />}
        <YesNoRow label="Discussion held with Plan Manager and budget approved?" k="planManagerDiscussion1" formData={formData} />
      </View>
    </View>
  );
};

// Mainstream Supports section
const renderMainstreamSupports = (formData: any) => {
  const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
  const isYes = formData?.['budgetApproval'] === 'Yes';
  return (
    <View style={styles.fieldContainer}>
      <View style={[styles.tableRow, { backgroundColor: '#d1d5db' }]}>
        <View style={styles.tableCellLast}><Text style={{ fontWeight: 'bold', fontSize: 9 }}>MAINSTREAM SUPPORTS & SERVICES</Text></View>
      </View>
      <View style={{ borderLeft: '1 solid #000000', borderRight: '1 solid #000000', borderBottom: '1 solid #000000', padding: 6 }}>
        <ConditionalText label="Support Required" value={get('supportRequired2')} />
        <ConditionalText label="Preferred provider" value={get('preferredProviders2')} />
        <ConditionalText label="Alternative provider" value={get('alternativeProviders2')} />
        <YesNoRow label="Service Agreement developed/signed?" k="serviceAgreement2" formData={formData} />
        <YesNoRow label="Are additional assessments required to access this support type?" k="additionalAssessment2" formData={formData} />
        {get('additionalAssessment2') === 'Yes' && <ConditionalText label="If Yes - Actions" value={get('assessmentActions2')} />}
        {/* Budget Approval question moved INSIDE MAINSTREAM section */}
        <View style={{ marginTop: 6 }}>
          <YesNoRow label="Discussion held with Plan Manager and budget approved?" k="budgetApproval" formData={formData} />
        </View>
      </View>
    </View>
  );
};

// Budget Approval section
const renderBudgetApproval = (formData: any) => {
  const isYes = formData?.['budgetApproval'] === 'Yes';
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.tableRow}>
        <View style={styles.tableCellLast}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 9, marginRight: 8 }}>Discussion held with Plan Manager and budget approved?</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BlueTick checked={isYes} />
                <Text style={{ fontSize: 8, marginLeft: 4 }}>Yes</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BlueTick checked={!isYes} />
                <Text style={{ fontSize: 8, marginLeft: 4 }}>No</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Next Plan Goals section
const renderNextPlanGoals = (formData: any) => {
  const get = (k: string) => (formData?.[k] ? String(formData[k]) : '');
  const goalsText = get('goalsText');
  // Don't render if empty (matching view form behavior)
  if (!hasValue(goalsText)) return null;
  return (
    <View style={styles.fieldContainer}>
      <View style={[styles.tableRow, { backgroundColor: '#a9c1e0' }]}>
        <View style={styles.tableCellLast}>
          <Text style={{ fontWeight: 'bold', fontSize: 9 }}>5. Goals and funding required for next plan</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={styles.tableCellLast}>
          <Text style={{ fontSize: 8, lineHeight: 1.5 }}>{goalsText}</Text>
        </View>
      </View>
    </View>
  );
};

// Format date from ISO format to dd/MM/yyyy
const formatDateForPDF = (value: string | null | undefined): string => {
  if (!value) return '___/___/____';
  // Check if it's ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  if (typeof value === 'string') {
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }
    // If already formatted, return as is
    if (value.includes('/')) return value;
  }
  return value || '___/___/____';
};

const renderSignatureGroup = (formData: any, commonFieldsData: any, block: SchemaBlock) => {
  const meta = block.meta || {};
  const sigValue = getFieldValue(formData, commonFieldsData, meta.signatureKey || '');
  // Get date directly from formData - check both old and new field names
  const dateKey = meta.dateKey || '';
  let dateValue = formData?.[dateKey] || '';

  // Handle API field name mismatches:
  // API returns participantSignatureDate but schema expects participantDate
  // API returns providerSignatureDate but schema expects authorDate
  if (!dateValue && dateKey === 'participantDate') {
    dateValue = formData?.['participantSignatureDate'] || '';
  }
  if (!dateValue && dateKey === 'authorDate') {
    dateValue = formData?.['providerSignatureDate'] || formData?.['authorSignatureDate'] || '';
  }

  const formattedDate = formatDateForPDF(dateValue);
  return (
    <View style={styles.fieldContainer}>
      {meta.title && (<Text style={styles.sectionHeader}>{meta.title}</Text>)}
      <View style={{ border: '1 solid #000000' }}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '50%', padding: 8 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>{meta.signatureLabel || 'Signature'}:</Text>
            {sigValue?.startsWith('data:image') ? (
              <Image src={sigValue} style={{ width: 120, height: 35 }} />
            ) : (
              <Text style={{ fontSize: 8 }}>__________________</Text>
            )}
          </View>
          <View style={[styles.tableCellLast, { width: '50%', padding: 8 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>Date:</Text>
            <Text style={{ fontSize: 8 }}>{formattedDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const renderBlock = (formData: any, commonFieldsData: any, block: SchemaBlock) => {
  switch (block.type) {
    case 'table_participant':
      return renderParticipantTable(formData, commonFieldsData);
    case 'section_header': {
      // Filter out duplicate section headers that are rendered via custom renderers
      const label = (block.label || '').toLowerCase();
      const duplicateHeaders = ['preferred contact', 'core supports', 'capacity building', 'capital', 'mainstream supports & services', 'goals and funding required for next plan'];
      if (duplicateHeaders.some(h => label.includes(h.toLowerCase()))) {
        return null;
      }
      return (<View style={styles.fieldContainer}><Text style={styles.sectionHeader}>{block.label}</Text></View>);
    }
    case 'paragraph':
      return (<View style={styles.fieldContainer}><Text style={{ fontSize: 9, lineHeight: 1.6 }}>{block.content || ''}</Text></View>);
    case 'list':
      return (
        <View style={styles.fieldContainer}>
          {block.items?.map((item, idx) => (<Text key={idx} style={{ fontSize: 9, lineHeight: 1.6, marginLeft: 10 }}>• {item}</Text>))}
        </View>
      );
    case 'text': {
      const value = getFieldValue(formData, commonFieldsData, block.key || '');
      const valueStr = value && String(value).trim() !== '' ? String(value) : '__________________';
      return (
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}><Text style={styles.fieldLabel}>{block.label}</Text></View>
          <View style={styles.fieldValue}><Text>{valueStr}</Text></View>
        </View>
      );
    }
    case 'date': {
      const value = getFieldValue(formData, commonFieldsData, block.key || '');
      const formattedDate = formatDateForPDF(value);
      return (
        <View style={styles.fieldContainer}>
          <View style={styles.fieldHeader}><Text style={styles.fieldLabel}>{block.label}</Text></View>
          <View style={styles.fieldValue}><Text>{formattedDate}</Text></View>
        </View>
      );
    }
    case 'signature_group':
      return renderSignatureGroup(formData, commonFieldsData, block);
    default:
      return null;
  }
};

const SupportActionPlanMatchingPDF: React.FC<Props> = ({ formData, commonFieldsData, settings, logoDataUrl }) => {
  try {
    console.log('🧾 [SAP PDF] Using SupportActionPlan_MATCHING.tsx for PDF generation');
    console.log('[SAP PDF] Props summary:', {
      formDataKeys: Object.keys(formData || {}).length,
      commonFieldsKeys: Object.keys(commonFieldsData || {}).length,
      settingsKeys: Object.keys(settings || {}).length,
      logoProvided: !!logoDataUrl,
      sample: {
        participantName: (formData || {}).participantName,
        ndisNumber: (formData || {}).ndisNumber,
        email: (formData || {}).email || (commonFieldsData || {}).email,
      }
    });
  } catch { }
  const footerWebsite = settings?.company_website || '';
  const footerId = settings?.support_action_plan || '';
  const footerDate = settings?.review_date || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        <View>
          <Text style={styles.title}>SUPPORT CO-ORDINATION ACTION PLAN</Text>
          {(() => { try { console.log('[SAP PDF] blocks to render:', supportActionPlanSchema.length, supportActionPlanSchema.map(b => b.type).slice(0, 10)); } catch { } return null; })()}
          {/* Page 1: Participant details */}
          {renderParticipantTable(formData, commonFieldsData)}
          {/* Page 1 (cont.): Preferred Contact */}
          {renderPreferredContact(formData)}
          {/* Page 1/2: Goals */}
          {renderGoalsSection(formData)}
          {/* Page 2: Support Requirements Question */}
          {renderSupportRequirementsQuestion()}
          {/* Page 2: Support Requirements (CORE, CAPACITY) */}
          {renderSupportRequirements(formData)}
          {/* Page 3: Capital */}
          {renderCapitalSupports(formData)}
          {/* Page 3: Mainstream Supports (includes Budget Approval inside) */}
          {renderMainstreamSupports(formData)}
          {/* Page 4: Next Plan Goals */}
          {renderNextPlanGoals(formData)}
          {/* Signatures (from schema) */}
          {supportActionPlanSchema.map((block, idx) => (
            <View key={`schema-${idx}`}>{renderBlock(formData, commonFieldsData, block)}</View>
          ))}
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerWebsite}</Text>
          <Text style={styles.footerText}>{footerId}</Text>
          <Text style={styles.footerText}>Review Date: {footerDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SupportActionPlanMatchingPDF;


