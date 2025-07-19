import React from 'react'
import WelcomeForm from '@/app/form-components/welcome-form/page'
const WelcomeFormView = ({formData, commonFieldsData, settings} : any ) => {
  return (
    <div>
        <WelcomeForm  formData={formData} commonFieldsData={commonFieldsData} settings={settings}/>
    </div>
  )
}

export default WelcomeFormView