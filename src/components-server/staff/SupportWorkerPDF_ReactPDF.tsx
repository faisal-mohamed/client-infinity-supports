import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import BasePDFLayout, { PDFMeta } from '@/components-server/pdf/layout/BasePDFLayout';
import PDFSignatureBlock from '@/components-server/pdf/elements/PDFSignatureBlock';

interface SupportWorkerPDFProps {
  data: any;
}

const SupportWorkerPDF: React.FC<SupportWorkerPDFProps> = ({ data }) => {
  const meta: PDFMeta = {
    website: 'infinitysupportswa.org',
    version: 'PD- Support Worker Form',
    reviewDate: '01/03/2025',
  };

  const logoUrl = data?.logoDataUrl || '/infinity_logo.png';
  const formData = data?.data ?? {};
  const signature = data?.staffSignature || formData.signature;
  const signedAt = data?.staffSignedAt || formData.date;
  const staffName = formData.fullName || `${data?.staff?.firstName || ''} ${data?.staff?.surname || ''}`.trim();

  return (
    <BasePDFLayout title="Support Worker Position Description" logo={logoUrl} meta={meta}>
      <View style={styles.container}>
        {renderPositionDescription(formData)}
        {renderPurpose()}
        {renderResponsibilitiesWorkplace()}
        {renderResponsibilitiesPosition()}
        {renderGeneralResponsibilities()}
        {renderSpecificAreas()}
        {renderWorkplaceHealthSafety()}
        {renderQualityEnvironmental()}
        {renderExperienceQualifications()}
        {renderKeyRequirements()}
        {renderAcknowledgement(staffName)}
        <PDFSignatureBlock label="Signature" image={signature} date={signedAt} />
      </View>
    </BasePDFLayout>
  );
};

const renderPositionDescription = (formData: any) => (
  <View style={styles.card} wrap={false}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Position Description</Text>
    </View>
    <View style={styles.cardBody}>
      {renderField('Position Title', 'Support Worker')}
      {renderField('Business Unit', formData?.businessUnit)}
      {renderField('Reports To', formData?.reportsTo)}
    </View>
  </View>
);

const renderPurpose = () => (
  <View style={styles.card} wrap={false}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Purpose</Text>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.paragraph}>
        The purpose of a Support Worker is to support clients to live their lives more independently and help them to reach their
        potential by providing both physical and emotional support.
      </Text>
    </View>
  </View>
);

const renderResponsibilitiesWorkplace = () => (
  <View style={styles.card} wrap={false}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Responsibilities and Accountabilities – for the Workplace</Text>
    </View>
    <View style={styles.cardBody}>
      {renderBulletList([
        'Follow company policies including Code of Conduct, Anti-Discrimination, Harassment/Victimisation policies.',
        'Adhere to Workplace Health and Safety.',
        'Ensure all Company Standard Operating Procedures are adhered too.',
        'Display a positive attitude and be an active, dependable member of the team.',
        'Lead by example in everything you do.',
        'Support and treat others with respect.',
        'Always provide constructive feedback in a way that does not blame.',
        'Be accountable for your actions and results.',
        'Be consistent and speak the truth.',
      ])}
    </View>
  </View>
);

const renderResponsibilitiesPosition = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Responsibilities and Accountabilities – for the Position</Text>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.paragraph}>
        The specific duties that you will undertake as a Support Worker will be set and agreed by the person you support or their family.
        Please refer to the "Support Plan" section of each person's profile for an overview of the duties required by each person you support.
      </Text>
      <Text style={styles.paragraph}>
        You are invited to reach out to people seeking support where the job description, as detailed in the "Support Plan" section, appeals to you.
      </Text>
      <Text style={styles.paragraph}>
        Further verbal and/or written instructions will be provided by the person seeking support or their family at the time of meeting. It is the responsibility of the person seeking support or their family to explain to you exactly what tasks need to be performed daily.
      </Text>
      <Text style={styles.paragraph}>
        As a rule, Infinity Supports WA requires Support Workers to perform all tasks within the following guidelines:
      </Text>
      {renderBulletList([
        'Perform all duties with professionalism and care.',
        "You must only work with one individual at a time unless agreed with your Line Manager and you are working in a 'Group Setting'.",
      ], true)}
    </View>
  </View>
);

