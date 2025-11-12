import React from 'react';
import { UnifiedFieldRenderer } from '../shared/UnifiedFieldRenderer';

const A4Page = ({ children, pageNumber, settings }: { children: React.ReactNode; pageNumber: number; settings?: any }) => (
  <div style={{
    width: '794px',
    minHeight: '1123px',
    height: 'auto',
    margin: '0 auto 20px',
    padding: '40px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    pageBreakAfter: "always",
    breakInside: 'auto',
    pageBreakInside: 'auto',
    position: 'relative',
    boxSizing: 'border-box'
  }}>
    {/* Header with logos */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px', 
      borderBottom: '2px solid #000', 
      paddingBottom: '15px' 
    }}>
      <div style={{ width: '80px', height: '60px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
        Logo 1
      </div>
      <div style={{ textAlign: 'center', flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#000' }}>
          CLIENT INTAKE FORM
        </h1>
      </div>
      <div style={{ width: '80px', height: '60px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
        Logo 2
      </div>
    </div>

    {/* Content */}
    <div style={{ minHeight: '800px' }}>
      {children}
    </div>

    {/* Footer */}
    <div style={{ 
      position: 'absolute', 
      bottom: '20px', 
      left: '40px', 
      right: '40px', 
      textAlign: 'center', 
      fontSize: '11px', 
      borderTop: '1px solid #ccc', 
      paddingTop: '10px',
      color: '#666'
    }}>
      {settings?.from_email || ''} | {settings?.client_intake_form_id || 'CIF-001'} | Review Date: {settings?.review_date ? new Date(settings.review_date).toLocaleDateString() : ''}
    </div>
  </div>
);

const calculateFieldHeight = (label: string, value: any): number => {
  if (!value || String(value).trim() === '') return 0;
  
  const labelHeight = 30;
  const valueText = String(value);
  const lineHeight = 18;
  const charsPerLine = 85;
  const lines = Math.ceil(valueText.length / charsPerLine);
  const valueHeight = Math.max(lines * lineHeight, 40);
  const padding = 20;
  
  return labelHeight + valueHeight + padding;
};

const groupFieldsByHeight = (fields: Array<{label: string, value: any, type?: string}>, maxPageHeight = 800) => {
  const pages: Array<Array<{label: string, value: any, type?: string}>> = [];
  let currentPage: Array<{label: string, value: any, type?: string}> = [];
  let currentHeight = 0;

  fields.forEach(field => {
    const fieldHeight = calculateFieldHeight(field.label, field.value);
    
    if (fieldHeight === 0) return;
    
    if (currentHeight + fieldHeight > maxPageHeight && currentPage.length > 0) {
      pages.push([...currentPage]);
      currentPage = [field];
      currentHeight = fieldHeight;
    } else {
      currentPage.push(field);
      currentHeight += fieldHeight;
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

const ClientIntakeFormPDF = ({ formData, commonFieldsData, settings }: any) => {
  const getValue = (key: string): string => {
    return commonFieldsData?.[key] || formData?.[key] || '';
  };

  const fields = [
    // Personal Information
    { label: 'NDIS Number', value: getValue('ndisNumber'), type: 'text' },
    { label: 'Given Name', value: getValue('givenName'), type: 'text' },
    { label: 'Surname', value: getValue('surname'), type: 'text' },
    { label: 'Preferred Name', value: getValue('preferredName'), type: 'text' },
    { label: 'Date of Birth', value: getValue('dateOfBirth'), type: 'text' },
    { label: 'Sex', value: getValue('sex'), type: 'text' },
    { label: 'Pronoun', value: getValue('pronoun'), type: 'text' },
    { label: 'Aboriginal or Torres Strait Islander?', value: getValue('aboriginalTorres'), type: 'text' },
    { label: 'Address (Number/Street)', value: getValue('addressNumberStreet'), type: 'text' },
    { label: 'State', value: getValue('state'), type: 'text' },
    { label: 'Postcode', value: getValue('postcode'), type: 'text' },
    { label: 'Email', value: getValue('email'), type: 'text' },
    { label: 'Home Phone', value: getValue('homePhone'), type: 'text' },
    { label: 'Mobile', value: getValue('mobile'), type: 'text' },
    { label: 'Disability Conditions/Disability type(s)', value: getValue('disabilityConditions'), type: 'longtext' },
    
    // Medical Contact
    { label: 'Medical Centre Name', value: getValue('medicalCentreName'), type: 'text' },
    { label: 'Medical Centre Phone', value: getValue('medicalPhone'), type: 'text' },
    
    // Support Coordinator
    { label: 'Support Coordinator Name', value: getValue('supportCoordinatorName'), type: 'text' },
    { label: 'Support Coordinator Email', value: getValue('supportCoordinatorEmail'), type: 'text' },
    { label: 'Support Coordinator Company', value: getValue('supportCoordinatorCompany'), type: 'text' },
    { label: 'Support Coordinator Contact', value: getValue('supportCoordinatorContact'), type: 'text' },
    { label: 'What other supports including mainstream health services you receive at present', value: getValue('otherSupports'), type: 'longtext' },
    
    // About Me
    { label: 'All About Me', value: getValue('aboutMe'), type: 'longtext' },
    
    // Advocate Details
    { label: 'Advocate Name', value: getValue('advocateName'), type: 'text' },
    { label: 'Advocate Email', value: getValue('advocateEmail'), type: 'text' },
    { label: 'Advocate Phone', value: getValue('advocatePhone'), type: 'text' },
    { label: 'Advocate Mobile', value: getValue('advocateMobile'), type: 'text' },
    { label: 'Advocate Address', value: getValue('advocateAddress'), type: 'text' },
    { label: 'Advocate Postal Address', value: getValue('advocatePostalAddress'), type: 'text' },
    { label: 'Advocate Additional Information', value: getValue('advocateOtherInfo'), type: 'longtext' },
    { label: 'Advocate Relationship with Participant', value: getValue('advocateRelationship'), type: 'text' },
    
    // Cultural Information
    { label: 'Are there any cultural, communication barriers or intimacy issues', value: getValue('barriers'), type: 'text' },
    { label: 'Language', value: getValue('language'), type: 'text' },
    { label: 'Verbal communication or spoken language - Is an interpreter needed?', value: getValue('interpreter'), type: 'text' },
    { label: 'Country of Birth', value: getValue('countryOfBirth'), type: 'text' },
    { label: 'Cultural Values', value: getValue('culturalValues'), type: 'longtext' },
    { label: 'Cultural Behaviours', value: getValue('culturalBehaviours'), type: 'longtext' },
    { label: 'Written Communication / Literacy', value: getValue('writtenCommunication'), type: 'longtext' }
  ];

  // Filter out any "If yes" detail when parent isn't Yes
  const parentMap: Record<string, string> = {
    medicationChartOthers: 'medicationChart',
    bowelCareOthers: 'bowelCare',
    menstrualIssuesOthers: 'menstrualIssues',
    epilepsyOthers: 'epilepsy',
    asthmaticOthers: 'asthmatic',
    allergiesOthers: 'allergies',
    anaphylacticOthers: 'anaphylactic',
    trainingOthers: 'training',
    othermedicalOthers: 'othermedical',
    triggerOthers: 'trigger',
  };

  const filtered = fields.filter((f) => {
    const detailKey = Object.keys(parentMap).find((k) => f.label.toLowerCase().includes(k.replace(/others?$/i, '').toLowerCase()));
    if (!detailKey) return true;
    const parentKey = parentMap[detailKey];
    const parentVal = getValue(parentKey);
    return parentVal === 'Yes' && !!f.value;
  });

  // For list fields, render bullet points instead of a comma line
  const bulletify = (label: string, value: any) => {
    const listKeys = ['livingArrangements', 'travelArrangements'];
    const isList = listKeys.some(k => label.toLowerCase().includes(k.toLowerCase()));
    if (!isList) return { label, value };
    const arr = Array.isArray(value) ? value : String(value || '').split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length === 0) return { label, value: '' };
    return { label, value: arr.map(item => `• ${item}`).join('\n') };
  };

  const yesInlineNoteMap: Record<string, string> = {
    mealtimeManagement: 'refer to Mealtime Management Plan Form',
    asthmatic: "ensure Participant's Doctor completes an Asthma Plan",
  };

  const bulletAdjusted = filtered.map(f => {
    const adjusted = bulletify(f.label, f.value);
    // Inline note inside value when Yes
    const key = Object.keys(yesInlineNoteMap).find(k => f.label.toLowerCase().includes(k.toLowerCase().replace(/([A-Z])/g, ' $1').trim()));
    let valueOut = adjusted.value;
    if (key && (commonFieldsData?.[key] || formData?.[key]) === 'Yes') {
      const current = String(f.value || 'Yes');
      valueOut = current && current !== 'Yes' ? current : `Yes (${yesInlineNoteMap[key]})`;
    }
    return { ...f, value: valueOut };
  });

  const pages = groupFieldsByHeight(bulletAdjusted);

  return (
    <div className="pdf-mode">
      {pages.map((pageFields, pageIndex) => (
        <A4Page key={pageIndex} pageNumber={pageIndex} settings={settings}>
          {pageFields.map((field, fieldIndex) => (
            <UnifiedFieldRenderer
              key={fieldIndex}
              fieldKey={`field-${fieldIndex}`}
              label={field.label}
              value={field.value || ''}
              type={field.type === 'longtext' ? 'longtext' : 'text'}
              mode="pdf"
            />
          ))}
        </A4Page>
      ))}
    </div>
  );
};

export default ClientIntakeFormPDF;
