import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import PdfCheckbox from "../shared/PdfCheckbox";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 48,
    paddingTop: 80,
    paddingBottom: 50, // Increased to make room for footer
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    position: "absolute",
    top: 24,
    left: 48,
    right: 48,
    alignItems: "center",
    marginBottom: 24,
  },
  headerLogo: {
    width: 140,
    height: 45,
    objectFit: "contain",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 16,
    textAlign: "left",
  },
  acknowledgementBox: {
    border: "1 solid #d1d5db",
    padding: 14,
    marginTop: 12,
    marginBottom: 28,
    backgroundColor: "#f9fafb",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxWrapper: {
    marginRight: 8,
    marginTop: 2,
    width: 12,
    height: 12,
  },
  checkboxText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 1.5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: "bold",
  },
  fieldLine: {
    borderBottom: "1 dotted #111827",
    minHeight: 24,
    paddingBottom: 4,
    paddingLeft: 4,
    justifyContent: "flex-end",
  },
  fieldValue: {
    fontSize: 11,
  },
  signatureBox: {
    minHeight: 60,
    border: "1 dotted #111827",
    padding: 6,
    justifyContent: "center",
  },
  signatureImage: {
    width: "100%",
    height: 50,
    objectFit: "contain",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 9,
    color: "#6b7280",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 9,
    color: "#6b7280",
  },
});

interface OrientationPDFProps {
  data?: any;
  settings?: any;
  images?: any;
}

const formatDate = (value?: string) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.warn("[Orientation PDF] Failed to format date:", value, error);
    return value;
  }
};

const OrientationPDF: React.FC<OrientationPDFProps> = ({ 
  data = {}, 
  settings = {},
  images = {}
}) => {
  const logo =
    images?.infinityLogo ||
    data?.settings?.logoDataUrl ||
    data?.logoDataUrl ||
    data?.data?.logoDataUrl ||
    "/infinity_logo.png";

  const formData = data?.data ?? {};
  const staff = formData.staff ?? data?.staff ?? {};

  const staffName =
    formData.staffName ||
    formData.employeeName ||
    `${staff.firstName || ""} ${staff.surname || ""}`.trim();

  const signature =
    formData.signature ||
    formData.staffSignature ||
    formData.orientationSignature ||
    data?.staffSignature ||
    "";

  const dateValue =
    formData.date ||
    formData.acknowledgedAt ||
    formData.staffSignedAt ||
    formData.staffSignatureDate ||
    data?.staffSignedAt ||
    data?.date ||
    "";

  const acknowledged =
    formData.acknowledged ??
    formData.orientationAcknowledged ??
    formData.readOrientation ??
    false;

  // Footer data from settings
  const footerWebsite = settings?.website || settings?.company_website;
  const footerId = settings?.orientation_form_id;
  const footerDate = settings?.orientation_review_date || settings?.review_date;
  const hasFooterData = footerWebsite || footerId || footerDate;
  
  console.log('🔍 [Orientation PDF] Footer data:', {
    hasSettings: !!settings,
    settingsKeys: Object.keys(settings || {}),
    footerWebsite,
    footerId,
    footerDate,
    hasFooterData,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {logo && (
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.headerLogo} />
          </View>
        )}

        <Text style={styles.title}>Staff Orientation – Acknowledgement</Text>

        <Text style={styles.paragraph}>
          I confirm that I have received, read, and understood the Infinity Supports
          WA Staff Orientation Handbook, including workplace expectations, policies,
          procedures, and safety requirements outlined within the document.
        </Text>

        <Text style={styles.paragraph}>
          I understand it is my responsibility to seek clarification if I have any
          questions, comply with organisational requirements, and follow all
          processes described to ensure safe and high-quality support for the people
          we serve.
        </Text>

        <View style={styles.acknowledgementBox}>
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxWrapper}>
              <PdfCheckbox checked={acknowledged} size={12} mark="X" />
            </View>
            <Text style={styles.checkboxText}>
              <Text style={{ fontWeight: "bold" }}>I acknowledge that:</Text>
              {"\n"}• I have received the Staff Orientation Handbook from Infinity
              Supports WA{"\n"}• I have read and understood the content{"\n"}• I will
              comply with the policies, procedures, and safety expectations described
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Name</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{staffName}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Signature</Text>
          <View style={styles.signatureBox}>
            {signature ? (
              <Image src={signature} style={styles.signatureImage} />
            ) : (
              <Text style={styles.fieldValue}> </Text>
            )}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Date</Text>
          <View style={styles.fieldLine}>
            <Text style={styles.fieldValue}>{formatDate(dateValue)}</Text>
          </View>
        </View>

        {hasFooterData && (
          <View style={styles.footer} fixed>
            {footerWebsite && <Text style={styles.footerText}>Website: {footerWebsite}</Text>}
            {footerId && <Text style={styles.footerText}>{footerId}</Text>}
            {footerDate && <Text style={styles.footerText}>Review Date: {footerDate}</Text>}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default OrientationPDF;

