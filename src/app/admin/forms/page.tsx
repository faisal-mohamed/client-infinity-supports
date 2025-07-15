

'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaEye, FaFileAlt, FaArrowLeft, FaSearch } from "react-icons/fa";
import useRequireAuth from '../../hooks/useRequireAuth';

// Enhanced skeleton loader row
function SkeletonRow() {
  return (
    <tr className="animate-pulse bg-white hover:bg-gray-50 transition-colors duration-200">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-8 py-6 border-b border-gray-100">
          <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

export default function FormsManagement() {
  // Call auth hook first
  const { session, status } = useRequireAuth();
  // Now call other hooks
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

  if (status === 'loading' || !session) return null;


  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading All Forms</h3>
          <p className="text-gray-600 font-medium">Please wait...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <FaFileAlt className="text-2xl sm:text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Form Management</h1>
                <p className="text-sm sm:text-base text-gray-600">Overview of your available forms and templates</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{forms.length} Total Forms</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-all duration-200 px-4 py-3 border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 justify-center shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaArrowLeft className="h-4 w-4" /> 
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Search and filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search forms by title or key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                {!loading && (
                  <span>
                    Showing <span className="font-bold text-indigo-600">{filteredForms.length}</span> of{" "}
                    <span className="font-bold text-indigo-600">{forms.length}</span> forms
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Error state */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-500 text-white shadow-md">
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Forms</h3>
                  <p className="text-red-700 font-medium mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Table layout */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {["Title", "Form Key", "Signature", "Created At", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Loading rows */}

                {/* Enhanced Empty state */}
                {!loading && filteredForms.length === 0 && !error && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-20 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                          <FaFileAlt className="text-gray-400 text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {searchTerm ? "No Forms Found" : "No Forms Available"}
                        </h3>
                        <p className="text-gray-500 font-medium mb-2 max-w-md text-center leading-relaxed">
                          {searchTerm ? 
                            "No forms match your current search criteria. Try adjusting your search terms." :
                            "You haven't created any forms yet. Start by creating your first form template."}
                        </p>
                        {searchTerm ? (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Clear Search
                          </button>
                        ) : (
                          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-sm font-medium text-blue-700">
                              ℹ️ Forms will appear here once they are created in the system
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Enhanced Actual form rows */}
                {!loading &&
                  !error &&
                  filteredForms.map((form : any, index) => (
                    <tr
                      key={form.id}
                      onClick={() => handleViewForm(form.id)}
                      className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                            <FaFileAlt className="text-white h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{form.title}</div>
                            
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                          {form.formKey}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                       {  (form.requiresSignature) ?  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm">
                          {`Requires Signature`}
                        </span> : <></>}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(form.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(form.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewForm(form.id);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                          aria-label={`View ${form.title}`}
                        >
                          <FaEye className="h-4 w-4" /> 
                          View Form
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
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}