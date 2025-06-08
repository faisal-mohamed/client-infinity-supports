// CombinedClientFormGrid.tsx (Pages 1–4, fully expanded)
"use client";

import React, { useRef } from "react";


const formData = {
  // Page 1
  date: "",
  ndisNumber: "",
  givenName: "",
  surname: "",
  sex: [],
  sexOther: "",
  pronoun: "",
  aboriginal: [],
  preferredName: "",
  dob: "",
  street: "",
  state: "sdfgh",
  postcode: "",
  email: "",
  homePhone: "",
  mobile: "",
  disability: "",

  // Page 2
  medicalCentre: "",
  medicalPhone: "",
  coordinatorName: "",
  coordinatorEmail: "",
  coordinatorCompany: "",
  coordinatorContact: "",
  otherSupports: "",

  // Page 3
  advocateName: "",
  advocateRelation: "",
  advocatePhone: "",
  advocateMobile: "",
  advocateEmail: "",
  advocateAddress: "",
  postalAddress: "",
  otherInfo: "",
  culturalBarriers: [],
  interpreterNeeded: "",
  spokenLanguage: "",
  culturalValues: "",
  culturalBehaviours: "",
  literacy: "",
  countryOfBirth: "",

  // Page 4
  primaryContactName: "",
  primaryRelationship: "",
  primaryHomePhone: "",
  primaryMobile: "",
  secondaryContactName: "",
  secondaryRelationship: "",
  secondaryHomePhone: "",
  secondaryMobile: "",
  livingArrangements: [],
  otherLiving: "",
  travelMethods: [],
  otherTravel: ""
};

const uiSchema = [
  // Page 1
  { type: "title", label: "Client Intake Form" },
  { type: "field", label: "Date", key: "date" },
  { type: "field", label: "NDIS Number", key: "ndisNumber" },
  { type: "field", label: "Given Name", key: "givenName" },
  { type: "field", label: "Surname", key: "surname" },
  { type: "checkbox-group", label: "Sex", key: "sex", options: ["Male", "Female", "Prefer not to say"] },
  { type: "field", label: "Other (Sex)", key: "sexOther" },
  { type: "field", label: "Pronoun", key: "pronoun" },
  { type: "checkbox-group", label: "Are you an Aboriginal or Torres Strait Island descent?", key: "aboriginal", options: ["Yes", "No"] },
  { type: "field", label: "Preferred Name", key: "preferredName" },
  { type: "field", label: "Date of Birth", key: "dob" },
  { type: "field", label: "Street", key: "street" },
  { type: "field", label: "State", key: "state" },
  { type: "field", label: "Postcode", key: "postcode" },
  { type: "field", label: "Email", key: "email" },
  { type: "field", label: "Home Phone No", key: "homePhone" },
  { type: "field", label: "Mobile No", key: "mobile" },
  { type: "textarea", label: "Disability Details", key: "disability" },

  // Page 2
  { type: "title", label: "GP & Support Coordinator" },
  { type: "field", label: "Medical Centre", key: "medicalCentre" },
  { type: "field", label: "Medical Phone", key: "medicalPhone" },
  { type: "field", label: "Support Coordinator Name", key: "coordinatorName" },
  { type: "field", label: "Coordinator Email", key: "coordinatorEmail" },
  { type: "field", label: "Coordinator Company", key: "coordinatorCompany" },
  { type: "field", label: "Coordinator Contact No", key: "coordinatorContact" },
  { type: "textarea", label: "Other Supports/Agencies Involved", key: "otherSupports" },

  // Page 3
  { type: "title", label: "Advocate / Representative Details" },
  { type: "field", label: "Advocate Name", key: "advocateName" },
  { type: "field", label: "Relationship with Participant", key: "advocateRelation" },
  { type: "field", label: "Phone No", key: "advocatePhone" },
  { type: "field", label: "Mobile No", key: "advocateMobile" },
  { type: "field", label: "Email", key: "advocateEmail" },
  { type: "field", label: "Address", key: "advocateAddress" },
  { type: "field", label: "Postal Address", key: "postalAddress" },
  { type: "textarea", label: "Other Information", key: "otherInfo" },
  { type: "checkbox-group", label: "Any cultural/communication/intimacy issues?", key: "culturalBarriers", options: ["Yes", "No"] },
  { type: "field", label: "Interpreter Needed?", key: "interpreterNeeded" },
  { type: "field", label: "Spoken Language", key: "spokenLanguage" },
  { type: "field", label: "Cultural Values/Beliefs", key: "culturalValues" },
  { type: "field", label: "Cultural Behaviours", key: "culturalBehaviours" },
  { type: "field", label: "Written Literacy", key: "literacy" },
  { type: "field", label: "Country of Birth", key: "countryOfBirth" },

  // Page 4
  { type: "title", label: "Primary Contact" },
  { type: "field", label: "Contact Name", key: "primaryContactName" },
  { type: "field", label: "Relationship", key: "primaryRelationship" },
  { type: "field", label: "Home Phone No", key: "primaryHomePhone" },
  { type: "field", label: "Mobile No", key: "primaryMobile" },

  { type: "title", label: "Secondary Contact" },
  { type: "field", label: "Contact Name", key: "secondaryContactName" },
  { type: "field", label: "Relationship", key: "secondaryRelationship" },
  { type: "field", label: "Home Phone No", key: "secondaryHomePhone" },
  { type: "field", label: "Mobile No", key: "secondaryMobile" },

  { type: "title", label: "Living and Support Arrangements" },
  { type: "checkbox-group", label: "What is your current living arrangement?", key: "livingArrangements", options: [
    "Live with Parent/Family/Support Person",
    "Live in private rental arrangement with others",
    "Live in private rental arrangement alone",
    "Owns own home.",
    "Aged Care Facility",
    "Mental Health Facility",
    "Lives in public housing",
    "Short Term Crisis/Respite",
    "Staff Supported Group Home",
    "Hostel/SRS Private Accommodation"
  ] },
  { type: "field", label: "Other Living Arrangement", key: "otherLiving" },

  { type: "title", label: "Travel" },
  { type: "checkbox-group", label: "How do you travel to your day service?", key: "travelMethods", options: [
    "Taxi",
    "Pick up/ drop off by Parent/Family/Support Person",
    "Transport by a provider",
    "Independently use Public Transport",
    "Walk",
    "Assisted Public Transport",
    "Drive own car."
  ] },
  { type: "field", label: "Other Travel Method", key: "otherTravel" }
];

