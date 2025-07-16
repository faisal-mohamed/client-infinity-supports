"use client";


import { riskAssessmentSchema, formData } from "@/app/form-components/participant-risk-assessment/page";
import React, { useState } from "react";
import { FaClipboardList, FaHome, FaMapMarkerAlt, FaShieldAlt, FaSignature, FaUser } from "react-icons/fa";
// Build FORM_SECTIONS by collecting all field keys from all possible arrays in each section
const FORM_SECTIONS = Object.entries(riskAssessmentSchema).map(([id, section]) => {
  const fieldArrays = [
    (section as any).fields,
    (section as any).participantDetails,
    (section as any).knownMedicalConditions,
    (section as any).emergencyContact,
    (section as any).personsInvolved,
    (section as any).householdMeetingPoint,
    (section as any).riskRows,
    (section as any).communicationTable?.fields,
  ];
  const fields: string[] = [];
  for (const arr of fieldArrays) {
    if (Array.isArray(arr)) {
      for (const f of arr) {
        if (f && typeof f === 'object' && 'key' in f) fields.push(f.key);
      }
    }
  }
  return {
    id,
    title: (section as any).title || id,
    description: (section as any).description || '',
    fields,
  };
});
// Sectionize schema pages for stepper navigation
const SCHEMA_SECTIONS = Object.entries(riskAssessmentSchema).map(([id, section]) => ({ id, ...section }));

const getInitialValues = () => ({ ...formData });

// Field type mapping for rendering
const FIELD_TYPE_MAP: Record<string, string> = {
  text: "text",
  date: "date",
  checkbox: "checkbox",
  radio: "radio",
  "checkbox-yesno": "radio",
  "multi-checkbox": "multi-checkbox",
  signature: "signature",
};

