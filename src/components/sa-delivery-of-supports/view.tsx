import SADeliverySupports from '@/app/form-components/SA-delivery-of-supports/page'
import React from 'react'

const SADeliveryView = ({ formData = {}, commonFieldsData , settings, } : any) => {
  return (
    <div>
        <SADeliverySupports formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default SADeliveryView