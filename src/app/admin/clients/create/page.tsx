"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaUserPlus,
  FaArrowLeft,
  FaIdCard,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaGlobe,
  FaMailBulk,
  FaPhone,
  FaFileAlt,
} from "react-icons/fa";
import { createClient, checkClientEmailExists } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";


import { formatDateForStorage, formatDateForInput } from "@/lib/dateFormatHelper";


export default function CreateClientPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [checkingEmail, setCheckingEmail] = useState(false);
  const emailCheckTimer = useRef<NodeJS.Timeout | null>(null);
  const currentCheckingEmail = useRef<string>("");

  // Function to clear specific field error
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Basic Information - All Required
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!surname.trim()) {
      newErrors.surname = "Surname is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Phone must be 10 digits";
    }


      if (!ndisNumber.trim()) {
        newErrors.ndisNumber = "NDIS number is required";
      } else if (!/^\d+$/.test(ndisNumber)) {
        newErrors.ndisNumber = "NDIS number must contain digits only";
      }

      if (!dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else if (new Date(dateOfBirth) > new Date()) {
        newErrors.dateOfBirth = "Date of birth must be in the past";
      }

      if (!sex) {
        newErrors.sex = "Sex/Gender is required";
      }

      if (!address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!state) {
        newErrors.state = "State is required";
      }

      if (!postCode.trim()) {
        newErrors.postCode = "Postcode is required";
      } else if (!/^\d{4}$/.test(postCode)) {
        newErrors.postCode = "Postcode must be 4 digits";
      }

      if (!disability.trim()) {
        newErrors.disability = "Disability/Conditions information is required";
      }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Additional client fields
  const [ndisNumber, setNdisNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState<number | null>(null); // Add age state
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [postCode, setPostCode] = useState("");
  const [disability, setDisability] = useState("");
  const [sex, setSex] = useState("");

  // Function to calculate age from date of birth
  const calculateAge = (dob: string): number | null => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : null;
  };

  // Update age whenever date of birth changes
  const handleDateOfBirthChange = (raw: string) => {
  const formatted = formatDateForStorage(raw); // Store as DD-MM-YYYY
  setDateOfBirth(formatted);
  const calculatedAge = calculateAge(raw); // Still use raw (YYYY-MM-DD) for age
  setAge(calculatedAge);
};


  // New state to control navigation behavior
  const [navigateToAssignForms, setNavigateToAssignForms] = useState(true);

  const { showToast } = useToast();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimer.current) {
        clearTimeout(emailCheckTimer.current);
      }
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return; // 🛑 Stop if validation fails

    setLoading(true);

    try {
      // Prepare the client data
      const clientData: any = {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
      };

      // Only add commonFields if the additional fields section is shown
      
        // Create a clean commonFields object with only defined values
        const cleanCommonFields: any = {};

        if (ndisNumber) cleanCommonFields.ndis = ndisNumber;
        if (dateOfBirth) cleanCommonFields.dob = dateOfBirth;
        if (age !== null) cleanCommonFields.age = age; // Add age to commonFields
        if (address) {
          cleanCommonFields.address = address;
          cleanCommonFields.street = address;
        }
        if (state) cleanCommonFields.state = state;

        // Handle postCode specially - ensure it's a string
        if (postCode) {
          cleanCommonFields.postCode = postCode.toString();
        }

        if (disability) cleanCommonFields.disability = disability;
        if (sex) cleanCommonFields.sex = sex;

        if(surname) cleanCommonFields.surname = surname;

        // Only add commonFields if there's at least one property
        if (Object.keys(cleanCommonFields).length > 0) {
          clientData.commonFields = cleanCommonFields;
        }
      

      console.log("Sending client data:", JSON.stringify(clientData));

      // Call the API to create the client
      const newClient = await createClient(clientData);

      console.log("New client created:", newClient);

      // Show success toast
      showToast({
        type: "success",
        title: "Client Created",
        message: `${
          newClient.name || "New client"
        } has been created successfully.`,
        duration: 3000,
      });

      // Navigate based on user preference - use setTimeout to ensure navigation happens
      setTimeout(() => {
        if (navigateToAssignForms && newClient && newClient.id) {
          // Navigate to the form assignment page for this client
          router.push(`/admin/clients/${newClient.id}/forms`);
        } else {
          // Redirect back to clients list
          router.push("/admin/clients");
        }
      }, 100);
    } catch (err: any) {
      // Do not log handled validation errors to console
      const fieldErrors = err?.fieldErrors || {};
      if (err?.status === 409 && fieldErrors.email) {
        setErrors((prev) => ({ ...prev, email: fieldErrors.email }));
        setError(fieldErrors.email);
        showToast({
          type: "error",
          title: "Email already in use",
          message: fieldErrors.email,
          duration: 4000,
        });
      } else {
        console.error("Error creating client:", err);
        const msg = err?.message || "Failed to create client";
        setError(msg);
        showToast({
          type: "error",
          title: "Error Creating Client",
          message: msg,
          duration: 4000,
        });
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white-50 to-white-100 min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-azure-50 p-8 mb-8 hover:shadow-xl hover:border-gold-400 transition-shadow duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Icon + Title + Description */}
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg">
              <FaUserPlus className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-azure-700 mb-2">
                Add New Client
              </h1>
              <p className="text-base text-azure-500">
                Create a comprehensive client profile with all necessary
                information
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm font-medium text-azure-400">
                  Ready to create
                </span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gold-600 hover:text-white bg-white border border-gold-200 hover:bg-gold-600 transition-all duration-200 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Clients
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Error message */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-500 text-white shadow-md">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    Error Creating Client
                  </h3>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-8 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-800 mb-3">
                    Please Correct the Following Errors
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(errors).map(([field, message]) => (
                      <li
                        key={field}
                        className="flex items-center gap-2 text-amber-700 font-medium"
                      >
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-azure-50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <form onSubmit={handleSubmit}>
            {/* Enhanced Basic Information */}
            <div className="p-8 border-b border-azure-50">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <FaIdCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-azure-700">
                    Basic Information
                  </h2>
                  <p className="text-sm text-azure-500 mt-1">
                    All fields marked with{" "}
                    <span className="text-red-500 font-semibold">*</span> are
                    required.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-azure-600">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError("name");
                      }}
                      className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                        errors.name
                          ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                          : "border-azure-200 hover:border-gold-300"
                      }`}
                      placeholder="Enter client's full name"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                 <div className="space-y-2">
                  <label className="block text-sm font-bold text-azure-600">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => {
                        setSurname(e.target.value);
                        clearFieldError("surname");
                      }}
                      className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                        errors.name
                          ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                          : "border-azure-200 hover:border-gold-300"
                      }`}
                      placeholder="Enter client's full name"
                      required
                    />
                    {errors.surname && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.surname}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-azure-600">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMailBulk className="text-azure-300 h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const next = e.target.value.toLowerCase().trim();
                          setEmail(next);
                          // Clear error immediately when user types
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.email;
                            return newErrors;
                          });
                          // Clear any pending email check
                          if (emailCheckTimer.current) {
                            clearTimeout(emailCheckTimer.current);
                            emailCheckTimer.current = null;
                          }
                          // Don't check if email is empty
                          if (!next) {
                            setCheckingEmail(false);
                            return;
                          }
                          // Track the email we're about to check
                          const emailToCheck = next;
                          currentCheckingEmail.current = emailToCheck;
                          // Debounce check
                          emailCheckTimer.current = setTimeout(async () => {
                            // Verify this is still the email we want to check
                            if (emailToCheck !== currentCheckingEmail.current) {
                              return;
                            }
                            setCheckingEmail(true);
                            try {
                              const res = await checkClientEmailExists(emailToCheck);
                              // Only update if this is still the email being checked
                              if (emailToCheck === currentCheckingEmail.current) {
                                if (res?.exists) {
                                  setErrors((prev) => ({ ...prev, email: "A client with this email already exists." }));
                                } else {
                                  // Clear error if email doesn't exist
                                  setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.email;
                                    return newErrors;
                                  });
                                }
                              }
                            } catch (error) {
                              // Silently fail - don't show error for network issues
                              console.error("Email check failed:", error);
                            } finally {
                              if (emailToCheck === currentCheckingEmail.current) {
                                setCheckingEmail(false);
                              }
                            }
                          }, 500);
                        }}
                        className={`w-full border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.email
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        placeholder="client@example.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-azure-600">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-azure-300 h-5 w-5" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError("phone");
                      }}
                      className={`w-full border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                        errors.phone
                          ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                          : "border-azure-200 hover:border-gold-300"
                      }`}
                      placeholder="0412 345 678"
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Additional Information Toggle */}
            <div className="px-8 py-6 bg-gradient-to-r from-azure-50 to-azure-100 border-b border-azure-100">
              
              
              
            </div>

            {/* Enhanced Additional Information */}
             
              <div className="p-8 border-b border-azure-50 animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                    <FaGlobe className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-azure-700">
                      Additional Information
                    </h2>
                    <p className="text-sm text-azure-500 mt-1">
                      All fields marked with{" "}
                      <span className="text-red-500 font-semibold">*</span> are
                      required when this section is expanded.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      NDIS Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={ndisNumber}
                        onChange={(e) => {
                          setNdisNumber(e.target.value);
                          clearFieldError("ndisNumber");
                        }}
                        className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.ndisNumber
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        placeholder="Enter NDIS number"
                        required
                      />
                      {errors.ndisNumber && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.ndisNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-azure-300 h-5 w-5" />
                      </div>
                      <input
                         type="date"
  value={formatDateForInput(dateOfBirth)} // convert DD-MM-YYYY → YYYY-MM-DD for input
  onChange={(e) => {
    handleDateOfBirthChange(e.target.value); // e.target.value is always YYYY-MM-DD
    clearFieldError("dateOfBirth");
  }}
                        max={new Date().toISOString().split("T")[0]}
                        className={`w-full border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.dateOfBirth
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        required
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Age Field - Auto-calculated */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      Age (Auto-calculated)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-azure-300" />
                      </div>
                      <input
                        type="number"
                        value={age !== null ? age.toString() : ""}
                        readOnly
                        placeholder="Calculated from date of birth"
                        className="w-full border border-azure-200 rounded-xl pl-12 pr-4 py-4 bg-gradient-to-r from-azure-50 to-azure-100 text-azure-500 cursor-not-allowed focus:outline-none shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-azure-400 mt-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
                      <span className="font-medium text-blue-700">
                        ℹ️ Age is automatically calculated from the date of
                        birth
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaVenusMars className="text-azure-300 h-5 w-5" />
                      </div>
                      <select
                        value={sex}
                        onChange={(e) => {
                          setSex(e.target.value);
                          clearFieldError("sex");
                        }}
                        aria-label="Gender"
                        className={`w-full border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 appearance-none transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.sex
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        required
                      >
                        <option value="">Select gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                      {errors.sex && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.sex}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-azure-300 h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          clearFieldError("address");
                        }}
                        className={`w-full border rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.address
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        placeholder="123 Main Street"
                        required
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          clearFieldError("state");
                        }}
                        aria-label="State"
                        className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 appearance-none transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.state
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        required
                      >
                        <option value="">Select state...</option>
                        <option value="Australian Capital Territory">
                          Australian Capital Territory
                        </option>
                        <option value="New South Wales">New South Wales</option>
                        <option value="Northern Territory">Northern Territory</option>
                        <option value="Queensland">Queensland</option>
                        <option value="South Australia">South Australia</option>
                        <option value="Tasmania">Tasmania</option>
                        <option value="Victoria">Victoria</option>
                        <option value="Western Australia">Western Australia</option>
                      </select>
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={postCode}
                        onChange={(e) => {
                          setPostCode(e.target.value);
                          clearFieldError("postCode");
                        }}
                        className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md ${
                          errors.postCode
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        placeholder="1234"
                        maxLength={4}
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.postCode && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.postCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-bold text-azure-600">
                      Disability/Conditions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={disability}
                        onChange={(e) => {
                          setDisability(e.target.value);
                          clearFieldError("disability");
                        }}
                        className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-azure-600 transition-all duration-200 shadow-sm hover:shadow-md resize-none ${
                          errors.disability
                            ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                            : "border-azure-200 hover:border-gold-300"
                        }`}
                        rows={4}
                        placeholder="Please describe any disability, medical conditions, or special requirements..."
                        required
                      />
                      {errors.disability && (
                        <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.disability}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            

            {/* Enhanced Navigation Option */}
            <div className="px-8 py-6 bg-gradient-to-r from-gold-50 to-gold-100 border-b border-gold-200">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="navigateToAssignForms"
                  checked={navigateToAssignForms}
                  onChange={() =>
                    setNavigateToAssignForms(!navigateToAssignForms)
                  }
                  className="h-5 w-5 text-azure-700 focus:ring-gold-500 border-azure-200 rounded shadow-sm"
                />
                <label
                  htmlFor="navigateToAssignForms"
                  className="flex items-center gap-3 text-sm font-medium text-azure-600 cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <FaFileAlt className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-azure-700">
                      Proceed to form assignment after creating client
                    </span>
                    <p className="text-xs text-azure-500 mt-1">
                      Automatically navigate to assign forms to the new client
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Enhanced Form Actions */}
            <div className="px-8 py-6 bg-gradient-to-r from-azure-50 to-white flex justify-end border-t border-azure-100">
  <div className="flex gap-4">
    {/* Cancel Button */}
    <button
      type="button"
      onClick={() => router.back()}
      className="px-6 py-3 border border-azure-200 rounded-xl text-azure-500 hover:text-azure-700 hover:border-gold-300 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-300 transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
    >
      <FaTimes className="inline mr-2 h-4 w-4" />
      Cancel
    </button>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-xl shadow-md flex items-center justify-center disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-400 font-semibold hover:shadow-xl transform hover:scale-105 disabled:transform-none"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
          Creating Client...
        </>
      ) : (
        <>
          <FaSave className="mr-3 h-4 w-4" />
          Create Client
        </>
      )}
    </button>
  </div>
</div>

          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