// --- Input Renderers ---
function renderInput(field: any, value: any, onChange: (key: string, value: any) => void, error?: string) {
  return (
    <div key={field.key} className="flex flex-col gap-1 mb-4">
      <label className="text-xs font-medium text-gray-700 mb-1">{field.label}</label>
      <input
        type={field.type === "date" ? "date" : "text"}
        name={field.key}
        value={value}
        onChange={e => onChange(field.key, e.target.value)}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder-gray-400 ${error ? "border-red-300 bg-red-50" : "hover:border-accent/40"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function renderCheckbox(field: any, value: any, onChange: (key: string, value: any) => void, error?: string) {
  return (
    <div key={field.key} className="flex items-center gap-2 mb-4">
      <input
        type="checkbox"
        checked={!!value}
        onChange={e => onChange(field.key, e.target.checked)}
        className="w-4 h-4 accent-accent rounded border-gray-300 focus:ring-accent"
      />
      <label className="text-xs font-medium text-gray-700">{field.label}</label>
      {error && <p className="text-xs text-red-500 ml-2">{error}</p>}
    </div>
  );
}

function renderRadio(field: any, value: any, onChange: (key: string, value: any) => void, error?: string) {
  return (
    <div key={field.key} className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
      <div className="flex gap-4">
        {field.options?.map((opt: string) => (
          <label key={opt} className="flex items-center gap-1 text-xs">
            <input
              type="radio"
              name={field.key}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(field.key, opt)}
              className="accent-accent"
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function renderMultiCheckbox(field: any, value: any, onChange: (key: string, value: any) => void, error?: string) {
  return (
    <div key={field.key} className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
      <div className="flex flex-col gap-1">
        {field.options?.map((opt: string) => (
          <label key={opt} className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={Array.isArray(value) && value.includes(opt)}
              onChange={e => {
                let arr = Array.isArray(value) ? [...value] : [];
                if (e.target.checked) arr.push(opt);
                else arr = arr.filter((v) => v !== opt);
                onChange(field.key, arr);
              }}
              className="accent-accent"
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}





function renderField(field: any, value: any, onChange: (key: string, value: any) => void, error?: string) {
  const type = FIELD_TYPE_MAP[field.type] || "text";
  switch (type) {
    case "text":
    case "date":
      return renderInput(field, value, onChange, error);
    case "checkbox":
      return renderCheckbox(field, value, onChange, error);
    case "radio":
      return renderRadio(field, value, onChange, error);
    case "multi-checkbox":
      return renderMultiCheckbox(field, value, onChange, error);
    default:
      return null;
  }
}

// --- Section Field Extraction ---
function getSectionFields(section: any) {
  const possibleKeys = [
    "fields",
    "participantDetails",
    "knownMedicalConditions",
    "emergencyContact",
    "personsInvolved",
    "householdMeetingPoint",
  ];
  let fields: any[] = [];
  for (const key of possibleKeys) {
    if (Array.isArray(section[key])) fields = fields.concat(section[key]);
  }
  // Special handling for riskRows
  if (Array.isArray(section["riskRows"])) {
    section["riskRows"].forEach((row: any) => {
      if (row.issue) fields.push({ key: row.issue, label: row.issue, type: "text" });
      if (row.score) fields.push({ key: row.score, label: row.score, type: "text" });
      if (row.control) fields.push({ key: row.control, label: row.control, type: "text" });
      if (row.person) fields.push({ key: row.person, label: row.person, type: "text" });
    });
  }
  // Special handling for communicationTable
  if (section["communicationTable"] && Array.isArray(section["communicationTable"].fields)) {
    fields = fields.concat(section["communicationTable"].fields);
  }
  return fields;
}

// --- Section Title/Description Helpers ---
function getSectionTitle(sec: any) {
  return typeof sec.title === 'string' ? sec.title : (typeof sec.id === 'string' ? sec.id : 'Section');
}
function getSectionDescription(sec: any) {
  return typeof sec.description === 'string' ? sec.description : '';
}

// --- Main Component ---
const ParticipantRiskAssessmentEdit: React.FC = () => {
  const [values, setValues] = useState(getInitialValues());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setCurrentStep((s: number) => Math.min(s + 1, SCHEMA_SECTIONS.length - 1));
  const handlePrev = () => setCurrentStep((s: number) => Math.max(s - 1, 0));

  // --- Section Rendering ---
  const section = SCHEMA_SECTIONS[currentStep];
  const fields = getSectionFields(section);

  return (
    <div className="w-full flex flex-col items-center justify-center flex-1">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2 md:pt-6 px-2">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-green-400 rounded-full transition-all" style={{ width: `${((currentStep + 1) / SCHEMA_SECTIONS.length) * 100}%` }} />
        </div>
        {/* Horizontal Stepper */}
        <nav className="flex items-center justify-between gap-2 overflow-visible pb-2 relative">
          {SCHEMA_SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              className={`flex flex-col items-center gap-1 px-2 focus:outline-none ${idx === currentStep ? "text-blue-600 font-bold" : "text-gray-400"}`}
              onClick={() => setCurrentStep(idx)}
              disabled={idx > currentStep + 1}
            >
              <span className="w-2 h-2 rounded-full mb-1" style={{ background: idx === currentStep ? '#6366f1' : idx < currentStep ? '#22c55e' : '#e5e7eb' }} />
              <span className="text-[10px] font-semibold">{getSectionTitle(sec)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Form Card */}
      <main className="w-full flex flex-col items-center justify-center flex-1">
        <section className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-8 flex flex-col mt-2 md:mt-4 animate-fade-in gap-4 md:gap-8">
          {/* Section Header */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
              {getSectionTitle(section)}
            </h2>
            {getSectionDescription(section) && <p className="text-sm text-gray-500 font-medium mt-1">{getSectionDescription(section)}</p>}
          </div>

          <form autoComplete="off" className="flex flex-col gap-6">
            <div className="space-y-4 md:space-y-8">
              {fields.map((field: any) =>
                renderField(field, (values as Record<string, any>)[field.key], handleChange, errors[field.key])
              )}
            </div>
          </form>
        </section>

        {/* Navigation Buttons */}
        <footer className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 md:px-10 py-5 flex flex-col items-center gap-4 shadow-2xl rounded-b-3xl animate-fade-in mt-2">
          {/* Stepper */}
          <div className="flex flex-row justify-center items-center space-x-2 mb-2">
            {SCHEMA_SECTIONS.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full border duration-200 ${index === currentStep ? "bg-blue-600 border-blue-600 shadow" : index < currentStep ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}`}
              />
            ))}
          </div>

          <div className="flex flex-col w-full gap-2 md:flex-row md:gap-3 md:justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${currentStep === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-gray-700 to-gray-900 text-white border-gray-700 hover:from-gray-800 hover:to-black"}`}
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === SCHEMA_SECTIONS.length - 1}
              className={`flex items-center justify-center space-x-1 px-5 py-2 rounded-full font-semibold transition-all text-sm shadow border duration-200 w-full md:w-1/3 ${(currentStep === SCHEMA_SECTIONS.length - 1) ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : "bg-gradient-to-r from-indigo-600 to-green-400 text-white border-indigo-600 hover:from-indigo-700 hover:to-green-500"}`}
            >
              Next
            </button>
          </div>
        </footer>
      </main>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
};

export default ParticipantRiskAssessmentEdit;
