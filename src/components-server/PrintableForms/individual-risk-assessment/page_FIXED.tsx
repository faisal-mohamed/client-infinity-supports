import React from 'react'
import Page1 from './page_1_FIXED';
import Page2 from './page_2_FIXED';
import Page3 from './page_3_FIXED';

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
    headerInfo: [
      { key: 'personName', label: "Person's Name", type: 'text' },
      { key: 'activity', label: 'Activity', type: 'text' },
      { key: 'assessorName', label: "Assessor's Name", type: 'text' },
      { key: 'date', label: 'Date', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' }
    ]
  },
  page2: {
    riskTable: [
      { key: 'risk_1', label: 'Risk Row 1', type: 'group', fields: ['riskIdentified_1', 'likelihood_1', 'severity_1', 'controls_1'] },
      { key: 'risk_2', label: 'Risk Row 2', type: 'group', fields: ['riskIdentified_2', 'likelihood_2', 'severity_2', 'controls_2'] },
      { key: 'risk_3', label: 'Risk Row 3', type: 'group', fields: ['riskIdentified_3', 'likelihood_3', 'severity_3', 'controls_3'] },
      { key: 'risk_4', label: 'Risk Row 4', type: 'group', fields: ['riskIdentified_4', 'likelihood_4', 'severity_4', 'controls_4'] },
      { key: 'risk_5', label: 'Risk Row 5', type: 'group', fields: ['riskIdentified_5', 'likelihood_5', 'severity_5', 'controls_5'] },
      { key: 'risk_6', label: 'Risk Row 6', type: 'group', fields: ['riskIdentified_6', 'likelihood_6', 'severity_6', 'controls_6'] }
    ]
  },
  page3: {
    fields: [
      { key: 'additionalSupport', label: 'Additional Support Requirements', type: 'textarea' },
      { key: 'reviewDate', label: 'Assessment Review Date', type: 'text' },
      { key: 'assessorSignature', label: "Assessor's Signature", type: 'text' }
    ]
  }
};

const IndividualRiskAssessment = ({formKey, formData, commonFieldsData, settings, images} : any ) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1
        schema={formSchema.page1}
        data={formData}
        commonFieldsData={commonFieldsData}
        settings={settings}
        images={images}
      />
      <Page2
        schema={formSchema.page2}
        data={formData}
        commonFieldsData={commonFieldsData}
        settings={settings}
        images={images}
      />
      <Page3
        schema={formSchema.page3}
        data={formData}
        commonFieldsData={commonFieldsData}
        settings={settings}
        images={images}
      />
    </div>
  )
}

export default IndividualRiskAssessment
