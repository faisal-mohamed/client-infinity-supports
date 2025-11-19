import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import { PDF_FONT_SIZES, PDF_SPACING, PDF_LINE_HEIGHTS, PDF_COLORS, PDF_FONT_FAMILY, PDF_FONT_FAMILY_BOLD } from '../styles/commonPDFStyles';

export interface PDFMeta {
  website: string;
  version: string;
  reviewDate?: string;
}

interface BasePDFLayoutProps {
  title: string;
  logo?: string | null;
  meta?: PDFMeta;
  children: React.ReactNode;
}

const BasePDFLayout: React.FC<BasePDFLayoutProps> = ({ title, logo, meta, children }) => {
  // Only show footer if meta data exists (from settings API)
  const hasFooterData = meta && (meta.website || meta.version || meta.reviewDate);
  
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

        {hasFooterData && (
          <View style={styles.footer} fixed>
            <View style={styles.footerRow}>
              {meta.website && <Text style={styles.footerText}>Website: {meta.website}</Text>}
              {meta.version && <Text style={styles.footerText}>{meta.version}</Text>}
              {meta.reviewDate && (
                <Text style={styles.footerText}>Review Date: {meta.reviewDate}</Text>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: PDF_COLORS.background,
    padding: PDF_SPACING.pagePadding,
    paddingTop: PDF_SPACING.pagePaddingTop,
    paddingBottom: PDF_SPACING.pagePaddingBottom,
    fontFamily: PDF_FONT_FAMILY,
    fontSize: PDF_FONT_SIZES.body,
    lineHeight: PDF_LINE_HEIGHTS.body,
  },
  header: {
    position: 'absolute',
    top: 15,
    left: PDF_SPACING.pagePadding,
    right: PDF_SPACING.pagePadding,
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
    fontSize: PDF_FONT_SIZES.title,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
  },
  title: {
    fontSize: PDF_FONT_SIZES.title,
    fontWeight: 'bold',
    fontFamily: PDF_FONT_FAMILY_BOLD,
    textAlign: 'center',
    color: PDF_COLORS.text,
    lineHeight: PDF_LINE_HEIGHTS.title,
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: PDF_SPACING.pagePadding,
    right: PDF_SPACING.pagePadding,
    borderTop: '2 solid #333',
    paddingTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  footerText: {
    fontSize: PDF_FONT_SIZES.footer,
    color: PDF_COLORS.textMuted,
    lineHeight: PDF_LINE_HEIGHTS.small,
  },
  pageNumber: {
    fontSize: PDF_FONT_SIZES.footer,
    textAlign: 'center',
    color: PDF_COLORS.textMuted,
  },
});

export default BasePDFLayout;
