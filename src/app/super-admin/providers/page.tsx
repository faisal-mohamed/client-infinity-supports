'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaBuilding, FaPlus, FaSearch, FaSpinner, FaChevronRight } from 'react-icons/fa';

interface Organization {
  id: string;
  name: string;
  tradingName?: string;
  abn: string;
  status: string;
  primaryContactName: string;
  primaryContactEmail: string;
  registrationType: string;
  createdAt: string;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'badge badge-yellow' },
  VERIFYING: { label: 'Verifying', className: 'badge badge-blue' },
  ACTIVE: { label: 'Active', className: 'badge badge-green' },
  SUSPENDED: { label: 'Suspended', className: 'badge badge-red' },
  DEACTIVATED: { label: 'Deactivated', className: 'badge badge-gray' },
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/super-admin/providers?${params}`);
    const data = await res.json();
    setProviders(data.items || []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const filtered = providers.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
      p.abn.includes(q) ||
      p.primaryContactEmail.toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azure-700">Providers</h1>
          <p className="text-sm text-azure-400 mt-1">Manage NDIS provider organizations</p>
        </div>
        <Link href="/super-admin/providers/onboard" className="btn btn-gold">
          <FaPlus className="w-3.5 h-3.5 mr-2" />
          Onboard Provider
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-azure-300" />
            <input
              type="text"
              placeholder="Search by name, ABN, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-azure-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFYING">Verifying</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <FaSpinner className="w-5 h-5 text-azure-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <FaBuilding className="w-10 h-10 text-azure-200 mx-auto mb-3" />
            <p className="text-azure-400 text-sm">No providers found</p>
          </div>
        </div>
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>ABN</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const badge = STATUS_BADGES[p.status] || STATUS_BADGES.PENDING;
                return (
                  <tr key={p.id} className="hover:bg-azure-50/50 transition-colors">
                    <td>
                      <div>
                        <p className="font-medium text-azure-700">{p.name}</p>
                        {p.tradingName && <p className="text-xs text-azure-400">{p.tradingName}</p>}
                      </div>
                    </td>
                    <td className="font-mono text-xs">{p.abn}</td>
                    <td>
                      <p className="text-sm">{p.primaryContactName}</p>
                      <p className="text-xs text-azure-400">{p.primaryContactEmail}</p>
                    </td>
                    <td>
                      <span className="text-xs capitalize">{p.registrationType}</span>
                    </td>
                    <td>
                      <span className={badge.className}>{badge.label}</span>
                    </td>
                    <td>
                      <Link
                        href={`/super-admin/providers/${p.id}`}
                        className="p-2 rounded-lg hover:bg-azure-50 text-azure-400 hover:text-azure-700 transition-colors inline-flex"
                      >
                        <FaChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
