"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes, FaChevronDown, FaChevronUp, FaUserPlus, FaArrowLeft, FaIdCard, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaGlobe, FaMailBulk, FaPhone } from 'react-icons/fa';
import { createClient } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

export default function CreateClientPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Function to clear specific field error
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
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
      newErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // Additional Information - Required when section is shown
    if (showAdditionalFields) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  // Additional client fields
  const [ndisNumber, setNdisNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number | null>(null); // Add age state
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [postCode, setPostCode] = useState('');
  const [disability, setDisability] = useState('');
  const [sex, setSex] = useState('');
  
  // Function to calculate age from date of birth
  const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : null;
  };
  
  // Update age whenever date of birth changes
  const handleDateOfBirthChange = (dob: string) => {
    setDateOfBirth(dob);
    const calculatedAge = calculateAge(dob);
    setAge(calculatedAge);
  };
  
  // New state to control navigation behavior
  const [navigateToAssignForms, setNavigateToAssignForms] = useState(true);

  const {showToast} = useToast();

  const handleSubmit = async (e : any) => {
      e.preventDefault();
      setError('');

      if (!validateForm()) return; // 🛑 Stop if validation fails

      setLoading(true);

      try {
        // Prepare the client data
        const clientData: any = {
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined
        };

        // Only add commonFields if the additional fields section is shown
        if (showAdditionalFields) {
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
          
          // Only add commonFields if there's at least one property
          if (Object.keys(cleanCommonFields).length > 0) {
            clientData.commonFields = cleanCommonFields;
          }
        }

        console.log("Sending client data:", JSON.stringify(clientData));
        
        // Call the API to create the client
        const newClient = await createClient(clientData);
        
        console.log("New client created:", newClient);
        
        // Show success toast
        showToast({
          type: 'success',
          title: 'Client Created',
          message: `${newClient.name || 'New client'} has been created successfully.`,
          duration: 3000,
        });

        // Navigate based on user preference - use setTimeout to ensure navigation happens
        setTimeout(() => {
          if (navigateToAssignForms && newClient && newClient.id) {
            // Navigate to the form assignment page for this client
            router.push(`/admin/clients/${newClient.id}/forms`);
          } else {
            // Redirect back to clients list
            router.push('/admin/clients');
          }
        }, 100);
      } catch (err : any) {
        console.error("Error creating client:", err);
        setError(err.message || 'Failed to create client');
        setLoading(false);
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                <FaUserPlus className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
                <p className="text-sm text-gray-500 mt-1">Create a new client record</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition px-4 py-2 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50"
              >
                <FaArrowLeft className="mr-2" /> Back to Clients
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Please correct the following errors:</h3>
                <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <FaIdCard className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-500">
                    All fields marked with <span className="text-red-500">*</span> are required.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError('name');
                      }}
                      className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMailBulk className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearFieldError('email');
                      }}
                      className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearFieldError('phone');
                      }}
                      className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0412 345 678"
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Toggle */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowAdditionalFields(!showAdditionalFields);
                  // Clear additional field errors when collapsing
                  if (showAdditionalFields) {
                    const additionalFieldErrors = ['ndisNumber', 'dateOfBirth', 'sex', 'address', 'state', 'postCode', 'disability'];
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      additionalFieldErrors.forEach(field => delete newErrors[field]);
                      return newErrors;
                    });
                  }
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                {showAdditionalFields ? (
                  <>
                    <FaChevronUp className="mr-2" /> Hide Additional Information
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-2" /> Show Additional Information
                  </>
                )}
              </button>
              {!showAdditionalFields && (
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ When expanded, all additional fields become mandatory
                </p>
              )}
            </div>

            {/* Additional Information */}
            {showAdditionalFields && (
              <div className="p-6 border-b border-gray-100 animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <FaGlobe className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                    <p className="text-sm text-gray-500">
                      All fields marked with <span className="text-red-500">*</span> are required when this section is expanded.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      NDIS Number <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        value={ndisNumber}
                        onChange={(e) => { setNdisNumber(e.target.value); clearFieldError("ndisNumber"); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.ndisNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="1234567890"
                        required
                      />
                      {errors.ndisNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.ndisNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => { handleDateOfBirthChange(e.target.value); clearFieldError("dateOfBirth"); }}
                        max={new Date().toISOString().split("T")[0]} // 🛑 disables future dates
                        className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
                      )}
                    </div>
                  </div>

                  {/* Age Field - Auto-calculated */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={age !== null ? age.toString() : ''}
                        readOnly
                        placeholder="Auto-calculated from DOB"
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Age is automatically calculated from the date of birth
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Sex <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaVenusMars className="text-gray-400 text-sm" />
                      </div>
                      <select
                        value={sex}
                        onChange={(e) => { setSex(e.target.value); clearFieldError("sex"); }}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none ${
                          errors.sex ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {errors.sex && (
                        <p className="text-red-600 text-sm mt-1">{errors.sex}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => { setAddress(e.target.value); clearFieldError("address"); }}
                        className={`w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="123 Main St"
                        required
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <select
                        value={state}
                        onChange={(e) => { setState(e.target.value); clearFieldError("state"); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none ${
                          errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="ACT">Australian Capital Territory</option>
                        <option value="NSW">New South Wales</option>
                        <option value="NT">Northern Territory</option>
                        <option value="QLD">Queensland</option>
                        <option value="SA">South Australia</option>
                        <option value="TAS">Tasmania</option>
                        <option value="VIC">Victoria</option>
                        <option value="WA">Western Australia</option>
                      </select>
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        value={postCode}
                        onChange={(e) => { setPostCode(e.target.value); clearFieldError("postCode"); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.postCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="1234"
                        maxLength={4}
                        required
                        onKeyDown={(e) => {
                          // Prevent form submission when Enter is pressed in this field
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.postCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.postCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Disability/Conditions <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <textarea
                        value={disability}
                        onChange={(e) => { setDisability(e.target.value); clearFieldError("disability"); }}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.disability ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        rows={3}
                        placeholder="Enter any disability or medical conditions..."
                        required
                      />
                      {errors.disability && (
                        <p className="text-red-600 text-sm mt-1">{errors.disability}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Option */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="navigateToAssignForms"
                  checked={navigateToAssignForms}
                  onChange={() => setNavigateToAssignForms(!navigateToAssignForms)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="navigateToAssignForms" className="ml-2 block text-sm text-gray-700">
                  Proceed to form assignment after creating client
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm flex items-center justify-center disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Create Client
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
