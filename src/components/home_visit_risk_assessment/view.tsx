
import HomeVisitRiskAssessment from "@/app/test/home_visit/page"


const HomeRiskAssesmentView = ({ formKey, formData = {}, commonFieldsData } : any) => {
  return (
    <div>
        <HomeVisitRiskAssessment formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} />
    </div>
  )
}

export default HomeRiskAssesmentView