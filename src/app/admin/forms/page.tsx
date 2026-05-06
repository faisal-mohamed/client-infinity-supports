"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaFileAlt, FaSearch } from "react-icons/fa";
import useRequireAuth from "../../hooks/useRequireAuth";

const CLIENT_FORM_KEYS = [
  'client_intake_form', 'home_visit_risk_assessment', 'person_centred_plan',
  'sa_delivery_of_supports', 'participant_risk_assessment', 'emergency_drill',
  'individual_risk_assessment', 'welcome_form', 'support_action_plan',
  'schedule_of_supports', 'sa_support_coordination', 'multi_disciplinary_meeting',
  'conflict_of_interest', 'ndis_consent', 'review_of_decision', 'change_of_details'
];

export default function FormsManagement() {
  const { session, status } = useRequireAuth();
  const [forms, setForms] = useState<any[]>([]);
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
        const clientForms = Array.isArray(data) ? data.filter((form: any) => CLIENT_FORM_KEYS.includes(form.formKey)) : [];
        setForms(clientForms);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load forms. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const handleViewForm = (formId: string) => { router.push(`/admin/forms/${formId}`); };

  const filteredForms = forms.filter((form: any) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.formKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || !session) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
            <FaFileAlt className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Form Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">View list of all forms</p>
          </div>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
          Showing <span className="font-medium text-gray-700">{filteredForms.length}</span> of <span className="font-medium text-gray-700">{forms.length}</span> forms
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search forms by title or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 flex items-center gap-3">
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Loading forms...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signature</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredForms.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-12 text-gray-400 text-sm">No forms found.</td></tr>
                ) : (
                  filteredForms.map((form: any) => (
                    <tr key={form.id} onClick={() => handleViewForm(form.id)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <FaFileAlt className="text-gray-500 w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-gray-900">{form.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {form.requiresSignature && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="hidden sm:inline">Requires Signature</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewForm(form.id); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                          aria-label={`View ${form.title}`}
                        >
                          <FaEye className="w-3 h-3" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
