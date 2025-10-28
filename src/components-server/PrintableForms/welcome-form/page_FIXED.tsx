import React from 'react';
import { format, parseISO, isValid } from "date-fns";
import Page1 from './page_1_FIXED';
import Page2 from './page_2_FIXED';
import Page3 from './page_3_FIXED';
import Page4 from './page_4_FIXED';
import Page5 from './page_5_FIXED';
import Page6 from './page_6_FIXED';
import Page7 from './page_7_FIXED';
import Page8 from './page_8_FIXED';
import Page9 from './page_9_FIXED';
import Page10 from './page_10_FIXED';
import Page11 from './page_11_FIXED';
import Page12 from './page_12_FIXED';
import Page13 from './page_13_FIXED';
import Page14 from './page_14_FIXED';
import Page15 from './page_15_FIXED';
import Page16 from './page_16_FIXED';
import Page17 from './page_17_FIXED';
import Page18 from './page_18_FIXED';
import Page19 from './page_19_FIXED';
import Page20 from './page_20_FIXED';
import Page21 from './page_21_FIXED';
import Page23 from './page_23_FIXED';
import Page22 from './page_22_FIXED';
import Page24 from './page_24_FIXED';
import Page25 from './page_25_FIXED';
import Page26 from './page_26_FIXED';

// ===== A4 PDF TYPOGRAPHY STANDARDS WITH MONTSERRAT =====
export const A4_PDF_TYPOGRAPHY = {
  // Main content hierarchy with improved line spacing
  title: 'text-base font-bold font-montserrat leading-relaxed',           // 16px - Form titles
  sectionHeader: 'text-sm font-semibold font-montserrat leading-relaxed', // 14px - Section headers
  subHeader: 'text-xs font-semibold font-montserrat leading-relaxed',     // 12px - Subsection headers
  body: 'text-xs font-normal font-montserrat leading-relaxed',            // 12px - Main content
  label: 'text-xs font-medium font-montserrat leading-relaxed',           // 12px - Field labels
  input: 'text-xs font-normal font-montserrat leading-relaxed',           // 12px - Input content
  small: 'text-xs font-normal font-montserrat leading-relaxed',           // 10px - Fine print
  footer: 'text-xs font-normal font-montserrat leading-normal',           // 10px - Footer content
  
  // Welcome form specific
  welcomeTitle: 'text-sm font-bold font-montserrat leading-relaxed',      // 14px - Welcome pack title
  welcomeSubtitle: 'text-xs font-normal font-montserrat leading-relaxed', // 12px - Subtitle
  aboutTitle: 'text-base font-bold font-montserrat leading-relaxed',      // 16px - About Us title
  aboutBody: 'text-sm font-normal font-montserrat leading-relaxed text-justify', // 14px - About content
  visionText: 'text-sm font-semibold font-montserrat leading-snug',       // 14px - Vision/Mission text
} as const;

// ===== PDF-SPECIFIC FONT STYLES =====
export const PDF_FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  .font-montserrat {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  /* Ensure consistent rendering across different environments */
  .pdf-container {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
` as const;

// ===== STANDARDIZED LOGO CONFIGURATION =====
export const STANDARD_LOGO = {
  width: 180,
  height: 72,
  className: "object-contain"
} as const;

// ===== FORM SCHEMA =====
export const formSchema: any = {
  title: 'Welcome Pack Receipt Acknowledgement',
  fields: [
    {
      key: 'acknowledgementStatement',
      type: 'static',
      content:
        'I confirm I have received the Welcome Pack from Infinity Supports and have read and understood the content.',
    },
    {
      key: 'printedPackStatement',
      type: 'static',
      content:
        'A printed version of the Welcome Pack is also available. If you would like a printed version, please contact us.',
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      key: 'signature',
      label: 'Signature',
      type: 'text',
    },
    {
      key: 'relationship',
      label: 'Relationship',
      type: 'text',
    },
    {
      key: 'date',
      label: 'Date',
      type: 'text',
    },
  ],
};

// ===== MAIN WELCOME FORM COMPONENT (First 15 Pages) =====
const WelcomeFormFixed = ({ formData, commonFieldsData, settings, images }: any) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1 settings={settings} images={images} />
      <Page2 settings={settings} images={images} />
      <Page3 settings={settings} images={images} />
      <Page4 settings={settings} images={images} />
      <Page5 settings={settings} images={images} />
      <Page6 settings={settings} images={images} />
      <Page7 settings={settings} images={images} />
      <Page8 settings={settings} images={images} />
      <Page9 settings={settings} images={images} />
      <Page10 settings={settings} images={images} />
      <Page11 settings={settings} images={images} />
      <Page12 settings={settings} images={images} />
      <Page13 settings={settings} images={images} />
      <Page14 settings={settings} images={images} />
      <Page15 settings={settings} images={images} />
      <Page16 settings={settings} images={images} />
      <Page17 settings={settings} images={images} />
      <Page18 settings={settings} images={images} />
      <Page19 settings={settings} images={images} />
      <Page20 settings={settings} images={images} />
      <Page21 settings={settings} images={images} />
      <Page22 settings={settings} images={images} />
      <Page23 settings={settings} images={images} />
      <Page24 settings={settings} images={images} />
      <Page25 settings={settings} images={images} />
      <Page26 schema={formSchema}  data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images}/>


    </div>
  );
};

export default WelcomeFormFixed;
