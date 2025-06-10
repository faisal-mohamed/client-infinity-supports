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
import { FaPlus, FaEye, FaFileAlt, FaArrowLeft, FaSearch } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleViewForm = (formId : string) => {
    router.push(`/admin/forms/${formId}`);
  };

  const filteredForms = forms.filter((form : any)   =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.formKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                <FaFileAlt className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Form Management</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of your available forms and templates</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition px-4 py-2 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50"
              >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
              </Link>
              <button
                onClick={() => router.push('/admin/forms/create')}
                className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg shadow-sm"
              >
                <FaPlus className="mr-2" /> Create Form
              </button>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search forms by title or key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              {!loading && (
                <span>
                  Showing <span className="font-medium text-gray-700">{filteredForms.length}</span> of{" "}
                  <span className="font-medium text-gray-700">{forms.length}</span> forms
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error state */}
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
                <button
                  onClick={() => window.location.reload()}
                  className="mt-1 text-sm font-medium underline hover:text-red-800"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table layout */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                {!loading && filteredForms.length === 0 && !error && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                          <FaFileAlt className="text-gray-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium mb-1">
                          {searchTerm ? "No forms match your search" : "No forms available"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {searchTerm ? "Try adjusting your search terms" : "Create your first form to get started"}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Actual form rows */}
                {!loading &&
                  !error &&
                  filteredForms.map((form : any, index) => (
                    <tr
                      key={form.id}
                      onClick={() => handleViewForm(form.id)}
                      className="hover:bg-indigo-50 transition cursor-pointer"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeIn 0.5s ease-in-out forwards'
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{form.title}</div>
                            <div className="text-xs text-gray-500">ID: {form.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {form.formKey}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          v{form.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(form.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewForm(form.id);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          aria-label={`View ${form.title}`}
                        >
                          <FaEye className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}