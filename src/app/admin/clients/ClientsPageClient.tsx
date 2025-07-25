"use client";

import { useState, useEffect } from "react";
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
  FaEllipsisV
} from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { getClients, deleteClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/ui/Confirm";
import useRequireAuth from "../../hooks/useRequireAuth";

// Define client type
type Client = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  commonFields?: {
    ndis?: string;
    state?: string;
    disability?: string;
    sex?: string;
  };
};

// Define pagination type
type Pagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Define filter state type
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const confirm = useConfirm();

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    state: "",
    sex: "",
    hasNdis: "",
    hasDisability: "",
  });

  // Available states for filter
  const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];
  const sexOptions = ["Male", "Female", "Other", "Prefer not to say"];

  // Load clients with pagination
  const loadClients = async () => {
    try {
      setLoading(true);

      // Convert filter values for API
      const apiFilters = {
        state: filters.state,
        sex: filters.sex,
        hasNdis: filters.hasNdis ? filters.hasNdis === "yes" : undefined,
        hasDisability: filters.hasDisability
          ? filters.hasDisability === "yes"
          : undefined,
      };

      const data = await getClients({
        search: searchTerm,
        filters: apiFilters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      setClients(data.clients);
      console.log("data.clients: ", data.clients);
      setPagination(data.pagination);
      setError("");
    } catch (err) {
      setError("Failed to load clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load clients when page, pageSize, search, or filters change
  useEffect(() => {
    loadClients();
  }, [pagination.page, pagination.pageSize, searchTerm, filters]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply sorting to clients
  const sortedClients = [...clients].sort((a: any, b: any) => {
    let aValue: any = a[sortField as keyof Client];
    let bValue: any = b[sortField as keyof Client];

    // Handle nested fields
    if (sortField.includes(".")) {
      const [parent, child] = sortField.split(".");
      aValue = a[parent as keyof Client]?.[child as any] || "";
      bValue = b[parent as keyof Client]?.[child as any] || "";
    }

    // Handle null values
    if (aValue === null) aValue = "";
    if (bValue === null) bValue = "";

    // Compare values
    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : bValue > aValue
        ? 1
        : -1;
    }
  });

  useEffect(() => {
    console.log("Sorted Clients:", sortedClients);
  }, [sortedClients]);

  const handleDeleteClient = async (id: number) => {
    if (isDeleting) return;

    const confirmed = await confirm.confirm({
      title: "Delete Client",
      message:
        "Are you sure you want to delete this client? This will also delete all associated data.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteClient(id);
      loadClients();
      setError("");
    } catch (err) {
      setError("Failed to delete client");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (isDeleting || selectedClients.length === 0) return;

    const confirmed = await confirm.confirm({
      title: "Delete Selected Clients",
      message: `Are you sure you want to delete ${selectedClients.length} selected client(s)? This will also delete all associated data.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      for (const id of selectedClients) {
        await deleteClient(id);
      }

      loadClients();
      setSelectedClients([]);
      setSelectAll(false);
      setError("");
    } catch (err) {
      setError("Failed to delete selected clients");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(sortedClients.map((client) => client.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectClient = (id: number) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter((clientId) => clientId !== id));
      setSelectAll(false);
    } else {
      setSelectedClients([...selectedClients, id]);
      if (selectedClients.length + 1 === sortedClients.length) {
        setSelectAll(true);
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      state: "",
      sex: "",
      hasNdis: "",
      hasDisability: "",
    });
    // Reset to first page when filters change
    setPagination({ ...pagination, page: 1 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when search changes
    setPagination({ ...pagination, page: 1 });
    loadClients();
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPagination({ ...pagination, page: 1, pageSize: newPageSize });
  };

  const [excelLoading, setExcelLoading] = useState(false);

  const exportToExcel = async () => {
    setExcelLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm || "",
        state: filters.state || "",
        sex: filters.sex || "",
        hasNdis: filters.hasNdis || "",
        hasDisability: filters.hasDisability || "",
      });

      console.log("query:", query.toString());

      const response = await fetch(`/api/clients/export?${query.toString()}`);

      console.log("response:", response);

      if (!response.ok) {
        throw new Error("Failed to download Excel");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `infinity_support_clients_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Failed to export Excel file.");
    } finally {
      setExcelLoading(false);
    }
  };

  if (status === "loading" || !session) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-400 text-white shadow-lg">
              <FaUserFriends className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Client Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your clients and their information efficiently
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">
                    {pagination.totalCount} Total Clients
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-all duration-200 px-4 py-3 border border-gray-200 rounded-xl hover:border-rose-200 hover:bg-rose-50 justify-center shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <Link
              href="/admin/clients/create"
              className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold justify-center"
            >
              <FaUserPlus className="h-4 w-4" />
              Add New Client
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Enhanced Header */}

        {/* Enhanced Actions and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-between"
          >
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search clients by name, email or phone..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm sm:text-base shadow-sm hover:shadow-md transition-shadow duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 border rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 ${
                  showFilters
                    ? "bg-gradient-to-r from-rose-50 to-rose-100 border-rose-300 text-rose-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaFilter className="h-4 w-4" />
                Filters
                {Object.values(filters).some((v) => v !== "") && (
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                    {Object.values(filters).filter((v) => v !== "").length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={exportToExcel}
                disabled={excelLoading}
                className="flex items-center gap-2 px-6 py-4 border border-green-300 bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaDownload className="h-4 w-4" />
                {!excelLoading ? "Download Excel" : "Downloading..."}
              </button>

              {selectedClients.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-4 border border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 hover:from-rose-100 hover:to-rose-200 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaTrash className="h-4 w-4" />
                  Delete ({selectedClients.length})
                </button>
              )}
            </div>
          </form>

          {/* Enhanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-inner">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="font-bold text-gray-900 text-lg">
                  Filter Clients
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-rose-600 hover:text-rose-800 font-semibold bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Reset All Filters
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => {
                      setFilters({ ...filters, state: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={filters.sex}
                    onChange={(e) => {
                      setFilters({ ...filters, sex: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All</option>
                    {sexOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Has NDIS Number
                  </label>
                  <select
                    value={filters.hasNdis}
                    onChange={(e) => {
                      setFilters({ ...filters, hasNdis: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Has Disability
                  </label>
                  <select
                    value={filters.hasDisability}
                    onChange={(e) => {
                      setFilters({ ...filters, hasDisability: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Enhanced Error message */}
        {error && (
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-500 text-white shadow-md">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    Error Loading Clients
                  </h3>
                  <p className="text-red-700 font-medium mb-4">{error}</p>
                  <button
                    onClick={() => loadClients()}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Clients Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="text-center">
                {/* Spinner */}
                <div className="w-20 h-20 border-4 border-t-rose-500 border-rose-200 rounded-full animate-spin mx-auto mb-6"></div>

                {/* Text */}
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Loading Clients
                </h3>
                <p className="text-slate-600 font-medium">
                  Please wait while we fetch your client data...
                </p>

                {/* Bouncing dots */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow hover:shadow-lg transition-shadow duration-300">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                          <input type="checkbox" className="accent-rose-500" />
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500 cursor-pointer hover:bg-rose-50 transition"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-2">Name</div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500 cursor-pointer hover:bg-rose-50 transition"
                          onClick={() => handleSort("phone")}
                        >
                          <div className="flex items-center gap-2">Phone</div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500 cursor-pointer hover:bg-rose-50 transition"
                          onClick={() => handleSort("commonFields.state")}
                        >
                          <div className="flex items-center gap-2">State</div>
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500 cursor-pointer hover:bg-rose-50 transition"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center gap-2">
                            Created At
                          </div>
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {clients.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-16 text-gray-500 font-medium"
                          >
                            No clients found.
                          </td>
                        </tr>
                      ) : (
                        clients.map((client: any, index: any) => (
                          <tr
                            key={client.id}
                            className="hover:bg-rose-50 transition"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="accent-rose-500"
                                checked={selectedClients.includes(client.id)}
                                onChange={() => handleSelectClient(client.id)}
                              />
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 flex items-center justify-center bg-rose-100 text-rose-600 rounded-lg font-bold">
                                  {client.name?.charAt(0)}
                                </div>
                                {client.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {client.phone || (
                                <span className="text-gray-400 italic">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {client?.commonFields[0]?.state ? (
                                <span className="inline-block text-xs font-medium bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                                  {client?.commonFields[0]?.state}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400 italic">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              <div>
                                {new Date(
                                  client.createdAt
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(client.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </div>
                            </td>
                           <td className="px-6 py-4 text-right">
  <Menu as="div" className="relative inline-block text-left">
    <MenuButton className="text-slate-500 hover:text-rose-600 transition">
      <FaEllipsisV className="w-5 h-5" />
    </MenuButton>

    <MenuItems className="absolute right-0 mt-2 w-44 origin-top-right bg-white border border-gray-200 rounded-xl shadow-lg focus:outline-none z-50">
      <div className="py-1 text-sm text-slate-700">
        <MenuItem>
          {({ active } : any ) => (
            <Link
              href={`/admin/clients/${client.id}`}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-slate-50 ${
                active ? "text-slate-600" : ""
              }`}
            >
              <FaEye className="w-4 h-4" />
              View
            </Link>
          )}
        </MenuItem>

        <MenuItem>
          {({ active } : any ) => (
            <Link
              href={`/admin/clients/${client.id}/forms`}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-green-50 ${
                active ? "text-green-600" : ""
              }`}
            >
              <FaFileAlt className="w-4 h-4" />
              Forms
            </Link>
          )}
        </MenuItem>

        <MenuItem>
          {({ active }) => (
            <button
              onClick={() => handleDeleteClient(client.id)}
              className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-red-50 ${
                active ? "text-red-600" : ""
              }`}
            >
              <FaTrash className="w-4 h-4" />
              Delete
            </button>
          )}
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enhanced Pagination Controls */}
              <div className="px-6 sm:px-8 py-6 bg-white border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                  {/* Showing count and dropdown */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <p className="text-sm font-medium text-gray-700">
                      Showing{" "}
                      <span className="font-bold text-rose-600">
                        {sortedClients.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-rose-600">
                        {pagination.totalCount}
                      </span>{" "}
                      clients
                    </p>

                    {/* Page size dropdown */}
                    <div className="relative inline-block">
                      <label
                        htmlFor="pageSize"
                        className="text-sm font-medium text-gray-600 mr-2"
                      >
                        Show:
                      </label>
                      <select
                        id="pageSize"
                        value={pagination.pageSize}
                        onChange={handlePageSizeChange}
                        className="cursor-pointer appearance-none border border-rose-300 text-sm text-rose-700 font-medium bg-white py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 hover:shadow-md transition duration-200"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Prev, current page, and next buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        pagination.hasPreviousPage
                          ? "bg-white text-rose-600 border border-gray-300 hover:bg-rose-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      ‹ Prev
                    </button>

                    {/* Page Number */}
                    <span className="text-sm text-gray-700 font-medium">
                      Page{" "}
                      <span className="text-rose-600 font-bold">
                        {pagination.page}
                      </span>{" "}
                      of{" "}
                      <span className="text-rose-600 font-bold">
                        {pagination.totalPages}
                      </span>
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        pagination.hasNextPage
                          ? "bg-white text-rose-600 border border-gray-300 hover:bg-rose-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
