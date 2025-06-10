import React, { useState, useEffect } from 'react';
import { FaAsterisk, FaArrowRight } from 'react-icons/fa';

const ClientIntakeForm = ({ commonFieldsData }) => {
  const [formData, setFormData] = useState({
    // Participant Details
    date: new Date().toISOString().split('T')[0], // Default to today's date
    ndisNumber: '',
    givenName: '',
    surname: '',
    sex: [], // For multiple options, use an array
    pronoun: '',
    aboriginalTorres: [], // Aboriginal or Torres Strait Island descent options
    preferredName: '',
    dateOfBirth: '',

    // Residential Address Details
    addressNumberStreet: '',
    state: '',
    postcode: '',

    // Participant Contact Details
    email: '',
    homePhone: '',
    mobile: '',

    // Disability Conditions
    disabilityConditions: '',

    // GP Medical Contact
    medicalCentreName: '',
    medicalPhone: '',

    // Support Coordinator
    supportCoordinatorName: '',
    supportCoordinatorEmail: '',
    supportCoordinatorCompany: '',
    supportCoordinatorContact: '',

    // Other Supports
    otherSupports: '',

    // All About Me
    advocateName: '',
    advocateRelationship: '',
    advocatePhone: '',
    advocateMobile: '',
    advocateEmail: '',
    advocateAddress: '',
    advocatePostalAddress: '',
    advocateOtherInfo: '',
    barriers: '', // Yes/No field, can be a string like 'yes' or 'no'
    interpreter: '', // Yes/No field
    language: '',
    culturalValues: '',
    culturalBehaviours: '',
    writtenCommunication: '',
    countryOfBirth: '',

    // Contacts, Living and Travel
    primaryContactName: '',
    primaryContactRelationship: '',
    primaryContactHomePhone: '',
    primaryContactMobile: '',
    secondaryContactName: '',
    secondaryContactRelationship: '',
    secondaryContactHomePhone: '',
    secondaryContactMobile: '',
    livingArrangements: [], // Array to hold selected options
    livingArrangementsOther: '', // For "Other" option
    travelArrangements: [], // Array to hold selected options
    travelArrangementsOther: '', // For "Other" option

    // Medication Information
    medicationChart: '', // Yes/No field
    mealtimeManagement: '', // Yes/No field
    bowelCare: '', // Yes/No field
    menstrualIssues: '', // Yes/No field
    epilepsy: '', // Yes/No field
    asthmatic: '', // Yes/No field
    allergies: '', // Yes/No field
    anaphylactic: '', // Yes/No field
    minorInjury: '', // Yes/No field
    training: '', // Yes/No field
    othermedical: '', // Yes/No field
    trigger: '', // Yes/No field

    // Safety Considerations
    absconding: '', // Yes/No field
    historyOfFalls: '', // Yes/No field
    behaviourConcern: '', // Yes/No field
    positiveBehaviour: '', // Yes/No field
    communicationAssistance: '', // Yes/No field
    physicalAssistance: '', // Yes/No field
    languageConcern: '', // Yes/No field
    personalGoals: '', // Yes/No field
  });

  // Define common fields mapping
  const commonFieldsMapping = {
    ndisNumber: 'ndis',
    givenName: 'name',
    sex: 'sex',
    dateOfBirth: 'dob',
    addressNumberStreet: 'street',
    state: 'state',
    postcode: 'postCode',
    email: 'email',
    homePhone: 'phone',
    disabilityConditions: 'disability'
  };

  // Track which fields are mapped from common fields
  const [mappedFields, setMappedFields] = useState({});

  useEffect(() => {
    // Map common fields to the corresponding values in formData
    const mappedData = {};
    const mappedFieldsTracking = {};

    Object.keys(commonFieldsMapping).forEach(key => {
      const commonKey = commonFieldsMapping[key];
      if (commonKey && commonFieldsData && commonFieldsData[commonKey] !== undefined) {
        mappedData[key] = commonFieldsData[commonKey];
        mappedFieldsTracking[key] = true; // Mark this field as mapped
      }
    });

    // Update formData with common field values
    setFormData(prev => ({ ...prev, ...mappedData }));
    // Update tracked mapped fields
    setMappedFields(mappedFieldsTracking);
  }, [commonFieldsData]);

  // Handle input change
  const handleInputChange = (key, value) => {
    // Only allow changes to fields that are not mapped from common fields
    if (!mappedFields[key]) {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  // Handle checkbox change (multiple selections)
  const handleCheckboxChange = (key, option, checked) => {
    // Only allow changes to fields that are not mapped from common fields
    if (!mappedFields[key]) {
      setFormData(prev => {
        const current = prev[key] || [];
        if (checked) {
          return { ...prev, [key]: [...current, option] };
        } else {
          return { ...prev, [key]: current.filter(item => item !== option) };
        }
      });
    }
  };

  // Text Input Component
  const TextInput = ({ label, keyName, type = "text", colSpan = 1, width = "w-full", required = false }) => {
    const isMapped = mappedFields[keyName];
    
    return (
      <div className={`${colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : ''} ${width}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <FaAsterisk className="inline-block text-red-500 text-xs ml-1" />}
        </label>
        <input
          type={type}
          value={formData[keyName] || ""}
          onChange={(e) => handleInputChange(keyName, e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isMapped ? 'bg-gray-100' : ''
          }`}
          required={required}
          disabled={isMapped}
          readOnly={isMapped}
        />
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This field is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  // TextArea Component
  const TextArea = ({ label, keyName, height = 100, colSpan = 1 }) => {
    const isMapped = mappedFields[keyName];
    
    return (
      <div className={`${colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          value={formData[keyName] || ""}
          onChange={(e) => handleInputChange(keyName, e.target.value)}
          style={{ height: `${height}px` }}
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
            isMapped ? 'bg-gray-100' : ''
          }`}
          disabled={isMapped}
          readOnly={isMapped}
        />
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This field is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  // Checkbox Group Component
  const CheckboxGroup = ({ label, keyName, options, colSpan = 1 }) => {
    const isMapped = mappedFields[keyName];
    
    return (
      <div className={`${colSpan === 2 ? 'col-span-2' : colSpan === 3 ? 'col-span-3' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={Array.isArray(formData[keyName]) 
                  ? formData[keyName].includes(option) 
                  : formData[keyName] === option}
                onChange={(e) => handleCheckboxChange(keyName, option, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isMapped}
              />
              <span className={`ml-2 text-sm ${isMapped ? 'text-gray-500' : 'text-gray-700'}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This selection is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  // Yes/No Question Component
  const YesNoQuestion = ({ label, keyName, yesDetail }) => {
    const isMapped = mappedFields[keyName];
    
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="flex space-x-4 mb-3">
          <label className="flex items-center">
            <input
              type="radio"
              name={keyName}
              value="yes"
              checked={formData[keyName] === 'yes'}
              onChange={(e) => handleInputChange(keyName, e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              disabled={isMapped}
            />
            <span className={`ml-2 text-sm ${isMapped ? 'text-gray-500' : 'text-gray-700'}`}>
              Yes
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name={keyName}
              value="no"
              checked={formData[keyName] === 'no'}
              onChange={(e) => handleInputChange(keyName, e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              disabled={isMapped}
            />
            <span className={`ml-2 text-sm ${isMapped ? 'text-gray-500' : 'text-gray-700'}`}>
              No
            </span>
          </label>
        </div>
        {formData[keyName] === 'yes' && yesDetail && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">{yesDetail}</label>
            <textarea
              value={formData[`${keyName}_detail`] || ''}
              onChange={(e) => handleInputChange(`${keyName}_detail`, e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isMapped ? 'bg-gray-100' : ''
              }`}
              rows="3"
              disabled={isMapped}
              readOnly={isMapped}
            />
          </div>
        )}
        {isMapped && (
          <p className="text-xs text-gray-500 mt-1">
            This response is pre-filled from your profile information
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="text-4xl mb-3 font-bold">∞</div>
            <h1 className="text-2xl font-bold mb-1">Infinity Supports WA</h1>
            <p className="text-lg opacity-90">Client Intake Form</p>
            <p className="text-sm opacity-75 mt-1">Achieving Goals and Beyond</p>
          </div>
        </div>

        {/* Pre-filled information notice */}
        {Object.keys(mappedFields).length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Some fields have been pre-filled with your profile information. These fields are read-only.
                </p>
              </div>
            </div>
          </div>
        )}

        <form>
          {/* Participant Details */}
          <SectionHeader title="Participant Details" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput label="Date:" keyName="date" colSpan={2} />
              <TextInput label="NDIS Number:" keyName="ndisNumber" colSpan={2} />
              <TextInput label="Given name(s):" keyName="givenName" />
              <TextInput label="Surname:" keyName="surname" />
              <CheckboxGroup label="Sex:" keyName="sex" options={["Male", "Female", "Prefer not to say"]} />
              <TextInput label="Pronoun:" keyName="pronoun" colSpan={3} />
              <CheckboxGroup label="Are you an Aboriginal or Torres Strait Island descent?" keyName="aboriginalTorres" options={["Yes", "No"]} />
              <TextInput label="Preferred name:" keyName="preferredName" colSpan={2} />
              <TextInput label="Date of Birth:" keyName="dateOfBirth" type="date" />
            </div>
          </div>

          {/* Residential Address Details */}
          <SectionHeader title="Residential Address Details" bgColor="bg-green-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput label="Number / Street:" keyName="addressNumberStreet" colSpan={3} />
              <TextInput label="State:" keyName="state" />
              <TextInput label="Postcode:" keyName="postcode" colSpan={2} />
            </div>
          </div>

          {/* Participant Contact Details */}
          <SectionHeader title="Participant Contact Details" bgColor="bg-blue-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextInput label="Email address:" keyName="email" type="email" colSpan={3} />
              <TextInput label="Home Phone No:" keyName="homePhone" />
              <TextInput label="Mobile No:" keyName="mobile" colSpan={2} />
            </div>
          </div>

          {/* Disability Conditions */}
          <SectionHeader title="Disability Conditions/Disability type(s)" bgColor="bg-red-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <TextArea label="Please describe disability conditions/types:" keyName="disabilityConditions" height={150} colSpan={3} />
          </div>

          {/* GP Medical Contact */}
          <SectionHeader title="GP Medical Contact" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Medical Centre Name:" keyName="medicalCentreName" colSpan={2} />
              <TextInput label="Phone:" keyName="medicalPhone" colSpan={2} />
            </div>
          </div>

          {/* Support Coordinator */}
          <SectionHeader title="Support Coordinator" bgColor="bg-gray-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput label="Name:" keyName="supportCoordinatorName" />
              <TextInput label="Email Address:" keyName="supportCoordinatorEmail" />
              <TextInput label="Company:" keyName="supportCoordinatorCompany" />
              <TextInput label="Contact number:" keyName="supportCoordinatorContact" />
            </div>
          </div>

          {/* Other Supports */}
          <SectionHeader title="Other Supports" bgColor="bg-gray-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <TextArea label="What other supports including mainstream health services you receive at present:" keyName="otherSupports" height={256} colSpan={2} />
          </div>

          <SectionHeader title="All About Me" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Advocate/representative details (if applicable)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Name:" keyName="advocateName" />
                <TextInput label="Relationship with the participant:" keyName="advocateRelationship" />
                <TextInput label="Phone No:" keyName="advocatePhone" />
                <TextInput label="Mobile No:" keyName="advocateMobile" />
                <TextInput label="Email:" keyName="advocateEmail" colSpan={2} />
                <TextInput label="Address Details:" keyName="advocateAddress" colSpan={2} />
                <TextInput label="Postal Address Details:" keyName="advocatePostalAddress" colSpan={2} />
                <TextArea label="Other Information:" keyName="advocateOtherInfo" colSpan={2} />
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-4">Personal Situation</h4>
              <div className="space-y-4">
                <YesNoQuestion 
                  label="Are there any cultural, communication barriers or intimacy issues that need to be considered when delivering services?"
                  keyName="barriers"
                  yesDetail="If yes, please indicate below:"
                />
                <YesNoQuestion 
                  label="Verbal communication or spoken language - Is an interpreter needed?"
                  keyName="interpreter" 
                  yesDetail={undefined}
                />
                <TextInput label="Language:" keyName="language" />
                <TextInput label="Cultural values/ beliefs or assumptions:" keyName="culturalValues" />
                <TextInput label="Cultural behaviours:" keyName="culturalBehaviours" />
                <TextInput label="Written communication/literacy:" keyName="writtenCommunication" />
                <TextInput label="Country of birth:" keyName="countryOfBirth" />
              </div>
            </div>
          </div>

          <SectionHeader title="Contacts, Living and Travel" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Primary Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Contact Name:" keyName="primaryContactName" />
                <TextInput label="Relationship:" keyName="primaryContactRelationship" />
                <TextInput label="Home Phone No:" keyName="primaryContactHomePhone" />
                <TextInput label="Mobile No:" keyName="primaryContactMobile" />
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Secondary Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput label="Contact Name:" keyName="secondaryContactName" />
                <TextInput label="Relationship:" keyName="secondaryContactRelationship" />
                <TextInput label="Home Phone No:" keyName="secondaryContactHomePhone" />
                <TextInput label="Mobile No:" keyName="secondaryContactMobile" />
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold mb-4">Living and support arrangements</h4>
              <p className="mb-4 text-gray-700">What is your current living arrangement? (Please tick the appropriate box)</p>
              <CheckboxGroup 
                keyName="livingArrangements"
                options={[
                  "Live with Parent/Family/Support Person",
                  "Live in private rental arrangement with others",
                  "Live in private rental arrangement alone",
                  "Owns own home",
                  "Aged Care Facility",
                  "Mental Health Facility",
                  "Lives in public housing",
                  "Short Term Crisis/Respite",
                  "Staff Supported Group Home",
                  "Hostel/SRS Private Accommodation",
                  "Other"
                ]}
              />
              {(formData.livingArrangements || []).includes("Other") && (
                <div className="mt-4">
                  <TextInput label="Please specify:" keyName="livingArrangementsOther" />
                </div>
              )}
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold mb-4">Travel</h4>
              <p className="mb-4 text-gray-700">How do you travel to work or to your day service? (Please tick the appropriate box)</p>
              <CheckboxGroup 
                keyName="travelArrangements"
                options={[
                  "Taxi",
                  "Pick up/ drop off by Parent/Family/Support Person",
                  "Transport by a provider",
                  "Independently use Public Transport",
                  "Walk",
                  "Assisted Public Transport",
                  "Drive own car",
                  "Other"
                ]} 
                label={undefined}
              />
              {(formData.travelArrangements || []).includes("Other") && (
                <div className="mt-4">
                  <TextInput label="Please specify:" keyName="travelArrangementsOther" />
                </div>
              )}
            </div>
          </div>

          <SectionHeader title="Medication Information/Diagnosis/Health Concerns" bgColor="bg-red-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="space-y-4">
              <YesNoQuestion 
                label="Does the Participant require a Medication Chart?"
                keyName="medicationChart"
                yesDetail="If yes, is this medication taken on a regular basis and for what purpose, ensure to complete Medication Chart and Participant risk assessment"
              />
              
              <YesNoQuestion 
                label="Does the Participant require Mealtime Management?"
                keyName="mealtimeManagement"
                yesDetail="If yes, refer to Mealtime Management Plan Form"
              />
              
              <YesNoQuestion 
                label="Does the participant require Bowel Care Management?"
                keyName="bowelCare"
                yesDetail="If yes, refer to Complex Bowel Care Plan and Monitoring Form and indicate what assistance is required with bowel care."
              />
              
              <YesNoQuestion 
                label="Are there any issues with a menstrual cycle or is assistance needed with female hygiene?"
                keyName="menstrualIssues"
                yesDetail="If yes, please specify:"
              />
              
              <YesNoQuestion 
                label="Does the Participant have Epilepsy?"
                keyName="epilepsy"
                yesDetail="If yes, ensure Participant's Doctor completes an Epilepsy Plan"
              />
              
              <YesNoQuestion 
                label="Is the Participant an Asthmatic?"
                keyName="asthmatic"
                yesDetail="If yes, ensure Participant's Doctor completes an Asthma Plan"
              />
              
              <YesNoQuestion 
                label="Does the Participant have any allergies?"
                keyName="allergies"
                yesDetail="If yes, ensure to have an Allergy Plan from Participant's Doctor"
              />
              
              <YesNoQuestion 
                label="Is the Participant anaphylactic?"
                keyName="anaphylactic"
                yesDetail="If yes, ensure to have an anaphylaxis Plan from the Participant's Doctor"
              />
              
              <YesNoQuestion 
                label="Do you give permission for our company's staff to administer band-aids in cases of a minor injury?"
                keyName="minorInjury"
              />
              
              <YesNoQuestion 
                label="Does this participant require specific training?"
                keyName="training"
                yesDetail="If yes, ensure to provide information such as implementing a positive behaviour support plan."
              />
              
              <YesNoQuestion 
                label="Are there any other medication conditions that will be relevant to the care provided to this Participant?"
                keyName="othermedical"
                yesDetail="If yes, Please specify"
              />
              
              <YesNoQuestion 
                label="Is there any specific trigger for community activities?"
                keyName="trigger"
                yesDetail="If yes, please specify and complete the Risk assessment for participants."
              />
            </div>
          </div>

          <SectionHeader title="Safety Considerations" bgColor="bg-orange-600" />
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 p-6">
            <div className="space-y-4">
              <YesNoQuestion 
                label="Does the Participant show signs or a history of unexpectedly leaving (absconding)?"
                keyName="absconding"
                yesDetail="If yes, please specify."
              />
              
              <YesNoQuestion 
                label="Is this participant prone to falls or have a history of falls?"
                keyName="historyOfFalls"
              />
              
              <YesNoQuestion 
                label="Are there any behaviours of concern? E.g.: kicking, biting"
                keyName="behaviourConcern"
                yesDetail="If yes, please specify."
              />
              
              <YesNoQuestion 
                label="Is there a current Positive Behaviour Support Plan in place?"
                keyName="positiveBehaviour"
                yesDetail="If yes, refer to High Risk Participant Register."
              />
              
              <YesNoQuestion 
                label="Does the participant require communication assistance?"
                keyName="communicationAssistance"
                yesDetail="If yes, refer to the mode of communication reflected in Participant Risk Assessment and disaster management plan"
              />
              
              <YesNoQuestion 
                label="Is there any physical assistance or physical assistance preference for this Participant?"
                keyName="physicalAssistance"
                yesDetail="If yes, specify"
              />
              
              <YesNoQuestion 
                label="Does the Participant have any expressive language concerns?"
                keyName="languageConcern"
                yesDetail="If yes, refer to Participant Risk Assessment and disaster management plan under OH&S Assessments and Mode of Communication"
              />
              
              <YesNoQuestion 
                label="Does this Participant have any personal preferences & personal goals?"
                keyName="personalGoals"
                yesDetail="If yes, refer to form Support Plan"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center font-medium transition-colors"
            >
              Submit Form <FaArrowRight className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, bgColor = "bg-blue-600" }) => (
  <div className={`${bgColor} text-white p-4 rounded-t-lg mb-0`}>
    <h3 className="text-xl font-semibold">{title}</h3>
  </div>
);

export default ClientIntakeForm;
