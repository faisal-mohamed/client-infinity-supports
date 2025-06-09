import React from "react";
import ClientIntakeForm from "./ClientIntakeForm";
import GpMedicalSupportForm from "./GpMedicalSupportForm";
import AllAboutMeForm from "./AllAboutMeForm";
import ContactsLivingTravelForm from "./ContactsLivingTravelForm";
import MedicationInfoForm from "./MedicationInfoForm";
import SafetyConsiderationForm from "./SafetyConsiderationForm";

const FormRenderer = ({ formKey, formSchema, formData = {} }) => {
  // For client_intake_form, render all sections
  if (formKey === "client_intake_form") {
    return (
      <div className="space-y-12 bg-gray-100 py-8 flex flex-col items-center">
        <ClientIntakeForm
          formSchema={formSchema.clientIntakeSchema}
          formData={formData}
        />
        <GpMedicalSupportForm
          formSchema={formSchema.gpMedicalSupportSchema}
          formData={formData}
        />
        <AllAboutMeForm
          formSchema={formSchema.allAboutMeSchema}
          formData={formData}
        />
        <ContactsLivingTravelForm
          formSchema={formSchema.contactsLivingTravelSchema}
          formData={formData}
        />
        <MedicationInfoForm
          formSchema={formSchema.medicationInfoSchema}
          formData={formData}
        />
        <SafetyConsiderationForm
          formSchema={formSchema.safetyConsiderationSchema}
          formData={formData}
        />
      </div>
    );
  }
  
  // Fallback for unknown form types
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
      Unknown form type: {formKey}
    </div>
  );
};

export default FormRenderer;
