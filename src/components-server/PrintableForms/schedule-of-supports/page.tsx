import React from 'react'
import Page1 from './page_1'
import Page2 from './page_2'
import Page3 from './page_3'


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
    { key: "row14", description: '01-002-0107-1-1 Provider Travel', cost: '$17.55' },
    { key: "row15", description: '04-104-0125-6-1 Provider Travel', cost: '$17.55' }
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


// export const formData = {
//   supportFor: "John Doe",
//   ndisNumber: "123456789",
//   planDatesFrom: "01/07/2025",
//   planDatesTo: "21/07/2025",

//   row0_weeks: '2',
//   row0_totalHours: '2',

//   row1_weeks: '20',
//   row1_totalHours: '40',

//   row2_weeks: '10',
//   row2_totalHours: '15',

//   row3_weeks: '10',
//   row3_totalHours: '10',

//   row4_weeks: '10',
//   row4_totalHours: '5',

//   row5_weeks: '5',
//   row5_totalHours: '2',

//   row6_weeks: '10',
//   row6_totalHours: '20',

//   row7_weeks: '5',
//   row7_totalHours: '10',

//   row8_weeks: '3',
//   row8_totalHours: '6',

//   row9_weeks: '2',
//   row9_totalHours: '4',

//   row10_weeks: '6',
//   row10_totalHours: '12',

//   row11_weeks: '4',
//   row11_totalHours: '8',

//   row12_totalKms: '150', 

//   row13_weeks: '1',
//   row13_totalHours: '3',

//   row14_weeks: '2',
//   row14_totalHours: '4',

//   row15_weeks: '2',
//   row15_totalHours: '5',


//   //page 2
//    transportOption1: 'yes',
//   transportValue1: '$100',
//   transportOver1: '$25',

//   transportOption2: 'no',
//   transportValue2: '',
//   transportOver2: '',

//   transportOption3: 'yes',

//   establishmentFeeAgreement: 'yes',

//   //page3
//   providerTravelAgreement: "yes",

//   participantSignature: "participant sig",  // base64-encoded image if captured
//   participantSignatureDate: "2025-07-19",
//   participantName: "John Doe",

//   nomineeSignature: "nominnee sig",
//   nomineeSignatureDate: "12-12-12",
//   nomineeName: "nominee name",

//   representativeSignature: "infintiy supports",
//   representativeSignatureDate: "12-12-12",
// };





const ScheduleOfSupports = ({formData, settings, commonFieldsData, images} : any ) => {
  return (
    <div>
        <Page1 formData={formData} schema={formSchema.page1} commonFieldsData={commonFieldsData} settings={settings} images={images} />
        <Page2 formData={formData} schema={formSchema.page2} commonFieldsData={commonFieldsData} settings={settings} images={images}/>
        <Page3 data={formData} schema = {formSchema.page3} commonFieldsData={commonFieldsData}settings={settings}  images={images} />
    </div>
  )
}

export default ScheduleOfSupports