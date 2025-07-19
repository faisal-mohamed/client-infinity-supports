import React from 'react'
import ScheduleForSupport from '@/app/form-components/shedule-for-support/page'

const ScheduleForSupportView = ({settings, formData, commonFieldsData} : any ) => {
  return (
    <div>
        <ScheduleForSupport  settings={settings} formData={formData} commonFieldsData={commonFieldsData} />
    </div>
  )
}

export default ScheduleForSupportView