"use client";

import { useState, useEffect, useCallback } from "react";
import { FaFileAlt, FaDownload, FaSearch, FaFilter, FaLock, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useRequireAuth from "../../hooks/useRequireAuth";

interface Document {
  id: string;
  clientId: string;
  clientName: string;
  formKey: string;
  formTitle: string;
  versionNumber: number;
  isLocked: boolean;
  signedAt: string | null;
  hasS3Pdf: boolean;
  signedPdfS3Key: string | null;
  updatedAt: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const FORM_TYPE_OPTIONS = [
  { value: "", label: "All Form Types" },
  { value: "client_intake_form", label: "Client Intake Form" },
  { value: "home_visit_risk_assessment", label: "Home Visit Risk Assessment" },
  { value: "person_centred_plan", label: "Person Centred Plan" },
  { value: "sa_delivery_of_supports", label: "SA Delivery of Supports" },
  { value: "participant_risk_assessment", label: "Participant Risk Assessment" },
  { value: "emergency_drill", label: "Emergency Drill" },
  { value: "individual_risk_assessment", label: "Individual Risk Assessment" },
  { value: "welcome_form", label: "Welcome Form" },
  { value: "multi_disciplinary_meeting", label: "Multi Disciplinary Meeting" },
  { value: "support_action_plan", label: "Support Action Plan" },
  { value: "schedule_of_supports", label: "Schedule of Supports" },
  { value: "sa_support_coordination", label: "SA Support Coordination" },
  { value: "conflict_of_interest", label: "Conflict of Interest" },
  { value: "ndis_consent", label: "NDIS Consent" },
  { value: "review_of_decision", label: "Review of Decision" },
  { value: "change_of_details", label: "Change of Details" },
];

export default function DocumentsPageClient() {
  const { session } = useRequireAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formKey, setFormKey] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 20, totalCount: 0, totalPages: 0 });

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("pageSize", String(pagination.pageSize));
      if (search) params.set("search", search);
      if (formKey) params.set("formKey", formKey);

      const res = await fetch(`/api/documents?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDocuments(data.documents);
      setPagination(data.pagination);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, formKey]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id);
    try {
      if (doc.hasS3Pdf && doc.signedPdfS3Key) {
        const res = await fetch(`/api/documents/download?s3Key=${encodeURIComponent(doc.signedPdfS3Key)}`);
        if (!res.ok) throw new Error("Failed to get download URL");
        const { url, filename } = await res.json();
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      } else if (doc.id) {
        // Fallback: try by submissionId or generate on-demand
        const res = await fetch(`/api/documents/download?submissionId=${doc.id}`);
        if (res.ok) {
          const { url, filename } = await res.json();
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
        } else {
          window.open(`/api/generate-pdf/${doc.id}/${doc.formKey}`, "_blank");
        }
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">All signed and completed forms for your organization</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by form title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500 text-sm"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={formKey}
              onChange={(e) => { setFormKey(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-azure-500 focus:border-azure-500 text-sm appearance-none bg-white min-w-[200px]"
            >
              {FORM_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-azure-500 to-azure-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Total Documents</p>
          <p className="text-2xl font-bold">{pagination.totalCount}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">With PDF Snapshot</p>
          <p className="text-2xl font-bold">{documents.filter(d => d.hasS3Pdf).length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">Locked (Immutable)</p>
          <p className="text-2xl font-bold">{documents.filter(d => d.isLocked).length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FaFileAlt className="mx-auto text-4xl mb-3 opacity-50" />
            <p>No signed documents found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Form</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Version</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Signed</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{doc.clientName}</td>
                    <td className="px-4 py-3 text-gray-700">{doc.formTitle}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-azure-100 text-azure-700">
                        v{doc.versionNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {doc.isLocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <FaLock className="text-[10px]" /> Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Signed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(doc.signedAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={downloading === doc.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-azure-500 hover:bg-azure-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <FaDownload className="text-[10px]" />
                        {downloading === doc.id ? "..." : "Download"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 transition-colors"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
