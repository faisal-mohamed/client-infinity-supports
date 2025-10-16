import { NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Simple test component to isolate the issue
const SimplePersonCentredPlanPDF = ({ formData, settings, logoDataUrl }: any) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 50,
      paddingTop: 40,
      paddingBottom: 20,
      fontFamily: 'Helvetica',
      fontSize: 11,
      lineHeight: 1.4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      paddingBottom: 20,
      marginBottom: 30,
      height: 80,
    },
    headerLogo: {
      width: 200,
      height: 60,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      backgroundColor: '#ffffff',
      paddingTop: 10,
      fontSize: 10,
      height: 30,
    },
    footerText: {
      fontSize: 10,
      color: '#666666',
    },
    content: {
      flex: 1,
      paddingHorizontal: 0,
    },
    section: {
      marginBottom: 20,
      breakInside: 'avoid',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#000000',
    },
    fieldRow: {
      flexDirection: 'row',
      marginBottom: 10,
      alignItems: 'flex-start',
      breakInside: 'avoid',
      gap: 10,
    },
    label: {
      width: 150,
      fontWeight: 'bold',
      fontSize: 9,
      color: '#374151',
    },
    value: {
      flex: 1,
      fontSize: 9,
      color: '#111827',
    },
  });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Image src={logoDataUrl} style={styles.headerLogo} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSON CENTRED PLAN</Text>
            <Text style={styles.sectionTitle}>Test Version - Simple Layout</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Personal Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{formData?.name || 'Test User'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{formData?.dob || '1990-01-01'}</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{formData?.address || '123 Test Street'}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Support Information:</Text>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>PBS Support Plan:</Text>
              <Text style={styles.value}>No</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Restrictive Practices:</Text>
              <Text style={styles.value}>No</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Organization:</Text>
              <Text style={styles.value}>Stigmata Techno Solutions</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>www.infinitysupportswa.org</Text>
          <Text style={styles.footerText}>PCP-001</Text>
          <Text style={styles.footerText}>Date: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export async function GET() {
  const sampleData = {
    name: 'Test User',
    dob: '1990-01-01',
    address: '123 Test Street',
  };

  const pdfDoc = React.createElement(SimplePersonCentredPlanPDF, {
    formData: sampleData,
    settings: {
      person_centred_plan: 'PCP-001',
      review_date: new Date().toISOString(),
    },
    logoDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // Placeholder
  });

  const pdfBuffer = await renderToBuffer(pdfDoc);
  const base64PDF = pdfBuffer.toString("base64");

  return new NextResponse(
    `
    <html>
      <body>
        <h1>Simple Person Centred Plan Test</h1>
        <p>This is a simplified version to test if the basic layout works without text overlap.</p>
        <iframe
          src="data:application/pdf;base64,${base64PDF}"
          width="100%"
          height="800px"
        ></iframe>
      </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}

