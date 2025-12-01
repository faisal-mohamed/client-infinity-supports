import React from 'react'
import Page1 from './page_1_COMPACT'
import Page2 from './page_2_FIXED'
import Page3 from './page_3_FIXED'

// ===== A4 PDF TYPOGRAPHY STANDARDS WITH MONTSERRAT =====
export const A4_PDF_TYPOGRAPHY = {
  // Main content hierarchy with improved line spacing
  title: 'text-[10px] font-bold font-montserrat leading-relaxed',           // 16px - Form titles
  sectionHeader: 'text-[10px] font-semibold font-montserrat leading-relaxed', // 14px - Section headers
  subHeader: 'texts font-semibold font-montserrat leading-relaxed',     // 12px - Subsection headers
  body: 'text-[10px] font-normal font-montserrat leading-relaxed',            // 12px - Main content
  label: 'text-[10px] font-medium font-montserrat leading-relaxed',           // 12px - Field labels
  input: 'text-[10px] font-normal font-montserrat leading-relaxed',           // 12px - Input content
  small: 'text-[10px] font-normal font-montserrat leading-relaxed',           // 10px - Fine print
  footer: 'text-[10px] font-normal font-montserrat leading-normal',           // 10px - Footer content
  
  // Table specific - optimized for space
  tableHeader: 'text-[8px] font-bold font-montserrat leading-none',         // Reduced from 10px
  tableCell: 'text-[8px] font-normal font-montserrat leading-none',       // Reduced from 10px
  
  // Signature section
  signatureLabel: 'text-[10px] font-semibold font-montserrat leading-relaxed', // 12px - Signature labels
  signatureContent: 'text-[10px] font-bold font-montserrat leading-relaxed',   // 12px - Signature content
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
  width: 140,
  height: 56,
  className: "object-contain"
} as const;

export const formSchema = {
  page1: {
     tableRows :  [
  { key: "row0", description: '01_049_0107_1_1 Establishment Fee', cost: '$702.30' },
  { key: "row1", description: '01_013_0107_1_1 Assistance with Self-care weekday daytime', cost: '$70.23' },
  { key: "row2", description: '01_015_0107_1_1 Assistance with Self-care weekday Evening', cost: '$77.38' },
  { key: "row3", description: '01_013_0107_1_1 Assistance with Self-care Saturday', cost: '$98.83' },
  { key: "row4", description: '01_014_0107_1_1 Assistance with Self-care Sunday', cost: '$127.43' },
  { key: "row5", description: '01_012_0107_1_1 Assistance with Self-care Public Holiday', cost: '$156.03' },
  { key: "row6", description: '01_016_0104_1_1 Specialised Home-based care for a child', cost: '$59.06' },
  { key: "row7", description: '01_400_0104_1_1 Assistance with Self-Care Activities - High Intensity - Weekday Daytime', cost: '$75.98' },
  { key: "row8", description: '04_104_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Daytime', cost: '$70.23' },
  { key: "row9", description: '04_103_0125_6_1 Access Community Social and Rec Activ - Standard - Weekday Evening', cost: '$77.38' },
  { key: "row10", description: '04_105_0125_6_1 Access community and Rec Saturday', cost: '$98.83' },
  { key: "row11", description: '04_106_0125_6_1 Access Community and Rec Sunday', cost: '$127.43' },
  { key: "row12", description: '04_102_0125_6_1 Access Community and Rec Public Holiday', cost: '$156.03' },
  { key: "row13", description: '09-009-0117-6-3 Skill Development and Training', cost: '$80.06' },
  { key: "row14", description: '15_037_0117_1_3 Skill Development and Training including Public Transport training', cost: '$70.23' },
  {
    key: "row15",
    description: '04-590-0125-6-1 Activity based Transport',
    cost: '$1 Per km',
    isPerKm: true
  },
  { key: "row16", description: '01-002-0107-1-1 Provider Travel', cost: '$70.23' },
  { key: "row17", description: '04-104-0125-6-1 Provider Travel', cost: '$70.23' }
],
  },
  page2: {
    checkboxes: [
      {
        key: "transportOption1",
        label: "Transport Services provided to the value of [transportValue1]. Anything over this amount will be: [transportOver1]."
      },
      {
        key: "transportOption2",
        label: "For Transport Services provided to the value of [transportValue2]. Anything over this amount will be: [transportOver2]."
      },
      {
        key: "transportOption3",
        label: "For any transport services provided. Infinity Supports WA will send the Individual/Plan Manager an invoice for those supports."
      },
      {
        key: "establishmentFeeAgreement",
        label: "If you are a new participant to NDIS or Infinity Supports WA, you will be charged $654.70 as per the NDIS Price Guide."
      },
      {
        key: "agreeNonFaceToFace",
        label: "I agree to Infinity Supports Non-Face-to-Face charges as above."
      }
    ]
  },
  page3: {
    fields: [
    {
      key: 'providerTravelAgreement',
      type: 'checkbox',
      label: 'I agree to Infinity Supports WA charging 15 minutes Provider Travel per day.',
    },
    {
      key: 'participantSignatureDate',
      type: 'date',
      label: 'Signature of participant – Date',
    },
    {
      key: 'participantName',
      type: 'text',
      label: 'Participant Name',
    },
    {
      key: 'nomineeSignatureDate',
      type: 'date',
      label: 'Signature of Nominee – Date',
    },
    {
      key: 'nomineeName',
      type: 'text',
      label: 'Nominee Name',
    },
    {
      key: 'representativeSignatureDate',
      type: 'date',
      label: 'Signature of Infinity Support WA Representative – Date',
    }
  ]
}
};

const ScheduleOfSupports = ({formData, settings, commonFieldsData, images} : any ) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1 formData={formData} schema={formSchema.page1} commonFieldsData={commonFieldsData} settings={settings} images={images} />
      <Page2 formData={formData} schema={formSchema.page2} commonFieldsData={commonFieldsData} settings={settings} images={images}/>
      <Page3 data={formData} schema={formSchema.page3} commonFieldsData={commonFieldsData} settings={settings} images={images} />
    </div>
  )
}

export default ScheduleOfSupports
