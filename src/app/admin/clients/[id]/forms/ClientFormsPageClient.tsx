// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { getClient, getForms, assignFormBatchToClient, getClientForms } from '@/lib/api';
// import { FaPlus, FaLink, FaCalendarAlt, FaCheck, FaClock, FaExclamationTriangle, FaTimes, FaCopy } from 'react-icons/fa';

// type Form = {
//   id: number;
//   title: string;
//   version: number;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type AssignedForm = {
//   id: number;
//   clientId: number;
//   formId: number;
//   expiresAt: string;
//   isSubmitted: boolean;
//   createdAt: string;
//   updatedAt: string;
//   form: Form;
// };

// // Update the props to accept clientId directly instead of params
// export default function ClientFormsPageClient({ clientId }: { clientId: string }) {
//   const router = useRouter();
//   const [client, setClient] = useState<any>(null);
//   const [availableForms, setAvailableForms] = useState<Form[]>([]);
//   const [assignedForms, setAssignedForms] = useState<AssignedForm[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Form assignment state
//   const [showAssignForm, setShowAssignForm] = useState(false);
//   const [selectedFormIds, setSelectedFormIds] = useState<number[]>([]);
//   const [expirationDate, setExpirationDate] = useState('');
//   const [expirationTime, setExpirationTime] = useState('');
//   const [assigningForm, setAssigningForm] = useState(false);
//   const [copiedLink, setCopiedLink] = useState<number | null>(null);
//   const [copiedPasscode, setCopiedPasscode] = useState<boolean>(false);
//   const [assignmentResult, setAssignmentResult] = useState<any>(null);

//   // Calculate default expiration date (30 minutes from now)
//   useEffect(() => {
//     const thirtyMinutesFromNow = new Date();
//     thirtyMinutesFromNow.setMinutes(thirtyMinutesFromNow.getMinutes() + 30);
    
//     // Format date as YYYY-MM-DD
//     setExpirationDate(thirtyMinutesFromNow.toISOString().split('T')[0]);
    
//     // Format time as HH:MM
//     const hours = thirtyMinutesFromNow.getHours().toString().padStart(2, '0');
//     const minutes = thirtyMinutesFromNow.getMinutes().toString().padStart(2, '0');
//     setExpirationTime(`${hours}:${minutes}`);
//   }, []);

//   // Load data when component mounts
//   useEffect(() => {
//     // Parse the client ID
//     const parsedClientId = parseInt(clientId);
//     console.log("Parsed client ID:", parsedClientId);
    
//     if (isNaN(parsedClientId)) {
//       setError('Invalid client ID');
//       setLoading(false);
//       return;
//     }

//     const loadData = async () => {
//       try {
//         setLoading(true);
//         // Load client details
//         const clientData = await getClient(parsedClientId);
//         setClient(clientData);

//         // Load available forms
//         const formsData = await getForms();
//         setAvailableForms(formsData);

//         // Load assigned forms
//         const clientFormsData = await getClientForms(parsedClientId);
//         setAssignedForms(clientFormsData);

//         setError('');
//       } catch (err: any) {
//         console.error("Error loading data:", err);
//         setError('Failed to load data: ' + (err.message || 'Unknown error'));
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [clientId]);

//   const handleToggleFormSelection = (formId: number) => {
//     if (selectedFormIds.includes(formId)) {
//       setSelectedFormIds(selectedFormIds.filter(id => id !== formId));
//     } else {
//       setSelectedFormIds([...selectedFormIds, formId]);
//     }
//   };

//   const handleAssignForms = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (selectedFormIds.length === 0) {
//       setError('Please select at least one form to assign');
//       return;
//     }

//     try {
//       setAssigningForm(true);
//       setError('');

//       const parsedClientId = parseInt(clientId);
//       if (isNaN(parsedClientId)) {
//         throw new Error('Invalid client ID');
//       }

//       // Combine date and time for expiration
//       const expiresAt = new Date(`${expirationDate}T${expirationTime}`);
      
//       // Use the batch assignment method
//       const result = await assignFormBatchToClient(parsedClientId, {
//         formIds: selectedFormIds,
//         expiresAt: expiresAt.toISOString(),
//       });
      
//       setAssignmentResult(result);

//       // Reload assigned forms
//       const clientFormsData = await getClientForms(parsedClientId);
//       setAssignedForms(clientFormsData);