const FieldRenderer = ({ field, value }: any) => {
  if (field.type === "title") {
    return <div className="col-span-3 text-center font-bold border border-black py-1 bg-gray-200">{field.label}</div>;
  }
  if (field.type === "field") {
    return (
      <div className="border border-black px-2 py-1 text-xs">
        <span className="font-semibold mr-1">{field.label}</span>{value || ""}
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div className="col-span-3 border border-black px-2 py-1 text-xs h-24 whitespace-pre-wrap">
        <span className="font-semibold block mb-1">{field.label}</span>
        {value || ""}
      </div>
    );
  }
  if (field.type === "checkbox-group") {
    return (
      <div className="col-span-3 border border-black px-2 py-1 text-xs">
        <span className="font-semibold block mb-1">{field.label}</span>
        <div className="flex flex-col gap-1">
          {field.options.map((opt: string, i: number) => (
            <label key={i} className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-1 w-3 h-3"
                checked={value?.includes(opt)}
                readOnly
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    );
  }
  return null;
};



export default function CombinedClientFormGrid() {
  

const printRef = useRef<HTMLDivElement>(null);

 

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "GET", // use POST if your route supports it, otherwise change to GET
      
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "form.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    }
  };



  return (
    <div ref={printRef}>
        <div style={{ width: "210mm", minHeight: "297mm", padding: "10mm", background: "white" }}>
          <div className="max-w-[700px] mx-auto border border-black text-xs">
      <div className="grid grid-cols-3">
        {uiSchema.map((field, idx) => (
          <div key={idx} className={field.type === "textarea" || field.type === "title" || field.type === "checkbox-group" ? "col-span-3" : ""}>
            <FieldRenderer field={field} value={formData[field.key]} />
          </div>
        ))}
      </div>
    

    <button onClick={handleDownload}>Download</button>  
    </div>
        </div>
    </div>
  );
}
