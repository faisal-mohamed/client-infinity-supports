import SADeliverySupportsDynamic from '@/app/components/forms/sa-delivery-of-supports/SADeliverySupportsDynamic'
import React from 'react'

const SADeliveryView = ({ formData = {}, commonFieldsData , settings, } : any) => {

  
  return (
    <div>
        <SADeliverySupportsDynamic formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default SADeliveryView