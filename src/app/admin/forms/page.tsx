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
          <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
            <FaFileAlt className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-azure-700">Form Management</h1>
            <p className="text-sm text-azure-400 mt-0.5">View list of all forms</p>
          </div>
        </div>
        <span className="text-sm text-azure-500 bg-azure-50 px-3.5 py-1.5 rounded-lg font-medium border border-azure-100">
          Showing <span className="font-bold text-azure-700">{filteredForms.length}</span> of <span className="font-bold text-azure-700">{forms.length}</span> forms
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-azure-100/60 p-4 mb-4 shadow-soft">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-azure-300 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search forms by title or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-azure-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => window.location.reload()} className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-azure-100/60 overflow-hidden shadow-soft">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-azure-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-azure-400">Loading forms...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-azure-100 text-sm">
              <thead className="bg-azure-50/50">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-azure-700 uppercase tracking-wider">Signature</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-azure-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-azure-50">
                {filteredForms.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-12 text-azure-300 text-sm">No forms found.</td></tr>
                ) : (
                  filteredForms.map((form: any) => (
                    <tr key={form.id} onClick={() => handleViewForm(form.id)} className="hover:bg-azure-50/30 transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-azure-50 flex items-center justify-center flex-shrink-0 border border-azure-100">
                            <FaFileAlt className="text-azure-500 w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-azure-700">{form.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {form.requiresSignature && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="hidden sm:inline">Requires Signature</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewForm(form.id); }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-azure-700 bg-azure-50 rounded-xl hover:bg-azure-100 border border-azure-100 transition-all duration-200"
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
