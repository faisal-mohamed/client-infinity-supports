import React from 'react'
import MDTMatching from './MDT_MATCHING'

// Main MDT PDF component - Now uses React PDF with dynamic pagination
const MDT = ({formData, commonFieldsData, settings, images, logoDataUrl} : any ) => {
  console.log('🔍 [MDT PDF Wrapper] Called with props:', {
    hasFormData: !!formData,
    hasCommonFields: !!commonFieldsData,
    hasSettings: !!settings,
    hasImages: !!images,
    hasLogoDataUrl: !!logoDataUrl,
    formDataKeys: Object.keys(formData || {}),
    settingsKeys: Object.keys(settings || {}),
  });
  
  return (
    <MDTMatching 
      formData={formData} 
      commonFieldsData={commonFieldsData} 
      settings={settings} 
      images={images}
      logoDataUrl={logoDataUrl}
    />
  )
}

export default MDT