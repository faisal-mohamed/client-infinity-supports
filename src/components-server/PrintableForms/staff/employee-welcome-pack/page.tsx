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
import Page6 from './page_6';
import Page7 from './page_7';
import Page8 from './page_8';
import Page9 from './page_9';
import Page10 from './page_10';
import Page11 from './page_11';
import Page12 from './page_12';
import Page13 from './page_13';
import Page14 from './page_14';
import Page15 from './page_15';
import Page16 from './page_16';
import Page17 from './page_17';
import Page18 from './page_18';
import Page19 from './page_19';
import Page20 from './page_20';
import Page21 from './page_21';
import Page22 from './page_22';
import Page23 from './page_23';
import Page24 from './page_24';
import Page25 from './page_25';
import Page26 from './page_26';
import Page27 from './page_27';
import Page28 from './page_28';
import Page29 from './page_29';
import Page30 from './page_30';
import Page31 from './page_31';
import Page32 from './page_32';
import Page33 from './page_33';
import Page34 from './page_34';
import Page35 from './page_35';
import Page36 from './page_36';
import Page37 from './page_37';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 120,
    paddingBottom: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 180,
    height: 70,
    objectFit: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    borderTop: '1 solid #d1d5db',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
  },
});

interface EmployeeWelcomePackPDFProps {
  data?: any;
  staff?: any;
  settings?: any;
  images?: any;
  showBlankAcknowledgement?: boolean; // If true, page 37 will be blank for staff to fill
}

const EmployeeWelcomePackPDF: React.FC<EmployeeWelcomePackPDFProps> = ({ 
  data = {}, 
  staff = {}, 
  settings = {},
  images = {},
  showBlankAcknowledgement = false
}) => {
  console.log('🔍 [PDF] Employee Welcome Pack - Generating fixed-page PDF');

  // Footer data from settings only
  const footerWebsite = settings?.website;
  const footerId = settings?.employee_welcome_form_id;
  const footerDate = settings?.employee_welcome_review_date;
  const hasFooterData = footerWebsite || footerId || footerDate;

  // Get logo image - use base64 if available, otherwise use path for browser
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

  // Render footer (only if settings available)
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
      {/* PAGE 1: COVER */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page1 images={images} />
        {renderFooter()}
      </Page>

      {/* PAGE 2: ABOUT US */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page2 />
        {renderFooter()}
      </Page>

      {/* PAGE 3: VISION & MISSION */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page3 images={images} />
        {renderFooter()}
      </Page>

      {/* PAGE 4: VALUES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page4 images={images} />
        {renderFooter()}
      </Page>

      {/* PAGE 5: CONTENTS (PART 1) */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page5 />
        {renderFooter()}
      </Page>

      {/* PAGE 6: CONTENTS (PART 2) */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page6 />
        {renderFooter()}
      </Page>

      {/* PAGE 7: INTRODUCTION */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page7 />
        {renderFooter()}
      </Page>

      {/* PAGE 8: CODE OF CONDUCT */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page8 />
        {renderFooter()}
      </Page>

      {/* PAGE 9: JOINING THE ORGANISATION */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page9 images={images} />
        {renderFooter()}
      </Page>

      {/* PAGE 10: HOURS OF WORK & TRAINING */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page10 />
        {renderFooter()}
      </Page>

      {/* PAGE 11: INDUCTION & POLICIES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page11 />
        {renderFooter()}
      </Page>

      {/* PAGE 12: WORKPLACE POLICIES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page12 />
        {renderFooter()}
      </Page>

      {/* PAGE 13: MOBILE PHONE & DRESS CODE */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page13 />
        {renderFooter()}
      </Page>

      {/* PAGE 14: WHISTLEBLOWERS & EAP */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page14 />
        {renderFooter()}
      </Page>

      {/* PAGE 15: SALARIES AND WAGES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page15 />
        {renderFooter()}
      </Page>

      {/* PAGE 16: ANNUAL LEAVE & PUBLIC HOLIDAYS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page16 />
        {renderFooter()}
      </Page>

      {/* PAGE 17: PERSONAL LEAVE DETAILS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page17 />
        {renderFooter()}
      </Page>

      {/* PAGE 18: RETURN TO WORK & DISCIPLINARY INTRO */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page18 />
        {renderFooter()}
      </Page>

      {/* PAGE 19: DISCIPLINARY RULES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page19 />
        {renderFooter()}
      </Page>

      {/* PAGE 20: SERIOUS MISCONDUCT */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page20 />
        {renderFooter()}
      </Page>

      {/* PAGE 21: DURATION OF WARNINGS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page21 />
        {renderFooter()}
      </Page>

      {/* PAGE 22: GRIEVANCE & INCIDENT MANAGEMENT */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page22 />
        {renderFooter()}
      </Page>

      {/* PAGE 23: INCIDENT MANAGEMENT PROCEDURES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page23 />
        {renderFooter()}
      </Page>

      {/* PAGE 24: NOTIFIABLE INCIDENT REPORTING */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page24 />
        {renderFooter()}
      </Page>

      {/* PAGE 25: REPORTABLE INCIDENTS TO NDIS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page25 />
        {renderFooter()}
      </Page>

      {/* PAGE 26: REPORTING STEPS & TIMEFRAMES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page26 />
        {renderFooter()}
      </Page>

      {/* PAGE 27: FEEDBACK AND COMPLAINTS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page27 />
        {renderFooter()}
      </Page>

      {/* PAGE 28: COMPLAINT PROCEDURES */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page28 />
        {renderFooter()}
      </Page>

      {/* PAGE 29: COMPLAINT RESOLUTION */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page29 />
        {renderFooter()}
      </Page>

      {/* PAGE 30: COMPLAINT AGENCIES & DRUGS/ALCOHOL */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page30 />
        {renderFooter()}
      </Page>

      {/* PAGE 31: MEDICATION & SCREENING */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page31 />
        {renderFooter()}
      </Page>

      {/* PAGE 32: TERMINATION & BULLYING/HARASSMENT */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page32 />
        {renderFooter()}
      </Page>

      {/* PAGE 33: HARASSMENT DEFINITION */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page33 />
        {renderFooter()}
      </Page>

      {/* PAGE 34: BULLYING & COMPLAINT PROCEDURE */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page34 />
        {renderFooter()}
      </Page>

      {/* PAGE 35: FORMAL COMPLAINT PROCESS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page35 />
        {renderFooter()}
      </Page>

      {/* PAGE 36: IMPORTANT CONTACTS */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page36 />
        {renderFooter()}
      </Page>

      {/* PAGE 37: ACKNOWLEDGEMENT */}
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        <Page37 data={data} staff={staff} showBlankForm={showBlankAcknowledgement} />
        {renderFooter()}
      </Page>
    </Document>
  );
};

export default EmployeeWelcomePackPDF;

