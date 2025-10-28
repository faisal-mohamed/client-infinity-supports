import React from 'react';
import Page1 from './page1_FIXED';
import Page2 from './page2_FIXED';
import Page3 from './page3_FIXED';
import Page4 from './page4_FIXED';
import Page5 from './page5_FIXED';
import Page6 from './page6_FIXED';
import Page7 from './page7_FIXED';

// ===== A4 PDF TYPOGRAPHY STANDARDS WITH MONTSERRAT =====
export const A4_PDF_TYPOGRAPHY = {
  // Main content hierarchy with proper line spacing
  title: 'text-base font-bold font-montserrat leading-relaxed',           // 16px - Form titles
  sectionHeader: 'text-sm font-semibold font-montserrat leading-relaxed', // 14px - Section headers
  subHeader: 'text-xs font-semibold font-montserrat leading-relaxed',     // 12px - Subsection headers
  body: 'text-xs font-normal font-montserrat leading-relaxed',            // 12px - Main content
  label: 'text-xs font-medium font-montserrat leading-relaxed',           // 12px - Field labels
  input: 'text-xs font-normal font-montserrat leading-relaxed',           // 12px - Input content
  small: 'text-xs font-normal font-montserrat leading-relaxed',           // 12px - Fine print
  footer: 'text-xs font-normal font-montserrat leading-normal',           // 12px - Footer content
  
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

const formSchema: any = {
  page1: {
    title: "Service Agreement Support Coordination - Section 1",
    fields: [
      { key: "date", label: "Date", type: "date" },
      { key: "surname", label: "Surname", type: "text" },
      { key: "givenNames", label: "Given name(s)", type: "text" },
      {
        key: "sex",
        label: "Sex",
        type: "radio",
        options: ["Male", "Female", "Prefer not to say", "Others"]
      },
      { key: "pronoun", label: "Pronoun", type: "text" },
      {
        key: "indigenousDescent",
        label: "Are you of Aboriginal or Torres Strait Islander descent?",
        type: "radio",
        options: ["Yes", "No"]
      },
      { key: "preferredName", label: "Preferred name", type: "text" },
      { key: "dob", label: "Date of Birth", type: "date" },
      { key: "address", label: "Number / Street", type: "text" },
      { key: "state", label: "State", type: "text", default: "WA" },
      { key: "postcode", label: "Postcode", type: "text" },
      { key: "email", label: "Email address", type: "email" },
      { key: "homePhone", label: "Home Phone No", type: "text" },
      { key: "mobile", label: "Mobile No", type: "text" },
      {
        key: "noCopyRequested",
        label: "Participant may wish not to receive a copy of this agreement",
        type: "checkbox"
      },
      {
        key: "planAttached",
        label: "A copy of the Individual's plan is attached",
        type: "checkbox"
      },
      {
        key: "planNotAttached",
        label: "Individual chooses not to attach their plan",
        type: "checkbox"
      }
    ]
  },
  page2: {
    title: "Schedule of Support",
    fields: [
      {
        key: "scheduleTable",
        label: "Schedule of Supports",
        type: "table",
        columns: [
          { key: "supportCategory", label: "Support Category", type: "text" },
          { key: "weeks", label: "Weeks", type: "text" },
          { key: "totalHours", label: "Total Hours", type: "text" },
          { key: "costPerHour", label: "Cost per hr", type: "currency" },
          { key: "totalCost", label: "Total Cost", type: "currency" }
        ]
      },
      {
        key: "conflictDeclaration",
        label: "Conflict of Interest Declaration",
        type: "text"
      },
      {
        key: "conflictOptions",
        label: "Conflict of Interest - Providers Considered",
        type: "list",
        itemType: "text"
      }
    ]
  },
  page3: {
    title: "Infinity Supports WA Service Agreement - Page 3",
    fields: [
      { key: "signature", label: "Signed", type: "signature" },
      { key: "printName", label: "Print Name", type: "text" },
      { key: "signDate", label: "Date", type: "date" },
      { key: "selfManaged", label: "Self-managed funding", type: "checkbox" },
      { key: "nomineeManaged", label: "Nominee managed funding", type: "checkbox" },
      { key: "ndiaManaged", label: "NDIA managed funding", type: "checkbox" },
      { key: "planManagerManaged", label: "Plan Manager managed funding", type: "checkbox" },
      { key: "planManagerName", label: "Plan Manager Name", type: "text" },
      { key: "planManagerEmail", label: "Email", type: "email" }
    ]
  },
  page7: {
    title: "Consent Form",
    fields: [
      {
        key: "consentMedia",
        label: "Consent to use images on media and promotional content",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        key: "consentInfoShare",
        label: "Consent to obtain and share relevant documented information",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        key: "consentAudit",
        label: "Consent to take part in an NDIS audit and document review",
        type: "radio",
        options: ["Yes", "No"]
      },
      {
        key: "participantSignature",
        label: "Signature of participant",
        type: "signature"
      },
      {
        key: "participantDate",
        label: "Participant Date",
        type: "date"
      },
      {
        key: "participantName",
        label: "Participant Name",
        type: "text"
      },
      {
        key: "nomineeSignature",
        label: "Signature of Nominee",
        type: "signature"
      },
      {
        key: "nomineeDate",
        label: "Nominee Date",
        type: "date"
      },
      {
        key: "nomineeName",
        label: "Nominee Name",
        type: "text"
      },
      {
        key: "staffSignature",
        label: "Signature on behalf of Infinity Supports WA",
        type: "signature"
      },
      {
        key: "staffDate",
        label: "Staff Date",
        type: "date"
      },
      {
        key: "staffName",
        label: "Staff Name",
        type: "text"
      }
    ]
  }
};

const SASupportCoordination = ({ formKey, formData, settings, commonFieldsData, images }: any) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1 schema={formSchema.page1} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images} />
      <Page2 schema={formSchema.page2} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images} />
      <Page3 schema={formSchema.page3} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images} />
      <Page4 settings={settings} images={images} />
      <Page5 settings={settings} images={images} />
      <Page6 settings={settings} images={images} />
      <Page7 schema={formSchema.page7} data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images} />
    </div>
  );
};

export default SASupportCoordination;
