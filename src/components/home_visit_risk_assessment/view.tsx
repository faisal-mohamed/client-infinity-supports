
import HomeVisitRiskAssessment from "@/app/test/home_visit/page"


const HomeRiskAssesmentView = ({ formKey, formData = {} } : any) => {
  return (
    <div>
        <HomeVisitRiskAssessment formKey={formKey} formData={formData} />
    </div>
  )
}

export default HomeRiskAssesmentView