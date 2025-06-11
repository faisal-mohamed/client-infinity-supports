
"use client";

import React, { useState, useEffect, useRef } from "react";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
}

const commonFieldsMapping: Record<string, string> = {
  ndisNumber: "ndis",
  givenName: "name",
  sex: "sex",
  dateOfBirth: "dob",
  addressNumberStreet: "street",
  state: "state",
  postcode: "postCode",
  email: "email",
  homePhone: "phone",
  disabilityConditions: "disability",
};

const yesNoOptions = ["Yes", "No"];

const livingArrangementsOptions = [
  "Live with Parent/Family/Support Person",
  "Live in private rental arrangement with others",
  "Live in private rental arrangement alone",
  "Owns own home.",
  "Aged Care Facility",
  "Mental Health Facility",
  "Lives in public housing",
  "Short Term Crisis/Respite",
  "Staff Supported Group Home",
  "Hostel/SRS Private Accommodation",
  "Other: _________________________________________________"
];

const travelArrangementsOptions = [
  "Taxi",
  "Pick up/ drop off by Parent/Family/Support Person",
  "Transport by a provider",
  "Independently use Public Transport",
  "Walk",
  "Assisted Public Transport",
  "Drive own car.",
  "Other, please specify: _______________________"
];

const ClientIntakeForm: React.FC<FormProps> = ({ formData, commonFieldsData, onChange, onSubmit, readOnly = false }) => {
  const initialValues = {
    date: new Date().toISOString().split("T")[0],
    ndisNumber: "",
    givenName: "",
    surname: "",
    sex: "",
    pronoun: "",
    aboriginalTorres: "",
    preferredName: "",
    dateOfBirth: "",
    addressNumberStreet: "",
    state: "",
    postcode: "",
    email: "",
    homePhone: "",
    mobile: "",
    disabilityConditions: "",
    livingArrangements: [],
    travelArrangements: [],
    livingArrangementsOther: "",
    travelArrangementsOther: "",
    medicalCentreName: "",
    medicalPhone: "",
    supportCoordinatorName: "",
    supportCoordinatorEmail: "",
    supportCoordinatorCompany: "",
    supportCoordinatorContact: "",
    otherSupports: "",
    advocateName: "",
    advocateEmail: "",
    advocatePhone: "",
    advocateMobile: "",
    advocateAddress: "",
    advocatePostalAddress: "",
    advocateOtherInfo: "",
    advocateRelationship: "",
    barriers: "",
    language: "",
    interpreter: "",
    countryOfBirth: "",
    culturalValues: "",
    culturalBehaviours: "",
    writtenCommunication: "",
    primaryContactName: "",
    primaryContactRelationship: "",
    primaryContactHomePhone: "",
    primaryContactMobile: "",
    secondaryContactName: "",
    secondaryContactRelationship: "",
    secondaryContactHomePhone: "",
    secondaryContactMobile: "",
    medicationChart: "",
    mealtimeManagement: "",
    bowelCare: "",
    menstrualIssues: "",
    epilepsy: "",
    asthmatic: "",
    allergies: "",
    anaphylactic: "",
    minorInjury: "",
    training: "",
    othermedical: "",
    trigger: "",
    absconding: "",
    historyOfFalls: "",
    behaviourConcern: "",
    positiveBehaviour: "",
    communicationAssistance: "",
    physicalAssistance: "",
    languageConcern: "",
    personalGoals: "",
    ...formData,
  };

  for (const [formKey, commonKey] of Object.entries(commonFieldsMapping)) {
    if (commonFieldsData?.[commonKey] && !initialValues[formKey]) {
      initialValues[formKey] = commonFieldsData[commonKey];
    }
  }

  const [localValues, setLocalValues] = useState<any>(initialValues);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(localValues);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [localValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderInput = (label: string, name: string, type: string = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        disabled={readOnly || (commonFieldsMapping[name] && commonFieldsData?.[commonFieldsMapping[name]])}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );

  const renderTextArea = (label: string, name: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        rows={4}
      />
    </div>
  );

  const renderDropdown = (label: string, name: string, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        disabled={readOnly}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const renderCheckboxGroup = (label: string, name: string, options: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option} className="inline-flex items-center">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={localValues[name]?.includes(option)}
              onChange={(e) => {
                const checked = e.target.checked;
                setLocalValues((prev: any) => {
                  const current = Array.isArray(prev[name]) ? prev[name] : [];
                  return {
                    ...prev,
                    [name]: checked ? [...current, option] : current.filter((val: string) => val !== option),
                  };
                });
              }}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

  const renderMultiSelectCheckbox = (label: string, name: string, options: string[]) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <label key={option} className="inline-flex items-center">
          <input
            type="checkbox"
            value={option}
            checked={Array.isArray(localValues[name]) && localValues[name].includes(option)}
            onChange={(e) => {
              const checked = e.target.checked;
              setLocalValues((prev: any) => {
                const current = Array.isArray(prev[name]) ? prev[name] : [];
                return {
                  ...prev,
                  [name]: checked
                    ? [...current, option]
                    : current.filter((val: string) => val !== option),
                };
              });
            }}
            className="mr-2"
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(localValues);
      }}
      className="max-w-4xl mx-auto space-y-6 p-6 bg-white shadow rounded"
    >
      {/* All inputs rendered below, per user schema */}
      {/* Example: */}

      {renderInput("NDIS Number", "ndisNumber")}
      {renderInput("Given Name", "givenName")}
      {renderInput("Surname", "surname")}
      {renderInput("Date of Birth", "dateOfBirth", "date")}
      {renderInput("Pronoun", "pronoun")}
      {renderInput("Preferred Name", "preferredName")}
      {renderDropdown("Sex", "sex", ["Male", "Female", "Other"])}
      {renderDropdown("Aboriginal or Torres Strait Islander?", "aboriginalTorres", yesNoOptions)}
      {renderInput("Address (Number/Street)", "addressNumberStreet")}
      {renderInput("State", "state")}
      {renderInput("Postcode", "postcode")}
      {renderInput("Email", "email")}
      {renderInput("Home Phone No", "homePhone")}
      {renderInput("Mobile No", "mobile")}
      {renderTextArea("Disability Conditions/Disability type(s)", "disabilityConditions")}
      {renderInput("Medical Centre Name", "medicalCentreName")}
      {renderInput("Phone", "medicalPhone")}
      {renderInput("Support Coordinator Name", "supportCoordinatorName")}
      {renderInput("Support Coordinator Email", "supportCoordinatorEmail")}
      {renderInput("Support Coordinator Company", "supportCoordinatorCompany")}
      {renderInput("Support Coordinator Contact", "supportCoordinatorContact")}
      {renderTextArea("Other Supports", "otherSupports")}
      {renderInput("Advocate Name", "advocateName")}
      {renderInput("Advocate Email", "advocateEmail")}
      {renderInput("Advocate Phone", "advocatePhone")}
      {renderInput("Advocate Mobile", "advocateMobile")}
      {renderInput("Advocate Address", "advocateAddress")}
      {renderInput("Advocate Postal Address", "advocatePostalAddress")}
      {renderTextArea("Advocate Other Information", "advocateOtherInfo")}
      {renderInput("Relationship with Participant", "advocateRelationship")}
      {renderDropdown("Cultural, Communication Barriers or Intimacy Issues", "barriers", yesNoOptions)}
      {renderInput("Language", "language")}
      {renderDropdown("Interpreter Needed?", "interpreter", yesNoOptions)}
      {renderInput("Country of Birth", "countryOfBirth")}
      {renderInput("Cultural Values", "culturalValues")}
      {renderInput("Cultural Behaviours", "culturalBehaviours")}
      {renderInput("Written Communication / Literacy", "writtenCommunication")}
      {renderInput("Primary Contact Name", "primaryContactName")}
      {renderInput("Primary Contact Relationship", "primaryContactRelationship")}
      {renderInput("Primary Contact Home Phone", "primaryContactHomePhone")}
      {renderInput("Primary Contact Mobile", "primaryContactMobile")}
      {renderInput("Secondary Contact Name", "secondaryContactName")}
      {renderInput("Secondary Contact Relationship", "secondaryContactRelationship")}
      {renderInput("Secondary Contact Home Phone", "secondaryContactHomePhone")}
      {renderInput("Secondary Contact Mobile", "secondaryContactMobile")}
      {renderMultiSelectCheckbox("Living Arrangements", "livingArrangements", livingArrangementsOptions)}
      {renderInput("Other Living Arrangement", "livingArrangementsOther")}
      {renderMultiSelectCheckbox("Travel Arrangements", "travelArrangements", travelArrangementsOptions)}
      {renderInput("Other Travel Arrangement", "travelArrangementsOther")}
      {renderCheckboxGroup("Requires Medication Chart?", "medicationChart", yesNoOptions)}
      {renderCheckboxGroup("Requires Mealtime Management?", "mealtimeManagement", yesNoOptions)}
      {renderCheckboxGroup("Requires Bowel Care Management?", "bowelCare", yesNoOptions)}
      {renderDropdown("Menstrual Cycle Issues / Female Hygiene Help", "menstrualIssues", yesNoOptions)}
      {renderDropdown("Has Epilepsy?", "epilepsy", yesNoOptions)}
      {renderDropdown("Is Asthmatic?", "asthmatic", yesNoOptions)}
      {renderDropdown("Has Allergies?", "allergies", yesNoOptions)}
      {renderDropdown("Is Anaphylactic?", "anaphylactic", yesNoOptions)}
      {renderDropdown("Can Staff Administer Band-aids?", "minorInjury", yesNoOptions)}
      {renderDropdown("Requires Specific Training?", "training", yesNoOptions)}
      {renderDropdown("Other Relevant Medication Conditions?", "othermedical", yesNoOptions)}
      {renderDropdown("Triggers for Community Activities?", "trigger", yesNoOptions)}
      {renderDropdown("History of Absconding?", "absconding", yesNoOptions)}
      {renderDropdown("Prone to Falls?", "historyOfFalls", yesNoOptions)}
      {renderDropdown("Behaviours of Concern?", "behaviourConcern", yesNoOptions)}
      {renderDropdown("Positive Behaviour Plan In Place?", "positiveBehaviour", yesNoOptions)}
      {renderDropdown("Risk Plan Communication Mode Set?", "communicationAssistance", yesNoOptions)}
      {renderDropdown("Requires Physical Assistance?", "physicalAssistance", yesNoOptions)}
      {renderDropdown("Expressive Language Concerns?", "languageConcern", yesNoOptions)}
      {renderTextArea("Personal Preferences & Personal Goals", "personalGoals")}

    </form>
  );
};

export default ClientIntakeForm;
