import ParticipantRiskAssessmentComplete from "@/app/form-components/participant-risk-assessment/ParticipantRiskAssessmentComplete"

const ParticipantRiskAssessmentView = ({ formKey, formData = {}, commonFieldsData, settings, images } : any) => {

  return (
    <div>
        <ParticipantRiskAssessmentComplete 
          formKey={formKey} 
          formData={formData} 
          commonFieldsData={commonFieldsData} 
          settings={settings}
          images={images}
        />
    </div>
  )
}

export default ParticipantRiskAssessmentView