//       // Reset form
//       setSelectedFormIds([]);
//     } catch (err: any) {
//       setError('Failed to assign forms: ' + (err.message || 'Unknown error'));
//       console.error(err);
//     } finally {
//       setAssigningForm(false);
//     }
//   };

//   const copyToClipboard = (text: string, type: 'link' | 'passcode') => {
//     navigator.clipboard.writeText(text);
//     if (type === 'link') {
//       setCopiedLink(1); // Just a flag to show "Copied!" message
//       setTimeout(() => setCopiedLink(null), 2000);
//     } else {
//       setCopiedPasscode(true);
//       setTimeout(() => setCopiedPasscode(false), 2000);
//     }
//   };

//   const getFormStatusBadge = (form: AssignedForm) => {
//     const now = new Date();
//     const expiryDate = new Date(form.expiresAt);

//     if (form.isSubmitted) {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           <FaCheck className="mr-1" /> Completed
//         </span>
//       );
//     } else if (expiryDate < now) {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//           <FaExclamationTriangle className="mr-1" /> Expired
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//           <FaClock className="mr-1" /> Pending
//         </span>
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//         <p className="font-bold">Error</p>
//         <p>{error}</p>
//         <button 
//           onClick={() => router.back()}
//           className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }
  
//   // If we have assignment results, show the success screen
//   if (assignmentResult) {
//     return (
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
//           <div className="flex items-center">
//             <div className="rounded-full bg-green-100 p-2 mr-3">
//               <FaCheck className="text-green-600" />
//             </div>
//             <h1 className="text-xl font-bold text-gray-900">Forms Assigned Successfully</h1>
//           </div>
//         </div>
        
//         <div className="p-6">
//           <p className="mb-4">
//             The following forms have been assigned to <strong>{client.name}</strong>:
//           </p>
          
//           <ul className="mb-6 list-disc pl-5">
//             {selectedFormIds.map(formId => {
//               const form = availableForms.find(f => f.id === formId);
//               return (
//                 <li key={formId} className="mb-1">
//                   {form?.title}
//                 </li>
//               );
//             })}
//           </ul>
          
//           <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
//             <h2 className="text-lg font-semibold mb-2">Access Information</h2>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Access Link
//               </label>
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   value={assignmentResult.accessLink}
//                   readOnly
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md bg-gray-50"
//                 />
//                 <button
//                   onClick={() => copyToClipboard(assignmentResult.accessLink, 'link')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
//                 >
//                   {copiedLink ? <FaCheck /> : <FaCopy />}
//                 </button>
//               </div>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Passcode
//               </label>
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   value={assignmentResult.passcode}
//                   readOnly
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md bg-gray-50"
//                 />
//                 <button
//                   onClick={() => copyToClipboard(assignmentResult.passcode, 'passcode')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
//                 >
//                   {copiedPasscode ? <FaCheck /> : <FaCopy />}
//                 </button>
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Expires At
//               </label>
//               <input
//                 type="text"
//                 value={new Date(assignmentResult.batch.expiresAt).toLocaleString()}
//                 readOnly
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
//               />
//             </div>
//           </div>
          
//           <div className="flex justify-between">
//             <button
//               onClick={() => {
//                 setAssignmentResult(null);
//                 setShowAssignForm(false);
//               }}
//               className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
//             >
//               Back to Forms
//             </button>
            
//             <button
//               onClick={() => {
//                 setAssignmentResult(null);
//                 setShowAssignForm(true);
//               }}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
//             >
//               Assign More Forms
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Forms for {client?.name || 'Client'}
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage forms assigned to this client
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => router.back()}
//               className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
//             >
//               Back
//             </button>
//             <button
//               onClick={() => setShowAssignForm(!showAssignForm)}
//               className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
//             >
//               {showAssignForm ? (
//                 <>
//                   <FaTimes className="mr-2" /> Cancel
//                 </>
//               ) : (
//                 <>
//                   <FaPlus className="mr-2" /> Assign Forms
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
        
