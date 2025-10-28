
import IndividualRiskAssessment from "@/app/form-components/individual-risk-assessment/page"

const IndividualRiskAssessmentView = ({ formKey, formData = {}, commonFieldsData , settings} : any) => {

  return (
    <div>
        <IndividualRiskAssessment formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} settings={settings}/>
    </div>
  )
}

export default IndividualRiskAssessmentView