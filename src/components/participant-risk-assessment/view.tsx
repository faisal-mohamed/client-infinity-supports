
import ParticipantRiskAssessment from "@/app/form-components/participant-risk-assessment/page"

const ParticipantRiskAssessmentView = ({ formKey, formData = {}, commonFieldsData , settings} : any) => {

  return (
    <div>
        <ParticipantRiskAssessment formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} settings={settings}/>
    </div>
  )
}



export default ParticipantRiskAssessmentView