//         {showAssignForm && (
//           <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-800">Assign Forms</h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Select one or more forms to assign to this client
//               </p>
//             </div>
//             <div className="p-6">
//               <form onSubmit={handleAssignForms}>
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Expiration Date and Time
//                   </label>
//                   <div className="flex space-x-4 max-w-xs">
//                     <div className="relative flex-1">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <FaCalendarAlt className="text-gray-400" />
//                       </div>
//                       <input
//                         type="date"
//                         value={expirationDate}
//                         onChange={(e) => setExpirationDate(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                       />
//                     </div>
//                     <div className="relative flex-1">
//                       <input
//                         type="time"
//                         value={expirationTime}
//                         onChange={(e) => setExpirationTime(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <p className="mt-1 text-sm text-gray-500">
//                     The link will expire after this time.
//                   </p>
//                 </div>
                
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Available Forms ({selectedFormIds.length} selected)
//                   </label>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {availableForms.map((form) => {
//                       const isSelected = selectedFormIds.includes(form.id);
//                       return (
//                         <div 
//                           key={form.id}
//                           onClick={() => handleToggleFormSelection(form.id)}
//                           className={`border rounded-lg p-4 cursor-pointer transition-colors ${
//                             isSelected 
//                               ? 'border-blue-500 bg-blue-50' 
//                               : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
//                           }`}
//                         >
//                           <div className="flex items-start">
//                             <div className="flex-shrink-0">
//                               <input
//                                 type="checkbox"
//                                 checked={isSelected}
//                                 onChange={() => {}} // Handled by parent div click
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                               />
//                             </div>
//                             <div className="ml-3">
//                               <h3 className="text-sm font-medium text-gray-900">{form.title}</h3>
//                               <p className="text-xs text-gray-500">Version {form.version}</p>
//                               {form.description && (
//                                 <p className="mt-1 text-xs text-gray-500 line-clamp-2">{form.description}</p>
//                               )}
//                               <p className="mt-1 text-xs text-gray-400">
//                                 Created: {new Date(form.createdAt).toLocaleDateString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
                  
//                   {availableForms.length === 0 && (
//                     <div className="text-center py-8 text-gray-500">
//                       No forms available to assign. Please create forms first.
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     disabled={assigningForm || selectedFormIds.length === 0}
//                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center disabled:opacity-50"
//                   >
//                     {assigningForm ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                         Assigning...
//                       </>
//                     ) : (
//                       <>
//                         <FaPlus className="mr-2" /> 
//                         {selectedFormIds.length === 0 
//                           ? 'Select Forms to Assign' 
//                           : `Assign ${selectedFormIds.length} Form${selectedFormIds.length > 1 ? 's' : ''}`}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
        
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">Assigned Forms</h2>
//           </div>
          
