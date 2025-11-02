import React from 'react'
import EmergencyDrillDynamic from '@/app/components/forms/emergency-drill/EmergencyDrillDynamic'

const View = ({ formData, settings, commonFieldsData }: any) => {
  return (
    <div>
      <EmergencyDrillDynamic 
        formData={formData} 
        commonFieldsData={commonFieldsData} 
        settings={settings} 
      />
    </div>
  )
}

export default View
