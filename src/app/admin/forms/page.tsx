// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function FormsManagement() {
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/forms");
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch forms");
//         }
        
//         const data = await response.json();
//         setForms(data);
//       } catch (error) {
//         console.error("Error fetching forms:", error);
//         setError("Failed to load forms. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchForms();
//   }, []);

//   const handleViewForm = (formId) => {
//     router.push(`/admin/forms/${formId}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//             <h1 className="text-2xl font-bold mb-6 text-center">Error</h1>
//             <p className="text-red-600 mb-4">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Form Management</h1>
//         <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
//           ← Back to Dashboard
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Form Key
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Version
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Created At
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {forms.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
//                   No forms found. Create your first form to get started.
//                 </td>
//               </tr>
//             ) : (
//               forms.map((form) => (
//                 <tr key={form.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {form.title}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {form.formKey}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {form.version}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(form.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <button
//                       onClick={() => handleViewForm(form.id)}
//                       className="text-blue-600 hover:text-blue-900 mr-4"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function FormsManagement() {
//   const [forms, setForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchForms = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/forms");
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch forms");
//         }
        
//         const data = await response.json();
//         setForms(data);
//       } catch (error) {
//         console.error("Error fetching forms:", error);
//         setError("Failed to load forms. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchForms();
//   }, []);

//   const handleViewForm = (formId) => {
//     router.push(`/admin/forms/${formId}`);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-center min-h-[60vh]">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//             <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900">Error</h1>
//             <p className="text-red-600 mb-4">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-semibold text-gray-900">Form Management</h1>
//         <Link href="/admin/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
//           ← Back to Dashboard
//         </Link>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-indigo-50">
//             <tr>
//               {["Title", "Form Key", "Version", "Created At", "Actions"].map((header) => (
//                 <th
//                   key={header}
//                   className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide select-none"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {forms.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="px-6 py-8 text-center text-gray-400 italic">
//                   No forms found. Create your first form to get started.
//                 </td>
//               </tr>
//             ) : (
//               forms.map((form) => (
//                 <tr
//                   key={form.id}
//                   className="hover:bg-indigo-50 transition-colors cursor-pointer"
//                   onClick={() => handleViewForm(form.id)}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {form.title}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {form.formKey}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {form.version}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {new Date(form.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleViewForm(form.id);
//                       }}
//                       className="hover:text-indigo-900 transition"
//                       aria-label={`View form ${form.title}`}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Skeleton loader row
function SkeletonRow() {
  return (
    <tr className="animate-pulse bg-white/60 backdrop-blur-sm">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-6 py-4 border-b border-gray-200">
          <div className="h-3.5 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded" />
        </td>
      ))}
    </tr>
  );
}

export default function FormsManagement() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/forms");
        if (!response.ok) throw new Error("Failed to fetch forms");

        const data = await response.json();
        setForms(data);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleViewForm = (formId) => {
    router.push(`/admin/forms/${formId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Form Management</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your available forms.</p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-800 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm mb-6 text-sm">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-md shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Form Key", "Version", "Created At", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Loading rows */}
            {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!loading && forms.length === 0 && !error && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-gray-500 italic"
                >
                  No forms available.
                </td>
              </tr>
            )}

            {/* Actual form rows */}
            {!loading &&
              !error &&
              forms.map((form) => (
                <tr
                  key={form.id}
                  onClick={() => handleViewForm(form.id)}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {form.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{form.formKey}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{form.version}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewForm(form.id);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 transition font-medium"
                      aria-label={`View ${form.title}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
