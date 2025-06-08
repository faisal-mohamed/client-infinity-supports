import React from 'react'
import ClientIntakeFormRenderer from '@/app/components/ClientIntakeFormRenderer'

const page = () => {
     const uiSchema = {
  sections: [
    {
      title: '',
      fields: [
        [
          { id: 'date', label: 'Date:', colspan: 3 },
        ],
      ],
    },
    {
      title: 'Participant Details',
      fields: [
        [
          { id: 'givenName', label: 'Given name(s):' },
          { id: 'surname', label: 'Surname:' },
          { id: 'ndisNumber', label: 'NDIS Number:' }
        ],
        [
          { id: 'sex_male', label: 'Male', type: 'checkbox' },
          { id: 'sex_female', label: 'Female', type: 'checkbox' },
          { id: 'sex_other', label: 'Prefer not to say', type: 'checkbox' }
        ],
        [
          { id: 'sex_specify', label: 'Others:' }
        ]
      ],
    },
    {
      title: '',
      fields: [
        [{ id: 'pronoun', label: 'Pronoun:', colspan: 3 }],
        [
          { id: 'isAboriginal', label: 'Are you an Aboriginal or Torres Strait Island descent?', colspan: 2 },
          { id: 'isAboriginal_yes', label: 'Yes', type: 'checkbox' },
          { id: 'isAboriginal_no', label: 'No', type: 'checkbox' }
        ],
        [
          { id: 'preferredName', label: 'Preferred name:' },
          { id: 'dob', label: 'Date of Birth:' }
        ]
      ]
    },
    {
      title: 'Residential Address Details',
      fields: [
        [{ id: 'street', label: 'Number / Street:', colspan: 3 }],
        [
          { id: 'state', label: 'State:' },
          { id: 'postcode', label: 'Postcode:', colspan: 2 }
        ]
      ]
    },
    {
      title: 'Participant Contact Details',
      fields: [
        [{ id: 'email', label: 'Email address:', colspan: 3 }],
        [
          { id: 'homePhone', label: 'Home Phone No:' },
          { id: 'mobile', label: 'Mobile No:', colspan: 2 }
        ]
      ]
    },
    {
      title: 'Disability Conditions/Disability type(s)',
      fields: [
        [{ id: 'disabilityDetails', label: '', type: 'textarea', colspan: 3 }]
      ]
    }
  ]
};


 const formData = {
  date: '2025-06-05',
  givenName: 'John',
  surname: 'Doe',
  ndisNumber: '123456789',
  sex_male: true,
  sex_female: false,
  sex_other: false,
  sex_specify: '',
  pronoun: 'He/Him',
  isAboriginal: 'No',
  isAboriginal_yes: false,
  isAboriginal_no: true,
  preferredName: 'Johnny',
  dob: '1990-04-01',
  street: '123 ABC Street',
  state: 'WA',
  postcode: '6000',
  email: 'john.doe@example.com',
  homePhone: '08 9123 4567',
  mobile: '0412 345 678',
  disabilityDetails: 'Autism Spectrum Disorder'
};

  return (
    <div>

        <ClientIntakeFormRenderer uiSchema={uiSchema}  formData={formData}/>
    </div>
  )
}

export default page