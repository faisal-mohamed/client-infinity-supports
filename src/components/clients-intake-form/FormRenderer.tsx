"use client";

import React, { useState } from "react";
import ClientIntakeForm from "./ClientIntakeForm";
import GpMedicalSupportForm from "./GpMedicalSupportForm";
import AllAboutMeForm from "./AllAboutMeForm";
import ContactsLivingTravelForm from "./ContactsLivingTravelForm";
import MedicationInfoForm from "./MedicationInfoForm";
import SafetyConsiderationForm from "./SafetyConsiderationForm";

const FormRenderer = ({ formKey, formSchema, formData = {}, onChange }) => {
  const [localFormData, setLocalFormData] = useState(formData);
  
  const handleFormChange = (newData) => {
    setLocalFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };
  
  // For client_intake_form, render all sections
  if (formKey === "client_intake_form") {
    return (
      <div className="space-y-12 bg-gray-100 py-8 flex flex-col items-center">
        <ClientIntakeForm
          formSchema={formSchema.clientIntakeSchema}
          formData={localFormData}
        />
        <GpMedicalSupportForm
          formSchema={formSchema.gpMedicalSupportSchema}
          formData={localFormData}
        />
        <AllAboutMeForm
          formSchema={formSchema.allAboutMeSchema}
          formData={localFormData}
        />
        <ContactsLivingTravelForm
          formSchema={formSchema.contactsLivingTravelSchema}
          formData={localFormData}
        />
        <MedicationInfoForm
          formSchema={formSchema.medicationInfoSchema}
          formData={localFormData}
        />
        <SafetyConsiderationForm
          formSchema={formSchema.safetyConsiderationSchema}
          formData={localFormData}
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
