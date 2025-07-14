
import PersonCentredPlan from "@/app/form-components/person_centred_plan/page";


const PersonCentredPlanView = ({ formKey, formData = {}, commonFieldsData , settings} : any) => {

  return (
    <div>
        <PersonCentredPlan formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} settings={settings}/>
    </div>
  )
}

export default PersonCentredPlanView