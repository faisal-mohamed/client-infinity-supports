import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import BasePDFLayout from '@/components-server/pdf/layout/BasePDFLayout';
import PDFSection from '@/components-server/pdf/layout/PDFSection';
import PDFField from '@/components-server/pdf/elements/PDFField';
import PDFSignatureBlock from '@/components-server/pdf/elements/PDFSignatureBlock';
import PDFParagraph from '@/components-server/pdf/elements/PDFParagraph';

interface BullyingHarassmentTrainingPDFProps {
  data: any;
  logo?: string;
}

const BullyingHarassmentTrainingPDF: React.FC<BullyingHarassmentTrainingPDFProps> = ({ data, logo }) => {
  // Normalize data access
  const formData = data?.data || data;
  const staff = data?.staff || {};
  const staffSignature = data?.staffSignature;
  const staffSignedAt = data?.staffSignedAt;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-AU');
    } catch {
      return dateString;
    }
  };

  const staffName = formData.name || `${staff.firstName || ''} ${staff.surname || ''}`.trim();

  return (
    <BasePDFLayout
      title="Bullying and Harassment Training 2023"
      logo={logo}
      meta={{
        website: 'infinitysupportswa.org',
        formId: 'BHT-2023',
        reviewDate: '01/03/2025'
      }}
    >
      {/* Header Section */}
      <PDFSection title="Bullying and Harassment Training 2023" wrap={false}>
        <PDFParagraph bordered>
          This training provides staff with knowledge and understanding of bullying and harassment in the workplace, including prevention, identification, and appropriate response procedures.
        </PDFParagraph>
      </PDFSection>

      {/* Participant Information */}
      <PDFSection title="Participant Information" wrap={false}>
        <View style={styles.fieldContainer}>
          <PDFField label="Name" value={staffName} />
          <PDFField label="Position" value={formData.position} />
          <PDFField label="Department" value={formData.department} />
          <PDFField label="Training Date" value={formatDate(formData.trainingDate)} />
        </View>
      </PDFSection>

      {/* Training Modules Completed */}
      {formData.modulesCompleted && Array.isArray(formData.modulesCompleted) && formData.modulesCompleted.length > 0 && (
        <PDFSection title="Training Modules Completed" wrap={false}>
          <View style={styles.listContainer}>
            {formData.modulesCompleted.map((module: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{module}</Text>
              </View>
            ))}
          </View>
        </PDFSection>
      )}

      {/* Understanding Questions */}
      {formData.understandingQuestions && (
        <PDFSection title="Understanding Check" wrap={false}>
          <View style={styles.questionsContainer}>
            {Object.entries(formData.understandingQuestions).map(([question, answer], index) => (
              <View key={index} style={styles.questionItem} wrap={false}>
                <Text style={styles.questionText}>{question}</Text>
                <Text style={styles.answerText}>{String(answer)}</Text>
              </View>
            ))}
          </View>
        </PDFSection>
      )}

      {/* Key Learnings */}
      {formData.keyLearnings && (
        <PDFSection title="Key Learnings" wrap={false}>
          <PDFParagraph bordered>
            {formData.keyLearnings}
          </PDFParagraph>
        </PDFSection>
      )}

      {/* Assessment Results */}
      {formData.assessmentScore && (
        <PDFSection title="Assessment Results" wrap={false}>
          <View style={styles.fieldContainer}>
            <PDFField label="Score" value={`${formData.assessmentScore}%`} />
            <PDFField label="Status" value={formData.assessmentStatus} />
            {formData.assessmentDate && (
              <PDFField label="Assessment Date" value={formatDate(formData.assessmentDate)} />
            )}
          </View>
        </PDFSection>
      )}

      {/* Comments */}
      {formData.comments && (
        <PDFSection title="Additional Comments" wrap={false}>
          <PDFParagraph bordered>
            {formData.comments}
          </PDFParagraph>
        </PDFSection>
      )}

      {/* Signature Section */}
      <PDFSection title="Training Acknowledgement" wrap={false}>
        <Text style={styles.acknowledgementText}>
          I acknowledge that I have completed the Bullying and Harassment Training and understand the key concepts and procedures covered.
        </Text>
        <PDFField label="Name" value={staffName} fullWidth />
        <PDFSignatureBlock
          label="Signature"
          image={staffSignature}
          date={staffSignedAt}
        />
      </PDFSection>
    </BasePDFLayout>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    gap: 8,
  },
  listContainer: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    fontSize: 10,
    color: '#1f2937',
  },
  listText: {
    fontSize: 10,
    color: '#1f2937',
    flex: 1,
  },
  questionsContainer: {
    gap: 10,
  },
  questionItem: {
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 10,
    color: '#4b5563',
  },
  acknowledgementText: {
    fontSize: 10,
    color: '#1f2937',
    marginBottom: 12,
  },
});

export default BullyingHarassmentTrainingPDF;

