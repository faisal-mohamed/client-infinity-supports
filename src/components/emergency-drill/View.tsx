import React from 'react'
import EmergencyDrillEnhanced from '@/app/form-components/emergency-drill/page_enhanced'

const View = ({ formData, settings, commonFieldsData }: any) => {
  return (
    <div>
      <EmergencyDrillEnhanced 
        formData={formData} 
        commonFieldsData={commonFieldsData} 
        settings={settings} 
      />
    </div>
  )
}

export default View
