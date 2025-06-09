"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye, FaTrash, FaFileAlt, FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown, FaDownload, FaEllipsisV } from 'react-icons/fa';
import { getClients, deleteClient } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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

// Define filter state type
type FilterState = {
  state: string;
  sex: string;
  hasNdis: string;
  hasDisability: string;
};

export default function ClientsPage() {
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

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await getClients();
        setClients(data);
        setError('');
      } catch (err) {
        setError('Failed to load clients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

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
  const sortedClients = [...clients].sort((a, b) => {
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

  // Filter clients based on search term and filters
  const filteredClients = sortedClients.filter(client => {
    // Search filter
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // State filter
    if (filters.state && client.commonFields?.state !== filters.state) {
      return false;
    }
    
    // Sex filter
    if (filters.sex && client.commonFields?.sex !== filters.sex) {
      return false;
    }
    
    // NDIS filter
    if (filters.hasNdis) {
      const hasNdis = !!client.commonFields?.ndis;
      if (filters.hasNdis === 'yes' && !hasNdis) return false;
      if (filters.hasNdis === 'no' && hasNdis) return false;
    }
    
    // Disability filter
    if (filters.hasDisability) {
      const hasDisability = !!client.commonFields?.disability;
      if (filters.hasDisability === 'yes' && !hasDisability) return false;
      if (filters.hasDisability === 'no' && hasDisability) return false;
    }
    
    return true;
  });

  const handleDeleteClient = async (id: number) => {
    if (isDeleting) return;
    
    if (confirm('Are you sure you want to delete this client? This will also delete all associated data.')) {
      try {
        setIsDeleting(true);
        await deleteClient(id);
        setClients(clients.filter(client => client.id !== id));
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
        
        // Update the client list
        setClients(clients.filter(client => !selectedClients.includes(client.id)));
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
      setSelectedClients(filteredClients.map(client => client.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectClient = (id: number) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(clientId => clientId !== id));
      setSelectAll(false);
    } else {
      setSelectedClients([...selectedClients, id]);
      if (selectedClients.length + 1 === filteredClients.length) {
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
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'NDIS Number', 'State', 'Sex', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredClients.map(client => [
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Clients Management</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {selectedClients.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center text-sm"
              >
                <FaTrash className="mr-2" /> Delete Selected ({selectedClients.length})
              </button>
            )}
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center text-sm"
            >
              <FaDownload className="mr-2" /> Export to CSV
            </button>
            <Link 
              href="/admin/clients/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center text-sm"
            >
              <FaPlus className="mr-2" /> Add New Client
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search clients by name, email or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'} rounded-md`}
              >
                <FaFilter className="mr-2" /> Filters
                {Object.values(filters).some(v => v !== '') && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(filters).filter(v => v !== '').length}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Filter Clients</h3>
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset Filters
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => setFilters({...filters, state: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => setFilters({...filters, sex: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => setFilters({...filters, hasNdis: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => setFilters({...filters, hasDisability: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          {searchTerm || Object.values(filters).some(v => v !== '') ? 
                            'No clients found matching your search criteria.' : 
                            'No clients found. Add your first client!'}
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.email || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.phone || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {client.commonFields?.state || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {new Date(client.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Menu as="div" className="relative inline-block text-left">
                              <div>
                                <Menu.Button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none">
                                  <FaEllipsisV />
                                </Menu.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <Link 
                                          href={`/admin/clients/${client.id}`}
                                          className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                          } flex items-center px-4 py-2 text-sm`}
                                        >
                                          <FaEye className="mr-3 text-blue-600" /> View Details
                                        </Link>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <Link 
                                          href={`/admin/clients/${client.id}/edit`}
                                          className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                          } flex items-center px-4 py-2 text-sm`}
                                        >
                                          <FaEdit className="mr-3 text-yellow-600" /> Edit Client
                                        </Link>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <Link 
                                          href={`/admin/clients/${client.id}/forms`}
                                          className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                          } flex items-center px-4 py-2 text-sm`}
                                        >
                                          <FaFileAlt className="mr-3 text-green-600" /> Manage Forms
                                        </Link>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button 
                                          className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                          } flex items-center px-4 py-2 text-sm w-full text-left`}
                                          onClick={() => handleDeleteClient(client.id)}
                                        >
                                          <FaTrash className="mr-3 text-red-600" /> Delete Client
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredClients.length}</span> of{' '}
                    <span className="font-medium">{clients.length}</span> clients
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
