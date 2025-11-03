
import HomeVisitDynamic from "@/app/components/forms/home-visit-risk-assessment/HomeVisitDynamic"
import { useEffect } from "react"


const HomeRiskAssesmentView = ({ formKey, formData = {}, commonFieldsData , settings} : any) => {
  useEffect(() => {
    console.log("settings", settings, "com: " , commonFieldsData);
  }, [settings, commonFieldsData])
  return (
    <div>
        <HomeVisitDynamic formKey={formKey} formData={formData} commonFieldsData={commonFieldsData} settings={settings}/>
    </div>
  )
}

export default HomeRiskAssesmentView