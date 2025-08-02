import React from 'react'
import Page1 from './page_1_FIXED'
import Page2 from './page_2_FIXED'
import Page3 from './page_3_FIXED'

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
  
  // Table specific
  tableHeader: 'text-xs font-bold font-montserrat leading-tight',         // 12px - Table headers
  tableCell: 'text-xs font-normal font-montserrat leading-relaxed',       // 12px - Table content
  
  // Signature section
  signatureLabel: 'text-xs font-semibold font-montserrat leading-relaxed', // 12px - Signature labels
  signatureContent: 'text-xs font-bold font-montserrat leading-relaxed',   // 12px - Signature content
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

export const formSchema = {
  page1: {
     tableRows: [
    { key: "row0", description: '01_049_0107_1_1 Establishment Fee', cost: '$675.60' },
    { key: "row1", description: '01_013_0107_1_1 Assistance with Self-care weekday daytime', cost: '$67.56' },
    { key: "row2", description: '01_015_0107_1_1 Assistance with Self-care weekday Evening', cost: '$74.44' },
    { key: "row3", description: '01_013_0107_1_1 Assistance with Self-care Saturday', cost: '$95.07' },
    { key: "row4", description: '01_014_0107_1_1 Assistance with Self-care Sunday', cost: '$122.59' },
    { key: "row5", description: '01_012_0107_1_1 Assistance with Self-care Public Holiday', cost: '$150.10' },
    { key: "row6", description: '04_104_0125_6_1 Access Community and Rec weekday', cost: '$67.56' },
    { key: "row7", description: '04_105_0125_6_1 Access community and Rec Saturday', cost: '$95.07' },
    { key: "row8", description: '04_106_0125_6_1 Access Community and Rec Sunday', cost: '$122.59' },
    { key: "row9", description: '04_102_0125_6_1 Access Community and Rec Public Holiday', cost: '$150.10' },
    { key: "row10", description: '01_016_0104_1_1 Specialised Home-based care for a child', cost: '$57.23' },
    { key: "row11", description: '09-009-0117-6-3 Skill Development and Training 15_037_0117_1_3', cost: '$77.00' },
    {
      key: "row12",
      description: '04-590-0125-6-1 Activity based Transport',
      cost: '$1 Per km',
      isPerKm: true
    },
    { key: "row13", description: '01_013_0107_1_1 Non-Face-to-Face', cost: '$67.56' },
    { key: "row14", description: '01-002-0107-1-1 Provider Travel', cost: '$16.89' },
    { key: "row15", description: '04-104-0125-6-1 Provider Travel', cost: '$16.89' }
  ]
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
