"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye, FaTrash, FaFileAlt, FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown, FaDownload, FaUserFriends, FaArrowLeft, FaUserPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getClients, deleteClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/components/ui/Confirm';

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
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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
    hasPreviousPage: false
  });

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    state: '',
    sex: '',
    hasNdis: '',
    hasDisability: ''
  });

  // Available states for filter
  const states = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
  const sexOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Load clients with pagination
  const loadClients = async () => {
    try {
      setLoading(true);

      // Convert filter values for API
      const apiFilters = {
        state: filters.state,
        sex: filters.sex,
        hasNdis: filters.hasNdis ? filters.hasNdis === 'yes' : undefined,
        hasDisability: filters.hasDisability ? filters.hasDisability === 'yes' : undefined
      };

      const data = await getClients({
        search: searchTerm,
        filters: apiFilters,
        page: pagination.page,
        pageSize: pagination.pageSize
      });

      setClients(data.clients);
      setPagination(data.pagination);
      setError('');
    } catch (err) {
      setError('Failed to load clients');
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
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply sorting to clients
  const sortedClients = [...clients].sort((a : any, b : any) => {
    let aValue: any = a[sortField as keyof Client];
    let bValue: any = b[sortField as keyof Client];

    // Handle nested fields
    if (sortField.includes('.')) {
      const [parent, child] = sortField.split('.');
      aValue = a[parent as keyof Client]?.[child as any] || '';
      bValue = b[parent as keyof Client]?.[child as any] || '';
    }

    // Handle null values
    if (aValue === null) aValue = '';
    if (bValue === null) bValue = '';

    // Compare values
    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    }
  });


  useEffect(() => {
    console.log("Sorted Clients:", sortedClients);
  }, [sortedClients]);

  const handleDeleteClient = async (id: number) => {
  if (isDeleting) return;

  const confirmed = await confirm.confirm({
    title: "Delete Client",
    message: "Are you sure you want to delete this client? This will also delete all associated data.",
    confirmText: "Delete",
    cancelText: "Cancel",
    type: "danger",
  });

  if (!confirmed) return;

  try {
    setIsDeleting(true);
    await deleteClient(id);
    loadClients();
    setError('');
  } catch (err) {
    setError('Failed to delete client');
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
    setError('');
  } catch (err) {
    setError('Failed to delete selected clients');
    console.error(err);
  } finally {
    setIsDeleting(false);
  }
};


  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
    } else {
      setSelectedClients(sortedClients.map(client => client.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectClient = (id: number) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(clientId => clientId !== id));
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
      state: '',
      sex: '',
      hasNdis: '',
      hasDisability: ''
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

      console.log("query:",query.toString());
  
      const response = await fetch(`/api/clients/export?${query.toString()}`);

      console.log("response:",response);
  
      if (!response.ok) {
        throw new Error("Failed to download Excel");
      }
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `infinity_support_clients_${new Date().toISOString().split("T")[0]}.xlsx`;
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
  

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <FaUserFriends className="text-2xl sm:text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
                <p className="text-sm sm:text-base text-gray-600">Manage your clients and their information efficiently</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">{pagination.totalCount} Total Clients</span>
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
              <Link
                href="/admin/clients/create"
                className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold justify-center"
              >
                <FaUserPlus className="h-4 w-4" /> 
                Add New Client
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Actions and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-between">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search clients by name, email or phone..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base shadow-sm hover:shadow-md transition-shadow duration-200"
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
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaFilter className="h-4 w-4" /> 
                Filters
                {Object.values(filters).some(v => v !== '') && (
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                    {Object.values(filters).filter(v => v !== '').length}
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
                  className="flex items-center gap-2 px-6 py-4 border border-red-300 bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
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
                <h3 className="font-bold text-gray-900 text-lg">Filter Clients</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Reset All Filters
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => {
                      setFilters({ ...filters, state: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                  <select
                    value={filters.sex}
                    onChange={(e) => {
                      setFilters({ ...filters, sex: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All</option>
                    {sexOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Has NDIS Number</label>
                  <select
                    value={filters.hasNdis}
                    onChange={(e) => {
                      setFilters({ ...filters, hasNdis: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Has Disability</label>
                  <select
                    value={filters.hasDisability}
                    onChange={(e) => {
                      setFilters({ ...filters, hasDisability: e.target.value });
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                  <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Clients</h3>
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
                <div className="w-20 h-20 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Clients</h3>
                <p className="text-gray-600 font-medium">Please wait while we fetch your client data...</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          ) :
           (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded shadow-sm"
                          />
                        </div>
                      </th>
                      <th
                        className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {sortField === 'name' ? (
                            sortDirection === 'asc' ? <FaSortUp className="text-indigo-600" /> : <FaSortDown className="text-indigo-600" />
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          {sortField === 'email' ? (
                            sortDirection === 'asc' ? <FaSortUp className="text-indigo-600" /> : <FaSortDown className="text-indigo-600" />
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('phone')}
                      >
                        <div className="flex items-center gap-2">
                          Phone
                          {sortField === 'phone' ? (
                            sortDirection === 'asc' ? <FaSortUp className="text-indigo-600" /> : <FaSortDown className="text-indigo-600" />
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('commonFields.state')}
                      >
                        <div className="flex items-center gap-2">
                          State
                          {sortField === 'commonFields.state' ? (
                            sortDirection === 'asc' ? <FaSortUp className="text-indigo-600" /> : <FaSortDown className="text-indigo-600" />
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center gap-2">
                          Created At
                          {sortField === 'createdAt' ? (
                            sortDirection === 'asc' ? <FaSortUp className="text-indigo-600" /> : <FaSortDown className="text-indigo-600" />
                          ) : (
                            <FaSort className="text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="px-8 py-5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedClients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center">
                            <div className="p-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                              <FaUserFriends className="text-gray-400 text-4xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {searchTerm || Object.values(filters).some(v => v !== '') ? 
                                'No Clients Found' :
                                'No Clients Yet'}
                            </h3>
                            <p className="text-gray-500 font-medium mb-2 max-w-md text-center leading-relaxed">
                              {searchTerm || Object.values(filters).some(v => v !== '') ? 
                                'No clients match your current search criteria. Try adjusting your search terms or filters.' :
                                'You haven\'t added any clients yet. Start by creating your first client profile.'}
                            </p>
                            {(searchTerm || Object.values(filters).some(v => v !== '')) ? (
                              <button
                                onClick={() => {
                                  setSearchTerm('');
                                  resetFilters();
                                }}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                Clear All Filters
                              </button>
                            ) : (
                              <Link
                                href="/admin/clients/create"
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
                              >
                                <FaUserPlus className="h-4 w-4" />
                                Add Your First Client
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedClients.map((client : any, index) => (
                        <tr
                          key={client.id}
                          className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                          }}
                        >
                          <td className="px-8 py-6 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded shadow-sm"
                            />
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                <span className="font-bold text-white text-lg">
                                  {client?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-gray-900">{client.name}</div>
                                {client.commonFields[0]?.ndis && (
                                  <div className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-md mt-1">
                                    NDIS: {client.commonFields[0].ndis}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {client?.email ? (
                              <span className="text-sm font-medium text-gray-900">{client.email}</span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Not provided</span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {client?.phone ? (
                              <span className="text-sm font-medium text-gray-900">{client.phone}</span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Not provided</span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            {client?.commonFields[0]?.state ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                                {client.commonFields[0].state}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Not provided</span>
                            )}
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(client.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(client.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/clients/${client.id}`}
                                className="inline-flex items-center p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                title="View Client Details"
                              >
                                <FaEye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/clients/${client.id}/forms`}
                                className="inline-flex items-center p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                title="Manage Client Forms"
                              >
                                <FaFileAlt className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="inline-flex items-center p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                title="Delete Client"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination Controls */}
              <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <p className="text-sm font-medium text-gray-700">
                      Showing <span className="font-bold text-indigo-600">{sortedClients.length}</span> of{' '}
                      <span className="font-bold text-indigo-600">{pagination.totalCount}</span> clients
                    </p>
                    <div className="flex items-center gap-2">
                      <label htmlFor="pageSize" className="text-sm font-medium text-gray-600">
                        Show:
                      </label>
                      <select
                        id="pageSize"
                        value={pagination.pageSize}
                        onChange={handlePageSizeChange}
                        className="border border-gray-300 rounded-lg text-sm py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {/* Enhanced Pagination Navigation */}
                    <nav className="relative z-0 inline-flex rounded-xl shadow-lg -space-x-px bg-white" aria-label="Pagination">
                      {/* First Page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={!pagination.hasPreviousPage}
                        className={`relative inline-flex items-center px-3 py-2 rounded-l-xl border transition-all duration-200 ${
                          pagination.hasPreviousPage
                            ? 'border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                            : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span className="sr-only">First Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Previous Page */}
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPreviousPage}
                        className={`relative inline-flex items-center px-3 py-2 border transition-all duration-200 ${
                          pagination.hasPreviousPage
                            ? 'border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                            : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <FaChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        if (pageNum > 0 && pageNum <= pagination.totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border font-medium transition-all duration-200 ${
                                pagination.page === pageNum
                                  ? 'z-10 bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-500 text-white shadow-md'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}

                      {/* Next Page */}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className={`relative inline-flex items-center px-3 py-2 border transition-all duration-200 ${
                          pagination.hasNextPage
                            ? 'border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                            : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <FaChevronRight className="h-4 w-4" />
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={!pagination.hasNextPage}
                        className={`relative inline-flex items-center px-3 py-2 rounded-r-xl border transition-all duration-200 ${
                          pagination.hasNextPage
                            ? 'border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                            : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span className="sr-only">Last Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L15.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
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
