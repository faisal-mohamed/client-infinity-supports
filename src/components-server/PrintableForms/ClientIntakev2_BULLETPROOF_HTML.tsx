import React from 'react';

interface ClientIntakeBulletProofHTMLProps {
  formData: any;
  commonFieldsData: any;
  settings: any;
  logoDataUrl: string;
}

const ClientIntakeBulletProofHTML: React.FC<ClientIntakeBulletProofHTMLProps> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl
}) => {
  // Data mapping for common fields
  const commonFieldMapping: Record<string, string> = {
    clientName: 'name',
    address: 'street',
    dob: 'dob',
    disability: 'disability',
    phoneNumber: 'phone',
    ndisNumber: 'ndis',
    state: 'state',
    street: 'street',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    sex: 'sex'
  };

  // Safe data extraction with fallbacks
  const getValue = (key: string): string => {
    try {
      let value = '';
      
      if (commonFieldMapping?.[key]) {
        value = commonFieldsData?.[commonFieldMapping[key]];
      } else {
        value = formData?.[key];
      }
      
      return value ? String(value) : '';
    } catch (error) {
      console.warn(`Error getting value for key ${key}:`, error);
      return '';
    }
  };

  // Safe date formatting
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return String(dateString);
      }
      return date.toLocaleDateString();
    } catch {
      return String(dateString);
    }
  };

  // Get report date
  const getReportDate = (): string => {
    const dateValue = settings?.review_date || settings?.reviewDate || settings?.report_date || settings?.reportDate;
    return dateValue ? formatDate(dateValue) : '';
  };

  // Get form ID
  const getFormId = (): string => {
    return settings?.client_intake_form_id || settings?.client_intake_form || 'CF001';
  };

  // Get email
  const getEmail = (): string => {
    return settings?.from_email || settings?.email || 'infinitysupportswa.org';
  };

  // Render checkbox
  const renderCheckbox = (isChecked: boolean) => (
    <input 
      type="checkbox" 
      checked={isChecked} 
      readOnly 
      style={{ 
        width: '10px', 
        height: '10px', 
        marginRight: '4px',
        backgroundColor: isChecked ? '#87ceeb' : '#ffffff',
        border: '1px solid #000000'
      }} 
    />
  );

  // Render radio group
  const renderRadioGroup = (fieldName: string, options: string[]) => (
    <div className="radio-group">
      {options.map((option) => (
        <div key={option} className="radio-item">
          {renderCheckbox(getValue(fieldName) === option)}
          <span>{option}</span>
        </div>
      ))}
    </div>
  );

  // Render Yes/No with details
  const renderYesNoWithDetails = (fieldKey: string, label: string, detailsField?: string) => (
    <div className="yes-no-container">
      <div className="yes-no-label">{label}</div>
      <div className="yes-no-options">
        <div className="radio-item">
          {renderCheckbox(getValue(fieldKey) === "Yes")}
          <span>Yes</span>
        </div>
        <div className="radio-item">
          {renderCheckbox(getValue(fieldKey) === "No")}
          <span>No</span>
        </div>
      </div>
      {getValue(fieldKey) === "Yes" && detailsField && getValue(detailsField) && (
        <div className="yes-no-details">
          <strong>Details:</strong> {getValue(detailsField)}
        </div>
      )}
    </div>
  );

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Client Intake Form</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4;
              margin-top: 120px;
              margin-bottom: 80px;
              margin-left: 20px;
              margin-right: 20px;
            }
            
            @media print {
              pdf-header { position: running(header); }
              pdf-footer { position: running(footer); }
            }
            
            @page {
              @top-center { content: element(header); }
              @bottom-center { content: element(footer); }
            }
            
            body {
              font-family: 'Helvetica', Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.4;
              color: #000000;
              margin: 0;
              padding: 0;
            }
            
            .pdf-body {
              padding: 0;
            }
            
            .pdf-header {
              width: 100%;
              text-align: center;
              padding: 10px 0;
              background: #ffffff;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .pdf-header img {
              max-width: 220px;
              height: auto;
              max-height: 70px;
            }
            
            .pdf-footer {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 15px;
              background: #ffffff;
              border-top: 1px solid #e5e7eb;
              font-size: 10pt;
              color: #666666;
            }
            
            section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 11pt;
              font-weight: bold;
              margin-bottom: 8px;
              color: #374151;
              background-color: #e5e7eb;
              padding: 4px 8px;
              border-radius: 3px;
            }
            
            .field-row {
              display: flex;
              flex-direction: row;
              margin-bottom: 8px;
              align-items: flex-start;
              gap: 10px;
              page-break-inside: avoid;
            }
            
            .field-row label {
              width: 150px;
              font-weight: bold;
              font-size: 9pt;
              color: #374151;
              flex-shrink: 0;
            }
            
            .field-row .value {
              flex: 1;
              font-size: 9pt;
              color: #111827;
              word-wrap: break-word;
            }
            
            .full-container {
              margin-bottom: 15px;
              page-break-inside: avoid;
              width: 100%;
            }
            
            .full-container-label {
              font-weight: bold;
              margin-bottom: 4px;
              font-size: 9pt;
              color: #374151;
            }
            
            .full-container-value {
              border: 1px solid #000000;
              border-radius: 3px;
              padding: 10px;
              min-height: 200px;
              font-size: 10pt;
              color: #111827;
              line-height: 1.4;
              background-color: #ffffff;
              word-wrap: break-word;
              white-space: pre-wrap;
              width: 100%;
              box-sizing: border-box;
            }
            
            .disability-container {
              border: 1px solid #000000;
              padding: 10px;
              min-height: 200px;
              font-size: 10pt;
              line-height: 1.4;
              background-color: #ffffff;
              word-wrap: break-word;
              white-space: pre-wrap;
              width: 100%;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            
            .about-me-field {
              border: 1px solid #000000;
              padding: 10px;
              min-height: 400px;
              font-size: 10pt;
              line-height: 1.4;
              background-color: #ffffff;
              word-wrap: break-word;
              white-space: pre-wrap;
              width: 100%;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            
            .other-supports-field {
              border: 1px solid #000000;
              padding: 10px;
              min-height: 250px;
              font-size: 10pt;
              line-height: 1.4;
              background-color: #ffffff;
              word-wrap: break-word;
              white-space: pre-wrap;
              width: 100%;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            
            .radio-group {
              display: flex;
              flex-direction: row;
              gap: 15px;
              flex-wrap: wrap;
            }
            
            .radio-item {
              display: flex;
              flex-direction: row;
              align-items: center;
              font-size: 9pt;
              margin-bottom: 2px;
            }
            
            .yes-no-container {
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            
            .yes-no-label {
              font-weight: bold;
              margin-bottom: 4px;
              font-size: 9pt;
              color: #374151;
            }
            
            .yes-no-options {
              display: flex;
              gap: 15px;
              margin-bottom: 8px;
            }
            
            .yes-no-details {
              margin-top: 8px;
              padding: 8px;
              border: 1px solid #d1d5db;
              background-color: #f9fafb;
              font-size: 9pt;
              word-wrap: break-word;
              white-space: pre-wrap;
            }
            
            @media print {
              .pdf-body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .full-container,
              .disability-container,
              .about-me-field,
              .other-supports-field {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          `
        }} />
      </head>
      <body>
        {/* Fixed Header */}
        <div className="pdf-header">
          <img src={logoDataUrl} alt="Infinity Supports WA" />
        </div>

        {/* Main Content */}
        <div className="pdf-body">
          {/* PAGE 1: Personal Information */}
          <section>
            <div className="section-title">Participant Details</div>
            
            <div className="field-row">
              <label>Date:</label>
              <div className="value">{getValue('date')}</div>
            </div>
            
            <div className="field-row">
              <label>NDIS Number:</label>
              <div className="value">{getValue('ndisNumber')}</div>
            </div>
            
            <div className="field-row">
              <label>Given name(s):</label>
              <div className="value">{getValue('givenName')}</div>
              <label>Surname:</label>
              <div className="value">{getValue('surname')}</div>
            </div>
            
            <div className="field-row">
              <label>Sex:</label>
              <div className="value">
                {renderRadioGroup('sex', ['Male', 'Female', 'Prefer not to say'])}
              </div>
            </div>
            
            <div className="field-row">
              <label>Pronoun:</label>
              <div className="value">{getValue('pronoun')}</div>
            </div>
            
            <div className="field-row">
              <label>Are you an Aboriginal or Torres Strait Island descent?</label>
              <div className="value">
                {renderRadioGroup('aboriginalTorres', ['Yes', 'No'])}
              </div>
            </div>
            
            <div className="field-row">
              <label>Preferred name:</label>
              <div className="value">{getValue('preferredName')}</div>
            </div>
            
            <div className="field-row">
              <label>Date of Birth:</label>
              <div className="value">{getValue('dateOfBirth')}</div>
            </div>
          </section>

          <section>
            <div className="section-title">Residential Address Details</div>
            
            <div className="field-row">
              <label>Number / Street:</label>
              <div className="value">{getValue('addressNumberStreet')}</div>
            </div>
            
            <div className="field-row">
              <label>State:</label>
              <div className="value">{getValue('state')}</div>
              <label>Postcode:</label>
              <div className="value">{getValue('postcode')}</div>
            </div>
          </section>

          <section>
            <div className="section-title">Participant Contact Details</div>
            
            <div className="field-row">
              <label>Email address:</label>
              <div className="value">{getValue('email')}</div>
            </div>
            
            <div className="field-row">
              <label>Home Phone No:</label>
              <div className="value">{getValue('homePhone')}</div>
              <label>Mobile No:</label>
              <div className="value">{getValue('mobile')}</div>
            </div>
          </section>

          {/* Disability Conditions - FULL BOX CONTAINER */}
          <section>
            <div className="section-title">Disability Conditions/Disability type(s)</div>
            <div className="full-container">
              <div className="disability-container">
                {getValue('disabilityConditions') || ' '}
              </div>
            </div>
          </section>
        </div>

        {/* Fixed Footer */}
        <div className="pdf-footer">
          <span>{getEmail()}</span>
          <span>{getFormId()}</span>
          <span>Review Date: {getReportDate()}</span>
        </div>
      </body>
    </html>
  );
};

export default ClientIntakeBulletProofHTML;
