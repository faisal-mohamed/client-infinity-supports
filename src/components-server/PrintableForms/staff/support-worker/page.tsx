import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import Page1 from './page_1';
import Page2 from './page_2';
import Page3 from './page_3';
import Page4 from './page_4';
import Page5 from './page_5';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    position: 'absolute',
    top: 25,
    left: 40,
    right: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLogo: {
    width: 140,
    height: 45,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
  },
});

interface SupportWorkerPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
  showBlankAcknowledgement?: boolean;
}

const SupportWorkerPDF: React.FC<SupportWorkerPDFProps> = ({ 
  data = {}, 
  staff = {}, 
  settings = {},
  images = {},
  showBlankAcknowledgement = false
}) => {
  console.log('🔍 [PDF COMPONENT] ========== SupportWorkerPDF Component Called ==========');
  console.log('  - This is the React-PDF component from: @/components-server/PrintableForms/staff/support-worker/page');
  console.log('  - Component is being rendered by React.createElement');
  console.log('  - This component will be converted to PDF by renderToBuffer');
  console.log('  - Props received:', {
    hasData: !!data,
    hasStaff: !!staff,
    hasSettings: !!settings,
    hasImages: !!images,
    showBlank: showBlankAcknowledgement
  });

  // Footer data from settings ONLY - no hardcoded defaults
  const footerWebsite = settings?.website;
  const footerId = settings?.support_worker_form_id;
  const footerDate = settings?.support_worker_review_date;
  const hasFooterData = footerWebsite || footerId || footerDate;

  // Get logo image
  const headerLogoSrc = images?.fullLogo || '/client_full_logo.jpg';

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <Image 
        src={headerLogoSrc} 
        style={styles.headerLogo} 
      />
    </View>
  );

  // Render footer - Only if settings exist
  const renderFooter = () => {
    if (!hasFooterData) return null;
    
    return (
      <View style={styles.footer}>
        {footerWebsite && <Text style={styles.footerText}>Website: {footerWebsite}</Text>}
        {footerId && <Text style={styles.footerText}>{footerId}</Text>}
        {footerDate && <Text style={styles.footerText}>Review Date: {footerDate}</Text>}
      </View>
    );
  };

  return (
    <Document>
      {/* PAGE 1: POSITION DESCRIPTION */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page1 data={data} />
        {renderFooter()}
      </Page>

      {/* PAGE 2: SPECIFIC RESPONSIBILITIES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page2 />
        {renderFooter()}
      </Page>

      {/* PAGE 3: HEALTH & SAFETY */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page3 />
        {renderFooter()}
      </Page>

      {/* PAGE 4: QUALIFICATIONS & ATTRIBUTES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page4 />
        {renderFooter()}
      </Page>

      {/* PAGE 5: EMPLOYEE ACKNOWLEDGEMENT */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page5 data={data} staff={staff} showBlankForm={showBlankAcknowledgement} />
        {renderFooter()}
      </Page>
    </Document>
  );
};

export default SupportWorkerPDF;

