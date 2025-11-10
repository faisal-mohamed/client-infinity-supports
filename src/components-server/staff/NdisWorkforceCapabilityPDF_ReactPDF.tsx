import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import BasePDFLayout from '@/components-server/pdf/layout/BasePDFLayout';
import PDFSection from '@/components-server/pdf/layout/PDFSection';
import PDFField from '@/components-server/pdf/elements/PDFField';
import PDFSignatureBlock from '@/components-server/pdf/elements/PDFSignatureBlock';
import PDFParagraph from '@/components-server/pdf/elements/PDFParagraph';

interface NdisWorkforceCapabilityPDFProps {
  data: any;
  logo?: string;
}

const NdisWorkforceCapabilityPDF: React.FC<NdisWorkforceCapabilityPDFProps> = ({ data, logo }) => {
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
      title="NDIS Workforce Capability Framework"
      logo={logo}
      meta={{
        website: 'infinitysupportswa.org',
        formId: 'NDIS-WCF',
        reviewDate: '01/03/2025'
      }}
    >
      {/* Header Section */}
      <PDFSection title="NDIS Workforce Capability Framework" wrap={false}>
        <PDFParagraph bordered>
          This form documents the NDIS Workforce Capability Framework understanding and compliance for staff members.
        </PDFParagraph>
      </PDFSection>

      {/* Staff Information */}
      <PDFSection title="Staff Information" wrap={false}>
        <View style={styles.fieldContainer}>
          <PDFField label="Name" value={staffName} />
          <PDFField label="Position" value={formData.position} />
          <PDFField label="Date" value={formatDate(formData.date)} />
        </View>
      </PDFSection>

      {/* Framework Understanding */}
      {formData.frameworkUnderstanding && (
        <PDFSection title="Framework Understanding" wrap={false}>
          <PDFParagraph bordered>
            {formData.frameworkUnderstanding}
          </PDFParagraph>
        </PDFSection>
      )}

      {/* Competency Areas */}
      {formData.competencyAreas && Array.isArray(formData.competencyAreas) && formData.competencyAreas.length > 0 && (
        <PDFSection title="Competency Areas" wrap={false}>
          <View style={styles.competencyContainer}>
            {formData.competencyAreas.map((area: any, index: number) => (
              <View key={index} style={styles.competencyItem} wrap={false}>
                <Text style={styles.competencyArea}>
                  {area.area || `Area ${index + 1}`}
                </Text>
                {area.description && (
                  <Text style={styles.competencyDescription}>
                    {area.description}
                  </Text>
                )}
                {area.status && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{area.status}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </PDFSection>
      )}

      {/* Training Completed */}
      {formData.trainingCompleted && (
        <PDFSection title="Training Completed" wrap={false}>
          <PDFParagraph bordered>
            {formData.trainingCompleted}
          </PDFParagraph>
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
      <PDFSection title="Staff Acknowledgement" wrap={false}>
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
  competencyContainer: {
    gap: 12,
  },
  competencyItem: {
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
  },
  competencyArea: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  competencyDescription: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 9,
    color: '#0369a1',
    fontWeight: 'bold',
  },
});

export default NdisWorkforceCapabilityPDF;