//           {assignedForms.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               No forms have been assigned to this client yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Form Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Assigned Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Expiration Date
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {assignedForms.map((form) => (
//                     <tr key={form.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">{form.form.title}</div>
//                         <div className="text-sm text-gray-500">Version {form.form.version}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getFormStatusBadge(form)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(form.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {new Date(form.expiresAt).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => router.push(`/admin/clients/${clientId}/forms/assign-batch`)}
//                           className="text-blue-600 hover:text-blue-900 flex items-center justify-end ml-auto"
//                         >
//                           <FaLink className="mr-1" />
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, getForms, assignFormBatchToClient, getClientForms } from '@/lib/api';
import { FaPlus, FaLink, FaCalendarAlt, FaCheck, FaClock, FaExclamationTriangle, FaTimes, FaCopy, FaArrowLeft, FaFileAlt, FaClipboard, FaLock, FaRegClock, FaUserEdit } from 'react-icons/fa';

type Form = {
  id: number;
  title: string;
  version: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

type AssignedForm = {
  id: number;
  clientId: number;
  formId: number;
  expiresAt: string;
  isSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
  formVersion: number
  form: Form;
};

export default function ClientFormsPageClient({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [availableForms, setAvailableForms] = useState<Form[]>([]);
  const [assignedForms, setAssignedForms] = useState<AssignedForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    console.log("assi: ", assignedForms[0]?.formVersion);
  },[assignedForms])

  // Form assignment state
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedFormIds, setSelectedFormIds] = useState<number[]>([]);
  const [expirationDate, setExpirationDate] = useState('');
  const [expirationTime, setExpirationTime] = useState('');
  const [assigningForm, setAssigningForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [copiedPasscode, setCopiedPasscode] = useState<boolean>(false);
  const [assignmentResult, setAssignmentResult] = useState<any>(null);

  // Calculate default expiration date (30 minutes from now)
  useEffect(() => {
    const thirtyMinutesFromNow = new Date();
    thirtyMinutesFromNow.setMinutes(thirtyMinutesFromNow.getMinutes() + 30);

    // Format date as YYYY-MM-DD
    setExpirationDate(thirtyMinutesFromNow.toISOString().split('T')[0]);

    // Format time as HH:MM
    const hours = thirtyMinutesFromNow.getHours().toString().padStart(2, '0');
    const minutes = thirtyMinutesFromNow.getMinutes().toString().padStart(2, '0');
    setExpirationTime(`${hours}:${minutes}`);
  }, []);

  // Load data when component mounts
  useEffect(() => {
    // Parse the client ID
    const parsedClientId = parseInt(clientId);
    console.log("Parsed client ID:", parsedClientId);

    if (isNaN(parsedClientId)) {
      setError('Invalid client ID');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // Load client details
        const clientData = await getClient(parsedClientId);
        setClient(clientData);

        // Load available forms
        const formsData = await getForms();
        setAvailableForms(formsData);

        // Load assigned forms
        const clientFormsData = await getClientForms(parsedClientId);
        setAssignedForms(clientFormsData);

        setError('');
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId]);

  const handleToggleFormSelection = (formId: number) => {
    if (selectedFormIds.includes(formId)) {
      setSelectedFormIds(selectedFormIds.filter(id => id !== formId));
    } else {
      setSelectedFormIds([...selectedFormIds, formId]);
    }
  };

  const handleAssignForms = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFormIds.length === 0) {
      setError('Please select at least one form to assign');
      return;
    }

    try {
      setAssigningForm(true);
      setError('');

      const parsedClientId = parseInt(clientId);
      if (isNaN(parsedClientId)) {
        throw new Error('Invalid client ID');
      }

      // Combine date and time for expiration
      const expiresAt = new Date(`${expirationDate}T${expirationTime}`);

      // Use the batch assignment method
      const result = await assignFormBatchToClient(parsedClientId, {
        formIds: selectedFormIds,
        expiresAt: expiresAt.toISOString(),
      });

      setAssignmentResult(result);

      // Reload assigned forms
      const clientFormsData = await getClientForms(parsedClientId);
      setAssignedForms(clientFormsData);

      // Reset form
      setSelectedFormIds([]);
    } catch (err: any) {
      setError('Failed to assign forms: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setAssigningForm(false);
    }
  };

  const copyToClipboard = (text: string, type: 'link' | 'passcode') => {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (type === 'link') {
          setCopiedLink(1);
          setTimeout(() => setCopiedLink(null), 2000);
        } else {
          setCopiedPasscode(true);
          setTimeout(() => setCopiedPasscode(false), 2000);
        }
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
        alert("Clipboard copy failed.");
      });
  } else {
    console.warn("Clipboard API not supported.");
    alert("Copy to clipboard is not supported in this browser or environment.");
  }
};


  const getFormStatusBadge = (form: AssignedForm) => {
    const now = new Date();
    const expiryDate = new Date(form.expiresAt);

    if (form.isSubmitted) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheck className="mr-1" /> Completed
        </span>
      );
    } else if (expiryDate < now) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaExclamationTriangle className="mr-1" /> Expired
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FaClock className="mr-1" /> Pending
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto"></div>
              <p className="mt-6 text-gray-600 font-medium">Loading client forms...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Error</h1>
              <p className="text-red-600 mb-6 text-center">{error}</p>
              <button
                onClick={() => router.back()}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition text-center font-medium shadow-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

   

  // If we have assignment results, show the success screen
  if (assignmentResult) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-green-50">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <FaCheck className="text-green-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Forms Assigned Successfully</h1>
                  <p className="text-sm text-gray-500 mt-1">The forms have been assigned to {client.name}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <FaFileAlt className="mr-2 text-indigo-500" /> Assigned Forms
                </h2>

                <ul className="space-y-2 mb-4">
                  {selectedFormIds.map(formId => {
                    const form = availableForms.find(f => f.id === formId);
                    return (
                      <li key={formId} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <span>{form?.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <FaLink className="mr-2 text-indigo-500" /> Access Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaLink className="mr-2 text-gray-500" /> Access Link
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={`${window.location.origin}${assignmentResult.accessLink}`}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-700"
                      />
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}${assignmentResult.accessLink}`, 'link')}
                        className={`${
                          copiedLink
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white px-4 py-2 rounded-r-lg transition-colors flex items-center`}
                      >
                        {copiedLink ? (
                          <>
                            <FaCheck className="mr-2" /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy className="mr-2" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Share this link with the client to access their forms
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaLock className="mr-2 text-gray-500" /> Passcode
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={assignmentResult.passcode}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-700 font-mono tracking-wider"
                      />
                      <button
                        onClick={() => copyToClipboard(assignmentResult.passcode, 'passcode')}
                        className={`${
                          copiedPasscode
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white px-4 py-2 rounded-r-lg transition-colors flex items-center`}
                      >
                        {copiedPasscode ? (
                          <>
                            <FaCheck className="mr-2" /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy className="mr-2" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      The client will need this passcode to access their forms
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaRegClock className="mr-2 text-gray-500" /> Expires At
                    </label>
                    <div className="flex items-center">
                      <div className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                        {new Date(assignmentResult.batch.expiresAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      The access link will expire after this time
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={() => {
                    setAssignmentResult(null);
                    setShowAssignForm(false);
                  }}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  <FaArrowLeft className="mr-2" /> Back to Forms
                </button>

                <button
                  onClick={() => {
                    setAssignmentResult(null);
                    setShowAssignForm(true);
                  }}
                  className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
                >
                  <FaPlus className="mr-2" /> Assign More Forms
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                <FaFileAlt className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Forms for {client?.name || 'Client'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage forms assigned to this client
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition px-4 py-2 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50"
              >
                <FaArrowLeft className="mr-2" /> Back to Client
              </button>
              <button
                onClick={() => setShowAssignForm(!showAssignForm)}
                className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg shadow-sm"
              >
                {showAssignForm ? (
                  <>
                    <FaTimes className="mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Assign Forms
                  </>
                )}
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

        {/* Form Assignment Panel */}
        {showAssignForm && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-md mr-3">
                  <FaUserEdit className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Assign Forms</h2>
                  <p className="text-sm text-gray-500">
                    Select one or more forms to assign to this client
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleAssignForms}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date and Time
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        value={expirationTime}
                        onChange={(e) => setExpirationTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    The access link will expire after this time
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Forms
                    </label>
                    <span className="text-sm text-indigo-600 font-medium">
                      {selectedFormIds.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableForms.map((form) => {
                      const isSelected = selectedFormIds.includes(form.id);
                      return (
                        <div
                          key={form.id}
                          onClick={() => handleToggleFormSelection(form.id)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // Handled by parent div click
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-900">{form.title}</h3>
                              <p className="text-xs text-gray-500">Version {form.version}</p>
                              {form.description && (
                                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{form.description}</p>
                              )}
                              <p className="mt-1 text-xs text-gray-400">
                                Created: {new Date(form.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {availableForms.length === 0 && (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                        <FaFileAlt className="text-gray-400 text-2xl" />
                      </div>
                      <p className="text-gray-500 font-medium">No forms available to assign</p>
                      <p className="text-sm text-gray-400 mt-2">Please create forms first</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={assigningForm || selectedFormIds.length === 0}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm flex items-center justify-center disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {assigningForm ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <FaPlus className="mr-2" />
                        {selectedFormIds.length === 0
                          ? 'Select Forms to Assign'
                          : `Assign ${selectedFormIds.length} Form${selectedFormIds.length > 1 ? 's' : ''}`}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assigned Forms Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-md mr-3">
                <FaClipboard className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Assigned Forms</h2>
            </div>
          </div>

          {assignedForms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                <FaFileAlt className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 font-medium">No forms have been assigned to this client yet</p>
              <p className="text-sm text-gray-400 mt-2">Use the "Assign Forms" button to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiration Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedForms.map((form, index) => (
                    <tr
                      key={form.id}
                      className="hover:bg-indigo-50 transition"
                      style={{
                        animationDelay: `${index * 30}ms`,
                        animation: 'fadeIn 0.5s ease-in-out forwards'
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{form.form.title}</div>
                            <div className="text-sm text-gray-500">Version {form.form.version}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getFormStatusBadge(form)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.expiresAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/clients/${clientId}/forms/${assignedForms[0].formId}/${assignedForms[0].formVersion}/view`)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaLink className="mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
