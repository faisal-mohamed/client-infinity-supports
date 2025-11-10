import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';

export interface PDFMeta {
  website: string;
  version: string;
  reviewDate?: string;
}

interface BasePDFLayoutProps {
  title: string;
  logo?: string | null;
  meta: PDFMeta;
  children: React.ReactNode;
}

const BasePDFLayout: React.FC<BasePDFLayoutProps> = ({ title, logo, meta, children }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.headerContent}>
            {logo ? (
              <Image src={logo} style={styles.logo} />
            ) : (
              <Text style={styles.logoFallback}>{title}</Text>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>

        <View style={styles.content}>{children}</View>

        <View style={styles.footer} fixed>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{meta.website}</Text>
            <Text style={styles.footerText}>{meta.version}</Text>
            {meta.reviewDate && (
              <Text style={styles.footerText}>Review Date: {meta.reviewDate}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 110,
    paddingBottom: 70,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 30,
    right: 30,
    borderBottom: '2 solid #333',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 180,
    height: 60,
    objectFit: 'contain',
  },
  logoFallback: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    borderTop: '2 solid #333',
    paddingTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#4b5563',
  },
  pageNumber: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },
});

export default BasePDFLayout;
