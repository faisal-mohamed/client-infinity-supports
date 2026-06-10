"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaFileAlt,
  FaFilter,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaUserFriends,
  FaArrowLeft,
  FaUserPlus,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaChevronDown
} from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems, Listbox, Transition } from "@headlessui/react";
import { getClients, deleteClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/ui/Confirm";
import useRequireAuth from "../../hooks/useRequireAuth";

type Client = {
  id: string | number;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  commonFields?: {
    ndis?: string;
    state?: string;
    disability?: string;
    sex?: string;
    name?: string;
    surname?: string;
  };
};

type Pagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type FilterState = {
  state: string;
  sex: string;
  hasNdis: string;
  hasDisability: string;
};

export default function ClientsPageClient() {
  const { session, status } = useRequireAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const confirm = useConfirm();

  const [pagination, setPagination] = useState<Pagination>({
    page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });

  const [filters, setFilters] = useState<FilterState>({ state: "", sex: "", hasNdis: "", hasDisability: "" });

  const stateMapping = {
    "ACT": "Australian Capital Territory", "NSW": "New South Wales", "NT": "Northern Territory",
    "QLD": "Queensland", "SA": "South Australia", "TAS": "Tasmania", "VIC": "Victoria", "WA": "Western Australia"
  };
  const states = Object.keys(stateMapping);
  const sexOptions = ["Male", "Female", "Other", "Prefer not to say"];

  type Option = { value: string; label: string };
  const stateOptions: Option[] = [{ value: "", label: "All States" }, ...states.map((s) => ({ value: s, label: stateMapping[s as keyof typeof stateMapping] }))];
  const sexOptionsList: Option[] = [{ value: "", label: "All" }, ...sexOptions.map((o) => ({ value: o, label: o }))];
  const yesNoOptions: Option[] = [{ value: "", label: "All" }, { value: "yes", label: "Yes" }, { value: "no", label: "No" }];

  function FilterSelect({ ariaLabel, value, onChange, options }: { ariaLabel: string; value: string; onChange: (v: string) => void; options: Option[] }) {
    const selected = options.find((o) => o.value === value) || options[0];
    return (
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button aria-label={ariaLabel} className="w-full bg-white rounded-xl border border-azure-100 px-3.5 py-2.5 pr-8 text-sm text-azure-700 text-left focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-azure-300">
              <FaChevronDown className="h-3 w-3" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options anchor="bottom start" className="z-50 w-[var(--button-width)] overflow-auto rounded-xl border border-azure-100 bg-white py-1 text-sm shadow-elevated focus:outline-none [--anchor-gap:4px] [--anchor-max-height:240px]">
              {options.map((opt) => (
                <Listbox.Option key={opt.value + opt.label} value={opt.value} className={({ active, selected }) => `cursor-pointer select-none px-3.5 py-2.5 ${selected ? "bg-gold-50 text-azure-700 font-semibold" : active ? "bg-azure-50/50" : "text-azure-600"}`}>
                  {opt.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    );
  }

  const loadClients = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        state: filters.state, sex: filters.sex,
        hasNdis: filters.hasNdis ? filters.hasNdis === "yes" : undefined,
        hasDisability: filters.hasDisability ? filters.hasDisability === "yes" : undefined,
      };
      const data = await getClients({ search: debouncedSearchTerm, filters: apiFilters, page: pagination.page, pageSize: pagination.pageSize });
      if (!data || !Array.isArray(data.clients)) throw new Error("Invalid response format from server");
      setClients(data.clients);
      setPagination(data.pagination || pagination);
      setError("");
    } catch (err: any) {
      setError(err?.message || "Failed to load participants");
      if (process.env.NODE_ENV === 'development') console.error("Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) setPagination({ ...pagination, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => { loadClients(); }, [pagination.page, pagination.pageSize, debouncedSearchTerm, filters]);

  const handleSort = (field: string) => {
    if (sortField === field) { setSortDirection(sortDirection === "asc" ? "desc" : "asc"); }
    else { setSortField(field); setSortDirection("asc"); }
  };

  const sortedClients = sortField === "name" ? clients : [...clients].sort((a: any, b: any) => {
    let aValue: any = a[sortField as keyof Client];
    let bValue: any = b[sortField as keyof Client];
    if (sortField.includes(".")) { const [parent, child] = sortField.split("."); aValue = a[parent as keyof Client]?.[child as any] || ""; bValue = b[parent as keyof Client]?.[child as any] || ""; }
    if (aValue === null) aValue = "";
    if (bValue === null) bValue = "";
    try {
      if (typeof aValue === "string") { const c = aValue.localeCompare(bValue, 'en-AU', { sensitivity: 'base', numeric: true }); return sortDirection === "asc" ? c : -c; }
      else { return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (bValue > aValue ? 1 : -1); }
    } catch { const aStr = String(aValue || "").toLowerCase(); const bStr = String(bValue || "").toLowerCase(); const c = aStr.localeCompare(bStr); return sortDirection === "asc" ? c : -c; }
  });

  const handleDeleteClient = async (id: string | number) => {
    if (isDeleting) return;
    const confirmed = await confirm.confirm({ title: "Delete Participant", message: "Are you sure you want to delete this participant? This will also delete all associated data.", confirmText: "Delete", cancelText: "Cancel", type: "danger" });
    if (!confirmed) return;
    try { setIsDeleting(true); await deleteClient(id); loadClients(); setError(""); } catch (err) { setError("Failed to delete participant"); console.error(err); } finally { setIsDeleting(false); }
  };

  const handleDeleteSelected = async () => {
    if (isDeleting || selectedClients.length === 0) return;
    const confirmed = await confirm.confirm({ title: "Delete Selected Participants", message: `Are you sure you want to delete ${selectedClients.length} selected participant(s)? This will also delete all associated data.`, confirmText: "Delete", cancelText: "Cancel", type: "danger" });
    if (!confirmed) return;
    try { setIsDeleting(true); for (const id of selectedClients) { await deleteClient(id); } loadClients(); setSelectedClients([]); setSelectAll(false); setError(""); } catch (err) { setError("Failed to delete selected participants"); console.error(err); } finally { setIsDeleting(false); }
  };

  const handleSelectAll = () => { if (selectAll) { setSelectedClients([]); } else { setSelectedClients(sortedClients.map((c) => c.id)); } setSelectAll(!selectAll); };
  const handleSelectClient = (id: string | number) => { if (selectedClients.includes(id)) { setSelectedClients(selectedClients.filter((cid) => cid !== id)); setSelectAll(false); } else { setSelectedClients([...selectedClients, id]); if (selectedClients.length + 1 === sortedClients.length) setSelectAll(true); } };
  const resetFilters = () => { setFilters({ state: "", sex: "", hasNdis: "", hasDisability: "" }); setPagination({ ...pagination, page: 1 }); };
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPagination({ ...pagination, page: 1 }); loadClients(); };
  const handlePageChange = (newPage: number) => { setPagination({ ...pagination, page: newPage }); };
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setPagination({ ...pagination, page: 1, pageSize: parseInt(e.target.value) }); };

  const [excelLoading, setExcelLoading] = useState(false);
  const exportToExcel = async () => {
    setExcelLoading(true);
    try {
      const query = new URLSearchParams({ search: searchTerm || "", state: filters.state || "", sex: filters.sex || "", hasNdis: filters.hasNdis || "", hasDisability: filters.hasDisability || "" });

      console.log("query:", query.toString());

      const response = await fetch(`/api/clients/export?${query.toString()}`);

      console.log("response:", response);

      if (!response.ok) throw new Error("Failed to download Excel");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a"); link.href = url; link.download = `infinity_support_participants_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    } catch (error) { console.error("Excel export failed:", error); alert("Failed to export Excel file."); } finally { setExcelLoading(false); }
  };

  if (status === "loading" || !session) return null;

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <FaSort className="w-3 h-3 text-azure-200" />;
    return sortDirection === "asc" ? <FaSortUp className="w-3 h-3 text-gold-500" /> : <FaSortDown className="w-3 h-3 text-gold-500" />;
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-2xl border border-azure-100/60 p-6 mb-6 shadow-soft">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-azure-700 text-gold-400 shadow-soft">
              <FaUserFriends className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-azure-700">Participant Management</h1>
              <p className="text-sm text-azure-400 mt-0.5">Manage your participants and their information efficiently</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-azure-400">
                <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                <span className="font-medium">{pagination.totalCount} Total Participants</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm text-azure-600 hover:text-azure-700 px-3 py-2.5 border border-azure-100 rounded-xl hover:bg-azure-50 justify-center transition-all duration-200">
              <FaArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Link>
            <Link href="/admin/clients/create" className="flex items-center gap-2 text-sm text-white bg-azure-700 hover:bg-azure-600 px-4 py-2.5 rounded-xl font-semibold justify-center transition-all duration-200 shadow-soft hover:shadow-elevated">
              <FaUserPlus className="h-3.5 w-3.5" />
              Add New Participant
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-azure-100/60 mb-4 shadow-soft">
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-azure-300 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search participants by name, email, phone, NDIS number, state..."
                className="w-full pl-10 pr-4 py-2.5 border border-azure-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-3.5 py-2.5 border rounded-xl text-sm transition-all duration-200 ${showFilters ? "bg-gold-50 border-gold-300 text-azure-700" : "border-azure-100 text-azure-500 hover:bg-azure-50"}`}>
                <FaFilter className="w-3 h-3" />
                Filters
                {Object.values(filters).some((v) => v !== "") && (
                  <span className="bg-gold-500 text-azure-700 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{Object.values(filters).filter((v) => v !== "").length}</span>
                )}
              </button>
              <button type="button" onClick={exportToExcel} disabled={excelLoading} className="flex items-center gap-2 px-3.5 py-2.5 border border-azure-100 text-azure-500 rounded-xl text-sm hover:bg-azure-50 transition-all duration-200">
                <FaDownload className="w-3 h-3" />
                {!excelLoading ? "Download Excel" : "Downloading..."}
              </button>
              {selectedClients.length > 0 && (
                <button type="button" onClick={handleDeleteSelected} disabled={isDeleting} className="flex items-center gap-2 px-3.5 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm hover:bg-red-50 transition-all duration-200">
                  <FaTrash className="w-3 h-3" />
                  Delete ({selectedClients.length})
                </button>
              )}
            </div>
          </form>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-azure-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-azure-700">Filter by</span>
                <button onClick={resetFilters} className="text-xs text-gold-600 hover:text-gold-700 font-semibold">Reset all</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-azure-400 mb-1">State</label>
                  <FilterSelect ariaLabel="Filter by state" value={filters.state} onChange={(v) => { setFilters({ ...filters, state: v }); setPagination({ ...pagination, page: 1 }); }} options={stateOptions} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-azure-400 mb-1">Gender</label>
                  <FilterSelect ariaLabel="Filter by gender" value={filters.sex} onChange={(v) => { setFilters({ ...filters, sex: v }); setPagination({ ...pagination, page: 1 }); }} options={sexOptionsList} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-azure-400 mb-1">Has NDIS</label>
                  <FilterSelect ariaLabel="Filter by NDIS availability" value={filters.hasNdis} onChange={(v) => { setFilters({ ...filters, hasNdis: v }); setPagination({ ...pagination, page: 1 }); }} options={yesNoOptions} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-azure-400 mb-1">Has Disability</label>
                  <FilterSelect ariaLabel="Filter by disability" value={filters.hasDisability} onChange={(v) => { setFilters({ ...filters, hasDisability: v }); setPagination({ ...pagination, page: 1 }); }} options={yesNoOptions} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 flex items-center gap-3">
          <div className="text-red-500 flex-shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => loadClients()} className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-azure-100/60 overflow-hidden shadow-soft">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-azure-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-azure-400">Loading participants...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-azure-100 text-sm">
                <thead className="bg-azure-50/50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-azure-200 text-gold-600 focus:ring-gold-500/30" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-azure-600 uppercase tracking-wider cursor-pointer hover:text-azure-700" onClick={() => handleSort("name")} aria-sort={sortField === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined} aria-label={sortField === "name" ? `Sort by name, currently ${sortDirection === "asc" ? "ascending" : "descending"}` : "Sort by name"} role="columnheader" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("name"); } }}>
                      <div className="flex items-center gap-1">Name <SortIcon field="name" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-azure-600 uppercase tracking-wider cursor-pointer hover:text-azure-700" onClick={() => handleSort("phone")} aria-sort={sortField === "phone" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined} aria-label={sortField === "phone" ? `Sort by phone, currently ${sortDirection === "asc" ? "ascending" : "descending"}` : "Sort by phone"} role="columnheader" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("phone"); } }}>
                      <div className="flex items-center gap-1">Phone <SortIcon field="phone" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-azure-600 uppercase tracking-wider cursor-pointer hover:text-azure-700" onClick={() => handleSort("commonFields.state")} aria-sort={sortField === "commonFields.state" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined} aria-label={sortField === "commonFields.state" ? `Sort by state, currently ${sortDirection === "asc" ? "ascending" : "descending"}` : "Sort by state"} role="columnheader" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("commonFields.state"); } }}>
                      <div className="flex items-center gap-1">State <SortIcon field="commonFields.state" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-azure-600 uppercase tracking-wider cursor-pointer hover:text-azure-700" onClick={() => handleSort("createdAt")} aria-sort={sortField === "createdAt" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined} aria-label={sortField === "createdAt" ? `Sort by created date, currently ${sortDirection === "asc" ? "ascending" : "descending"}` : "Sort by created date"} role="columnheader" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("createdAt"); } }}>
                      <div className="flex items-center gap-1">Created At <SortIcon field="createdAt" /></div>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-azure-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-azure-50">
                  {sortedClients.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-azure-300 text-sm">No participants found.</td></tr>
                  ) : (
                    sortedClients.map((client: any) => {
                      const fullName = client?.commonFields?.name && client?.commonFields?.surname
                        ? `${client.commonFields.name} ${client.commonFields.surname}`.trim()
                        : client?.name || 'Unknown Client';
                      const state = Array.isArray(client?.commonFields) ? client?.commonFields[0]?.state : client?.commonFields?.state;
                      return (
                        <tr key={client.id} className="hover:bg-azure-50/50/50 transition-colors">
                          <td className="px-4 py-3">
                            <input type="checkbox" className="rounded border-azure-200 text-gold-600 focus:ring-gold-500/30" checked={selectedClients.includes(client.id)} onChange={() => handleSelectClient(client.id)} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 flex items-center justify-center bg-azure-50 text-azure-700 rounded-xl text-xs font-semibold">
                                {fullName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-azure-700">{fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-azure-500">{client.phone || <span className="text-azure-200">—</span>}</td>
                          <td className="px-4 py-3">
                            {state ? (
                              <span className="inline-flex text-xs font-medium bg-azure-50 text-azure-500 px-2 py-0.5 rounded-md">{stateMapping[state as keyof typeof stateMapping] || state}</span>
                            ) : <span className="text-azure-200">—</span>}
                          </td>
                          <td className="px-4 py-3 text-azure-400 text-xs">
                            <div>{new Date(client.createdAt).toLocaleDateString()}</div>
                            <div className="text-azure-300">{new Date(client.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Menu as="div" className="relative inline-block text-left">
                              <MenuButton className="p-1.5 rounded-xl text-azure-300 hover:text-azure-500 hover:bg-azure-50 transition-colors">
                                <FaEllipsisV className="w-3.5 h-3.5" />
                              </MenuButton>
                              <MenuItems anchor="bottom end" className="w-36 bg-white border border-azure-100 rounded-xl shadow-elevated focus:outline-none z-50 py-1 [--anchor-gap:4px]">
                                <MenuItem>{({ active }) => (<Link href={`/admin/clients/${client.id}`} className={`flex items-center gap-2 px-3 py-2 text-sm ${active ? "bg-azure-50" : ""} text-azure-700`}><FaEye className="w-3.5 h-3.5" />View</Link>)}</MenuItem>
                                <MenuItem>{({ active }) => (<Link href={`/admin/clients/${client.id}/forms`} className={`flex items-center gap-2 px-3 py-2 text-sm ${active ? "bg-azure-50" : ""} text-azure-700`}><FaFileAlt className="w-3.5 h-3.5" />Forms</Link>)}</MenuItem>
                                <MenuItem>{({ active }) => (<button onClick={() => handleDeleteClient(client.id)} className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left ${active ? "bg-red-50" : ""} text-red-600`}><FaTrash className="w-3.5 h-3.5" />Delete</button>)}</MenuItem>
                              </MenuItems>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-azure-50 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3 text-sm text-azure-400">
                <span>Showing <span className="font-medium text-azure-700">{sortedClients.length}</span> of <span className="font-medium text-azure-700">{pagination.totalCount}</span></span>
                <select value={pagination.pageSize} onChange={handlePageSizeChange} className="border border-azure-100 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500/30">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePageChange(pagination.page - 1)} disabled={!pagination.hasPreviousPage} className="px-3 py-1.5 text-xs font-medium border border-azure-100 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-azure-50/50 transition-colors">
                  Previous
                </button>
                <span className="text-xs text-azure-400">Page <span className="font-medium text-azure-700">{pagination.page}</span> of <span className="font-medium text-azure-700">{pagination.totalPages}</span></span>
                <button onClick={() => handlePageChange(pagination.page + 1)} disabled={!pagination.hasNextPage} className="px-3 py-1.5 text-xs font-medium border border-azure-100 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-azure-50/50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
