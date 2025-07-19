import React from 'react'
import MDT from '@/app/form-components/mdt/page'
const MDTView = ({formData, commonFieldsData, settings} : any ) => {
  return (
    <div>
        <MDT formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
    </div>
  )
}

export default MDTView