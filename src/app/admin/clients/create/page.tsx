// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { FaSave, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import { createClient } from '@/lib/api';

// export default function CreateClientPage() {
//   const router = useRouter();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  
//   // Additional client fields
//   const [ndisNumber, setNdisNumber] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [address, setAddress] = useState('');
//   const [state, setState] = useState('');
//   const [postCode, setPostCode] = useState('');
//   const [disability, setDisability] = useState('');
//   const [sex, setSex] = useState('');
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setError('');
    
//     try {
//       // Call the API to create the client with all provided info
//       // Use "Unnamed Client" if no name is provided
//       await createClient({
//         name: name.trim() || "Unnamed Client",
//         email: email || undefined,
//         phone: phone || undefined,
//         commonFields: showAdditionalFields ? {
//           ndis: ndisNumber || undefined,
//           dob: dateOfBirth || undefined,
//           address: address || undefined,
//           street: address || undefined,
//           state: state || undefined,
//           postCode: postCode || undefined,
//           disability: disability || undefined,
//           sex: sex || undefined,
//         } : undefined
//       });
      
//       // Redirect back to clients list
//       router.push('/admin/clients');
//       router.refresh();
//     } catch (err) {
//       setError(err.message || 'Failed to create client');
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
//           <button
//             onClick={() => router.back()}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
//           >
//             <FaTimes className="mr-2" /> Cancel
//           </button>
//         </div>
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}
        
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="p-6">
//             <form onSubmit={handleSubmit}>
//               <div className="space-y-6">
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
//                   <p className="mt-1 text-sm text-gray-500">
//                     All fields are optional. If no name is provided, "Unnamed Client" will be used.
//                   </p>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="John Doe"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="john.doe@example.com"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="0412 345 678"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAdditionalFields(!showAdditionalFields)}
//                     className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     {showAdditionalFields ? (
//                       <>
//                         <FaChevronUp className="mr-2" /> Hide Additional Information
//                       </>
//                     ) : (
//                       <>
//                         <FaChevronDown className="mr-2" /> Show Additional Information
//                       </>
//                     )}
//                   </button>
//                 </div>
                
//                 {showAdditionalFields && (
//                   <div className="border-t border-gray-200 pt-4">
//                     <div>
//                       <h2 className="text-lg font-medium text-gray-900">Additional Information</h2>
//                       <p className="mt-1 text-sm text-gray-500">
//                         These fields are optional and can be filled later.
//                       </p>
//                     </div>
                    
//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           NDIS Number
//                         </label>
//                         <input
//                           type="text"
//                           value={ndisNumber}
//                           onChange={(e) => setNdisNumber(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="NDIS123456"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Date of Birth
//                         </label>
//                         <input
//                           type="date"
//                           value={dateOfBirth}
//                           onChange={(e) => setDateOfBirth(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Sex
//                         </label>
//                         <select
//                           value={sex}
//                           onChange={(e) => setSex(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">Select...</option>
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                           <option value="Prefer not to say">Prefer not to say</option>
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Address
//                         </label>
//                         <input
//                           type="text"
//                           value={address}
//                           onChange={(e) => setAddress(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="123 Main St"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           State
//                         </label>
//                         <select
//                           value={state}
//                           onChange={(e) => setState(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">Select...</option>
//                           <option value="ACT">Australian Capital Territory</option>
//                           <option value="NSW">New South Wales</option>
//                           <option value="NT">Northern Territory</option>
//                           <option value="QLD">Queensland</option>
//                           <option value="SA">South Australia</option>
//                           <option value="TAS">Tasmania</option>
//                           <option value="VIC">Victoria</option>
//                           <option value="WA">Western Australia</option>
//                         </select>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Postcode
//                         </label>
//                         <input
//                           type="text"
//                           value={postCode}
//                           onChange={(e) => setPostCode(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="6000"
//                         />
//                       </div>
                      
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Disability/Conditions
//                         </label>
//                         <textarea
//                           value={disability}
//                           onChange={(e) => setDisability(e.target.value)}
//                           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           rows={3}
//                           placeholder="Enter any disability or medical conditions..."
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="flex justify-end pt-4 border-t border-gray-200">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <FaSave className="mr-2" /> Create Client
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes, FaChevronDown, FaChevronUp, FaUserPlus, FaArrowLeft, FaIdCard, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaGlobe, FaMailBulk, FaPhone } from 'react-icons/fa';
import { createClient } from '@/lib/api';

export default function CreateClientPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  // Additional client fields
  const [ndisNumber, setNdisNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [postCode, setPostCode] = useState('');
  const [disability, setDisability] = useState('');
  const [sex, setSex] = useState('');

  const handleSubmit = async (e : any) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      // Call the API to create the client with all provided info
      // Use "Unnamed Client" if no name is provided
      await createClient({
        name: name.trim() || "Unnamed Client",
        email: email || undefined,
        phone: phone || undefined,
        commonFields: showAdditionalFields ? {
          ndis: ndisNumber || undefined,
          dob: dateOfBirth || undefined,
          address: address || undefined,
          street: address || undefined,
          state: state || undefined,
          postCode: postCode || undefined,
          disability: disability || undefined,
          sex: sex || undefined,
        } : undefined
      });

      // Redirect back to clients list
      router.push('/admin/clients');
      router.refresh();
    } catch (err : any) {
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
                    All fields are optional. If no name is provided, "Unnamed Client" will be used.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMailBulk className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0412 345 678"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Toggle */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <button
                type="button"
                onClick={() => setShowAdditionalFields(!showAdditionalFields)}
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
                      These fields are optional and can be filled later.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      NDIS Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        value={ndisNumber}
                        onChange={(e) => setNdisNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="NDIS123456"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Sex
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaVenusMars className="text-gray-400 text-sm" />
                      </div>
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
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
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Postcode
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="6000"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Disability/Conditions
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <textarea
                        value={disability}
                        onChange={(e) => setDisability(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        placeholder="Enter any disability or medical conditions..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

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