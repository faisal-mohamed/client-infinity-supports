import React from 'react'
import Page1 from './page_1';
import Page2 from './page_2';
import Page3 from './page_3';
import Page4 from './page_4';
import Page5 from './page_5';
import Page6 from './page_6';
import Page7 from './page_7';
import Page8 from './page_8';
import Page9 from './page_9';
import Page10 from './page_10';
import Page11 from './page_11';
import Page12 from './page_12';
import Page13 from './page_13'
import Page14 from './page_14';
import Page15 from './page_15';
import Page16 from './page_16';
import Page17 from './page_17';
import Page18 from './page_18';
import Page19 from './page_19';
import Page20 from './page_20';
import Page21 from './page_21';
import Page22 from './page_22';
import Page23 from './page_23';
import Page24 from './page_24';
import Page25 from './page_25';
import Page26 from './page_26';

export const formSchema : any  = {
  title: 'Welcome Pack Receipt Acknowledgement',
  fields: [
    {
      key: 'acknowledgementStatement',
      type: 'static',
      content:
        'I confirm I have received the Welcome Pack from Infinity Supports and have read and understood the content.',
    },
    {
      key: 'printedPackStatement',
      type: 'static',
      content:
        'A printed version of the Welcome Pack is also available. If you would like a printed version, please contact us.',
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      key: 'signature',
      label: 'Signature',
      type: 'text',
    },
    {
      key: 'relationship',
      label: 'Relationship',
      type: 'text',
    },
    {
      key: 'date',
      label: 'Date',
      type: 'text',
    },
  ],

};



const WelcomeForm = ({formData, commonFieldsData, settings, images} : any ) => {
  return (
    <div>
        <Page1 settings={settings} images={images}/> 
        <Page2 settings={settings} images={images}/>
        <Page3 settings={settings} images={images}/>
        <Page4 settings={settings} images={images}/>
        <Page5 settings={settings} images={images}/>
        <Page6 settings={settings} images={images}/>
        <Page7 settings={settings} images={images}/>
        <Page8 settings={settings} images={images}/>
        <Page9 settings={settings} images={images}/>
        <Page10 settings={settings} images={images}/>
        <Page11 settings={settings} images={images}/>
        <Page12 settings={settings} images={images}/>
        <Page13 settings={settings} images={images}/>
        <Page14 settings={settings} images={images}/>
        <Page15 settings={settings} images={images}/>
        <Page16 settings={settings} images={images}/>
        <Page17 settings={settings} images={images}/>
        <Page18 settings={settings} images={images}/>
        <Page19 settings={settings} images={images}/>
        <Page20 settings={settings} images={images}/>
        <Page21 settings={settings} images={images}/>
        <Page22 settings={settings} images={images}/>
        <Page23 settings={settings} images={images}/>
        <Page24 settings={settings} images={images}/>
        <Page25 settings={settings} images={images}/>
        <Page26 schema={formSchema}  data={formData} settings={settings} commonFieldsData={commonFieldsData} images={images} />
    </div>
  )
}

export default WelcomeForm