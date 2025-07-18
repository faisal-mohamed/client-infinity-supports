import React from 'react'
import Page1 from './page_1';
import Page2 from './page_2';
import Page3 from './page_3';


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

export const formData = {
  personName: 'John Doe',
  activity: 'Swimming at Local Pool',
  assessorName: 'Jane Smith',
  date: '2025-07-17',
  location: 'Perth WA',

  //page 2
  riskIdentified_1: 'Slippery floor near entry',
  likelihood_1: 'Likely',
  severity_1: 'Moderate',
  controls_1: 'Place wet floor sign, clean regularly',

  riskIdentified_2: 'Unsupervised swimming',
  likelihood_2: 'Possible',
  severity_2: 'Extreme',
  controls_2: 'Always have lifeguard present',

  riskIdentified_3: '',
  likelihood_3: '',
  severity_3: '',
  controls_3: '',

  riskIdentified_4: '',
  likelihood_4: '',
  severity_4: '',
  controls_4: '',

  riskIdentified_5: '',
  likelihood_5: '',
  severity_5: '',
  controls_5: '',

  riskIdentified_6: '',
  likelihood_6: '',
  severity_6: '',
  controls_6: '',

  //page3 
  
  additionalSupport: 'Support worker required for mobility assistance during the activity. Emergency contact details updated.',
  reviewDate: '2025-09-30',
  assessorSignature: 'Jane Smith'
};

const IndividualRiskAssessment = ({formKey, formData, commonFieldsData, settings, images} : any ) => {
  return (
    <div>
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