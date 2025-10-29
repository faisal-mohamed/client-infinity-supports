
import IndividualRiskView from "@/app/components/forms/individual-risk-assessment/IndividualRiskView";

const IndividualRiskAssessmentView = ({ formKey, formData = {}, commonFieldsData , settings} : any) => {

  return <IndividualRiskView formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} settings={settings} />
}

export default IndividualRiskAssessmentView