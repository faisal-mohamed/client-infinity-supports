import React from 'react'
import ScheduleForSupport from '@/app/form-components/support-action-plan/page'

const ScheduleForSupportView = ({settings, formData, commonFieldsData} : any ) => {
  return (
    <div>
        <ScheduleForSupport  settings={settings} formData={formData} commonFieldsData={commonFieldsData} />
    </div>
  )
}

export default ScheduleForSupportView