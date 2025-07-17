import React from 'react'
import EmergencyDrill from '@/app/form-components/emergency-drill/page'

const View = ({formData, settings, commonFieldsData} : any ) => {
  return (
    <div>
        <EmergencyDrill formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default View