

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye, FaTrash, FaFileAlt, FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown, FaDownload, FaUserFriends, FaArrowLeft, FaUserPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getClients, deleteClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

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

  const handleDeleteClient = async (id: number) => {
    if (isDeleting) return;

    if (confirm('Are you sure you want to delete this client? This will also delete all associated data.')) {
      try {
        setIsDeleting(true);
        await deleteClient(id);
        // Reload clients after deletion
        loadClients();
        setError('');
      } catch (err) {
        setError('Failed to delete client');
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (isDeleting || selectedClients.length === 0) return;

    if (confirm(`Are you sure you want to delete ${selectedClients.length} selected clients? This will also delete all associated data.`)) {
      try {
        setIsDeleting(true);

        // Delete clients one by one
        for (const id of selectedClients) {
          await deleteClient(id);
        }

        // Reload clients after deletion
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

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'NDIS Number', 'State', 'Sex', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...sortedClients.map(client => [
        `"${client.name}"`,
        `"${client.email || ''}"`,
        `"${client.phone || ''}"`,
        `"${client.commonFields?.ndis || ''}"`,
        `"${client.commonFields?.state || ''}"`,
        `"${client.commonFields?.sex || ''}"`,
        `"${new Date(client.createdAt).toLocaleDateString()}"`,
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                <FaUserFriends className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clients Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your clients and their information</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition px-4 py-2 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50"
              >
                <FaArrowLeft className="mr-2" /> Back to Dashboard
              </Link>
              <Link
                href="/admin/clients/create"
                className="flex items-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg shadow-sm"
              >
                <FaUserPlus className="mr-2" /> Add New Client
              </Link>
            </div>
          </div>
        </div>

        {/* Actions and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clients by name, email or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border ${showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition`}
              >
                <FaFilter className="mr-2" /> Filters
                {Object.values(filters).some(v => v !== '') && (
                  <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(filters).filter(v => v !== '').length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition"
              >
                <FaDownload className="mr-2" /> Export
              </button>

              {selectedClients.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-2 border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition"
                >
                  <FaTrash className="mr-2" /> Delete ({selectedClients.length})
                </button>
              )}
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Filter Clients</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Reset Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => {
                      setFilters({ ...filters, state: e.target.value });
                      setPagination({ ...pagination, page: 1 }); // Reset to first page
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                  <select
                    value={filters.sex}
                    onChange={(e) => {
                      setFilters({ ...filters, sex: e.target.value });
                      setPagination({ ...pagination, page: 1 }); // Reset to first page
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    {sexOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Has NDIS Number</label>
                  <select
                    value={filters.hasNdis}
                    onChange={(e) => {
                      setFilters({ ...filters, hasNdis: e.target.value });
                      setPagination({ ...pagination, page: 1 }); // Reset to first page
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Has Disability</label>
                  <select
                    value={filters.hasDisability}
                    onChange={(e) => {
                      setFilters({ ...filters, hasDisability: e.target.value });
                      setPagination({ ...pagination, page: 1 }); // Reset to first page
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <button
                  onClick={() => loadClients()}
                  className="mt-1 text-sm font-medium underline hover:text-red-800"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin mx-auto"></div>
                <p className="mt-6 text-gray-600 font-medium">Loading clients...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Name
                          {sortField === 'name' ? (
                            sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center">
                          Email
                          {sortField === 'email' ? (
                            sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('phone')}
                      >
                        <div className="flex items-center">
                          Phone
                          {sortField === 'phone' ? (
                            sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('commonFields.state')}
                      >
                        <div className="flex items-center">
                          State
                          {sortField === 'commonFields.state' ? (
                            sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          Created At
                          {sortField === 'createdAt' ? (
                            sortDirection === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedClients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-full p-4 mb-4">
                              <FaUserFriends className="text-gray-400 text-2xl" />
                            </div>
                            <p className="text-gray-500 font-medium mb-1">
                              {searchTerm || Object.values(filters).some(v => v !== '') ? 
                                'No clients match your search criteria' :
                                'No clients found'}
                            </p>
                            <p className="text-sm text-gray-400">
                              {searchTerm || Object.values(filters).some(v => v !== '') ? 
                                'Try adjusting your search or filters' : 
                                'Add your first client to get started'}
                            </p>
                            {(searchTerm || Object.values(filters).some(v => v !== '')) && (
                              <button
                                onClick={() => {
                                  setSearchTerm('');
                                  resetFilters();
                                }}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                              >
                                Clear all filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedClients.map((client, index) => (
                        <tr
                          key={client.id}
                          className="hover:bg-indigo-50 transition"
                          style={{
                            animationDelay: `${index * 30}ms`,
                            animation: 'fadeIn 0.5s ease-in-out forwards'
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-indigo-600">
                                  {client?.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                {client.commonFields?.ndis && (
                                  <div className="text-xs text-gray-500">NDIS: {client.commonFields.ndis}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client?.email ? (
                              <span className="text-sm text-gray-900">{client.email}</span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client?.phone ? (
                              <span className="text-sm text-gray-900">{client.phone}</span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client?.commonFields?.state ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {client.commonFields.state}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(client.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/admin/clients/${client.id}`}
                                className="inline-flex items-center p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition"
                                title="View Client"
                              >
                                <FaEye />
                              </Link>
                              <Link
                                href={`/admin/clients/${client.id}/forms`}
                                className="inline-flex items-center p-1.5 text-green-600 hover:bg-green-100 rounded-md transition"
                                title="Client Forms"
                              >
                                <FaFileAlt />
                              </Link>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="inline-flex items-center p-1.5 text-red-600 hover:bg-red-100 rounded-md transition"
                                title="Delete Client"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <p className="text-sm text-gray-700 mr-4">
                      Showing <span className="font-medium">{sortedClients.length}</span> of{' '}
                      <span className="font-medium">{pagination.totalCount}</span> clients
                    </p>
                    <div className="flex items-center">
                      <label htmlFor="pageSize" className="text-sm text-gray-600 mr-2">
                        Show:
                      </label>
                      <select
                        id="pageSize"
                        value={pagination.pageSize}
                        onChange={handlePageSizeChange}
                        className="border border-gray-300 rounded-md text-sm py-1 pl-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`px-2 py-1 border rounded-md ${
                        pagination.hasPreviousPage
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      title="First Page"
                    >
                      <span className="sr-only">First Page</span>
                      <FaChevronLeft className="h-3 w-3" />
                      <FaChevronLeft className="h-3 w-3 -ml-1" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`px-2 py-1 border rounded-md ${
                        pagination.hasPreviousPage
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      title="Previous Page"
                    >
                      <span className="sr-only">Previous Page</span>
                      <FaChevronLeft className="h-3 w-3" />
                    </button>

                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{pagination.page}</span> of{' '}
                      <span className="font-medium">{pagination.totalPages}</span>
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`px-2 py-1 border rounded-md ${
                        pagination.hasNextPage
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      title="Next Page"
                    >
                      <span className="sr-only">Next Page</span>
                      <FaChevronRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={!pagination.hasNextPage}
                      className={`px-2 py-1 border rounded-md ${
                        pagination.hasNextPage
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      title="Last Page"
                    >
                      <span className="sr-only">Last Page</span>
                      <FaChevronRight className="h-3 w-3" />
                      <FaChevronRight className="h-3 w-3 -ml-1" />
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
