import React from 'react'
import Page2 from './page_2_FIXED';
import Page3 from './page_3_FIXED';
import Page4 from './page_4_FIXED';
import Page5 from './page_5_FIXED';
import Page1 from './page_1_FIXED';
import { A4_PDF_TYPOGRAPHY, PDF_FONT_STYLES, formSchema } from './page_FIXED';

const PersonCentredPlan = ({ formKey, commonFieldsData, settings, formData, images} : any ) => {
  return (
    <div className="pdf-container font-montserrat">
      <style dangerouslySetInnerHTML={{ __html: PDF_FONT_STYLES }} />
      <Page1 formSchema={formSchema.page1} commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images} />
      <Page2 formSchema={formSchema.page2}  commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images} />
      <Page3 formSchema={formSchema.page3}   commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images}/> 
      <Page4 formSchema={formSchema.page4}   commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images}/>  
      <Page5 formSchema={formSchema.page5}   commonFieldsData={commonFieldsData} settings={settings} data={formData} images={images}/>
    </div>
  )
}

export default PersonCentredPlan
