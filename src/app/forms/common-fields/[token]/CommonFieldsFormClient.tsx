"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFormBatchByToken, updateCommonFields } from "@/lib/api";
import { FaExclamationTriangle, FaSave, FaArrowRight } from "react-icons/fa";

export default function CommonFieldsFormClient({ token }: { token: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passcode = searchParams.get("passcode");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [batchData, setBatchData] = useState<any>(null);
  const [formValues, setFormValues] = useState<any>({});
  const [prefilledFields, setPrefilledFields] = useState<any>({});

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

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
          setFormValues(prefilled);
          setPrefilledFields(prefilled); // Track pre-filled fields
        }
      } catch (err: any) {
        setError(err.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };

    loadBatchData();
  }, [token, passcode]);

  const handleSaveCommonFields = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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

      await updateCommonFields(
        token,
        processedFormValues,
        passcode || undefined
      );

      if (batchData.forms.length > 0) {
        router.push(
          `/forms/view-form/${
            batchData.forms[0].accessToken
          }?passcode=${encodeURIComponent(passcode || "")}`
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to save common fields");
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

      return;
    }

    setFormValues({ ...formValues, [field]: value });
  };

  const isFieldDisabled = (field: string) => {
    // Disable the field if it's pre-filled and hasn't been edited
    return (
      prefilledFields[field] && formValues[field] === prefilledFields[field]
    );
  };

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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              Personal Information
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Please provide your personal information. This will be used across
              all forms.
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formValues.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.name
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  required
                  disabled={isFieldDisabled("name")}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formValues.email || ""}
                  onChange={(e) => handleInputChange(e, "email")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.email
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isFieldDisabled("email")}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formValues.dob || ""}
                  onChange={(e) => handleInputChange(e, "dob")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isFieldDisabled("dob")}
                  max={new Date().toISOString().split("T")[0]} // Today's date as max
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={formValues.age || ""}
                  onChange={(e) => handleInputChange(e, "age")}
                  //disabled={isFieldDisabled('age')}
                  disabled={true}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.age
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {validationErrors.age && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.age}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sex
                </label>
                <select
                  value={formValues.sex || ""}
                  onChange={(e) => handleInputChange(e, "sex")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isFieldDisabled("sex")}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NDIS Number
                </label>
                <input
                  type="text"
                  value={formValues.ndis || ""}
                  onChange={(e) => handleInputChange(e, "ndis")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isFieldDisabled("ndis")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone no
                </label>
                <input
                  type="text"
                  value={formValues.phone || ""}
                  onChange={(e) => handleInputChange(e, "phone")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.phone
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isFieldDisabled("phone")}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formValues.street || ""}
                  onChange={(e) => handleInputChange(e, "street")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isFieldDisabled("street")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={formValues.state || ""}
                  onChange={(e) => handleInputChange(e, "state")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isFieldDisabled("state")}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formValues.postCode || ""}
                  onChange={(e) => handleInputChange(e, "postCode")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.postCode
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isFieldDisabled("postCode")}
                />
                {validationErrors.postCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.postCode}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disability/Conditions
                </label>
                <textarea
                  value={formValues.disability || ""}
                  onChange={(e) => handleInputChange(e, "disability")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  disabled={isFieldDisabled("disability")}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveCommonFields}
                disabled={saving || !formValues.name}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <>
                    Continue <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
