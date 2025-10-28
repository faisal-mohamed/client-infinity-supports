import React from 'react'
import SASupportCoordination from '@/app/form-components/sa-support-coordination/page'
const SASupportCoordinationView = ({ formData = {}, commonFieldsData , settings, } : any) => {
  return (
    <div>
        <SASupportCoordination formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default SASupportCoordinationView