const renderGeneralResponsibilities = () => (
  <View style={styles.card}>
    <View style={styles.cardHeaderLight}>
      <Text style={styles.cardHeaderTextLight}>General Responsibilities</Text>
    </View>
    <View style={styles.cardBody}>
      {renderBulletList([
        'At all times, work under general guidance from the person seeking support or their family, within clearly defined guidelines. This means that the tasks you undertake should be clearly explained to you, with guidance given should you need it as you go.',
        'You are responsible for managing your time, and for planning and organising activities on support.',
        'You may be asked to work with limited supervision. This is appropriate if instructions on how to perform the task have been given in advance.',
        'Perform activities requiring the exercise of sound judgment, initiative, confidentiality, and sensitivity in the performance of work. However, guidance is available to you should you need it.',
        'Follow all Infinity Supports WA guidelines regarding incident reporting, mandatory reporting, providing feedback and flagging risks.',
      ])}
    </View>
  </View>
);

const renderSpecificAreas = () => (
  <View style={styles.card}>
    <View style={styles.cardHeaderLight}>
      <Text style={styles.cardHeaderTextLight}>Specific Areas of Support</Text>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.paragraph}>Infinity Supports WA Support Workers may be asked to provide support in the following areas:</Text>
      {renderBulletList([
        'Support Worker provides one on one support to client in their home or in a community setting.',
        'Provide support to a client to meet emotional and psychological needs.',
        "Provide care support which is responsive to the client's individual needs.",
        'Support Worker is required to conduct all manual handling tasks when required during provision of transport of client. Individual care plan provides information and levels of assistance, equipment/aids used to maintain client and support worker safety.',
        'Always maintain the dignity and respect of the client.',
        'Always maintain the rights of the client during service provision.',
        'Incident reporting as identified.',
        'The Support Worker ensures the clients safety and supervision during service provision.',
        'Individualised care plan and documentation provides strategies to engage and communicate effectively with the client to enhance service delivery.',
        'Support Worker is required to maintain regular communication with the Service Delivery Manager.',
        "Maintain Workplace Health and Safety by adhering to the client's care plan.",
        'Identification and reporting of hazards environmental, mechanical, and other potential hazards noted during service provision.',
        'Use of PPE as identified on care plan and when extraordinary event occurs.',
        "Comply with all policies and procedures relevant to performing tasks within a client's home.",
        'Required to perform and complete other duties as required keeping within a support workers scope of practice.',
      ])}
    </View>
  </View>
);

const renderWorkplaceHealthSafety = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Workplace Health & Safety</Text>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.paragraph}>As an employee you are required to:</Text>
      {renderBulletList([
        'Conduct own work and ensure direct reports work in a safe manner and in accordance with WHS Policies and Procedures.',
        'Identify and raise hazards and WHS issues on an on-going basis in relation to area of responsibility to ensure that risks are known to management and are controlled.',
        'Adhere to all safe working procedures in accordance with instructions/operating procedures.',
        'WHS issues are identified and addressed in a timely manner.',
        'Take reasonable care of yourself and others who may be affected by your actions.',
        'Abide by all Company Policies.',
        'Where appropriate PPE as required.',
        'Follow all Safety Instructions from your manager or the business.',
      ])}
      <Text style={[styles.paragraph, styles.bold]}>Assessing risk:</Text>
      <Text style={styles.paragraph}>
        Support Workers must assess risk in determining whether tasks, activities or duties are beyond the scope that could reasonably be expected from someone in the role of a Support Worker.
      </Text>
      <Text style={styles.paragraph}>Examples of tasks, duties, or activities outside the remit of a Support Worker include:</Text>
      {renderBulletList([
        'Any activity involving specialist knowledge, skill, or abilities that you do not possess.',
        'Performing any sort of medical procedure or intervention without clear instruction, and which are beyond your skills, experience, and qualifications.',
        'Operating heavy machinery.',
        'Using substances, tools, or equipment (e.g., hoists) not fit for purpose or without adequate training and guidelines from the person you support or their family.',
        'Performing any activity that has the potential to affect health and safety tools without first assessing risks and ensuring effective controls are in place.',
      ], true)}
    </View>
  </View>
);

