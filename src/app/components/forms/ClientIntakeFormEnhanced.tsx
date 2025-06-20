"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaHome, FaPhone, FaUserMd, FaShieldAlt, FaHeart, FaBullseye, FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa";

interface FormProps {
  formData: any;
  commonFieldsData: any;
  onChange: (values: any) => void;
  onSubmit?: (values: any) => void;
  readOnly?: boolean;
  fieldErrors?: Record<string, string>;
}

// Form sections configuration
const FORM_SECTIONS = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: FaUser,
    description: 'Basic personal details and identification'
  },
  {
    id: 'contact',
    title: 'Contact & Address',
    icon: FaHome,
    description: 'Contact information and residential details'
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    icon: FaPhone,
    description: 'Primary and secondary emergency contacts'
  },
  {
    id: 'medical',
    title: 'Medical Information',
    icon: FaUserMd,
    description: 'Medical conditions and healthcare providers'
  },
  {
    id: 'support',
    title: 'Support Services',
    icon: FaShieldAlt,
    description: 'Support coordinators and advocacy services'
  },
  {
    id: 'health',
    title: 'Health & Safety',
    icon: FaHeart,
    description: 'Health conditions and safety considerations'
  },
  {
    id: 'goals',
    title: 'Goals & Preferences',
    icon: FaBullseye,
    description: 'Personal goals and preferences'
  }
];

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
  "Other:"
];

const travelArrangementsOptions = [
  "Taxi",
  "Pick up/ drop off by Parent/Family/Support Person",
  "Transport by a provider",
  "Independently use Public Transport",
  "Walk",
  "Assisted Public Transport",
  "Drive own car.",
  "Other, please specify: "
];

