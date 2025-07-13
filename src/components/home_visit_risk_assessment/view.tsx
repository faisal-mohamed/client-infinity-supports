
import HomeVisitRiskAssessment from "@/app/test/home_visit/page"
import { useEffect } from "react"


const HomeRiskAssesmentView = ({ formKey, formData = {}, commonFieldsData , settings} : any) => {
  useEffect(() => {
    console.log("settings", settings, "com: " , commonFieldsData);
  }, [settings, commonFieldsData])
  return (
    <div>
        <HomeVisitRiskAssessment formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} settings={settings}/>
    </div>
  )
}

export default HomeRiskAssesmentView