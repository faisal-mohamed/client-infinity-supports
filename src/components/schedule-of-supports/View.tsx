import React from 'react'
import ScheduleOfSupports from '@/app/form-components/schedule-of-supports/page'
const ScheduleOfSupportsView = ({ formData = {}, commonFieldsData , settings, } : any) => {
  return (
    <div>
        <ScheduleOfSupports  formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default ScheduleOfSupportsView