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
  
  console.log('📄 [BasePDFLayout] Rendering PDF:', {
    title,
    hasLogo: !!logo,
    hasFooter: hasFooterData,
    footerData: meta,
  });
  
  return (
    <Document>
      {/* Single Page component - React-PDF will automatically create multiple pages when content overflows */}
      <Page size="A4" style={styles.page}>
        {/* Fixed Header - appears on ALL pages automatically */}
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

        {/* Content - wrap={true} allows natural page breaks and automatic page creation */}
        <View style={styles.content} wrap={true}>
          {children}
        </View>

        {/* Fixed Footer - appears on ALL pages automatically */}
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
    zIndex: 1, // Ensure header is above content
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
    // Header is at top: 15px, extends to ~115px (logo 60px + gap 8px + title ~20px + padding 10px + border 2px)
    // Page paddingTop is 110px, so content starts at 110px
    // Header extends to 115px, so we need at least 5px more margin, but add safety margin
    marginTop: 20, // Additional space after page padding to clear header (header extends to ~115px, content starts at 110px)
    marginBottom: 50, // Reserve space for fixed footer (footer height ~30px + padding + safety margin)
    minHeight: 0, // Allow flex to work properly
    // Note: React-PDF doesn't support overflow: hidden, so we rely on proper margins
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: PDF_SPACING.pagePadding,
    right: PDF_SPACING.pagePadding,
    borderTop: '2 solid #333',
    paddingTop: 8,
    zIndex: 1, // Ensure footer is above content
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