const ClientIntakeFormEnhanced: React.FC<FormProps> = ({ 
  formData, 
  commonFieldsData, 
  onChange, 
  onSubmit, 
  readOnly = false, 
  fieldErrors = {} 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
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

  // Pre-populate with common fields
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
  }, [localValues, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < FORM_SECTIONS.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.has(stepIndex);
  };

  const getProgressPercentage = () => {
    return ((completedSteps.size + (currentStep > 0 ? 1 : 0)) / FORM_SECTIONS.length) * 100;
  };

  // Input rendering utilities with responsive design
  const renderInput = (label: string, name: string, type: string = "text", placeholder?: string) => (
    <div className="space-y-1 lg:space-y-2">
      <label className="block text-sm lg:text-base font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={readOnly || (commonFieldsMapping[name] && commonFieldsData?.[commonFieldsMapping[name]])}
        className={`w-full px-3 py-2 lg:px-4 lg:py-3 xl:px-3 xl:py-2 text-sm lg:text-base border-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          fieldErrors[name] 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
        } ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
      />
      {fieldErrors[name] && (
        <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{fieldErrors[name]}</span>
        </p>
      )}
    </div>
  );

  const renderTextArea = (label: string, name: string, rows: number = 3, placeholder?: string) => (
    <div className="space-y-1 lg:space-y-2">
      <label className="block text-sm lg:text-base font-semibold text-gray-700">{label}</label>
      <textarea
        name={name}
        value={localValues[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        disabled={readOnly}
        className={`w-full px-3 py-2 lg:px-4 lg:py-3 xl:px-3 xl:py-2 text-sm lg:text-base border-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
          fieldErrors[name] 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
        } ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
      />
      {fieldErrors[name] && (
        <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{fieldErrors[name]}</span>
        </p>
      )}
    </div>
  );

  const renderDropdown = (
    label: string,
    name: string,
    options: string[],
    showIfYes?: {
      label: string;
      inputName?: string;
    }
  ) => (
    <div className="space-y-3 lg:space-y-4">
      <div className="space-y-1 lg:space-y-2">
        <label className="block text-sm lg:text-base font-semibold text-gray-700">{label}</label>
        <select
          name={name}
          value={localValues[name] || ""}
          onChange={handleChange}
          disabled={readOnly}
          className={`w-full px-3 py-2 lg:px-4 lg:py-3 xl:px-3 xl:py-2 text-sm lg:text-base border-2 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            fieldErrors[name] 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
          } ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {fieldErrors[name] && (
          <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1">
            <span>⚠️</span>
            <span>{fieldErrors[name]}</span>
          </p>
        )}
      </div>

      {showIfYes && localValues[name] === "Yes" && (
        <div className="ml-2 lg:ml-4 p-3 lg:p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <label className="block text-sm lg:text-base font-semibold text-blue-800 mb-2">{showIfYes.label}</label>
          {showIfYes.inputName && (
            <>
              <input
                type="text"
                name={showIfYes.inputName}
                value={localValues[showIfYes.inputName] || ""}
                onChange={handleChange}
                disabled={readOnly}
                className={`w-full px-3 py-2 text-sm lg:text-base border rounded-lg ${
                  fieldErrors[showIfYes.inputName] 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-blue-200 focus:border-blue-500'
                }`}
              />
              {fieldErrors[showIfYes.inputName] && (
                <p className="mt-1 text-xs lg:text-sm text-red-600">{fieldErrors[showIfYes.inputName]}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderMultiSelectCheckbox = (label: string, name: string, options: string[]) => (
    <div className="space-y-2 lg:space-y-3">
      <label className={`block text-sm lg:text-base font-semibold ${fieldErrors[name] ? 'text-red-600' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-start space-x-2 lg:space-x-3 p-2 lg:p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
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
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
            />
            <span className="text-xs lg:text-sm text-gray-700 flex-1 leading-tight">{option}</span>
          </label>
        ))}
      </div>
      {fieldErrors[name] && (
        <p className="text-xs lg:text-sm text-red-600 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{fieldErrors[name]}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4">
        <h1 className="text-xl font-bold text-white mb-2">Client Intake Form</h1>
        <p className="text-blue-100 text-sm">Step {currentStep + 1} of {FORM_SECTIONS.length}</p>
        
        {/* Mobile Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-100 mb-2">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-0">
        {/* Sidebar Navigation - Hidden on mobile, collapsible on tablet */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 bg-white border-r border-gray-200 shadow-lg">
          {/* Desktop Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
            <h1 className="text-2xl xl:text-3xl font-bold text-white mb-2">Client Intake Form</h1>
            <p className="text-blue-100 text-sm xl:text-base">Please complete all sections to proceed</p>
            
            {/* Desktop Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 xl:p-6 space-y-2 overflow-y-auto">
            {FORM_SECTIONS.map((section, index) => {
              const Icon = section.icon;
              const isActive = currentStep === index;
              const isCompleted = isStepCompleted(index);
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleStepClick(index)}
                  className={`w-full text-left p-3 xl:p-4 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                      : isCompleted
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isActive 
                        ? 'bg-white bg-opacity-20' 
                        : isCompleted
                        ? 'bg-green-100'
                        : 'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <FaCheck className="w-4 h-4 xl:w-5 xl:h-5 text-green-600" />
                      ) : (
                        <Icon className={`w-4 h-4 xl:w-5 xl:h-5 ${
                          isActive ? 'text-white' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm xl:text-base truncate ${isActive ? 'text-white' : ''}`}>
                        {section.title}
                      </div>
                      <div className={`text-xs xl:text-sm line-clamp-2 ${
                        isActive ? 'text-blue-100' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white lg:bg-gray-50">
          {/* Content Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 lg:py-6 xl:px-8 xl:py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
                  {FORM_SECTIONS[currentStep].title}
                </h2>
                <p className="text-sm lg:text-base text-gray-600">
                  {FORM_SECTIONS[currentStep].description}
                </p>
              </div>
              
              {/* Mobile Step Indicator */}
              <div className="lg:hidden flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {currentStep + 1}/{FORM_SECTIONS.length}
                </span>
              </div>
            </div>
          </div>

          {/* Form Content Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 xl:p-8">
              <div className="max-w-none xl:max-w-7xl mx-auto">

          {/* Form Content */}
          <div className="space-y-6">
            {/* Personal Information Section */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput("NDIS Number", "ndisNumber", "text", "Enter your NDIS number")}
                {renderInput("Given Name", "givenName", "text", "Enter your first name")}
                {renderInput("Surname", "surname", "text", "Enter your last name")}
                {renderInput("Preferred Name", "preferredName", "text", "How would you like to be called?")}
                {renderInput("Date of Birth", "dateOfBirth", "date")}
                {renderDropdown("Sex", "sex", ["Male", "Female", "Other"])}
                {renderInput("Pronoun", "pronoun", "text", "e.g., he/him, she/her, they/them")}
                {renderDropdown("Aboriginal or Torres Strait Islander?", "aboriginalTorres", yesNoOptions)}
                <div className="md:col-span-2">
                  {renderTextArea("Disability Conditions/Disability type(s)", "disabilityConditions", 3, "Please describe your disability conditions or types")}
                </div>
              </div>
            )}

            {/* Contact & Address Section */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  {renderInput("Address (Number/Street)", "addressNumberStreet", "text", "Enter your street address")}
                </div>
                {renderInput("State", "state", "text", "Enter your state")}
                {renderInput("Postcode", "postcode", "text", "Enter your postcode")}
                {renderInput("Email", "email", "email", "Enter your email address")}
                {renderInput("Home Phone", "homePhone", "tel", "Enter your home phone number")}
                {renderInput("Mobile", "mobile", "tel", "Enter your mobile number")}
                {renderInput("Language", "language", "text", "Primary language spoken")}
                {renderDropdown("Interpreter Needed?", "interpreter", yesNoOptions)}
                {renderInput("Country of Birth", "countryOfBirth", "text", "Enter your country of birth")}
                <div className="md:col-span-2">
                  {renderMultiSelectCheckbox("Living Arrangements", "livingArrangements", livingArrangementsOptions)}
                </div>
                <div className="md:col-span-2">
                  {renderMultiSelectCheckbox("Travel Arrangements", "travelArrangements", travelArrangementsOptions)}
                </div>
              </div>
            )}

            {/* Emergency Contacts Section */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Primary Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Name", "primaryContactName", "text", "Primary contact's full name")}
                    {renderInput("Relationship", "primaryContactRelationship", "text", "Relationship to you")}
                    {renderInput("Home Phone", "primaryContactHomePhone", "tel", "Home phone number")}
                    {renderInput("Mobile", "primaryContactMobile", "tel", "Mobile phone number")}
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Secondary Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Name", "secondaryContactName", "text", "Secondary contact's full name")}
                    {renderInput("Relationship", "secondaryContactRelationship", "text", "Relationship to you")}
                    {renderInput("Home Phone", "secondaryContactHomePhone", "tel", "Home phone number")}
                    {renderInput("Mobile", "secondaryContactMobile", "tel", "Mobile phone number")}
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4">Advocate Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Advocate Name", "advocateName", "text", "Advocate's full name")}
                    {renderInput("Advocate Email", "advocateEmail", "email", "Advocate's email")}
                    {renderInput("Advocate Phone", "advocatePhone", "tel", "Advocate's phone")}
                    {renderInput("Advocate Mobile", "advocateMobile", "tel", "Advocate's mobile")}
                    {renderInput("Relationship with Participant", "advocateRelationship", "text", "Relationship to you")}
                    <div className="md:col-span-2">
                      {renderInput("Advocate Address", "advocateAddress", "text", "Advocate's address")}
                    </div>
                    <div className="md:col-span-2">
                      {renderTextArea("Additional Information", "advocateOtherInfo", 3, "Any additional information about your advocate")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Information Section */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Medical Centre Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Medical Centre Name", "medicalCentreName", "text", "Name of your medical centre")}
                    {renderInput("Medical Centre Phone", "medicalPhone", "tel", "Medical centre phone number")}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {renderDropdown("Cultural, Communication Barriers or Intimacy Issues", "barriers", yesNoOptions)}
                  {renderInput("Cultural Values", "culturalValues", "text", "Important cultural values")}
                  {renderInput("Cultural Behaviours", "culturalBehaviours", "text", "Important cultural behaviours")}
                  {renderInput("Written Communication / Literacy", "writtenCommunication", "text", "Communication preferences")}
                </div>
              </div>
            )}

            {/* Support Services Section */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-4">Support Coordinator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInput("Support Coordinator Name", "supportCoordinatorName", "text", "Coordinator's name")}
                    {renderInput("Support Coordinator Email", "supportCoordinatorEmail", "email", "Coordinator's email")}
                    {renderInput("Support Coordinator Company", "supportCoordinatorCompany", "text", "Company name")}
                    {renderInput("Support Coordinator Contact", "supportCoordinatorContact", "tel", "Contact number")}
                  </div>
                </div>
                <div>
                  {renderTextArea("Other Supports", "otherSupports", 4, "Describe any other support services you receive")}
                </div>
              </div>
            )}

            {/* Health & Safety Section */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {renderDropdown("Requires Medication Chart?", "medicationChart", yesNoOptions, { 
                    label: "If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment", 
                    inputName: 'medicationChartOthers' 
                  })}
                  {renderDropdown("Requires Mealtime Management?", "mealtimeManagement", yesNoOptions, { 
                    label: "If yes, refer to Mealtime Management Plan Form" 
                  })}
                  {renderDropdown("Requires Bowel Care Management?", "bowelCare", yesNoOptions, { 
                    label: "If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care.", 
                    inputName: "bowelCareOthers"
                  })}
                  {renderDropdown("Menstrual Cycle Issues / Female Hygiene Help", "menstrualIssues", yesNoOptions, { 
                    label: "If yes, Please specify", 
                    inputName: "menstrualIssuesOthers"
                  })}
                  {renderDropdown("Has Epilepsy?", "epilepsy", yesNoOptions, {
                    label: 'If yes, ensure Participant\'s Doctor completes an Epilepsy Plan', 
                    inputName: 'epilepsyOthers'
                  })}
                  {renderDropdown("Is Asthmatic?", "asthmatic", yesNoOptions, {
                    label: 'If yes, ensure Participant\'s Doctor completes an Asthma Plan', 
                    inputName: 'asthmaticOthers'
                  })}
                  {renderDropdown("Has Allergies?", "allergies", yesNoOptions, {
                    label: 'If yes, ensure to have an Allergy Plan from Participant\'s Doctor', 
                    inputName: 'allergiesOthers'
                  })}
                  {renderDropdown("Is Anaphylactic?", "anaphylactic", yesNoOptions, {
                    label: 'If yes, ensure to have an anaphylaxis Plan from the Participant\'s Doctor', 
                    inputName: 'anaphylacticOthers'
                  })}
                  {renderDropdown("Do you give permission for our company's staff to administer band-aids in cases of a minor injury?", "minorInjury", yesNoOptions)}
                  {renderDropdown("Requires Specific Training?", "training", yesNoOptions, {
                    label: 'If yes, ensure to provide information such as implementing a positive behaviour support plan.', 
                    inputName: 'trainingOthers'
                  })}
                </div>
              </div>
            )}

            {/* Goals & Preferences Section */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {renderDropdown("Other Relevant Medication Conditions?", "othermedical", yesNoOptions, {
                    label: 'If yes, please specify.', 
                    inputName: 'othermedicalOthers'
                  })}
                  {renderDropdown("Triggers for Community Activities?", "trigger", yesNoOptions, {
                    label: 'If yes, please specify and complete the Risk assessment for participants.', 
                    inputName: 'triggerOthers'
                  })}
                  {renderDropdown("Does the Participant show signs or a history of unexpectedly leaving (absconding)?", "absconding", yesNoOptions, {
                    label: 'If yes, please specify.', 
                    inputName: 'abscondingOthers'
                  })}
                  {renderDropdown("Prone to Falls?", "historyOfFalls", yesNoOptions)}
                  {renderDropdown("Behaviours of Concern?", "behaviourConcern", yesNoOptions, {
                    label: 'If yes, please specify.', 
                    inputName: 'behaviourConcernOthers'
                  })}
                  {renderDropdown("Positive Behaviour Plan In Place?", "positiveBehaviour", yesNoOptions, {
                    label: 'If yes, refer to High Risk Participant Register.', 
                    inputName: 'positiveBehaviourOthers'
                  })}
                  {renderDropdown("Does the participant require communication assistance?", "communicationAssistance", yesNoOptions, {
                    label: 'If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan.', 
                    inputName: 'communicationAssistanceOthers'
                  })}
                  {renderDropdown("Requires Physical Assistance?", "physicalAssistance", yesNoOptions, {
                    label: 'If yes, specify.', 
                    inputName: 'physicalAssistanceOthers'
                  })}
                  {renderDropdown("Expressive Language Concerns?", "languageConcern", yesNoOptions, {
                    label: 'If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication.', 
                    inputName: 'languageConcernOthers'
                  })}
                  {renderDropdown("Personal Preferences & Personal Goals", "personalGoals", yesNoOptions, {
                    label: 'If yes, refer to form Support Plan'
                  })}
                </div>
              </div>
            )}
          </div>

              </div>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden bg-white border-t border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-1">
                {FORM_SECTIONS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep
                        ? 'bg-blue-600'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentStep === FORM_SECTIONS.length - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === FORM_SECTIONS.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>Next</span>
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden lg:block bg-white border-t border-gray-200 px-6 py-4 xl:px-8 xl:py-6">
            <div className="flex justify-between max-w-none xl:max-w-7xl mx-auto">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg'
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === FORM_SECTIONS.length - 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === FORM_SECTIONS.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                <span>Next</span>
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientIntakeFormEnhanced;
