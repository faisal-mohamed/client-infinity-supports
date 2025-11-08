import React from 'react'
import MDTDynamic from './MDTDynamic'

// Main MDT View component - Now with dynamic pagination
const MDT = ({formData, commonFieldsData, settings} : any ) => {
  return (
    <MDTDynamic 
      formData={formData} 
      commonFieldsData={commonFieldsData} 
      settings={settings} 
    />
  )
}

export default MDT
