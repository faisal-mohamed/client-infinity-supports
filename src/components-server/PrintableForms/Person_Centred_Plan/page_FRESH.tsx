import React from 'react';
import PdfPageLayout from '../pdf/PdfPageLayout';

const PersonCentredPlanView: React.FC<any> = ({
  formData,
  commonFieldsData,
  settings,
  logoDataUrl,
}) => {
  // Debug logging for view form
  console.log('🔍 Person Centred Plan VIEW - Settings received:', settings);
  console.log('🔍 Person Centred Plan VIEW - Website:', settings?.company_website);
  console.log('🔍 Person Centred Plan VIEW - Form ID:', settings?.person_centre_plan_form_id);
  console.log('🔍 Person Centred Plan VIEW - Date:', settings?.review_date);
  // Simple getValue function
  const getValue = (key: string): string => {
    try {
      // For name field, combine first name and surname to show full name
      if (key === 'name') {
        const firstName = commonFieldsData?.name || '';
        const surname = commonFieldsData?.surname || '';
        const fullName = [firstName, surname].filter(Boolean).join(' ').trim();
        if (fullName) {
          return fullName;
        }
        // Fallback to formData.name if it exists
        if (formData?.[key]) {
          return String(formData[key]);
        }
        // Last fallback: try to get just the first name from commonFieldsData
        if (firstName) {
          return firstName;
        }
        return '';
      }
      
      return formData?.[key] || commonFieldsData?.[key] || '';
    } catch {
      return '';
    }
  };

  // Simple formatDate function
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

  return (
    <PdfPageLayout
      logoDataUrl={logoDataUrl || "/infinity_logo.png"}
      footerData={{
        website: settings?.company_website || '',
        formId: settings?.person_centre_plan_form_id || '',
        date: settings?.review_date || ''
      }}
    >
      {/* Section 1: Personal Information */}
      <section>
        <h2>1. Personal Information:</h2>
        
        <div className="field-row">
          <label>Name:</label>
          <p>{getValue('name')}</p>
        </div>
        
        <div className="field-row">
          <label>Address:</label>
          <p>{getValue('address')}</p>
        </div>
        
        <div className="field-row">
          <label>Date of Birth:</label>
          <p>{formatDate(getValue('dob'))}</p>
        </div>
        
        <div className="field-row">
          <label>Guardian:</label>
          <p>{getValue('guardian')}</p>
        </div>
        
        <div className="field-row">
          <label>Guardian Address:</label>
          <p>{getValue('guardianAddress')}</p>
        </div>
        
        <div className="field-row">
          <label>Contact Number:</label>
          <p>{getValue('contactNumber')}</p>
        </div>
        
        <div className="field-row">
          <label>Disability:</label>
          <p>{getValue('disability')}</p>
        </div>
        
        <div className="field-row">
          <label>NDIS Number:</label>
          <p>{getValue('ndisNumber')}</p>
        </div>
      </section>

      {/* Section 2: Personal Story & Background */}
      <section>
        <h2>2. Personal Story & Background:</h2>
        
        <div className="long-answer">
          <label>My Story:</label>
          <p>{getValue('myStory')}</p>
        </div>
        
        <div className="long-answer">
          <label>Strengths:</label>
          <p>{getValue('strengths')}</p>
        </div>
        
        <div className="long-answer">
          <label>Challenges:</label>
          <p>{getValue('challenges')}</p>
        </div>
        
        <div className="long-answer">
          <label>Allergies:</label>
          <p>{getValue('allergies')}</p>
        </div>
      </section>

      {/* Section 3: Health Information */}
      <section>
        <h2>3. Health Information:</h2>
        
        <div className="long-answer">
          <label>Respiratory History:</label>
          <p>{getValue('respiratoryHistory')}</p>
        </div>
        
        <div className="long-answer">
          <label>Precautions:</label>
          <p>{getValue('precautions')}</p>
        </div>
        
        <div className="long-answer">
          <label>Health Conditions:</label>
          <p>{getValue('healthConditions')}</p>
        </div>
        
        <div className="field-row">
          <label>Companion Card:</label>
          <p>{getValue('companionCard')}</p>
        </div>
        
        <div className="field-row">
          <label>Ambulance Cover:</label>
          <p>{getValue('ambulanceCover')}</p>
        </div>
        
        <div className="long-answer">
          <label>Does the participant require support to organize regular medical & dental check ups?</label>
          <p>{getValue('healthcarePrompt')}</p>
        </div>
      </section>

      {/* Section 4: Goals */}
      <section>
        <h2>4. Goals:</h2>
        
        <div className="long-answer">
          <label>Goal 1:</label>
          <p>{getValue('goal1')}</p>
        </div>
        
        <div className="long-answer">
          <label>Goal 2:</label>
          <p>{getValue('goal2')}</p>
        </div>
        
        <div className="long-answer">
          <label>Goal 3:</label>
          <p>{getValue('goal3')}</p>
        </div>
      </section>

      {/* Section 5: Support Information */}
      <section>
        <h2>5. Support Information:</h2>
        
        <div className="field-row">
          <label>PBS Support Plan included?</label>
          <p>{getValue('pbsSupportPlanIncluded') || 'No'}</p>
        </div>
        
        <div className="field-row">
          <label>Any Restrictive Practices?</label>
          <p>{getValue('restrictivePractices') || 'No'}</p>
        </div>
        
        <div className="field-row">
          <label>Name of organization:</label>
          <p>{getValue('organizationName') || 'Not specified'}</p>
        </div>
        
        <div className="field-row">
          <label>Contact person:</label>
          <p>{getValue('contactPersonOrg') || 'Not specified'}</p>
        </div>
        
        <div className="field-row">
          <label>Contact number:</label>
          <p>{getValue('contactNumberOrg') || 'Not specified'}</p>
        </div>
      </section>

      {/* Section 6: Informal Supports */}
      <section>
        <h2>6. Informal Supports:</h2>
        
        <div className="long-answer">
          <label>Support 1:</label>
          <p>{getValue('support1')}</p>
        </div>
        
        <div className="long-answer">
          <label>Support 2:</label>
          <p>{getValue('support2')}</p>
        </div>
        
        <div className="long-answer">
          <label>Support 3:</label>
          <p>{getValue('support3')}</p>
        </div>
      </section>
    </PdfPageLayout>
  );
};

export default PersonCentredPlanView;