const renderQualityEnvironmental = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Quality & Environmental Aspects</Text>
    </View>
    <View style={styles.cardBody}>
      <Text style={styles.paragraph}>As an employee you are required to:</Text>
      {renderBulletList([
        'Understand customer expectations from service and products.',
        'Maintain company quality standards.',
        'Follow company quality control processes.',
        'Report any customer complaints with management.',
        'Recycle and use appropriate waste storage bins.',
        'Minimise paper and electricity use where it is possible and practical.',
        'Report ideas and opportunities to your manager.',
      ])}
    </View>
  </View>
);

const renderExperienceQualifications = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Experience, Qualifications and Skills</Text>
    </View>
    <View style={styles.cardBody}>
      {renderBulletList([
        "Maintain current Australian driver's license.",
        'A current first aid and CPR certification',
        'Medication Competency (Desirable)',
        'Manual Handling Training (Desirable)',
        'NDIS workers screening',
        'Working with children check',
        'Australian citizenship or visa with legal right to work in Australia.',
        'Car with current registration and comprehensive insurance',
        'NDIS Online Trainings:',
        'Safe waste management training',
        'Infection control training',
        'COVID Vaccination including third/booster dose.',
        'Behaviour support training',
        'Seizure training',
      ])}
      {renderBulletList([
        'NDIS worker orientation module',
        'NDIS worker induction modules',
        'NDIS supporting effective communication training.',
        'NDIS supporting safe and enjoyable meal training.',
      ], true, styles.subBullet)}
    </View>
  </View>
);

const renderKeyRequirements = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Key Requirements & Attributes</Text>
    </View>
    <View style={styles.cardBody}>
      {renderBulletList([
        'Ability to adapt to different environments and cultures, demonstrating flexibility and a passion for providing a high level of care to the client.',
        'Understanding of services offered and systems to follow.',
        'Ability to make sound decisions under pressure and de-escalate crises.',
        'Excellent interpersonal and listening skills with evidence of empathy, tact and patience towards others.',
        'Critical thinking and complex problem-solving skills.',
        'Emerging knowledge of the local area and its health services and other community services.',
      ])}
    </View>
  </View>
);

const renderAcknowledgement = (staffName: string) => (
  <View style={styles.card} wrap={false}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardHeaderText}>Employee Acknowledgement</Text>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.fieldLine}>
        <Text style={styles.fieldLabel}>Name:</Text>
        <Text style={styles.fieldValue}>{staffName || ' '}</Text>
      </View>
    </View>
  </View>
);

const renderField = (label: string, value?: string) => (
  <View style={styles.fieldBox}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldBoxValue}>{value || ''}</Text>
  </View>
);

const renderBulletList = (items: string[], nested = false, bulletStyle?: any) => (
  <View style={{ marginLeft: nested ? 10 : 0, marginTop: 4 }}>
    {items.map((item, index) => (
      <Text key={index} style={[styles.bulletItem, bulletStyle]}>
        • {item}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  card: {
    width: '100%',
    border: '1 solid #d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    backgroundColor: '#1d4ed8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cardHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeaderLight: {
    backgroundColor: '#e5eefc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cardHeaderTextLight: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  paragraph: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.5,
  },
  bulletItem: {
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.5,
    marginBottom: 2,
  },
  subBullet: {
    fontStyle: 'italic',
    marginLeft: 8,
  },
  fieldBox: {
    border: '1 solid #cbd5f5',
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  fieldBoxValue: {
    fontSize: 10,
    color: '#111827',
  },
  fieldLine: {
    marginTop: 10,
  },
  fieldValue: {
    fontSize: 10,
    borderBottom: '1 solid #1f2937',
    paddingBottom: 6,
    color: '#111827',
  },
  bulletList: {
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  bulletListItem: {
    fontSize: 9,
    color: '#111827',
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default SupportWorkerPDF;
