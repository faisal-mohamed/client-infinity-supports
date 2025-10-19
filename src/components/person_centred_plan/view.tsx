import PersonCentredPlanDynamic from "./PersonCentredPlanDynamic";

const PersonCentredPlanView = ({ formKey, formData = {}, commonFieldsData, settings, images }: any) => {
  return (
    <div>
      <PersonCentredPlanDynamic 
        formData={formData} 
        commonFieldsData={commonFieldsData} 
        settings={settings}
        images={images}
      />
    </div>
  );
};

export default PersonCentredPlanView;
