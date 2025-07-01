"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormBatchByToken, updateCommonFields } from "@/lib/api";
import { FaExclamationTriangle, FaSave, FaArrowRight, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/Confirm";

// Add field label metadata for user-friendly confirmation modals
const FIELD_METADATA: Record<string, any> = {
  name: { label: "Full Name" },
  email: { label: "Email" },
  dob: { label: "Date of Birth" },
  age: { label: "Age" },
  sex: { label: "Sex" },
  ndis: { label: "NDIS Number" },
  phone: { label: "Phone Number" },
  street: { label: "Street Address" },
  state: { label: "State" },
  postCode: { label: "Postcode" },
  disability: { label: "Disability/Conditions" },
};

export default function CommonFieldsFormClient({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passcode = searchParams.get("passcode");
  const { showToast } = useToast();
  const confirm = useConfirm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [batchData, setBatchData] = useState<any>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [originalValues, setOriginalValues] = useState<any>({}); // Track original values
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({}); // Track pending changes

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Track changes to common fields
  const trackFieldChange = (fieldName: string, value: any) => {
    if (originalValues[fieldName] !== value) {
      setPendingChanges((prev) => ({ ...prev, [fieldName]: value }));
    } else {
      setPendingChanges((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const validateFields = () => {
    const errors: { [key: string]: string } = {};

    if (!formValues.name?.trim()) errors.name = "Name is required.";
    if (
      formValues.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
    )
      errors.email = "Invalid email format.";
    if (formValues.age && (isNaN(formValues.age) || formValues.age < 0))
      errors.age = "Age must be a positive number.";
    if (formValues.phone && !/^\d{10}$/.test(formValues.phone))
      errors.phone = "Phone number must be exactly 10 digits.";
    if (formValues.postCode && !/^\d{4}$/.test(formValues.postCode))
      errors.postCode = "Postcode must be 4 digits.";

    return errors;
  };

  useEffect(() => {
    const loadBatchData = async () => {
      try {
        setLoading(true);

        // Load batch data with passcode if available
        const data = await getFormBatchByToken(token, passcode || undefined);
        setBatchData(data);

        console.log("data: ", data);

        // Pre-fill form values from existing common fields if available
        if (data.client.commonFields && data.client.commonFields.length > 0) {
          const prefilled = data.client.commonFields[0];

          // Calculate age if DOB exists before setting form values
          if (prefilled.dob) {
            const dobDate = new Date(prefilled.dob);
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const hasBirthdayPassed =
              today.getMonth() > dobDate.getMonth() ||
              (today.getMonth() === dobDate.getMonth() && today.getDate() >= dobDate.getDate());

            if (!hasBirthdayPassed) age -= 1;

            prefilled.age = age >= 0 ? age : 0;
          }

          setFormValues(prefilled);
          setOriginalValues(prefilled); // Track original values for change detection
        }
      } catch (err: any) {
        setError(err.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };

    loadBatchData();
  }, [token, passcode]);


  useEffect(() => {
    if (formValues.dob) {
      const dobDate = new Date(formValues.dob);
      if (isNaN(dobDate.getTime())) return; // Invalid date check

      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > dobDate.getMonth() ||
        (today.getMonth() === dobDate.getMonth() && today.getDate() >= dobDate.getDate());

      if (!hasBirthdayPassed) age -= 1;

      // Always update age regardless of previous value
      setFormValues((prev: any) => ({
        ...prev,
        age: age >= 0 ? age : 0,
      }));
    }
  }, [formValues.dob]);

  // Confirmation modal for common field changes
  const confirmAndUpdateCommonFields = async () => {
    const changedFields = Object.keys(pendingChanges);
    if (changedFields.length === 0) {
      return true; // No changes to confirm
    }

    // Build a user-friendly list of changed fields and their new values
    const fieldList = changedFields.map((key) => {
      const label = FIELD_METADATA[key] ? FIELD_METADATA[key].label : key;
      const value = pendingChanges[key];
      return `- ${label}: ${value}`;
    }).join("\n");

    const confirmed = await confirm.confirm({
      title: "Confirm Common Field Changes",
      message: `You are about to update the following common fields. These changes will be reflected across all forms.\n\n${fieldList}`,
      confirmText: "Update and Continue",
    });

    if (confirmed) {
      try {
        await updateCommonFields(token, pendingChanges, passcode || undefined);
        showToast({
          type: "success",
          title: "Common Fields Updated",
          message: "The shared information has been updated for all forms.",
        });
        setPendingChanges({});
        setOriginalValues({ ...formValues }); // Update original values
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to update common fields.");
        return false;
      }
    }
    return false; // User cancelled
  };

  const handleSaveCommonFields = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Check if there are pending changes and confirm them
    const canProceed = await confirmAndUpdateCommonFields();
    if (!canProceed) {
      setSaving(false);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setValidationErrors({});

      const processedFormValues = {
        ...formValues,
        age: formValues.age ? parseInt(formValues.age, 10) : null,
      };

      // If no pending changes were confirmed above, save all current values
      if (Object.keys(pendingChanges).length === 0) {
        await updateCommonFields(
          token,
          processedFormValues,
          passcode || undefined
        );
      }

      showToast({
        type: "success",
        title: "Information Saved",
        message: "Your personal information has been saved successfully.",
      });

      // Redirect to the first form in the batch, using the batch token
      if (batchData.forms.length > 0) {
        router.push(
          `/forms/view-form/${token}?passcode=${encodeURIComponent(
            passcode || ""
          )}&step=0`
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to save common fields");
      showToast({
        type: "error",
        title: "Save Failed",
        message: err.message || "Failed to save common fields",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    field: string
  ) => {
    const value = e.target.value;

    if (field === "dob") {
      const dobDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > dobDate.getMonth() ||
        (today.getMonth() === dobDate.getMonth() &&
          today.getDate() >= dobDate.getDate());

      const calculatedAge = hasBirthdayPassed ? age : age - 1;

      setFormValues({
        ...formValues,
        dob: value,
        age: calculatedAge >= 0 ? calculatedAge : "",
      });

      // Track changes for both dob and age
      trackFieldChange("dob", value);
      trackFieldChange("age", calculatedAge >= 0 ? calculatedAge : "");
      return;
    }

    setFormValues({ ...formValues, [field]: value });
    trackFieldChange(field, value);
  };

  // Check if field has been changed from original
  const isFieldChanged = (field: string) => {
    return pendingChanges.hasOwnProperty(field);
  };

  // Get field styling based on change status
  const getFieldStyling = (field: string, hasError: boolean = false) => {
    const baseClasses = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200";
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-300 bg-red-50`;
    }
    
    if (isFieldChanged(field)) {
      return `${baseClasses} border-blue-500 focus:ring-blue-300 bg-blue-50 shadow-sm`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-blue-500`;
  };



  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');

  // This effect will run whenever dob changes (including when loaded from backend)
  useEffect(() => {
    if (dob) {
      const calculatedAge: any = calculateAgeFromDOB(dob);
      setAge(calculatedAge);
    }
  }, [dob]);

  // Function to calculate age from DOB
  const calculateAgeFromDOB = (dateOfBirth: any) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Render field label with change indicator
  const renderFieldLabel = (label: string, field: string, required: boolean = false) => (
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {isFieldChanged(field) && (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FaEdit className="mr-1" />
          Modified
        </span>
      )}
    </label>
  );



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <FaExclamationTriangle className="text-red-600 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
            Error
          </h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="px-4 md:px-8 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-white via-blue-50 to-green-50 rounded-t-2xl shadow-sm">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Personal Information
            </h1>
            <p className="mt-2 text-base md:text-lg text-gray-500 font-medium">
              Please provide your personal information. This will be used across all forms.
            </p>
            {Object.keys(pendingChanges).length > 0 && (
              <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                <div className="flex items-center">
                  <FaEdit className="text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    You have {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                {renderFieldLabel("Full Name", "name", true)}
                <input
                  type="text"
                  value={formValues.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  className={getFieldStyling("name", !!validationErrors.name)}
                  required
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                {renderFieldLabel("Email", "email")}
                <input
                  type="email"
                  value={formValues.email || ""}
                  onChange={(e) => handleInputChange(e, "email")}
                  className={getFieldStyling("email", !!validationErrors.email)}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                {renderFieldLabel("Date of Birth", "dob")}
                <input
                  type="date"
                  value={formValues.dob || ""}
                  onChange={(e) => handleInputChange(e, "dob")}
                  className={getFieldStyling("dob")}
                  max={new Date().toISOString().split("T")[0]} // Today's date as max
                />
              </div>

              <div>
                {renderFieldLabel("Age", "age")}
                <input
                  type="number"
                  value={formValues.age || ""}
                  onChange={(e) => handleInputChange(e, "age")}
                  disabled={true}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated from date of birth</p>
              </div>

              <div>
                {renderFieldLabel("Sex", "sex")}
                <select
                  value={formValues.sex || ""}
                  onChange={(e) => handleInputChange(e, "sex")}
                  className={getFieldStyling("sex")}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                {renderFieldLabel("NDIS Number", "ndis")}
                <input
                  type="text"
                  value={formValues.ndis || ""}
                  onChange={(e) => handleInputChange(e, "ndis")}
                  className={getFieldStyling("ndis")}
                />
              </div>

              <div className="md:col-span-2">
                {renderFieldLabel("Phone Number", "phone")}
                <input
                  type="text"
                  value={formValues.phone || ""}
                  onChange={(e) => handleInputChange(e, "phone")}
                  className={getFieldStyling("phone", !!validationErrors.phone)}
                  placeholder="10 digits (e.g., 0412345678)"
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                {renderFieldLabel("Street Address", "street")}
                <input
                  type="text"
                  value={formValues.street || ""}
                  onChange={(e) => handleInputChange(e, "street")}
                  className={getFieldStyling("street")}
                />
              </div>

              <div>
                {renderFieldLabel("State", "state")}
                <select
                  value={formValues.state || ""}
                  onChange={(e) => handleInputChange(e, "state")}
                  className={getFieldStyling("state")}
                >
                  <option value="">Select...</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="WA">Western Australia</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NT">Northern Territory</option>
                </select>
              </div>

              <div>
                {renderFieldLabel("Postcode", "postCode")}
                <input
                  type="text"
                  value={formValues.postCode || ""}
                  onChange={(e) => handleInputChange(e, "postCode")}
                  className={getFieldStyling("postCode", !!validationErrors.postCode)}
                  placeholder="4 digits (e.g., 2000)"
                />
                {validationErrors.postCode && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {validationErrors.postCode}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                {renderFieldLabel("Disability/Conditions", "disability")}
                <textarea
                  value={formValues.disability || ""}
                  onChange={(e) => handleInputChange(e, "disability")}
                  className={getFieldStyling("disability")}
                  rows={3}
                  placeholder="Please describe your disability or conditions..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {Object.keys(pendingChanges).length > 0 && (
                <div className="flex items-center text-sm text-blue-600">
                  <FaEdit className="mr-2" />
                  <span>{Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length > 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="flex gap-3 ml-auto">
                {Object.keys(pendingChanges).length > 0 && (
                  <button
                    onClick={() => {
                      setFormValues(originalValues);
                      setPendingChanges({});
                      showToast({
                        type: "info",
                        title: "Changes Discarded",
                        message: "All unsaved changes have been discarded.",
                      });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center font-medium text-sm shadow transition"
                  >
                    <FaTimes className="mr-2" />
                    Discard Changes
                  </button>
                )}
                <button
                  onClick={handleSaveCommonFields}
                  disabled={saving || !formValues.name}
                  className="bg-gradient-to-r from-blue-600 to-green-400 hover:from-blue-700 hover:to-green-500 text-white py-2 px-6 rounded-full flex items-center font-bold text-lg shadow disabled:opacity-50 transition"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <>
                      {Object.keys(pendingChanges).length > 0 ? (
                        <>
                          <FaCheck className="mr-2" />
                          Save & Continue
                        </>
                      ) : (
                        <>
                          Continue <FaArrowRight className="ml-2" />
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
